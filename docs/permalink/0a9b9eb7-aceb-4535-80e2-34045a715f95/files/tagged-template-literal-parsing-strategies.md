# Tagged Template Literal Parsing Strategies

## 1. State Machine / Parser-Based Approaches

### Basic State Tracking
- **Svelte (older versions)**: Used a simple state machine tracking whether inside tag, attribute name, attribute value, or text content
- **Lit-HTML**: Tracks parser state (tag, attribute, text) and generates different placeholder types
- **Stencil**: Similar state-based approach with context awareness

```javascript
// Simplified state machine example
function parseTemplate(strings, values) {
  let state = 'TEXT'; // TEXT, TAG_NAME, ATTR_NAME, ATTR_VALUE
  let result = '';

  for (let i = 0; i < strings.length; i++) {
    const chunk = strings[i];

    // Update state based on chunk content
    state = analyzeChunk(chunk, state);

    result += chunk;

    if (i < values.length) {
      switch (state) {
        case 'TEXT':
          result += `<!-- ::${i} -->`;
          break;
        case 'ATTR_VALUE':
          result += `::${i}`;
          break;
        case 'ATTR_NAME':
          result += `::${i}=""`;
          break;
      }
    }
  }

  return result;
}
```

### Advanced Parser State Machines
- **Vue 3 compiler**: Uses full HTML parser with tokenization
- **Angular Ivy**: AST-based parsing with context preservation
- **Solid.js**: Two-phase parsing (tokenize, then analyze)

## 2. Regex-Based Context Detection

### Last Character Analysis
```javascript
// Check the end of the current string to determine context
function getContext(stringPart) {
  const trimmed = stringPart.trim();

  // In attribute value (quoted)
  if (/=\s*["'][^"']*$/.test(stringPart)) return 'ATTR_VALUE';

  // In attribute name
  if (/\s+\w*$/.test(stringPart)) return 'ATTR_NAME';

  // In tag
  if (/<[^>]*$/.test(stringPart)) return 'TAG';

  // Default to text
  return 'TEXT';
}
```

### Lookahead/Lookbehind Patterns
- **Hyperapp**: Uses regex to detect `="` patterns
- **Preact/htm**: Complex regex for attribute boundaries
- **Million.js**: Lookahead for quote matching

## 3. Token-Based Approaches

### Pre-tokenization
```javascript
// Tokenize first, then place interpolations
function tokenizeAndPlace(strings, values) {
  const fullString = strings.join('__PLACEHOLDER__');
  const tokens = htmlTokenizer(fullString);

  let valueIndex = 0;
  return tokens.map(token => {
    if (token.includes('__PLACEHOLDER__')) {
      const context = token.type; // 'attribute', 'text', etc.
      return formatPlaceholder(valueIndex++, context);
    }
    return token.value;
  }).join('');
}
```

### AST-First Parsing
- **Babel plugins**: Parse to AST, then inject placeholders
- **SWC transforms**: Similar AST approach
- **Custom parsers**: Build full DOM tree first

## 4. Quote and Bracket Tracking

### Quote State Tracking
```javascript
function trackQuotes(str) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTag = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const prevChar = str[i - 1];

    if (char === '"' && prevChar !== '\\' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === "'" && prevChar !== '\\' && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '<' && !inSingleQuote && !inDoubleQuote) {
      inTag = true;
    } else if (char === '>' && !inSingleQuote && !inDoubleQuote) {
      inTag = false;
    }
  }

  return { inSingleQuote, inDoubleQuote, inTag };
}
```

### Bracket Depth Tracking
- **JSX parsers**: Track `{}` nesting levels
- **Template engines**: Monitor `${}` boundaries
- **Expression parsers**: Handle nested interpolations

## 5. Multi-Pass Approaches

### Two-Phase Processing
1. **First pass**: Replace interpolations with typed placeholders
2. **Second pass**: Parse HTML and restore values based on context

```javascript
// Phase 1: Mark all interpolations
const marked = strings.reduce((acc, str, i) => {
  return acc + str + (i < values.length ? `__INTERP_${i}__` : '');
}, '');

// Phase 2: Parse and contextualize
const parsed = parseHTML(marked);
const restored = restoreInterpolations(parsed, values);
```

### Three-Phase Processing
- **Svelte compiler**: Tokenize → Parse → Transform
- **Vue compiler**: Lex → Parse → Generate
- **Angular compiler**: Scan → Parse → Emit
