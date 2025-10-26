# High-Performance Static Site Generator Strategies for Node.js v25

Here are the most effective approaches for processing 2,000+ JSON files efficiently on limited hardware:

## 1. **Worker Threads with Piscina (Preferred for CPU-bound tasks)**

Worker threads are lighter than cluster for file processing:

```javascript
import Piscina from 'piscina';
import { cpus } from 'os';

const pool = new Piscina({
  filename: new URL('./worker.js', import.meta.url).href,
  maxThreads: cpus().length
});

// Main file
async function processAllPosts(files) {
  const results = await Promise.all(
    files.map(file => pool.run(file))
  );
  return results;
}
```

```javascript
// worker.js
export default async function(filepath) {
  const data = await fs.readFile(filepath, 'utf8');
  const parsed = JSON.parse(data);
  // Transform your post here
  return transformPost(parsed);
}
```

## 2. **Async Generators for Memory-Efficient Streaming**

```javascript
import { readdir } from 'fs/promises';
import { readFile } from 'fs/promises';
import path from 'path';

async function* postGenerator(directory) {
  const files = await readdir(directory);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filepath = path.join(directory, file);
      const content = await readFile(filepath, 'utf8');
      yield { file, data: JSON.parse(content) };
    }
  }
}

// Usage with for await...of
for await (const post of postGenerator('./posts')) {
  console.log(`Processing ${post.file}`);
  // Process each post
}
```

## 3. **Batched Async Iteration with Concurrency Control**

```javascript
async function* batchedProcess(items, batchSize) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    yield await Promise.all(batch.map(processItem));
  }
}

// Process in batches of 50
for await (const results of batchedProcess(files, 50)) {
  console.log(`Completed batch of ${results.length}`);
}
```

## 4. **Controlled Parallelism with p-limit Pattern**

```javascript
import pLimit from 'p-limit';
import { readdir, readFile } from 'fs/promises';

async function processWithLimit(directory, concurrency = 10) {
  const limit = pLimit(concurrency);
  const files = await readdir(directory);

  const tasks = files.map(file =>
    limit(async () => {
      const data = await readFile(path.join(directory, file), 'utf8');
      return processPost(JSON.parse(data));
    })
  );

  return await Promise.allSettled(tasks);
}
```

## 5. **Native Worker Threads Without Libraries**

```javascript
// main.js
import { Worker } from 'worker_threads';
import { cpus } from 'os';

function distributeWork(files) {
  const numWorkers = cpus().length;
  const chunkSize = Math.ceil(files.length / numWorkers);
  const workers = [];

  for (let i = 0; i < numWorkers; i++) {
    const chunk = files.slice(i * chunkSize, (i + 1) * chunkSize);

    const worker = new Worker('./processor.js', {
      workerData: { files: chunk }
    });

    workers.push(new Promise((resolve, reject) => {
      worker.on('message', resolve);
      worker.on('error', reject);
    }));
  }

  return Promise.all(workers);
}
```

```javascript
// processor.js
import { parentPort, workerData } from 'worker_threads';
import { readFile } from 'fs/promises';

async function processFiles() {
  const results = [];

  for (const file of workerData.files) {
    const data = await readFile(file, 'utf8');
    results.push(transform(JSON.parse(data)));
  }

  parentPort.postMessage(results);
}

processFiles();
```

## 6. **Streaming with AsyncIterator Helpers (Node v22+)**

```javascript
import { opendir } from 'fs/promises';

async function* walkDirectory(dir) {
  const dirHandle = await opendir(dir);
  for await (const dirent of dirHandle) {
    if (dirent.isFile() && dirent.name.endsWith('.json')) {
      yield path.join(dir, dirent.name);
    }
  }
}

// Chain async operations
const processed = walkDirectory('./posts')
  .map(async file => {
    const content = await readFile(file, 'utf8');
    return JSON.parse(content);
  })
  .filter(post => post.published)
  .take(100); // Limit results

for await (const post of processed) {
  // Process
}
```

## 7. **Optimized File Reading Pattern**

```javascript
import { readFile } from 'fs/promises';

// Read all files in parallel with controlled concurrency
async function bulkRead(files, concurrency = 50) {
  const results = [];

  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async file => {
        try {
          const data = await readFile(file, 'utf8');
          return { file, data: JSON.parse(data), error: null };
        } catch (error) {
          return { file, data: null, error };
        }
      })
    );
    results.push(...batchResults);
  }

  return results;
}
```

## **Recommended Architecture for Raspberry Pi:**

```javascript
import Piscina from 'piscina';
import { cpus } from 'os';
import { readdir } from 'fs/promises';
import path from 'path';

const BATCH_SIZE = 100; // Tune for your Pi's memory

async function buildSite() {
  // Step 1: Discover all files
  const files = (await readdir('./content'))
    .filter(f => f.endsWith('.json'))
    .map(f => path.join('./content', f));

  // Step 2: Create worker pool
  const pool = new Piscina({
    filename: './build-worker.js',
    maxThreads: cpus().length,
    maxQueue: 'auto'
  });

  // Step 3: Process in batches
  const allResults = [];
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(file => pool.run(file))
    );
    allResults.push(...results);
    console.log(`Processed ${i + batch.length}/${files.length}`);
  }

  await pool.destroy();
  return allResults;
}

buildSite().then(results => {
  console.log(`Built ${results.length} pages`);
});
```

## **Key Performance Tips for Raspberry Pi:**

1. **Use `--max-old-space-size`** to limit memory: `node --max-old-space-size=512 build.js`
2. **Batch processing** prevents memory exhaustion
3. **Worker threads** > cluster module for I/O-heavy tasks
4. **Avoid blocking operations** in the main thread
5. **Cache parsed results** if rebuilding frequently
6. **Use `Promise.allSettled`** over `Promise.all` for resilience
7. **Monitor with `process.memoryUsage()`** to tune batch sizes

The **worker threads + batching approach** will give you the best balance of speed and stability on a Raspberry Pi.
