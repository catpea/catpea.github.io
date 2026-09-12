# Native Worker Threads Pattern for Multiple Operations

Here's a comprehensive pattern for handling different operations (HTML generation, file copying, asset optimization, etc.) using native Worker Threads:

## **Main Build Script**

```javascript
// build.js
import { Worker } from 'worker_threads';
import { cpus } from 'os';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';

class WorkerPool {
  constructor(workerScript, numWorkers = cpus().length) {
    this.workers = [];
    this.taskQueue = [];
    this.activeWorkers = 0;

    // Create worker pool
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerScript);
      this.workers.push({
        worker,
        busy: false,
        id: i
      });

      worker.on('message', (result) => this.handleResult(i, result));
      worker.on('error', (error) => this.handleError(i, error));
    }
  }

  async run(task) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  processQueue() {
    if (this.taskQueue.length === 0) return;

    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;

    const { task, resolve, reject } = this.taskQueue.shift();
    availableWorker.busy = true;
    availableWorker.currentTask = { resolve, reject };
    availableWorker.worker.postMessage(task);
    this.activeWorkers++;
  }

  handleResult(workerId, result) {
    const worker = this.workers[workerId];
    worker.busy = false;
    this.activeWorkers--;

    if (result.error) {
      worker.currentTask.reject(new Error(result.error));
    } else {
      worker.currentTask.resolve(result);
    }

    this.processQueue();
  }

  handleError(workerId, error) {
    const worker = this.workers[workerId];
    worker.busy = false;
    this.activeWorkers--;
    worker.currentTask.reject(error);
    this.processQueue();
  }

  async destroy() {
    await Promise.all(this.workers.map(w => w.worker.terminate()));
  }
}

// Gather all tasks
async function gatherTasks() {
  const tasks = [];

  // Task 1: Generate HTML from JSON posts
  const posts = await readdir('./content/posts');
  for (const post of posts.filter(f => f.endsWith('.json'))) {
    tasks.push({
      type: 'generate-html',
      input: path.join('./content/posts', post),
      output: path.join('./dist/posts', post.replace('.json', '.html')),
      template: './templates/post.html'
    });
  }

  // Task 2: Generate index pages
  tasks.push({
    type: 'generate-index',
    input: './content/posts',
    output: './dist/index.html',
    template: './templates/index.html'
  });

  // Task 3: Copy static assets
  const assets = await readdir('./static', { recursive: true });
  for (const asset of assets) {
    const sourcePath = path.join('./static', asset);
    tasks.push({
      type: 'copy-file',
      input: sourcePath,
      output: path.join('./dist', asset)
    });
  }

  // Task 4: Optimize images
  const images = await readdir('./images');
  for (const img of images.filter(f => /\.(jpg|png|jpeg)$/.test(f))) {
    tasks.push({
      type: 'optimize-image',
      input: path.join('./images', img),
      output: path.join('./dist/images', img),
      quality: 80
    });
  }

  // Task 5: Generate RSS feed
  tasks.push({
    type: 'generate-rss',
    input: './content/posts',
    output: './dist/feed.xml'
  });

  // Task 6: Generate sitemap
  tasks.push({
    type: 'generate-sitemap',
    input: './content/posts',
    output: './dist/sitemap.xml',
    baseUrl: 'https://example.com'
  });

  return tasks;
}

// Main build function
async function build() {
  console.log('🚀 Starting build...');
  const startTime = Date.now();

  // Ensure output directory exists
  await mkdir('./dist', { recursive: true });
  await mkdir('./dist/posts', { recursive: true });
  await mkdir('./dist/images', { recursive: true });

  // Gather all tasks
  const tasks = await gatherTasks();
  console.log(`📋 Found ${tasks.length} tasks to process`);

  // Create worker pool
  const pool = new WorkerPool('./worker.js');

  // Process all tasks
  const results = await Promise.allSettled(
    tasks.map(task => pool.run(task))
  );

  // Report results
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`✅ Succeeded: ${succeeded}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nErrors:');
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.log(`  ${tasks[i].type}: ${r.reason.message}`);
      }
    });
  }

  await pool.destroy();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n⏱️  Build completed in ${duration}s`);
}

build().catch(console.error);
```

## **Worker Script (Handles All Operation Types)**

```javascript
// worker.js
import { parentPort } from 'worker_threads';
import { readFile, writeFile, copyFile, mkdir } from 'fs/promises';
import path from 'path';

// Operation handlers
const operations = {
  'generate-html': generateHTML,
  'generate-index': generateIndex,
  'copy-file': copyFileOp,
  'optimize-image': optimizeImage,
  'generate-rss': generateRSS,
  'generate-sitemap': generateSitemap
};

// Main message handler
parentPort.on('message', async (task) => {
  try {
    const handler = operations[task.type];

    if (!handler) {
      throw new Error(`Unknown task type: ${task.type}`);
    }

    const result = await handler(task);

    parentPort.postMessage({
      success: true,
      type: task.type,
      output: task.output,
      ...result
    });
  } catch (error) {
    parentPort.postMessage({
      success: false,
      error: error.message,
      type: task.type,
      input: task.input
    });
  }
});

// Generate HTML from JSON
async function generateHTML(task) {
  const json = await readFile(task.input, 'utf8');
  const data = JSON.parse(json);
  const template = await readFile(task.template, 'utf8');

  // Simple template replacement
  let html = template
    .replace('{{title}}', escapeHtml(data.title))
    .replace('{{content}}', data.content)
    .replace('{{date}}', new Date(data.date).toLocaleDateString())
    .replace('{{author}}', escapeHtml(data.author || 'Anonymous'));

  await mkdir(path.dirname(task.output), { recursive: true });
  await writeFile(task.output, html, 'utf8');

  return { bytes: html.length };
}

// Generate index page
async function generateIndex(task) {
  const files = await readdir(task.input);
  const posts = [];

  for (const file of files.filter(f => f.endsWith('.json'))) {
    const content = await readFile(path.join(task.input, file), 'utf8');
    const data = JSON.parse(content);
    posts.push({
      title: data.title,
      date: data.date,
      slug: file.replace('.json', ''),
      excerpt: data.excerpt || data.content.substring(0, 200)
    });
  }

  // Sort by date
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const template = await readFile(task.template, 'utf8');

  const postsList = posts.map(p => `
    <article>
      <h2><a href="/posts/${p.slug}.html">${escapeHtml(p.title)}</a></h2>
      <time>${new Date(p.date).toLocaleDateString()}</time>
      <p>${escapeHtml(p.excerpt)}</p>
    </article>
  `).join('\n');

  const html = template.replace('{{posts}}', postsList);

  await writeFile(task.output, html, 'utf8');

  return { postsCount: posts.length };
}

// Copy file operation
async function copyFileOp(task) {
  await mkdir(path.dirname(task.output), { recursive: true });
  await copyFile(task.input, task.output);

  const stats = await stat(task.output);
  return { bytes: stats.size };
}

// Optimize image (simplified - you can add sharp or other libraries)
async function optimizeImage(task) {
  // For now, just copy - in production you'd use sharp or similar
  await mkdir(path.dirname(task.output), { recursive: true });
  await copyFile(task.input, task.output);

  // TODO: Add actual image optimization
  // const sharp = require('sharp');
  // await sharp(task.input)
  //   .jpeg({ quality: task.quality })
  //   .toFile(task.output);

  return { optimized: true };
}

// Generate RSS feed
async function generateRSS(task) {
  const files = await readdir(task.input);
  const posts = [];

  for (const file of files.filter(f => f.endsWith('.json'))) {
    const content = await readFile(path.join(task.input, file), 'utf8');
    const data = JSON.parse(content);
    posts.push({
      title: data.title,
      date: data.date,
      slug: file.replace('.json', ''),
      content: data.content
    });
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    <link>https://example.com</link>
    <description>My awesome blog</description>
    ${posts.map(p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://example.com/posts/${p.slug}.html</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.content.substring(0, 200))}</description>
    </item>`).join('\n')}
  </channel>
</rss>`;

  await writeFile(task.output, rss, 'utf8');

  return { itemsCount: posts.length };
}

// Generate sitemap
async function generateSitemap(task) {
  const files = await readdir(task.input);
  const posts = [];

  for (const file of files.filter(f => f.endsWith('.json'))) {
    const content = await readFile(path.join(task.input, file), 'utf8');
    const data = JSON.parse(content);
    posts.push({
      slug: file.replace('.json', ''),
      date: data.date
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${task.baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts.map(p => `
  <url>
    <loc>${task.baseUrl}/posts/${p.slug}.html</loc>
    <lastmod>${new Date(p.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  await writeFile(task.output, sitemap, 'utf8');

  return { urlsCount: posts.length + 1 };
}

// Utilities
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Import missing functions
import { readdir, stat } from 'fs/promises';
```

## **Example Templates**

```html
<!-- templates/post.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <article>
    <h1>{{title}}</h1>
    <p class="meta">By {{author}} on {{date}}</p>
    <div class="content">
      {{content}}
    </div>
  </article>
</body>
</html>
```

```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Blog</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Recent Posts</h1>
  {{posts}}
</body>
</html>
```

## **Progress Tracking Enhancement**

```javascript
// Add to build.js for real-time progress
async function buildWithProgress() {
  const tasks = await gatherTasks();
  const pool = new WorkerPool('./worker.js');

  let completed = 0;
  const startTime = Date.now();

  const taskPromises = tasks.map(task =>
    pool.run(task).then(result => {
      completed++;
      const progress = ((completed / tasks.length) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r⚡ Progress: ${progress}% (${completed}/${tasks.length}) - ${elapsed}s`);
      return result;
    })
  );

  const results = await Promise.allSettled(taskPromises);
  console.log('\n');

  await pool.destroy();
  return results;
}
```

This pattern gives you:
- ✅ Multiple operation types in one worker
- ✅ Reusable worker pool
- ✅ Error handling per task
- ✅ Progress tracking
- ✅ Efficient CPU utilization
- ✅ Easy to extend with new operations

Just add new handlers to the `operations` object in the worker!
