# Advanced JavaScript Programming Guide
*A Beginner-Friendly Introduction to Sophisticated Programming Patterns*

---

## Table of Contents
1. [Understanding JavaScript's `.reduce()` Method](#understanding-reduce)
2. [Finite State Machines with `.reduce()`](#finite-state-machines)
3. [Nested Data Structures and Design Patterns](#nested-patterns)
4. [Classic AI Algorithms in JavaScript](#ai-algorithms)
5. [Decision Trees and Rule-Based Systems](#decision-systems)
6. [Simple Neural Networks](#neural-networks)

---

## Understanding JavaScript's `.reduce()` Method {#understanding-reduce}

The `.reduce()` method in JavaScript is a powerful function that allows you to process an array and reduce it to a single value. This can be particularly useful for tasks like summing numbers, flattening arrays, or even building objects.

### Basic Syntax

```javascript
array.reduce((accumulator, currentValue, index, array) => {
    // Your logic here
}, initialValue);
```

**Parameters:**
- **`accumulator`**: The accumulated value returned after each iteration
- **`currentValue`**: The current element being processed
- **`index`** (optional): The index of the current element
- **`array`** (optional): The original array
- **`initialValue`** (optional): Starting value for the accumulator

### How It Works

1. **Initialization**: Starts with the first element (or `initialValue` if provided)
2. **Iteration**: Applies the function to accumulator and current value
3. **Update**: Result becomes the new accumulator
4. **Final Result**: Returns the final accumulator value

### Example: Summing Numbers

```javascript
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
}, 0);

console.log(sum); // Output: 15
```

**Step-by-step breakdown:**
- Start: accumulator = 0
- Step 1: 0 + 1 = 1
- Step 2: 1 + 2 = 3
- Step 3: 3 + 3 = 6
- Step 4: 6 + 4 = 10
- Step 5: 10 + 5 = 15

---

## Finite State Machines with `.reduce()` {#finite-state-machines}

State machines are elegant ways to model systems that change states based on inputs. Here's how to build them using `.reduce()`.

### Problem Setup

Imagine processing a list of numbers where your state changes based on whether each number is even or odd:
- Start in state: `"START"`
- Even number → go to `"EVEN"`
- Odd number → go to `"ODD"`

### Basic State Tracking

```javascript
const numbers = [2, 4, 7, 10, 5, 8];

const finalState = numbers.reduce((state, num) => {
  if (num % 2 === 0) {
    return 'EVEN';
  } else {
    return 'ODD';
  }
}, 'START');

console.log(finalState); // 'EVEN'
```

### Elegant State Machine with Transition Map

```javascript
const numbers = [2, 4, 7, 10, 5, 8];

const stateMachine = {
  START: num => (num % 2 === 0 ? 'EVEN' : 'ODD'),
  EVEN:  num => (num % 2 === 0 ? 'EVEN' : 'ODD'),
  ODD:   num => (num % 2 === 0 ? 'EVEN' : 'ODD')
};

const finalState = numbers.reduce((state, num) => {
  return stateMachine[state](num);
}, 'START');

console.log(finalState); // 'EVEN'
```

### Advanced: Tracking Full Transition History

```javascript
const result = numbers.reduce((acc, num) => {
  const nextState = stateMachine[acc.state](num);
  acc.transitions.push({ from: acc.state, to: nextState, on: num });
  acc.state = nextState;
  return acc;
}, { state: 'START', transitions: [] });

console.log(result);
// Output: Complete transition log with from/to states and trigger values
```

### Reusable State Machine Factory

```javascript
function createFSM({ initialState, transitions, classify }) {
  return (sequence) => sequence.reduce((acc, input) => {
    const signal = classify(input);
    const nextState = transitions[acc.state][signal];
    return {
      ...acc,
      state: nextState,
      history: [...acc.history, { from: acc.state, to: nextState, on: input }]
    };
  }, { state: initialState, history: [] });
}

const evenOddFSM = createFSM({
  initialState: 'START',
  classify: num => num % 2 === 0 ? 'even' : 'odd',
  transitions: {
    START: { even: 'EVEN', odd: 'ODD' },
    EVEN:  { even: 'EVEN', odd: 'ODD' },
    ODD:   { even: 'EVEN', odd: 'ODD' }
  }
});

const result = evenOddFSM([2, 4, 7, 10, 5, 8]);
```

---

## Nested Data Structures and Design Patterns {#nested-patterns}

Nested objects create clean, declarative programs where the structure becomes the documentation.

### 1. State Machine with Nested Objects

```javascript
class VendingMachine {
  constructor() {
    this.states = {
      idle: {
        insertCoin: 'hasCredit',
        selectItem: 'idle'
      },
      hasCredit: {
        selectItem: 'dispensing',
        refund: 'idle',
        insertCoin: 'hasCredit'
      },
      dispensing: {
        dispenseComplete: 'idle',
        error: 'hasCredit'
      }
    };
    this.currentState = 'idle';
  }

  transition(action) {
    const nextState = this.states[this.currentState][action];
    if (nextState) {
      this.currentState = nextState;
      return `Transitioned to: ${nextState}`;
    }
    return `Invalid action: ${action} from state: ${this.currentState}`;
  }
}
```

### 2. Nested Route Handler

```javascript
const routes = {
  '/': () => 'Home Page',
  '/users': {
    '/': () => 'Users List',
    '/:id': {
      '/': (id) => `User Profile: ${id}`,
      '/posts': (id) => `Posts by User: ${id}`,
      '/settings': {
        '/': (id) => `Settings for User: ${id}`,
        '/privacy': (id) => `Privacy Settings: ${id}`
      }
    }
  }
};

function navigate(path, params = {}) {
  const segments = path.split('/').filter(Boolean);
  let current = routes;

  for (let i = 0; i <= segments.length; i++) {
    const segment = i === segments.length ? '/' : `/${segments[i]}`;

    if (typeof current === 'function') {
      return current(params.id);
    }

    current = current[segment] || current['/:id'];
    if (!current) return '404 Not Found';
  }

  return typeof current === 'function' ? current(params.id) : '404 Not Found';
}
```

### 3. Nested Configuration Parser

```javascript
const config = {
  database: {
    production: {
      host: 'prod.db.com',
      port: 5432,
      ssl: true
    },
    development: {
      host: 'localhost',
      port: 5432,
      ssl: false
    }
  },
  api: {
    endpoints: {
      users: {
        get: '/api/users',
        post: '/api/users',
        delete: '/api/users/:id'
      }
    }
  }
};

function getConfig(...keys) {
  return keys.reduce((obj, key) => obj?.[key], config);
}

// Usage: getConfig('database', 'production', 'host') => 'prod.db.com'
```

### 4. Nested Validation Schema

```javascript
const validationSchema = {
  user: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    address: {
      street: {
        required: true,
        minLength: 5
      },
      city: {
        required: true
      },
      zip: {
        pattern: /^\d{5}$/
      }
    }
  }
};

function validate(data, schema) {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    if (typeof rules === 'object' && !rules.pattern && !rules.required) {
      // Nested object validation
      const nestedErrors = validate(data[field] || {}, rules);
      if (Object.keys(nestedErrors).length) {
        errors[field] = nestedErrors;
      }
    } else {
      // Apply validation rules
      if (rules.required && !data[field]) {
        errors[field] = 'Required field';
      }
      // Additional validation logic here...
    }
  }

  return errors;
}
```

---

## Classic AI Algorithms in JavaScript {#ai-algorithms}

These fundamental AI concepts from the 1980s are still relevant today and great for learning programming patterns.

### 1. NPC Finite State Machine

```javascript
class NPC {
  constructor() {
    this.state = 'patrol';
    this.x = 0;
    this.y = 0;
    this.targetX = 100;
    this.targetY = 100;
  }

  transition() {
    switch (this.state) {
      case 'patrol':
        console.log("NPC is patrolling...");
        this.patrol();
        break;
      case 'chase':
        console.log("NPC is chasing target...");
        this.chase();
        break;
      case 'attack':
        console.log("NPC is attacking...");
        this.attack();
        break;
    }
  }

  patrol() {
    this.x += 1;
    this.y += 1;

    if (this.x >= this.targetX && this.y >= this.targetY) {
      this.state = 'chase';
    }
  }

  chase() {
    if (this.x < this.targetX) this.x += 2;
    if (this.y < this.targetY) this.y += 2;

    if (Math.abs(this.x - this.targetX) < 10 && Math.abs(this.y - this.targetY) < 10) {
      this.state = 'attack';
    }
  }

  attack() {
    console.log("Attacking target at position", this.targetX, this.targetY);
  }
}
```

### 2. A* Pathfinding Algorithm

```javascript
class Node {
  constructor(x, y, parent = null) {
    this.x = x;
    this.y = y;
    this.g = 0; // Cost from start
    this.h = 0; // Estimated cost to goal
    this.f = 0; // Total cost
    this.parent = parent;
  }
}

class AStar {
  constructor(grid) {
    this.grid = grid; // 2D array: 1 = walkable, 0 = wall
    this.openList = [];
    this.closedList = [];
  }

  findPath(start, goal) {
    let startNode = new Node(start.x, start.y);
    let goalNode = new Node(goal.x, goal.y);
    this.openList.push(startNode);

    while (this.openList.length > 0) {
      // Get node with lowest f value
      let currentNode = this.openList.reduce((a, b) => (a.f < b.f ? a : b));

      if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
        return this.reconstructPath(currentNode);
      }

      this.openList = this.openList.filter(node => node !== currentNode);
      this.closedList.push(currentNode);

      const neighbors = this.getNeighbors(currentNode);

      for (let neighbor of neighbors) {
        if (this.closedList.some(n => n.x === neighbor.x && n.y === neighbor.y)) continue;
        if (this.grid[neighbor.y][neighbor.x] === 0) continue; // Wall

        let g = currentNode.g + 1;
        let h = Math.abs(neighbor.x - goalNode.x) + Math.abs(neighbor.y - goalNode.y);
        let f = g + h;

        neighbor.g = g;
        neighbor.h = h;
        neighbor.f = f;
        neighbor.parent = currentNode;
        this.openList.push(neighbor);
      }
    }

    return []; // No path found
  }

  getNeighbors(node) {
    const neighbors = [];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (let [dx, dy] of directions) {
      let x = node.x + dx;
      let y = node.y + dy;

      if (x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length) {
        neighbors.push(new Node(x, y, node));
      }
    }

    return neighbors;
  }

  reconstructPath(node) {
    const path = [];
    while (node !== null) {
      path.unshift({ x: node.x, y: node.y });
      node = node.parent;
    }
    return path;
  }
}

// Example usage
const grid = [
  [1, 1, 1, 1, 0],
  [1, 0, 0, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1]
];

const astar = new AStar(grid);
const path = astar.findPath({ x: 0, y: 0 }, { x: 4, y: 4 });
console.log(path);
```

---

## Decision Trees and Rule-Based Systems {#decision-systems}

### Decision Trees

Decision trees make decisions through a series of yes/no questions, creating a flowchart-like structure.

#### Weather Decision Tree Example

```javascript
class DecisionTree {
  constructor() {
    this.tree = {
      isRaining: {
        true: "Bring an umbrella",
        false: {
          isCloudy: {
            true: {
              isWindy: {
                true: "Bring an umbrella",
                false: "No umbrella needed"
              }
            },
            false: "No umbrella needed"
          }
        }
      }
    };
  }

  makeDecision(weather) {
    let result = this.tree.isRaining[weather.isRaining];

    if (typeof result === "object") {
      result = result.isCloudy[weather.isCloudy];
      if (typeof result === "object") {
        result = result.isWindy[weather.isWindy];
      }
    }

    return result;
  }
}

// Example usage
const weather = {
  isRaining: false,
  isCloudy: true,
  isWindy: true
};

const decisionTree = new DecisionTree();
const decision = decisionTree.makeDecision(weather);
console.log(decision); // "Bring an umbrella"
```

### Rule-Based Systems

Rule-based systems use if-then rules to make decisions, similar to expert systems.

#### Car Maintenance Example

```javascript
class RuleBasedSystem {
  constructor() {
    this.rules = [
      {
        condition: (mileage) => mileage > 10000,
        action: "Change the oil"
      },
      {
        condition: (mileage) => mileage > 30000,
        action: "Check the brakes"
      },
      {
        condition: (mileage) => mileage > 50000,
        action: "Replace the tires"
      }
    ];
  }

  applyRules(mileage) {
    const actions = [];

    this.rules.forEach(rule => {
      if (rule.condition(mileage)) {
        actions.push(rule.action);
      }
    });

    return actions.length > 0 ? actions : ["No maintenance needed"];
  }
}

// Example usage
const carMileage = 35000;
const system = new RuleBasedSystem();
const actions = system.applyRules(carMileage);
console.log(actions); // ["Change the oil", "Check the brakes"]
```

---

## Simple Neural Networks {#neural-networks}

A lightweight implementation of a simple perceptron for binary classification.

### Basic Perceptron

```javascript
class Perceptron {
    constructor(inputSize, learningRate = 0.1) {
        // Initialize weights randomly between -1 and 1
        this.weights = Array(inputSize).fill().map(() => Math.random() * 2 - 1);
        this.bias = Math.random() * 2 - 1;
        this.learningRate = learningRate;
    }

    // Step activation function
    activate(sum) {
        return sum > 0 ? 1 : 0;
    }

    // Predict output for given inputs
    predict(inputs) {
        if (inputs.length !== this.weights.length) {
            throw new Error("Input size must match weight size");
        }
        const sum = inputs.reduce((acc, val, i) => acc + val * this.weights[i], this.bias);
        return this.activate(sum);
    }

    // Train with input and target output
    train(inputs, target) {
        const prediction = this.predict(inputs);
        const error = target - prediction;

        // Update weights and bias if there's an error
        if (error !== 0) {
            this.weights = this.weights.map((w, i) => w + this.learningRate * error * inputs[i]);
            this.bias += this.learningRate * error;
        }
        return error;
    }

    // Train on dataset for multiple epochs
    trainEpoch(dataset, epochs = 100) {
        for (let epoch = 0; epoch < epochs; epoch++) {
            let totalError = 0;
            for (const { inputs, target } of dataset) {
                totalError += Math.abs(this.train(inputs, target));
            }
            // Early stopping if no errors
            if (totalError === 0) {
                console.log(`Converged at epoch ${epoch + 1}`);
                break;
            }
        }
    }
}

// Example: Training for AND gate logic
const perceptron = new Perceptron(2, 0.1);
const dataset = [
    { inputs: [0, 0], target: 0 },
    { inputs: [0, 1], target: 0 },
    { inputs: [1, 0], target: 0 },
    { inputs: [1, 1], target: 1 }
];

perceptron.trainEpoch(dataset, 100);

// Test the trained perceptron
console.log("Testing AND gate:");
dataset.forEach(({ inputs, target }) => {
    const output = perceptron.predict(inputs);
    console.log(`Input: ${inputs}, Predicted: ${output}, Expected: ${target}`);
});
```

---

## Key Takeaways

This guide demonstrates how sophisticated programming patterns can be implemented using fundamental JavaScript concepts:

- **`.reduce()` is incredibly powerful** for state management and data transformation
- **Nested objects create self-documenting code** where structure reflects logic
- **Classic AI algorithms** teach important programming patterns still used today
- **Functional programming approaches** often lead to cleaner, more maintainable code
- **State machines and decision trees** are excellent tools for managing complex logic flows

These patterns will help you write more elegant, maintainable code while understanding the foundations of computer science concepts that power modern applications.
