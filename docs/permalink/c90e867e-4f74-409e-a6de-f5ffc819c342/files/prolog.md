I'll show you five beautiful Prolog concepts and their elegant translations to modern JavaScript. These examples showcase how Prolog's declarative paradigm can inspire powerful patterns in ES2025.

## 1. Unification and Pattern Matching

**Prolog:**
```prolog
% List decomposition and pattern matching
first([H|_], H).
last([X], X).
last([_|T], X) :- last(T, X).
```

**JavaScript ES2025:**
```javascript
// Pattern matching with destructuring and recursion
const first = ([h]) => h;

const last = (list) => {
  const [head, ...tail] = list;
  return tail.length === 0 ? head : last(tail);
};

// Or using pattern matching proposal syntax (Stage 1)
const lastMatch = (list) => match (list) {
  when [x]: x;
  when [_, ...tail]: lastMatch(tail);
};
```

## 2. Logic Variables and Constraint Solving

**Prolog:**
```prolog
% Finding all solutions
between(Low, High, Low) :- Low =< High.
between(Low, High, X) :-
    Low < High,
    Next is Low + 1,
    between(Next, High, X).
```

**JavaScript ES2025:**
```javascript
// Generator functions for lazy evaluation and multiple solutions
function* between(low, high) {
  if (low <= high) {
    yield low;
    yield* between(low + 1, high);
  }
}

// Constraint-like solving with iterators
const solutions = [...between(1, 5)]; // [1, 2, 3, 4, 5]
```

## 3. Declarative Relations and Bidirectional Computation

**Prolog:**
```prolog
% Relationships work in any direction
parent(tom, bob).
parent(bob, pat).
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
```

**JavaScript ES2025:**
```javascript
// Bidirectional relations using Maps and Sets
class RelationDB {
  #facts = new Map();

  assert(relation, ...args) {
    this.#facts.set(`${relation}(${args})`, args);
  }

  *query(relation, pattern) {
    for (const [key, args] of this.#facts) {
      if (key.startsWith(relation)) {
        const unified = this.#unify(pattern, args);
        if (unified) yield unified;
      }
    }
  }

  #unify(pattern, args) {
    const bindings = {};
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '_') continue;
      if (pattern[i].startsWith('?')) {
        bindings[pattern[i]] = args[i];
      } else if (pattern[i] !== args[i]) {
        return null;
      }
    }
    return bindings;
  }
}
```

## 4. Backtracking and Non-deterministic Search

**Prolog:**
```prolog
% N-Queens problem with backtracking
safe_queen(_, _, []).
safe_queen(X, D, [Y|Ys]) :-
    X =\= Y,
    X-Y =\= D,
    Y-X =\= D,
    D1 is D + 1,
    safe_queen(X, D1, Ys).
```

**JavaScript ES2025:**
```javascript
// Backtracking with generators and yield*
function* nQueens(n, board = []) {
  if (board.length === n) {
    yield [...board];
    return;
  }

  for (let col = 0; col < n; col++) {
    if (isSafe(board, col)) {
      board.push(col);
      yield* nQueens(n, board);
      board.pop(); // backtrack
    }
  }
}

const isSafe = (board, col) => {
  const row = board.length;
  return !board.some((c, r) =>
    c === col ||
    Math.abs(c - col) === Math.abs(r - row)
  );
};
```

## 5. Declarative List Processing and Infinite Structures

**Prolog:**
```prolog
% Elegant list operations
append([], L, L).
append([H|T1], L2, [H|T3]) :- append(T1, L2, T3).

% Generate infinite sequences
nat(0).
nat(N) :- nat(N1), N is N1 + 1.
```

**JavaScript ES2025:**
```javascript
// Lazy infinite sequences with generators
function* naturals(n = 0) {
  while (true) {
    yield n++;
  }
}

// Declarative list operations with recursion
const append = (xs, ys) =>
  xs.length === 0 ? ys : [xs[0], ...append(xs.slice(1), ys)];

// Or using Iterator helpers (ES2025)
const infiniteEvens = naturals()
  .filter(n => n % 2 === 0)
  .map(n => n ** 2);

// Take first 5 even squares lazily
const firstFive = infiniteEvens.take(5).toArray();
```

These examples demonstrate how Prolog's core ideas—unification, non-determinism, backtracking, and declarative programming—can be elegantly expressed in modern JavaScript. The combination of generators, destructuring, iterator helpers, and functional patterns in ES2025 allows us to capture much of Prolog's expressive power while maintaining JavaScript's flexibility.
