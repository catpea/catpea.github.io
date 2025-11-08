#!/usr/bin/env node

// Blog Generator - A minimal tool for learning JavaScript by building your own blog
// This shows beginners how to work with files, directories, and command-line arguments

const fs = require('fs');      // File system operations (reading/writing files)
const path = require('path');  // Handle file paths across different operating systems

// Main BlogGenerator class - Object-Oriented Programming keeps code organized
class BlogGenerator {

  constructor() {
    // Where we store our blog posts (post-0001, post-0002, etc.)
    this.postsDirectory = 'posts';
    // Where the final HTML files go
    this.outputDirectory = 'blog';
  }

  // Creates a new blog post with template files
  createNewPost() {
    // Make sure the posts directory exists
    if (!fs.existsSync(this.postsDirectory)) {
      fs.mkdirSync(this.postsDirectory);
      console.log('Created posts directory');
    }

    // Find what number comes next (post-0001, post-0002, etc.)
    const existingPosts = fs.readdirSync(this.postsDirectory)
      .filter(name => name.startsWith('post-'))  // Only look at post folders
      .map(name => parseInt(name.split('-')[1]))  // Get the number part
      .filter(num => !isNaN(num));                // Make sure it's a valid number

    // If no posts exist, start at 1. Otherwise, take the highest number and add 1
    const nextPostNumber = existingPosts.length > 0 ? Math.max(...existingPosts) + 1 : 1;

    // Create folder name with leading zeros (post-0001, post-0002)
    const postFolderName = `post-${String(nextPostNumber).padStart(4, '0')}`;
    const postFolderPath = path.join(this.postsDirectory, postFolderName);

    // Create the new post folder
    fs.mkdirSync(postFolderPath);

    // Create config.json - stores title, date, tags, and draft status
    const configData = {
      title: 'My New Blog Post',
      date: new Date().toISOString().split('T')[0],  // Today's date (YYYY-MM-DD)
      tags: ['blog', 'learning'],
      draft: false  // Set to true to hide from published blog
    };

    fs.writeFileSync(
      path.join(postFolderPath, 'config.json'),
      JSON.stringify(configData, null, 2)  // Pretty print with 2-space indentation
    );

    // Create post.txt - your blog content goes here
    const templateContent = `This is your first paragraph. Write your thoughts here.

This is your second paragraph. Each blank line creates a new paragraph.

Keep writing your amazing content!`;

    fs.writeFileSync(
      path.join(postFolderPath, 'post.txt'),
      templateContent
    );

    console.log(`\n✓ Created new post: ${postFolderName}`);
    console.log(`  → Edit ${postFolderName}/config.json to set the title`);
    console.log(`  → Edit ${postFolderName}/post.txt to write your content`);
    console.log(`  → Run "node blog.js build" when ready to publish\n`);
  }

  // Converts plain text to HTML paragraphs
  convertTextToHtml(textContent) {
    return textContent
      .split('\n\n')                    // Split by blank lines
      .map(para => para.trim())         // Remove extra whitespace
      .filter(para => para.length > 0)  // Skip empty paragraphs
      .map(para => `    <p>${para.replace(/\n/g, ' ')}</p>`)  // Wrap in <p> tags
      .join('\n');
  }

  // Generates a complete HTML page for one blog post
  generatePostHtml(postFolderPath) {
    // Read the config and content files
    const configPath = path.join(postFolderPath, 'config.json');
    const postTextPath = path.join(postFolderPath, 'post.txt');

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const postText = fs.readFileSync(postTextPath, 'utf8');

    // Convert plain text to HTML paragraphs
    const htmlParagraphs = this.convertTextToHtml(postText);

    // Build the complete HTML page using template strings
    // Notice: No CSS framework needed - just color-scheme for dark mode support!
    const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    :root { color-scheme: light dark; }
    body { max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif; line-height: 1.6; }
  </style>
</head>
<body>
  <header>
    <h1>${config.title}</h1>
    <p><small>Published: ${config.date}</small></p>
    <p><a href="index.html">← Back to all posts</a></p>
  </header>
  <article>
${htmlParagraphs}
  </article>
</body>
</html>`;

    return {
      html: completeHtml,
      config: config,
      folderName: path.basename(postFolderPath)
    };
  }

  // Builds the entire blog - transforms posts and creates index
  build() {
    console.log('\nBuilding your blog...\n');

    // Create output directory for generated HTML
    if (!fs.existsSync(this.outputDirectory)) {
      fs.mkdirSync(this.outputDirectory);
    }

    // Check if posts directory exists
    if (!fs.existsSync(this.postsDirectory)) {
      console.log('⚠ No posts directory found.');
      console.log('Create your first post with: node blog.js new\n');
      return;
    }

    // Get all post folders (post-0001, post-0002, etc.)
    const allPostFolders = fs.readdirSync(this.postsDirectory)
      .filter(name => name.startsWith('post-'))
      .map(name => path.join(this.postsDirectory, name))
      .filter(folderPath => fs.statSync(folderPath).isDirectory());

    if (allPostFolders.length === 0) {
      console.log('⚠ No posts found.');
      console.log('Create your first post with: node blog.js new\n');
      return;
    }

    // Process each post and collect metadata for the index
    const publishedPosts = [];

    for (const postFolder of allPostFolders) {
      try {
        const postData = this.generatePostHtml(postFolder);

        // Skip posts marked as drafts
        if (postData.config.draft) {
          console.log(`⊘ Skipping draft: ${postData.folderName}`);
          continue;
        }

        // Save the HTML file
        const outputFilename = `${postData.folderName}.html`;
        const outputPath = path.join(this.outputDirectory, outputFilename);
        fs.writeFileSync(outputPath, postData.html);

        console.log(`✓ Generated: ${outputFilename}`);

        // Remember this post for the index page
        publishedPosts.push({
          title: postData.config.title,
          date: postData.config.date,
          filename: outputFilename
        });

      } catch (error) {
        console.error(`✗ Error processing ${postFolder}: ${error.message}`);
      }
    }

    // Sort posts by date (newest first)
    publishedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create the index page that lists all posts
    this.generateIndexPage(publishedPosts);
  }

  // Creates index.html with a simple list of all posts
  generateIndexPage(publishedPosts) {
    // Build the list of posts using UL/LI (nice and simple!)
    const postsListHtml = publishedPosts
      .map(post => `    <li><a href="${post.filename}">${post.title}</a> <small>(${post.date})</small></li>`)
      .join('\n');

    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Blog</title>
  <style>
    :root { color-scheme: light dark; }
    body { max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif; line-height: 1.6; }
    ul { list-style: none; padding: 0; }
    li { margin: 15px 0; }
  </style>
</head>
<body>
  <header>
    <h1>My Blog</h1>
    <p>Learning JavaScript by making my own blog generator!</p>
  </header>
  <main>
    <h2>All Posts</h2>
    <ul>
${postsListHtml}
    </ul>
  </main>
</body>
</html>`;

    fs.writeFileSync(path.join(this.outputDirectory, 'index.html'), indexHtml);
    console.log(`✓ Generated: index.html`);
    console.log(`\n🎉 Your blog is ready!`);
    console.log(`   Open ${this.outputDirectory}/index.html in your browser.\n`);
  }

  // Shows help information
  showHelp() {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Blog Generator - Learn JavaScript by making your blog!   ║
╚═══════════════════════════════════════════════════════════╝

Usage:
  node blog.js new      Create a new blog post
  node blog.js build    Transform posts into HTML pages
  node blog.js help     Show this help message

Getting Started:
  1. Run "node blog.js new" to create your first post
  2. Edit the config.json file to set the title
  3. Write your content in post.txt
  4. Run "node blog.js build" to generate your blog
  5. Open blog/index.html in your browser

How It Works:
  • Posts are stored in numbered folders (post-0001, post-0002)
  • Each post has config.json (metadata) and post.txt (content)
  • The build command transforms your posts into HTML
  • One simple index.html lists all your posts with UL/LI
  • No database needed - just files and folders!
  • No CSS frameworks - just clean HTML with color-scheme

Customization Tips:
  • Edit the HTML templates in this file to change the design
  • Add more fields to config.json (author, tags, etc.)
  • Modify the CSS in the <style> tags for your own look
  • Experiment and make it yours - that's how you learn!

Happy blogging! 🚀
`);
  }
}

// ═══════════════════════════════════════════════════════════
// Main Program - This is where execution starts
// ═══════════════════════════════════════════════════════════

// Create an instance of our BlogGenerator class
const blog = new BlogGenerator();

// Get the command from the command line arguments
// process.argv[0] is "node", process.argv[1] is "blog.js"
// process.argv[2] is the first argument we care about (new, build, help)
const command = process.argv[2];

// Parse command line arguments - this is simpler than you think!
// Just check what command the user typed and call the right method
if (command === 'new') {
  blog.createNewPost();
} else if (command === 'build') {
  blog.build();
} else if (command === 'help') {
  blog.showHelp();
} else {
  // If no command or unknown command, show help
  blog.showHelp();
}
