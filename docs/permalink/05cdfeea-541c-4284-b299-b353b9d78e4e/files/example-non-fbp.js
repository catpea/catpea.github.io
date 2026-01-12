// PUSH: Users send requests, we queue them
const queue = []

function handleUserRequest(userId, prompt) {
  queue.push({ userId, prompt })
  // that's it, we just pushed to the warehouse
}

// PULL: We pull from queue, await AI, send to inbox
async function processQueue() {
  for await (const request of pullFrom(queue)) {
    const response = await askAI(request.prompt)
    sendToInbox(request.userId, response)
  }
}

// --- the helpers ---

async function* pullFrom(queue) {
  while (true) {
    if (queue.length > 0) yield queue.shift()
    else await sleep(100)
  }
}

async function askAI(prompt) {
  await sleep(2000) // AI thinking...
  return `Dear user, regarding "${prompt}" — here is wisdom.`
}

function sendToInbox(userId, message) {
  console.log(`📬 User ${userId}'s inbox:`, message)
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// --- simulate users pushing requests ---
handleUserRequest('alice', 'write me a poem')
handleUserRequest('bob', 'explain gravity')
handleUserRequest('carol', 'draw a cat')

// --- start pulling and processing ---
processQueue()
