// you can run this file with `node example.js`

// === THE NODE FACTORY ===
function createNode(name, fn) {
  const outputs = new Set()
  function send(packet) {
    for (const out of outputs) out(packet)
  }
  function input(packet) {
    fn(packet, send)
  }
  input.connect = next => {
    outputs.add(next)
    return next
  }
  input.name = name
  return input
}




// === PUSH SIDE: user request flows to queue ===
const queue = []; // <- it is just a happy little arry

//NOTE THE *send* in the funcion


const userRequest = createNode('user-request', (packet, send) => {
  send({ action: 'prompt', userId: packet.userId, prompt: packet.prompt })
})

const addToQueue = createNode('add-to-queue', (packet, send) => {
  if (packet.action !== 'prompt') return
  queue.push(packet)
  console.log(`📥 Queued: ${packet.userId} asks "${packet.prompt}"`)
})

// pay attention to the complexity/size of userRequest and addToQueue AI WILL NEVER EVER GET CONFUSED! Lol, the whole industry is using AI wrong! What a bunch of nerds.


// wire the push flow
userRequest.connect(addToQueue)
// NOTE: make some more funcions like above, you can keep connecting
// note the  const outputs = new Set() in createNode you can add multiple connectioins, to the same parent! it is a tree, 15 lines of code lol!




// === PULL SIDE: pull from queue, await AI, send to inbox ===
async function* pullFrom(queue) {
  while (queue.length > 0) {
    yield queue.shift()
  }
}

async function askAI(prompt) {
  await new Promise(r => setTimeout(r, 1000))
  return `AI response to "${prompt}"`
}


// MAIN PULL PART (await word)
async function processQueue() {
  for await (const request of pullFrom(queue)) {
    console.log(`⚙️  Processing: ${request.userId}...`)
    const response = await askAI(request.prompt)
    console.log(`📬 ${request.userId}'s inbox:`, response)
  }
}




// === DEMO ===
// users push requests (fast, uncontrolled)
userRequest({ userId: 'alice', prompt: 'write a poem' })
userRequest({ userId: 'bob', prompt: 'explain gravity' })
userRequest({ userId: 'carol', prompt: 'draw a cat' })

console.log('---')

// we pull and process (slow, controlled)
processQueue()
