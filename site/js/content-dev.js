// ============================================================
// content-dev.js — Interview Prep Content (MERN, GenAI, Aptitude)
// ============================================================

const MERN_CONTENT = {
  id: 'mern', t: 'MERN Stack + DevOps',
  tabs: [
    {
      id: 'html', t: 'HTML & CSS',
      topics: [
        {
          t: 'HTML5 Semantic Elements & Accessibility',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Semantic HTML is the foundation of accessible, SEO-friendly web applications. Screen readers and search engines rely on semantic tags to understand content structure. As a software developer you need to understand the difference between presentational and semantic markup, and frontend interviews test it.</p></div><div class="learn-section"><div class="learn-h">HTML5 Semantic Elements</div><p class="learn-p">HTML5 introduced <b>semantic elements</b> that clearly describe their meaning to both the browser and the developer. Unlike generic <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> tags, semantic elements convey the purpose of the content they contain, improving readability, SEO, and accessibility.</p><ul class="learn-list"><li><code>&lt;header&gt;</code> — Introductory content or navigational aids for its parent section</li><li><code>&lt;nav&gt;</code> — Section containing navigation links (primary menus, breadcrumbs)</li><li><code>&lt;main&gt;</code> — The dominant content of the <code>&lt;body&gt;</code>; only one visible per page</li><li><code>&lt;article&gt;</code> — Self-contained composition that could be independently distributed (blog post, news story, forum post)</li><li><code>&lt;section&gt;</code> — Thematic grouping of content, typically with a heading</li><li><code>&lt;aside&gt;</code> — Content tangentially related to surrounding content (sidebars, pull quotes)</li><li><code>&lt;footer&gt;</code> — Footer for its nearest sectioning content or the page</li><li><code>&lt;figure&gt;</code> / <code>&lt;figcaption&gt;</code> — Self-contained content with an optional caption (images, diagrams, code listings)</li></ul><div class="learn-code">&lt;article&gt;\n  &lt;header&gt;&lt;h2&gt;Post Title&lt;/h2&gt;&lt;/header&gt;\n  &lt;section&gt;&lt;p&gt;Content...&lt;/p&gt;&lt;/section&gt;\n  &lt;footer&gt;&lt;p&gt;Author info&lt;/p&gt;&lt;/footer&gt;\n&lt;/article&gt;</div></div><div class="learn-section"><div class="learn-h">Web Accessibility (a11y) &amp; ARIA</div><p class="learn-p">Accessibility ensures web content is usable by people with disabilities, including those using screen readers, keyboard-only navigation, or assistive technologies. The <b>WAI-ARIA</b> specification provides attributes that supplement native HTML semantics.</p><table class="learn-table"><tr><th>ARIA Attribute</th><th>Purpose</th><th>Example</th></tr><tr><td><code>role</code></td><td>Defines the element\'s role</td><td><code>role="navigation"</code></td></tr><tr><td><code>aria-label</code></td><td>Provides an accessible label</td><td><code>aria-label="Main menu"</code></td></tr><tr><td><code>aria-hidden</code></td><td>Hides element from assistive tech</td><td><code>aria-hidden="true"</code></td></tr><tr><td><code>aria-live</code></td><td>Announces dynamic content changes</td><td><code>aria-live="polite"</code></td></tr><tr><td><code>aria-describedby</code></td><td>References a description element</td><td><code>aria-describedby="help-text"</code></td></tr></table><div class="learn-tip"><b>Tip:</b> Always provide <code>alt</code> text for informative images. Use <code>alt=""</code> for purely decorative images so screen readers skip them entirely.</div></div><div class="learn-section"><div class="learn-h">Keyboard Navigation &amp; Focus Management</div><p class="learn-p">All interactive elements must be keyboard-accessible. Native elements like <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, and <code>&lt;input&gt;</code> are focusable by default. For custom interactive widgets, use <code>tabindex</code>: a value of <code>0</code> adds the element to the natural tab order; <code>-1</code> makes it programmatically focusable (useful for modals) but removes it from the tab sequence.</p><div class="learn-code">// Focus management for a modal dialog\nconst modal = document.getElementById(\'modal\');\nmodal.focus(); // move focus into modal on open\n\n// Trap focus inside modal until closed\nmodal.addEventListener(\'keydown\', (e) =&gt; {\n  if (e.key === \'Escape\') closeModal();\n});</div><div class="learn-warn"><b>Warning:</b> Never use <code>tabindex</code> values greater than 0. They override the natural DOM tab order and create confusing, unpredictable navigation for keyboard users.</div></div><div class="learn-section"><div class="learn-h">Best Practices &amp; WCAG Guidelines</div><p class="learn-p">Follow the <b>WCAG 2.1</b> guidelines at AA level minimum. Ensure color contrast ratios of at least 4.5:1 for normal text and 3:1 for large text. Use semantic HTML first — add ARIA only when native semantics are insufficient. Test with real screen readers (NVDA on Windows, VoiceOver on macOS).</p><ul class="learn-list"><li>Use <code>&lt;button&gt;</code> for clickable actions — not <code>&lt;div onclick&gt;</code></li><li>Associate <code>&lt;label&gt;</code> with form inputs via the <code>for</code> attribute</li><li>Provide skip navigation links for keyboard users</li><li>Use landmark roles (<code>banner</code>, <code>main</code>, <code>contentinfo</code>, <code>navigation</code>)</li><li>Ensure all functionality works without a mouse</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Div soup:</b> Using &lt;div&gt; for everything loses semantic meaning. Use &lt;nav&gt;, &lt;main&gt;, &lt;article&gt;, &lt;section&gt;, &lt;aside&gt; appropriately.</li><li><b>Missing alt text:</b> Images without alt attributes are invisible to screen readers. Always provide meaningful alt text (or alt="" for decorative images).</li><li><b>Heading hierarchy:</b> Skipping heading levels (h1 to h3) breaks document outline for assistive tech.</li><li><b>ARIA overuse:</b> Prefer native semantic elements over ARIA roles. ARIA is a last resort when no semantic HTML element exists.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between &lt;section&gt; and &lt;div&gt;?</b><br>A: &lt;section&gt; represents a thematic grouping with a heading. &lt;div&gt; is a generic container with no semantic meaning. Use &lt;section&gt; when the content has a natural heading.</p><p class="learn-p"><b>Q2: What does aria-live do?</b><br>A: It announces dynamic content changes to screen readers. aria-live="polite" waits for the user to be idle; "assertive" interrupts immediately.</p></div>',
          code: `<!-- Semantic HTML5 Page with Full Accessibility -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible Semantic Page</title>
  <style>
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      z-index: 100;
    }
    .skip-link:focus { top: 0; }
  </style>
</head>
<body>
  <!-- Skip Navigation Link -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header role="banner">
    <h1>My Website</h1>
    <nav aria-label="Primary navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact" aria-current="page">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content">
    <article aria-labelledby="post-title">
      <header>
        <h2 id="post-title">Understanding Semantic HTML</h2>
        <time datetime="2024-06-15">June 15, 2024</time>
      </header>
      <section>
        <p>Semantic elements improve SEO, accessibility, and code maintainability.</p>
        <figure>
          <img src="diagram.png" alt="Diagram showing HTML5 page layout with header, nav, main, aside, and footer regions">
          <figcaption>Figure 1: Typical HTML5 page structure</figcaption>
        </figure>
      </section>
      <footer>
        <p>Written by <address><a href="mailto:author@example.com">Author Name</a></address></p>
      </footer>
    </article>

    <section aria-labelledby="comments-heading">
      <h2 id="comments-heading">Comments</h2>
      <div aria-live="polite" aria-atomic="true">
        <p>3 new comments loaded</p>
      </div>
    </section>
  </main>

  <aside aria-label="Related articles">
    <h2>Related Posts</h2>
    <nav aria-label="Related posts navigation">
      <ul>
        <li><a href="/post-1">Getting Started with ARIA</a></li>
        <li><a href="/post-2">CSS for Accessibility</a></li>
      </ul>
    </nav>
  </aside>

  <footer role="contentinfo">
    <p>&copy; 2024 My Website. All rights reserved.</p>
  </footer>
</body>
</html>`,
          problems: [
            ['Semantic HTML Basics', 'https://www.geeksforgeeks.org/html5-semantics/', 'Easy']
          ],
          mcqs: [
            {q: 'Which HTML5 element represents a self-contained composition that could be independently distributed?', o: ['<section>', '<article>', '<aside>', '<div>'], a: 1},
            {q: 'What is the correct way to hide a decorative image from screen readers?', o: ['Remove the alt attribute entirely', 'Set alt=""', 'Set aria-hidden="false"', 'Use visibility: hidden'], a: 1},
            {q: 'Which tabindex value makes an element programmatically focusable but not reachable via Tab key?', o: ['tabindex="0"', 'tabindex="1"', 'tabindex="-1"', 'tabindex="auto"'], a: 2}
          ]
        },
        {
          t: 'CSS Flexbox & Grid Layout',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Modern CSS layout systems (Flexbox and Grid) replaced float-based hacks and are essential for responsive web design. Understanding the flex model and grid tracks is required for any frontend interview. Interviewers expect clean, maintainable layouts without unnecessary CSS.</p></div><div class="learn-section"><div class="learn-h">CSS Flexbox Fundamentals</div><p class="learn-p"><b>Flexbox</b> (Flexible Box Layout) is a one-dimensional layout model designed for distributing space among items in a container. Set <code>display: flex</code> on the parent to create a flex container. The main axis (default: horizontal) and cross axis (perpendicular) control item alignment.</p><table class="learn-table"><tr><th>Property</th><th>Applied To</th><th>Values</th></tr><tr><td><code>flex-direction</code></td><td>Container</td><td><code>row</code> | <code>column</code> | <code>row-reverse</code> | <code>column-reverse</code></td></tr><tr><td><code>justify-content</code></td><td>Container</td><td><code>flex-start</code> | <code>center</code> | <code>space-between</code> | <code>space-around</code> | <code>space-evenly</code></td></tr><tr><td><code>align-items</code></td><td>Container</td><td><code>stretch</code> | <code>center</code> | <code>flex-start</code> | <code>flex-end</code> | <code>baseline</code></td></tr><tr><td><code>flex-wrap</code></td><td>Container</td><td><code>nowrap</code> | <code>wrap</code> | <code>wrap-reverse</code></td></tr><tr><td><code>flex</code></td><td>Item</td><td>Shorthand for <code>flex-grow flex-shrink flex-basis</code></td></tr><tr><td><code>align-self</code></td><td>Item</td><td>Overrides <code>align-items</code> for a single item</td></tr></table><div class="learn-code">.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.item { flex: 1 1 200px; }</div></div><div class="learn-section"><div class="learn-h">CSS Grid Fundamentals</div><p class="learn-p"><b>CSS Grid</b> is a two-dimensional layout system that handles both columns and rows simultaneously. It is ideal for complex page layouts. Set <code>display: grid</code> on the container and define tracks with <code>grid-template-columns</code> and <code>grid-template-rows</code>.</p><div class="learn-code">.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: auto 1fr auto;\n  gap: 1rem;\n}\n.header { grid-column: 1 / -1; } /* span all columns */\n.sidebar { grid-row: 2 / 3; }\n.content { grid-column: 2 / 4; }</div><p class="learn-p">The <code>fr</code> unit represents a fraction of available space. <code>repeat(3, 1fr)</code> creates three equal columns. Use <code>minmax()</code> for responsive sizing: <code>grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))</code> creates a responsive grid that auto-wraps.</p></div><div class="learn-section"><div class="learn-h">Grid Template Areas</div><p class="learn-p">Named grid areas provide an intuitive visual way to define layouts. Each string in <code>grid-template-areas</code> represents a row, and each word a named cell.</p><div class="learn-code">.layout {\n  display: grid;\n  grid-template-areas:\n    "header header header"\n    "sidebar content content"\n    "footer footer footer";\n  grid-template-columns: 200px 1fr 1fr;\n  grid-template-rows: auto 1fr auto;\n}\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.content { grid-area: content; }\n.footer  { grid-area: footer; }</div><div class="learn-tip"><b>Tip:</b> Use <code>.</code> (dot) in grid-template-areas to leave a cell empty: <code>"header . header"</code>.</div></div><div class="learn-section"><div class="learn-h">Flexbox vs Grid — When to Use Which</div><p class="learn-p">Use <b>Flexbox</b> for one-dimensional layouts (a single row or column of items) — navigation bars, card rows, centering content. Use <b>Grid</b> for two-dimensional layouts — full page layouts, dashboards, image galleries. They work great together: Grid for the overall page structure, Flexbox for components within grid cells.</p><ul class="learn-list"><li><b>Flexbox:</b> content-first — items determine their own sizing</li><li><b>Grid:</b> layout-first — the grid defines the structure, items fill it</li><li>Combine them: use Grid for macro layout, Flexbox for micro layout within cells</li></ul><div class="learn-warn"><b>Warning:</b> Avoid using Flexbox for complex two-dimensional layouts. Items can wrap, but alignment across rows becomes inconsistent. Use Grid instead.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>flex-shrink default:</b> Items shrink by default (flex-shrink: 1). Set flex-shrink: 0 to prevent unwanted shrinking.</li><li><b>min-width: auto:</b> Flex items have min-width: auto by default, which can cause overflow. Set min-width: 0 to allow items to shrink below their content size.</li><li><b>Grid vs Flexbox:</b> Grid is 2D (rows AND columns). Flexbox is 1D (row OR column). Use Grid for page layout, Flexbox for component layout.</li><li><b>gap property:</b> Use gap instead of margins between flex/grid items — cleaner and avoids margin collapse issues.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: When to use Flexbox vs Grid?</b><br>A: Flexbox for 1D layouts (navbar, card row). Grid for 2D layouts (page layout, dashboard). They can be combined — Grid for page structure, Flexbox within grid cells.</p><p class="learn-p"><b>Q2: What does flex: 1 mean?</b><br>A: Shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%. The item grows to fill available space equally with other flex: 1 items.</p></div>',
          code: `/* ===== Flexbox: Responsive Navbar ===== */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #1a1a2e;
}
.navbar__logo { flex-shrink: 0; }
.navbar__links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}
.navbar__links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}
.navbar__links a:hover { color: #e94560; }

/* ===== CSS Grid: Dashboard Layout ===== */
.dashboard {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main   main"
    "sidebar widget1 widget2"
    "footer footer  footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 60px 1fr auto 40px;
  min-height: 100vh;
  gap: 1rem;
  padding: 1rem;
}
.dashboard__header  { grid-area: header;  background: #16213e; }
.dashboard__sidebar { grid-area: sidebar; background: #0f3460; }
.dashboard__main    { grid-area: main;    background: #1a1a2e; }
.dashboard__w1      { grid-area: widget1; background: #533483; }
.dashboard__w2      { grid-area: widget2; background: #e94560; }
.dashboard__footer  { grid-area: footer;  background: #16213e; }

/* ===== Responsive Grid: Auto-fit Cards ===== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}
.card {
  display: flex;           /* Flexbox inside grid cell */
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card__title { font-size: 1.25rem; font-weight: 600; }
.card__body  { flex: 1; margin: 1rem 0; }
.card__action {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* ===== Centering (the classic problem) ===== */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.center-grid {
  display: grid;
  place-items: center;
  min-height: 100vh;
}`,
          problems: [
            ['Flexbox Froggy', 'https://flexboxfroggy.com/', 'Easy'],
            ['Grid Garden', 'https://cssgridgarden.com/', 'Easy']
          ],
          mcqs: [
            {q: 'Which CSS property creates equal-width columns that share available space in a Grid container?', o: ['grid-template-columns: auto auto auto', 'grid-template-columns: repeat(3, 1fr)', 'grid-template-columns: 33% 33% 33%', 'grid-columns: 3'], a: 1},
            {q: 'In Flexbox, which property controls alignment along the cross axis for ALL items?', o: ['justify-content', 'align-items', 'align-self', 'flex-align'], a: 1},
            {q: 'Which approach creates a responsive grid that auto-wraps without media queries?', o: ['grid-template-columns: repeat(3, 1fr)', 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))', 'flex-wrap: wrap', 'grid-auto-flow: dense'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'js', t: 'JavaScript',
      topics: [
        {
          t: 'JavaScript ES6+ Features',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">ES6+ features (let/const, arrow functions, destructuring, spread, template literals, modules) are the modern baseline for JavaScript development. Interviews expect fluent use of these features and understanding of their semantics — especially temporal dead zone, block scoping, and arrow function this binding.</p></div><div class="learn-section"><div class="learn-h">Block Scoping: let &amp; const</div><p class="learn-p">ES6 introduced <code>let</code> and <code>const</code> to replace <code>var</code>. Both are <b>block-scoped</b> — they exist only within the nearest enclosing <code>{}</code> block. <code>const</code> prevents reassignment (but does <em>not</em> make objects immutable). <code>let</code> allows reassignment.</p><div class="learn-code">let count = 0;\ncount = 1; // OK\n\nconst API_URL = \'https://api.example.com\';\n// API_URL = \'...\'; // TypeError: Assignment to constant\n\nconst user = { name: \'Alice\' };\nuser.name = \'Bob\'; // OK — object is mutable\n// user = {}; // TypeError — cannot reassign</div><div class="learn-warn"><b>Warning:</b> <code>var</code> is function-scoped and hoisted, leading to subtle bugs. Always prefer <code>const</code> by default, use <code>let</code> only when reassignment is needed.</div></div><div class="learn-section"><div class="learn-h">Arrow Functions &amp; Template Literals</div><p class="learn-p"><b>Arrow functions</b> provide concise syntax and lexically bind <code>this</code> (they inherit <code>this</code> from the enclosing scope). They cannot be used as constructors and do not have their own <code>arguments</code> object.</p><div class="learn-code">// Traditional\nfunction add(a, b) { return a + b; }\n\n// Arrow — implicit return for single expression\nconst add = (a, b) =&gt; a + b;\n\n// Arrow — block body needs explicit return\nconst process = (x) =&gt; {\n  const result = x * 2;\n  return result;\n};</div><p class="learn-p"><b>Template literals</b> use backticks and support embedded expressions via <code>${\'${expression}\'}</code>, multi-line strings, and tagged templates for custom processing.</p><div class="learn-code">const name = \'World\';\nconst greeting = \\`Hello, ${\'${name}\'}!\\`;\nconst multiLine = \\`Line 1\nLine 2\nLine 3\\`;</div></div><div class="learn-section"><div class="learn-h">Destructuring &amp; Spread/Rest</div><p class="learn-p"><b>Destructuring</b> extracts values from arrays or properties from objects into distinct variables. The <b>spread operator</b> (<code>...</code>) expands iterables; the <b>rest operator</b> (same syntax) collects remaining items.</p><div class="learn-code">// Object destructuring with renaming and defaults\nconst { name: userName, age = 25 } = user;\n\n// Array destructuring with skipping\nconst [first, , third] = [1, 2, 3];\n\n// Spread — shallow clone\nconst copy = { ...original, extra: true };\nconst merged = [...arr1, ...arr2];\n\n// Rest — collect remaining\nconst [head, ...tail] = [1, 2, 3, 4];\nfunction sum(...nums) { return nums.reduce((a, b) =&gt; a + b, 0); }</div><div class="learn-tip"><b>Tip:</b> Spread creates <em>shallow</em> copies only. Nested objects/arrays still share references. Use <code>structuredClone()</code> for deep copies.</div></div><div class="learn-section"><div class="learn-h">Modern Features: Optional Chaining, Nullish Coalescing &amp; More</div><p class="learn-p"><b>Optional chaining</b> (<code>?.</code>) short-circuits to <code>undefined</code> if a reference is nullish. <b>Nullish coalescing</b> (<code>??</code>) provides a default only for <code>null</code>/<code>undefined</code> (unlike <code>||</code> which catches all falsy values).</p><div class="learn-code">const city = user?.address?.city; // undefined if any part is null/undefined\nconst port = config.port ?? 3000; // 3000 only if port is null/undefined\n// vs: config.port || 3000 — would also replace 0</div><p class="learn-p">Other essential ES6+ features include <b>Map</b> and <b>Set</b> (key-ordered collections), <b>Symbol</b> (unique identifiers), <b>for...of</b> loops, <b>default parameters</b>, <b>Promise.allSettled()</b>, <b>Object.entries()</b>/<code>Object.fromEntries()</code>, and <b>Array methods</b> like <code>.flat()</code>, <code>.flatMap()</code>, <code>.at()</code>.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Temporal dead zone:</b> let/const variables exist but cannot be accessed before their declaration line. Accessing them throws ReferenceError.</li><li><b>Arrow function this:</b> Arrow functions do not have their own this — they inherit from the enclosing scope. Do not use them as object methods or constructors.</li><li><b>const misconception:</b> const prevents reassignment, not mutation. <code>const arr = [1,2]; arr.push(3);</code> works fine.</li><li><b>Spread is shallow:</b> <code>{...obj}</code> creates a shallow copy. Nested objects are still shared references.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Difference between var, let, and const?</b><br>A: var is function-scoped and hoisted (initialized as undefined). let is block-scoped and hoisted but not initialized — accessing it before declaration throws ReferenceError (Temporal Dead Zone). const is like let but cannot be reassigned. Always prefer const, then let. Never use var.</p><p class="learn-p"><b>Q2: What is destructuring?</b><br>A: Extracting values from arrays/objects into variables: <code>const {name, age} = person;</code> or <code>const [first, ...rest] = arr;</code></p><p class="learn-p"><b>Q3: How do ES modules differ from CommonJS?</b><br>A: ES modules use import/export (static, tree-shakable). CommonJS uses require/module.exports (dynamic, no tree-shaking).</p></div>',
          code: `// ===== ES6+ Features Comprehensive Demo =====

// 1. Destructuring + Default Parameters
function createUser({ name, age = 25, role = 'user' } = {}) {
  return { id: Date.now(), name, age, role, createdAt: new Date() };
}
const user = createUser({ name: 'Alice', age: 30 });

// 2. Spread & Rest Operators
const defaults = { theme: 'dark', lang: 'en', notifications: true };
const userPrefs = { theme: 'light', fontSize: 14 };
const config = { ...defaults, ...userPrefs }; // userPrefs overrides defaults

function logAll(label, ...values) {
  console.log(label, values); // values is a real Array
}

// 3. Map & Set
const cache = new Map();
cache.set('user:1', { name: 'Alice' });
cache.set('user:2', { name: 'Bob' });
cache.has('user:1'); // true
cache.size;          // 2

const uniqueTags = new Set(['js', 'react', 'js', 'node']);
console.log([...uniqueTags]); // ['js', 'react', 'node']

// 4. Optional Chaining & Nullish Coalescing
const response = { data: { users: [{ name: 'Alice' }] } };
const firstName = response?.data?.users?.[0]?.name ?? 'Unknown';

// 5. Array Methods
const nested = [[1, 2], [3, [4, 5]]];
const flat = nested.flat(Infinity); // [1, 2, 3, 4, 5]

const sentences = ['Hello World', 'Foo Bar'];
const words = sentences.flatMap(s => s.split(' ')); // ['Hello','World','Foo','Bar']

// 6. Object Methods
const entries = Object.entries(config); // [['theme','light'], ...]
const filtered = Object.fromEntries(
  entries.filter(([key]) => key !== 'notifications')
);

// 7. Tagged Template Literals
function sql(strings, ...values) {
  // Parameterized query builder
  const query = strings.reduce((acc, str, i) => {
    return acc + str + (i < values.length ? \`$\${i + 1}\` : '');
  }, '');
  return { query, values };
}
const name = 'Alice';
const q = sql\`SELECT * FROM users WHERE name = \${name}\`;
// { query: 'SELECT * FROM users WHERE name = $1', values: ['Alice'] }

// 8. Symbol for unique keys
const ID = Symbol('id');
const obj = { [ID]: 123, name: 'test' };
console.log(obj[ID]);           // 123
console.log(Object.keys(obj));  // ['name'] — Symbol keys are hidden`,
          problems: [
            ['Count Items Matching a Rule', 'https://leetcode.com/problems/count-items-matching-a-rule/', 'Easy'],
            ['Chunk Array', 'https://leetcode.com/problems/chunk-array/', 'Easy'],
            ['JSON Deep Equal', 'https://leetcode.com/problems/json-deep-equal/', 'Medium']
          ],
          mcqs: [
            {q: 'What is the output of: const [a, ...b] = [1, 2, 3, 4]; console.log(b);', o: ['[2, 3, 4]', '[1, 2, 3]', '2', 'undefined'], a: 0},
            {q: 'What does the nullish coalescing operator (??) return for: 0 ?? 42', o: ['42', '0', 'null', 'undefined'], a: 1},
            {q: 'Which statement about const is TRUE?', o: ['const makes objects immutable', 'const prevents variable reassignment only', 'const variables are hoisted like var', 'const has function scope'], a: 1}
          ]
        },
        {
          t: 'Closures, Promises & Async/Await',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Closures are the foundation of JavaScript scoping and enable patterns like data privacy, memoization, and event handlers. Promises and async/await are essential for handling asynchronous operations — API calls, file I/O, and timers. Interviews heavily test async understanding, especially error handling and concurrency patterns.</p></div><div class="learn-section"><div class="learn-h">Closures</div><p class="learn-p">A <b>closure</b> is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created. They enable <b>data privacy</b>, <b>factory functions</b>, and <b>partial application</b>.</p><div class="learn-code">function createCounter(initial = 0) {\n  let count = initial; // enclosed variable\n  return {\n    increment: () =&gt; ++count,\n    decrement: () =&gt; --count,\n    getCount:  () =&gt; count\n  };\n}\nconst counter = createCounter(10);\ncounter.increment(); // 11\ncounter.getCount();  // 11\n// count is not accessible directly — data privacy!</div><div class="learn-warn"><b>Warning:</b> Closures in loops with <code>var</code> are a classic pitfall. Since <code>var</code> is function-scoped, all closures share the same variable. Use <code>let</code> (block-scoped) to get a fresh binding per iteration.</div></div><div class="learn-section"><div class="learn-h">Promises</div><p class="learn-p">A <b>Promise</b> represents the eventual completion (or failure) of an asynchronous operation. It has three states: <b>pending</b>, <b>fulfilled</b>, and <b>rejected</b>. Promises are chainable via <code>.then()</code> and errors propagate to the nearest <code>.catch()</code>.</p><table class="learn-table"><tr><th>Method</th><th>Behavior</th></tr><tr><td><code>Promise.all()</code></td><td>Resolves when ALL promises resolve; rejects on first rejection</td></tr><tr><td><code>Promise.allSettled()</code></td><td>Waits for ALL to settle (resolve or reject)</td></tr><tr><td><code>Promise.race()</code></td><td>Resolves/rejects with the FIRST settled promise</td></tr><tr><td><code>Promise.any()</code></td><td>Resolves with first fulfilled; rejects only if ALL reject</td></tr></table><div class="learn-code">const fetchData = (url) =&gt; {\n  return fetch(url)\n    .then(res =&gt; {\n      if (!res.ok) throw new Error(\\`HTTP ${\'${res.status}\'}\\`);\n      return res.json();\n    });\n};\n\nPromise.all([fetchData(\'/api/a\'), fetchData(\'/api/b\')])\n  .then(([a, b]) =&gt; console.log(a, b))\n  .catch(err =&gt; console.error(err));</div></div><div class="learn-section"><div class="learn-h">Async/Await</div><p class="learn-p"><code>async/await</code> is syntactic sugar over Promises. An <code>async</code> function always returns a Promise. <code>await</code> pauses execution until the awaited Promise settles. Use <code>try/catch</code> for error handling.</p><div class="learn-code">async function loadUserData(userId) {\n  try {\n    const res = await fetch(\\`/api/users/${\'${userId}\'}\\`);\n    if (!res.ok) throw new Error(\\`HTTP ${\'${res.status}\'}\\`);\n    return await res.json();\n  } catch (err) {\n    console.error(\'Failed:\', err.message);\n    throw err; // re-throw for caller to handle\n  }\n}</div><div class="learn-tip"><b>Tip:</b> For parallel async operations, use <code>Promise.all()</code> with <code>await</code>: <code>const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);</code>. Do NOT <code>await</code> each sequentially if they are independent — that wastes time.</div></div><div class="learn-section"><div class="learn-h">Common Patterns &amp; Pitfalls</div><p class="learn-p">Understanding closures and async patterns is critical for interviews. Common patterns include: <b>memoization</b> (caching results via closures), <b>debouncing/throttling</b> (controlling function call frequency), <b>retry logic</b> (retrying failed async operations), and <b>async iterators</b> (processing streams of data).</p><ul class="learn-list"><li><b>Memoization:</b> Use a closure to cache expensive computation results</li><li><b>Debounce:</b> Delay execution until the user stops triggering an event</li><li><b>Race condition:</b> Multiple async calls where only the latest result matters</li><li><b>Memory leaks:</b> Closures holding references to large objects prevent garbage collection</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Closure in loops:</b> <code>for (var i = 0; i &lt; 3; i++) setTimeout(() =&gt; console.log(i), 100)</code> prints 3,3,3 — not 0,1,2. Use let (block scoping) to fix.</li><li><b>Unhandled rejection:</b> A promise without .catch() silently swallows errors. Always handle rejections or use try/catch with async/await.</li><li><b>await in loops:</b> <code>for (const x of arr) await fetch(x)</code> runs sequentially. Use <code>Promise.all(arr.map(x =&gt; fetch(x)))</code> for parallel execution.</li><li><b>Memory leaks:</b> Closures can accidentally retain references to large objects, preventing garbage collection.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is a closure?</b><br>A: A function that retains access to variables from its outer scope even after the outer function has returned. The inner function "closes over" the outer variables.</p><p class="learn-p"><b>Q2: Promise.all vs Promise.allSettled?</b><br>A: Promise.all rejects if ANY promise rejects. Promise.allSettled waits for all to complete and returns both fulfilled and rejected results.</p><p class="learn-p"><b>Q3: What does the event loop do?</b><br>A: It continuously checks the call stack and task queues. When the stack is empty, it dequeues microtasks first (promises), then macrotasks (setTimeout, I/O).</p></div>',
          code: `// ===== Closures: Memoize Function =====
function memoize(fn) {
  const cache = new Map(); // closure over cache
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const factorial = memoize(function f(n) {
  return n <= 1 ? 1 : n * f(n - 1);
});
factorial(10); // computed
factorial(10); // cached!

// ===== Closures: Debounce =====
function debounce(fn, delay) {
  let timerId; // closure over timerId
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}
const handleSearch = debounce((query) => {
  console.log('Searching:', query);
}, 300);

// ===== Promises: Retry with Backoff =====
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(\`Retry \${attempt + 1} after \${delay}ms\`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// ===== Async: Parallel vs Sequential =====
async function parallel() {
  // GOOD — runs concurrently
  const [users, posts] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json())
  ]);
  return { users, posts };
}

async function sequential() {
  // BAD for independent requests — runs one after another
  const users = await fetch('/api/users').then(r => r.json());
  const posts = await fetch('/api/posts').then(r => r.json());
  return { users, posts };
}

// ===== Async: Process Array with Concurrency Limit =====
async function mapWithLimit(items, limit, asyncFn) {
  const results = [];
  const executing = new Set();
  for (const [i, item] of items.entries()) {
    const p = asyncFn(item, i).then(result => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}`,
          problems: [
            ['Sleep', 'https://leetcode.com/problems/sleep/', 'Easy'],
            ['Promise Time Limit', 'https://leetcode.com/problems/promise-time-limit/', 'Medium'],
            ['Execute Asynchronous Functions in Parallel', 'https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/', 'Medium']
          ],
          mcqs: [
            {q: 'What will this print? for(var i=0;i<3;i++){setTimeout(()=>console.log(i),0);} ', o: ['0 1 2', '3 3 3', 'undefined undefined undefined', '0 0 0'], a: 1},
            {q: 'Which Promise method resolves as soon as ANY promise fulfills (ignoring rejections)?', o: ['Promise.race()', 'Promise.any()', 'Promise.all()', 'Promise.allSettled()'], a: 1},
            {q: 'What does an async function always return?', o: ['The raw value', 'A callback', 'A Promise', 'undefined'], a: 2}
          ]
        },
        {
          t: 'Event Loop, Prototypes & this keyword',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In a production chat application handling thousands of concurrent WebSocket connections, a single blocking operation can freeze the entire Node.js server. Understanding the event loop, prototypal inheritance, and <code>this</code> binding is essential for writing performant JavaScript and debugging issues like lost context in callbacks, unexpected prototype chain lookups, and microtask starvation. These are among the most frequently asked JavaScript interview topics.</p></div><div class="learn-section"><div class="learn-h">The JavaScript Event Loop</div><p class="learn-p">JavaScript is <b>single-threaded</b> but handles concurrency via the <b>event loop</b>. The runtime has a <b>call stack</b> (executes synchronous code), <b>Web APIs</b> (handle timers, network requests, DOM events), a <b>macrotask queue</b> (setTimeout, setInterval, I/O), and a <b>microtask queue</b> (Promise callbacks, queueMicrotask, MutationObserver).</p><p class="learn-p">Execution order: (1) Execute all synchronous code on the call stack. (2) When the stack is empty, drain the <b>entire microtask queue</b>. (3) Execute <b>one</b> macrotask. (4) Repeat from step 2. This means microtasks always run before the next macrotask.</p><div class="learn-code">console.log(\'1\'); // sync\nsetTimeout(() =&gt; console.log(\'2\'), 0); // macrotask\nPromise.resolve().then(() =&gt; console.log(\'3\')); // microtask\nconsole.log(\'4\'); // sync\n// Output: 1, 4, 3, 2</div><div class="learn-tip"><b>Tip:</b> <code>queueMicrotask(fn)</code> schedules a microtask explicitly. Microtasks created during microtask processing are also drained before the next macrotask — be careful of infinite microtask loops!</div></div><div class="learn-section"><div class="learn-h">Prototypes &amp; Prototypal Inheritance</div><p class="learn-p">JavaScript uses <b>prototypal inheritance</b>. Every object has an internal <code>[[Prototype]]</code> link (accessible via <code>__proto__</code> or <code>Object.getPrototypeOf()</code>). When accessing a property, the engine walks up the <b>prototype chain</b> until it finds the property or reaches <code>null</code>.</p><div class="learn-code">function Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.speak = function() {\n  return this.name + \' makes a sound\';\n};\n\nfunction Dog(name, breed) {\n  Animal.call(this, name); // call parent constructor\n  this.breed = breed;\n}\nDog.prototype = Object.create(Animal.prototype);\nDog.prototype.constructor = Dog;\nDog.prototype.bark = function() { return \'Woof!\'; };\n\nconst d = new Dog(\'Rex\', \'Labrador\');\nd.speak(); // \'Rex makes a sound\' — inherited\nd.bark();  // \'Woof!\' — own method</div><p class="learn-p">ES6 <code>class</code> syntax is syntactic sugar over prototypes. Under the hood, <code>class Dog extends Animal</code> sets up the same prototype chain. Understanding prototypes is essential for debugging and interview questions.</p></div><div class="learn-section"><div class="learn-h">The <code>this</code> Keyword</div><p class="learn-p">The value of <code>this</code> depends on <b>how</b> a function is called, not where it is defined (except for arrow functions). There are four binding rules:</p><table class="learn-table"><tr><th>Rule</th><th>When</th><th>this =</th></tr><tr><td>Default</td><td>Standalone call <code>fn()</code></td><td><code>globalThis</code> (or <code>undefined</code> in strict mode)</td></tr><tr><td>Implicit</td><td>Method call <code>obj.fn()</code></td><td><code>obj</code></td></tr><tr><td>Explicit</td><td><code>fn.call(obj)</code> / <code>fn.apply(obj)</code> / <code>fn.bind(obj)</code></td><td><code>obj</code></td></tr><tr><td>New</td><td><code>new Fn()</code></td><td>Newly created object</td></tr></table><div class="learn-code">const obj = {\n  value: 42,\n  getValue: function() { return this.value; },\n  getValueArrow: () =&gt; this.value // \'this\' is the outer scope!\n};\nobj.getValue();      // 42 (implicit binding)\nobj.getValueArrow(); // undefined (arrow inherits outer this)\n\nconst fn = obj.getValue;\nfn(); // undefined in strict mode (default binding — lost context)</div><div class="learn-warn"><b>Warning:</b> Extracting a method from an object loses its <code>this</code> binding. Use <code>.bind()</code>, wrap in an arrow function, or use the class fields syntax (<code>getValue = () =&gt; this.value</code>) to preserve context.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Microtask starvation:</b> Recursively queuing microtasks (e.g., <code>Promise.resolve().then(recurse)</code>) blocks macrotasks indefinitely, freezing timers and I/O</li><li><b>Lost <code>this</code> in callbacks:</b> Passing <code>obj.method</code> as a callback loses implicit binding — wrap in arrow function or use <code>.bind()</code></li><li><b>Prototype pollution:</b> Modifying <code>Object.prototype</code> affects every object in the runtime — a critical security vulnerability</li><li><b><code>typeof null === \'object\'</code>:</b> A legacy bug in JavaScript since 1995 that will never be fixed</li><li><b>Shadow vs override:</b> Setting a property on an object shadows the prototype property rather than modifying it, which can cause confusion</li><li><b><code>setTimeout(fn, 0)</code> is not immediate:</b> The minimum delay is ~4ms in browsers due to clamping, and the callback waits for all microtasks</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><p class="learn-p">Understanding the tradeoffs between different inheritance patterns and async scheduling mechanisms is key for architecture decisions.</p><table class="learn-table"><tr><th>Feature</th><th>Classical (ES6 class)</th><th>Prototypal (Object.create)</th></tr><tr><td>Syntax</td><td>Familiar OOP syntax with <code>class</code>/<code>extends</code></td><td>Uses <code>Object.create()</code> or factory functions</td></tr><tr><td>Under the hood</td><td>Still prototypal inheritance</td><td>Direct prototype chain manipulation</td></tr><tr><td>Constructor</td><td><code>constructor()</code> method</td><td>No special constructor mechanism</td></tr><tr><td>Private fields</td><td>Supported via <code>#field</code> syntax</td><td>Achieved via closures</td></tr><tr><td>Use case</td><td>Most application code</td><td>Library internals, mixins</td></tr></table><table class="learn-table"><tr><th>Mechanism</th><th>Microtask</th><th>Macrotask</th></tr><tr><td>Examples</td><td>Promise.then, queueMicrotask, MutationObserver</td><td>setTimeout, setInterval, I/O, UI rendering</td></tr><tr><td>Priority</td><td>Higher — entire queue drained between macrotasks</td><td>Lower — one macrotask per event loop tick</td></tr><tr><td>Starvation risk</td><td>Can starve macrotasks if queue never empties</td><td>Cannot starve microtasks</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain the JavaScript event loop execution order for: sync code, Promises, and setTimeout.</b><br>A: Synchronous code runs first on the call stack. When the stack empties, the entire microtask queue (Promises, queueMicrotask) is drained. Then one macrotask (setTimeout, setInterval) executes. This cycle repeats. Microtasks always have priority over macrotasks.</p><p class="learn-p"><b>Q2: What is the prototype chain and how does property lookup work?</b><br>A: Every object has an internal [[Prototype]] link. When you access a property, the engine checks the object first, then walks up the prototype chain until it finds the property or reaches null (the end of the chain). This is how inheritance works in JavaScript.</p><p class="learn-p"><b>Q3: List the four rules for <code>this</code> binding in order of precedence.</b><br>A: (1) <code>new</code> binding — <code>this</code> = newly created object. (2) Explicit binding — <code>call</code>, <code>apply</code>, <code>bind</code> set <code>this</code> explicitly. (3) Implicit binding — method call <code>obj.fn()</code> sets <code>this</code> = obj. (4) Default binding — standalone call, <code>this</code> = globalThis (or undefined in strict mode). Arrow functions inherit <code>this</code> lexically and cannot be rebound.</p><p class="learn-p"><b>Q4: What happens with <code>this</code> inside a nested function vs an arrow function?</b><br>A: A regular nested function has its own <code>this</code> (default binding — globalThis or undefined). An arrow function has no own <code>this</code> — it captures <code>this</code> from the enclosing lexical scope at creation time.</p><p class="learn-p"><b>Q5: How does <code>Object.create(null)</code> differ from <code>{}</code>?</b><br>A: <code>Object.create(null)</code> creates an object with no prototype (its [[Prototype]] is null), so it has no inherited methods like <code>toString</code> or <code>hasOwnProperty</code>. It is useful for dictionary-like objects where you want no accidental prototype property collisions. <code>{}</code> inherits from Object.prototype.</p><p class="learn-p"><b>Q6: Explain prototype pollution and why it is a security concern.</b><br>A: Prototype pollution occurs when an attacker injects properties into <code>Object.prototype</code> (e.g., via <code>__proto__</code> in user input). Since all objects inherit from Object.prototype, this can override methods globally, bypass security checks, or cause denial of service. Mitigate by freezing prototypes and sanitizing input.</p></div>',
          code: `// ===== Event Loop: Predict the Output =====
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    // Microtask created during microtask processing
    return Promise.resolve('Promise 2');
  })
  .then(val => console.log(val));

queueMicrotask(() => console.log('Microtask'));

console.log('End');
// Output: Start, End, Promise 1, Microtask, Promise 2, Timeout 1, Timeout 2

// ===== Prototypes: Inheritance with ES6 Class =====
class EventEmitter {
  constructor() {
    this._events = {};
  }
  on(event, listener) {
    (this._events[event] ||= []).push(listener);
    return this;
  }
  emit(event, ...args) {
    const listeners = this._events[event] || [];
    listeners.forEach(fn => fn.apply(this, args));
    return listeners.length > 0;
  }
  off(event, listener) {
    this._events[event] = (this._events[event] || [])
      .filter(fn => fn !== listener);
    return this;
  }
}

// ===== this Keyword: Binding Demonstration =====
class Timer {
  constructor(label) {
    this.label = label;
    this.seconds = 0;
  }
  // Arrow function in class field — 'this' always bound to instance
  tick = () => {
    this.seconds++;
    console.log(\`[\${this.label}] \${this.seconds}s\`);
  }
  start() {
    // this.tick is safe to pass as callback because it is an arrow
    setInterval(this.tick, 1000);
  }
}

// ===== call, apply, bind =====
function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`;
}

const alice = { name: 'Alice' };
const bob   = { name: 'Bob' };

greet.call(alice, 'Hello', '!');   // "Hello, Alice!"
greet.apply(bob, ['Hi', '.']);     // "Hi, Bob."
const greetAlice = greet.bind(alice, 'Hey');
greetAlice('?');                   // "Hey, Alice?"

// ===== Prototype Chain Inspection =====
console.log(Object.getPrototypeOf([]) === Array.prototype);  // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null — end of chain`,
          problems: [
            ['Promise Pool', 'https://leetcode.com/problems/promise-pool/', 'Medium'],
            ['Event Emitter', 'https://leetcode.com/problems/event-emitter/', 'Medium'],
            ['Call Function with Custom Context', 'https://leetcode.com/problems/call-function-with-custom-context/', 'Medium'],
            ['Design Event Emitter', 'https://leetcode.com/problems/event-emitter/', 'Medium']
          ],
          mcqs: [
            {q: 'In the event loop, which queue has higher priority?', o: ['Macrotask queue', 'Microtask queue', 'They have equal priority', 'It depends on the browser'], a: 1},
            {q: 'What is the value of this inside an arrow function?', o: ['The calling object', 'The global object', 'The enclosing lexical scope this', 'undefined'], a: 2},
            {q: 'What does Object.create(proto) do?', o: ['Clones the proto object deeply', 'Creates a new object with proto as its [[Prototype]]', 'Calls the constructor of proto', 'Freezes the proto object'], a: 1},
            {q: 'What is the output? Promise.resolve().then(() => console.log(1)); queueMicrotask(() => console.log(2)); console.log(3);', o: ['1, 2, 3', '3, 1, 2', '3, 2, 1', '2, 1, 3'], a: 1},
            {q: 'Which statement about prototypal inheritance is FALSE?', o: ['All objects have a prototype except Object.create(null)', 'ES6 classes are syntactic sugar over prototypes', 'Prototype chain lookup is depth-first', 'Prototypes support multiple inheritance natively'], a: 3},
            {q: 'What does new keyword do? (select the INCORRECT step)', o: ['Creates a new empty object', 'Sets the prototype of the new object', 'Executes the constructor with this = new object', 'Returns undefined if constructor has no return'], a: 3},
            {q: 'In strict mode, what is this in a standalone function call?', o: ['The global object', 'null', 'undefined', 'The function itself'], a: 2}
          ]
        },
        {
          t: 'TypeScript Essentials',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When a production e-commerce platform deployed a code change that passed all tests, a runtime TypeError crashed checkout for 20% of users because an API response field was unexpectedly <code>null</code>. TypeScript would have caught this at compile time. Modern MERN stacks increasingly require TypeScript proficiency — it reduces bugs by 15-25% according to studies, and most enterprise React and Node.js projects mandate it. Interview panels evaluate TypeScript knowledge as a signal of code quality awareness.</p></div><div class="learn-section"><div class="learn-h">Why TypeScript?</div><p class="learn-p"><b>TypeScript</b> is a typed superset of JavaScript that compiles to plain JS. It adds <b>static type checking</b> at compile time, catching bugs early and enabling better IDE support (autocompletion, refactoring).</p></div><div class="learn-section"><div class="learn-h">Core Types</div><div class="learn-code">// Primitive types\nlet name: string = "Alice";\nlet age: number = 30;\nlet active: boolean = true;\nlet data: null = null;\nlet x: undefined = undefined;\n\n// Arrays\nlet nums: number[] = [1, 2, 3];\nlet names: Array&lt;string&gt; = ["a", "b"];\n\n// Tuple (fixed-length, typed array)\nlet pair: [string, number] = ["age", 30];\n\n// Enum\nenum Direction { Up, Down, Left, Right }\nlet dir: Direction = Direction.Up; // 0\n\n// Union types\nlet id: string | number = "abc";\nid = 123; // also valid\n\n// Literal types\nlet status: "active" | "inactive" = "active";</div></div><div class="learn-section"><div class="learn-h">Interfaces & Type Aliases</div><div class="learn-code">// Interface (extendable, for objects)\ninterface User {\n  id: number;\n  name: string;\n  email?: string;        // optional\n  readonly createdAt: Date; // immutable\n}\n\n// Type alias (more flexible)\ntype ID = string | number;\ntype Point = { x: number; y: number };\n\n// Intersection types\ntype Admin = User &amp; { role: "admin"; permissions: string[] };\n\n// Extending interfaces\ninterface Employee extends User {\n  department: string;\n  salary: number;\n}</div></div><div class="learn-section"><div class="learn-h">Generics</div><div class="learn-code">// Generic function\nfunction identity&lt;T&gt;(arg: T): T { return arg; }\nidentity&lt;string&gt;("hello"); // explicit\nidentity(42);              // inferred as number\n\n// Generic interface\ninterface ApiResponse&lt;T&gt; {\n  data: T;\n  status: number;\n  error?: string;\n}\n\n// Generic constraint\nfunction getLength&lt;T extends { length: number }&gt;(arg: T): number {\n  return arg.length;\n}\ngetLength("hello"); // OK\ngetLength([1,2,3]); // OK\n// getLength(123);  // Error: number has no .length</div></div><div class="learn-section"><div class="learn-h">Utility Types</div><table class="learn-table"><tr><th>Type</th><th>What It Does</th><th>Example</th></tr><tr><td>Partial&lt;T&gt;</td><td>All properties optional</td><td>Partial&lt;User&gt;</td></tr><tr><td>Required&lt;T&gt;</td><td>All properties required</td><td>Required&lt;User&gt;</td></tr><tr><td>Readonly&lt;T&gt;</td><td>All properties readonly</td><td>Readonly&lt;User&gt;</td></tr><tr><td>Pick&lt;T, K&gt;</td><td>Subset of properties</td><td>Pick&lt;User, "id" | "name"&gt;</td></tr><tr><td>Omit&lt;T, K&gt;</td><td>All except specified</td><td>Omit&lt;User, "email"&gt;</td></tr><tr><td>Record&lt;K, V&gt;</td><td>Object with key type K, value type V</td><td>Record&lt;string, number&gt;</td></tr></table><div class="learn-tip"><b>Interview tip:</b> Know the difference between <code>interface</code> and <code>type</code>. Interfaces support declaration merging and are preferred for object shapes. Type aliases support unions, intersections, and mapped types.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b><code>any</code> defeats the purpose:</b> Using <code>any</code> disables type checking — use <code>unknown</code> instead and narrow with type guards</li><li><b>Object vs object vs {}:</b> <code>Object</code> matches any non-null value, <code>object</code> matches non-primitives, <code>{}</code> matches any non-null value (avoid it)</li><li><b>Type assertions are not type casts:</b> <code>as</code> assertions tell the compiler to trust you — they do NOT convert data at runtime</li><li><b>Structural typing surprises:</b> TypeScript uses structural (duck) typing, so an object with extra properties is still compatible with a type that expects fewer</li><li><b>Enum pitfalls:</b> Numeric enums allow reverse mapping and can lead to unexpected behavior; prefer string enums or union literals</li><li><b>Declaration merging:</b> Interfaces with the same name merge automatically, which can be useful but also confusing when unintentional</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><p class="learn-p">Understanding when to use different TypeScript constructs helps write cleaner, more maintainable code.</p><table class="learn-table"><tr><th>Feature</th><th>interface</th><th>type alias</th></tr><tr><td>Object shapes</td><td>Preferred — supports extends</td><td>Supported — uses &amp; intersection</td></tr><tr><td>Union types</td><td>Not supported</td><td>Supported: <code>type A = B | C</code></td></tr><tr><td>Declaration merging</td><td>Supported (auto-merge same name)</td><td>Not supported</td></tr><tr><td>Computed properties</td><td>Not supported</td><td>Supported with mapped types</td></tr><tr><td>Performance</td><td>Slightly better for large projects</td><td>Equivalent for most cases</td></tr></table><table class="learn-table"><tr><th>Feature</th><th>TypeScript</th><th>JavaScript</th></tr><tr><td>Type safety</td><td>Compile-time checking</td><td>Runtime errors only</td></tr><tr><td>IDE support</td><td>Full autocompletion, refactoring</td><td>Limited inference</td></tr><tr><td>Learning curve</td><td>Moderate — need to learn type system</td><td>Low — dynamic typing</td></tr><tr><td>Build step</td><td>Required (tsc or bundler)</td><td>Optional</td></tr><tr><td>Ecosystem</td><td>DefinitelyTyped for legacy libs</td><td>Native — no type definitions needed</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between <code>interface</code> and <code>type</code> in TypeScript?</b><br>A: Both define object shapes, but interfaces support declaration merging and extends, while type aliases support unions, intersections, mapped types, and conditional types. Use interface for public APIs and object shapes; use type for unions, tuples, and complex type operations.</p><p class="learn-p"><b>Q2: Explain the difference between <code>any</code>, <code>unknown</code>, and <code>never</code>.</b><br>A: <code>any</code> disables type checking entirely. <code>unknown</code> is the type-safe counterpart — you must narrow it before use (with typeof, instanceof, etc.). <code>never</code> represents values that never occur — functions that always throw or infinite loops. It is the bottom type in TypeScript\'s type system.</p><p class="learn-p"><b>Q3: What are generics and why are they useful?</b><br>A: Generics let you write reusable components that work with multiple types while preserving type safety. Instead of using <code>any</code>, you parameterize the type: <code>function identity&lt;T&gt;(arg: T): T</code>. The compiler infers T from the argument, maintaining full type information.</p><p class="learn-p"><b>Q4: What is a discriminated union and when would you use it?</b><br>A: A discriminated union combines union types with a common literal property (the discriminant). TypeScript narrows the type based on the discriminant in switch/if statements. Example: <code>type Shape = Circle | Rectangle</code> where each has a <code>kind</code> property. Used for state machines, action types (Redux), and API response variants.</p><p class="learn-p"><b>Q5: How do utility types like Partial, Required, Pick, and Omit work?</b><br>A: They are built-in mapped types that transform existing types. <code>Partial&lt;T&gt;</code> makes all properties optional. <code>Required&lt;T&gt;</code> makes all required. <code>Pick&lt;T, K&gt;</code> selects specific properties. <code>Omit&lt;T, K&gt;</code> excludes specific properties. Under the hood, they use mapped types with keyof and conditional types.</p></div>',
          code: `// TypeScript Essentials — Code Examples

// ===== Type Guards =====
function processValue(val: string | number) {
  if (typeof val === 'string') {
    console.log(val.toUpperCase()); // TS knows it's string
  } else {
    console.log(val.toFixed(2));     // TS knows it's number
  }
}

// ===== Discriminated Unions =====
interface Circle { kind: 'circle'; radius: number; }
interface Rectangle { kind: 'rectangle'; width: number; height: number; }
type Shape = Circle | Rectangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
  }
}

// ===== Generic API Client =====
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.json();
}

// Usage with type inference
interface User { id: number; name: string; }
// const { data } = await fetchApi<User[]>('/api/users');
// data is User[]

// ===== Mapped Types =====
type Optional<T> = { [K in keyof T]?: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };

// ===== Conditional Types =====
type IsString<T> = T extends string ? 'yes' : 'no';
// IsString<string> = 'yes'
// IsString<number> = 'no'

// ===== React with TypeScript =====
// interface Props {
//   name: string;
//   age?: number;
//   onClick: (id: string) => void;
//   children: React.ReactNode;
// }
// const MyComponent: React.FC<Props> = ({ name, onClick, children }) => {
//   return <div onClick={() => onClick(name)}>{children}</div>;
// };`,
          problems: [
            ['TypeScript Handbook', 'https://www.geeksforgeeks.org/typescript/', 'Easy'],
            ['Type Challenges - Easy', 'https://github.com/type-challenges/type-challenges', 'Easy'],
            ['TypeScript Utility Types Practice', 'https://www.geeksforgeeks.org/typescript-utility-types/', 'Medium']
          ],
          mcqs: [
            {q: 'TypeScript\'s type checking happens at:', o: ['Runtime', 'Compile time', 'Both', 'Neither — it\'s just documentation'], a: 1},
            {q: 'Which utility type makes all properties optional?', o: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Pick<T, K>'], a: 1},
            {q: 'Generics in TypeScript allow:', o: ['Dynamic typing like JavaScript', 'Creating reusable components that work with multiple types', 'Automatic type conversion', 'Bypassing type checks'], a: 1},
            {q: 'What is the difference between any and unknown?', o: ['They are identical', 'unknown requires type narrowing before use, any does not', 'any is for objects, unknown is for primitives', 'unknown does not exist in TypeScript'], a: 1},
            {q: 'Which TypeScript feature allows a function to work with multiple types while maintaining type safety?', o: ['Type assertions', 'Generics', 'Enums', 'Decorators'], a: 1},
            {q: 'What does the never type represent?', o: ['A nullable value', 'An uninitialized variable', 'A value that never occurs (unreachable code)', 'An empty object'], a: 2},
            {q: 'What is declaration merging in TypeScript?', o: ['Combining two files into one', 'Interfaces with the same name automatically combine their members', 'Merging type aliases with the & operator', 'Combining modules at build time'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'react', t: 'React',
      topics: [
        {
          t: 'Components, JSX & Props',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">React components are the building blocks of modern UIs. Understanding the component model, JSX compilation, and one-way data flow via props is fundamental. Frontend interviews test component design decisions — when to split components, how to manage prop drilling, and JSX gotchas.</p></div><div class="learn-section"><div class="learn-h">React Components</div><p class="learn-p"><b>React</b> is a declarative UI library built around <b>components</b> — reusable, self-contained pieces of UI. Components can be <b>function components</b> (preferred) or <b>class components</b> (legacy). Function components are plain JavaScript functions that accept <code>props</code> and return JSX.</p><div class="learn-code">// Function Component\nfunction Greeting({ name }) {\n  return &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;\n}\n\n// Arrow function variant\nconst Greeting = ({ name }) =&gt; &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;</div><p class="learn-p">Components follow a <b>unidirectional data flow</b>: data flows down from parent to child via props. To communicate upward, parents pass callback functions as props.</p></div><div class="learn-section"><div class="learn-h">JSX — JavaScript XML</div><p class="learn-p"><b>JSX</b> is a syntax extension that lets you write HTML-like markup inside JavaScript. It is transpiled to <code>React.createElement()</code> calls by Babel/SWC. Key JSX rules:</p><ul class="learn-list"><li>Use <code>className</code> instead of <code>class</code></li><li>Use <code>htmlFor</code> instead of <code>for</code></li><li>All tags must be closed (including self-closing: <code>&lt;img /&gt;</code>)</li><li>Return a single root element — use <code>&lt;Fragment&gt;</code> or <code>&lt;&gt;...&lt;/&gt;</code> to avoid extra DOM nodes</li><li>Embed expressions with <code>{expression}</code> — not statements</li></ul><div class="learn-code">// JSX compiles to:\nReact.createElement(\'h1\', { className: \'title\' }, \'Hello\');\n\n// Conditional rendering\n{isLoggedIn ? &lt;Dashboard /&gt; : &lt;Login /&gt;}\n{showBanner &amp;&amp; &lt;Banner /&gt;}\n\n// List rendering\n{items.map(item =&gt; &lt;Item key={item.id} {...item} /&gt;)}</div><div class="learn-warn"><b>Warning:</b> Always provide a stable, unique <code>key</code> prop when rendering lists. Using array index as key causes issues with reordering and component state preservation.</div></div><div class="learn-section"><div class="learn-h">Props &amp; Component Composition</div><p class="learn-p"><b>Props</b> (properties) are read-only inputs passed from parent to child. They can be any JavaScript value: strings, numbers, objects, functions, even other components. Use <b>destructuring</b> in the function signature for clean access.</p><div class="learn-code">function Card({ title, children, onClick }) {\n  return (\n    &lt;div className="card" onClick={onClick}&gt;\n      &lt;h2&gt;{title}&lt;/h2&gt;\n      &lt;div className="card-body"&gt;{children}&lt;/div&gt;\n    &lt;/div&gt;\n  );\n}</div><p class="learn-p">The special <code>children</code> prop represents whatever is nested between the component\'s opening and closing tags. This enables the <b>composition pattern</b> — building complex UIs by nesting simpler components.</p><div class="learn-tip"><b>Tip:</b> Prefer composition over inheritance in React. Use the <b>render prop</b> pattern or <b>children as a function</b> for flexible component reuse.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>JSX is not HTML:</b> Use className (not class), htmlFor (not for), and camelCase attributes. Self-closing tags require /&gt;.</li><li><b>Key prop in lists:</b> Missing or non-unique keys cause rendering bugs. Never use array index as key if the list can be reordered.</li><li><b>Props are read-only:</b> Never mutate props. React components must be pure functions with respect to their props.</li><li><b>Children as props:</b> Everything between opening and closing JSX tags is passed as props.children.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is JSX?</b><br>A: JSX is syntactic sugar for React.createElement() calls. &lt;div className="x"&gt;hi&lt;/div&gt; compiles to React.createElement("div", {className: "x"}, "hi").</p><p class="learn-p"><b>Q2: When should you split a component?</b><br>A: When it handles multiple responsibilities, when part of it re-renders unnecessarily, or when logic can be reused elsewhere.</p></div>',
          code: `// ===== React Components, JSX & Props =====
import React from 'react';

// Reusable Button component with variants
function Button({ variant = 'primary', size = 'md', children, onClick, disabled }) {
  const baseClasses = 'btn font-medium rounded transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizes = { sm: 'px-3 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' };

  return (
    <button
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Card component using children (composition)
function Card({ title, footer, children }) {
  return (
    <div className="card border rounded-lg shadow-sm">
      {title && <div className="card-header p-4 border-b font-bold">{title}</div>}
      <div className="card-body p-4">{children}</div>
      {footer && <div className="card-footer p-4 border-t">{footer}</div>}
    </div>
  );
}

// List rendering with conditional display
function UserList({ users, onSelect }) {
  if (!users.length) {
    return <p className="text-gray-500">No users found.</p>;
  }
  return (
    <ul className="space-y-2">
      {users.map(user => (
        <li key={user.id} onClick={() => onSelect(user)} className="cursor-pointer">
          <Card title={user.name}>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            {user.isAdmin && <span className="badge bg-yellow-400">Admin</span>}
          </Card>
        </li>
      ))}
    </ul>
  );
}

// App composing everything together
function App() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@test.com', role: 'Engineer', isAdmin: true },
    { id: 2, name: 'Bob', email: 'bob@test.com', role: 'Designer', isAdmin: false }
  ];
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Team Dashboard</h1>
      <UserList users={users} onSelect={user => alert(user.name)} />
      <div className="mt-4 space-x-2">
        <Button variant="primary">Save</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger" size="sm">Delete</Button>
      </div>
    </div>
  );
}`,
          problems: [
            ['Counter', 'https://leetcode.com/problems/counter/', 'Easy'],
            ['To Be Or Not To Be', 'https://leetcode.com/problems/to-be-or-not-to-be/', 'Easy'],
            ['Apply Transform Over Each Element in Array', 'https://leetcode.com/problems/apply-transform-over-each-element-in-array/', 'Easy']
          ],
          mcqs: [
            {q: 'What does JSX compile to under the hood?', o: ['HTML strings', 'React.createElement() calls', 'DOM API calls', 'Web Components'], a: 1},
            {q: 'Why should you avoid using array index as a key in React lists?', o: ['It causes syntax errors', 'It prevents rendering', 'It causes issues with reordering and state preservation', 'It is slower than string keys'], a: 2},
            {q: 'How do child components communicate data back to parents in React?', o: ['By modifying props directly', 'By calling parent callback functions passed as props', 'Using global variables', 'Via the DOM'], a: 1}
          ]
        },
        {
          t: 'Hooks (useState, useEffect, useRef, useMemo)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Hooks are the modern way to manage state and side effects in React functional components. Understanding hook rules, dependency arrays, and common pitfalls is essential for any React interview. Interviews test deep understanding of useEffect cleanup, stale closures, and performance optimization with useMemo/useCallback.</p></div><div class="learn-section"><div class="learn-h">useState — State Management</div><p class="learn-p"><b>useState</b> adds local state to function components. It returns a <code>[value, setter]</code> pair. The setter triggers a re-render. State updates are <b>batched</b> and <b>asynchronous</b> — you cannot read the new value immediately after calling the setter.</p><div class="learn-code">const [count, setCount] = useState(0);\n\n// Direct update\nsetCount(5);\n\n// Functional update — use when new state depends on previous\nsetCount(prev =&gt; prev + 1);\n\n// Lazy initializer — expensive computation runs only once\nconst [data, setData] = useState(() =&gt; computeExpensiveInitial());</div><div class="learn-warn"><b>Warning:</b> Never mutate state directly. For objects/arrays, always create a new reference: <code>setItems([...items, newItem])</code> or <code>setUser({...user, name: \'New\'})</code>.</div></div><div class="learn-section"><div class="learn-h">useEffect — Side Effects</div><p class="learn-p"><b>useEffect</b> handles side effects: data fetching, subscriptions, DOM manipulation, timers. It runs <b>after</b> the component renders (not during). The dependency array controls when the effect re-runs.</p><div class="learn-code">// Runs after every render\nuseEffect(() =&gt; { document.title = \\`Count: ${\'${count}\'}\\`; });\n\n// Runs only on mount (empty deps)\nuseEffect(() =&gt; {\n  fetchData();\n  return () =&gt; cleanup(); // cleanup on unmount\n}, []);\n\n// Runs when \'query\' changes\nuseEffect(() =&gt; {\n  const controller = new AbortController();\n  fetch(\\`/api?q=${\'${query}\'}\\`, { signal: controller.signal })\n    .then(r =&gt; r.json()).then(setResults);\n  return () =&gt; controller.abort(); // cleanup previous request\n}, [query]);</div><div class="learn-tip"><b>Tip:</b> Always include all values from the component scope that the effect uses in the dependency array. The ESLint rule <code>react-hooks/exhaustive-deps</code> catches missing dependencies.</div></div><div class="learn-section"><div class="learn-h">useRef — Mutable References</div><p class="learn-p"><b>useRef</b> returns a mutable <code>ref</code> object whose <code>.current</code> property persists across renders without causing re-renders. Two primary uses: (1) accessing DOM elements, and (2) storing mutable values (like previous state, timer IDs).</p><div class="learn-code">const inputRef = useRef(null);\n\n// Focus the input on mount\nuseEffect(() =&gt; { inputRef.current.focus(); }, []);\n\n// Store previous value\nconst prevCount = useRef(count);\nuseEffect(() =&gt; {\n  prevCount.current = count; // update after render\n}, [count]);</div></div><div class="learn-section"><div class="learn-h">useMemo &amp; useCallback — Performance</div><p class="learn-p"><b>useMemo</b> memoizes a <em>computed value</em>; <b>useCallback</b> memoizes a <em>function reference</em>. Both accept a dependency array and recalculate only when dependencies change. Use them to avoid expensive recalculations or unnecessary child re-renders.</p><div class="learn-code">// Memoize expensive computation\nconst sorted = useMemo(() =&gt; {\n  return [...items].sort((a, b) =&gt; a.name.localeCompare(b.name));\n}, [items]);\n\n// Memoize callback to prevent child re-renders\nconst handleClick = useCallback((id) =&gt; {\n  setSelected(id);\n}, []);</div><div class="learn-warn"><b>Warning:</b> Don\'t over-optimize. <code>useMemo</code> and <code>useCallback</code> have their own overhead (storing the memoized value and comparing dependencies). Use them only when you have measurable performance issues.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Stale closures:</b> useEffect callbacks capture variables from the render when they were created. Missing dependencies in the array means the callback sees stale values.</li><li><b>Infinite re-render:</b> Calling setState unconditionally inside useEffect without proper dependencies causes an infinite loop.</li><li><b>Object in deps:</b> <code>useEffect(() =&gt; {}, [{a:1}])</code> runs every render because a new object is created each time. Destructure or use useMemo.</li><li><b>useRef does not re-render:</b> Changing ref.current does NOT trigger a re-render. Use it for mutable values that should not cause renders (timers, DOM elements).</li></ul></div><div class="learn-section"><div class="learn-h">useReducer — Complex State Logic</div><p class="learn-p"><b>useReducer</b> is an alternative to useState for state logic that involves multiple sub-values or when the next state depends on the previous one. It follows the Redux pattern: dispatch an <b>action</b> to a <b>reducer function</b> that returns the new state.</p><div class="learn-code">const initialState = { count: 0, step: 1 };\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case \'increment\': return { ...state, count: state.count + state.step };\n    case \'decrement\': return { ...state, count: state.count - state.step };\n    case \'setStep\':   return { ...state, step: action.payload };\n    case \'reset\':     return initialState;\n    default: throw new Error(\\`Unknown action: ${\'${action.type}\'}\\`);\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, initialState);\n  return (\n    &lt;&gt;\n      &lt;p&gt;Count: {state.count}&lt;/p&gt;\n      &lt;button onClick={() =&gt; dispatch({ type: \'increment\' })}&gt;+&lt;/button&gt;\n      &lt;button onClick={() =&gt; dispatch({ type: \'reset\' })}&gt;Reset&lt;/button&gt;\n    &lt;/&gt;\n  );\n}</div><p class="learn-p"><b>When to use useReducer over useState:</b> (1) State has multiple related values. (2) Next state depends on previous state. (3) State transitions need to be testable (reducer is a pure function). (4) Passing dispatch down instead of multiple callbacks simplifies child component APIs.</p></div><div class="learn-section"><div class="learn-h">Error Boundaries</div><p class="learn-p"><b>Error Boundaries</b> are React components that catch JavaScript errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. They are the <b>only</b> way to catch render-time errors in React (try/catch does not work in JSX). Error boundaries must be class components — there is no hook equivalent.</p><div class="learn-code">class ErrorBoundary extends React.Component {\n  state = { hasError: false, error: null };\n\n  static getDerivedStateFromError(error) {\n    return { hasError: true, error };\n  }\n\n  componentDidCatch(error, errorInfo) {\n    console.error(\'Caught by boundary:\', error, errorInfo);\n    // Send to error reporting service (Sentry, etc.)\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return &lt;h2&gt;Something went wrong.&lt;/h2&gt;;\n    }\n    return this.props.children;\n  }\n}\n\n// Usage: wrap any subtree\n&lt;ErrorBoundary&gt;\n  &lt;RiskyComponent /&gt;\n&lt;/ErrorBoundary&gt;</div><div class="learn-warn"><b>Warning:</b> Error boundaries do NOT catch errors in: event handlers (use try/catch), asynchronous code (setTimeout, fetch), or errors in the boundary itself. Place multiple boundaries at different levels for granular error isolation.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Rules of Hooks?</b><br>A: (1) Only call hooks at the top level — never inside loops, conditions, or nested functions. (2) Only call hooks from React function components or custom hooks.</p><p class="learn-p"><b>Q2: useMemo vs useCallback?</b><br>A: useMemo memoizes a computed value. useCallback memoizes a function reference. useCallback(fn, deps) is equivalent to useMemo(() =&gt; fn, deps).</p><p class="learn-p"><b>Q3: When does useEffect cleanup run?</b><br>A: Before the effect re-runs (on dependency change) and when the component unmounts. Used for unsubscribing, clearing timers, and canceling requests.</p><p class="learn-p"><b>Q4: When would you use useReducer instead of useState?</b><br>A: When state has multiple related sub-values, the next state depends on the previous state, or you need testable state transitions. The reducer is a pure function that can be unit-tested independently. Also useful when passing dispatch down via context avoids prop drilling multiple callbacks.</p><p class="learn-p"><b>Q5: What are Error Boundaries and what errors do they catch?</b><br>A: Class components implementing getDerivedStateFromError and/or componentDidCatch that catch errors during rendering, lifecycle methods, and constructors of the component tree below them. They do NOT catch errors in event handlers, async code, or the boundary itself. There is no hook equivalent.</p></div>',
          code: `// ===== Complete Hooks Demo: Searchable User List =====
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchableList() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current++;

  // Debounce the search query
  const debouncedQuery = useDebounce(query, 300);

  // Fetch users when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) { setUsers([]); return; }
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(\`/api/users?search=\${encodeURIComponent(debouncedQuery)}\`, {
      signal: controller.signal
    })
      .then(res => { if (!res.ok) throw new Error('Fetch failed'); return res.json(); })
      .then(data => { setUsers(data); setLoading(false); })
      .catch(err => {
        if (err.name !== 'AbortError') { setError(err.message); setLoading(false); }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  // Memoize filtered + sorted results
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // Memoize callback for child components
  const handleSelect = useCallback((userId) => {
    console.log('Selected user:', userId);
  }, []);

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div>
      <p>Render count: {renderCount.current}</p>
      <input
        ref={inputRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {sortedUsers.map(user => (
          <li key={user.id} onClick={() => handleSelect(user.id)}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}`,
          problems: [
            ['Counter II', 'https://leetcode.com/problems/counter-ii/', 'Easy'],
            ['Debounce', 'https://leetcode.com/problems/debounce/', 'Medium'],
            ['Memoize', 'https://leetcode.com/problems/memoize/', 'Medium']
          ],
          mcqs: [
            {q: 'When does useEffect with an empty dependency array [] run?', o: ['Before every render', 'After every render', 'Only after the first render (mount)', 'Only when props change'], a: 2},
            {q: 'What happens if you call setState with the same reference to a mutated object?', o: ['React re-renders with updated data', 'React skips the re-render (no state change detected)', 'React throws an error', 'React renders twice'], a: 1},
            {q: 'What is the primary difference between useRef and useState?', o: ['useRef can only hold DOM elements', 'Updating useRef.current does NOT trigger a re-render', 'useState is synchronous', 'useRef is reset on every render'], a: 1}
          ]
        },
        {
          t: 'Context API & React Router',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Context API solves prop drilling for global state like themes, auth, and locale. React Router enables client-side navigation in SPAs. Together they form the backbone of React application architecture. Interviews test when to use Context vs state management libraries and routing patterns.</p></div><div class="learn-section"><div class="learn-h">Context API — Global State Without Prop Drilling</div><p class="learn-p">The <b>Context API</b> provides a way to share values (state, functions, theme, auth) across the component tree without passing props through every intermediate level. It consists of three parts: <code>createContext</code>, <code>Provider</code>, and <code>useContext</code>.</p><div class="learn-code">// 1. Create context with default value\nconst ThemeContext = React.createContext(\'light\');\n\n// 2. Provider wraps the tree\nfunction App() {\n  const [theme, setTheme] = useState(\'dark\');\n  return (\n    &lt;ThemeContext.Provider value={{ theme, setTheme }}&gt;\n      &lt;Dashboard /&gt;\n    &lt;/ThemeContext.Provider&gt;\n  );\n}\n\n// 3. Consume with useContext\nfunction ThemedButton() {\n  const { theme, setTheme } = useContext(ThemeContext);\n  return &lt;button className={theme}&gt;Toggle&lt;/button&gt;;\n}</div><div class="learn-warn"><b>Warning:</b> Context causes ALL consumers to re-render when the provider\'s value changes. Split contexts by concern (AuthContext, ThemeContext, CartContext) and memoize the provider value to minimize unnecessary re-renders.</div></div><div class="learn-section"><div class="learn-h">React Router (v6)</div><p class="learn-p"><b>React Router</b> enables client-side routing in SPAs. In v6, routes are defined declaratively using <code>&lt;Routes&gt;</code> and <code>&lt;Route&gt;</code>. Key hooks: <code>useNavigate</code>, <code>useParams</code>, <code>useSearchParams</code>, <code>useLocation</code>.</p><div class="learn-code">import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from \'react-router-dom\';\n\nfunction App() {\n  return (\n    &lt;BrowserRouter&gt;\n      &lt;nav&gt;\n        &lt;Link to="/"&gt;Home&lt;/Link&gt;\n        &lt;Link to="/users"&gt;Users&lt;/Link&gt;\n      &lt;/nav&gt;\n      &lt;Routes&gt;\n        &lt;Route path="/" element={&lt;Home /&gt;} /&gt;\n        &lt;Route path="/users" element={&lt;Users /&gt;} /&gt;\n        &lt;Route path="/users/:id" element={&lt;UserDetail /&gt;} /&gt;\n        &lt;Route path="*" element={&lt;NotFound /&gt;} /&gt;\n      &lt;/Routes&gt;\n    &lt;/BrowserRouter&gt;\n  );\n}</div></div><div class="learn-section"><div class="learn-h">Protected Routes &amp; Layout Routes</div><p class="learn-p"><b>Protected routes</b> restrict access to authenticated users. Use a wrapper component that checks auth state and redirects unauthenticated users. <b>Layout routes</b> (using <code>&lt;Outlet /&gt;</code>) share UI (navbar, sidebar) across multiple child routes.</p><div class="learn-code">function ProtectedRoute({ children }) {\n  const { user } = useAuth();\n  if (!user) return &lt;Navigate to="/login" replace /&gt;;\n  return children;\n}\n\n// Layout route with Outlet\nfunction DashboardLayout() {\n  return (\n    &lt;div className="flex"&gt;\n      &lt;Sidebar /&gt;\n      &lt;main&gt;&lt;Outlet /&gt;&lt;/main&gt;\n    &lt;/div&gt;\n  );\n}</div><div class="learn-tip"><b>Tip:</b> Use <code>replace</code> prop on <code>&lt;Navigate&gt;</code> to replace the current history entry instead of pushing, preventing users from navigating back to the restricted page.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Context re-renders:</b> ALL consumers re-render when the context value changes, even if they only use part of it. Split contexts by update frequency or use useMemo on the value.</li><li><b>Not for frequent updates:</b> Context is not optimized for high-frequency state changes (e.g., mouse position). Use a state management library for that.</li><li><b>Router v6 changes:</b> v6 replaced Switch with Routes, component prop with element, and useHistory with useNavigate.</li><li><b>Nested routes:</b> Use &lt;Outlet /&gt; in parent components to render child routes.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Context vs Redux?</b><br>A: Context is built-in and good for low-frequency global state (theme, auth). Redux is better for complex state with many consumers, middleware, and devtools.</p><p class="learn-p"><b>Q2: How does client-side routing work?</b><br>A: React Router uses the History API to change the URL without a page reload, then renders the matching component based on the URL path.</p></div>',
          code: `// ===== Context API + React Router: Full Auth Example =====
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, Outlet, useNavigate, useParams } from 'react-router-dom';

// Auth Context
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = useCallback((credentials) => {
    // Simulate API call
    return fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    .then(res => res.json())
    .then(data => { setUser(data.user); return data; });
  }, []);
  const logout = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => useContext(AuthContext);

// Protected Route wrapper
function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Layout with shared navigation
function AppLayout() {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        {user ? (
          <button onClick={logout}>Logout ({user.name})</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <main><Outlet /></main>
    </div>
  );
}

// Page Components
function Home() { return <h1>Welcome Home</h1>; }
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email: 'user@test.com', password: 'pass' });
    navigate('/dashboard');
  };
  return <form onSubmit={handleSubmit}><button type="submit">Login</button></form>;
}
function Dashboard() { return <h1>Protected Dashboard</h1>; }
function UserProfile() {
  const { id } = useParams();
  return <h1>User Profile: {id}</h1>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users/:id" element={<UserProfile />} />
            </Route>
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}`,
          problems: [
            ['Array Wrapper', 'https://leetcode.com/problems/array-wrapper/', 'Easy'],
            ['Calculator with Method Chaining', 'https://leetcode.com/problems/calculator-with-method-chaining/', 'Easy'],
            ['Nested Array Generator', 'https://leetcode.com/problems/nested-array-generator/', 'Medium']
          ],
          mcqs: [
            {q: 'What happens when the Context Provider value changes?', o: ['Only the Provider re-renders', 'All consumers of that context re-render', 'The entire app re-renders', 'Nothing until useContext is called again'], a: 1},
            {q: 'In React Router v6, which component renders child route elements inside a parent layout?', o: ['<Switch />', '<Route />', '<Outlet />', '<Children />'], a: 2},
            {q: 'What is the purpose of the replace prop on Navigate?', o: ['It replaces the component', 'It replaces the current history entry instead of pushing', 'It replaces the URL parameters', 'It forces a full page reload'], a: 1}
          ]
        },
        {
          t: 'Performance Optimization & Custom Hooks',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">React performance optimization prevents unnecessary re-renders in large applications. Custom hooks extract and reuse stateful logic across components. Interviews test your ability to profile, identify bottlenecks, and apply React.memo, useMemo, and useCallback correctly — not just blindly.</p></div><div class="learn-section"><div class="learn-h">React.memo — Preventing Unnecessary Re-renders</div><p class="learn-p"><b>React.memo</b> is a higher-order component that memoizes the rendered output. If a component receives the same props, React skips re-rendering it and reuses the last result. By default it does a <b>shallow comparison</b> of props.</p><div class="learn-code">const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {\n  console.log(\'Rendering ExpensiveList\');\n  return items.map(item =&gt; (\n    &lt;div key={item.id} onClick={() =&gt; onSelect(item.id)}&gt;{item.name}&lt;/div&gt;\n  ));\n});\n\n// Custom comparison function\nconst MemoWithCompare = React.memo(Component, (prevProps, nextProps) =&gt; {\n  return prevProps.id === nextProps.id; // return true to skip re-render\n});</div></div><div class="learn-section"><div class="learn-h">Code Splitting &amp; Lazy Loading</div><p class="learn-p"><b>Code splitting</b> reduces initial bundle size by loading code on demand. Use <code>React.lazy()</code> with <code>Suspense</code> for route-based or component-based splitting.</p><div class="learn-code">const Dashboard = React.lazy(() =&gt; import(\'./Dashboard\'));\n\nfunction App() {\n  return (\n    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;\n      &lt;Dashboard /&gt;\n    &lt;/Suspense&gt;\n  );\n}</div><p class="learn-p">For route-based splitting, wrap each route\'s component with <code>React.lazy</code>. Vite and Webpack automatically create separate chunks for dynamic imports.</p></div><div class="learn-section"><div class="learn-h">Virtualization &amp; Profiling</div><p class="learn-p">For rendering large lists (thousands of items), use <b>virtualization</b> libraries like <code>react-window</code> or <code>@tanstack/virtual</code>. They render only the visible items, dramatically improving performance.</p><p class="learn-p">Use the <b>React DevTools Profiler</b> to identify performance bottlenecks. It shows component render times, how often components re-render, and why they re-rendered.</p><div class="learn-tip"><b>Tip:</b> Common performance killers: (1) creating new objects/arrays/functions in render, (2) missing keys in lists, (3) unnecessary context consumers, (4) large component trees without memoization.</div></div><div class="learn-section"><div class="learn-h">Custom Hooks — Reusable Logic</div><p class="learn-p"><b>Custom hooks</b> extract reusable stateful logic from components. They are regular functions that start with <code>use</code> and can call other hooks. They share <em>logic</em>, not <em>state</em> — each component using the hook gets its own state instance.</p><div class="learn-code">function useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() =&gt; {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initialValue;\n  });\n  useEffect(() =&gt; {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  return [value, setValue];\n}\n\n// Usage: const [theme, setTheme] = useLocalStorage(\'theme\', \'dark\');</div><div class="learn-warn"><b>Warning:</b> Custom hooks must follow the <b>Rules of Hooks</b>: only call hooks at the top level (not inside loops, conditions, or nested functions), and only from React function components or other custom hooks.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Premature optimization:</b> Do not wrap everything in React.memo or useMemo. Profile first — most components do not need optimization.</li><li><b>React.memo is shallow:</b> It only compares props shallowly. If you pass new objects/arrays each render, memo will not help.</li><li><b>Custom hook rules:</b> Custom hooks must start with "use" prefix and follow the Rules of Hooks. They can call other hooks but cannot be called conditionally.</li><li><b>Overusing useCallback:</b> useCallback has its own cost (dependency comparison). Only use it when passing callbacks to memoized children.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: When should you use React.memo?</b><br>A: When a component re-renders often with the same props, and rendering is expensive. Profile with React DevTools before adding memo.</p><p class="learn-p"><b>Q2: What makes a good custom hook?</b><br>A: It encapsulates reusable stateful logic (useLocalStorage, useFetch, useDebounce). It composes other hooks and returns values/functions for the consumer.</p></div>',
          code: `// ===== Performance: React.memo + useMemo + useCallback =====
import React, { useState, useMemo, useCallback, Suspense } from 'react';

// Memoized child component — only re-renders when props change
const TodoItem = React.memo(function TodoItem({ todo, onToggle, onDelete }) {
  console.log('Rendering TodoItem:', todo.id);
  return (
    <li className={todo.done ? 'line-through' : ''}>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});

// ===== Custom Hooks =====
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  React.useEffect(() => {
    const controller = new AbortController();
    setState(prev => ({ ...prev, loading: true, error: null }));

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, { toggle, setTrue, setFalse }];
}

// ===== Main Component Using Everything =====
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showStats, { toggle: toggleStats }] = useToggle(false);

  // Memoize filtered todos
  const filtered = useMemo(() => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.done);
      case 'done': return todos.filter(t => t.done);
      default: return todos;
    }
  }, [todos, filter]);

  // Memoize stats calculation
  const stats = useMemo(() => ({
    total: todos.length,
    done: todos.filter(t => t.done).length,
    active: todos.filter(t => !t.done).length
  }), [todos]);

  // Stable callback references for memoized children
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div>
      <h1>Todos ({stats.active} active)</h1>
      <button onClick={toggleStats}>{showStats ? 'Hide' : 'Show'} Stats</button>
      {showStats && <p>Total: {stats.total} | Done: {stats.done}</p>}
      <div>
        {['all', 'active', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={filter === f ? 'active' : ''}>{f}</button>
        ))}
      </div>
      <ul>
        {filtered.map(todo => (
          <TodoItem key={todo.id} todo={todo}
            onToggle={handleToggle} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}`,
          problems: [
            ['Memoize II', 'https://leetcode.com/problems/memoize-ii/', 'Hard'],
            ['Snail Traversal', 'https://leetcode.com/problems/snail-traversal/', 'Medium'],
            ['Curry', 'https://leetcode.com/problems/curry/', 'Medium']
          ],
          mcqs: [
            {q: 'React.memo performs what type of comparison on props by default?', o: ['Deep equality', 'Shallow equality', 'Reference equality only', 'JSON.stringify comparison'], a: 1},
            {q: 'Custom hooks must follow which naming convention?', o: ['Start with "hook"', 'Start with "use"', 'Start with "custom"', 'End with "Hook"'], a: 1},
            {q: 'What does React.lazy() enable?', o: ['Lazy state initialization', 'Code splitting via dynamic import', 'Delayed rendering by time', 'Background data fetching'], a: 1}
          ]
        },
        {
          t: 'Testing (Jest, React Testing Library, Cypress)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">A production deployment that lacks proper test coverage is a ticking time bomb. At a fintech company, an untested edge case in payment processing caused $2M in duplicate charges before detection. Testing at every level — unit, integration, and end-to-end — catches bugs before they reach users, enables confident refactoring, and serves as living documentation. Knowing Jest, React Testing Library, and Cypress is a core competency expected in MERN stack interviews.</p></div><div class="learn-section"><div class="learn-h">Testing Pyramid</div><table class="learn-table"><tr><th>Level</th><th>Tool</th><th>Speed</th><th>What It Tests</th></tr><tr><td>Unit Tests</td><td>Jest</td><td>Fast (ms)</td><td>Individual functions, hooks, utilities</td></tr><tr><td>Integration Tests</td><td>React Testing Library</td><td>Medium</td><td>Components interacting with each other</td></tr><tr><td>E2E Tests</td><td>Cypress / Playwright</td><td>Slow (sec)</td><td>Full user flows in a browser</td></tr></table></div><div class="learn-section"><div class="learn-h">Jest — JavaScript Test Framework</div><p class="learn-p">Jest provides test runner, assertions, mocking, and code coverage out of the box.</p><div class="learn-code">// sum.test.js\nconst sum = require(\'./sum\');\n\ndescribe(\'sum\', () => {\n  test(\'adds two numbers\', () => {\n    expect(sum(1, 2)).toBe(3);\n  });\n\n  test(\'handles negative numbers\', () => {\n    expect(sum(-1, -2)).toBe(-3);\n  });\n});\n\n// Common matchers:\n// .toBe(value)         — strict equality (===)\n// .toEqual(obj)        — deep equality\n// .toBeTruthy()        — truthy check\n// .toThrow()           — expects function to throw\n// .toHaveBeenCalled()  — mock function was called\n// .toMatchSnapshot()   — snapshot testing</div></div><div class="learn-section"><div class="learn-h">React Testing Library (RTL)</div><p class="learn-p">RTL tests components the way users interact with them — by querying DOM elements by role, text, label, etc. instead of implementation details like component state or props.</p><div class="learn-code">import { render, screen, fireEvent } from \'@testing-library/react\';\nimport Counter from \'./Counter\';\n\ntest(\'increments counter\', () => {\n  render(&lt;Counter /&gt;);\n  const button = screen.getByRole(\'button\', { name: /increment/i });\n  fireEvent.click(button);\n  expect(screen.getByText(\'Count: 1\')).toBeInTheDocument();\n});\n\n// Query priority (most to least preferred):\n// getByRole > getByLabelText > getByPlaceholderText >\n// getByText > getByDisplayValue > getByTestId</div><div class="learn-tip"><b>Key principle:</b> "The more your tests resemble the way your software is used, the more confidence they give you." Test behavior, not implementation.</div></div><div class="learn-section"><div class="learn-h">Mocking in Jest</div><div class="learn-code">// Mock a module\njest.mock(\'./api\', () => ({\n  fetchUsers: jest.fn(() => Promise.resolve([{name: \'Alice\'}]))\n}));\n\n// Mock a function\nconst mockFn = jest.fn();\nmockFn.mockReturnValue(42);\nmockFn.mockResolvedValue({data: []});  // async mock\n\n// Spy on existing method\njest.spyOn(console, \'log\').mockImplementation(() => {});</div></div><div class="learn-section"><div class="learn-h">Cypress — E2E Testing</div><div class="learn-code">// cypress/e2e/login.cy.js\ndescribe(\'Login\', () => {\n  it(\'logs in successfully\', () => {\n    cy.visit(\'/login\');\n    cy.get(\'[data-testid="email"]\').type(\'user@example.com\');\n    cy.get(\'[data-testid="password"]\').type(\'password123\');\n    cy.get(\'button[type="submit"]\').click();\n    cy.url().should(\'include\', \'/dashboard\');\n    cy.contains(\'Welcome\').should(\'be.visible\');\n  });\n});</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Testing implementation details:</b> Testing internal state or component methods instead of behavior makes tests brittle — they break on refactors that don\'t change functionality</li><li><b>Not using <code>waitFor</code> for async operations:</b> Assertions on async-rendered content fail intermittently without proper waiting mechanisms</li><li><b>Over-mocking:</b> Mocking too many modules creates tests that pass but don\'t verify real behavior — mock at the boundary (API calls), not internal functions</li><li><b>Snapshot testing overuse:</b> Large snapshots are rarely reviewed and become a rubber-stamp approval — use targeted assertions instead</li><li><b>Not cleaning up between tests:</b> Shared state between tests causes order-dependent failures — use <code>beforeEach</code>/<code>afterEach</code> for cleanup</li><li><b>Ignoring flaky tests:</b> Flaky tests erode team confidence in the test suite — fix or quarantine them immediately</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><p class="learn-p">Choosing the right testing tools and strategies depends on your project needs, team size, and deployment frequency.</p><table class="learn-table"><tr><th>Feature</th><th>Jest</th><th>Vitest</th></tr><tr><td>Speed</td><td>Good with workers</td><td>Faster — uses Vite\'s transform pipeline</td></tr><tr><td>ESM support</td><td>Experimental</td><td>Native</td></tr><tr><td>Configuration</td><td>Extensive, mature</td><td>Minimal, Vite-compatible</td></tr><tr><td>Watch mode</td><td>Good</td><td>Instant — HMR-based</td></tr><tr><td>Ecosystem</td><td>Largest — most tutorials and plugins</td><td>Growing — Jest-compatible API</td></tr></table><table class="learn-table"><tr><th>Feature</th><th>React Testing Library</th><th>Enzyme</th></tr><tr><td>Philosophy</td><td>Test user behavior</td><td>Test component internals</td></tr><tr><td>Query methods</td><td>By role, text, label (accessible)</td><td>By component, props, state</td></tr><tr><td>Hooks support</td><td>Full support</td><td>Limited — requires workarounds</td></tr><tr><td>Maintenance</td><td>Actively maintained</td><td>Deprecated — no React 18 support</td></tr><tr><td>Industry adoption</td><td>Standard for new projects</td><td>Legacy projects only</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the testing pyramid and how does it guide test strategy?</b><br>A: The testing pyramid has three layers: Unit tests (base, most numerous, fastest), Integration tests (middle, test component interactions), and E2E tests (top, fewest, slowest). More tests at the base give fast feedback; fewer at the top give high confidence but are expensive. A balanced strategy covers all three levels.</p><p class="learn-p"><b>Q2: Why does React Testing Library prefer querying by role over test IDs?</b><br>A: Querying by role mirrors how users and assistive technologies interact with the UI, making tests more resilient to implementation changes. The query priority is: getByRole &gt; getByLabelText &gt; getByPlaceholderText &gt; getByText &gt; getByTestId. Test IDs are the last resort because they don\'t reflect user experience.</p><p class="learn-p"><b>Q3: How do you test async operations in React components?</b><br>A: Use <code>waitFor</code> or <code>findBy*</code> queries from RTL. Mock API calls with <code>jest.mock</code> or MSW (Mock Service Worker). Render the component, trigger the async action, then use <code>await waitFor(() =&gt; expect(...))</code> to assert on the final state. Always clean up async operations in <code>afterEach</code>.</p><p class="learn-p"><b>Q4: What is the difference between <code>jest.fn()</code>, <code>jest.mock()</code>, and <code>jest.spyOn()</code>?</b><br>A: <code>jest.fn()</code> creates a standalone mock function. <code>jest.mock(\'./module\')</code> replaces an entire module with mocks. <code>jest.spyOn(obj, \'method\')</code> wraps an existing method to track calls while optionally preserving original behavior.</p><p class="learn-p"><b>Q5: When would you use Cypress over React Testing Library?</b><br>A: Cypress is for end-to-end tests that verify complete user flows across multiple pages, including real network requests, browser behavior, cookies, and navigation. RTL is for component-level integration tests that verify rendering and user interactions in isolation. Use Cypress for critical paths (login, checkout) and RTL for component behavior.</p></div>',
          code: `// ===== Jest + RTL Testing Examples =====

// --- Unit test: utility function ---
// utils.test.js
const { formatCurrency, debounce } = require('./utils');

describe('formatCurrency', () => {
  test('formats positive amounts', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  test('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  test('handles negative', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });
});

// --- Integration test: React component ---
// UserList.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserList from './UserList';
import * as api from './api';

jest.mock('./api');

describe('UserList', () => {
  test('renders users after loading', async () => {
    api.fetchUsers.mockResolvedValue([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);

    render(<UserList />);

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Loaded state
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  test('shows error on API failure', async () => {
    api.fetchUsers.mockRejectedValue(new Error('Network error'));
    render(<UserList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

// --- Testing custom hooks ---
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

test('useCounter increments and decrements', () => {
  const { result } = renderHook(() => useCounter(0));
  expect(result.current.count).toBe(0);

  act(() => result.current.increment());
  expect(result.current.count).toBe(1);

  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});

// --- Cypress E2E ---
// cypress/e2e/todo.cy.js
// describe('Todo App', () => {
//   beforeEach(() => cy.visit('/'));
//
//   it('adds and completes a todo', () => {
//     cy.get('[data-testid="todo-input"]').type('Buy groceries{enter}');
//     cy.contains('Buy groceries').should('exist');
//     cy.get('[data-testid="todo-checkbox"]').first().click();
//     cy.contains('Buy groceries').should('have.class', 'completed');
//   });
// });`,
          problems: [
          ],
          mcqs: [
            {q: 'React Testing Library\'s guiding principle is to test:', o: ['Component state and props', 'Implementation details', 'How users interact with the UI', 'Render cycle count'], a: 2},
            {q: 'Which Jest function creates a mock function?', o: ['jest.create()', 'jest.fn()', 'jest.mock()', 'jest.spy()'], a: 1},
            {q: 'In the testing pyramid, which tests should be most numerous?', o: ['E2E tests', 'Integration tests', 'Unit tests', 'Manual tests'], a: 2},
            {q: 'Which query method should you use FIRST according to RTL priority?', o: ['getByTestId', 'getByText', 'getByRole', 'getByClassName'], a: 2},
            {q: 'What does jest.spyOn() do differently from jest.fn()?', o: ['Nothing — they are identical', 'spyOn wraps an existing method while fn creates a standalone mock', 'spyOn is for async functions only', 'fn tracks calls, spyOn does not'], a: 1},
            {q: 'What is the purpose of waitFor in React Testing Library?', o: ['To add artificial delays', 'To wait for async DOM updates before asserting', 'To wait for component mounting', 'To delay test execution for debugging'], a: 1},
            {q: 'Which tool is recommended for mocking API requests in integration tests?', o: ['Nock', 'Mock Service Worker (MSW)', 'Sinon', 'All of the above work, but MSW is recommended for RTL'], a: 3}
          ]
        }
      ]
    },
    {
      id: 'node', t: 'Node.js & Express',
      topics: [
        {
          t: 'Node.js Event Loop & Express Basics',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Node.js powers backend JavaScript with a non-blocking, event-driven architecture. Understanding the event loop, libuv, and Express middleware is essential for building scalable APIs. Backend interviews test your mental model of how async operations are scheduled and processed.</p></div><div class="learn-section"><div class="learn-h">Node.js Architecture</div><p class="learn-p"><b>Node.js</b> is a JavaScript runtime built on Chrome\'s V8 engine. It uses an <b>event-driven, non-blocking I/O</b> model powered by <b>libuv</b>. This makes it excellent for I/O-intensive applications (APIs, real-time apps) but less suitable for CPU-intensive tasks without worker threads.</p><p class="learn-p">The Node.js event loop has <b>six phases</b>: (1) <b>Timers</b> — executes setTimeout/setInterval callbacks, (2) <b>Pending callbacks</b> — I/O callbacks deferred to next iteration, (3) <b>Idle/Prepare</b> — internal use, (4) <b>Poll</b> — retrieves new I/O events and executes their callbacks, (5) <b>Check</b> — setImmediate callbacks, (6) <b>Close callbacks</b> — socket.on(\'close\') etc. Microtasks (Promise, process.nextTick) run between each phase.</p><div class="learn-tip"><b>Tip:</b> <code>process.nextTick()</code> has higher priority than Promise microtasks. It runs before any other microtask in the queue. Overusing it can starve the event loop.</div></div><div class="learn-section"><div class="learn-h">Express.js Basics</div><p class="learn-p"><b>Express</b> is a minimal, flexible web framework for Node.js. It provides routing, middleware support, and template rendering. The core concepts are: <b>Application</b> (the Express instance), <b>Router</b> (modular route handler), <b>Middleware</b> (functions with access to req, res, next), and <b>Route handlers</b>.</p><div class="learn-code">const express = require(\'express\');\nconst app = express();\n\n// Built-in middleware\napp.use(express.json()); // parse JSON bodies\napp.use(express.urlencoded({ extended: true })); // parse form data\n\n// Route with handler\napp.get(\'/api/users\', (req, res) =&gt; {\n  res.json({ users: [] });\n});\n\napp.listen(3000, () =&gt; console.log(\'Server on port 3000\'));</div></div><div class="learn-section"><div class="learn-h">Middleware Chain</div><p class="learn-p">Middleware functions execute sequentially in the order they are registered. Each middleware receives <code>(req, res, next)</code>. Call <code>next()</code> to pass control to the next middleware, or send a response to end the cycle. Middleware can be <b>application-level</b>, <b>router-level</b>, <b>error-handling</b>, or <b>third-party</b>.</p><div class="learn-code">// Custom logging middleware\nconst logger = (req, res, next) =&gt; {\n  console.log(\\`${\'${req.method} ${req.url}\'} - ${\'${new Date().toISOString()}\'}\\`);\n  next();\n};\napp.use(logger);\n\n// Error-handling middleware (4 params)\napp.use((err, req, res, next) =&gt; {\n  console.error(err.stack);\n  res.status(500).json({ error: \'Internal Server Error\' });\n});</div><div class="learn-warn"><b>Warning:</b> Error-handling middleware must have exactly 4 parameters <code>(err, req, res, next)</code>. Express identifies it by the parameter count. Omitting any parameter changes its behavior.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Blocking the event loop:</b> CPU-intensive operations (JSON parsing large payloads, crypto, image processing) block the single-threaded event loop, freezing all requests. Offload to worker threads.</li><li><b>Middleware order:</b> Express middleware executes in registration order. Error-handling middleware must have 4 parameters (err, req, res, next) and be registered last.</li><li><b>Uncaught exceptions:</b> An uncaught exception crashes the Node process. Use process.on("uncaughtException") as a safety net, but fix the root cause.</li><li><b>Callback hell:</b> Deeply nested callbacks. Solved by Promises and async/await.</li></ul></div><div class="learn-section"><div class="learn-h">Node.js Streams</div><p class="learn-p"><b>Streams</b> process data in chunks rather than loading entire contents into memory, making them essential for handling large files, network data, and real-time processing. There are four stream types:</p><table class="learn-table"><tr><th>Type</th><th>Purpose</th><th>Example</th></tr><tr><td><b>Readable</b></td><td>Source of data</td><td>fs.createReadStream(), http request</td></tr><tr><td><b>Writable</b></td><td>Destination for data</td><td>fs.createWriteStream(), http response</td></tr><tr><td><b>Duplex</b></td><td>Both readable and writable</td><td>TCP socket, WebSocket</td></tr><tr><td><b>Transform</b></td><td>Modify data as it passes through</td><td>zlib.createGzip(), crypto cipher</td></tr></table><div class="learn-code">const fs = require(\'fs\');\nconst zlib = require(\'zlib\');\n\n// Pipe: read file → compress → write compressed file\nfs.createReadStream(\'large-file.log\')       // Readable\n  .pipe(zlib.createGzip())                   // Transform\n  .pipe(fs.createWriteStream(\'file.log.gz\')) // Writable\n  .on(\'finish\', () =&gt; console.log(\'Compressed\'));\n\n// Stream a file in an Express response (memory-efficient)\napp.get(\'/download/:file\', (req, res) =&gt; {\n  const stream = fs.createReadStream(\\`./files/${\'${req.params.file}\'}\\`);\n  stream.pipe(res);\n  stream.on(\'error\', () =&gt; res.status(404).end());\n});</div><p class="learn-p"><b>Backpressure</b> occurs when the writable stream cannot consume data as fast as the readable produces it. The <code>.pipe()</code> method handles backpressure automatically by pausing the readable when the writable\'s internal buffer is full. When manually piping, check the return value of <code>writable.write()</code> and listen for the <code>drain</code> event.</p></div><div class="learn-section"><div class="learn-h">Worker Threads &amp; Cluster</div><p class="learn-p">Node.js is single-threaded for JavaScript execution, but provides two mechanisms for parallelism:</p><ul class="learn-list"><li><b>Cluster module:</b> Forks multiple Node.js processes sharing the same port. Each worker is a separate process with its own event loop and memory. Ideal for utilizing all CPU cores for HTTP servers.</li><li><b>Worker Threads:</b> Runs JavaScript in parallel threads within one process, sharing memory via SharedArrayBuffer. Ideal for CPU-intensive computations (image processing, crypto, parsing) without blocking the main event loop.</li></ul><div class="learn-code">// Cluster: one worker per CPU core\nconst cluster = require(\'cluster\');\nconst os = require(\'os\');\nif (cluster.isPrimary) {\n  for (let i = 0; i &lt; os.cpus().length; i++) cluster.fork();\n  cluster.on(\'exit\', (w) =&gt; { console.log(\\`Worker ${\'${w.process.pid}\'} died\\`); cluster.fork(); });\n} else {\n  require(\'./server\'); // each worker runs the Express app\n}</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain the Node.js event loop phases.</b><br>A: Timers (setTimeout/setInterval) → I/O callbacks → idle/prepare → poll (I/O) → check (setImmediate) → close callbacks. Microtasks (Promises) run between each phase.</p><p class="learn-p"><b>Q2: Why is Node.js single-threaded but highly concurrent?</b><br>A: The event loop delegates I/O to the OS kernel (epoll/kqueue) or libuv thread pool. While waiting for I/O, the event loop handles other requests. Only CPU work blocks it.</p><p class="learn-p"><b>Q3: What are Node.js Streams and when should you use them?</b><br>A: Streams process data in chunks instead of loading everything into memory. Use them for large files, network transfers, and real-time data. Four types: Readable, Writable, Duplex, Transform. Pipe them together with <code>.pipe()</code> which also handles backpressure automatically.</p><p class="learn-p"><b>Q4: Cluster module vs Worker Threads?</b><br>A: Cluster forks separate processes sharing a port — ideal for scaling HTTP servers across CPU cores. Worker Threads run parallel JS threads in one process with shared memory — ideal for offloading CPU-intensive work without blocking the event loop.</p></div>',
          code: `// ===== Express Server with Middleware Stack =====
const express = require('express');
const app = express();

// ===== Built-in Middleware =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===== Custom Middleware: Request Logger =====
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.originalUrl} \${res.statusCode} \${duration}ms\`);
  });
  next();
});

// ===== Modular Router =====
const userRouter = express.Router();

// GET /api/users — list all users
userRouter.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'name' } = req.query;
    // Simulate DB query
    const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    res.json({
      data: users,
      pagination: { page: +page, limit: +limit, total: users.length }
    });
  } catch (err) { next(err); }
});

// GET /api/users/:id — get single user
userRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = { id: +id, name: 'Alice', email: 'alice@example.com' };
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (err) { next(err); }
});

// POST /api/users — create user
userRouter.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }
    const newUser = { id: Date.now(), name, email };
    res.status(201).json({ data: newUser });
  } catch (err) { next(err); }
});

app.use('/api/users', userRouter);

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ error: \`Route \${req.originalUrl} not found\` });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
          problems: [
            ['Build a REST API', 'https://www.hackerrank.com/skills-verification/nodejs_intermediate', 'Medium'],
            ['Node.js Event Loop Quiz', 'https://www.geeksforgeeks.org/node-js-event-loop/', 'Easy']
          ],
          mcqs: [
            {q: 'In which event loop phase do setTimeout callbacks execute?', o: ['Poll', 'Check', 'Timers', 'Close callbacks'], a: 2},
            {q: 'How does Express identify error-handling middleware?', o: ['By the name "errorHandler"', 'By the .error() method', 'By having exactly 4 parameters (err, req, res, next)', 'By being registered last'], a: 2},
            {q: 'What does process.nextTick() do?', o: ['Schedules a macrotask', 'Executes callback before any other microtask in the queue', 'Pauses the event loop', 'Schedules for the next event loop iteration only'], a: 1}
          ]
        },
        {
          t: 'REST API Design & Best Practices',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">REST APIs are the standard interface between frontend and backend. Clean API design with proper HTTP methods, status codes, and resource naming makes systems maintainable and intuitive. As a software developer, API design is a core skill, and interviews test it in system design rounds.</p></div><div class="learn-section"><div class="learn-h">RESTful API Principles</div><p class="learn-p"><b>REST</b> (Representational State Transfer) is an architectural style for designing networked applications. Key constraints: <b>Client-Server</b> separation, <b>Statelessness</b> (each request contains all needed information), <b>Cacheability</b>, <b>Uniform Interface</b>, and <b>Layered System</b>.</p><table class="learn-table"><tr><th>HTTP Method</th><th>CRUD</th><th>Endpoint</th><th>Description</th></tr><tr><td>GET</td><td>Read</td><td>/api/users</td><td>List all users</td></tr><tr><td>GET</td><td>Read</td><td>/api/users/:id</td><td>Get specific user</td></tr><tr><td>POST</td><td>Create</td><td>/api/users</td><td>Create new user</td></tr><tr><td>PUT</td><td>Update (full)</td><td>/api/users/:id</td><td>Replace user entirely</td></tr><tr><td>PATCH</td><td>Update (partial)</td><td>/api/users/:id</td><td>Update specific fields</td></tr><tr><td>DELETE</td><td>Delete</td><td>/api/users/:id</td><td>Remove user</td></tr></table></div><div class="learn-section"><div class="learn-h">URL Design &amp; Naming Conventions</div><p class="learn-p">Use <b>nouns</b> (not verbs) for resources. Use <b>plural</b> names: <code>/api/users</code>, not <code>/api/user</code>. Nest related resources: <code>/api/users/:id/posts</code>. Use query parameters for filtering, sorting, and pagination: <code>/api/users?role=admin&amp;sort=-createdAt&amp;page=2&amp;limit=20</code>.</p><div class="learn-tip"><b>Tip:</b> Version your API in the URL (<code>/api/v1/users</code>) or via headers (<code>Accept: application/vnd.api.v1+json</code>). URL versioning is simpler and more common.</div></div><div class="learn-section"><div class="learn-h">Response Format &amp; Status Codes</div><p class="learn-p">Use consistent JSON response envelopes. Return appropriate HTTP status codes:</p><ul class="learn-list"><li><b>200</b> OK — successful GET/PUT/PATCH</li><li><b>201</b> Created — successful POST</li><li><b>204</b> No Content — successful DELETE</li><li><b>400</b> Bad Request — validation errors</li><li><b>401</b> Unauthorized — missing/invalid auth</li><li><b>403</b> Forbidden — authenticated but not authorized</li><li><b>404</b> Not Found — resource doesn\'t exist</li><li><b>409</b> Conflict — duplicate resource</li><li><b>422</b> Unprocessable Entity — semantic validation failure</li><li><b>429</b> Too Many Requests — rate limited</li><li><b>500</b> Internal Server Error — server-side failure</li></ul><div class="learn-code">// Success response\n{ "data": { "id": 1, "name": "Alice" }, "meta": { "requestId": "abc123" } }\n\n// Error response\n{ "error": { "code": "VALIDATION_ERROR", "message": "Email is required", "details": [...] } }</div></div><div class="learn-section"><div class="learn-h">Pagination, Filtering &amp; HATEOAS</div><p class="learn-p">Implement <b>cursor-based</b> or <b>offset-based</b> pagination. Cursor-based is more performant for large datasets. Include pagination metadata in responses. <b>HATEOAS</b> (Hypermedia as the Engine of Application State) includes links in responses to guide clients.</p><div class="learn-warn"><b>Warning:</b> Offset-based pagination becomes slow on large tables because the DB must scan and skip rows. Use cursor-based pagination (keyset) for production APIs with large datasets.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Verbs in URLs:</b> Use nouns for resources: GET /users, not GET /getUsers. The HTTP method IS the verb.</li><li><b>Wrong status codes:</b> 200 for errors, 404 for empty results. Use 201 for created, 204 for no content, 400 for client error, 404 for not found, 500 for server error.</li><li><b>N+1 query problem:</b> Fetching a list then querying each item individually. Use eager loading or GraphQL.</li><li><b>Missing pagination:</b> Returning unbounded lists. Always paginate with limit/offset or cursor-based pagination.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: PUT vs PATCH?</b><br>A: PUT replaces the entire resource. PATCH partially updates it. PUT is idempotent — calling it twice with the same data produces the same result.</p><p class="learn-p"><b>Q2: How to version an API?</b><br>A: URL path (/v1/users), header (Accept: application/vnd.api.v1+json), or query param (?version=1). URL path is most common.</p></div>',
          code: `// ===== RESTful API with Best Practices =====
const express = require('express');
const router = express.Router();

// Simulated data store
let users = [
  { id: 1, name: 'Alice', email: 'alice@test.com', role: 'admin', createdAt: '2024-01-01' },
  { id: 2, name: 'Bob', email: 'bob@test.com', role: 'user', createdAt: '2024-02-15' }
];
let nextId = 3;

// GET /api/v1/users — List with filtering, sorting, pagination
router.get('/', (req, res) => {
  let result = [...users];
  // Filtering
  if (req.query.role) result = result.filter(u => u.role === req.query.role);
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    result = result.filter(u => u.name.toLowerCase().includes(s));
  }
  // Sorting
  const sortField = req.query.sort || 'createdAt';
  const order = sortField.startsWith('-') ? -1 : 1;
  const field = sortField.replace(/^-/, '');
  result.sort((a, b) => (a[field] > b[field] ? order : -order));
  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const total = result.length;
  const start = (page - 1) * limit;
  result = result.slice(start, start + limit);

  res.json({
    data: result,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    links: {
      self: \`/api/v1/users?page=\${page}&limit=\${limit}\`,
      next: start + limit < total ? \`/api/v1/users?page=\${page+1}&limit=\${limit}\` : null,
      prev: page > 1 ? \`/api/v1/users?page=\${page-1}&limit=\${limit}\` : null
    }
  });
});

// GET /api/v1/users/:id — Get by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  res.json({ data: user });
});

// POST /api/v1/users — Create
router.post('/', (req, res) => {
  const { name, email, role = 'user' } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Name and email are required' }
    });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already exists' } });
  }
  const user = { id: nextId++, name, email, role, createdAt: new Date().toISOString() };
  users.push(user);
  res.status(201).json({ data: user });
});

// PATCH /api/v1/users/:id — Partial update
router.patch('/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  const allowed = ['name', 'email', 'role'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  users[idx] = { ...users[idx], ...updates };
  res.json({ data: users[idx] });
});

// DELETE /api/v1/users/:id
router.delete('/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  users.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;`,
          problems: [
            ['Design a URL Shortener', 'https://www.geeksforgeeks.org/how-to-design-a-tiny-url-or-url-shortener/', 'Medium'],
            ['REST API Design', 'https://www.hackerrank.com/skills-verification/rest_api_intermediate', 'Medium']
          ],
          mcqs: [
            {q: 'Which HTTP method is idempotent but NOT safe?', o: ['GET', 'POST', 'PUT', 'PATCH'], a: 2},
            {q: 'What status code should be returned after a successful DELETE?', o: ['200 OK', '201 Created', '204 No Content', '202 Accepted'], a: 2},
            {q: 'Why is cursor-based pagination preferred over offset for large datasets?', o: ['It is simpler to implement', 'It avoids scanning/skipping rows, maintaining constant performance', 'It supports more parameters', 'It is required by REST spec'], a: 1}
          ]
        },
        {
          t: 'Authentication (JWT, OAuth 2.0)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Authentication and authorization are critical for any web application. Understanding JWT structure, OAuth 2.0 flows, and session management is essential for building secure systems. Interviews test security awareness — token storage, expiration strategies, and common vulnerabilities.</p></div><div class="learn-section"><div class="learn-h">JSON Web Tokens (JWT)</div><p class="learn-p"><b>JWT</b> is a compact, URL-safe token format for securely transmitting claims between parties. A JWT has three parts separated by dots: <b>Header</b> (algorithm, type), <b>Payload</b> (claims — sub, iat, exp, custom data), and <b>Signature</b> (HMAC or RSA signed). The server signs tokens with a secret; clients send them in the <code>Authorization: Bearer &lt;token&gt;</code> header.</p><div class="learn-code">// JWT Structure\nheader.payload.signature\n\n// Header: { "alg": "HS256", "typ": "JWT" }\n// Payload: { "sub": "user123", "role": "admin", "exp": 1700000000 }\n// Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)</div><div class="learn-warn"><b>Warning:</b> Never store sensitive data in the JWT payload — it is only base64-encoded, NOT encrypted. Anyone can decode and read it. Only the signature prevents tampering.</div></div><div class="learn-section"><div class="learn-h">Access &amp; Refresh Token Pattern</div><p class="learn-p">Use <b>short-lived access tokens</b> (15 min) for API authorization and <b>long-lived refresh tokens</b> (7-30 days) to obtain new access tokens without re-authentication. Store refresh tokens in <b>HTTP-only, Secure cookies</b> (not localStorage) to prevent XSS attacks.</p><table class="learn-table"><tr><th>Token</th><th>Lifetime</th><th>Storage</th><th>Purpose</th></tr><tr><td>Access Token</td><td>15 min</td><td>Memory / short-lived cookie</td><td>API authorization</td></tr><tr><td>Refresh Token</td><td>7-30 days</td><td>HTTP-only Secure cookie</td><td>Get new access tokens</td></tr></table><div class="learn-tip"><b>Tip:</b> Implement <b>token rotation</b> for refresh tokens — issue a new refresh token with each use and invalidate the old one. This limits the damage from stolen refresh tokens.</div></div><div class="learn-section"><div class="learn-h">OAuth 2.0 Authorization Code Flow</div><p class="learn-p"><b>OAuth 2.0</b> enables third-party login (Google, GitHub) without sharing passwords. The <b>Authorization Code flow with PKCE</b> is the recommended approach for web apps:</p><ol class="learn-list"><li>Client redirects user to authorization server with <code>client_id</code>, <code>redirect_uri</code>, <code>scope</code>, <code>code_challenge</code></li><li>User authenticates and consents</li><li>Authorization server redirects back with an <b>authorization code</b></li><li>Client exchanges code + <code>code_verifier</code> for access/refresh tokens (server-to-server)</li><li>Client uses access token to call resource APIs</li></ol></div><div class="learn-section"><div class="learn-h">Password Hashing &amp; Security</div><p class="learn-p">Never store passwords in plain text. Use <b>bcrypt</b> or <b>argon2</b> for hashing — they are intentionally slow and include a salt automatically. Set a cost factor of at least 10 rounds for bcrypt.</p><div class="learn-code">const bcrypt = require(\'bcrypt\');\nconst hash = await bcrypt.hash(password, 12); // 12 rounds\nconst isValid = await bcrypt.compare(password, hash);</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>JWT in localStorage:</b> Vulnerable to XSS attacks. Store tokens in httpOnly cookies for better security.</li><li><b>No logout with JWT:</b> JWTs cannot be invalidated server-side (stateless). Use short expiration + refresh tokens, or maintain a blacklist.</li><li><b>Missing token refresh:</b> Access tokens should be short-lived (15 min). Refresh tokens should be longer (days/weeks) and stored securely.</li><li><b>CSRF with cookies:</b> If using cookies for auth, you need CSRF protection (SameSite attribute, CSRF tokens).</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: JWT structure?</b><br>A: Three base64-encoded parts separated by dots: Header (algorithm, type) . Payload (claims: sub, exp, iat) . Signature (HMAC or RSA). The server verifies the signature without database lookup.</p><p class="learn-p"><b>Q2: OAuth 2.0 Authorization Code flow?</b><br>A: User redirects to auth server → logs in → auth server returns code to redirect URI → backend exchanges code for tokens. The code-for-token exchange happens server-side, keeping the secret safe.</p></div>',
          code: `// ===== JWT Authentication with Refresh Tokens =====
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

// Simulated user store
const users = [];
const refreshTokens = new Set(); // In production, use Redis or DB

// Generate token pair
function generateTokens(user) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
  refreshTokens.add(refreshToken);
  return { accessToken, refreshToken };
}

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, ACCESS_SECRET);
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ error: message });
  }
}

// Role-based authorization
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// POST /auth/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const hash = await bcrypt.hash(password, 12);
  const user = { id: Date.now().toString(), email, name, password: hash, role: 'user' };
  users.push(user);
  const tokens = generateTokens(user);
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.status(201).json({ accessToken: tokens.accessToken, user: { id: user.id, email, name } });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const tokens = generateTokens(user);
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ accessToken: tokens.accessToken });
});

// POST /auth/refresh
router.post('/refresh', (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token || !refreshTokens.has(token)) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    refreshTokens.delete(token); // Token rotation
    const user = { id: payload.sub, email: payload.email, role: payload.role };
    const tokens = generateTokens(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ accessToken: tokens.accessToken });
  } catch { res.status(401).json({ error: 'Expired refresh token' }); }
});

// Protected route example
router.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin area' });
});

module.exports = { router, authenticate, authorize };`,
          problems: [
            ['Design Authentication System', 'https://www.geeksforgeeks.org/jwt-authentication-with-node-js/', 'Medium'],
            ['OAuth 2.0 Concepts', 'https://www.hackerrank.com/skills-verification/rest_api_intermediate', 'Medium'],
            ['Session vs Token Auth', 'https://www.geeksforgeeks.org/session-vs-token-based-authentication/', 'Easy']
          ],
          mcqs: [
            {q: 'Where should refresh tokens be stored in a web application?', o: ['localStorage', 'sessionStorage', 'HTTP-only Secure cookie', 'In the JWT payload'], a: 2},
            {q: 'What are the three parts of a JWT?', o: ['Username, Password, Token', 'Header, Payload, Signature', 'Public Key, Private Key, Certificate', 'Issuer, Subject, Audience'], a: 1},
            {q: 'In OAuth 2.0 Authorization Code flow, what is exchanged for tokens?', o: ['Username and password', 'The authorization code', 'The client secret alone', 'The access token'], a: 1}
          ]
        },
        {
          t: 'Error Handling & Validation',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Robust error handling prevents crashes and gives users actionable feedback. Input validation at system boundaries prevents injection attacks and data corruption. Interviewers expect production-quality error handling — not just try/catch around everything.</p></div><div class="learn-section"><div class="learn-h">Centralized Error Handling</div><p class="learn-p">Production Express apps need a <b>centralized error handling strategy</b>. Create custom error classes that extend <code>Error</code> with status codes. Use an <b>async wrapper</b> to catch promise rejections automatically and forward them to the error middleware.</p><div class="learn-code">class AppError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.statusCode = statusCode;\n    this.isOperational = true; // distinguish from programming errors\n  }\n}\n\nclass NotFoundError extends AppError {\n  constructor(resource = \'Resource\') {\n    super(\\`${\'${resource}\'} not found\\`, 404);\n  }\n}\n\nclass ValidationError extends AppError {\n  constructor(errors) {\n    super(\'Validation failed\', 400);\n    this.errors = errors;\n  }\n}</div></div><div class="learn-section"><div class="learn-h">Async Error Wrapper</div><p class="learn-p">Without a wrapper, unhandled promise rejections in route handlers crash the server. Wrap async handlers to automatically catch errors and pass them to <code>next()</code>.</p><div class="learn-code">const asyncHandler = (fn) =&gt; (req, res, next) =&gt; {\n  Promise.resolve(fn(req, res, next)).catch(next);\n};\n\n// Usage\nrouter.get(\'/users/:id\', asyncHandler(async (req, res) =&gt; {\n  const user = await User.findById(req.params.id);\n  if (!user) throw new NotFoundError(\'User\');\n  res.json({ data: user });\n}));</div></div><div class="learn-section"><div class="learn-h">Input Validation with Joi / express-validator</div><p class="learn-p"><b>Validate all incoming data</b> — never trust client input. Libraries like <b>Joi</b> or <b>express-validator</b> provide schema-based validation with detailed error messages.</p><div class="learn-code">const Joi = require(\'joi\');\n\nconst userSchema = Joi.object({\n  name: Joi.string().min(2).max(50).required(),\n  email: Joi.string().email().required(),\n  age: Joi.number().integer().min(18).max(120),\n  role: Joi.string().valid(\'user\', \'admin\').default(\'user\')\n});\n\nconst validate = (schema) =&gt; (req, res, next) =&gt; {\n  const { error, value } = schema.validate(req.body, { abortEarly: false });\n  if (error) throw new ValidationError(error.details);\n  req.body = value; // use sanitized values\n  next();\n};</div><div class="learn-tip"><b>Tip:</b> Use <code>abortEarly: false</code> in Joi to collect ALL validation errors at once, giving users a complete list of issues to fix rather than one at a time.</div></div><div class="learn-section"><div class="learn-h">Unhandled Rejections &amp; Graceful Shutdown</div><p class="learn-p">Always handle <b>uncaught exceptions</b> and <b>unhandled promise rejections</b> at the process level. Implement <b>graceful shutdown</b>: stop accepting new connections, finish in-flight requests, close DB connections, then exit.</p><div class="learn-code">process.on(\'unhandledRejection\', (reason) =&gt; {\n  console.error(\'Unhandled Rejection:\', reason);\n  process.exit(1);\n});\n\nprocess.on(\'SIGTERM\', () =&gt; {\n  console.log(\'SIGTERM received. Graceful shutdown...\');\n  server.close(() =&gt; {\n    mongoose.connection.close();\n    process.exit(0);\n  });\n});</div><div class="learn-warn"><b>Warning:</b> Never swallow errors silently. Log them with context (request ID, user, endpoint) and use structured logging (Winston, Pino) in production.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Swallowing errors:</b> Empty catch blocks hide bugs. Always log or re-throw.</li><li><b>Client-side only validation:</b> Never trust client input. Always validate server-side — client validation is for UX only.</li><li><b>Generic error messages:</b> "Something went wrong" is not helpful. Provide actionable messages for clients while logging detailed errors server-side.</li><li><b>Async error handling:</b> Unhandled promise rejections crash Node.js. Always use try/catch with await or .catch() with promises.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How to structure error handling in Express?</b><br>A: Use async wrapper middleware to catch errors, custom error classes with status codes, and a centralized error handler (4-param middleware) registered last.</p><p class="learn-p"><b>Q2: What is Joi/Zod?</b><br>A: Schema validation libraries that define expected input shapes and validate request bodies/params declaratively, returning structured error messages.</p></div>',
          code: `// ===== Production Error Handling & Validation =====
const express = require('express');
const Joi = require('joi');

// ===== Custom Error Classes =====
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(\`\${resource} not found\`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(details) {
    super('Validation failed', 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// ===== Async Handler Wrapper =====
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ===== Validation Middleware Factory =====
const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true
  });
  if (error) {
    const details = error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message
    }));
    throw new ValidationError(details);
  }
  req[source] = value;
  next();
};

// ===== Validation Schemas =====
const schemas = {
  createUser: Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/).required()
      .messages({ 'string.pattern.base': 'Password must contain uppercase, lowercase, and number' }),
    age: Joi.number().integer().min(18).max(120).optional()
  }),
  queryParams: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional()
  })
};

// ===== Routes with Validation =====
const router = express.Router();

router.get('/users', validate(schemas.queryParams, 'query'), asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  // DB query would go here
  res.json({ data: [], meta: { page, limit } });
}));

router.post('/users', validate(schemas.createUser), asyncHandler(async (req, res) => {
  const user = req.body; // already validated & sanitized
  res.status(201).json({ data: { id: Date.now(), ...user } });
}));

// ===== Global Error Handler =====
function errorHandler(err, req, res, next) {
  // Log with context
  console.error({
    message: err.message,
    code: err.code,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    requestId: req.headers['x-request-id']
  });

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: { code: err.code, message: err.message, details: err.details } });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  // Programming error — don't leak details
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
}

module.exports = { AppError, NotFoundError, ValidationError, asyncHandler, validate, errorHandler };`,
          problems: [
            ['Input Validation Best Practices', 'https://www.geeksforgeeks.org/express-js-req-body-property/', 'Easy'],
            ['Error Handling in Express', 'https://www.geeksforgeeks.org/error-handling-in-express/', 'Medium'],
            ['Build Robust API', 'https://www.hackerrank.com/skills-verification/nodejs_intermediate', 'Medium']
          ],
          mcqs: [
            {q: 'Why use an async wrapper (asyncHandler) around Express route handlers?', o: ['To make them faster', 'To automatically catch promise rejections and pass them to error middleware', 'To enable CORS', 'To add logging'], a: 1},
            {q: 'What distinguishes operational errors from programming errors?', o: ['Operational errors are bugs in the code', 'Operational errors are expected failures (bad input, network issues) we can handle gracefully', 'There is no difference', 'Programming errors are less severe'], a: 1},
            {q: 'What does Joi\'s abortEarly: false option do?', o: ['Skips validation', 'Returns all validation errors instead of stopping at the first', 'Makes validation async', 'Disables type coercion'], a: 1}
          ]
        },
        {
          t: 'File Uploads & Security (Rate Limiting, Helmet)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">File upload handling and API security are essential for production applications. Understanding multipart form data, file size limits, and security headers prevents common vulnerabilities. Any software developer is expected to be aware of the OWASP top 10 protections.</p></div><div class="learn-section"><div class="learn-h">File Uploads with Multer</div><p class="learn-p"><b>Multer</b> is the standard middleware for handling <code>multipart/form-data</code> (file uploads) in Express. It adds a <code>file</code> or <code>files</code> object to the request. Configure storage (disk or memory), file size limits, and file type filters.</p><div class="learn-code">const multer = require(\'multer\');\n\nconst storage = multer.diskStorage({\n  destination: (req, file, cb) =&gt; cb(null, \'uploads/\'),\n  filename: (req, file, cb) =&gt; {\n    const unique = Date.now() + \'-\' + Math.round(Math.random() * 1E9);\n    cb(null, unique + path.extname(file.originalname));\n  }\n});\n\nconst upload = multer({\n  storage,\n  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB\n  fileFilter: (req, file, cb) =&gt; {\n    const allowed = [\'image/jpeg\', \'image/png\', \'image/webp\'];\n    cb(null, allowed.includes(file.mimetype));\n  }\n});</div><div class="learn-warn"><b>Warning:</b> Always validate file types server-side by checking the MIME type (and ideally the file signature / magic bytes). Never trust the file extension alone — it can be spoofed.</div></div><div class="learn-section"><div class="learn-h">Security with Helmet</div><p class="learn-p"><b>Helmet</b> sets various HTTP security headers to protect against common web vulnerabilities. It configures Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, and more.</p><div class="learn-code">const helmet = require(\'helmet\');\napp.use(helmet()); // enables all default protections\n\n// Custom CSP\napp.use(helmet.contentSecurityPolicy({\n  directives: {\n    defaultSrc: ["\'self\'"],\n    scriptSrc: ["\'self\'", "trusted-cdn.com"],\n    styleSrc: ["\'self\'", "\'unsafe-inline\'"],\n    imgSrc: ["\'self\'", "data:", "*.cloudinary.com"]\n  }\n}));</div></div><div class="learn-section"><div class="learn-h">Rate Limiting</div><p class="learn-p"><b>Rate limiting</b> prevents abuse by limiting the number of requests a client can make in a time window. Use <code>express-rate-limit</code> for basic rate limiting. For production, use a Redis-backed store for distributed rate limiting across multiple server instances.</p><div class="learn-code">const rateLimit = require(\'express-rate-limit\');\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100, // max 100 requests per window\n  message: { error: \'Too many requests, try again later\' },\n  standardHeaders: true, // RateLimit-* headers\n  legacyHeaders: false\n});\napp.use(\'/api/\', limiter);\n\n// Stricter limit for auth endpoints\nconst authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });\napp.use(\'/api/auth/login\', authLimiter);</div></div><div class="learn-section"><div class="learn-h">Additional Security Measures</div><ul class="learn-list"><li><b>CORS:</b> Configure <code>cors()</code> with specific origins — never use <code>*</code> in production with credentials</li><li><b>HTTPS:</b> Always use TLS in production. Redirect HTTP to HTTPS</li><li><b>Input sanitization:</b> Use <code>express-mongo-sanitize</code> to prevent NoSQL injection</li><li><b>HPP:</b> Use <code>hpp</code> middleware to protect against HTTP Parameter Pollution</li><li><b>Request size limits:</b> Set <code>express.json({ limit: \'10kb\' })</code> to prevent large payload attacks</li></ul><div class="learn-tip"><b>Tip:</b> Run <code>npm audit</code> regularly to check for known vulnerabilities in dependencies. Use <code>snyk</code> for deeper security analysis.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Unrestricted file types:</b> Always validate file type and extension server-side. Rename uploaded files to prevent path traversal.</li><li><b>No file size limit:</b> Large uploads can exhaust memory or disk. Set limits in multer/busboy config.</li><li><b>Missing CORS config:</b> Overly permissive CORS (Access-Control-Allow-Origin: *) exposes your API. Whitelist specific origins.</li><li><b>No rate limiting:</b> APIs without rate limiting are vulnerable to DoS and brute-force attacks.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What does Helmet.js do?</b><br>A: Sets security HTTP headers: Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, etc. Protects against clickjacking, XSS, and other attacks.</p><p class="learn-p"><b>Q2: How does rate limiting work?</b><br>A: Track request count per IP/user in a time window (sliding window, token bucket). Return 429 Too Many Requests when the limit is exceeded.</p></div>',
          code: `// ===== File Upload + Security Configuration =====
const express = require('express');
const multer = require('multer');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const crypto = require('crypto');

const app = express();

// ===== Security Middleware =====
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', '*.cloudinary.com'],
    connectSrc: ["'self'", 'api.example.com']
  }
}));

app.use(cors({
  origin: ['https://myapp.com', 'https://staging.myapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize()); // Remove $ and . from user input

// ===== Rate Limiting =====
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } }
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.use('/api/auth/login', authLimiter);

// ===== File Upload Configuration =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Step 1: Filter by MIME type in multer (file content not yet available here)
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const fileFilter = (req, file, cb) => {
  cb(null, ALLOWED_MIMES.includes(file.mimetype));
};

// Step 2: Verify magic bytes AFTER upload (multer fileFilter cannot read file content)
const MAGIC_BYTES = {
  'image/jpeg': Buffer.from([0xFF, 0xD8, 0xFF]),
  'image/png':  Buffer.from([0x89, 0x50, 0x4E, 0x47]),
  'image/webp': Buffer.from([0x52, 0x49, 0x46, 0x46]),
  'application/pdf': Buffer.from([0x25, 0x50, 0x44, 0x46])
};
function verifyMagicBytes(filePath, mimetype) {
  const fd = require('fs').openSync(filePath, 'r');
  const expected = MAGIC_BYTES[mimetype];
  const buf = Buffer.alloc(expected.length);
  require('fs').readSync(fd, buf, 0, expected.length, 0);
  require('fs').closeSync(fd);
  return buf.equals(expected);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }
});

// ===== Upload Routes =====
app.post('/api/upload/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    data: {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: \`/uploads/\${req.file.filename}\`
    }
  });
});

app.post('/api/upload/gallery', upload.array('photos', 5), (req, res) => {
  const files = req.files.map(f => ({
    filename: f.filename, size: f.size, url: \`/uploads/\${f.filename}\`
  }));
  res.json({ data: files });
});

// Multer error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'File too large (max 5MB)',
      LIMIT_FILE_COUNT: 'Too many files (max 5)',
      LIMIT_UNEXPECTED_FILE: 'Unexpected field name'
    };
    return res.status(400).json({ error: messages[err.code] || err.message });
  }
  next(err);
});`,
          problems: [
            ['File Upload with Node.js', 'https://www.geeksforgeeks.org/file-uploading-in-node-js/', 'Easy'],
            ['OWASP Top 10 for Node', 'https://www.hackerrank.com/skills-verification/nodejs_intermediate', 'Hard']
          ],
          mcqs: [
            {q: 'Why should file type validation check MIME type instead of just extension?', o: ['Extensions are case-sensitive', 'Extensions can be spoofed easily', 'MIME types are faster to check', 'Extensions are not available in Node.js'], a: 1},
            {q: 'What does Helmet primarily protect against?', o: ['SQL injection', 'Common web vulnerabilities via HTTP security headers', 'DDoS attacks', 'File system access'], a: 1},
            {q: 'In a distributed system with multiple servers, what should back a rate limiter?', o: ['In-memory store', 'File system', 'Redis or similar shared store', 'Local SQLite'], a: 2}
          ]
        }
      ]
    },
    {
      id: 'mongo',
      t: 'MongoDB',
      topics: [
        {
          t: 'CRUD Operations & Aggregation Pipeline',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">MongoDB CRUD operations and the aggregation pipeline are the core of data manipulation in MERN applications. Understanding query operators, indexing, and pipeline stages is essential for building performant APIs. Interviews test database design and query optimization.</p></div><div class="learn-section"><div class="learn-h">Introduction to MongoDB</div><p class="learn-p">MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents called BSON (Binary JSON). Unlike relational databases that use tables and rows, MongoDB uses collections and documents. Each document can have a different structure, making it ideal for applications where data schemas evolve over time. MongoDB is the "M" in the MERN stack and pairs naturally with JavaScript-based backends since documents map directly to JavaScript objects.</p><p class="learn-p">Key characteristics of MongoDB include: horizontal scalability through sharding, high availability via replica sets, a rich query language, built-in aggregation framework, and support for geospatial queries. MongoDB stores data in collections (analogous to tables) containing documents (analogous to rows). Each document is a BSON object with field-value pairs, and fields can contain other documents, arrays, or arrays of documents.</p><div class="learn-code">// A MongoDB document example\n{\n  _id: ObjectId("507f1f77bcf86cd799439011"),\n  name: "Alice Johnson",\n  email: "alice@example.com",\n  age: 28,\n  address: {\n    street: "123 Main St",\n    city: "Springfield",\n    state: "IL"\n  },\n  hobbies: ["reading", "coding", "hiking"]\n}</div></div><div class="learn-section"><div class="learn-h">CRUD Operations</div><p class="learn-p">CRUD stands for Create, Read, Update, and Delete -- the four fundamental operations for persistent storage. MongoDB provides intuitive methods for each operation that work with JavaScript objects directly.</p><p class="learn-p"><strong>Create Operations:</strong> MongoDB offers <code>insertOne()</code> for inserting a single document and <code>insertMany()</code> for bulk inserts. Every document automatically receives a unique <code>_id</code> field (an ObjectId) if one is not provided. Insert operations are atomic at the single-document level.</p><div class="learn-code">// Insert a single document\ndb.users.insertOne({\n  name: "Bob Smith",\n  email: "bob@example.com",\n  role: "developer"\n});\n\n// Insert multiple documents\ndb.users.insertMany([\n  { name: "Carol", role: "designer" },\n  { name: "Dave", role: "manager" }\n]);</div><p class="learn-p"><strong>Read Operations:</strong> The <code>find()</code> method retrieves documents matching a query filter. Use <code>findOne()</code> for a single result. MongoDB supports powerful query operators like <code>$gt</code>, <code>$lt</code>, <code>$in</code>, <code>$regex</code>, <code>$and</code>, <code>$or</code>, and more. Projection allows you to include or exclude specific fields from results.</p><div class="learn-code">// Find with query filter and projection\ndb.users.find(\n  { age: { $gte: 21, $lte: 35 }, role: "developer" },\n  { name: 1, email: 1, _id: 0 }\n).sort({ name: 1 }).limit(10);\n\n// Logical operators\ndb.products.find({\n  $or: [\n    { price: { $lt: 20 } },\n    { category: "sale" }\n  ]\n});</div><p class="learn-p"><strong>Update Operations:</strong> MongoDB provides <code>updateOne()</code>, <code>updateMany()</code>, and <code>replaceOne()</code>. Update operators include <code>$set</code> (set field value), <code>$unset</code> (remove field), <code>$inc</code> (increment), <code>$push</code> (add to array), <code>$pull</code> (remove from array), <code>$addToSet</code> (add unique to array), and <code>$rename</code>.</p><div class="learn-code">// Update with operators\ndb.users.updateOne(\n  { email: "bob@example.com" },\n  {\n    $set: { role: "senior developer" },\n    $inc: { loginCount: 1 },\n    $push: { skills: "MongoDB" },\n    $currentDate: { lastModified: true }\n  }\n);\n\n// Upsert: insert if not found\ndb.users.updateOne(\n  { email: "new@example.com" },\n  { $set: { name: "New User", role: "viewer" } },\n  { upsert: true }\n);</div><p class="learn-p"><strong>Delete Operations:</strong> Use <code>deleteOne()</code> or <code>deleteMany()</code> to remove documents. Always use a filter to avoid accidentally deleting all documents. The <code>drop()</code> method removes an entire collection.</p><div class="learn-tip">Always test your query filter with <code>find()</code> before running <code>updateMany()</code> or <code>deleteMany()</code> in production to verify you are targeting the correct documents.</div></div><div class="learn-section"><div class="learn-h">Indexing for Performance</div><p class="learn-p">Indexes are critical for query performance. Without indexes, MongoDB performs a collection scan, examining every document. Indexes store a small portion of the data in an easily traversable structure (B-tree) that supports efficient equality matches and range queries.</p><div class="learn-code">// Create a single-field index\ndb.users.createIndex({ email: 1 }); // ascending\n\n// Compound index\ndb.orders.createIndex({ customerId: 1, orderDate: -1 });\n\n// Unique index\ndb.users.createIndex({ email: 1 }, { unique: true });\n\n// Text index for full-text search\ndb.articles.createIndex({ title: "text", body: "text" });</div><p class="learn-p">Common index types include: single-field, compound, multikey (for arrays), text, geospatial (2dsphere), and hashed. Use <code>explain("executionStats")</code> to analyze query plans and ensure indexes are being used. The ESR rule (Equality, Sort, Range) guides optimal compound index field ordering.</p><div class="learn-warn">Over-indexing can hurt write performance since every insert and update must also update all relevant indexes. Only create indexes that support your actual query patterns.</div></div><div class="learn-section"><div class="learn-h">Aggregation Pipeline</div><p class="learn-p">The aggregation pipeline is MongoDB\'s most powerful data processing tool. It processes documents through a sequence of stages, where each stage transforms the documents. Think of it as a Unix pipe: the output of one stage becomes the input of the next.</p><p class="learn-p">Key aggregation stages include:</p><table class="learn-table"><tr><th>Stage</th><th>Purpose</th></tr><tr><td>$match</td><td>Filter documents (like WHERE in SQL)</td></tr><tr><td>$group</td><td>Group documents and compute aggregates (like GROUP BY)</td></tr><tr><td>$project</td><td>Reshape documents, include/exclude fields</td></tr><tr><td>$sort</td><td>Order documents by specified fields</td></tr><tr><td>$limit / $skip</td><td>Pagination of results</td></tr><tr><td>$lookup</td><td>Left outer join with another collection</td></tr><tr><td>$unwind</td><td>Deconstruct an array field into separate documents</td></tr><tr><td>$addFields</td><td>Add computed fields to documents</td></tr><tr><td>$facet</td><td>Run multiple pipelines in parallel on same input</td></tr><tr><td>$bucket</td><td>Categorize documents into groups (bucketing)</td></tr></table><div class="learn-code">// Aggregation: Sales report by category\ndb.orders.aggregate([\n  { $match: { status: "completed", orderDate: { $gte: ISODate("2025-01-01") } } },\n  { $unwind: "$items" },\n  { $group: {\n      _id: "$items.category",\n      totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },\n      avgOrderValue: { $avg: "$items.price" },\n      orderCount: { $sum: 1 }\n  }},\n  { $sort: { totalRevenue: -1 } },\n  { $project: {\n      category: "$_id",\n      totalRevenue: { $round: ["$totalRevenue", 2] },\n      avgOrderValue: { $round: ["$avgOrderValue", 2] },\n      orderCount: 1,\n      _id: 0\n  }}\n]);</div><p class="learn-p">The <code>$lookup</code> stage performs joins between collections, which is essential for denormalized data patterns. It acts like a LEFT OUTER JOIN in SQL. You can also use sub-pipelines within <code>$lookup</code> for more complex join conditions.</p><div class="learn-code">// $lookup: Join orders with customer data\ndb.orders.aggregate([\n  { $lookup: {\n      from: "customers",\n      localField: "customerId",\n      foreignField: "_id",\n      as: "customerInfo"\n  }},\n  { $unwind: "$customerInfo" },\n  { $project: {\n      orderId: 1,\n      total: 1,\n      "customerInfo.name": 1,\n      "customerInfo.email": 1\n  }}\n]);</div><div class="learn-tip">Place <code>$match</code> and <code>$limit</code> stages as early as possible in the pipeline to reduce the number of documents processed by subsequent stages. This dramatically improves aggregation performance.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>No indexes:</b> Queries without indexes scan the entire collection — O(n). Always create indexes on frequently queried fields.</li><li><b>$lookup performance:</b> Joins in MongoDB (via $lookup) are expensive. Denormalize data when read performance matters more than write consistency.</li><li><b>Array growth:</b> Unbounded array growth in documents hits the 16MB BSON limit. Use a separate collection for large arrays (e.g., comments).</li><li><b>Aggregation memory:</b> Pipeline stages like $group and $sort load data into memory. Use allowDiskUse: true for large datasets.</li></ul></div><div class="learn-section"><div class="learn-h">MongoDB Transactions</div><p class="learn-p">Since MongoDB 4.0, <b>multi-document ACID transactions</b> ensure that a group of operations across multiple documents (and collections) either all succeed or all fail. Transactions are essential for operations like transferring money between accounts or updating related documents atomically.</p><div class="learn-code">// Multi-document transaction with Mongoose\nconst session = await mongoose.startSession();\ntry {\n  session.startTransaction();\n\n  await Account.updateOne(\n    { _id: fromId }, { $inc: { balance: -amount } }, { session }\n  );\n  await Account.updateOne(\n    { _id: toId }, { $inc: { balance: amount } }, { session }\n  );\n  await Transfer.create([{ from: fromId, to: toId, amount }], { session });\n\n  await session.commitTransaction();\n} catch (err) {\n  await session.abortTransaction();\n  throw err;\n} finally {\n  session.endSession();\n}</div><p class="learn-p"><b>Key constraints:</b> Transactions require a <b>replica set</b> (even for local dev — use a single-node replica set). They add overhead due to write conflict detection and snapshot isolation. Single-document operations are already atomic in MongoDB, so only use transactions when you truly need multi-document atomicity.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Embedding vs referencing in MongoDB?</b><br>A: Embed for 1:few relationships and data accessed together. Reference for 1:many or many:many, and when documents grow unbounded. Embedding is faster for reads; referencing is more flexible.</p><p class="learn-p"><b>Q2: What is the aggregation pipeline?</b><br>A: A series of stages ($match, $group, $sort, $project, $lookup) that process documents sequentially. Each stage transforms the data for the next. Like Unix pipes.</p><p class="learn-p"><b>Q3: When do you need MongoDB transactions?</b><br>A: When multiple documents across one or more collections must be updated atomically — e.g., transferring funds between accounts. Single-document operations are already atomic. Transactions require a replica set and add overhead, so only use them when multi-document atomicity is necessary.</p></div>',
          code: `// ==========================================
// MongoDB CRUD & Aggregation Examples
// ==========================================

const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function crudOperations() {
  try {
    await client.connect();
    const db = client.db('myapp');
    const users = db.collection('users');

    // --- CREATE ---
    const insertResult = await users.insertOne({
      name: 'Alice',
      email: 'alice@example.com',
      age: 28,
      skills: ['JavaScript', 'React'],
      createdAt: new Date()
    });
    console.log('Inserted ID:', insertResult.insertedId);

    // Bulk insert
    await users.insertMany([
      { name: 'Bob', age: 32, skills: ['Python', 'Django'] },
      { name: 'Carol', age: 25, skills: ['JavaScript', 'Node.js'] }
    ]);

    // --- READ ---
    const user = await users.findOne({ email: 'alice@example.com' });
    console.log('Found user:', user);

    // Query with operators and projection
    const devs = await users.find(
      { age: { $gte: 25 }, skills: { $in: ['JavaScript'] } },
      { projection: { name: 1, skills: 1, _id: 0 } }
    ).sort({ age: 1 }).limit(10).toArray();
    console.log('JS developers:', devs);

    // --- UPDATE ---
    await users.updateOne(
      { email: 'alice@example.com' },
      {
        $set: { role: 'senior' },
        $push: { skills: 'MongoDB' },
        $inc: { age: 1 }
      }
    );

    // --- DELETE ---
    await users.deleteOne({ name: 'Bob' });

    // --- AGGREGATION PIPELINE ---
    const orders = db.collection('orders');

    const salesReport = await orders.aggregate([
      // Stage 1: Filter completed orders from 2025
      { $match: { status: 'completed', year: 2025 } },
      // Stage 2: Flatten items array
      { $unwind: '$items' },
      // Stage 3: Group by category
      { $group: {
          _id: '$items.category',
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          count: { $sum: 1 }
      }},
      // Stage 4: Sort by revenue descending
      { $sort: { totalRevenue: -1 } },
      // Stage 5: Reshape output
      { $project: {
          category: '$_id', _id: 0,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          count: 1
      }}
    ]).toArray();
    console.log('Sales Report:', salesReport);

    // $lookup - Join with another collection
    const enriched = await orders.aggregate([
      { $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
      }},
      { $unwind: '$userDetails' },
      { $project: {
          orderId: 1, total: 1,
          customerName: '$userDetails.name'
      }}
    ]).toArray();
    console.log('Enriched orders:', enriched);

    // --- INDEXES ---
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ age: 1, name: 1 });

  } finally {
    await client.close();
  }
}

crudOperations().catch(console.error);`,
          problems: [
            ['MongoDB Aggregation Queries', 'https://www.hackerrank.com/domains/databases?filters%5Bsubdomains%5D%5B%5D=aggregation', 'Medium'],
            ['Design a NoSQL Key-Value Store', 'https://leetcode.com/problems/design-hashmap/', 'Easy'],
            ['MongoDB Indexing Challenge', 'https://www.hackerrank.com/domains/databases?filters%5Bsubdomains%5D%5B%5D=indexing', 'Medium']
          ],
          mcqs: [
            {
              q: 'Which MongoDB update operator is used to add an element to an array only if it does not already exist?',
              o: ['$push', '$addToSet', '$append', '$insertUnique'],
              a: 1
            },
            {
              q: 'In a MongoDB aggregation pipeline, which stage is equivalent to a SQL LEFT OUTER JOIN?',
              o: ['$merge', '$lookup', '$group', '$unwind'],
              a: 1
            },
            {
              q: 'What does the explain("executionStats") method help you determine?',
              o: [
                'The number of collections in a database',
                'Whether a query uses an index and how many documents were examined',
                'The storage size of documents',
                'The replication lag between nodes'
              ],
              a: 1
            }
          ]
        },
        {
          t: 'Mongoose ODM & Schema Design',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Mongoose provides schema validation, middleware, and a rich query API on top of MongoDB. Understanding schema design, virtuals, and middleware hooks is essential for MERN development. Well-designed schemas that balance read performance with data integrity are what interviewers look for.</p></div><div class="learn-section"><div class="learn-h">Introduction to Mongoose</div><p class="learn-p">Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model application data, offering built-in type casting, validation, query building, and business logic hooks. While MongoDB is schema-less by nature, Mongoose imposes structure at the application level, ensuring data consistency and reducing bugs caused by malformed documents.</p><p class="learn-p">Mongoose sits between your Node.js application and MongoDB, translating between JavaScript objects and MongoDB documents. The core concepts are: <strong>Schema</strong> (defines the structure), <strong>Model</strong> (a compiled schema that provides an interface to the database), and <strong>Document</strong> (an instance of a model representing a single record).</p><div class="learn-code">const mongoose = require(\'mongoose\');\n\n// Connect to MongoDB\nmongoose.connect(\'mongodb://localhost:27017/myapp\');\n\n// Define a Schema\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true, trim: true },\n  email: { type: String, required: true, unique: true, lowercase: true },\n  age: { type: Number, min: 0, max: 150 },\n  role: { type: String, enum: [\'user\', \'admin\', \'moderator\'], default: \'user\' },\n  createdAt: { type: Date, default: Date.now }\n});\n\n// Create a Model\nconst User = mongoose.model(\'User\', userSchema);</div></div><div class="learn-section"><div class="learn-h">Schema Types & Validation</div><p class="learn-p">Mongoose supports all standard JavaScript types plus some MongoDB-specific types. Each field in a schema can have validators that enforce data integrity before saving to the database.</p><table class="learn-table"><tr><th>Schema Type</th><th>Description</th><th>Common Validators</th></tr><tr><td>String</td><td>Text data</td><td>required, enum, match (regex), minLength, maxLength, trim, lowercase, uppercase</td></tr><tr><td>Number</td><td>Numeric data</td><td>required, min, max</td></tr><tr><td>Boolean</td><td>true/false</td><td>required</td></tr><tr><td>Date</td><td>Date objects</td><td>required, min, max</td></tr><tr><td>ObjectId</td><td>MongoDB ObjectId (for references)</td><td>ref (for population)</td></tr><tr><td>Array</td><td>Arrays of any type</td><td>validate (custom)</td></tr><tr><td>Mixed</td><td>Any type (schema-less)</td><td>-</td></tr><tr><td>Map</td><td>Key-value pairs</td><td>of (value type)</td></tr></table><p class="learn-p">Custom validators allow you to define complex validation logic. They are functions that return true/false or throw an error. Async validators are supported for checks that require database queries (e.g., uniqueness checks).</p><div class="learn-code">const productSchema = new mongoose.Schema({\n  name: {\n    type: String,\n    required: [true, \'Product name is required\'],\n    minLength: [3, \'Name must be at least 3 characters\']\n  },\n  price: {\n    type: Number,\n    required: true,\n    validate: {\n      validator: function(v) { return v &gt; 0; },\n      message: \'Price must be positive\'\n    }\n  },\n  sku: {\n    type: String,\n    validate: {\n      validator: async function(v) {\n        const count = await mongoose.models.Product.countDocuments({ sku: v });\n        return count === 0;\n      },\n      message: \'SKU already exists\'\n    }\n  },\n  tags: [{ type: String, enum: [\'electronics\', \'clothing\', \'food\'] }]\n});</div></div><div class="learn-section"><div class="learn-h">Middleware (Hooks)</div><p class="learn-p">Mongoose middleware (also called hooks) are functions that intercept operations at specific stages. They enable you to add business logic before or after operations like save, validate, remove, and query execution. Middleware is defined at the schema level.</p><p class="learn-p"><strong>Pre middleware</strong> runs before the operation. Common uses include hashing passwords before saving, setting timestamps, or validating related data. <strong>Post middleware</strong> runs after the operation, useful for logging, sending notifications, or cleanup tasks.</p><div class="learn-code">// Pre-save hook: hash password before saving\nuserSchema.pre(\'save\', async function(next) {\n  if (!this.isModified(\'password\')) return next();\n  this.password = await bcrypt.hash(this.password, 12);\n  next();\n});\n\n// Pre-find hook: exclude inactive users by default\nuserSchema.pre(/^find/, function(next) {\n  this.where({ isActive: { $ne: false } });\n  next();\n});\n\n// Post-save hook: log the action\nuserSchema.post(\'save\', function(doc) {\n  console.log(\'User saved:\', doc.email);\n});</div><div class="learn-warn">In pre-save hooks, <code>this</code> refers to the document being saved. In pre-query hooks (find, update), <code>this</code> refers to the query object, not the document. This distinction is critical for writing correct middleware.</div></div><div class="learn-section"><div class="learn-h">Schema Design Patterns</div><p class="learn-p">MongoDB schema design is fundamentally different from relational database design. Instead of normalizing data across tables, MongoDB favors embedding related data within a single document when possible. The key decision is always: <strong>embed vs. reference</strong>.</p><ul class="learn-list"><li><strong>Embedding (Denormalization):</strong> Store related data inside the parent document. Best for one-to-few relationships, data that is always accessed together, and data that doesn\'t change frequently. Provides atomic operations and single-query reads.</li><li><strong>Referencing (Normalization):</strong> Store related data in separate collections and use ObjectId references. Best for one-to-many or many-to-many relationships, frequently changing data, and large subdocuments that would exceed the 16MB document limit.</li></ul><div class="learn-code">// EMBEDDING: Blog post with comments embedded\nconst postSchema = new mongoose.Schema({\n  title: String,\n  body: String,\n  comments: [{\n    user: String,\n    text: String,\n    date: { type: Date, default: Date.now }\n  }]\n});\n\n// REFERENCING: Separate collections with populate\nconst authorSchema = new mongoose.Schema({\n  name: String,\n  bio: String\n});\nconst bookSchema = new mongoose.Schema({\n  title: String,\n  author: { type: mongoose.Schema.Types.ObjectId, ref: \'Author\' }\n});\n\n// Populate to resolve references\nconst book = await Book.findById(id).populate(\'author\');</div><p class="learn-p"><strong>Population</strong> is Mongoose\'s way of replacing ObjectId references with actual documents from other collections. It works like a JOIN but happens at the application level. You can populate nested paths, select specific fields during population, and even chain multiple populates.</p><div class="learn-tip">Design your schema based on your application\'s query patterns, not based on how the data is related. If you always need a user\'s address when you fetch the user, embed it. If addresses are queried independently, use a separate collection with references.</div></div><div class="learn-section"><div class="learn-h">Virtuals, Methods & Statics</div><p class="learn-p">Mongoose schemas support virtual properties, instance methods, and static methods that let you add custom behavior to your models.</p><p class="learn-p"><strong>Virtuals</strong> are computed properties that are not stored in MongoDB. They are derived from existing fields and can have getters and setters. <strong>Instance methods</strong> operate on individual documents. <strong>Statics</strong> are methods on the Model itself, useful for custom query logic.</p><div class="learn-code">// Virtual: full name computed from first + last\nuserSchema.virtual(\'fullName\').get(function() {\n  return this.firstName + \' \' + this.lastName;\n});\n\n// Instance method: compare password\nuserSchema.methods.comparePassword = async function(candidatePassword) {\n  return bcrypt.compare(candidatePassword, this.password);\n};\n\n// Static method: find by email domain\nuserSchema.statics.findByDomain = function(domain) {\n  return this.find({ email: new RegExp(\'@\' + domain + \'$\', \'i\') });\n};\n\n// Usage\nconst user = await User.findById(id);\nconsole.log(user.fullName);\nconst isValid = await user.comparePassword(\'secret123\');\nconst gmailUsers = await User.findByDomain(\'gmail.com\');</div><p class="learn-p">Enable virtuals in JSON output by setting <code>toJSON: { virtuals: true }</code> in the schema options. By default, virtuals are not included when converting documents to JSON or plain objects.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Schema validation only on save:</b> Mongoose validators run on save() and create(), not on update(). Use runValidators: true option with update operations.</li><li><b>Population overhead:</b> Deep population chains (.populate("author").populate("author.company")) generate multiple database queries. Use lean() for read-only queries to skip Mongoose overhead.</li><li><b>Missing timestamps:</b> Always add <code>timestamps: true</code> to schemas for createdAt/updatedAt fields.</li><li><b>Circular references:</b> Populate cycles cause infinite loops. Design schemas to avoid circular population paths.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What are Mongoose middleware (hooks)?</b><br>A: Pre/post hooks for document lifecycle events: pre("save"), pre("validate"), post("remove"). Used for hashing passwords, logging, and cascading deletes.</p><p class="learn-p"><b>Q2: What is a Mongoose virtual?</b><br>A: A computed property not stored in the database. Defined with schema.virtual("fullName").get(). Useful for derived fields like fullName from firstName + lastName.</p></div>',
          code: `// ==========================================
// Mongoose ODM & Schema Design Patterns
// ==========================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- Connection with options ---
mongoose.connect('mongodb://localhost:27017/myapp', {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});

mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

// --- User Schema with full features ---
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true,
               match: [/^\\S+@\\S+\\.\\S+$/, 'Invalid email format'] },
  password:  { type: String, required: true, minLength: 8, select: false },
  role:      { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  profile:   {                         // Embedded subdocument
    avatar: String,
    bio:    { type: String, maxLength: 500 }
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]  // Reference
}, {
  timestamps: true,                    // adds createdAt & updatedAt
  toJSON: { virtuals: true },          // include virtuals in JSON output
  toObject: { virtuals: true }
});

// --- Virtual property ---
userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

// --- Pre-save middleware: hash password ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// --- Instance method ---
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// --- Static method ---
userSchema.statics.findAdmins = function () {
  return this.find({ role: 'admin' }).select('-password');
};

const User = mongoose.model('User', userSchema);

// --- Post Schema (referenced from User) ---
const postSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  content: { type: String, required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags:    [String],
  comments: [{                         // Embedded array of subdocuments
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Index for common query patterns
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model('Post', postSchema);

// --- Usage Example ---
async function demo() {
  // Create user
  const user = await User.create({
    firstName: 'Alice', lastName: 'Johnson',
    email: 'alice@example.com', password: 'securepass123'
  });
  console.log(user.fullName); // "Alice Johnson"

  // Create post referencing user
  const post = await Post.create({
    title: 'Mongoose Guide', content: 'Learn Mongoose ODM...',
    author: user._id, tags: ['mongodb', 'nodejs']
  });

  // Populate: resolve author reference
  const fetched = await Post.findById(post._id)
    .populate('author', 'firstName lastName email')
    .populate('comments.user', 'firstName');
  console.log(fetched.author.fullName);

  // Query with chaining
  const recentPosts = await Post.find({ tags: 'mongodb' })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();  // returns plain JS objects (faster)
  console.log(recentPosts);
}

demo().catch(console.error);`,
          problems: [
            ['Design Underground System', 'https://leetcode.com/problems/design-underground-system/', 'Medium'],
            ['LRU Cache', 'https://leetcode.com/problems/lru-cache/', 'Medium']
          ],
          mcqs: [
            {
              q: 'In Mongoose, what does the populate() method do?',
              o: [
                'Creates new documents in bulk',
                'Replaces ObjectId references with actual documents from another collection',
                'Adds default values to empty fields',
                'Creates indexes on referenced fields'
              ],
              a: 1
            },
            {
              q: 'Which Mongoose schema option automatically adds createdAt and updatedAt fields?',
              o: ['autoIndex', 'timestamps', 'versionKey', 'strictQuery'],
              a: 1
            },
            {
              q: 'When should you prefer embedding over referencing in MongoDB schema design?',
              o: [
                'When data has many-to-many relationships',
                'When subdocuments are very large and frequently updated independently',
                'When related data is always accessed together and has a one-to-few relationship',
                'When you need to enforce foreign key constraints'
              ],
              a: 2
            }
          ]
        }
      ]
    },
    {
      id: 'devops',
      t: 'DevOps',
      topics: [
        {
          t: 'Git Workflow & Branching Strategies',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Git is the universal version control system. Understanding branching strategies, rebasing, and conflict resolution is essential for team collaboration. Any engineering team expects clean git practices — meaningful commits, proper branching, and efficient code review workflows.</p></div><div class="learn-section"><div class="learn-h">Version Control with Git</div><p class="learn-p">Git is a distributed version control system that tracks changes in source code during software development. Every developer has a full copy of the repository, including its complete history, enabling offline work and fast operations. Understanding Git is fundamental for any developer working in a team environment.</p><p class="learn-p">Git operates on three main areas: the <strong>Working Directory</strong> (where you edit files), the <strong>Staging Area</strong> (where you prepare changes for commit), and the <strong>Repository</strong> (where committed snapshots are stored). Files move from working directory to staging via <code>git add</code>, and from staging to repository via <code>git commit</code>.</p><div class="learn-code">// Core Git commands\ngit init                          // Initialize a new repo\ngit clone &lt;url&gt;                   // Clone a remote repo\ngit add &lt;file&gt;                    // Stage changes\ngit commit -m "message"           // Commit staged changes\ngit status                        // View working tree status\ngit log --oneline --graph         // View commit history\ngit diff                          // View unstaged changes\ngit diff --staged                 // View staged changes</div></div><div class="learn-section"><div class="learn-h">Branching Fundamentals</div><p class="learn-p">Branches are lightweight pointers to commits that allow parallel development. Creating a branch is nearly instantaneous in Git since it only creates a new pointer -- it doesn\'t copy files. The <code>HEAD</code> pointer indicates which branch you are currently on.</p><div class="learn-code">git branch feature/login          // Create a branch\ngit checkout feature/login        // Switch to branch\ngit checkout -b feature/login     // Create and switch (shorthand)\ngit switch -c feature/login       // Modern alternative\ngit branch -d feature/login       // Delete branch (safe)\ngit branch -D feature/login       // Force delete</div><p class="learn-p"><strong>Merging</strong> combines the work from different branches. A <strong>fast-forward merge</strong> occurs when the target branch has no new commits since the source branch diverged -- Git simply moves the pointer forward. A <strong>three-way merge</strong> occurs when both branches have diverged, creating a new merge commit with two parents.</p><p class="learn-p"><strong>Rebasing</strong> replays commits from one branch on top of another, creating a linear history. While this produces a cleaner log, it rewrites commit hashes and should never be done on shared/public branches. The golden rule: never rebase commits that have been pushed and shared with others.</p><div class="learn-code">// Merge: preserves branch history\ngit checkout main\ngit merge feature/login\n\n// Rebase: creates linear history\ngit checkout feature/login\ngit rebase main\n\n// Interactive rebase: squash, edit, reorder commits\ngit rebase -i HEAD~3</div><div class="learn-warn">Never force-push to shared branches like <code>main</code> or <code>develop</code>. Force-pushing rewrites remote history and can cause other developers to lose their work.</div></div><div class="learn-section"><div class="learn-h">Git Flow</div><p class="learn-p">Git Flow is a branching model introduced by Vincent Driessen that defines a strict branching structure for larger projects. It uses two long-lived branches and three types of supporting branches.</p><ul class="learn-list"><li><strong>main (master):</strong> Always reflects production-ready state. Every commit is a release.</li><li><strong>develop:</strong> Integration branch for features. Reflects the latest delivered development changes.</li><li><strong>feature/*:</strong> Branch off develop, merge back into develop. For new features.</li><li><strong>release/*:</strong> Branch off develop, merge into both main and develop. For release preparation (version bumps, final fixes).</li><li><strong>hotfix/*:</strong> Branch off main, merge into both main and develop. For critical production fixes.</li></ul><p class="learn-p">Git Flow works well for projects with scheduled release cycles, but can be overly complex for continuous deployment. The overhead of maintaining multiple long-lived branches and the ceremony of release branches makes it less suitable for web applications that deploy multiple times per day.</p></div><div class="learn-section"><div class="learn-h">GitHub Flow & Trunk-Based Development</div><p class="learn-p"><strong>GitHub Flow</strong> is a simpler alternative that uses only one long-lived branch (main). Developers create feature branches from main, open Pull Requests for code review, and merge back to main after approval. Main is always deployable. This model works excellently with continuous deployment.</p><p class="learn-p"><strong>Trunk-Based Development</strong> takes simplicity further: developers commit directly to a single trunk (main) branch, or use very short-lived feature branches (lasting hours, not days). It relies heavily on feature flags to hide incomplete work and requires a robust CI/CD pipeline with comprehensive automated tests.</p><table class="learn-table"><tr><th>Strategy</th><th>Long-lived Branches</th><th>Best For</th><th>Complexity</th></tr><tr><td>Git Flow</td><td>main + develop</td><td>Versioned releases, large teams</td><td>High</td></tr><tr><td>GitHub Flow</td><td>main only</td><td>Continuous deployment, web apps</td><td>Low</td></tr><tr><td>Trunk-Based</td><td>main only (no feature branches)</td><td>High-velocity teams, CI/CD</td><td>Low (needs feature flags)</td></tr><tr><td>GitLab Flow</td><td>main + environment branches</td><td>Multiple deployment environments</td><td>Medium</td></tr></table><div class="learn-tip">For most MERN stack web applications, GitHub Flow is the recommended strategy. It\'s simple, encourages code review through PRs, and aligns well with continuous deployment to cloud platforms.</div></div><div class="learn-section"><div class="learn-h">Conflict Resolution & Best Practices</div><p class="learn-p">Merge conflicts occur when two branches modify the same lines of the same file. Git marks conflicts with special markers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) that you must manually resolve. To minimize conflicts: pull frequently, keep branches short-lived, communicate with your team about who is working on what, and break large changes into smaller, focused commits.</p><div class="learn-code">// Resolving conflicts\ngit merge feature/login        // Conflict occurs\n// Edit conflicting files manually\ngit add &lt;resolved-files&gt;\ngit commit                     // Complete the merge\n\n// Useful tools\ngit stash                      // Temporarily save uncommitted work\ngit stash pop                  // Restore stashed work\ngit cherry-pick &lt;commit-hash&gt;  // Apply a specific commit\ngit reflog                     // Recovery: find lost commits\ngit bisect start               // Binary search for bug-introducing commit</div><p class="learn-p">Best practices for commits: write meaningful commit messages following the Conventional Commits format (e.g., <code>feat: add login page</code>, <code>fix: resolve null pointer in auth</code>), keep commits atomic (one logical change per commit), and never commit secrets, large binaries, or generated files. Use <code>.gitignore</code> to exclude files like <code>node_modules/</code>, <code>.env</code>, and build artifacts.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Committing to main:</b> Always work on feature branches. Protect main with branch rules requiring PR reviews.</li><li><b>Rebase vs merge:</b> Rebase rewrites history (cleaner, linear). Merge preserves history (safer, easier to revert). Never rebase public/shared branches.</li><li><b>Large commits:</b> Atomic commits with a single purpose are easier to review, revert, and bisect. Do not mix refactoring with feature changes.</li><li><b>Conflict avoidance:</b> Rebase frequently from main to keep your branch up-to-date and minimize merge conflicts.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Git merge vs rebase?</b><br>A: Merge creates a merge commit preserving both branch histories. Rebase replays your commits on top of the target branch for a linear history. Rebase is preferred for feature branches; merge for long-lived branches.</p><p class="learn-p"><b>Q2: How does git bisect work?</b><br>A: Binary search through commit history to find the commit that introduced a bug. Mark commits as good/bad, and git narrows down the culprit in O(log n) steps.</p></div>',
          code: `#!/bin/bash
# ==========================================
# Git Workflow Commands Reference
# ==========================================

# --- Repository Setup ---
git init my-mern-app
cd my-mern-app
git remote add origin https://github.com/user/my-mern-app.git

# --- Branching Workflow (GitHub Flow) ---
# Start a new feature
git checkout main
git pull origin main
git checkout -b feature/user-authentication

# Make changes, stage, and commit
git add src/auth/login.js src/auth/register.js
git commit -m "feat: add login and registration forms"

git add src/auth/middleware.js
git commit -m "feat: add JWT authentication middleware"

# Push feature branch and create PR
git push -u origin feature/user-authentication
# Then create PR via GitHub UI or CLI:
# gh pr create --title "Add user authentication" --body "Implements JWT auth"

# --- After PR is approved and merged ---
git checkout main
git pull origin main
git branch -d feature/user-authentication

# --- Handling Conflicts ---
git checkout feature/profile-page
git merge main
# If conflicts exist:
#   1. Open conflicted files
#   2. Resolve the <<<<<<< / ======= / >>>>>>> markers
#   3. Stage resolved files and commit
git add src/components/Header.js
git commit -m "merge: resolve header conflicts with main"

# --- Stashing Work ---
git stash save "WIP: profile page styling"
git checkout main                    # Switch to fix a bug
git checkout -b hotfix/nav-crash
# ... fix the bug, commit, push, merge PR ...
git checkout feature/profile-page
git stash pop                        # Restore WIP changes

# --- Interactive Rebase (clean up before PR) ---
git rebase -i HEAD~4
# In the editor:
#   pick   abc1234 feat: add profile component
#   squash def5678 fix typo in profile
#   pick   ghi9012 feat: add avatar upload
#   drop   jkl3456 WIP debugging stuff

# --- Useful Investigation Commands ---
git log --oneline --graph --all      # Visual branch history
git blame src/server.js              # Who changed each line
git bisect start                     # Find bug-introducing commit
git bisect bad HEAD
git bisect good v1.0.0
# Git will binary search through commits

# --- Conventional Commit Messages ---
# feat:     New feature
# fix:      Bug fix
# docs:     Documentation changes
# style:    Formatting (no code change)
# refactor: Code restructuring (no behavior change)
# test:     Adding or fixing tests
# chore:    Build, tooling, dependency updates

# --- .gitignore essentials for MERN ---
# node_modules/
# .env
# .env.local
# dist/
# build/
# coverage/
# *.log
# .DS_Store`,
          problems: [
            ['Merge Intervals', 'https://leetcode.com/problems/merge-intervals/', 'Medium'],
            ['Git Cheat Sheet & Concepts', 'https://www.geeksforgeeks.org/git-cheat-sheet/', 'Easy'],
            ['Git Branching Interactive Tutorial', 'https://learngitbranching.js.org/', 'Easy']
          ],
          mcqs: [
            {
              q: 'What is the key difference between git merge and git rebase?',
              o: [
                'Merge is faster than rebase',
                'Merge preserves branch history with a merge commit, while rebase replays commits to create a linear history',
                'Rebase can only be used on the main branch',
                'Merge deletes the source branch automatically'
              ],
              a: 1
            },
            {
              q: 'In GitHub Flow, how many long-lived branches are maintained?',
              o: ['Three: main, develop, and staging', 'Two: main and develop', 'One: main', 'None, all branches are short-lived'],
              a: 2
            },
            {
              q: 'Which command helps you find the exact commit that introduced a bug using binary search?',
              o: ['git blame', 'git log --search', 'git bisect', 'git diff --find-bug'],
              a: 2
            }
          ]
        },
        {
          t: 'Docker Containers & Images',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Docker provides consistent, reproducible environments for development and deployment. Understanding images, containers, volumes, and networking is essential for modern DevOps. Containers are used extensively across the industry, and candidates are expected to understand containerization fundamentals.</p></div><div class="learn-section"><div class="learn-h">What is Docker?</div><p class="learn-p">Docker is a platform for developing, shipping, and running applications inside lightweight, portable containers. A container packages an application with all its dependencies, libraries, and configuration files, ensuring it runs consistently across any environment -- from a developer\'s laptop to a production server. Docker solves the classic "it works on my machine" problem.</p><p class="learn-p">Key Docker concepts: An <strong>Image</strong> is a read-only template containing the application code, runtime, libraries, and dependencies. A <strong>Container</strong> is a running instance of an image -- it\'s an isolated process with its own filesystem, networking, and process tree. A <strong>Dockerfile</strong> is a text file with instructions to build an image. A <strong>Registry</strong> (like Docker Hub) stores and distributes images.</p><p class="learn-p">Docker uses OS-level virtualization through Linux kernel features (namespaces for isolation and cgroups for resource limits). Unlike virtual machines, containers share the host OS kernel, making them significantly lighter -- they start in milliseconds rather than minutes and consume far less memory.</p></div><div class="learn-section"><div class="learn-h">Dockerfile Deep Dive</div><p class="learn-p">A Dockerfile is a recipe for building a Docker image. Each instruction creates a layer in the image. Understanding layer caching is crucial for building efficient images -- Docker caches each layer and only rebuilds from the point where a change is detected.</p><div class="learn-code">FROM node:18-alpine          # Base image (Alpine = smaller)\nWORKDIR /app                  # Set working directory\n\n# Copy package files first (layer caching)\nCOPY package*.json ./\nRUN npm ci --only=production  # Install deps (cached if package.json unchanged)\n\nCOPY . .                      # Copy application code\n\nEXPOSE 3000                   # Document the port\nCMD ["node", "server.js"]     # Default command to run</div><p class="learn-p">Important Dockerfile instructions:</p><ul class="learn-list"><li><strong>FROM:</strong> Sets the base image. Always use specific tags (e.g., <code>node:18-alpine</code>) rather than <code>latest</code> for reproducibility.</li><li><strong>WORKDIR:</strong> Sets the working directory for subsequent instructions. Creates the directory if it doesn\'t exist.</li><li><strong>COPY vs ADD:</strong> Both copy files into the image. COPY is preferred; ADD has extra features (URL download, tar extraction) that can be surprising.</li><li><strong>RUN:</strong> Executes commands during build. Combine related commands with <code>&amp;&amp;</code> to reduce layers.</li><li><strong>CMD vs ENTRYPOINT:</strong> CMD sets the default command (can be overridden). ENTRYPOINT sets the executable (CMD provides default arguments to it).</li><li><strong>ENV:</strong> Sets environment variables. ARG sets build-time variables.</li></ul><div class="learn-tip">Order Dockerfile instructions from least-frequently changing to most-frequently changing. Copy <code>package.json</code> and install dependencies BEFORE copying source code. This way, the dependency installation layer is cached unless package.json changes.</div></div><div class="learn-section"><div class="learn-h">Multi-Stage Builds</div><p class="learn-p">Multi-stage builds use multiple FROM statements in a single Dockerfile. Each FROM starts a new build stage, and you can selectively copy artifacts from one stage to another. This is essential for producing small, production-ready images that don\'t contain build tools, source maps, or development dependencies.</p><div class="learn-code"># Stage 1: Build the React frontend\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production image with Nginx\nFROM nginx:alpine\nCOPY --from=builder /app/build /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]</div><p class="learn-p">The builder stage contains Node.js, npm, and all dev dependencies (potentially 500MB+). The final image only contains the static build output and Nginx (around 25MB). This dramatically reduces image size and attack surface.</p></div><div class="learn-section"><div class="learn-h">Docker Compose</div><p class="learn-p">Docker Compose is a tool for defining and running multi-container applications. A <code>docker-compose.yml</code> file describes all the services (containers), networks, and volumes your application needs. With a single command (<code>docker compose up</code>), you can start your entire MERN stack: React frontend, Node.js API, and MongoDB database.</p><div class="learn-code"># docker-compose.yml for MERN stack\nversion: "3.9"\nservices:\n  frontend:\n    build: ./client\n    ports:\n      - "3000:3000"\n    depends_on:\n      - api\n    environment:\n      - REACT_APP_API_URL=http://localhost:5000\n\n  api:\n    build: ./server\n    ports:\n      - "5000:5000"\n    depends_on:\n      - mongo\n    environment:\n      - MONGO_URI=mongodb://mongo:27017/myapp\n      - JWT_SECRET=mysecretkey\n    volumes:\n      - ./server:/app          # Hot reload in development\n      - /app/node_modules       # Anonymous volume to preserve node_modules\n\n  mongo:\n    image: mongo:7\n    ports:\n      - "27017:27017"\n    volumes:\n      - mongo-data:/data/db    # Named volume for persistence\n\nvolumes:\n  mongo-data:</div><p class="learn-p">Key Docker Compose features: <strong>depends_on</strong> controls startup order, <strong>volumes</strong> persist data and enable hot reloading, <strong>networks</strong> provide DNS-based service discovery (containers can reach each other by service name), and <strong>environment</strong> injects configuration.</p><div class="learn-warn">Never put secrets (passwords, API keys) directly in docker-compose.yml. Use Docker secrets, <code>.env</code> files (with <code>.gitignore</code>), or external secret management tools.</div></div><div class="learn-section"><div class="learn-h">Docker Best Practices</div><ul class="learn-list"><li>Use <code>.dockerignore</code> to exclude <code>node_modules</code>, <code>.git</code>, <code>.env</code>, and other unnecessary files from the build context.</li><li>Run containers as a non-root user with the <code>USER</code> instruction for security.</li><li>Use Alpine-based images (<code>node:18-alpine</code>) for smaller image sizes.</li><li>Pin dependency versions for reproducible builds.</li><li>Use health checks: <code>HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1</code></li><li>Clean up in the same RUN layer: <code>RUN npm ci &amp;&amp; npm cache clean --force</code></li><li>Scan images for vulnerabilities: <code>docker scout quickview</code></li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Large images:</b> Use multi-stage builds and alpine base images. A Node.js image can be 1GB vs 150MB with alpine.</li><li><b>Running as root:</b> Containers should run as non-root users for security. Add USER directive in Dockerfile.</li><li><b>No .dockerignore:</b> Without it, node_modules and .git are copied into the build context, slowing builds.</li><li><b>Layer caching:</b> Copy package.json before source code so dependency installation is cached when only code changes.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Image vs container?</b><br>A: An image is a read-only template (like a class). A container is a running instance of an image (like an object). Multiple containers can run from the same image.</p><p class="learn-p"><b>Q2: What is a multi-stage build?</b><br>A: Using multiple FROM statements in a Dockerfile. Build in a full image, copy only the output to a minimal runtime image. Reduces final image size dramatically.</p></div>',
          code: `# ==========================================
# Dockerfile for a MERN Stack Node.js API
# ==========================================

# --- Dockerfile (server/Dockerfile) ---

# Use specific Alpine version for smaller image
FROM node:18-alpine AS base

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy dependency files first (layer caching optimization)
COPY package.json package-lock.json ./

# --- Development Stage ---
FROM base AS development
RUN npm ci
COPY . .
USER appuser
EXPOSE 5000
CMD ["npm", "run", "dev"]

# --- Production Stage ---
FROM base AS production
RUN npm ci --only=production && npm cache clean --force
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

USER appuser
EXPOSE 5000
CMD ["node", "server.js"]


# ==========================================
# docker-compose.yml (Full MERN Stack)
# ==========================================

# version: "3.9"
# services:
#   client:
#     build:
#       context: ./client
#       target: development
#     ports:
#       - "3000:3000"
#     volumes:
#       - ./client/src:/app/src    # Hot reload
#     depends_on:
#       - api
#     environment:
#       - REACT_APP_API_URL=http://localhost:5000
#
#   api:
#     build:
#       context: ./server
#       target: development
#     ports:
#       - "5000:5000"
#     volumes:
#       - ./server:/app
#       - /app/node_modules
#     depends_on:
#       mongo:
#         condition: service_healthy
#     env_file:
#       - ./server/.env
#
#   mongo:
#     image: mongo:7
#     ports:
#       - "27017:27017"
#     volumes:
#       - mongo-data:/data/db
#     healthcheck:
#       test: mongosh --eval "db.adminCommand('ping')"
#       interval: 10s
#       timeout: 5s
#       retries: 5
#
# volumes:
#   mongo-data:


# ==========================================
# Common Docker Commands Reference
# ==========================================

# Build and tag an image
# docker build -t myapp:1.0 -f server/Dockerfile ./server

# Run a container
# docker run -d -p 5000:5000 --name api --env-file .env myapp:1.0

# Docker Compose commands
# docker compose up -d              # Start all services (detached)
# docker compose down               # Stop and remove containers
# docker compose logs -f api        # Follow logs for a service
# docker compose exec api sh        # Shell into running container
# docker compose build --no-cache   # Rebuild without cache

# Image management
# docker images                     # List images
# docker rmi myapp:1.0              # Remove image
# docker system prune -a            # Clean up unused resources

# Container management
# docker ps                         # List running containers
# docker ps -a                      # List all containers
# docker stop api                   # Stop a container
# docker logs api --tail 50         # View last 50 log lines
# docker inspect api                # Detailed container info`,
          problems: [
            ['Design a Container Runtime (System Design)', 'https://www.geeksforgeeks.org/docker-tutorial/', 'Medium'],
            ['Docker Basics & Commands', 'https://www.geeksforgeeks.org/docker-tutorial/', 'Easy']
          ],
          mcqs: [
            {
              q: 'What is the primary advantage of Docker containers over virtual machines?',
              o: [
                'Containers provide better security isolation',
                'Containers share the host OS kernel, making them lighter and faster to start',
                'Containers can run different operating systems simultaneously',
                'Containers have more storage capacity'
              ],
              a: 1
            },
            {
              q: 'In a Dockerfile, why should you copy package.json and run npm install BEFORE copying the rest of the source code?',
              o: [
                'It is required by Docker syntax',
                'To reduce the image size',
                'To leverage Docker layer caching so dependencies are only reinstalled when package.json changes',
                'To prevent npm from accessing source files during installation'
              ],
              a: 2
            },
            {
              q: 'What does the "depends_on" directive in docker-compose.yml control?',
              o: [
                'It ensures one container runs inside another',
                'It controls the order in which services are started',
                'It shares environment variables between services',
                'It links container volumes together'
              ],
              a: 1
            }
          ]
        },
        {
          t: 'CI/CD with GitHub Actions',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">CI/CD automates testing, building, and deploying code on every push. GitHub Actions is the most popular CI/CD platform for open-source and many companies. Teams value automated quality gates — tests, linting, and security scans that run before code reaches production.</p></div><div class="learn-section"><div class="learn-h">What is CI/CD?</div><p class="learn-p"><strong>Continuous Integration (CI)</strong> is the practice of frequently merging code changes into a shared repository, where automated builds and tests verify each integration. The goal is to catch bugs early, reduce integration problems, and maintain a always-releasable codebase. Every push triggers an automated pipeline that builds the code, runs unit tests, linting, and security checks.</p><p class="learn-p"><strong>Continuous Delivery (CD)</strong> extends CI by automatically preparing code for release to production. Every change that passes the CI pipeline is deployable, but the actual deployment may require manual approval. <strong>Continuous Deployment</strong> goes one step further -- every change that passes all tests is automatically deployed to production without human intervention.</p><p class="learn-p">The CI/CD pipeline for a MERN application typically includes: code checkout, dependency installation, linting, unit tests, integration tests, building the application, building Docker images, pushing to a container registry, and deploying to the target environment (staging, then production).</p></div><div class="learn-section"><div class="learn-h">GitHub Actions Fundamentals</div><p class="learn-p">GitHub Actions is a CI/CD platform built into GitHub. It allows you to automate workflows triggered by events like pushes, pull requests, schedules, or manual dispatch. Workflows are defined in YAML files inside the <code>.github/workflows/</code> directory.</p><p class="learn-p">Core concepts:</p><ul class="learn-list"><li><strong>Workflow:</strong> An automated process defined in a YAML file. A repository can have multiple workflows.</li><li><strong>Event:</strong> A trigger that starts a workflow (push, pull_request, schedule, workflow_dispatch).</li><li><strong>Job:</strong> A set of steps that execute on the same runner. Jobs run in parallel by default; use <code>needs</code> for sequential execution.</li><li><strong>Step:</strong> An individual task within a job. It can run a command or use an action.</li><li><strong>Action:</strong> A reusable unit of code (from GitHub Marketplace or custom). E.g., <code>actions/checkout@v4</code>, <code>actions/setup-node@v4</code>.</li><li><strong>Runner:</strong> The server that executes the workflow (GitHub-hosted or self-hosted).</li></ul><div class="learn-code"># .github/workflows/ci.yml\nname: CI Pipeline\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 18\n          cache: \'npm\'\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test -- --coverage</div></div><div class="learn-section"><div class="learn-h">Advanced Workflow Features</div><p class="learn-p"><strong>Matrix Strategy:</strong> Run the same job with different configurations (Node versions, OS, etc.). This ensures compatibility across environments.</p><div class="learn-code">jobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [16, 18, 20]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node-version }}\n      - run: npm ci\n      - run: npm test</div><p class="learn-p"><strong>Secrets and Environment Variables:</strong> Sensitive data (API keys, tokens, passwords) should never be hardcoded. GitHub Secrets are encrypted and exposed as environment variables. Access them via <code>${{ secrets.SECRET_NAME }}</code>.</p><p class="learn-p"><strong>Caching:</strong> Speed up workflows by caching dependencies. The <code>actions/cache</code> action or built-in cache support in <code>actions/setup-node</code> can cache <code>node_modules</code> or the npm cache directory, cutting minutes off each run.</p><p class="learn-p"><strong>Artifacts:</strong> Upload and download build outputs between jobs using <code>actions/upload-artifact</code> and <code>actions/download-artifact</code>. Useful for passing build results to deployment jobs or storing test reports.</p><div class="learn-tip">Use <code>concurrency</code> groups to cancel in-progress workflow runs when new commits are pushed to the same branch. This saves runner minutes and avoids deploying outdated code.</div></div><div class="learn-section"><div class="learn-h">CI/CD Pipeline for MERN Applications</div><p class="learn-p">A production-grade MERN CI/CD pipeline typically has multiple jobs that run in sequence: lint and test, build, deploy to staging, run E2E tests, and deploy to production.</p><div class="learn-code"># Complete MERN CI/CD Pipeline\nname: Deploy MERN App\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      mongodb:\n        image: mongo:7\n        ports:\n          - 27017:27017\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 18, cache: \'npm\' }\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test\n        env:\n          MONGO_URI: mongodb://localhost:27017/test\n\n  build-and-push:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n      - uses: docker/build-push-action@v5\n        with:\n          push: true\n          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}\n\n  deploy:\n    needs: build-and-push\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - name: Deploy to server\n        run: |\n          ssh ${{ secrets.DEPLOY_HOST }} "docker pull ghcr.io/${{ github.repository }}:${{ github.sha }} &amp;&amp; docker compose up -d"</div><p class="learn-p">The <code>services</code> keyword spins up Docker containers as service dependencies (like MongoDB) for testing. The <code>environment</code> keyword enables environment-specific protection rules, required reviewers, and secrets.</p><div class="learn-warn">Always use specific versions for actions (e.g., <code>actions/checkout@v4</code>, not <code>@main</code>). Using <code>@main</code> or <code>@latest</code> means a compromised action could inject malicious code into your pipeline.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>No caching:</b> Installing dependencies on every run wastes time. Cache node_modules with actions/cache.</li><li><b>Secrets in code:</b> Never hardcode API keys or tokens. Use GitHub Secrets and reference them as ${{ secrets.NAME }}.</li><li><b>Missing matrix:</b> Test across multiple Node versions and OS to catch compatibility issues.</li><li><b>Flaky tests:</b> Tests that sometimes fail erode CI trust. Fix or quarantine flaky tests immediately.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What triggers a GitHub Actions workflow?</b><br>A: Events like push, pull_request, schedule (cron), workflow_dispatch (manual), or repository_dispatch (API). Configured in the on: section of the workflow YAML.</p><p class="learn-p"><b>Q2: What is a CI/CD pipeline?</b><br>A: CI: Automatically build and test code on every push. CD: Automatically deploy passing builds to staging/production. Together they ensure code quality and fast delivery.</p></div>',
          code: `# ==========================================
# GitHub Actions CI/CD for MERN Stack
# .github/workflows/ci-cd.yml
# ==========================================

name: MERN CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

# Cancel in-progress runs for the same branch
concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: 18
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  # --- Job 1: Lint & Test ---
  test:
    name: Lint & Test
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.adminCommand({ping:1})'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: npm

      - name: Install dependencies
        run: |
          npm ci
          cd client && npm ci

      - name: Run linter
        run: npm run lint

      - name: Run server tests
        run: npm test -- --coverage
        env:
          MONGO_URI: mongodb://localhost:27017/testdb
          JWT_SECRET: test-secret-key

      - name: Run client tests
        run: cd client && npm test -- --coverage --watchAll=false

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-node\${{ matrix.node-version }}
          path: coverage/

  # --- Job 2: Build Docker Image ---
  build:
    name: Build & Push Image
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
            \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest

  # --- Job 3: Deploy to Production ---
  deploy:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.DEPLOY_HOST }}
          username: \${{ secrets.DEPLOY_USER }}
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/myapp
            docker pull \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
            docker compose up -d --no-deps api
            docker image prune -f

      - name: Verify deployment
        run: |
          sleep 10
          curl -f https://myapp.com/health || exit 1

      - name: Notify on Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: \${{ job.status }}
          fields: repo,message,commit,author
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}`,
          problems: [
            ['Build a CI Pipeline (Hands-on)', 'https://www.geeksforgeeks.org/what-is-ci-cd/', 'Medium']
          ],
          mcqs: [
            {
              q: 'What is the difference between Continuous Delivery and Continuous Deployment?',
              o: [
                'They are the same thing',
                'Continuous Delivery requires manual approval for production deployment; Continuous Deployment is fully automated',
                'Continuous Deployment only works with Docker',
                'Continuous Delivery does not include automated testing'
              ],
              a: 1
            },
            {
              q: 'In GitHub Actions, what does the "needs" keyword do in a job definition?',
              o: [
                'It specifies required environment variables',
                'It lists required GitHub permissions',
                'It creates a dependency between jobs, ensuring sequential execution',
                'It defines the Node.js version needed'
              ],
              a: 2
            },
            {
              q: 'Why should you use specific version tags for actions (e.g., actions/checkout@v4) instead of @main?',
              o: [
                'Using @main is slower',
                'Specific versions are required by GitHub syntax',
                'Using @main could introduce breaking changes or security vulnerabilities from upstream updates',
                'Specific versions use less storage'
              ],
              a: 2
            }
          ]
        },
        {
          t: 'Monitoring & Logging (ELK/Prometheus)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Monitoring and logging are essential for maintaining production systems. Understanding metrics collection, log aggregation, and alerting helps diagnose issues before they impact users. Any team running complex systems treats observability as critical.</p></div><div class="learn-section"><div class="learn-h">Why Monitoring & Logging Matter</div><p class="learn-p">Monitoring and logging are essential pillars of production operations. <strong>Monitoring</strong> tracks the health and performance of your systems in real-time through metrics (CPU usage, memory, request latency, error rates). <strong>Logging</strong> records discrete events that happen in your application (errors, user actions, API calls). <strong>Alerting</strong> notifies your team when metrics exceed thresholds or anomalies are detected.</p><p class="learn-p">The three pillars of observability are: <strong>Metrics</strong> (numerical measurements over time), <strong>Logs</strong> (timestamped records of events), and <strong>Traces</strong> (end-to-end tracking of requests across services). Together, they give you full visibility into what your application is doing and why it might be failing.</p><p class="learn-p">For a MERN stack application in production, you need to monitor: server response times, database query performance, error rates (4xx and 5xx), active connections, CPU and memory usage, disk I/O, and custom business metrics (sign-ups, orders, etc.).</p></div><div class="learn-section"><div class="learn-h">Application Logging with Winston</div><p class="learn-p">Winston is the most popular logging library for Node.js. It supports multiple transports (console, file, HTTP, database), log levels, custom formatting, and structured JSON logging. Structured logs are machine-parseable, making them searchable and analyzable.</p><div class="learn-code">const winston = require(\'winston\');\n\nconst logger = winston.createLogger({\n  level: \'info\',\n  format: winston.format.combine(\n    winston.format.timestamp(),\n    winston.format.errors({ stack: true }),\n    winston.format.json()\n  ),\n  defaultMeta: { service: \'api-server\' },\n  transports: [\n    new winston.transports.File({ filename: \'error.log\', level: \'error\' }),\n    new winston.transports.File({ filename: \'combined.log\' })\n  ]\n});\n\n// In development, also log to console\nif (process.env.NODE_ENV !== \'production\') {\n  logger.add(new winston.transports.Console({\n    format: winston.format.simple()\n  }));\n}\n\nlogger.info(\'Server started\', { port: 3000 });\nlogger.error(\'Database connection failed\', { error: err.message });</div><p class="learn-p">Log levels in Winston (from highest to lowest priority): error, warn, info, http, verbose, debug, silly. In production, set the level to \'info\' or \'warn\' to avoid excessive log volume. Use structured metadata objects rather than string interpolation for machine-parseable logs.</p><div class="learn-tip">Always include a correlation/request ID in your logs. This allows you to trace a single user request across multiple log entries and services. Use middleware to generate and attach a unique ID to each incoming request.</div></div><div class="learn-section"><div class="learn-h">The ELK Stack</div><p class="learn-p">The ELK Stack consists of three open-source products that work together for log management: <strong>Elasticsearch</strong> (search and analytics engine), <strong>Logstash</strong> (log processing pipeline), and <strong>Kibana</strong> (visualization dashboard). Modern deployments often use <strong>Filebeat</strong> instead of Logstash for log shipping, forming the "EFK" stack.</p><ul class="learn-list"><li><strong>Elasticsearch:</strong> A distributed search engine built on Apache Lucene. It stores and indexes log data, enabling fast full-text search across millions of log entries. It supports complex queries, aggregations, and real-time analytics.</li><li><strong>Logstash:</strong> A data processing pipeline that ingests logs from multiple sources, transforms them (parsing, filtering, enriching), and sends them to Elasticsearch. It supports over 200 input/output plugins.</li><li><strong>Kibana:</strong> A web interface for visualizing Elasticsearch data. Create dashboards with charts, tables, maps, and histograms. Set up saved searches and alerts based on log patterns.</li><li><strong>Filebeat:</strong> A lightweight log shipper installed on application servers. It monitors log files, forwards them to Logstash or Elasticsearch directly, with guaranteed delivery and backpressure handling.</li></ul><div class="learn-code"># Filebeat configuration (filebeat.yml)\nfilebeat.inputs:\n  - type: log\n    paths:\n      - /var/log/myapp/*.log\n    json.keys_under_root: true\n    json.add_error_key: true\n\noutput.elasticsearch:\n  hosts: ["http://elasticsearch:9200"]\n  index: "myapp-logs-%{+yyyy.MM.dd}"\n\n# Logstash pipeline (if needed)\nfilter {\n  json { source =&gt; "message" }\n  date { match =&gt; ["timestamp", "ISO8601"] }\n  mutate { remove_field =&gt; ["host", "agent"] }\n}</div></div><div class="learn-section"><div class="learn-h">Prometheus & Grafana</div><p class="learn-p"><strong>Prometheus</strong> is an open-source monitoring system and time-series database. Unlike ELK which handles logs, Prometheus handles metrics. It uses a pull-based model: Prometheus scrapes HTTP endpoints on your application that expose metrics in a specific format. It has a powerful query language called PromQL for analyzing time-series data.</p><p class="learn-p"><strong>Grafana</strong> is a visualization platform that connects to Prometheus (and many other data sources) to create beautiful, real-time dashboards. It supports alerts, annotations, and team collaboration.</p><p class="learn-p">For Node.js applications, the <code>prom-client</code> library exposes application metrics. Common metric types:</p><table class="learn-table"><tr><th>Metric Type</th><th>Purpose</th><th>Example</th></tr><tr><td>Counter</td><td>Monotonically increasing value</td><td>Total HTTP requests, total errors</td></tr><tr><td>Gauge</td><td>Value that goes up and down</td><td>Active connections, memory usage</td></tr><tr><td>Histogram</td><td>Distribution of values in buckets</td><td>Request duration, response sizes</td></tr><tr><td>Summary</td><td>Similar to histogram with quantiles</td><td>Request latency percentiles</td></tr></table><div class="learn-code">const promClient = require(\'prom-client\');\n\n// Default metrics (CPU, memory, event loop lag)\npromClient.collectDefaultMetrics();\n\n// Custom metrics\nconst httpRequestDuration = new promClient.Histogram({\n  name: \'http_request_duration_seconds\',\n  help: \'Duration of HTTP requests in seconds\',\n  labelNames: [\'method\', \'route\', \'status_code\'],\n  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5]\n});\n\n// Expose /metrics endpoint for Prometheus\napp.get(\'/metrics\', async (req, res) =&gt; {\n  res.set(\'Content-Type\', promClient.register.contentType);\n  res.end(await promClient.register.metrics());\n});</div><div class="learn-warn">Be careful with high-cardinality labels in Prometheus metrics. Labels like user IDs or request paths with dynamic segments can create millions of time series, causing Prometheus to consume excessive memory and slow down.</div></div><div class="learn-section"><div class="learn-h">Health Checks & Alerting</div><p class="learn-p">Health check endpoints let monitoring tools and load balancers verify your application is running correctly. A basic health check returns a 200 OK status. A deep health check also verifies database connectivity, external service availability, and disk space.</p><p class="learn-p">Alerting rules are configured in Prometheus (using Alertmanager) or Grafana. Common alerts for MERN apps include: error rate exceeding a threshold, response time degradation, database connection pool exhaustion, high CPU/memory usage, and disk space running low. Use PagerDuty, Slack, or email integrations for alert notifications.</p><div class="learn-code">// Health check endpoint\napp.get(\'/health\', async (req, res) =&gt; {\n  try {\n    await mongoose.connection.db.admin().ping();\n    res.json({\n      status: \'healthy\',\n      uptime: process.uptime(),\n      timestamp: new Date().toISOString(),\n      database: \'connected\'\n    });\n  } catch (err) {\n    res.status(503).json({ status: \'unhealthy\', database: \'disconnected\' });\n  }\n});</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Logging everything:</b> Excessive logging increases costs and makes it harder to find relevant information. Log at appropriate levels (error, warn, info, debug).</li><li><b>No structured logging:</b> Plain text logs are hard to search and analyze. Use JSON-structured logging with consistent fields.</li><li><b>Missing correlation IDs:</b> Without request IDs, tracing a request across microservices is impossible.</li><li><b>Alert fatigue:</b> Too many non-actionable alerts cause teams to ignore all alerts. Only alert on actionable conditions with clear runbooks.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Prometheus vs ELK?</b><br>A: Prometheus is for metrics (time-series data: CPU, memory, request rates). ELK (Elasticsearch, Logstash, Kibana) is for log aggregation and search. Use both together for full observability.</p><p class="learn-p"><b>Q2: What are the four golden signals?</b><br>A: Latency, traffic, errors, and saturation. Monitor these for every service to detect issues quickly.</p></div>',
          code: `// ==========================================
// Monitoring & Logging for MERN Stack
// ==========================================

const express = require('express');
const winston = require('winston');
const promClient = require('prom-client');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();

// --- Winston Logger Setup ---
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mern-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 5 })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple())
  }));
}

// --- Request ID Middleware (for log correlation) ---
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// --- HTTP Request Logging with Morgan + Winston ---
const morganStream = { write: (message) => logger.http(message.trim()) };
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// --- Prometheus Metrics Setup ---
promClient.collectDefaultMetrics({ prefix: 'mern_' });

const httpRequestsTotal = new promClient.Counter({
  name: 'mern_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDuration = new promClient.Histogram({
  name: 'mern_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

const activeConnections = new promClient.Gauge({
  name: 'mern_active_connections',
  help: 'Number of active connections'
});

// --- Metrics Collection Middleware ---
app.use((req, res, next) => {
  activeConnections.inc();
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    const labels = { method: req.method, route, status_code: res.statusCode };
    httpRequestsTotal.inc(labels);
    const duration = end(labels);
    activeConnections.dec();
    // Log every request with correlation ID
    logger.info('Request completed', {
      requestId: req.id, method: req.method, url: req.url,
      statusCode: res.statusCode, duration
    });
  });
  next();
});

// --- Prometheus Metrics Endpoint ---
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (err) {
    logger.error('Failed to collect metrics', { error: err.message });
    res.status(500).end();
  }
});

// --- Health Check Endpoints ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/health/deep', async (req, res) => {
  const checks = { database: 'unknown', memory: 'unknown' };
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    await mongoose.connection.db.admin().ping();
    checks.database = 'connected';
  } catch (e) { checks.database = 'disconnected'; }
  // Check memory usage
  const memUsage = process.memoryUsage();
  const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
  checks.memory = heapUsedMB < 512 ? 'ok' : 'warning';
  const healthy = checks.database === 'connected' && checks.memory === 'ok';
  res.status(healthy ? 200 : 503).json({ status: healthy ? 'healthy' : 'degraded', checks });
});

// --- Error Logging Middleware ---
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    requestId: req.id, error: err.message, stack: err.stack,
    method: req.method, url: req.url
  });
  res.status(err.status || 500).json({ error: 'Internal Server Error' });
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;`,
          problems: [
            ['Design a Logging System', 'https://www.geeksforgeeks.org/logging-in-node-js/', 'Medium'],
            ['Rate Limiter (System Design)', 'https://leetcode.com/problems/logger-rate-limiter/', 'Easy'],
            ['Monitoring & Observability Guide', 'https://www.geeksforgeeks.org/prometheus-monitoring/', 'Medium']
          ],
          mcqs: [
            {
              q: 'What are the three pillars of observability?',
              o: [
                'CPU, Memory, and Disk',
                'Metrics, Logs, and Traces',
                'Monitoring, Alerting, and Dashboarding',
                'Availability, Latency, and Throughput'
              ],
              a: 1
            },
            {
              q: 'In Prometheus, which metric type is best suited for tracking HTTP request durations?',
              o: ['Counter', 'Gauge', 'Histogram', 'Summary'],
              a: 2
            },
            {
              q: 'What is the primary difference between Prometheus and the ELK Stack?',
              o: [
                'Prometheus is for metrics (time-series data); ELK is for log aggregation and search',
                'Prometheus is open-source; ELK is proprietary',
                'Prometheus only works with Kubernetes; ELK works everywhere',
                'There is no difference, they serve the same purpose'
              ],
              a: 0
            }
          ]
        }
      ]
    },
    {
      id: 'cloud',
      t: 'Cloud Deployment',
      topics: [
        {
          t: 'AWS Core Services (EC2, S3, Lambda)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">AWS is the dominant cloud platform. Understanding core services like EC2 (compute), S3 (storage), and Lambda (serverless) is essential for modern application deployment. AWS is used extensively across the industry, and candidates are expected to understand cloud architecture tradeoffs.</p></div><div class="learn-section"><div class="learn-h">Introduction to AWS</div><p class="learn-p">Amazon Web Services (AWS) is the world\'s leading cloud computing platform, offering over 200 services ranging from compute and storage to machine learning and IoT. For MERN stack developers, understanding core AWS services is essential for deploying, scaling, and maintaining production applications. AWS operates on a pay-as-you-go model and provides a global infrastructure of data centers organized into Regions and Availability Zones (AZs).</p><p class="learn-p">Key AWS concepts: A <strong>Region</strong> is a geographical area (e.g., us-east-1, ap-south-1) containing multiple data centers. An <strong>Availability Zone</strong> is an isolated data center within a region. <strong>IAM (Identity and Access Management)</strong> controls who can access what. The <strong>VPC (Virtual Private Cloud)</strong> is your isolated network in the cloud. Understanding the <strong>Shared Responsibility Model</strong> is critical: AWS manages security OF the cloud (hardware, networking); you manage security IN the cloud (data, access, application code).</p></div><div class="learn-section"><div class="learn-h">EC2 (Elastic Compute Cloud)</div><p class="learn-p">EC2 provides resizable virtual servers (instances) in the cloud. You choose the instance type (CPU, memory, storage), operating system, and configure networking and security. EC2 is ideal for running your Node.js API server, background workers, or any application that needs full control over the computing environment.</p><p class="learn-p">Key EC2 concepts:</p><ul class="learn-list"><li><strong>Instance Types:</strong> t3.micro (free tier, burstable), t3.medium (general purpose), c5.xlarge (compute-optimized), r5.large (memory-optimized). Choose based on your workload.</li><li><strong>AMI (Amazon Machine Image):</strong> A template for the instance OS and software. Use Amazon Linux 2, Ubuntu, or create custom AMIs with your app pre-installed.</li><li><strong>Security Groups:</strong> Virtual firewalls controlling inbound and outbound traffic. Allow port 80/443 for HTTP/HTTPS, 22 for SSH, and your app port (e.g., 5000).</li><li><strong>Elastic IP:</strong> A static public IP address that persists across instance stops/starts.</li><li><strong>Key Pairs:</strong> SSH key pairs for secure instance access.</li><li><strong>Auto Scaling Groups:</strong> Automatically add or remove instances based on demand (CPU utilization, request count).</li></ul><div class="learn-code"># Launch an EC2 instance and deploy Node.js app\nssh -i mykey.pem ec2-user@ec2-xx-xx-xx-xx.compute.amazonaws.com\n\n# Install Node.js on Amazon Linux 2\ncurl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -\nsudo yum install -y nodejs\n\n# Clone and run your app\ngit clone https://github.com/user/mern-app.git\ncd mern-app &amp;&amp; npm install\n\n# Use PM2 for process management\nsudo npm install -g pm2\npm2 start server.js --name "api"\npm2 startup    # Auto-start on reboot\npm2 save</div><div class="learn-tip">Use PM2 (Process Manager 2) to run your Node.js app on EC2. PM2 provides automatic restarts on crash, load balancing across CPU cores with cluster mode, log management, and zero-downtime reloads.</div></div><div class="learn-section"><div class="learn-h">S3 (Simple Storage Service)</div><p class="learn-p">S3 is an object storage service offering virtually unlimited storage with 99.999999999% (11 nines) durability. It\'s perfect for storing user uploads, static website assets, backups, and logs. Objects are stored in <strong>buckets</strong> (globally unique containers) and accessed via HTTP URLs.</p><p class="learn-p">S3 storage classes optimize cost based on access patterns: <strong>Standard</strong> (frequent access), <strong>Intelligent-Tiering</strong> (automatic cost optimization), <strong>Standard-IA</strong> (infrequent access), <strong>Glacier</strong> (archival, minutes to hours retrieval), and <strong>Glacier Deep Archive</strong> (cheapest, 12-hour retrieval).</p><div class="learn-code">// AWS SDK v3 - Upload file to S3\nconst { S3Client, PutObjectCommand, GetObjectCommand } = require(\'@aws-sdk/client-s3\');\nconst { getSignedUrl } = require(\'@aws-sdk/s3-request-presigner\');\n\nconst s3 = new S3Client({ region: \'us-east-1\' });\n\n// Upload a file\nasync function uploadFile(buffer, key, contentType) {\n  await s3.send(new PutObjectCommand({\n    Bucket: \'my-mern-app-uploads\',\n    Key: key,\n    Body: buffer,\n    ContentType: contentType\n  }));\n}\n\n// Generate a pre-signed URL (temporary secure access)\nasync function getPresignedUrl(key) {\n  const command = new GetObjectCommand({ Bucket: \'my-mern-app-uploads\', Key: key });\n  return getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour\n}</div><p class="learn-p">For hosting a React frontend, enable S3 Static Website Hosting on a bucket, upload your build files, and put CloudFront (AWS CDN) in front for HTTPS, caching, and global distribution. This is one of the most cost-effective ways to serve a React SPA.</p></div><div class="learn-section"><div class="learn-h">Lambda (Serverless Compute)</div><p class="learn-p">AWS Lambda lets you run code without provisioning or managing servers. You upload your function code, and Lambda automatically handles scaling, patching, and availability. You pay only for the compute time consumed -- there\'s no charge when your code isn\'t running. Lambda supports Node.js, Python, Java, Go, and other runtimes.</p><p class="learn-p">Lambda functions are triggered by events from other AWS services: API Gateway (HTTP requests), S3 (file uploads), DynamoDB Streams (data changes), SQS (message queues), CloudWatch Events (scheduled tasks), and more.</p><div class="learn-code">// Lambda function: Process uploaded image\nexports.handler = async (event) =&gt; {\n  const bucket = event.Records[0].s3.bucket.name;\n  const key = event.Records[0].s3.object.key;\n\n  console.log(\'Processing:\', key, \'from\', bucket);\n\n  // Resize image, generate thumbnail, etc.\n  // ...\n\n  return { statusCode: 200, body: \'Image processed\' };\n};\n\n// Lambda + API Gateway = Serverless API\nexports.getUsers = async (event) =&gt; {\n  const users = await db.collection(\'users\').find().toArray();\n  return {\n    statusCode: 200,\n    headers: { \'Content-Type\': \'application/json\' },\n    body: JSON.stringify(users)\n  };\n};</div><p class="learn-p">Lambda limitations to know: maximum execution time of 15 minutes, 250MB deployment package size (unzipped), 10GB container image size, cold starts (first invocation after idle period takes longer), and limited local storage (/tmp, 10GB). For long-running processes or applications needing persistent connections (WebSockets), EC2 or ECS may be better choices.</p><div class="learn-warn">Lambda cold starts can add 100ms-2s of latency to the first request after an idle period. Mitigate this with Provisioned Concurrency (keeps functions warm) or by using smaller deployment packages and avoiding heavy initialization code.</div></div><div class="learn-section"><div class="learn-h">Other Essential AWS Services for MERN</div><table class="learn-table"><tr><th>Service</th><th>Purpose</th><th>MERN Use Case</th></tr><tr><td>RDS / DocumentDB</td><td>Managed databases</td><td>Managed MongoDB-compatible database (DocumentDB)</td></tr><tr><td>ElastiCache</td><td>In-memory caching</td><td>Redis for session storage, API caching</td></tr><tr><td>CloudFront</td><td>CDN</td><td>Serve React app globally with low latency</td></tr><tr><td>Route 53</td><td>DNS</td><td>Domain name management and routing</td></tr><tr><td>SQS / SNS</td><td>Messaging</td><td>Background job queues, notifications</td></tr><tr><td>CloudWatch</td><td>Monitoring</td><td>Logs, metrics, alarms for your application</td></tr><tr><td>Secrets Manager</td><td>Secret storage</td><td>Database passwords, API keys</td></tr><tr><td>ACM</td><td>SSL/TLS certificates</td><td>Free HTTPS certificates for your domains</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Over-provisioning:</b> Running large EC2 instances 24/7 for variable workloads wastes money. Use auto-scaling groups or serverless for variable loads.</li><li><b>Public S3 buckets:</b> Misconfigured S3 permissions have caused major data breaches. Always use bucket policies and block public access by default.</li><li><b>Lambda cold starts:</b> First invocation after idle period takes 100ms-several seconds. Use provisioned concurrency for latency-sensitive functions.</li><li><b>Missing IAM roles:</b> Use IAM roles for EC2/Lambda instead of embedding access keys. Keys in code are a security risk.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: EC2 vs Lambda?</b><br>A: EC2 gives you a full server with control over OS and runtime — pay per second (Linux) with a 60-second minimum. Lambda runs functions on demand — pay per invocation. Lambda for short, event-driven tasks. EC2 for long-running, stateful workloads.</p><p class="learn-p"><b>Q2: S3 storage classes?</b><br>A: Standard (frequent access), IA (infrequent, lower cost), Glacier (archive, minutes-hours retrieval), Deep Archive (cheapest, 12-hour retrieval). Choose based on access patterns.</p></div>',
          code: `// ==========================================
// AWS Services Integration for MERN Stack
// ==========================================

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const multer = require('multer');
const express = require('express');
const router = express.Router();

// --- AWS Clients ---
const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const secretsManager = new SecretsManagerClient({ region: 'us-east-1' });
const BUCKET_NAME = process.env.S3_BUCKET || 'my-mern-uploads';

// --- S3 File Upload Service ---
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'), false);
  }
});

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const key = \`uploads/\${Date.now()}-\${req.file.originalname}\`;
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      Metadata: { uploadedBy: req.user?.id || 'anonymous' }
    }));
    res.json({ success: true, key, url: \`https://\${BUCKET_NAME}.s3.amazonaws.com/\${key}\` });
  } catch (err) {
    console.error('S3 upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Generate pre-signed URL for secure, temporary access
router.get('/file/:key', async (req, res) => {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: req.params.key });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate URL' });
  }
});

// Delete file from S3
router.delete('/file/:key', async (req, res) => {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: req.params.key }));
  res.json({ success: true });
});

// --- Secrets Manager: Retrieve Database Credentials ---
async function getDbCredentials() {
  const response = await secretsManager.send(
    new GetSecretValueCommand({ SecretId: 'mern-app/db-credentials' })
  );
  return JSON.parse(response.SecretString);
  // Returns: { username, password, host, port, dbname }
}

// --- Lambda Handler Example (serverless API) ---
// Deploy this as a Lambda function behind API Gateway
const lambdaHandler = async (event) => {
  const { httpMethod, path, body, queryStringParameters } = event;
  try {
    if (httpMethod === 'GET' && path === '/api/users') {
      // Connect to MongoDB Atlas (connection reuse across warm invocations)
      const users = [{ id: 1, name: 'Demo User' }]; // placeholder
      return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(users) };
    }
    return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// --- EC2 Deployment Script (User Data / startup) ---
const EC2_USER_DATA = \`#!/bin/bash
# This runs when the EC2 instance first launches
yum update -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs git
npm install -g pm2

# Clone application
cd /home/ec2-user
git clone https://github.com/user/mern-api.git app
cd app && npm ci --only=production

# Start with PM2 (cluster mode for multi-core)
pm2 start server.js -i max --name "api"
pm2 startup
pm2 save

# Setup log rotation
pm2 install pm2-logrotate
\`;

module.exports = { router, getDbCredentials, lambdaHandler };`,
          problems: [
            ['LRU Cache', 'https://leetcode.com/problems/lru-cache/', 'Medium'],
            ['AWS Cloud Practitioner Quiz', 'https://www.geeksforgeeks.org/aws-tutorial/', 'Easy']
          ],
          mcqs: [
            {
              q: 'What is the AWS Shared Responsibility Model?',
              o: [
                'AWS and the customer share the same login credentials',
                'AWS manages security OF the cloud infrastructure; the customer manages security IN the cloud (data, access, apps)',
                'All security responsibilities belong to AWS',
                'Customers are responsible for physical data center security'
              ],
              a: 1
            },
            {
              q: 'Which AWS service is best suited for hosting a React SPA (static website)?',
              o: [
                'EC2 with Apache',
                'Lambda with API Gateway',
                'S3 with CloudFront',
                'ECS with Fargate'
              ],
              a: 2
            },
            {
              q: 'What is a "cold start" in AWS Lambda?',
              o: [
                'When the Lambda function crashes',
                'The initial latency when a function is invoked after being idle, as AWS provisions a new execution environment',
                'When the function runs out of memory',
                'When the AWS region goes down'
              ],
              a: 1
            }
          ]
        },
        {
          t: 'Serverless Architecture',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Serverless computing eliminates server management and scales automatically. Understanding event-driven architecture, cold starts, and when serverless is appropriate (and when it is not) is essential for modern cloud design. Interviewers evaluate architectural thinking — not every problem benefits from serverless.</p></div><div class="learn-section"><div class="learn-h">What is Serverless?</div><p class="learn-p">Serverless architecture is a cloud computing model where the cloud provider dynamically manages the allocation and provisioning of servers. Despite the name, servers still exist -- you just don\'t manage them. You write functions that run in response to events, and the provider handles scaling, patching, and availability. You pay only for the actual compute time used, not for idle servers.</p><p class="learn-p">Serverless is not just "Functions as a Service" (FaaS). It encompasses a broader ecosystem of managed services: serverless databases (DynamoDB, Aurora Serverless), serverless storage (S3), serverless messaging (SQS, EventBridge), serverless API management (API Gateway), and more. The philosophy is: let the cloud provider manage infrastructure so you can focus on business logic.</p><p class="learn-p">Benefits of serverless: zero server management, automatic scaling (from zero to thousands of concurrent executions), pay-per-use pricing (no cost when idle), built-in high availability, and faster time to market. Drawbacks include: cold starts, vendor lock-in, limited execution duration, debugging complexity, and potential cost unpredictability at high scale.</p></div><div class="learn-section"><div class="learn-h">Serverless Frameworks</div><p class="learn-p">The <strong>Serverless Framework</strong> is an open-source tool that simplifies deploying serverless applications. It provides a <code>serverless.yml</code> configuration file that defines your functions, events (triggers), and resources. It supports AWS, Azure, GCP, and other providers. Alternatives include AWS SAM (Serverless Application Model), AWS CDK, and SST (the modern choice for full-stack serverless).</p><div class="learn-code"># serverless.yml - Serverless Framework config\nservice: mern-api\nprovider:\n  name: aws\n  runtime: nodejs18.x\n  region: us-east-1\n  stage: ${opt:stage, \'dev\'}\n  environment:\n    MONGO_URI: ${ssm:/mern-app/mongo-uri}\n    JWT_SECRET: ${ssm:/mern-app/jwt-secret}\n  iam:\n    role:\n      statements:\n        - Effect: Allow\n          Action:\n            - s3:PutObject\n            - s3:GetObject\n          Resource: "arn:aws:s3:::my-uploads/*"\n\nfunctions:\n  getUsers:\n    handler: handlers/users.getAll\n    events:\n      - httpApi:\n          path: /api/users\n          method: get\n  createUser:\n    handler: handlers/users.create\n    events:\n      - httpApi:\n          path: /api/users\n          method: post\n  processImage:\n    handler: handlers/images.process\n    events:\n      - s3:\n          bucket: my-uploads\n          event: s3:ObjectCreated:*\n          rules:\n            - suffix: .jpg</div><p class="learn-p">SST (formerly Serverless Stack) is a modern framework built on AWS CDK that provides a superior developer experience: live Lambda debugging, instant deployments during development, TypeScript-first configuration, and constructs for common patterns (API, Auth, Cron, Queue, etc.).</p></div><div class="learn-section"><div class="learn-h">Serverless API Patterns</div><p class="learn-p">When building a serverless MERN API, there are two main approaches:</p><ul class="learn-list"><li><strong>Individual Functions:</strong> Each API endpoint is a separate Lambda function (e.g., getUsers, createUser, deleteUser). This gives fine-grained scaling and permissions but creates more deployment overhead.</li><li><strong>Monolithic Lambda:</strong> A single Lambda function handles all routes using Express.js or Fastify, with a library like <code>serverless-http</code> adapting the framework to Lambda. Simpler to develop and deploy, but scales as a unit.</li></ul><div class="learn-code">// Approach 1: Individual function handlers\n// handlers/users.js\nconst { connectDb, User } = require(\'../db\');\n\nmodule.exports.getAll = async (event) =&gt; {\n  await connectDb();\n  const users = await User.find().lean();\n  return { statusCode: 200, body: JSON.stringify(users) };\n};\n\nmodule.exports.create = async (event) =&gt; {\n  await connectDb();\n  const data = JSON.parse(event.body);\n  const user = await User.create(data);\n  return { statusCode: 201, body: JSON.stringify(user) };\n};\n\n// Approach 2: Express wrapped in Lambda\nconst serverless = require(\'serverless-http\');\nconst express = require(\'express\');\nconst app = express();\napp.use(express.json());\napp.get(\'/api/users\', async (req, res) =&gt; { /* ... */ });\napp.post(\'/api/users\', async (req, res) =&gt; { /* ... */ });\nmodule.exports.handler = serverless(app);</div><div class="learn-tip">When using MongoDB with Lambda, cache the database connection outside the handler function. Lambda reuses execution environments (warm starts), so a cached connection avoids reconnecting on every invocation. Use a connection pool size of 1 to avoid exhausting MongoDB connections.</div></div><div class="learn-section"><div class="learn-h">Event-Driven Architectures</div><p class="learn-p">Serverless naturally fits event-driven architectures where services communicate through events rather than direct API calls. This creates loose coupling, better scalability, and fault tolerance.</p><p class="learn-p">Common serverless event patterns for MERN applications:</p><table class="learn-table"><tr><th>Pattern</th><th>AWS Services</th><th>Use Case</th></tr><tr><td>API Request</td><td>API Gateway + Lambda</td><td>REST/GraphQL API endpoints</td></tr><tr><td>File Processing</td><td>S3 Event + Lambda</td><td>Image resizing on upload, CSV parsing</td></tr><tr><td>Background Jobs</td><td>SQS + Lambda</td><td>Email sending, report generation</td></tr><tr><td>Scheduled Tasks</td><td>EventBridge + Lambda</td><td>Cleanup jobs, daily reports, reminders</td></tr><tr><td>Real-time Streams</td><td>DynamoDB Streams + Lambda</td><td>Data sync, notifications on data changes</td></tr><tr><td>Fan-out</td><td>SNS + multiple Lambdas</td><td>One event triggers multiple downstream actions</td></tr></table><div class="learn-code">// SQS Consumer: Process background email jobs\nexports.handler = async (event) =&gt; {\n  for (const record of event.Records) {\n    const { to, subject, body } = JSON.parse(record.body);\n    await sendEmail(to, subject, body);\n    console.log(\'Email sent to:\', to);\n  }\n  // Failed messages automatically go to Dead Letter Queue (DLQ)\n};\n\n// EventBridge Scheduled Task: Daily cleanup\nexports.cleanup = async () =&gt; {\n  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);\n  await Session.deleteMany({ lastAccessed: { $lt: thirtyDaysAgo } });\n  console.log(\'Stale sessions cleaned up\');\n};</div></div><div class="learn-section"><div class="learn-h">Serverless Best Practices</div><ul class="learn-list"><li><strong>Minimize cold starts:</strong> Keep deployment packages small, avoid heavy frameworks, use Provisioned Concurrency for latency-sensitive functions, and choose arm64 architecture (Graviton) for better price-performance.</li><li><strong>Manage database connections:</strong> Cache connections outside the handler, use connection pooling (size 1 for Lambda), and consider using RDS Proxy or MongoDB Atlas serverless for connection management.</li><li><strong>Handle errors and retries:</strong> Lambda automatically retries async invocations. Use Dead Letter Queues (DLQ) for failed messages. Implement idempotency to handle duplicate invocations safely.</li><li><strong>Security:</strong> Follow least-privilege IAM policies. Use environment variables (encrypted with KMS) for secrets. Validate and sanitize all input. Use VPC only when necessary (adds cold start latency).</li><li><strong>Observability:</strong> Use AWS CloudWatch for logs and metrics, X-Ray for distributed tracing, and structured JSON logging for easy searching.</li></ul><div class="learn-warn">Be aware of Lambda concurrency limits (default 1000 per region). A traffic spike can cause throttling if you hit this limit. Request a limit increase for production workloads, and use reserved concurrency to guarantee capacity for critical functions.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Vendor lock-in:</b> Serverless functions are tightly coupled to cloud provider APIs. Abstracting business logic helps portability.</li><li><b>Cold starts:</b> First invocation latency can be 100ms to several seconds depending on runtime and package size. Keep functions small and use provisioned concurrency for critical paths.</li><li><b>Execution limits:</b> Lambda has a 15-minute timeout, 10GB memory limit, and 6MB response size. Not suitable for long-running or large-payload workloads.</li><li><b>Debugging complexity:</b> Distributed serverless functions are harder to debug than monoliths. Invest in structured logging and distributed tracing.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: When NOT to use serverless?</b><br>A: Long-running tasks (>15 min), WebSocket connections, workloads with predictable high traffic (cheaper on EC2), and when you need fine-grained OS control.</p><p class="learn-p"><b>Q2: What is the serverless pricing model?</b><br>A: Pay per request + compute time (GB-seconds). Zero cost at zero traffic. Extremely cost-effective for sporadic workloads but can be expensive at high constant load vs reserved EC2.</p></div>',
          code: `// ==========================================
// Serverless MERN API with AWS Lambda
// ==========================================

// --- Database Connection (cached across warm starts) ---
const mongoose = require('mongoose');

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 1,           // Lambda: keep pool small
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  });
  cachedConnection = conn.connection;
  return cachedConnection;
}

// --- User Model ---
const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role:  { type: String, default: 'user' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- Helper: Build Lambda Response ---
function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
}

// --- Lambda Handlers ---

// GET /api/users
module.exports.getUsers = async (event) => {
  try {
    await connectToDatabase();
    const { limit = 20, page = 1 } = event.queryStringParameters || {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find()
      .skip(skip).limit(parseInt(limit)).lean();
    const total = await User.countDocuments();
    return response(200, { users, total, page: parseInt(page) });
  } catch (err) {
    console.error('getUsers error:', err);
    return response(500, { error: 'Failed to fetch users' });
  }
};

// POST /api/users
module.exports.createUser = async (event) => {
  try {
    await connectToDatabase();
    const data = JSON.parse(event.body);
    const user = await User.create(data);
    return response(201, user);
  } catch (err) {
    if (err.code === 11000) {
      return response(409, { error: 'Email already exists' });
    }
    return response(500, { error: 'Failed to create user' });
  }
};

// GET /api/users/:id
module.exports.getUser = async (event) => {
  try {
    await connectToDatabase();
    const user = await User.findById(event.pathParameters.id).lean();
    if (!user) return response(404, { error: 'User not found' });
    return response(200, user);
  } catch (err) {
    return response(500, { error: 'Failed to fetch user' });
  }
};

// --- S3 Trigger: Process uploaded image ---
module.exports.processUpload = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key);
    console.log(\`Processing: \${key} from \${bucket}\`);
    // Resize, generate thumbnail, update database, etc.
  }
  return { statusCode: 200, body: 'Processed' };
};

// --- SQS Trigger: Send emails in background ---
module.exports.sendEmails = async (event) => {
  const failures = [];
  for (const record of event.Records) {
    try {
      const { to, subject, html } = JSON.parse(record.body);
      // await ses.send(new SendEmailCommand({ ... }));
      console.log(\`Email sent to \${to}\`);
    } catch (err) {
      console.error('Email failed:', err);
      failures.push({ itemIdentifier: record.messageId });
    }
  }
  // Partial batch failure reporting
  return { batchItemFailures: failures };
};

// --- Scheduled: Daily cleanup (EventBridge cron) ---
module.exports.dailyCleanup = async () => {
  await connectToDatabase();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await User.deleteMany({
    isVerified: false, createdAt: { $lt: cutoff }
  });
  console.log(\`Cleaned up \${result.deletedCount} unverified accounts\`);
};`,
          problems: [
            ['Design a URL Shortener (System Design)', 'https://leetcode.com/discuss/interview-question/124658/Design-a-URL-Shortener-(-TinyURL-)-System/', 'Medium'],
            ['Throttle Function Calls', 'https://leetcode.com/problems/throttle/', 'Medium']
          ],
          mcqs: [
            {
              q: 'Why should MongoDB connections be cached outside the Lambda handler function?',
              o: [
                'Lambda does not support database connections inside handlers',
                'To leverage warm starts and avoid creating a new connection on every invocation',
                'Cached connections are faster because they bypass DNS resolution',
                'MongoDB requires persistent connections that never close'
              ],
              a: 1
            },
            {
              q: 'What is the primary advantage of serverless architecture over traditional server-based architecture?',
              o: [
                'Serverless functions run faster than server-based code',
                'You only pay for actual compute time used, and scaling is automatic with zero server management',
                'Serverless has no execution time limits',
                'Serverless eliminates the need for a database'
              ],
              a: 1
            },
            {
              q: 'What is a Dead Letter Queue (DLQ) used for in serverless architectures?',
              o: [
                'To store deleted database records',
                'To capture messages or events that failed processing after all retries are exhausted',
                'To queue emails for delivery',
                'To log HTTP 404 errors'
              ],
              a: 1
            }
          ]
        },
        {
          t: 'Nginx, Load Balancing & Reverse Proxy',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When a SaaS product grows from 100 to 100,000 users, a single Node.js process cannot handle the load. Nginx sits in front of your application servers as a reverse proxy, load balancer, and static file server — handling SSL termination, request routing, and connection pooling. It powers over 30% of all web servers worldwide. Understanding Nginx configuration is essential for deploying production MERN applications and is commonly tested in DevOps and full-stack interviews.</p></div><div class="learn-section"><div class="learn-h">What is Nginx?</div><p class="learn-p">Nginx (pronounced "engine-x") is a high-performance HTTP server, reverse proxy, and load balancer. Created by Igor Sysoev in 2004, it is known for its stability, rich feature set, simple configuration, and low resource consumption. Nginx uses an asynchronous, event-driven architecture that handles thousands of concurrent connections efficiently, unlike Apache\'s process-per-connection model.</p><p class="learn-p">In a MERN stack deployment, Nginx typically serves as the entry point for all traffic. It handles: serving the React static files, proxying API requests to the Node.js backend, SSL/TLS termination (HTTPS), load balancing across multiple Node.js instances, gzip compression, rate limiting, and caching. This architecture offloads work from your Node.js server and provides a robust, battle-tested front door for your application.</p><div class="learn-code"># Typical MERN deployment architecture:\n#\n# Client Browser\n#      |\n#    Nginx (port 80/443)\n#      |\n#      |-- /            --&gt; React static files (served directly by Nginx)\n#      |-- /api/*       --&gt; Proxy to Node.js (port 5000)\n#      |-- /socket.io/* --&gt; Proxy to Node.js (WebSocket upgrade)</div></div><div class="learn-section"><div class="learn-h">Reverse Proxy Configuration</div><p class="learn-p">A <strong>reverse proxy</strong> sits in front of backend servers and forwards client requests to them. Clients communicate only with the proxy, not directly with the backend. Benefits include: hiding backend infrastructure, SSL termination, caching, compression, and serving as a single entry point for multiple services.</p><div class="learn-code"># /etc/nginx/sites-available/mern-app\nserver {\n    listen 80;\n    server_name myapp.com www.myapp.com;\n\n    # Serve React build files\n    root /var/www/mern-app/client/build;\n    index index.html;\n\n    # React SPA: serve index.html for all non-file routes\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n\n    # Proxy API requests to Node.js backend\n    location /api/ {\n        proxy_pass http://localhost:5000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection \'upgrade\';\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_cache_bypass $http_upgrade;\n    }\n\n    # WebSocket support for Socket.io\n    location /socket.io/ {\n        proxy_pass http://localhost:5000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n    }\n}</div><p class="learn-p">Key proxy headers explained: <code>X-Real-IP</code> passes the client\'s real IP address (otherwise Node.js sees Nginx\'s IP). <code>X-Forwarded-For</code> maintains a chain of proxy IPs. <code>X-Forwarded-Proto</code> tells the backend whether the original request was HTTP or HTTPS. The <code>Upgrade</code> and <code>Connection</code> headers are essential for WebSocket support.</p><div class="learn-tip">Always use <code>try_files $uri $uri/ /index.html</code> for React SPAs. Without it, direct navigation to routes like <code>/dashboard</code> would return a 404 because Nginx looks for a physical file at that path. This directive falls back to index.html, letting React Router handle client-side routing.</div></div><div class="learn-section"><div class="learn-h">SSL/TLS with Let\'s Encrypt</div><p class="learn-p">HTTPS is mandatory for production applications. It encrypts data in transit, prevents man-in-the-middle attacks, and is required by modern browsers for features like service workers, geolocation, and HTTP/2. Let\'s Encrypt provides free SSL/TLS certificates, and Certbot automates the process of obtaining and renewing them.</p><div class="learn-code"># Install Certbot and obtain SSL certificate\nsudo apt install certbot python3-certbot-nginx\nsudo certbot --nginx -d myapp.com -d www.myapp.com\n\n# Certbot automatically modifies Nginx config to:\nserver {\n    listen 443 ssl http2;\n    server_name myapp.com;\n\n    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers HIGH:!aNULL:!MD5;\n\n    # ... rest of config\n}\n\n# Redirect HTTP to HTTPS\nserver {\n    listen 80;\n    server_name myapp.com www.myapp.com;\n    return 301 https://$host$request_uri;\n}\n\n# Auto-renewal (cron job added by Certbot)\n# 0 0,12 * * * certbot renew --quiet</div></div><div class="learn-section"><div class="learn-h">Load Balancing</div><p class="learn-p">Load balancing distributes incoming traffic across multiple backend servers to ensure no single server is overwhelmed. This improves availability, reliability, and scalability. Nginx supports several load balancing algorithms.</p><table class="learn-table"><tr><th>Algorithm</th><th>Directive</th><th>Behavior</th></tr><tr><td>Round Robin</td><td>(default)</td><td>Distributes requests evenly in order</td></tr><tr><td>Least Connections</td><td>least_conn</td><td>Sends to server with fewest active connections</td></tr><tr><td>IP Hash</td><td>ip_hash</td><td>Same client IP always goes to same server (sticky sessions)</td></tr><tr><td>Weighted</td><td>weight=N</td><td>Higher-weighted servers get more requests</td></tr><tr><td>Random</td><td>random</td><td>Random server selection</td></tr></table><div class="learn-code"># Load balancing across multiple Node.js instances\nupstream node_backend {\n    least_conn;                         # Least connections algorithm\n    server 127.0.0.1:5000 weight=3;    # Higher capacity server\n    server 127.0.0.1:5001 weight=2;\n    server 127.0.0.1:5002 weight=1;\n    server 127.0.0.1:5003 backup;      # Only used if others are down\n\n    keepalive 64;                       # Connection pooling\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name myapp.com;\n\n    location /api/ {\n        proxy_pass http://node_backend;\n        proxy_http_version 1.1;\n        proxy_set_header Connection "";\n        # ... other proxy headers\n    }\n}</div><p class="learn-p">For a MERN app on a single server, you can run multiple Node.js instances using PM2\'s cluster mode and load balance across them with Nginx. For multi-server deployments, Nginx load balances across different EC2 instances. AWS also offers managed load balancers (ALB, NLB) that integrate with Auto Scaling.</p></div><div class="learn-section"><div class="learn-h">Performance Optimization</div><p class="learn-p">Nginx excels at performance optimization through caching, compression, and connection handling. These features reduce bandwidth, decrease load times, and lower the burden on your Node.js server.</p><div class="learn-code"># Performance optimizations\nhttp {\n    # Gzip compression\n    gzip on;\n    gzip_vary on;\n    gzip_min_length 1024;\n    gzip_types text/plain text/css application/json application/javascript\n               text/xml application/xml image/svg+xml;\n\n    # Static file caching\n    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {\n        expires 30d;\n        add_header Cache-Control "public, immutable";\n        access_log off;\n    }\n\n    # Rate limiting\n    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n    location /api/ {\n        limit_req zone=api burst=20 nodelay;\n        proxy_pass http://node_backend;\n    }\n\n    # Security headers\n    add_header X-Frame-Options "SAMEORIGIN";\n    add_header X-Content-Type-Options "nosniff";\n    add_header X-XSS-Protection "1; mode=block";\n    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";\n    add_header Content-Security-Policy "default-src \'self\'";\n\n    # Connection tuning\n    worker_connections 4096;\n    keepalive_timeout 65;\n    client_max_body_size 10M;\n}</div><p class="learn-p"><strong>Rate limiting</strong> protects your API from abuse and DDoS attacks. The <code>limit_req_zone</code> directive defines a shared memory zone that tracks request rates per client IP. The <code>burst</code> parameter allows short bursts above the rate, and <code>nodelay</code> processes burst requests immediately rather than queuing them.</p><div class="learn-warn">Be careful with <code>client_max_body_size</code>. The default is 1MB, which will cause 413 errors for file uploads. Set it appropriately for your application\'s needs (e.g., 10M for image uploads, 100M for video uploads).</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Forgetting to reload after config changes:</b> Use <code>nginx -t</code> to test syntax, then <code>nginx -s reload</code> for zero-downtime config updates — don\'t restart the process</li><li><b>Proxy header misconfiguration:</b> Without <code>proxy_set_header Host $host</code> and <code>X-Real-IP</code>, the backend sees Nginx\'s IP instead of the client\'s, breaking rate limiting and logging</li><li><b>WebSocket proxy without upgrade headers:</b> WebSocket connections fail silently without <code>proxy_http_version 1.1</code> and <code>Upgrade</code> headers</li><li><b>Buffer size too small:</b> Large request bodies (file uploads) fail with 413 errors — set <code>client_max_body_size</code> appropriately</li><li><b>SSL certificate renewal:</b> Let\'s Encrypt certificates expire every 90 days — automate renewal with certbot cron jobs</li><li><b>Upstream health checks:</b> Without health checks, Nginx continues routing to failed backends — use <code>max_fails</code> and <code>fail_timeout</code> directives</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><p class="learn-p">Choosing between web servers and load balancing strategies depends on your application\'s scale, protocol needs, and operational requirements.</p><table class="learn-table"><tr><th>Feature</th><th>Nginx</th><th>Apache</th></tr><tr><td>Architecture</td><td>Event-driven, async, non-blocking</td><td>Process/thread per connection</td></tr><tr><td>Static files</td><td>Excellent — built for this</td><td>Good with mod_rewrite</td></tr><tr><td>Memory usage</td><td>Very low — handles 10K+ concurrent connections</td><td>Higher — each connection uses a thread</td></tr><tr><td>Configuration</td><td>Declarative blocks</td><td>.htaccess + httpd.conf</td></tr><tr><td>Best for</td><td>Reverse proxy, high concurrency</td><td>Shared hosting, .htaccess flexibility</td></tr></table><table class="learn-table"><tr><th>Feature</th><th>L4 (Transport)</th><th>L7 (Application)</th></tr><tr><td>Operates on</td><td>TCP/UDP packets</td><td>HTTP requests</td></tr><tr><td>Routing decisions</td><td>IP address and port</td><td>URL path, headers, cookies</td></tr><tr><td>SSL termination</td><td>Pass-through or terminate</td><td>Terminate and inspect content</td></tr><tr><td>Speed</td><td>Faster — less inspection</td><td>Slower — full request parsing</td></tr><tr><td>Use case</td><td>Database proxying, non-HTTP</td><td>Web apps, API gateways, A/B testing</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between a forward proxy and a reverse proxy?</b><br>A: A forward proxy sits in front of clients and forwards their requests to the internet (used for anonymity, content filtering). A reverse proxy sits in front of servers and receives client requests on their behalf (used for load balancing, SSL termination, caching). Nginx is typically used as a reverse proxy.</p><p class="learn-p"><b>Q2: Explain the main load balancing algorithms Nginx supports.</b><br>A: Round Robin (default) — distributes requests equally. Least Connections — sends to the server with fewest active connections. IP Hash — routes based on client IP for session persistence. Weighted — assigns different weights to servers based on capacity.</p><p class="learn-p"><b>Q3: How does Nginx handle SSL/TLS termination?</b><br>A: Nginx decrypts incoming HTTPS requests at the proxy layer, then forwards plain HTTP to backend servers. This offloads CPU-intensive encryption from application servers, simplifies certificate management (one place), and allows Nginx to inspect and route based on request content.</p><p class="learn-p"><b>Q4: Why is Nginx preferred over Node.js for serving static files?</b><br>A: Nginx is designed for serving static content efficiently using sendfile() system call, kernel-level caching, and an event-driven architecture optimized for I/O. Node.js is single-threaded and its event loop is better suited for dynamic requests. Serving static files through Node.js wastes event loop cycles that could handle API requests.</p><p class="learn-p"><b>Q5: How do you achieve zero-downtime deployments with Nginx?</b><br>A: Use <code>nginx -s reload</code> which gracefully starts new worker processes with the new config while existing workers finish serving current requests. Combined with upstream health checks and rolling deployments of backend servers, this ensures no dropped connections during deployment.</p></div>',
          code: `# ==========================================
# Nginx Configuration for MERN Stack
# /etc/nginx/sites-available/mern-app
# ==========================================

# --- Upstream: Load balance across Node.js instances ---
upstream node_api {
    least_conn;
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
    keepalive 64;
}

# --- Redirect HTTP to HTTPS ---
server {
    listen 80;
    listen [::]:80;
    server_name myapp.com www.myapp.com;
    return 301 https://$host$request_uri;
}

# --- Main HTTPS Server ---
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name myapp.com www.myapp.com;

    # --- SSL Configuration (Let's Encrypt) ---
    ssl_certificate     /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    # --- Security Headers ---
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # --- Gzip Compression ---
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types
        text/plain text/css application/json
        application/javascript text/xml application/xml
        application/xml+rss text/javascript
        image/svg+xml;

    # --- File upload size limit ---
    client_max_body_size 10M;

    # --- Serve React Frontend (static files) ---
    root /var/www/mern-app/client/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # --- Rate Limiting ---
    # Define zone: 10MB shared memory, 10 requests/second per IP
    # (defined in http block: limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;)

    # --- Proxy API Requests to Node.js ---
    location /api/ {
        # Rate limit: allow burst of 20, process immediately
        # limit_req zone=api burst=20 nodelay;

        proxy_pass http://node_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }

    # --- WebSocket Support (Socket.io) ---
    location /socket.io/ {
        proxy_pass http://node_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400s;  # Keep WebSocket alive for 24h
    }

    # --- Health Check (for load balancer) ---
    location /health {
        proxy_pass http://node_api;
        access_log off;
    }

    # --- Block common attack paths ---
    location ~ /\\. { deny all; access_log off; log_not_found off; }
    location ~ \\.(env|git|htaccess)$ { deny all; }

    # --- Custom Error Pages ---
    error_page 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
        internal;
    }

    # --- Logging ---
    access_log /var/log/nginx/mern-app.access.log;
    error_log  /var/log/nginx/mern-app.error.log warn;
}`,
          problems: [
            ['Design a Rate Limiter', 'https://leetcode.com/discuss/interview-question/system-design/124657/Design-a-Rate-Limiter', 'Hard'],
            ['Load Balancing Concepts', 'https://www.geeksforgeeks.org/load-balancing-algorithms/', 'Medium']
          ],
          mcqs: [
            {
              q: 'Why is the "try_files $uri $uri/ /index.html" directive essential for React SPA deployments?',
              o: [
                'It improves page load speed by compressing files',
                'It enables hot module replacement in production',
                'It ensures client-side routes like /dashboard fall back to index.html instead of returning 404',
                'It enables server-side rendering for React components'
              ],
              a: 2
            },
            {
              q: 'Which Nginx load balancing algorithm ensures the same client always reaches the same backend server?',
              o: ['round_robin', 'least_conn', 'ip_hash', 'weighted'],
              a: 2
            },
            {
              q: 'What is the purpose of the X-Forwarded-For header when Nginx acts as a reverse proxy?',
              o: [
                'It encrypts the request payload',
                'It preserves the original client IP address so the backend knows who made the request',
                'It forwards authentication cookies to the backend',
                'It tells Nginx which backend server to use'
              ],
              a: 1
            },
            {q: 'What is the default load balancing algorithm in Nginx?', o: ['Least connections', 'Round robin', 'IP hash', 'Random'], a: 1},
            {q: 'Which directive sets the maximum allowed size of the client request body?', o: ['max_body_size', 'client_max_body_size', 'upload_max_size', 'request_body_limit'], a: 1},
            {q: 'What command tests Nginx configuration syntax without restarting?', o: ['nginx -s test', 'nginx -t', 'nginx --verify', 'nginx -c check'], a: 1},
            {q: 'What is SSL termination?', o: ['Closing SSL connections forcefully', 'Decrypting HTTPS at the proxy and forwarding HTTP to backends', 'Generating SSL certificates', 'Disabling SSL for development'], a: 1},
            {q: 'Which Nginx directive is required for WebSocket proxy support?', o: ['proxy_websocket on', 'proxy_http_version 1.1 with Upgrade headers', 'websocket_proxy enable', 'proxy_protocol ws'], a: 1}
          ]
        }
      ]
    }
  ]
};
const GENAI_CONTENT = {
  id: 'genai', t: 'GenAI / ML / DL',
  tabs: [
    {
      id: 'mlf', t: 'ML Foundations',
      topics: [
        {
          t: 'Bias-Variance Tradeoff & Model Evaluation',
          learn: '<div class="learn-section"><div class="learn-h">Understanding Bias and Variance</div><div class="learn-p">In machine learning, <b>bias</b> refers to the error introduced by approximating a complex real-world problem with a simplified model. A high-bias model makes strong assumptions about the data and tends to <b>underfit</b> -- it misses relevant relationships between features and outputs. <b>Variance</b> refers to the model\'s sensitivity to fluctuations in the training data. A high-variance model captures noise along with the signal and tends to <b>overfit</b> -- it performs well on training data but poorly on unseen data.</div><div class="learn-p">The <b>bias-variance tradeoff</b> states that as you decrease bias (make the model more complex), variance tends to increase, and vice versa. The goal is to find the sweet spot that minimizes <b>total error = Bias&sup2; + Variance + Irreducible Error</b>.</div><div class="learn-table"><table><tr><th>Property</th><th>High Bias</th><th>High Variance</th></tr><tr><td>Model Complexity</td><td>Too simple</td><td>Too complex</td></tr><tr><td>Training Error</td><td>High</td><td>Low</td></tr><tr><td>Test Error</td><td>High</td><td>High</td></tr><tr><td>Symptom</td><td>Underfitting</td><td>Overfitting</td></tr><tr><td>Example</td><td>Linear Regression on non-linear data</td><td>Deep decision tree on small dataset</td></tr></table></div></div><div class="learn-section"><div class="learn-h">Cross-Validation Techniques</div><div class="learn-p"><b>K-Fold Cross-Validation</b> splits the dataset into K equal folds. The model is trained K times, each time using K-1 folds for training and 1 fold for validation. The final metric is the average across all K runs. This gives a more reliable estimate of model performance than a single train-test split.</div><div class="learn-code">// K-Fold Cross-Validation Process\n// For K=5:\n// Iteration 1: Train on folds [2,3,4,5], Validate on fold [1]\n// Iteration 2: Train on folds [1,3,4,5], Validate on fold [2]\n// ...\n// Iteration 5: Train on folds [1,2,3,4], Validate on fold [5]\n// Final Score = mean of all 5 validation scores</div><div class="learn-p"><b>Stratified K-Fold</b> ensures each fold preserves the class distribution of the original dataset -- critical for imbalanced datasets. <b>Leave-One-Out CV (LOOCV)</b> uses K = N (number of samples), giving a nearly unbiased estimate but at high computational cost. <b>Time-Series CV</b> uses an expanding or sliding window to respect temporal ordering.</div><div class="learn-tip">Use Stratified K-Fold for classification tasks and regular K-Fold for regression. K=5 or K=10 are standard choices.</div></div><div class="learn-section"><div class="learn-h">Evaluation Metrics for Classification</div><div class="learn-p">Choosing the right metric depends on the problem context. <b>Accuracy</b> = (TP + TN) / (TP + TN + FP + FN) -- misleading for imbalanced classes. <b>Precision</b> = TP / (TP + FP) -- of all predicted positives, how many are actually positive. <b>Recall (Sensitivity)</b> = TP / (TP + FN) -- of all actual positives, how many did we catch.</div><div class="learn-p"><b>F1-Score</b> = 2 * (Precision * Recall) / (Precision + Recall) -- harmonic mean of precision and recall. The <b>ROC-AUC</b> curve plots True Positive Rate vs False Positive Rate at various thresholds. AUC = 1.0 means perfect classification; AUC = 0.5 means no discriminative power (random guessing).</div><div class="learn-table"><table><tr><th>Metric</th><th>When to Use</th></tr><tr><td>Accuracy</td><td>Balanced classes</td></tr><tr><td>Precision</td><td>Cost of FP is high (spam detection)</td></tr><tr><td>Recall</td><td>Cost of FN is high (cancer detection)</td></tr><tr><td>F1-Score</td><td>Imbalanced classes, need balance</td></tr><tr><td>ROC-AUC</td><td>Compare models across thresholds</td></tr></table></div><div class="learn-warn">Never rely solely on accuracy for imbalanced datasets. A model predicting the majority class always can achieve 95% accuracy on a 95/5 split but is useless.</div></div><div class="learn-section"><div class="learn-h">Evaluation Metrics for Regression</div><div class="learn-p"><b>Mean Squared Error (MSE)</b> = (1/n) * &Sigma;(y_i - y&#770;_i)&sup2; penalizes large errors heavily. <b>Root Mean Squared Error (RMSE)</b> = &radic;MSE is in the same units as the target. <b>Mean Absolute Error (MAE)</b> = (1/n) * &Sigma;|y_i - y&#770;_i| is more robust to outliers. <b>R&sup2; Score</b> = 1 - (SS_res / SS_tot) measures the proportion of variance explained; R&sup2; = 1 is perfect, R&sup2; = 0 means the model is as good as predicting the mean.</div><div class="learn-p"><b>Adjusted R&sup2;</b> accounts for the number of predictors, penalizing unnecessary features. It only increases if a new feature improves the model more than expected by chance.</div><div class="learn-tip">Use RMSE when large errors are particularly undesirable. Use MAE when you want robustness to outliers. Always report R&sup2; alongside error metrics for interpretability.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain the bias-variance tradeoff.</b><br>A: Bias is error from oversimplifying the model (underfitting). Variance is error from oversensitivity to training noise (overfitting). Total error = Bias² + Variance + Irreducible Error. Increasing model complexity reduces bias but increases variance. The goal is the sweet spot minimizing total error — validated using cross-validation on held-out data.</p><p class="learn-p"><b>Q2: When would you use precision vs recall as the primary metric?</b><br>A: Precision when false positives are costly (spam filter — don\'t send real emails to spam). Recall when false negatives are costly (cancer screening — don\'t miss a positive case). F1 balances both. For imbalanced datasets, use AUC-ROC or precision-recall curves rather than accuracy.</p><p class="learn-p"><b>Q3: How do you detect overfitting and what do you do about it?</b><br>A: Overfitting shows as a large gap between training and validation metrics. Solutions: more training data, regularization (L1/L2, dropout), simpler model, early stopping, cross-validation, data augmentation. Learning curves (plotting train/val error vs training size) help diagnose whether more data or a different model is needed.</p></div>',
          code: `# Bias-Variance Tradeoff & Model Evaluation in Python
import numpy as np
from sklearn.model_selection import (cross_val_score, KFold,
    StratifiedKFold, learning_curve)
from sklearn.metrics import (accuracy_score, precision_score,
    recall_score, f1_score, roc_auc_score, confusion_matrix,
    mean_squared_error, r2_score, classification_report)
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

# --- Demonstrating Bias-Variance with Polynomial Regression ---
np.random.seed(42)
X = np.sort(np.random.uniform(0, 1, 30)).reshape(-1, 1)
y = np.sin(2 * np.pi * X).ravel() + np.random.normal(0, 0.2, 30)

for degree in [1, 4, 15]:  # underfit, good, overfit
    model = make_pipeline(PolynomialFeatures(degree), Ridge(alpha=1e-3))
    scores = cross_val_score(model, X, y, cv=5,
                             scoring='neg_mean_squared_error')
    print(f"Degree {degree:2d}: Mean CV MSE = {-scores.mean():.4f}"
          f" (+/- {scores.std():.4f})")

# --- K-Fold Cross-Validation ---
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier

data = load_iris()
X_iris, y_iris = data.data, data.target
clf = RandomForestClassifier(n_estimators=100, random_state=42)

# Regular K-Fold
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(clf, X_iris, y_iris, cv=kf, scoring='accuracy')
print(f"KFold Accuracy: {scores.mean():.4f} +/- {scores.std():.4f}")

# Stratified K-Fold (preserves class balance)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(clf, X_iris, y_iris, cv=skf, scoring='accuracy')
print(f"Stratified Accuracy: {scores.mean():.4f} +/- {scores.std():.4f}")

# --- Classification Metrics ---
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X_c, y_c = make_classification(n_samples=1000, n_features=20,
    n_classes=2, weights=[0.9, 0.1], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X_c, y_c, test_size=0.3, stratify=y_c, random_state=42)

clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
y_proba = clf.predict_proba(X_test)[:, 1]

print("\\n--- Classification Report ---")
print(classification_report(y_test, y_pred))
print(f"ROC-AUC: {roc_auc_score(y_test, y_proba):.4f}")
print(f"Confusion Matrix:\\n{confusion_matrix(y_test, y_pred)}")

# --- Learning Curve (diagnose bias vs variance) ---
train_sizes, train_scores, val_scores = learning_curve(
    clf, X_c, y_c, cv=5,
    train_sizes=np.linspace(0.1, 1.0, 10),
    scoring='f1')
print(f"\\nLearning curve train F1: {train_scores.mean(axis=1)[-1]:.3f}")
print(f"Learning curve val   F1: {val_scores.mean(axis=1)[-1]:.3f}")`,
          problems: [
            ['Model Evaluation – Cross Validation', 'https://www.geeksforgeeks.org/cross-validation-machine-learning/', 'Easy'],
            ['Bias-Variance Tradeoff', 'https://www.geeksforgeeks.org/ml-bias-variance-trade-off/', 'Medium'],
            ['Titanic - Machine Learning from Disaster', 'https://www.kaggle.com/c/titanic', 'Medium'],
            ['ROC-AUC Explained', 'https://www.geeksforgeeks.org/auc-roc-curve/', 'Medium']
          ],
          mcqs: [
            {q: 'A model with high bias and low variance is most likely to:', o: ['Overfit the training data', 'Underfit the training data', 'Achieve zero training error', 'Have high variance in predictions'], a: 1},
            {q: 'In Stratified K-Fold cross-validation, what is preserved in each fold?', o: ['Feature scaling', 'Class distribution ratio', 'Number of features', 'Random seed'], a: 1},
            {q: 'For a cancer detection system where missing a positive case is critical, which metric should be prioritized?', o: ['Precision', 'Accuracy', 'Recall', 'Specificity'], a: 2}
          ]
        },
        {
          t: 'Feature Engineering & Data Preprocessing',
          learn: '<div class="learn-section"><div class="learn-h">Why Feature Engineering Matters</div><div class="learn-p">Feature engineering is the process of using domain knowledge to create, transform, or select features that make machine learning models more effective. It is often said that <b>data and features determine the ceiling of your model</b>, while algorithms and tuning merely approach that ceiling. Good feature engineering can turn a mediocre model into a top performer.</div><div class="learn-p">Key categories include: <b>Feature Creation</b> (deriving new columns from existing ones), <b>Feature Transformation</b> (scaling, encoding, mathematical transforms), <b>Feature Selection</b> (removing irrelevant or redundant features), and <b>Handling Missing Data</b>.</div></div><div class="learn-section"><div class="learn-h">Handling Missing Values</div><div class="learn-p">Missing data is nearly universal in real-world datasets. Strategies include:</div><div class="learn-list"><ul><li><b>Deletion:</b> Drop rows (listwise) or columns with missing values. Only viable when missingness is small and random (MCAR).</li><li><b>Mean/Median/Mode Imputation:</b> Replace missing values with the column\'s central tendency. Simple but distorts variance and correlations.</li><li><b>KNN Imputation:</b> Uses K nearest neighbors to estimate missing values based on similar samples. Handles non-linear relationships better.</li><li><b>Iterative Imputation (MICE):</b> Models each feature with missing values as a function of other features in a round-robin fashion. Most sophisticated approach.</li><li><b>Indicator Column:</b> Add a binary column flagging whether the value was missing. Preserves the information that data was absent.</li></ul></div><div class="learn-warn">Never impute the target variable. Also, fit the imputer on the training set only, then transform both train and test to avoid data leakage.</div></div><div class="learn-section"><div class="learn-h">Feature Scaling & Normalization</div><div class="learn-p">Many algorithms (SVMs, KNN, neural networks, gradient descent-based methods) are sensitive to feature scales. Common techniques:</div><div class="learn-table"><table><tr><th>Method</th><th>Formula</th><th>When to Use</th></tr><tr><td>StandardScaler (Z-score)</td><td>(x - &mu;) / &sigma;</td><td>Gaussian-distributed features; default choice</td></tr><tr><td>MinMaxScaler</td><td>(x - x_min) / (x_max - x_min)</td><td>Bounded features, neural networks</td></tr><tr><td>RobustScaler</td><td>(x - median) / IQR</td><td>Features with outliers</td></tr><tr><td>Log Transform</td><td>log(1 + x)</td><td>Right-skewed distributions</td></tr><tr><td>PowerTransformer</td><td>Box-Cox / Yeo-Johnson</td><td>Make features more Gaussian</td></tr></table></div><div class="learn-tip">Always fit the scaler on the training set only and use .transform() on both train and test sets. This prevents data leakage from the test distribution.</div></div><div class="learn-section"><div class="learn-h">Encoding Categorical Variables</div><div class="learn-p"><b>Label Encoding</b> maps each category to an integer (0, 1, 2, ...). Suitable for ordinal features (e.g., Low &lt; Medium &lt; High) but problematic for nominal features as it implies a false ordering.</div><div class="learn-p"><b>One-Hot Encoding</b> creates a binary column for each category. It is the standard for nominal features but can create very high-dimensional data for high-cardinality features. Use <code>drop=\'first\'</code> to avoid the dummy variable trap (multicollinearity).</div><div class="learn-p"><b>Target Encoding</b> replaces each category with the mean of the target variable for that category. Powerful but prone to overfitting -- use with cross-validation folds or smoothing. <b>Frequency Encoding</b> replaces categories with their frequency counts. <b>Binary Encoding</b> is a compromise between label and one-hot for high-cardinality features.</div><div class="learn-warn">One-hot encoding a feature with 10,000 categories creates 10,000 columns. Use target encoding or embeddings for high-cardinality features.</div></div><div class="learn-section"><div class="learn-h">Feature Selection Methods</div><div class="learn-p"><b>Filter Methods</b> use statistical tests (correlation, chi-squared, mutual information) to rank features independently of the model. Fast but ignore feature interactions.</div><div class="learn-p"><b>Wrapper Methods</b> (Forward Selection, Backward Elimination, Recursive Feature Elimination) evaluate subsets of features using the model itself. More accurate but computationally expensive.</div><div class="learn-p"><b>Embedded Methods</b> perform selection during model training. L1 (Lasso) regularization drives coefficients to zero, effectively selecting features. Tree-based models provide feature importance scores based on how much each feature reduces impurity.</div><div class="learn-code">// Feature Selection Summary:\n// Filter:   Correlation, Chi-squared, Mutual Information\n// Wrapper:  RFE, Forward/Backward selection\n// Embedded: Lasso (L1), Tree feature importance\n// \n// Dimensionality Reduction (unsupervised):\n// PCA, t-SNE, UMAP -- reduce features while preserving structure</div><div class="learn-tip">Start with filter methods for a quick overview, then use embedded methods (Lasso or tree importance) for a more principled selection. RFE is a good wrapper method when computational budget allows.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why do we scale features and which scaler should you choose?</b><br>A: Distance-based algorithms (KNN, SVM, K-Means) and gradient descent are sensitive to feature magnitudes. StandardScaler (zero mean, unit variance) for normally distributed features. MinMaxScaler (0-1) when bounds matter (neural networks). RobustScaler (median/IQR) when outliers are present.</p><p class="learn-p"><b>Q2: How do you handle missing data?</b><br>A: Options: drop rows/columns (if missingness is random and small), impute with mean/median/mode (simple), use model-based imputation (KNN, iterative), or let the algorithm handle it (XGBoost handles NaN natively). Always analyze whether data is MCAR, MAR, or MNAR — the mechanism matters for choosing the right approach.</p><p class="learn-p"><b>Q3: How do you encode categorical variables with high cardinality?</b><br>A: One-hot encoding works for low cardinality but explodes with many categories. For high cardinality: target encoding (replace category with mean of target), frequency encoding, or learned embeddings (neural networks). Always apply target encoding with cross-validation folds to avoid target leakage.</p></div>',
          code: `# Feature Engineering & Data Preprocessing in Python
import numpy as np
import pandas as pd
from sklearn.preprocessing import (StandardScaler, MinMaxScaler,
    RobustScaler, LabelEncoder, OneHotEncoder, PowerTransformer)
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.feature_selection import (SelectKBest, mutual_info_classif,
    RFE)
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

# --- Create sample dataset with mixed types and missing values ---
np.random.seed(42)
df = pd.DataFrame({
    'age': [25, 30, np.nan, 45, 35, 50, np.nan, 40, 28, 55],
    'salary': [50000, 60000, 75000, np.nan, 80000, 95000,
               70000, np.nan, 55000, 100000],
    'city': ['NYC', 'LA', 'NYC', 'SF', 'LA', 'SF',
             'NYC', 'LA', 'SF', 'NYC'],
    'edu': ['BS', 'MS', 'PhD', 'BS', 'MS', 'PhD',
            'BS', 'MS', 'BS', 'PhD'],
    'target': [0, 1, 1, 0, 1, 1, 0, 0, 1, 1]
})
print("Missing values:\\n", df.isnull().sum())

# --- Handling Missing Values ---
# Strategy 1: Simple imputation
num_imputer = SimpleImputer(strategy='median')
df[['age', 'salary']] = num_imputer.fit_transform(df[['age', 'salary']])

# Strategy 2: KNN Imputation (on numeric columns)
# knn_imp = KNNImputer(n_neighbors=3)
# df[['age','salary']] = knn_imp.fit_transform(df[['age','salary']])

# --- Encoding Categorical Variables ---
# One-Hot Encoding for nominal features (city)
df_encoded = pd.get_dummies(df, columns=['city'], drop_first=True)

# Ordinal Encoding for education
edu_map = {'BS': 0, 'MS': 1, 'PhD': 2}
df_encoded['edu'] = df_encoded['edu'].map(edu_map)
print("\\nEncoded DataFrame:\\n", df_encoded.head())

# --- Feature Scaling ---
scaler = StandardScaler()
num_cols = ['age', 'salary']
df_encoded[num_cols] = scaler.fit_transform(df_encoded[num_cols])
print("\\nScaled DataFrame:\\n", df_encoded.head())

# --- Full Preprocessing Pipeline (production-ready) ---
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=500, n_features=20,
    n_informative=10, n_redundant=5, random_state=42)

numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Feature Selection with Mutual Information
selector = SelectKBest(mutual_info_classif, k=10)
X_selected = selector.fit_transform(X, y)
selected_mask = selector.get_support()
print(f"\\nSelected features: {np.where(selected_mask)[0]}")
print(f"Scores: {selector.scores_[selected_mask].round(3)}")

# Recursive Feature Elimination
rfe = RFE(RandomForestClassifier(n_estimators=50, random_state=42),
          n_features_to_select=10)
rfe.fit(X, y)
print(f"RFE selected features: {np.where(rfe.support_)[0]}")

# --- Feature Creation Example ---
# Log transform for skewed features
skewed_feature = np.random.exponential(scale=2, size=100)
log_transformed = np.log1p(skewed_feature)  # log(1 + x)
print(f"\\nOriginal skew:    {pd.Series(skewed_feature).skew():.3f}")
print(f"Log-transform skew: {pd.Series(log_transformed).skew():.3f}")

# Power Transform (Yeo-Johnson handles negative values)
pt = PowerTransformer(method='yeo-johnson')
power_transformed = pt.fit_transform(skewed_feature.reshape(-1, 1))
print(f"Power-transform skew: "
      f"{pd.Series(power_transformed.ravel()).skew():.3f}")`,
          problems: [
            ['House Prices - Advanced Regression', 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques', 'Medium'],
            ['Handling Imbalanced Datasets', 'https://www.geeksforgeeks.org/ml-handling-imbalanced-data-with-smote-and-near-miss-algorithm-in-python/', 'Medium']
          ],
          mcqs: [
            {q: 'Which scaling method is most robust to outliers?', o: ['StandardScaler', 'MinMaxScaler', 'RobustScaler', 'MaxAbsScaler'], a: 2},
            {q: 'One-hot encoding a feature with N categories creates how many new columns (with drop_first=True)?', o: ['N', 'N - 1', 'N + 1', '2N'], a: 1},
            {q: 'What is data leakage in the context of preprocessing?', o: ['Losing data during transformation', 'Using test set statistics during training preprocessing', 'Removing too many features', 'Imputing missing values with mean'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'sup', t: 'Supervised Learning',
      topics: [
        {
          t: 'Linear & Logistic Regression',
          learn: '<div class="learn-section"><div class="learn-h">Linear Regression</div><div class="learn-p"><b>Linear Regression</b> models the relationship between a dependent variable y and one or more independent variables X by fitting a linear equation: <b>y = w&middot;X + b</b> (or y = &beta;&#8320; + &beta;&#8321;x&#8321; + ... + &beta;&#8345;x&#8345;). The model finds the weights (coefficients) that minimize the <b>sum of squared residuals</b> (Ordinary Least Squares, OLS).</div><div class="learn-p">The <b>Normal Equation</b> provides a closed-form solution: <b>w = (X&#7488;X)&#8315;&sup1;X&#7488;y</b>. This is efficient for small to medium datasets but has O(n&sup3;) complexity for matrix inversion. For large datasets, <b>Gradient Descent</b> is preferred -- iteratively updating weights in the direction of steepest descent of the loss function.</div><div class="learn-code">// Gradient Descent Update Rule:\n// w = w - &alpha; * (1/m) * X^T * (X*w - y)\n// b = b - &alpha; * (1/m) * sum(X*w - y)\n// where &alpha; = learning rate, m = number of samples</div><div class="learn-table"><table><tr><th>Assumption</th><th>Description</th><th>Check Method</th></tr><tr><td>Linearity</td><td>Linear relationship between X and y</td><td>Residual vs Fitted plot</td></tr><tr><td>Independence</td><td>Observations are independent</td><td>Durbin-Watson test</td></tr><tr><td>Homoscedasticity</td><td>Constant variance of residuals</td><td>Breusch-Pagan test</td></tr><tr><td>Normality</td><td>Residuals are normally distributed</td><td>Q-Q plot, Shapiro-Wilk</td></tr><tr><td>No Multicollinearity</td><td>Features are not highly correlated</td><td>VIF (Variance Inflation Factor)</td></tr></table></div></div><div class="learn-section"><div class="learn-h">Regularization: Ridge, Lasso, Elastic Net</div><div class="learn-p"><b>Ridge Regression (L2)</b> adds a penalty term &lambda;*&Sigma;w&sup2; to the loss function. This shrinks coefficients toward zero but never sets them exactly to zero. It handles multicollinearity well by distributing weight among correlated features.</div><div class="learn-p"><b>Lasso Regression (L1)</b> adds &lambda;*&Sigma;|w| to the loss. This can drive coefficients to exactly zero, performing automatic feature selection. However, it arbitrarily picks one feature among correlated ones.</div><div class="learn-p"><b>Elastic Net</b> combines L1 and L2: &lambda;&#8321;*&Sigma;|w| + &lambda;&#8322;*&Sigma;w&sup2;. This provides the feature selection of Lasso with the stability of Ridge. The mixing ratio &alpha; controls the balance.</div><div class="learn-tip">Use Ridge when you believe all features are relevant. Use Lasso when you suspect many features are irrelevant. Use Elastic Net when features are correlated and you want selection.</div></div><div class="learn-section"><div class="learn-h">Logistic Regression</div><div class="learn-p">Despite its name, <b>Logistic Regression</b> is a <b>classification</b> algorithm. It models the probability that a sample belongs to a class using the <b>sigmoid (logistic) function</b>: P(y=1|X) = 1 / (1 + e^(-z)) where z = w&middot;X + b. The sigmoid squashes any real number into (0, 1).</div><div class="learn-p">The model is trained by minimizing the <b>Binary Cross-Entropy Loss</b> (Log Loss): L = -(1/m) * &Sigma;[y*log(p) + (1-y)*log(1-p)]. This is a convex function, guaranteeing a global minimum. Gradient descent is used to optimize.</div><div class="learn-p">The <b>decision boundary</b> is where P(y=1) = 0.5, i.e., w&middot;X + b = 0. This is a hyperplane in feature space. The threshold can be adjusted based on precision-recall requirements.</div><div class="learn-warn">Logistic regression assumes a linear decision boundary. For non-linear boundaries, use polynomial features or switch to kernel-based methods.</div></div><div class="learn-section"><div class="learn-h">Multiclass Logistic Regression</div><div class="learn-p">For K &gt; 2 classes, logistic regression extends via: <b>One-vs-Rest (OvR)</b> trains K binary classifiers, each distinguishing one class from all others. The class with the highest probability wins. <b>Softmax Regression (Multinomial)</b> generalizes the sigmoid to K classes using the softmax function: P(y=k) = e^(z_k) / &Sigma;e^(z_j). This is the standard for neural network output layers.</div><div class="learn-p">The loss becomes <b>Categorical Cross-Entropy</b>: L = -&Sigma;&Sigma; y_ij * log(p_ij). Sklearn\'s LogisticRegression supports both via the <code>multi_class</code> parameter (\'ovr\' or \'multinomial\').</div><div class="learn-tip">For interview questions: know how to derive the gradient of log loss, explain why logistic regression is called "regression", and when to prefer it over more complex models (interpretability, small datasets, need for probabilistic outputs).</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What are the assumptions of linear regression?</b><br>A: Linearity (linear relationship between features and target), independence of errors, homoscedasticity (constant error variance), normality of residuals, and no multicollinearity among features. Violations: use polynomial features for non-linearity, VIF to detect multicollinearity, robust regression for heteroscedasticity.</p><p class="learn-p"><b>Q2: Explain L1 vs L2 regularization.</b><br>A: L1 (Lasso) adds |w| penalty — drives some weights exactly to zero, performing feature selection. L2 (Ridge) adds w² penalty — shrinks all weights toward zero but never exactly zero. Elastic Net combines both. L1 is preferred when you expect many irrelevant features; L2 when all features contribute.</p><p class="learn-p"><b>Q3: Why does logistic regression use sigmoid and cross-entropy loss instead of MSE?</b><br>A: Sigmoid maps outputs to (0,1) as probabilities. MSE with sigmoid creates a non-convex loss landscape with many local minima. Cross-entropy loss is convex when combined with sigmoid, guaranteeing convergence to the global minimum. The gradient of cross-entropy also has better numerical properties — no vanishing gradient at extreme predictions.</p></div>',
          code: `# Linear & Logistic Regression in Python
import numpy as np
from sklearn.linear_model import (LinearRegression, Ridge, Lasso,
    ElasticNet, LogisticRegression)
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import (mean_squared_error, r2_score,
    classification_report, roc_auc_score)
from sklearn.datasets import make_regression, make_classification

# ===== LINEAR REGRESSION =====
X_reg, y_reg = make_regression(n_samples=200, n_features=5,
    noise=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X_reg, y_reg, test_size=0.2, random_state=42)

# Simple Linear Regression
lr = LinearRegression()
lr.fit(X_train, y_train)
y_pred = lr.predict(X_test)
print(f"Linear Regression R2: {r2_score(y_test, y_pred):.4f}")
print(f"Coefficients: {lr.coef_.round(2)}")
print(f"Intercept: {lr.intercept_:.2f}")

# Ridge (L2), Lasso (L1), ElasticNet
for name, model in [
    ('Ridge', Ridge(alpha=1.0)),
    ('Lasso', Lasso(alpha=0.1)),
    ('ElasticNet', ElasticNet(alpha=0.1, l1_ratio=0.5))
]:
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    n_zero = np.sum(np.abs(model.coef_) < 1e-6)
    print(f"{name:12s} R2={r2_score(y_test, pred):.4f}, "
          f"Zero coeffs={n_zero}")

# Hyperparameter tuning for Ridge
param_grid = {'alpha': [0.01, 0.1, 1, 10, 100]}
grid = GridSearchCV(Ridge(), param_grid, cv=5,
                    scoring='neg_mean_squared_error')
grid.fit(X_train, y_train)
print(f"Best Ridge alpha: {grid.best_params_['alpha']}")

# ===== LOGISTIC REGRESSION =====
X_cls, y_cls = make_classification(n_samples=500, n_features=10,
    n_informative=5, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X_cls, y_cls, test_size=0.2, stratify=y_cls, random_state=42)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

# Binary Logistic Regression
log_reg = LogisticRegression(C=1.0, penalty='l2', max_iter=1000)
log_reg.fit(X_train_s, y_train)
y_pred = log_reg.predict(X_test_s)
y_proba = log_reg.predict_proba(X_test_s)[:, 1]

print(f"\\nLogistic Regression:")
print(classification_report(y_test, y_pred))
print(f"ROC-AUC: {roc_auc_score(y_test, y_proba):.4f}")

# Multiclass Logistic Regression
from sklearn.datasets import load_iris
iris = load_iris()
mc_lr = LogisticRegression(multi_class='multinomial',
    solver='lbfgs', max_iter=200)
mc_lr.fit(iris.data, iris.target)
print(f"\\nMulticlass Accuracy: {mc_lr.score(iris.data, iris.target):.4f}")

# --- Gradient Descent from scratch (educational) ---
def logistic_regression_gd(X, y, lr=0.01, epochs=1000):
    m, n = X.shape
    w = np.zeros(n)
    b = 0
    for _ in range(epochs):
        z = X @ w + b
        p = 1 / (1 + np.exp(-z))
        dw = (1/m) * X.T @ (p - y)
        db = (1/m) * np.sum(p - y)
        w -= lr * dw
        b -= lr * db
    return w, b

w, b = logistic_regression_gd(X_train_s, y_train)
preds = (1 / (1 + np.exp(-(X_test_s @ w + b)))) > 0.5
print(f"Scratch LR Accuracy: {np.mean(preds == y_test):.4f}")`,
          problems: [
            ['Linear Regression (GFG)', 'https://www.geeksforgeeks.org/ml-linear-regression/', 'Easy'],
            ['Logistic Regression (GFG)', 'https://www.geeksforgeeks.org/understanding-logistic-regression/', 'Easy'],
            ['House Prices Prediction', 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques', 'Medium'],
            ['Regularization in ML', 'https://www.geeksforgeeks.org/regularization-in-machine-learning/', 'Medium']
          ],
          mcqs: [
            {q: 'Which regularization technique can perform automatic feature selection by setting coefficients to exactly zero?', o: ['Ridge (L2)', 'Lasso (L1)', 'Elastic Net', 'Dropout'], a: 1},
            {q: 'The sigmoid function in logistic regression maps inputs to which range?', o: ['(-infinity, infinity)', '(-1, 1)', '(0, 1)', '[0, 1]'], a: 2},
            {q: 'What is the time complexity of solving linear regression via the Normal Equation?', o: ['O(n)', 'O(n^2)', 'O(n^3)', 'O(2^n)'], a: 2}
          ]
        },
        {
          t: 'Decision Trees, Random Forests & Gradient Boosting',
          learn: '<div class="learn-section"><div class="learn-h">Decision Trees</div><div class="learn-p">A <b>Decision Tree</b> recursively partitions the feature space into regions by making binary splits on features. At each internal node, the algorithm selects the feature and threshold that best separates the data according to an <b>impurity measure</b>. Leaf nodes hold the final prediction (class label or mean value).</div><div class="learn-p"><b>Splitting Criteria for Classification:</b></div><div class="learn-list"><ul><li><b>Gini Impurity:</b> G = 1 - &Sigma;p_i&sup2;. Measures the probability of misclassifying a randomly chosen element. Ranges from 0 (pure) to 0.5 (binary, equal split). Used by default in sklearn.</li><li><b>Entropy (Information Gain):</b> H = -&Sigma;p_i * log&sub2;(p_i). Information Gain = H(parent) - weighted average H(children). Tends to produce more balanced trees.</li><li><b>For Regression:</b> Variance Reduction or MSE. The split that minimizes the weighted sum of variances in child nodes is chosen.</li></ul></div><div class="learn-p">Decision trees are prone to <b>overfitting</b>. Key hyperparameters for control: <b>max_depth</b> (limits tree depth), <b>min_samples_split</b> (minimum samples to split a node), <b>min_samples_leaf</b> (minimum samples in a leaf), <b>max_features</b> (features considered per split).</div><div class="learn-tip">Decision trees are fully interpretable and require no feature scaling. They handle both numerical and categorical features natively.</div></div><div class="learn-section"><div class="learn-h">Random Forests (Bagging)</div><div class="learn-p"><b>Random Forest</b> is an ensemble of decision trees that reduces variance through <b>bagging (Bootstrap Aggregating)</b>. Each tree is trained on a random bootstrap sample (sampling with replacement) of the training data, and at each split, only a random subset of features is considered.</div><div class="learn-p">The final prediction is made by <b>majority voting</b> (classification) or <b>averaging</b> (regression) across all trees. This decorrelates the trees and significantly reduces overfitting compared to a single decision tree.</div><div class="learn-table"><table><tr><th>Hyperparameter</th><th>Effect</th><th>Typical Values</th></tr><tr><td>n_estimators</td><td>Number of trees</td><td>100-500</td></tr><tr><td>max_depth</td><td>Max tree depth</td><td>None or 10-30</td></tr><tr><td>max_features</td><td>Features per split</td><td>sqrt(n) for classification, n/3 for regression</td></tr><tr><td>min_samples_leaf</td><td>Min samples in leaf</td><td>1-10</td></tr><tr><td>bootstrap</td><td>Use bootstrap samples</td><td>True</td></tr></table></div><div class="learn-p"><b>Out-of-Bag (OOB) Score:</b> Each tree doesn\'t see ~37% of the data (out-of-bag samples). These can be used for validation without a separate test set, by setting <code>oob_score=True</code>.</div></div><div class="learn-section"><div class="learn-h">Gradient Boosting</div><div class="learn-p"><b>Gradient Boosting</b> builds trees <b>sequentially</b>, where each new tree corrects the errors (residuals) of the previous ensemble. Unlike bagging (which reduces variance), boosting primarily reduces <b>bias</b>. The prediction is a weighted sum of all trees.</div><div class="learn-p">The algorithm works by fitting each new tree to the <b>negative gradient</b> of the loss function with respect to the current ensemble\'s predictions. For MSE, this gradient is simply the residuals. For log loss, it\'s more complex but follows the same principle.</div><div class="learn-code">// Gradient Boosting Algorithm:\n// 1. Initialize F_0(x) = mean(y)  (or log-odds for classification)\n// 2. For m = 1 to M:\n//    a. Compute residuals: r_i = y_i - F_{m-1}(x_i)\n//    b. Fit a tree h_m to residuals r_i\n//    c. Update: F_m(x) = F_{m-1}(x) + &eta; * h_m(x)\n// 3. Final model: F_M(x) = F_0 + &eta;*h_1 + &eta;*h_2 + ... + &eta;*h_M</div><div class="learn-p">Key hyperparameters: <b>learning_rate (&eta;)</b> -- shrinks contribution of each tree (lower = more trees needed but better generalization), <b>n_estimators</b> -- number of boosting stages, <b>max_depth</b> -- usually kept small (3-8) for weak learners.</div></div><div class="learn-section"><div class="learn-h">XGBoost, LightGBM & CatBoost</div><div class="learn-p"><b>XGBoost</b> adds L1/L2 regularization to the objective, uses second-order gradients (Newton\'s method), handles missing values natively, and supports parallel tree construction. It includes built-in cross-validation and early stopping.</div><div class="learn-p"><b>LightGBM</b> uses <b>Gradient-based One-Side Sampling (GOSS)</b> and <b>Exclusive Feature Bundling (EFB)</b> for faster training. It grows trees <b>leaf-wise</b> (best-first) instead of level-wise, leading to deeper but more accurate trees. Ideal for large datasets.</div><div class="learn-p"><b>CatBoost</b> handles categorical features natively using <b>ordered target encoding</b>. It uses <b>ordered boosting</b> to prevent target leakage and is generally the easiest to use out-of-the-box with minimal tuning.</div><div class="learn-table"><table><tr><th>Library</th><th>Key Advantage</th><th>Best For</th></tr><tr><td>XGBoost</td><td>Regularization, robustness</td><td>Structured/tabular data competitions</td></tr><tr><td>LightGBM</td><td>Speed, memory efficiency</td><td>Large datasets, high-dimensional data</td></tr><tr><td>CatBoost</td><td>Handles categoricals natively</td><td>Datasets with many categorical features</td></tr></table></div><div class="learn-warn">For interviews: know the difference between bagging (variance reduction, parallel trees) and boosting (bias reduction, sequential trees). This is one of the most commonly asked ML questions.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How does a Random Forest reduce overfitting compared to a single decision tree?</b><br>A: Random Forest uses bagging: trains many trees on bootstrap samples (with replacement) and random feature subsets at each split. Individual trees overfit, but averaging their predictions reduces variance (by a factor of ~1/sqrt(n_trees)). Each tree sees different data and features, so their errors are uncorrelated.</p><p class="learn-p"><b>Q2: Explain the difference between bagging and boosting.</b><br>A: Bagging trains models in parallel on bootstrap samples and averages predictions — reduces variance (Random Forest). Boosting trains models sequentially, each correcting the errors of the previous one — reduces bias (AdaBoost, XGBoost). Bagging is less prone to overfitting; boosting can overfit if not regularized but typically achieves lower bias.</p><p class="learn-p"><b>Q3: What hyperparameters matter most when tuning XGBoost?</b><br>A: Learning rate (eta, lower = more trees needed but better generalization), max_depth (tree depth, controls complexity), n_estimators (number of trees), min_child_weight (minimum samples per leaf), subsample and colsample_bytree (randomization for regularization). Start with learning_rate=0.1, max_depth=6, then tune with cross-validation.</p></div>',
          code: `# Decision Trees, Random Forests & Gradient Boosting
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import (RandomForestClassifier,
    GradientBoostingClassifier, AdaBoostClassifier)
from sklearn.datasets import make_classification
from sklearn.model_selection import (train_test_split,
    cross_val_score, GridSearchCV)
from sklearn.metrics import (accuracy_score, classification_report,
    roc_auc_score)

# Generate dataset
X, y = make_classification(n_samples=1000, n_features=20,
    n_informative=12, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

# ===== DECISION TREE =====
dt = DecisionTreeClassifier(max_depth=5, min_samples_leaf=5,
                            random_state=42)
dt.fit(X_train, y_train)
print("Decision Tree:")
print(f"  Train Acc: {dt.score(X_train, y_train):.4f}")
print(f"  Test  Acc: {dt.score(X_test, y_test):.4f}")
# Print tree structure (first 3 levels)
tree_rules = export_text(dt, max_depth=3)
print(tree_rules[:300])

# ===== RANDOM FOREST =====
rf = RandomForestClassifier(n_estimators=200, max_depth=10,
    max_features='sqrt', oob_score=True, random_state=42)
rf.fit(X_train, y_train)
print(f"\\nRandom Forest:")
print(f"  OOB Score: {rf.oob_score_:.4f}")
print(f"  Test  Acc: {rf.score(X_test, y_test):.4f}")

# Feature Importance
importances = rf.feature_importances_
top_k = 5
indices = np.argsort(importances)[-top_k:][::-1]
print(f"  Top {top_k} features: {indices}")
print(f"  Importances: {importances[indices].round(4)}")

# ===== GRADIENT BOOSTING =====
gb = GradientBoostingClassifier(n_estimators=200, learning_rate=0.1,
    max_depth=4, subsample=0.8, random_state=42)
gb.fit(X_train, y_train)
print(f"\\nGradient Boosting:")
print(f"  Train Acc: {gb.score(X_train, y_train):.4f}")
print(f"  Test  Acc: {gb.score(X_test, y_test):.4f}")

# XGBoost (if available)
try:
    from xgboost import XGBClassifier
    xgb = XGBClassifier(n_estimators=200, learning_rate=0.1,
        max_depth=4, subsample=0.8, colsample_bytree=0.8,
        reg_alpha=0.1, reg_lambda=1.0, random_state=42,
        eval_metric='logloss')
    xgb.fit(X_train, y_train,
            eval_set=[(X_test, y_test)], verbose=False)
    print(f"\\nXGBoost Test Acc: {xgb.score(X_test, y_test):.4f}")
except ImportError:
    print("\\nXGBoost not installed")

# ===== COMPARISON =====
models = {
    'Decision Tree': dt,
    'Random Forest': rf,
    'Gradient Boosting': gb
}
print("\\n--- Model Comparison (5-Fold CV) ---")
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=5, scoring='roc_auc')
    print(f"{name:20s}: AUC = {scores.mean():.4f} "
          f"(+/- {scores.std():.4f})")

# Hyperparameter tuning for Random Forest
param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [5, 10, None],
    'min_samples_leaf': [1, 5]
}
grid = GridSearchCV(RandomForestClassifier(random_state=42),
    param_grid, cv=3, scoring='roc_auc', n_jobs=-1)
grid.fit(X_train, y_train)
print(f"\\nBest RF params: {grid.best_params_}")
print(f"Best RF AUC: {grid.best_score_:.4f}")`,
          problems: [
            ['Decision Tree Classification (GFG)', 'https://www.geeksforgeeks.org/decision-tree/', 'Easy'],
            ['Random Forest Algorithm', 'https://www.geeksforgeeks.org/random-forest-algorithm-in-machine-learning/', 'Medium'],
            ['XGBoost Tutorial', 'https://www.geeksforgeeks.org/xgboost/', 'Medium'],
            ['Tabular Playground (Kaggle)', 'https://www.kaggle.com/competitions/tabular-playground-series-apr-2021', 'Hard']
          ],
          mcqs: [
            {q: 'What is the primary difference between bagging and boosting?', o: ['Bagging uses neural networks, boosting uses trees', 'Bagging trains models in parallel to reduce variance; boosting trains sequentially to reduce bias', 'Bagging is faster than boosting', 'Boosting always outperforms bagging'], a: 1},
            {q: 'In a Random Forest, approximately what fraction of training samples are out-of-bag for each tree?', o: ['~10%', '~25%', '~37%', '~50%'], a: 2},
            {q: 'Which Gradient Boosting library grows trees leaf-wise instead of level-wise?', o: ['XGBoost', 'LightGBM', 'CatBoost', 'sklearn GradientBoosting'], a: 1}
          ]
        },
        {
          t: 'SVM, KNN & Naive Bayes',
          learn: '<div class="learn-section"><div class="learn-h">Support Vector Machine (SVM)</div><p class="learn-p">SVM finds the <b>maximum-margin hyperplane</b> that separates classes. The margin is the distance between the hyperplane and the nearest data points from each class (the <b>support vectors</b>).</p><table class="learn-table"><tr><th>Concept</th><th>Description</th></tr><tr><td>Hard margin</td><td>No misclassification allowed (linearly separable data only)</td></tr><tr><td>Soft margin (C parameter)</td><td>Allows some misclassification; C controls the trade-off. High C = less tolerance, low C = more tolerance</td></tr><tr><td>Kernel trick</td><td>Maps data to higher dimensions to find linear separator. Common kernels: linear, RBF, polynomial</td></tr></table><div class="learn-code">Decision boundary: w·x + b = 0\nMargin = 2 / ||w||\n\nKernel trick:\n  K(x, y) = φ(x)·φ(y)  — compute dot product in high-D without explicit mapping\n\nRBF kernel: K(x,y) = exp(-γ||x-y||²)\n  γ high → overfitting (complex boundary)\n  γ low  → underfitting (smooth boundary)</div><div class="learn-tip"><b>When to use SVM:</b> Small to medium datasets, high-dimensional data (text classification), clear margin of separation. Not ideal for very large datasets (training is O(n²) to O(n³)).</div></div><div class="learn-section"><div class="learn-h">K-Nearest Neighbors (KNN)</div><p class="learn-p">KNN is a <b>lazy learner</b> — no training phase. For a new point, find the K nearest neighbors and vote (classification) or average (regression).</p><table class="learn-table"><tr><th>Aspect</th><th>Detail</th></tr><tr><td>Distance metric</td><td>Euclidean (default), Manhattan, Minkowski, cosine</td></tr><tr><td>Choosing K</td><td>Small K → noisy/overfitting; Large K → smooth/underfitting. Use cross-validation.</td></tr><tr><td>Preprocessing</td><td>Feature scaling is critical (distances depend on scale)</td></tr><tr><td>Time complexity</td><td>O(n·d) per prediction (brute force); use KD-tree or Ball-tree for faster lookup</td></tr></table><div class="learn-warn"><b>Curse of dimensionality:</b> KNN breaks down in high dimensions because distances become meaningless. Reduce dimensions (PCA) before applying KNN in high-D.</div></div><div class="learn-section"><div class="learn-h">Naive Bayes</div><p class="learn-p">Based on <b>Bayes\' theorem</b> with the "naive" assumption of <b>feature independence</b>: P(y|x1,...,xn) ∝ P(y) × ∏P(xi|y).</p><table class="learn-table"><tr><th>Variant</th><th>Feature Type</th><th>Use Case</th></tr><tr><td>Gaussian NB</td><td>Continuous (assumes normal distribution)</td><td>General classification</td></tr><tr><td>Multinomial NB</td><td>Discrete counts</td><td>Text classification (word counts)</td></tr><tr><td>Bernoulli NB</td><td>Binary features</td><td>Text classification (word presence/absence)</td></tr></table><p class="learn-p"><b>Pros:</b> Very fast, works well with small datasets, handles high dimensions (text). <b>Cons:</b> Independence assumption rarely holds; poor with correlated features.</p><div class="learn-tip"><b>Spam filtering</b> is the classic Naive Bayes application. Despite the "naive" assumption, it works surprisingly well in practice for text classification.</div></div><div class="learn-section"><div class="learn-h">Algorithm Comparison &amp; When to Use</div><table class="learn-table"><tr><th>Aspect</th><th>SVM</th><th>KNN</th><th>Naive Bayes</th></tr><tr><td>Training speed</td><td>Slow (O(n&sup2;) - O(n&sup3;))</td><td>None (lazy learner)</td><td>Very fast</td></tr><tr><td>Prediction speed</td><td>Fast</td><td>Slow (O(n&middot;d) per query)</td><td>Very fast</td></tr><tr><td>High dimensions</td><td>Excellent (kernel trick)</td><td>Poor (curse of dimensionality)</td><td>Excellent</td></tr><tr><td>Feature scaling needed?</td><td>Yes</td><td>Yes (critical)</td><td>No</td></tr><tr><td>Handles non-linearity</td><td>Yes (kernels)</td><td>Inherently non-linear</td><td>No (linear decision boundary)</td></tr><tr><td>Best for</td><td>Small-medium data, text, image</td><td>Small data, recommendation</td><td>Text classification, spam filtering</td></tr></table><p class="learn-p"><b>SVM multi-class:</b> SVM is natively binary. For K classes, use <b>One-vs-One</b> (K(K-1)/2 classifiers, vote) or <b>One-vs-Rest</b> (K classifiers, highest confidence wins). One-vs-Rest is more common in practice.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain the kernel trick in SVM.</b><br>A: The kernel trick computes dot products in a higher-dimensional space without explicitly transforming the data. For example, the RBF kernel K(x,y) = exp(-gamma||x-y||²) maps data to infinite dimensions where a linear separator exists. This allows SVMs to find non-linear decision boundaries while keeping computation tractable — O(n²) in sample size, not feature dimension.</p><p class="learn-p"><b>Q2: What is the time complexity of KNN and how do you speed it up?</b><br>A: KNN has no training (lazy learner) but O(n*d) prediction per query (compare to all n training points in d dimensions). Speed up with: KD-trees (O(d*log n) average), Ball Trees (better in high dimensions), approximate nearest neighbors (FAISS, Annoy), or dimensionality reduction (PCA) before KNN.</p><p class="learn-p"><b>Q3: Why is Naive Bayes "naive" and when does it still work well?</b><br>A: It assumes features are conditionally independent given the class — rarely true in practice. Despite this, it works well for text classification (bag of words satisfies near-independence), spam filtering, and when training data is small. It is extremely fast to train (single pass through data) and surprisingly competitive as a baseline.</p></div>',
          code: `# SVM, KNN & Naive Bayes — Python

from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB, MultinomialNB
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification, load_iris
from sklearn.metrics import classification_report
import numpy as np

# Generate sample data
X, y = make_classification(n_samples=500, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Feature scaling (critical for SVM and KNN)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ===== SVM =====
svm_linear = SVC(kernel='linear', C=1.0)
svm_rbf = SVC(kernel='rbf', C=1.0, gamma='scale')
svm_rbf.fit(X_train_scaled, y_train)
print("SVM (RBF) accuracy:", svm_rbf.score(X_test_scaled, y_test))

# Cross-validation to tune C
for C in [0.01, 0.1, 1, 10, 100]:
    scores = cross_val_score(SVC(C=C, kernel='rbf'), X_train_scaled, y_train, cv=5)
    print(f"  C={C}: {scores.mean():.3f} ± {scores.std():.3f}")

# ===== KNN =====
knn = KNeighborsClassifier(n_neighbors=5, metric='euclidean')
knn.fit(X_train_scaled, y_train)
print("\\nKNN (k=5) accuracy:", knn.score(X_test_scaled, y_test))

# Find optimal K
for k in [1, 3, 5, 7, 11, 15]:
    scores = cross_val_score(KNeighborsClassifier(n_neighbors=k), X_train_scaled, y_train, cv=5)
    print(f"  k={k}: {scores.mean():.3f}")

# ===== Naive Bayes =====
gnb = GaussianNB()
gnb.fit(X_train, y_train)  # NB doesn't need scaling
print("\\nGaussian NB accuracy:", gnb.score(X_test, y_test))

# For text classification (would use MultinomialNB with CountVectorizer)
# from sklearn.feature_extraction.text import CountVectorizer
# vectorizer = CountVectorizer()
# X_text = vectorizer.fit_transform(documents)
# mnb = MultinomialNB().fit(X_text, labels)`,
          problems: [
            ['SVM Intuition', 'https://www.geeksforgeeks.org/support-vector-machine-algorithm/', 'Medium'],
            ['KNN Algorithm', 'https://www.geeksforgeeks.org/k-nearest-neighbours/', 'Easy'],
            ['Naive Bayes Classifier', 'https://www.geeksforgeeks.org/naive-bayes-classifiers/', 'Easy']
          ],
          mcqs: [
            {q: 'In SVM, support vectors are:', o: ['All training points', 'Points farthest from the hyperplane', 'Points closest to the decision boundary that define the margin', 'Points that are misclassified'], a: 2},
            {q: 'KNN is called a "lazy learner" because:', o: ['It trains slowly', 'It has no explicit training phase — all work is at prediction time', 'It only works on small datasets', 'It uses simple distance metrics'], a: 1},
            {q: 'The "naive" assumption in Naive Bayes is:', o: ['The prior is uniform', 'Features are conditionally independent given the class', 'The data is normally distributed', 'There are only two classes'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'unsup', t: 'Unsupervised Learning',
      topics: [
        {
          t: 'Clustering (K-Means, DBSCAN, Hierarchical)',
          learn: '<div class="learn-section"><div class="learn-h">What is Unsupervised Learning?</div><p class="learn-p">Unsupervised learning finds hidden patterns in <b>unlabeled data</b>. Key tasks: <b>clustering</b> (grouping similar data points), <b>dimensionality reduction</b> (compressing features), and <b>anomaly detection</b>.</p></div><div class="learn-section"><div class="learn-h">K-Means Clustering</div><p class="learn-p">Partitions n data points into K clusters by minimizing within-cluster sum of squared distances (inertia). Algorithm:</p><ol class="learn-list"><li>Initialize K centroids (randomly or via K-Means++)</li><li>Assign each point to the nearest centroid</li><li>Recalculate centroids as the mean of assigned points</li><li>Repeat steps 2-3 until convergence</li></ol><table class="learn-table"><tr><th>Aspect</th><th>Detail</th></tr><tr><td>Time complexity</td><td>O(n × K × I × d) where I = iterations, d = dimensions</td></tr><tr><td>Must specify K</td><td>Use Elbow method or Silhouette score to choose K</td></tr><tr><td>Limitations</td><td>Assumes spherical clusters, sensitive to outliers, non-deterministic</td></tr></table><div class="learn-code">K-Means++ Initialization:\n  1. Choose first centroid randomly\n  2. For each remaining centroid:\n     - Compute distance D(x) from each point to nearest existing centroid\n     - Choose next centroid with probability ∝ D(x)²\n  This ensures centroids are spread apart.</div></div><div class="learn-section"><div class="learn-h">DBSCAN</div><p class="learn-p"><b>Density-Based Spatial Clustering</b>. Groups points in dense regions; marks sparse points as noise. No need to specify K.</p><p class="learn-p"><b>Parameters:</b> ε (epsilon) = neighborhood radius, MinPts = minimum points for a core point.</p><table class="learn-table"><tr><th>Point Type</th><th>Condition</th></tr><tr><td>Core point</td><td>≥ MinPts within ε radius</td></tr><tr><td>Border point</td><td>&lt; MinPts within ε but in a core point\'s neighborhood</td></tr><tr><td>Noise point</td><td>Neither core nor border</td></tr></table><div class="learn-tip"><b>DBSCAN vs K-Means:</b> DBSCAN finds arbitrary-shaped clusters, handles noise, doesn\'t need K. But struggles with varying densities and high dimensions.</div></div><div class="learn-section"><div class="learn-h">Hierarchical Clustering</div><p class="learn-p"><b>Agglomerative</b> (bottom-up): Start with each point as a cluster, merge the closest pair until one cluster remains. Produces a <b>dendrogram</b> — cut at desired height to get K clusters.</p><table class="learn-table"><tr><th>Linkage</th><th>Distance Measure</th><th>Tendency</th></tr><tr><td>Single</td><td>Min distance between clusters</td><td>Elongated clusters (chaining)</td></tr><tr><td>Complete</td><td>Max distance</td><td>Compact, spherical clusters</td></tr><tr><td>Average</td><td>Average pairwise distance</td><td>Balanced</td></tr><tr><td>Ward\'s</td><td>Minimizes total within-cluster variance</td><td>Similar to K-Means</td></tr></table></div><div class="learn-section"><div class="learn-h">Evaluation &amp; Algorithm Comparison</div><p class="learn-p"><b>Silhouette Score:</b> Measures how similar a point is to its own cluster vs neighboring clusters. Ranges from -1 (misclassified) to +1 (well-clustered). S(i) = (b(i) - a(i)) / max(a(i), b(i)) where a = avg distance to same cluster, b = avg distance to nearest other cluster.</p><table class="learn-table"><tr><th>Aspect</th><th>K-Means</th><th>DBSCAN</th><th>Hierarchical</th></tr><tr><td>Cluster shape</td><td>Spherical only</td><td>Arbitrary shapes</td><td>Depends on linkage</td></tr><tr><td>Needs K?</td><td>Yes</td><td>No</td><td>Choose from dendrogram</td></tr><tr><td>Handles noise?</td><td>No</td><td>Yes (labels noise)</td><td>No</td></tr><tr><td>Scalability</td><td>Very fast (large datasets)</td><td>Moderate</td><td>Slow (O(n&sup2;) to O(n&sup3;))</td></tr><tr><td>Varying densities?</td><td>Poor</td><td>Poor</td><td>Better</td></tr></table><div class="learn-tip"><b>Choosing an algorithm:</b> Start with K-Means (fast baseline). If clusters have irregular shapes or noise, try DBSCAN. If you need a hierarchy or unknown K, try hierarchical. Always visualize with PCA/t-SNE first.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you choose K in K-Means?</b><br>A: Elbow method: plot inertia (within-cluster SSE) vs K and look for the bend. Silhouette score: measures how similar points are to their own cluster vs nearest cluster (higher is better, range -1 to 1). Gap statistic: compares inertia to a null reference distribution. Domain knowledge often guides the final choice.</p><p class="learn-p"><b>Q2: When would you choose DBSCAN over K-Means?</b><br>A: DBSCAN when: clusters have arbitrary shapes (K-Means assumes spherical), number of clusters is unknown, dataset has noise/outliers (DBSCAN labels them automatically), and cluster densities are similar. K-Means when: clusters are roughly spherical, K is known, and you need scalability (K-Means is O(nKd) per iteration).</p><p class="learn-p"><b>Q3: Explain the difference between single, complete, and average linkage in hierarchical clustering.</b><br>A: Single linkage: minimum distance between any two points in different clusters — finds elongated clusters but susceptible to chaining. Complete linkage: maximum distance — finds compact clusters but sensitive to outliers. Average linkage: mean pairwise distance — balances both. Ward\'s method minimizes within-cluster variance — most commonly used.</p></div>',
          code: `# Clustering — Python with scikit-learn

from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import numpy as np

np.random.seed(42)
X = np.vstack([
    np.random.randn(100, 2) + [2, 2],
    np.random.randn(100, 2) + [-2, -2],
    np.random.randn(100, 2) + [2, -2]
])

# K-Means
kmeans = KMeans(n_clusters=3, init='k-means++', random_state=42)
labels_km = kmeans.fit_predict(X)
print(f"K-Means inertia: {kmeans.inertia_:.2f}")
print(f"Silhouette: {silhouette_score(X, labels_km):.3f}")

# Elbow method
inertias = []
for k in range(1, 10):
    km = KMeans(n_clusters=k, random_state=42).fit(X)
    inertias.append(km.inertia_)
# Plot inertias vs k — look for the "elbow"

# DBSCAN
X_scaled = StandardScaler().fit_transform(X)
dbscan = DBSCAN(eps=0.5, min_samples=5)
labels_db = dbscan.fit_predict(X_scaled)
n_clusters = len(set(labels_db)) - (1 if -1 in labels_db else 0)
n_noise = list(labels_db).count(-1)
print(f"DBSCAN: {n_clusters} clusters, {n_noise} noise points")

# Hierarchical
agg = AgglomerativeClustering(n_clusters=3, linkage='ward')
labels_hc = agg.fit_predict(X)
print(f"Hierarchical Silhouette: {silhouette_score(X, labels_hc):.3f}")`,
          problems: [
            ['K-Means Clustering', 'https://www.geeksforgeeks.org/k-means-clustering-introduction/', 'Easy'],
            ['DBSCAN Algorithm', 'https://www.geeksforgeeks.org/dbscan-clustering-in-ml-density-based-clustering/', 'Medium'],
            ['Hierarchical Clustering', 'https://www.geeksforgeeks.org/ml-hierarchical-clustering-agglomerative-and-divisive-clustering/', 'Medium']
          ],
          mcqs: [
            {q: 'K-Means requires you to specify:', o: ['The distance metric', 'The number of clusters K', 'The cluster shapes', 'The noise threshold'], a: 1},
            {q: 'DBSCAN classifies a point as noise when:', o: ['It is far from the centroid', 'It has fewer than MinPts within ε and is not in any core point\'s neighborhood', 'It is in the largest cluster', 'Its feature values are outliers'], a: 1},
            {q: 'The Elbow method for choosing K plots:', o: ['Accuracy vs K', 'Inertia (within-cluster SSE) vs K', 'Silhouette vs time', 'Number of iterations vs K'], a: 1}
          ]
        },
        {
          t: 'Dimensionality Reduction (PCA, t-SNE)',
          learn: '<div class="learn-section"><div class="learn-h">Why Reduce Dimensions?</div><p class="learn-p">High-dimensional data suffers from the <b>curse of dimensionality</b>: distances become meaningless, models overfit, and computation is expensive. Dimensionality reduction projects data to a lower-dimensional space while preserving important structure.</p></div><div class="learn-section"><div class="learn-h">PCA (Principal Component Analysis)</div><p class="learn-p">PCA finds <b>orthogonal directions of maximum variance</b> and projects data onto them. It is a linear, deterministic method.</p><ol class="learn-list"><li>Standardize the data (zero mean, unit variance)</li><li>Compute the covariance matrix</li><li>Find eigenvalues and eigenvectors</li><li>Sort by eigenvalue (largest first) — these are the principal components</li><li>Project data onto the top-k eigenvectors</li></ol><div class="learn-code">Explained Variance Ratio:\n  eigenvalue_i / sum(all eigenvalues)\n\nChoose k such that cumulative explained variance ≥ 95%\n(or use the scree plot elbow)</div><div class="learn-tip"><b>PCA for interviews:</b> Know that PCA is equivalent to SVD on the centered data matrix. PCA is unsupervised (ignores labels). For supervised dimensionality reduction, use LDA (Linear Discriminant Analysis).</div></div><div class="learn-section"><div class="learn-h">t-SNE</div><p class="learn-p"><b>t-distributed Stochastic Neighbor Embedding</b> is a non-linear technique for <b>visualization</b> (projects to 2D or 3D). It preserves local structure — nearby points in high-D stay nearby in low-D.</p><table class="learn-table"><tr><th>PCA</th><th>t-SNE</th></tr><tr><td>Linear</td><td>Non-linear</td></tr><tr><td>Preserves global structure</td><td>Preserves local structure</td></tr><tr><td>Deterministic</td><td>Stochastic (different runs differ)</td></tr><tr><td>Fast, scalable</td><td>Slow for large datasets</td></tr><tr><td>Good for pre-processing</td><td>Good for visualization only</td></tr></table><div class="learn-warn"><b>Warning:</b> t-SNE is only for visualization, NOT for feature reduction in ML pipelines. Cluster sizes and distances in t-SNE plots are not meaningful. Always use PCA for feature reduction.</div></div><div class="learn-section"><div class="learn-h">UMAP &amp; Modern Alternatives</div><p class="learn-p"><b>UMAP (Uniform Manifold Approximation and Projection)</b> is the modern alternative to t-SNE, offering faster computation and better preservation of global structure. It works for both visualization and as a general-purpose dimensionality reduction technique.</p><table class="learn-table"><tr><th>Method</th><th>Speed</th><th>Global Structure</th><th>Use as Feature Reduction</th></tr><tr><td>PCA</td><td>Very fast</td><td>Excellent</td><td>Yes (standard choice)</td></tr><tr><td>t-SNE</td><td>Slow</td><td>Poor</td><td>No (visualization only)</td></tr><tr><td>UMAP</td><td>Fast</td><td>Good</td><td>Yes (with caution)</td></tr><tr><td>Autoencoders</td><td>Slow (training)</td><td>Depends on architecture</td><td>Yes (non-linear)</td></tr></table><p class="learn-p"><b>Autoencoders</b> are neural networks that learn a compressed representation by training to reconstruct input from a bottleneck layer. They capture non-linear relationships that PCA misses, but require more data and compute.</p></div><div class="learn-section"><div class="learn-h">Feature Selection vs Feature Extraction</div><p class="learn-p"><b>Feature selection</b> picks a subset of original features (wrapper, filter, or embedded methods). <b>Feature extraction</b> creates new features from combinations of originals (PCA, t-SNE, autoencoders).</p><table class="learn-table"><tr><th>Feature Selection</th><th>Feature Extraction</th></tr><tr><td>Keeps original features (interpretable)</td><td>Creates new features (may lose interpretability)</td></tr><tr><td>Methods: LASSO, mutual info, chi-squared, RFE</td><td>Methods: PCA, LDA, t-SNE, UMAP, autoencoders</td></tr><tr><td>Best when original features are meaningful</td><td>Best when features are correlated or redundant</td></tr></table><div class="learn-tip"><b>Interview tip:</b> "When would you use PCA vs feature selection?" PCA when features are correlated and you want to reduce multicollinearity. Feature selection (e.g., LASSO) when you need interpretable features for the business.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What does PCA do and what are its assumptions?</b><br>A: PCA finds orthogonal directions (principal components) of maximum variance in the data. It projects data onto these directions, keeping the top-k that capture the most variance. Assumptions: linear relationships, features should be standardized (zero mean, unit variance), and the directions of maximum variance are meaningful for the task.</p><p class="learn-p"><b>Q2: Why can\'t you use t-SNE for new data points or as a preprocessing step for classifiers?</b><br>A: t-SNE is non-parametric — it optimizes positions for a fixed dataset and has no transform for new points. It is non-deterministic (different runs give different layouts), doesn\'t preserve global structure (only local neighborhoods), and distances in the embedding are not meaningful. Use it only for 2D/3D visualization, not as a feature transform.</p></div>',
          code: `# PCA and t-SNE — Python

from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler
import numpy as np

# Load data
digits = load_digits()
X, y = digits.data, digits.target  # 1797 samples, 64 features

# Standardize
X_scaled = StandardScaler().fit_transform(X)

# PCA
pca = PCA(n_components=0.95)  # keep 95% variance
X_pca = pca.fit_transform(X_scaled)
print(f"PCA: {X.shape[1]} → {X_pca.shape[1]} components")
print(f"Explained variance: {pca.explained_variance_ratio_.sum():.3f}")

# PCA with fixed components for visualization
pca_2d = PCA(n_components=2)
X_pca_2d = pca_2d.fit_transform(X_scaled)

# t-SNE (for visualization)
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)

# Manual PCA from scratch
def pca_from_scratch(X, k):
    X_centered = X - X.mean(axis=0)
    cov = np.cov(X_centered.T)
    eigenvalues, eigenvectors = np.linalg.eigh(cov)
    idx = np.argsort(eigenvalues)[::-1][:k]
    W = eigenvectors[:, idx]
    return X_centered @ W, eigenvalues[idx] / eigenvalues.sum()

X_manual, ratios = pca_from_scratch(X_scaled, 2)
print(f"Manual PCA explained: {ratios.sum():.3f}")`,
          problems: [
            ['PCA Basics', 'https://www.geeksforgeeks.org/principal-component-analysis-pca/', 'Medium'],
            ['t-SNE Explained', 'https://www.geeksforgeeks.org/ml-t-distributed-stochastic-neighbor-embedding-t-sne-algorithm/', 'Medium']
          ],
          mcqs: [
            {q: 'PCA finds directions that maximize:', o: ['Classification accuracy', 'Variance in the data', 'Number of clusters', 'Training speed'], a: 1},
            {q: 't-SNE is primarily used for:', o: ['Feature engineering', 'Regression', 'High-dimensional data visualization', 'Time series forecasting'], a: 2},
            {q: 'PCA requires the data to be:', o: ['Normalized to [0,1]', 'Standardized (zero mean, unit variance)', 'Binary', 'Sorted'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'dl', t: 'Deep Learning',
      topics: [
        {
          t: 'Neural Network Fundamentals (Perceptrons, Backpropagation)',
          learn: '<div class="learn-section"><div class="learn-h">The Perceptron</div><div class="learn-p">The <b>perceptron</b> is the simplest neural network -- a single neuron that computes a weighted sum of inputs, adds a bias, and passes the result through an activation function: <b>output = f(w&middot;x + b)</b>. Originally proposed by Rosenblatt (1958), it can only solve <b>linearly separable</b> problems.</div><div class="learn-p">The classic XOR problem demonstrated the perceptron\'s limitation: it cannot learn XOR because no single hyperplane separates the classes. This motivated <b>Multi-Layer Perceptrons (MLPs)</b> -- stacking layers of neurons with non-linear activations to learn complex decision boundaries.</div><div class="learn-table"><table><tr><th>Activation</th><th>Formula</th><th>Range</th><th>Use Case</th></tr><tr><td>Sigmoid</td><td>1 / (1 + e^(-x))</td><td>(0, 1)</td><td>Binary output, gates in LSTMs</td></tr><tr><td>Tanh</td><td>(e^x - e^(-x)) / (e^x + e^(-x))</td><td>(-1, 1)</td><td>Hidden layers (zero-centered)</td></tr><tr><td>ReLU</td><td>max(0, x)</td><td>[0, &infin;)</td><td>Default for hidden layers</td></tr><tr><td>Leaky ReLU</td><td>max(&alpha;x, x)</td><td>(-&infin;, &infin;)</td><td>Avoids dying ReLU problem</td></tr><tr><td>GELU</td><td>x * &Phi;(x)</td><td>(-0.17, &infin;)</td><td>Transformers (smooth ReLU)</td></tr><tr><td>Softmax</td><td>e^(x_i) / &Sigma;e^(x_j)</td><td>(0, 1), sums to 1</td><td>Multi-class output layer</td></tr></table></div></div><div class="learn-section"><div class="learn-h">Feedforward Architecture</div><div class="learn-p">A <b>feedforward neural network</b> consists of an input layer, one or more hidden layers, and an output layer. Information flows in one direction: input &rarr; hidden &rarr; output. Each layer performs: <b>z = W&middot;a_prev + b</b> (linear transform) followed by <b>a = f(z)</b> (non-linear activation).</div><div class="learn-p">Key terminology: <b>Width</b> = number of neurons in a layer. <b>Depth</b> = number of layers. The <b>Universal Approximation Theorem</b> states that a single hidden layer with enough neurons can approximate any continuous function, but deeper networks are exponentially more parameter-efficient.</div><div class="learn-p">For a network with layers [784, 256, 128, 10]: parameters = (784*256+256) + (256*128+128) + (128*10+10) = 235,146. Understanding parameter counting is crucial for interview questions.</div></div><div class="learn-section"><div class="learn-h">Backpropagation</div><div class="learn-p"><b>Backpropagation</b> is the algorithm used to compute gradients of the loss function with respect to all weights in the network. It applies the <b>chain rule of calculus</b> layer by layer, from output back to input.</div><div class="learn-code">// Forward Pass (for layer l):\n//   z^l = W^l * a^{l-1} + b^l\n//   a^l = f(z^l)\n//\n// Backward Pass:\n//   dL/da^L = loss gradient at output (e.g., a^L - y for MSE)\n//   dL/dz^l = dL/da^l * f\'(z^l)       [element-wise]\n//   dL/dW^l = dL/dz^l * (a^{l-1})^T   [weight gradient]\n//   dL/db^l = sum(dL/dz^l)             [bias gradient]\n//   dL/da^{l-1} = (W^l)^T * dL/dz^l   [propagate backward]</div><div class="learn-p">The gradients are then used to update weights via an optimizer (SGD, Adam, etc.). The <b>computation graph</b> tracks all operations, and frameworks like PyTorch use <b>automatic differentiation (autograd)</b> to compute gradients efficiently.</div><div class="learn-warn">Common issues: <b>Vanishing gradients</b> occur when gradients shrink exponentially in deep networks (especially with sigmoid/tanh). <b>Exploding gradients</b> occur when they grow exponentially. Solutions include ReLU activation, careful initialization (Xavier/He), batch normalization, and gradient clipping.</div></div><div class="learn-section"><div class="learn-h">Weight Initialization</div><div class="learn-p">Proper initialization is critical for training deep networks. Initializing all weights to zero causes all neurons to learn the same function (symmetry breaking problem). Random initialization breaks symmetry but scale matters.</div><div class="learn-list"><ul><li><b>Xavier (Glorot) Initialization:</b> W ~ N(0, 2/(n_in + n_out)). Designed for sigmoid/tanh activations. Maintains variance across layers.</li><li><b>He Initialization:</b> W ~ N(0, 2/n_in). Designed for ReLU activations. Accounts for the fact that ReLU zeros out half the inputs.</li><li><b>Orthogonal Initialization:</b> W is an orthogonal matrix. Preserves gradient norms, useful for RNNs.</li></ul></div><div class="learn-tip">Use He initialization for ReLU networks (the default in PyTorch\'s nn.Linear) and Xavier for tanh/sigmoid. This is a frequently asked interview topic.</div></div><div class="learn-section"><div class="learn-h">Loss Functions</div><div class="learn-p">The loss function measures how far the model\'s predictions are from the ground truth. Choosing the right loss is critical:</div><div class="learn-table"><table><tr><th>Loss</th><th>Formula</th><th>Use Case</th></tr><tr><td>MSE</td><td>(1/n)&Sigma;(y-y&#770;)&sup2;</td><td>Regression</td></tr><tr><td>MAE</td><td>(1/n)&Sigma;|y-y&#770;|</td><td>Regression (robust to outliers)</td></tr><tr><td>Binary Cross-Entropy</td><td>-[y*log(p)+(1-y)*log(1-p)]</td><td>Binary classification</td></tr><tr><td>Categorical Cross-Entropy</td><td>-&Sigma;y_i*log(p_i)</td><td>Multi-class classification</td></tr><tr><td>Huber Loss</td><td>Smooth combination of MSE &amp; MAE</td><td>Regression (outlier-robust)</td></tr></table></div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain backpropagation in simple terms.</b><br>A: Backpropagation computes how much each weight contributed to the loss by applying the chain rule from output to input. Forward pass: compute predictions layer by layer. Backward pass: compute dL/dW for each layer using dL/dz = dL/da * f\'(z), then propagate gradients backward. Each weight is updated proportional to its gradient. Frameworks like PyTorch do this automatically with autograd.</p><p class="learn-p"><b>Q2: Why do we need non-linear activation functions?</b><br>A: Without non-linear activations, any number of stacked linear layers reduces to a single linear transformation (matrix multiplication is associative). Non-linearity allows the network to learn complex decision boundaries. ReLU is the default for hidden layers (avoids vanishing gradients, computationally cheap). Sigmoid/softmax for output layers when you need probabilities.</p><p class="learn-p"><b>Q3: What is the vanishing gradient problem and how is it solved?</b><br>A: In deep networks with sigmoid/tanh, gradients are multiplied through many layers during backprop. Since sigmoid derivatives are at most 0.25, gradients shrink exponentially — early layers barely update. Solutions: ReLU activation (gradient is 1 for positive inputs), skip connections (ResNet), batch normalization, proper initialization (He/Xavier), and LSTM gates for recurrent networks.</p></div>',
          code: `# Neural Network Fundamentals with PyTorch
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# ===== PERCEPTRON FROM SCRATCH (NumPy) =====
class Perceptron:
    def __init__(self, n_features, lr=0.01):
        self.w = np.zeros(n_features)
        self.b = 0
        self.lr = lr

    def predict(self, X):
        return np.where(X @ self.w + self.b >= 0, 1, 0)

    def fit(self, X, y, epochs=100):
        for _ in range(epochs):
            for xi, yi in zip(X, y):
                pred = 1 if xi @ self.w + self.b >= 0 else 0
                update = self.lr * (yi - pred)
                self.w += update * xi
                self.b += update

# Test perceptron on AND gate
X_and = np.array([[0,0],[0,1],[1,0],[1,1]])
y_and = np.array([0, 0, 0, 1])
p = Perceptron(2, lr=0.1)
p.fit(X_and, y_and, epochs=10)
print(f"Perceptron AND: {p.predict(X_and)}")  # [0,0,0,1]

# ===== MLP FROM SCRATCH (NumPy) =====
def sigmoid(z): return 1 / (1 + np.exp(-np.clip(z, -500, 500)))
def sigmoid_deriv(a): return a * (1 - a)
def relu(z): return np.maximum(0, z)
def relu_deriv(z): return (z > 0).astype(float)

class MLPFromScratch:
    def __init__(self, layers):  # e.g., [2, 4, 1]
        self.weights = []
        self.biases = []
        for i in range(len(layers) - 1):
            # He initialization
            w = np.random.randn(layers[i], layers[i+1]) * np.sqrt(2/layers[i])
            b = np.zeros((1, layers[i+1]))
            self.weights.append(w)
            self.biases.append(b)

    def forward(self, X):
        self.activations = [X]
        a = X
        for i, (w, b) in enumerate(zip(self.weights, self.biases)):
            z = a @ w + b
            a = sigmoid(z) if i == len(self.weights)-1 else relu(z)
            self.activations.append(a)
        return a

    def backward(self, y, lr=0.01):
        m = y.shape[0]
        delta = self.activations[-1] - y.reshape(-1, 1)
        for i in range(len(self.weights) - 1, -1, -1):
            dw = self.activations[i].T @ delta / m
            db = np.sum(delta, axis=0, keepdims=True) / m
            if i > 0:
                delta = (delta @ self.weights[i].T) * relu_deriv(
                    self.activations[i])
            self.weights[i] -= lr * dw
            self.biases[i] -= lr * db

# Solve XOR with MLP
X_xor = np.array([[0,0],[0,1],[1,0],[1,1]])
y_xor = np.array([0, 1, 1, 0])
mlp = MLPFromScratch([2, 8, 1])
for epoch in range(5000):
    out = mlp.forward(X_xor)
    mlp.backward(y_xor, lr=0.5)
print(f"MLP XOR: {mlp.forward(X_xor).ravel().round(2)}")

# ===== PyTorch MLP =====
class PyTorchMLP(nn.Module):
    def __init__(self, input_dim, hidden_dims, output_dim):
        super().__init__()
        layers = []
        prev = input_dim
        for h in hidden_dims:
            layers.extend([nn.Linear(prev, h), nn.ReLU(),
                          nn.BatchNorm1d(h), nn.Dropout(0.2)])
            prev = h
        layers.append(nn.Linear(prev, output_dim))
        self.network = nn.Sequential(*layers)
        self._init_weights()

    def _init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.kaiming_normal_(m.weight, mode='fan_in')
                nn.init.zeros_(m.bias)

    def forward(self, x):
        return self.network(x)

# Create and train PyTorch model
model = PyTorchMLP(20, [128, 64], 2)
print(f"\\nModel parameters: "
      f"{sum(p.numel() for p in model.parameters()):,}")
print(model)`,
          problems: [
            ['Neural Networks Basics (GFG)', 'https://www.geeksforgeeks.org/neural-networks-a-beginners-guide/', 'Easy'],
            ['Backpropagation Algorithm', 'https://www.geeksforgeeks.org/backpropagation-in-neural-network/', 'Medium'],
            ['Digit Recognizer (Kaggle)', 'https://www.kaggle.com/c/digit-recognizer', 'Medium'],
            ['Activation Functions Deep Dive', 'https://www.geeksforgeeks.org/activation-functions-neural-networks/', 'Easy']
          ],
          mcqs: [
            {q: 'Why can a single-layer perceptron not learn the XOR function?', o: ['It has too few parameters', 'XOR is not linearly separable', 'The learning rate is too high', 'Perceptrons cannot use bias terms'], a: 1},
            {q: 'He initialization is specifically designed for which activation function?', o: ['Sigmoid', 'Tanh', 'ReLU', 'Softmax'], a: 2},
            {q: 'During backpropagation, what mathematical rule is applied to compute gradients through layers?', o: ['Product rule', 'Chain rule', 'Quotient rule', 'Power rule'], a: 1}
          ]
        },
        {
          t: 'Optimization (SGD, Adam, Learning Rate Scheduling)',
          learn: '<div class="learn-section"><div class="learn-h">Gradient Descent Variants</div><div class="learn-p"><b>Batch Gradient Descent</b> computes the gradient using the entire training set. It gives a stable, accurate gradient estimate but is slow for large datasets and requires the entire dataset to fit in memory.</div><div class="learn-p"><b>Stochastic Gradient Descent (SGD)</b> updates weights using a single random sample at a time. It is noisy (high variance in updates) but fast and can escape shallow local minima. The noise acts as implicit regularization.</div><div class="learn-p"><b>Mini-Batch SGD</b> is the practical compromise: compute the gradient on a small batch (typically 32-256 samples). It leverages GPU parallelism, provides a reasonable gradient estimate, and is the standard in deep learning.</div><div class="learn-table"><table><tr><th>Variant</th><th>Batch Size</th><th>Pros</th><th>Cons</th></tr><tr><td>Batch GD</td><td>All N</td><td>Stable convergence</td><td>Slow, memory-intensive</td></tr><tr><td>SGD</td><td>1</td><td>Fast updates, can escape minima</td><td>Very noisy, unstable</td></tr><tr><td>Mini-Batch</td><td>32-256</td><td>GPU efficient, balanced</td><td>Needs batch size tuning</td></tr></table></div><div class="learn-code">// SGD Update Rule:\n// w = w - lr * gradient(L, w)\n//\n// With Momentum:\n// v = &beta; * v - lr * gradient(L, w)\n// w = w + v\n// Momentum accelerates in consistent gradient directions\n// and dampens oscillations. Typical &beta; = 0.9</div></div><div class="learn-section"><div class="learn-h">Advanced Optimizers</div><div class="learn-p"><b>SGD with Momentum</b> accumulates a velocity vector in directions of persistent gradients. It accelerates convergence in ravines (narrow valleys in the loss surface). <b>Nesterov Momentum</b> looks ahead by computing the gradient at the anticipated next position, providing a corrective factor.</div><div class="learn-p"><b>AdaGrad</b> adapts the learning rate per parameter by dividing by the square root of accumulated squared gradients. Features that appear frequently get smaller learning rates. Problem: the accumulated sum grows monotonically, eventually making the learning rate vanishingly small.</div><div class="learn-p"><b>RMSProp</b> fixes AdaGrad\'s diminishing learning rate by using an exponentially decaying average of squared gradients instead of a sum: <b>s = &beta;*s + (1-&beta;)*g&sup2;</b>. This keeps the denominator from growing without bound.</div><div class="learn-p"><b>Adam (Adaptive Moment Estimation)</b> combines momentum (first moment, m) with RMSProp (second moment, v). It also applies <b>bias correction</b> for the initial steps: m&#770; = m/(1-&beta;&#8321;^t), v&#770; = v/(1-&beta;&#8322;^t). Default hyperparameters: &beta;&#8321;=0.9, &beta;&#8322;=0.999, &epsilon;=1e-8.</div><div class="learn-table"><table><tr><th>Optimizer</th><th>Key Idea</th><th>When to Use</th></tr><tr><td>SGD + Momentum</td><td>Velocity accumulation</td><td>ConvNets, well-tuned training</td></tr><tr><td>Adam</td><td>Adaptive LR + momentum</td><td>Default choice, NLP, GANs</td></tr><tr><td>AdamW</td><td>Adam + decoupled weight decay</td><td>Transformers, modern default</td></tr><tr><td>LAMB/LARS</td><td>Layer-wise adaptive rates</td><td>Very large batch training</td></tr></table></div><div class="learn-tip">Adam converges faster but SGD with momentum often achieves better final generalization. Many top results use SGD with a cosine schedule. AdamW (decoupled weight decay) is now preferred over Adam for transformers.</div></div><div class="learn-section"><div class="learn-h">Learning Rate Scheduling</div><div class="learn-p">The learning rate is the most important hyperparameter. Too high: training diverges. Too low: training is painfully slow and may get stuck. <b>Learning rate schedules</b> start with a higher rate for fast initial progress and reduce it for fine-grained convergence.</div><div class="learn-list"><ul><li><b>Step Decay:</b> Reduce LR by a factor every N epochs (e.g., halve every 30 epochs). Simple and effective.</li><li><b>Cosine Annealing:</b> LR follows a cosine curve from initial value to near zero. Smooth decay, very popular in modern training.</li><li><b>Warm Restarts:</b> Cosine annealing with periodic resets (warm restarts). Helps escape local minima.</li><li><b>Linear Warmup:</b> Start from a very small LR and linearly increase to the target over the first few epochs. Essential for large batch training and transformers.</li><li><b>ReduceLROnPlateau:</b> Monitor a metric (e.g., validation loss) and reduce LR when it stops improving. Adaptive but reactive.</li><li><b>One-Cycle Policy:</b> Increase LR from min to max in the first half, then decrease below min. Achieves super-convergence.</li></ul></div><div class="learn-warn">Always use learning rate warmup when training transformers or when using large batch sizes. Without warmup, the initial large gradients with a high learning rate can permanently damage the model.</div></div><div class="learn-section"><div class="learn-h">Regularization Techniques</div><div class="learn-p">Regularization prevents overfitting by constraining the model. Key techniques in deep learning:</div><div class="learn-list"><ul><li><b>L2 Regularization (Weight Decay):</b> Adds &lambda;*||w||&sup2; to loss. Penalizes large weights. In Adam, use decoupled weight decay (AdamW).</li><li><b>Dropout:</b> Randomly zeroes out neurons during training with probability p (typically 0.1-0.5). At test time, scale outputs by (1-p) or use inverted dropout. Forces redundant representations.</li><li><b>Batch Normalization:</b> Normalizes layer inputs to zero mean and unit variance. Reduces internal covariate shift, allows higher learning rates, and has a slight regularization effect.</li><li><b>Data Augmentation:</b> Create synthetic training examples via transformations (flips, rotations, crops, color jitter for images). Free additional training data.</li><li><b>Early Stopping:</b> Stop training when validation loss begins to increase. Simple and effective.</li></ul></div><div class="learn-tip">Dropout and BatchNorm are the two most important regularizers for deep networks. Use both, but note that their interaction can be tricky -- typically apply dropout after BatchNorm.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare SGD with momentum and Adam.</b><br>A: SGD + momentum accumulates past gradients to smooth updates and escape local minima — good generalization, needs careful LR tuning. Adam adapts learning rate per parameter using first and second moment estimates — faster convergence, less sensitive to initial LR. In practice: Adam for fast prototyping, SGD + momentum + scheduler for best generalization (used for SOTA results in vision).</p><p class="learn-p"><b>Q2: What is the purpose of learning rate warmup?</b><br>A: Starting with a large learning rate can destabilize early training when weights are random. Warmup linearly increases LR from near-zero to the target over a few epochs, allowing the model to find a reasonable region before taking large steps. Especially important for Transformers with Adam — prevents divergence in the first few hundred steps.</p><p class="learn-p"><b>Q3: Explain batch size tradeoffs.</b><br>A: Small batches (32-128): noisier gradients, better generalization (implicit regularization), but slower wall-clock time. Large batches (1K-64K): less noise, faster training, but can converge to sharp minima with worse generalization. Common practice: start with batch size 32-256, use learning rate scaling (linear scaling rule) if increasing batch size.</p></div>',
          code: `# Optimization & Learning Rate Scheduling with PyTorch
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torch.optim.lr_scheduler import (StepLR, CosineAnnealingLR,
    ReduceLROnPlateau, OneCycleLR, CosineAnnealingWarmRestarts)

# ===== SGD FROM SCRATCH =====
def sgd_from_scratch():
    np.random.seed(42)
    X = np.random.randn(200, 1)
    y = 3 * X + 2 + np.random.randn(200, 1) * 0.3
    w, b, lr = 0.0, 0.0, 0.01

    for epoch in range(100):
        # Mini-batch SGD
        indices = np.random.permutation(len(X))
        for start in range(0, len(X), 32):
            batch = indices[start:start+32]
            Xb, yb = X[batch], y[batch]
            pred = w * Xb + b
            dw = -2 * np.mean(Xb * (yb - pred))
            db = -2 * np.mean(yb - pred)
            w -= lr * dw
            b -= lr * db
    print(f"SGD from scratch: w={w:.3f}, b={b:.3f}")  # ~3, ~2

sgd_from_scratch()

# ===== ADAM FROM SCRATCH =====
def adam_from_scratch():
    np.random.seed(42)
    X = np.random.randn(200, 1)
    y = 3 * X + 2 + np.random.randn(200, 1) * 0.3
    w, b = 0.0, 0.0
    lr, beta1, beta2, eps = 0.01, 0.9, 0.999, 1e-8
    mw, mb, vw, vb = 0, 0, 0, 0

    for t in range(1, 2001):
        pred = w * X + b
        dw = -2 * np.mean(X * (y - pred))
        db = -2 * np.mean(y - pred)
        # Update biased first & second moments
        mw = beta1 * mw + (1 - beta1) * dw
        mb = beta1 * mb + (1 - beta1) * db
        vw = beta2 * vw + (1 - beta2) * dw**2
        vb = beta2 * vb + (1 - beta2) * db**2
        # Bias correction
        mw_hat = mw / (1 - beta1**t)
        mb_hat = mb / (1 - beta1**t)
        vw_hat = vw / (1 - beta2**t)
        vb_hat = vb / (1 - beta2**t)
        # Update parameters
        w -= lr * mw_hat / (np.sqrt(vw_hat) + eps)
        b -= lr * mb_hat / (np.sqrt(vb_hat) + eps)
    print(f"Adam from scratch: w={w:.3f}, b={b:.3f}")

adam_from_scratch()

# ===== PyTorch Optimizer Comparison =====
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(20, 64), nn.ReLU(), nn.BatchNorm1d(64),
            nn.Dropout(0.2),
            nn.Linear(64, 32), nn.ReLU(), nn.BatchNorm1d(32),
            nn.Linear(32, 2)
        )
    def forward(self, x):
        return self.net(x)

# Generate data
torch.manual_seed(42)
X = torch.randn(1000, 20)
y = torch.randint(0, 2, (1000,))

def train_with_optimizer(opt_name, optimizer_fn, scheduler_fn=None):
    model = SimpleNet()
    optimizer = optimizer_fn(model.parameters())
    scheduler = scheduler_fn(optimizer) if scheduler_fn else None
    criterion = nn.CrossEntropyLoss()

    for epoch in range(50):
        model.train()
        perm = torch.randperm(len(X))
        epoch_loss = 0
        for i in range(0, len(X), 64):
            batch = perm[i:i+64]
            out = model(X[batch])
            loss = criterion(out, y[batch])
            optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            epoch_loss += loss.item()
        if scheduler:
            if isinstance(scheduler, ReduceLROnPlateau):
                scheduler.step(epoch_loss)
            else:
                scheduler.step()

    model.eval()
    with torch.no_grad():
        acc = (model(X).argmax(1) == y).float().mean()
    lr_final = optimizer.param_groups[0]['lr']
    print(f"{opt_name:20s}: acc={acc:.4f}, final_lr={lr_final:.6f}")

# Compare optimizers with schedulers
train_with_optimizer("SGD+Momentum",
    lambda p: optim.SGD(p, lr=0.1, momentum=0.9, weight_decay=1e-4),
    lambda o: StepLR(o, step_size=20, gamma=0.5))

train_with_optimizer("Adam",
    lambda p: optim.Adam(p, lr=1e-3, betas=(0.9, 0.999)),
    lambda o: CosineAnnealingLR(o, T_max=50))

train_with_optimizer("AdamW+Cosine",
    lambda p: optim.AdamW(p, lr=1e-3, weight_decay=0.01),
    lambda o: CosineAnnealingWarmRestarts(o, T_0=10, T_mult=2))

train_with_optimizer("AdamW+Plateau",
    lambda p: optim.AdamW(p, lr=1e-3),
    lambda o: ReduceLROnPlateau(o, patience=5, factor=0.5))`,
          problems: [
            ['Gradient Descent Optimization', 'https://www.geeksforgeeks.org/gradient-descent-algorithm-and-its-variants/', 'Easy'],
            ['Adam Optimizer Explained', 'https://www.geeksforgeeks.org/adam-optimizer/', 'Medium']
          ],
          mcqs: [
            {q: 'What is the key advantage of Adam over vanilla SGD?', o: ['It uses less memory', 'It adapts learning rates per parameter using first and second moment estimates', 'It always converges to the global minimum', 'It does not require a learning rate'], a: 1},
            {q: 'In mini-batch gradient descent, what is the typical batch size range?', o: ['1-4', '32-256', '1000-5000', 'Equal to dataset size'], a: 1},
            {q: 'Why is learning rate warmup important for transformer training?', o: ['It reduces memory usage', 'It prevents large initial gradients from destabilizing training', 'It speeds up tokenization', 'It is required by the Adam optimizer'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'cnn2', t: 'CNNs',
      topics: [
        {
          t: 'Convolutional Neural Networks (Architecture, Pooling, Famous Models)',
          learn: '<div class="learn-section"><div class="learn-h">Convolution Operation</div><div class="learn-p">A <b>Convolutional Neural Network (CNN)</b> is designed to process data with grid-like topology (images, time series). The core operation is the <b>convolution</b>: a small filter (kernel) slides across the input, computing element-wise multiplication and summation at each position. This produces a <b>feature map</b> (activation map).</div><div class="learn-p">For a 2D convolution: <b>output[i,j] = &Sigma;&Sigma; input[i+m, j+n] * kernel[m, n] + bias</b>. The kernel detects local patterns (edges, textures, shapes). Early layers detect simple features; deeper layers combine them into complex patterns (eyes, faces, objects).</div><div class="learn-p">Key parameters: <b>Kernel size</b> (typically 3x3 or 5x5), <b>Stride</b> (step size of the sliding window, default 1), <b>Padding</b> (adding zeros around the border to control output size). Output size formula: <b>O = (I - K + 2P) / S + 1</b> where I=input size, K=kernel size, P=padding, S=stride.</div><div class="learn-code">// Example: Input 32x32, Kernel 3x3, Padding 1, Stride 1\n// Output = (32 - 3 + 2*1) / 1 + 1 = 32x32 (same padding)\n//\n// Input 32x32, Kernel 5x5, Padding 0, Stride 2\n// Output = (32 - 5 + 0) / 2 + 1 = 14x14\n//\n// Parameters per conv layer:\n// = (K_h * K_w * C_in + 1) * C_out\n// e.g., 3x3 conv, 64 input channels, 128 output:\n// = (3 * 3 * 64 + 1) * 128 = 73,856 params</div><div class="learn-tip">The key insight of CNNs is <b>parameter sharing</b> (same kernel for all spatial positions) and <b>local connectivity</b> (each output depends only on a small region). This dramatically reduces parameters compared to fully-connected layers.</div></div><div class="learn-section"><div class="learn-h">Pooling Layers</div><div class="learn-p"><b>Pooling</b> reduces the spatial dimensions of feature maps, reducing computation and providing translation invariance. Common types:</div><div class="learn-table"><table><tr><th>Type</th><th>Operation</th><th>Use Case</th></tr><tr><td>Max Pooling</td><td>Takes maximum value in each window</td><td>Most common, preserves strongest activations</td></tr><tr><td>Average Pooling</td><td>Takes mean value in each window</td><td>Smoother downsampling</td></tr><tr><td>Global Average Pooling</td><td>Average over entire spatial dimension</td><td>Replaces FC layers at the end, reduces overfitting</td></tr><tr><td>Adaptive Pooling</td><td>Outputs a fixed size regardless of input</td><td>Handles variable input sizes</td></tr></table></div><div class="learn-p">Typical pooling: 2x2 window with stride 2, which halves spatial dimensions. Modern architectures increasingly use strided convolutions instead of pooling for learnable downsampling.</div></div><div class="learn-section"><div class="learn-h">Classic CNN Architectures</div><div class="learn-p"><b>LeNet-5 (1998):</b> The pioneer. Two conv layers followed by three FC layers. Designed for digit recognition (MNIST). ~60K parameters. Introduced the conv-pool-conv-pool-FC pattern.</div><div class="learn-p"><b>AlexNet (2012):</b> Won ImageNet with 8 layers. First to use ReLU activation, dropout, data augmentation, and GPU training. ~60M parameters. Sparked the deep learning revolution.</div><div class="learn-p"><b>VGGNet (2014):</b> Showed that depth matters. Used only 3x3 convolutions stacked deeply (16 or 19 layers). Key insight: two 3x3 convolutions have the same receptive field as one 5x5 but with fewer parameters and more non-linearity. ~138M parameters.</div><div class="learn-p"><b>GoogLeNet/Inception (2014):</b> Introduced the <b>Inception module</b> -- parallel convolutions with different kernel sizes (1x1, 3x3, 5x5) concatenated together. Uses 1x1 convolutions for dimensionality reduction. 22 layers but only ~5M parameters (efficient).</div><div class="learn-p"><b>ResNet (2015):</b> Introduced <b>skip connections (residual connections)</b>: output = F(x) + x. This allows training very deep networks (50, 101, 152 layers) by solving the vanishing gradient problem. The key insight: it is easier to learn a residual mapping F(x) = H(x) - x than the full mapping H(x) directly.</div><div class="learn-warn">ResNet\'s skip connections are arguably the most important architectural innovation in deep learning. They appear in virtually every modern architecture (transformers, U-Nets, etc.).</div></div><div class="learn-section"><div class="learn-h">Modern CNN Architectures</div><div class="learn-p"><b>DenseNet (2017):</b> Each layer receives feature maps from ALL previous layers (dense connections). Encourages feature reuse and reduces parameter count. Concatenation instead of addition.</div><div class="learn-p"><b>MobileNet (2017):</b> Uses <b>depthwise separable convolutions</b> to drastically reduce computation. A standard convolution is factored into a depthwise convolution (one filter per channel) followed by a 1x1 pointwise convolution. Reduces computation by ~8-9x for 3x3 kernels.</div><div class="learn-p"><b>EfficientNet (2019):</b> Uses <b>compound scaling</b> -- uniformly scales depth, width, and resolution with fixed ratios. Achieves better accuracy-efficiency tradeoff than previous models. EfficientNet-B7 achieves 84.3% top-1 on ImageNet.</div><div class="learn-table"><table><tr><th>Model</th><th>Year</th><th>Depth</th><th>Parameters</th><th>Top-1 Acc (ImageNet)</th></tr><tr><td>AlexNet</td><td>2012</td><td>8</td><td>60M</td><td>63.3%</td></tr><tr><td>VGG-16</td><td>2014</td><td>16</td><td>138M</td><td>74.4%</td></tr><tr><td>GoogLeNet</td><td>2014</td><td>22</td><td>5M</td><td>74.8%</td></tr><tr><td>ResNet-50</td><td>2015</td><td>50</td><td>25M</td><td>76.0%</td></tr><tr><td>EfficientNet-B0</td><td>2019</td><td>--</td><td>5.3M</td><td>77.1%</td></tr></table></div><div class="learn-tip">For interviews: be prepared to explain ResNet skip connections, why 1x1 convolutions are useful (dimensionality reduction, cross-channel interaction), and how to calculate the receptive field and parameter count of a CNN architecture.</div></div><div class="learn-section"><div class="learn-h">Transfer Learning</div><div class="learn-p"><b>Transfer learning</b> uses a model pre-trained on a large dataset (typically ImageNet) and adapts it to a new task. This is the standard approach when you have limited data. Two main strategies:</div><div class="learn-list"><ul><li><b>Feature Extraction:</b> Freeze all convolutional layers, replace and train only the final classifier head. Use when your dataset is small and similar to ImageNet.</li><li><b>Fine-Tuning:</b> Unfreeze some or all layers and train with a small learning rate. Use when your dataset is larger or differs significantly from ImageNet. Start by fine-tuning only the top layers, then gradually unfreeze more.</li></ul></div><div class="learn-p">Common practice: use a pre-trained backbone (ResNet-50, EfficientNet), replace the classification head, fine-tune with a learning rate 10-100x smaller than training from scratch, and use a learning rate warmup for the first epoch.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you calculate the output size of a convolutional layer?</b><br>A: Output = floor((Input - Kernel + 2*Padding) / Stride) + 1. For example: 224x224 input, 3x3 kernel, padding=1, stride=2 gives (224-3+2)/2 + 1 = 112x112. Parameters per conv layer = (kernel_h * kernel_w * in_channels + 1) * out_channels (the +1 is for bias per filter).</p><p class="learn-p"><b>Q2: What problem do ResNet skip connections solve?</b><br>A: Skip connections allow gradients to flow directly through identity shortcuts, bypassing layers. This solves the degradation problem: very deep networks without skip connections have higher training error than shallower ones (not just overfitting — the optimization itself fails). The residual formulation H(x) = F(x) + x is easier to optimize because the network only needs to learn the residual F(x).</p><p class="learn-p"><b>Q3: Explain depthwise separable convolutions and why they matter.</b><br>A: Standard convolution: one kernel convolves across all input channels simultaneously — cost O(K²*C_in*C_out). Depthwise separable: (1) depthwise — one filter per input channel, (2) pointwise — 1x1 conv to mix channels. Cost: O(K²*C_in + C_in*C_out). Reduction factor ~K² (8-9x for 3x3). Used in MobileNet for efficient inference on mobile devices.</p></div>',
          code: `# Convolutional Neural Networks with PyTorch
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

# ===== BASIC CNN ARCHITECTURE =====
class SimpleCNN(nn.Module):
    """LeNet-style CNN for MNIST/CIFAR"""
    def __init__(self, num_classes=10):
        super().__init__()
        # Conv Block 1: 1x28x28 -> 32x14x14
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        # Conv Block 2: 32x14x14 -> 64x7x7
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        # Classifier
        self.pool = nn.MaxPool2d(2, 2)
        self.dropout = nn.Dropout(0.25)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.pool(F.relu(self.bn1(self.conv1(x))))  # 28->14
        x = self.pool(F.relu(self.bn2(self.conv2(x))))  # 14->7
        x = x.view(x.size(0), -1)  # Flatten
        x = self.dropout(F.relu(self.fc1(x)))
        return self.fc2(x)

# ===== RESIDUAL BLOCK (ResNet) =====
class ResidualBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_ch, out_ch, 3,
                               stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_ch)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3,
                               padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_ch)
        # Skip connection with optional downsampling
        self.shortcut = nn.Sequential()
        if stride != 1 or in_ch != out_ch:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_ch, out_ch, 1, stride=stride, bias=False),
                nn.BatchNorm2d(out_ch)
            )

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)  # Skip connection!
        return F.relu(out)

class MiniResNet(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.conv1 = nn.Sequential(
            nn.Conv2d(3, 64, 3, padding=1, bias=False),
            nn.BatchNorm2d(64), nn.ReLU()
        )
        self.layer1 = self._make_layer(64, 64, 2, stride=1)
        self.layer2 = self._make_layer(64, 128, 2, stride=2)
        self.layer3 = self._make_layer(128, 256, 2, stride=2)
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(256, num_classes)

    def _make_layer(self, in_ch, out_ch, n_blocks, stride):
        layers = [ResidualBlock(in_ch, out_ch, stride)]
        for _ in range(1, n_blocks):
            layers.append(ResidualBlock(out_ch, out_ch))
        return nn.Sequential(*layers)

    def forward(self, x):
        x = self.conv1(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.avgpool(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)

# ===== DEPTHWISE SEPARABLE CONVOLUTION (MobileNet) =====
class DepthwiseSeparableConv(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        self.depthwise = nn.Conv2d(in_ch, in_ch, 3, stride=stride,
                                    padding=1, groups=in_ch, bias=False)
        self.pointwise = nn.Conv2d(in_ch, out_ch, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(in_ch)
        self.bn2 = nn.BatchNorm2d(out_ch)

    def forward(self, x):
        x = F.relu(self.bn1(self.depthwise(x)))
        x = F.relu(self.bn2(self.pointwise(x)))
        return x

# ===== Parameter Count & Output Size Calculator =====
def count_params(model):
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters()
                    if p.requires_grad)
    return total, trainable

def conv_output_size(in_size, kernel, padding=0, stride=1):
    return (in_size - kernel + 2 * padding) // stride + 1

# Demo
cnn = SimpleCNN()
resnet = MiniResNet()
total, trainable = count_params(cnn)
print(f"SimpleCNN:   {total:>10,} params")
total, trainable = count_params(resnet)
print(f"MiniResNet:  {total:>10,} params")

# Output size calculations
print(f"\\nConv output sizes:")
print(f"  32x32, k=3, p=1, s=1 -> {conv_output_size(32,3,1,1)}")
print(f"  32x32, k=5, p=0, s=2 -> {conv_output_size(32,5,0,2)}")
print(f"  224x224, k=7, p=3, s=2 -> {conv_output_size(224,7,3,2)}")

# ===== Transfer Learning Pattern =====
# from torchvision import models
# resnet50 = models.resnet50(pretrained=True)
# # Freeze all layers
# for param in resnet50.parameters():
#     param.requires_grad = False
# # Replace classifier head
# resnet50.fc = nn.Linear(2048, num_classes)
# # Only train the new FC layer
# optimizer = optim.Adam(resnet50.fc.parameters(), lr=1e-3)

# Verify with dummy forward pass
x_dummy = torch.randn(2, 1, 28, 28)
print(f"\\nSimpleCNN output shape: {cnn(x_dummy).shape}")
x_dummy3 = torch.randn(2, 3, 32, 32)
print(f"MiniResNet output shape: {resnet(x_dummy3).shape}")`,
          problems: [
            ['CNN Architecture Basics (GFG)', 'https://www.geeksforgeeks.org/introduction-convolution-neural-network/', 'Easy'],
            ['Digit Recognizer (Kaggle)', 'https://www.kaggle.com/c/digit-recognizer', 'Medium'],
            ['ResNet Paper Implementation', 'https://www.geeksforgeeks.org/residual-networks-resnet-deep-learning/', 'Hard'],
            ['Dogs vs Cats (Kaggle)', 'https://www.kaggle.com/c/dogs-vs-cats', 'Medium']
          ],
          mcqs: [
            {q: 'What is the output size of a convolution with input 64x64, kernel 3x3, padding 1, stride 2?', o: ['64x64', '32x32', '31x31', '33x33'], a: 1},
            {q: 'What problem do ResNet skip connections primarily solve?', o: ['Overfitting', 'Vanishing gradients in very deep networks', 'Slow inference speed', 'Large memory usage'], a: 1},
            {q: 'Depthwise separable convolutions (MobileNet) reduce computation by approximately what factor for 3x3 kernels?', o: ['2x', '5x', '8-9x', '20x'], a: 2}
          ]
        }
      ]
    },

    {
      id: 'seq', t: 'Sequence Models',
      topics: [
        {
          t: 'RNNs, LSTMs & GRUs',
          learn: '<div class="learn-section"><div class="learn-h">Why Sequence Models?</div><p class="learn-p">Traditional feedforward neural networks treat each input independently — they have no concept of <strong>order</strong> or <strong>temporal dependency</strong>. But many real-world problems are inherently sequential: natural language, time-series data, audio signals, and DNA sequences all depend on context from previous elements. <strong>Recurrent Neural Networks (RNNs)</strong> were designed specifically to handle such sequential data by maintaining a hidden state that acts as a form of memory.</p><p class="learn-p">The key idea behind an RNN is simple: at each time step t, the network takes the current input x_t and the previous hidden state h_{t-1}, and produces a new hidden state h_t and optionally an output y_t. This recurrence relation allows information to persist across time steps.</p><pre class="learn-code">h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b_h)\ny_t = W_hy * h_t + b_y</pre><p class="learn-p">RNNs can be used in several configurations: <strong>one-to-one</strong> (standard NN), <strong>one-to-many</strong> (image captioning), <strong>many-to-one</strong> (sentiment analysis), <strong>many-to-many</strong> (machine translation, named entity recognition).</p></div><div class="learn-section"><div class="learn-h">The Vanishing &amp; Exploding Gradient Problem</div><p class="learn-p">Vanilla RNNs struggle to learn long-range dependencies. During backpropagation through time (BPTT), gradients are multiplied repeatedly by the weight matrix W_hh. If the largest eigenvalue of W_hh is &lt; 1, gradients <strong>vanish</strong> exponentially — the network forgets distant past. If &gt; 1, gradients <strong>explode</strong>, causing numerical instability.</p><div class="learn-tip">Gradient clipping (capping gradient norms to a threshold) mitigates exploding gradients, but vanishing gradients require architectural solutions like LSTMs and GRUs.</div><p class="learn-p">Consider a sentence: "The cat, which sat on the mat near the window overlooking the garden, <strong>was</strong> sleeping." The verb "was" depends on "cat" many tokens earlier. A vanilla RNN would lose this dependency because the gradient signal decays across those intervening words.</p></div><div class="learn-section"><div class="learn-h">Long Short-Term Memory (LSTM)</div><p class="learn-p">LSTMs, introduced by Hochreiter &amp; Schmidhuber (1997), solve the vanishing gradient problem by introducing a <strong>cell state</strong> — an information highway that runs through the entire chain with only minor linear interactions. Three gates control the flow of information:</p><ul class="learn-list"><li><strong>Forget Gate (f_t):</strong> Decides what information to discard from the cell state. f_t = σ(W_f · [h_{t-1}, x_t] + b_f)</li><li><strong>Input Gate (i_t):</strong> Decides which new values to store. i_t = σ(W_i · [h_{t-1}, x_t] + b_i), and a candidate cell state C̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)</li><li><strong>Output Gate (o_t):</strong> Decides what to output based on the cell state. o_t = σ(W_o · [h_{t-1}, x_t] + b_o)</li></ul><pre class="learn-code">C_t = f_t * C_{t-1} + i_t * C̃_t    # Cell state update\nh_t = o_t * tanh(C_t)                # Hidden state output</pre><p class="learn-p">The cell state update is <strong>additive</strong> (not multiplicative), which creates a gradient highway — gradients can flow unchanged through the cell state, allowing the network to remember information over hundreds of time steps.</p></div><div class="learn-section"><div class="learn-h">Gated Recurrent Unit (GRU)</div><p class="learn-p">GRUs (Cho et al., 2014) simplify the LSTM by merging the cell state and hidden state into a single hidden state, and using only two gates:</p><ul class="learn-list"><li><strong>Reset Gate (r_t):</strong> Controls how much past information to forget. r_t = σ(W_r · [h_{t-1}, x_t])</li><li><strong>Update Gate (z_t):</strong> Controls the balance between previous hidden state and new candidate. z_t = σ(W_z · [h_{t-1}, x_t])</li></ul><pre class="learn-code">h̃_t = tanh(W · [r_t * h_{t-1}, x_t])   # Candidate hidden state\nh_t = (1 - z_t) * h_{t-1} + z_t * h̃_t  # Final hidden state</pre><table class="learn-table"><tr><th>Feature</th><th>LSTM</th><th>GRU</th></tr><tr><td>Gates</td><td>3 (forget, input, output)</td><td>2 (reset, update)</td></tr><tr><td>States</td><td>Cell state + hidden state</td><td>Hidden state only</td></tr><tr><td>Parameters</td><td>More (slower training)</td><td>Fewer (faster training)</td></tr><tr><td>Long sequences</td><td>Generally better</td><td>Comparable, sometimes better on smaller data</td></tr></table></div><div class="learn-section"><div class="learn-h">Bidirectional &amp; Stacked RNNs</div><p class="learn-p"><strong>Bidirectional RNNs</strong> process sequences in both forward and backward directions, concatenating hidden states from both passes. This is critical for tasks like NER where context from both sides matters: "He went to the <strong>bank</strong> of the river" vs "He deposited money in the <strong>bank</strong>."</p><p class="learn-p"><strong>Stacked (Deep) RNNs</strong> layer multiple RNN/LSTM/GRU layers vertically — lower layers capture local patterns while higher layers capture abstract, longer-range features. Typically 2-4 layers provide the best results; deeper stacks often require residual connections.</p><div class="learn-complexity"><strong>Complexity:</strong> For a single LSTM layer with hidden size h and sequence length T — Time: O(T × h²), Space: O(T × h) for storing all hidden states (needed for BPTT).</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why do vanilla RNNs struggle with long sequences?</b><br>A: The vanishing gradient problem: during backpropagation through time (BPTT), gradients are multiplied by the same weight matrix at each time step. If the largest eigenvalue is < 1, gradients shrink exponentially; if > 1, they explode. After ~10-20 steps, the gradient signal from early tokens effectively disappears, making it impossible to learn long-range dependencies.</p><p class="learn-p"><b>Q2: How does LSTM solve the vanishing gradient problem?</b><br>A: LSTM introduces a cell state with additive updates (not multiplicative like RNN). The forget gate controls what to remove, input gate controls what to add, and output gate controls what to expose. The cell state acts as a highway — gradients flow through addition rather than repeated multiplication, preserving signal over hundreds of time steps.</p><p class="learn-p"><b>Q3: When would you use a GRU instead of an LSTM?</b><br>A: GRU has 2 gates (reset, update) vs LSTM\'s 3 (forget, input, output), so it has fewer parameters and trains faster. Use GRU when: dataset is small (fewer params = less overfitting), sequence lengths are moderate, or training speed matters. LSTM when: sequences are very long (more expressive gating), dataset is large, or you need fine-grained control over memory. In practice, performance is often similar.</p></div>',
          code: `import torch
import torch.nn as nn

# --- Vanilla RNN from scratch ---
class SimpleRNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.hidden_size = hidden_size
        self.i2h = nn.Linear(input_size + hidden_size, hidden_size)
        self.h2o = nn.Linear(hidden_size, output_size)
        self.tanh = nn.Tanh()

    def forward(self, x, h_prev):
        combined = torch.cat([x, h_prev], dim=1)
        h_new = self.tanh(self.i2h(combined))
        output = self.h2o(h_new)
        return output, h_new

# --- LSTM for Sentiment Classification ---
class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim,
                 n_layers=2, bidirectional=True, dropout=0.3):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers=n_layers,
                            bidirectional=bidirectional, dropout=dropout,
                            batch_first=True)
        direction_factor = 2 if bidirectional else 1
        self.fc = nn.Linear(hidden_dim * direction_factor, output_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, text, text_lengths):
        embedded = self.dropout(self.embedding(text))
        packed = nn.utils.rnn.pack_padded_sequence(
            embedded, text_lengths.cpu(), batch_first=True, enforce_sorted=False
        )
        packed_output, (hidden, cell) = self.lstm(packed)
        # Concatenate final forward and backward hidden states
        hidden = torch.cat([hidden[-2], hidden[-1]], dim=1)
        return self.fc(self.dropout(hidden))

# --- GRU for Time-Series Forecasting ---
class TimeSeriesGRU(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=64, n_layers=2, output_dim=1):
        super().__init__()
        self.gru = nn.GRU(input_dim, hidden_dim, n_layers,
                          batch_first=True, dropout=0.2)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        # x shape: (batch, seq_len, input_dim)
        gru_out, h_n = self.gru(x)
        # Use last time step output for prediction
        last_output = gru_out[:, -1, :]
        return self.fc(last_output)

# --- Training Loop Example ---
model = SentimentLSTM(vocab_size=25000, embed_dim=100,
                      hidden_dim=256, output_dim=1)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.BCEWithLogitsLoss()

# Simulated training step
dummy_text = torch.randint(0, 25000, (32, 50))  # batch=32, seq=50
dummy_lengths = torch.randint(10, 50, (32,))
dummy_labels = torch.randint(0, 2, (32,)).float()

model.train()
predictions = model(dummy_text, dummy_lengths).squeeze(1)
loss = criterion(predictions, dummy_labels)
loss.backward()
# Gradient clipping to prevent exploding gradients
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
optimizer.step()
print(f"Loss: {loss.item():.4f}")`,
          problems: [
            ['Implement a Simple RNN Cell', 'https://www.geeksforgeeks.org/introduction-to-recurrent-neural-network/', 'Medium'],
            ['LSTM for Text Classification', 'https://www.geeksforgeeks.org/deep-learning-introduction-to-long-short-term-memory/', 'Medium'],
            ['Time Series Prediction with GRU', 'https://www.geeksforgeeks.org/gated-recurrent-unit-networks/', 'Hard']
          ],
          mcqs: [
            {q: 'What is the primary problem that LSTMs solve over vanilla RNNs?', o: ['Overfitting on large datasets', 'Vanishing gradient problem', 'Slow inference speed', 'High memory usage'], a: 1},
            {q: 'How many gates does a GRU have?', o: ['1 (update)', '2 (reset and update)', '3 (forget, input, output)', '4 (reset, update, input, output)'], a: 1},
            {q: 'In an LSTM, the cell state update is primarily:', o: ['Multiplicative only', 'Additive, creating a gradient highway', 'Based on softmax attention', 'Computed using convolutions'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'nlp', t: 'NLP',
      topics: [
        {
          t: 'Text Preprocessing & Word Embeddings (TF-IDF, Word2Vec, GloVe)',
          learn: '<div class="learn-section"><div class="learn-h">Text Preprocessing Pipeline</div><p class="learn-p">Raw text is messy — it contains punctuation, mixed casing, HTML tags, special characters, and inconsistent formatting. Before any NLP model can work with text, we must transform it into a clean, structured representation. A standard preprocessing pipeline includes:</p><ul class="learn-list"><li><strong>Lowercasing:</strong> Converts all text to lowercase to reduce vocabulary size ("The" and "the" become the same token).</li><li><strong>Tokenization:</strong> Splitting text into individual tokens (words, subwords, or characters). Word-level: "I love NLP" → ["I", "love", "NLP"]. Subword (BPE): "unhappiness" → ["un", "happi", "ness"].</li><li><strong>Stop Word Removal:</strong> Removing common words like "the", "is", "at" that carry little semantic meaning. Be cautious — in sentiment analysis, "not" is crucial but is often a stop word.</li><li><strong>Stemming &amp; Lemmatization:</strong> Stemming chops words to their root form (running → run, better → better). Lemmatization uses vocabulary and morphological analysis (better → good, ran → run). Lemmatization is more accurate but slower.</li><li><strong>Special handling:</strong> Removing HTML tags, URLs, email addresses, expanding contractions ("don\'t" → "do not"), handling emojis and unicode.</li></ul></div><div class="learn-section"><div class="learn-h">Bag of Words &amp; TF-IDF</div><p class="learn-p">The simplest text representation is the <strong>Bag of Words (BoW)</strong> model: create a vocabulary of all unique words, then represent each document as a vector of word counts. This ignores word order entirely — "dog bites man" and "man bites dog" have the same BoW representation.</p><p class="learn-p"><strong>TF-IDF (Term Frequency–Inverse Document Frequency)</strong> improves on BoW by weighing terms based on their importance. Words that appear frequently in one document but rarely across the corpus are given higher weight.</p><pre class="learn-code">TF(t, d) = count(t in d) / total_terms_in_d\nIDF(t, D) = log(N / (1 + df(t)))     # N = total docs, df = docs containing t\nTF-IDF(t, d, D) = TF(t, d) × IDF(t, D)</pre><p class="learn-p">TF-IDF gives low weight to common words (high document frequency → low IDF) and high weight to rare, discriminative words. It remains a strong baseline for information retrieval and document classification.</p><div class="learn-warn">BoW and TF-IDF create <strong>sparse, high-dimensional</strong> vectors (dimension = vocabulary size, often 50K+). They capture no semantic similarity — "happy" and "joyful" are as different as "happy" and "refrigerator".</div></div><div class="learn-section"><div class="learn-h">Word2Vec: Learning Dense Embeddings</div><p class="learn-p"><strong>Word2Vec</strong> (Mikolov et al., 2013) learns dense, low-dimensional vectors (typically 100-300 dims) that capture semantic relationships. Words that appear in similar contexts get similar vectors. It comes in two architectures:</p><ul class="learn-list"><li><strong>CBOW (Continuous Bag of Words):</strong> Predicts the target word from its surrounding context words. Faster to train, works well on frequent words.</li><li><strong>Skip-gram:</strong> Predicts context words from the target word. Works better for rare words and small datasets.</li></ul><p class="learn-p">The magic of Word2Vec is that arithmetic on vectors captures semantic relationships:</p><pre class="learn-code">vector("king") - vector("man") + vector("woman") ≈ vector("queen")\nvector("Paris") - vector("France") + vector("Italy") ≈ vector("Rome")</pre><p class="learn-p">Training uses <strong>negative sampling</strong>: instead of computing softmax over the entire vocabulary (expensive), the model samples a small number of random "negative" words and trains a binary classifier to distinguish real context words from noise.</p></div><div class="learn-section"><div class="learn-h">GloVe: Global Vectors for Word Representation</div><p class="learn-p"><strong>GloVe</strong> (Pennington et al., 2014) combines the best of two worlds: the global matrix factorization approach (like LSA) and the local context window approach (like Word2Vec). It builds a <strong>co-occurrence matrix</strong> X where X_ij counts how often word i appears in the context of word j across the entire corpus.</p><p class="learn-p">The objective function ensures that the dot product of two word vectors approximates the log of their co-occurrence probability:</p><pre class="learn-code">w_i · w_j + b_i + b_j = log(X_ij)\n\nObjective: J = Σ f(X_ij)(w_i · w_j + b_i + b_j - log X_ij)²\n\nf(x) = (x/x_max)^α if x &lt; x_max, else 1  # Weighting function</pre><p class="learn-p">The weighting function f(x) prevents very common co-occurrences (like "the the") from dominating the objective.</p><table class="learn-table"><tr><th>Feature</th><th>Word2Vec</th><th>GloVe</th></tr><tr><td>Training</td><td>Predictive (local context windows)</td><td>Count-based (global co-occurrence matrix)</td></tr><tr><td>Scalability</td><td>Streams through corpus</td><td>Requires full co-occurrence matrix in memory</td></tr><tr><td>Performance</td><td>Strong on analogy tasks</td><td>Strong on word similarity tasks</td></tr><tr><td>Key advantage</td><td>Online learning possible</td><td>Leverages global statistics</td></tr></table></div><div class="learn-section"><div class="learn-h">Beyond Static Embeddings</div><p class="learn-p">Word2Vec and GloVe produce <strong>static embeddings</strong> — each word gets exactly one vector regardless of context. The word "bank" has the same embedding whether it means a river bank or a financial institution. This limitation led to <strong>contextualized embeddings</strong> from models like ELMo, BERT, and GPT, where a word\'s representation depends on its surrounding sentence.</p><div class="learn-tip">Pre-trained embeddings (Word2Vec on Google News, GloVe on Wikipedia) are still valuable as initialization for downstream tasks, especially when you have limited labeled data. Use them as the embedding layer in your neural network and optionally fine-tune.</div><div class="learn-complexity"><strong>Complexity:</strong> Word2Vec Skip-gram training: O(K × D) per sample with negative sampling (K = number of negative samples, typically 5-20; D = embedding dim). TF-IDF vectorization: O(N × V) where N = documents, V = vocabulary size.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare TF-IDF, Word2Vec, and BERT embeddings.</b><br>A: TF-IDF: sparse, high-dimensional, no semantics — word importance based on frequency statistics. Word2Vec/GloVe: dense, low-dimensional, captures semantic similarity — but static (one vector per word regardless of context). BERT: contextualized — the same word gets different vectors in different sentences. For retrieval: TF-IDF is a strong baseline. For understanding: contextual embeddings.</p><p class="learn-p"><b>Q2: What is the difference between CBOW and Skip-gram?</b><br>A: CBOW predicts the target word from surrounding context (faster, better for frequent words). Skip-gram predicts context words from the target (slower, better for rare words and small datasets). Both use sliding windows over text. Skip-gram with negative sampling is the most widely used configuration.</p></div>',
          code: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import gensim.downloader as api
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

# --- Text Preprocessing Pipeline ---
def preprocess_text(text):
    """Complete text preprocessing pipeline."""
    # Lowercase
    text = text.lower()
    # Tokenize
    tokens = word_tokenize(text)
    # Remove punctuation and non-alphabetic tokens
    tokens = [t for t in tokens if t.isalpha()]
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [t for t in tokens if t not in stop_words]
    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    return tokens

# --- TF-IDF Vectorization ---
corpus = [
    "Natural language processing enables machines to understand text",
    "Deep learning has revolutionized natural language understanding",
    "Word embeddings capture semantic relationships between words",
    "TF-IDF weighs terms by their importance in a document"
]

vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
tfidf_matrix = vectorizer.fit_transform(corpus)
print("TF-IDF shape:", tfidf_matrix.shape)
print("Feature names:", vectorizer.get_feature_names_out()[:10])

# Document similarity using TF-IDF
sim_matrix = cosine_similarity(tfidf_matrix)
print("\\nDocument similarity matrix:\\n", np.round(sim_matrix, 3))

# --- Word2Vec with Gensim ---
# Load pre-trained Word2Vec (Google News, 300-dim)
w2v_model = api.load("word2vec-google-news-300")

# Word analogies: king - man + woman = ?
result = w2v_model.most_similar(
    positive=['king', 'woman'], negative=['man'], topn=3
)
print("\\nking - man + woman =", result)

# Word similarity
print("Similarity (happy, joyful):",
      w2v_model.similarity('happy', 'joyful'))
print("Similarity (happy, sad):",
      w2v_model.similarity('happy', 'sad'))

# --- GloVe Embeddings (via gensim) ---
glove_model = api.load("glove-wiki-gigaword-100")  # 100-dim GloVe
print("\\nGloVe: words similar to 'python':")
print(glove_model.most_similar('python', topn=5))

# --- Building Embedding Layer for PyTorch ---
import torch
import torch.nn as nn

def create_embedding_matrix(word_index, w2v_model, embed_dim=300):
    """Create embedding matrix from pre-trained Word2Vec."""
    vocab_size = len(word_index) + 1
    embedding_matrix = np.zeros((vocab_size, embed_dim))
    found, missed = 0, 0
    for word, idx in word_index.items():
        if word in w2v_model:
            embedding_matrix[idx] = w2v_model[word]
            found += 1
        else:
            embedding_matrix[idx] = np.random.normal(0, 0.1, embed_dim)
            missed += 1
    print(f"Found {found}/{found+missed} words in pre-trained embeddings")
    return torch.FloatTensor(embedding_matrix)

# Usage with PyTorch
sample_word_index = {'the': 1, 'cat': 2, 'sat': 3, 'on': 4, 'mat': 5}
emb_matrix = create_embedding_matrix(sample_word_index, w2v_model)
embedding_layer = nn.Embedding.from_pretrained(emb_matrix, freeze=False)
print("Embedding layer:", embedding_layer)`,
          problems: [
            ['Text Preprocessing Pipeline', 'https://www.geeksforgeeks.org/text-preprocessing-in-python-set-1/', 'Easy'],
            ['TF-IDF Document Similarity', 'https://www.geeksforgeeks.org/understanding-tf-idf-term-frequency-inverse-document-frequency/', 'Medium'],
            ['Word2Vec Word Analogies', 'https://www.geeksforgeeks.org/python-word-embedding-using-word2vec/', 'Medium']
          ],
          mcqs: [
            {q: 'What does the IDF component in TF-IDF measure?', o: ['How often a term appears in a document', 'How rare a term is across the entire corpus', 'The position of a term in a document', 'The semantic meaning of a term'], a: 1},
            {q: 'Which Word2Vec architecture predicts context words from a target word?', o: ['CBOW', 'Skip-gram', 'GloVe', 'FastText'], a: 1},
            {q: 'What is the main limitation of Word2Vec and GloVe embeddings?', o: ['They require GPUs to generate', 'They produce static embeddings — same vector regardless of context', 'They only work for English text', 'They cannot capture word analogies'], a: 1}
          ]
        },
        {
          t: 'Attention Mechanism',
          learn: '<div class="learn-section"><div class="learn-h">The Bottleneck Problem in Seq2Seq</div><p class="learn-p">The encoder-decoder (Seq2Seq) architecture for machine translation encodes an entire source sentence into a single fixed-length context vector, then decodes it into the target sentence. This works reasonably for short sentences, but creates a severe <strong>information bottleneck</strong> for longer sequences — all information must be compressed into one vector, regardless of sentence length.</p><p class="learn-p">The Seq2Seq model consists of two RNNs (typically LSTMs): the <strong>encoder</strong> reads the input sequence and produces hidden states h_1, h_2, ..., h_n, then the final hidden state h_n becomes the context vector. The <strong>decoder</strong> uses this single context vector to generate the output sequence one token at a time.</p><pre class="learn-code">Encoder: h_t = LSTM(x_t, h_{t-1})\nContext: c = h_n  (final encoder hidden state)\nDecoder: s_t = LSTM(y_{t-1}, s_{t-1}, c)\n\nProblem: c must encode ALL source information → bottleneck!</pre><div class="learn-warn">Performance of vanilla Seq2Seq degrades significantly for sentences longer than ~20 words because the fixed-size context vector cannot retain all relevant information.</div></div><div class="learn-section"><div class="learn-h">Bahdanau Attention (Additive Attention)</div><p class="learn-p"><strong>Attention</strong> (Bahdanau et al., 2015) eliminates the bottleneck by allowing the decoder to look at ALL encoder hidden states at each decoding step, and dynamically focus on the most relevant parts of the input. Instead of a single context vector, attention computes a <strong>different</strong> context vector for each decoder time step.</p><p class="learn-p">At each decoder step t, attention works in three stages:</p><ul class="learn-list"><li><strong>Score:</strong> Compute alignment scores between the current decoder state s_{t-1} and each encoder hidden state h_j. Bahdanau uses an additive score: e_{t,j} = v^T · tanh(W_s · s_{t-1} + W_h · h_j)</li><li><strong>Normalize:</strong> Convert scores to attention weights using softmax: α_{t,j} = softmax(e_{t,j}) = exp(e_{t,j}) / Σ_k exp(e_{t,k})</li><li><strong>Context:</strong> Compute weighted sum of encoder states: c_t = Σ_j α_{t,j} · h_j</li></ul><pre class="learn-code">For decoder step t:\n  e_{t,j} = v^T · tanh(W_s · s_{t-1} + W_h · h_j)   # Score each encoder state\n  α_{t,j} = softmax(e_{t,j})                          # Attention weights\n  c_t = Σ α_{t,j} · h_j                               # Context vector\n  s_t = LSTM(y_{t-1}, s_{t-1}, c_t)                    # Decoder update</pre><p class="learn-p">The attention weights α_{t,j} form an <strong>alignment matrix</strong> — visualizing it reveals which source words the model focuses on when generating each target word. For translation, this often shows a roughly diagonal pattern with interesting deviations for word reordering.</p></div><div class="learn-section"><div class="learn-h">Luong Attention (Multiplicative Attention)</div><p class="learn-p"><strong>Luong attention</strong> (Luong et al., 2015) simplifies the scoring function and uses the current decoder state s_t (not s_{t-1}). It proposes three scoring alternatives:</p><table class="learn-table"><tr><th>Score Function</th><th>Formula</th><th>Notes</th></tr><tr><td>Dot</td><td>e_{t,j} = s_t^T · h_j</td><td>Simplest, no learnable params, requires same dimensions</td></tr><tr><td>General</td><td>e_{t,j} = s_t^T · W_a · h_j</td><td>Learnable weight matrix, allows different dimensions</td></tr><tr><td>Concat</td><td>e_{t,j} = v^T · tanh(W_a · [s_t; h_j])</td><td>Similar to Bahdanau</td></tr></table><p class="learn-p">Dot-product attention is the most efficient and forms the basis for the <strong>Scaled Dot-Product Attention</strong> used in Transformers. The scaling factor 1/√d_k prevents the dot products from growing too large in magnitude, which would push softmax into regions with extremely small gradients.</p><pre class="learn-code">Scaled Dot-Product Attention:\nAttention(Q, K, V) = softmax(Q · K^T / √d_k) · V\n\nWhere d_k = dimension of keys</pre></div><div class="learn-section"><div class="learn-h">Types of Attention</div><ul class="learn-list"><li><strong>Global vs. Local Attention:</strong> Global attention considers all encoder states. Local attention restricts focus to a window of encoder states around a predicted alignment position — faster but may miss distant dependencies.</li><li><strong>Self-Attention:</strong> A sequence attends to itself — each position computes attention weights over all other positions in the same sequence. This is the foundation of Transformers and eliminates the sequential processing constraint of RNNs.</li><li><strong>Cross-Attention:</strong> Queries come from one sequence (e.g., decoder), keys and values from another (e.g., encoder). Used in the decoder of Transformers for attending to encoder output.</li><li><strong>Multi-Head Attention:</strong> Run multiple attention operations in parallel, each with different learned projections. This allows the model to jointly attend to information from different representation subspaces.</li></ul><div class="learn-tip">Attention is not just for NLP! It\'s used in computer vision (visual attention in image captioning), speech recognition, graph neural networks, and even protein structure prediction (AlphaFold).</div></div><div class="learn-section"><div class="learn-h">Why Attention Matters</div><p class="learn-p">Attention was the key insight that led to the Transformer architecture and the modern deep learning revolution in NLP. Its advantages over pure RNN approaches:</p><ul class="learn-list"><li><strong>No bottleneck:</strong> Decoder can directly access any encoder state.</li><li><strong>Interpretability:</strong> Attention weights show what the model "focuses" on.</li><li><strong>Parallelization:</strong> Self-attention can be computed in parallel (unlike RNN sequential processing).</li><li><strong>Long-range dependencies:</strong> Direct connections between any two positions, regardless of distance.</li></ul><div class="learn-complexity"><strong>Complexity:</strong> Self-attention on a sequence of length n with dimension d: Time O(n² × d), Space O(n²). This quadratic cost in sequence length is the main limitation, leading to research on efficient attention variants (Linformer, Performer, Flash Attention).</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What problem does attention solve and how does it work?</b><br>A: Seq2seq models compress the entire input into a fixed-size vector (bottleneck). Attention lets the decoder look at all encoder hidden states, computing a weighted sum where weights reflect relevance. Bahdanau attention: score = v^T * tanh(W[h_dec; h_enc]). Luong attention: score = h_dec^T * W * h_enc (faster). This allows the model to focus on relevant input tokens at each decoding step.</p><p class="learn-p"><b>Q2: What is scaled dot-product attention and why scale by sqrt(d_k)?</b><br>A: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V. Without scaling, for large d_k the dot products grow large in magnitude, pushing softmax into regions with extremely small gradients (near-zero for all but the largest value). Scaling by sqrt(d_k) keeps the variance of dot products at ~1, maintaining useful gradient flow through softmax.</p></div>',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# --- Bahdanau (Additive) Attention ---
class BahdanauAttention(nn.Module):
    def __init__(self, enc_dim, dec_dim, attn_dim):
        super().__init__()
        self.W_enc = nn.Linear(enc_dim, attn_dim, bias=False)
        self.W_dec = nn.Linear(dec_dim, attn_dim, bias=False)
        self.v = nn.Linear(attn_dim, 1, bias=False)

    def forward(self, decoder_state, encoder_outputs):
        # decoder_state: (batch, dec_dim)
        # encoder_outputs: (batch, src_len, enc_dim)
        src_len = encoder_outputs.shape[1]

        # Repeat decoder state for each encoder position
        dec_expanded = decoder_state.unsqueeze(1).repeat(1, src_len, 1)

        # Compute additive attention scores
        energy = torch.tanh(
            self.W_enc(encoder_outputs) + self.W_dec(dec_expanded)
        )
        attention_scores = self.v(energy).squeeze(2)  # (batch, src_len)

        # Normalize to get attention weights
        attention_weights = F.softmax(attention_scores, dim=1)

        # Weighted sum of encoder outputs
        context = torch.bmm(
            attention_weights.unsqueeze(1), encoder_outputs
        ).squeeze(1)
        return context, attention_weights

# --- Scaled Dot-Product Attention (Transformer-style) ---
def scaled_dot_product_attention(query, key, value, mask=None):
    """
    Args:
        query: (batch, n_heads, seq_len, d_k)
        key:   (batch, n_heads, seq_len, d_k)
        value: (batch, n_heads, seq_len, d_v)
        mask:  optional mask for padding or causal attention
    """
    d_k = query.size(-1)
    # Compute attention scores
    scores = torch.matmul(query, key.transpose(-2, -1)) / (d_k ** 0.5)

    # Apply mask (e.g., for padding or causal/autoregressive)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))

    attention_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(attention_weights, value)
    return output, attention_weights

# --- Seq2Seq with Attention ---
class Encoder(nn.Module):
    def __init__(self, vocab_size, emb_dim, hidden_dim, n_layers, dropout):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, emb_dim)
        self.rnn = nn.GRU(emb_dim, hidden_dim, n_layers,
                          bidirectional=True, dropout=dropout, batch_first=True)
        self.fc = nn.Linear(hidden_dim * 2, hidden_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, src):
        embedded = self.dropout(self.embedding(src))
        outputs, hidden = self.rnn(embedded)
        # Combine bidirectional final hidden states
        hidden = torch.tanh(self.fc(
            torch.cat([hidden[-2], hidden[-1]], dim=1)
        ))
        return outputs, hidden.unsqueeze(0)

class AttentionDecoder(nn.Module):
    def __init__(self, vocab_size, emb_dim, enc_dim, dec_dim, attn_dim, dropout):
        super().__init__()
        self.attention = BahdanauAttention(enc_dim, dec_dim, attn_dim)
        self.embedding = nn.Embedding(vocab_size, emb_dim)
        self.rnn = nn.GRU(emb_dim + enc_dim, dec_dim, batch_first=True)
        self.fc_out = nn.Linear(dec_dim + enc_dim + emb_dim, vocab_size)
        self.dropout = nn.Dropout(dropout)

    def forward(self, input_tok, decoder_hidden, encoder_outputs):
        embedded = self.dropout(self.embedding(input_tok))  # (batch, 1, emb)
        context, attn_weights = self.attention(
            decoder_hidden.squeeze(0), encoder_outputs
        )
        rnn_input = torch.cat([embedded.squeeze(1), context], dim=1).unsqueeze(1)
        output, hidden = self.rnn(rnn_input, decoder_hidden)
        prediction = self.fc_out(torch.cat([
            output.squeeze(1), context, embedded.squeeze(1)
        ], dim=1))
        return prediction, hidden, attn_weights

# Demo
batch, src_len, d_k = 2, 10, 64
Q = torch.randn(batch, 4, src_len, d_k)
K = torch.randn(batch, 4, src_len, d_k)
V = torch.randn(batch, 4, src_len, d_k)
out, weights = scaled_dot_product_attention(Q, K, V)
print(f"Attention output: {out.shape}, Weights: {weights.shape}")`,
          problems: [
            ['Implement Bahdanau Attention from Scratch', 'https://www.geeksforgeeks.org/ml-attention-mechanism/', 'Hard'],
            ['Visualize Attention Weights', 'https://www.geeksforgeeks.org/self-attention-in-nlp/', 'Medium'],
            ['Seq2Seq Translation with Attention', 'https://www.geeksforgeeks.org/seq2seq-model-in-machine-learning/', 'Hard']
          ],
          mcqs: [
            {q: 'What problem does attention solve in Seq2Seq models?', o: ['Slow training convergence', 'The information bottleneck of a fixed-size context vector', 'Overfitting on small datasets', 'Inability to handle variable-length inputs'], a: 1},
            {q: 'In scaled dot-product attention, why do we divide by sqrt(d_k)?', o: ['To normalize the output vectors', 'To prevent dot products from growing too large, pushing softmax to saturated regions', 'To reduce computational cost', 'To make the attention weights sum to 1'], a: 1},
            {q: 'What is the time complexity of self-attention with respect to sequence length n?', o: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'], a: 2}
          ]
        }
      ]
    },
    {
      id: 'llm', t: 'Transformers & LLMs',
      topics: [
        {
          t: 'Transformer Architecture (Self-Attention, Multi-Head Attention)',
          learn: '<div class="learn-section"><div class="learn-h">Attention Is All You Need</div><p class="learn-p">The <strong>Transformer</strong> (Vaswani et al., 2017) revolutionized NLP by replacing recurrence entirely with <strong>self-attention</strong>. Unlike RNNs that process tokens sequentially, Transformers process all positions in parallel, enabling massive speedups on modern GPUs and capturing long-range dependencies without the vanishing gradient problem.</p><p class="learn-p">The architecture follows an <strong>encoder-decoder</strong> structure. The encoder maps an input sequence (x_1, ..., x_n) to a sequence of continuous representations z = (z_1, ..., z_n). The decoder then generates an output sequence (y_1, ..., y_m) one token at a time, attending to both the encoder output and previously generated tokens.</p><pre class="learn-code">Transformer Architecture:\n\nInput → [Embedding + Positional Encoding]\n  → Encoder (N× layers):\n      → Multi-Head Self-Attention\n      → Add &amp; Norm (residual connection + LayerNorm)\n      → Feed-Forward Network (FFN)\n      → Add &amp; Norm\n  → Decoder (N× layers):\n      → Masked Multi-Head Self-Attention\n      → Add &amp; Norm\n      → Multi-Head Cross-Attention (over encoder output)\n      → Add &amp; Norm\n      → Feed-Forward Network\n      → Add &amp; Norm\n  → Linear → Softmax → Output Probabilities</pre></div><div class="learn-section"><div class="learn-h">Self-Attention In Depth</div><p class="learn-p">Self-attention allows each token in a sequence to attend to every other token, computing a weighted combination based on relevance. For each input token, we create three vectors by multiplying with learned weight matrices:</p><ul class="learn-list"><li><strong>Query (Q):</strong> "What am I looking for?" — represents the current token\'s information need.</li><li><strong>Key (K):</strong> "What do I contain?" — represents what each token offers.</li><li><strong>Value (V):</strong> "What information do I provide?" — the actual content to be aggregated.</li></ul><pre class="learn-code">Q = X · W_Q    (seq_len × d_k)\nK = X · W_K    (seq_len × d_k)\nV = X · W_V    (seq_len × d_v)\n\nAttention(Q, K, V) = softmax(Q · K^T / √d_k) · V</pre><p class="learn-p">The dot product Q · K^T produces an (n × n) matrix of attention scores — position i attending to position j. After scaling by 1/√d_k and applying softmax, we get attention weights that sum to 1 for each query position. Multiplying by V produces the output: a weighted sum of value vectors.</p><div class="learn-tip">Think of attention as a <strong>soft dictionary lookup</strong>: the query searches for relevant keys, and returns a weighted combination of the corresponding values. Unlike hard lookup (exact key match), soft attention blends multiple values proportionally.</div></div><div class="learn-section"><div class="learn-h">Multi-Head Attention</div><p class="learn-p">A single attention head can only focus on one type of relationship at a time. <strong>Multi-Head Attention</strong> runs h parallel attention operations, each with different learned projections, allowing the model to jointly attend to information from different representation subspaces at different positions.</p><pre class="learn-code">MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · W_O\n\nwhere head_i = Attention(Q · W_Q_i, K · W_K_i, V · W_V_i)\n\nTypical: d_model=512, h=8, d_k=d_v=d_model/h=64</pre><p class="learn-p">Each head projects Q, K, V to a lower dimension (d_model / h), computes attention independently, then all head outputs are concatenated and projected back. Different heads learn different patterns: one might attend to syntactic structure, another to semantic relationships, another to positional proximity.</p></div><div class="learn-section"><div class="learn-h">Positional Encoding &amp; Feed-Forward Networks</div><p class="learn-p">Since self-attention is permutation-invariant (it has no inherent notion of order), <strong>positional encodings</strong> are added to the input embeddings to inject position information. The original Transformer uses sinusoidal functions:</p><pre class="learn-code">PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))\nPE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))</pre><p class="learn-p">This allows the model to attend to relative positions since PE(pos+k) can be expressed as a linear function of PE(pos). Modern models often use <strong>learned positional embeddings</strong> (BERT, GPT) or <strong>rotary positional embeddings (RoPE)</strong> which encode relative positions directly into the attention scores.</p><p class="learn-p">The <strong>Feed-Forward Network (FFN)</strong> in each layer is a two-layer MLP applied independently to each position:</p><pre class="learn-code">FFN(x) = max(0, x · W_1 + b_1) · W_2 + b_2\n\nTypically: d_model=512 → d_ff=2048 → d_model=512</pre><p class="learn-p">The FFN acts as a <strong>key-value memory</strong>: the first layer projects up to a wider dimension (4× typically), applying ReLU to sparsely activate neurons, and the second layer projects back down. Research shows these layers store factual knowledge.</p></div><div class="learn-section"><div class="learn-h">Residual Connections &amp; Layer Normalization</div><p class="learn-p">Every sub-layer (attention, FFN) in the Transformer is wrapped with a <strong>residual connection</strong> followed by <strong>layer normalization</strong>: output = LayerNorm(x + SubLayer(x)). Residual connections ensure gradients flow directly through the network (similar to LSTM\'s cell state highway), enabling training of very deep models (GPT-3 has 96 layers).</p><p class="learn-p">The decoder uses <strong>masked self-attention</strong> to prevent positions from attending to future tokens during training. This is implemented by setting the upper triangle of the attention score matrix to -∞ before softmax, ensuring that position i can only attend to positions ≤ i.</p><div class="learn-complexity"><strong>Complexity:</strong> Self-attention: O(n² × d) time, O(n²) space for the attention matrix. FFN: O(n × d × d_ff). Total per layer: O(n² × d + n × d × d_ff). The n² term makes long sequences expensive — this is why context window limits exist.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain multi-head attention and why multiple heads help.</b><br>A: Multi-head attention runs h parallel attention operations with different learned projections: head_i = Attention(QW_i^Q, KW_i^K, VW_i^V). Outputs are concatenated and projected. Multiple heads allow the model to attend to information from different representation subspaces at different positions — one head might capture syntactic relationships while another captures semantic similarity.</p><p class="learn-p"><b>Q2: Why do Transformers need positional encoding?</b><br>A: Self-attention is permutation-invariant — it treats input as a set, not a sequence. Without positional information, \'dog bites man\' and \'man bites dog\' are identical. Sinusoidal encoding PE(pos, 2i) = sin(pos/10000^(2i/d)) provides unique position signals and can generalize to unseen sequence lengths. Modern models often use learned positional embeddings instead.</p><p class="learn-p"><b>Q3: Walk through the full Transformer encoder block.</b><br>A: Input → (1) Multi-Head Self-Attention: each token attends to all other tokens. (2) Add &amp;amp; Norm: residual connection + layer normalization. (3) Feed-Forward Network: two linear layers with ReLU/GELU activation, applied independently to each position. (4) Add &amp;amp; Norm again. The decoder adds masked self-attention (prevent future peeking) and cross-attention (attend to encoder output).</p></div>',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads, dropout=0.1):
        super().__init__()
        assert d_model % n_heads == 0
        self.d_k = d_model // n_heads
        self.n_heads = n_heads

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)

        # Linear projections and reshape to (batch, n_heads, seq_len, d_k)
        Q = self.W_q(query).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)

        # Scaled dot-product attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        attn_weights = self.dropout(F.softmax(scores, dim=-1))
        attn_output = torch.matmul(attn_weights, V)

        # Concatenate heads and final linear projection
        attn_output = attn_output.transpose(1, 2).contiguous().view(
            batch_size, -1, self.n_heads * self.d_k
        )
        return self.W_o(attn_output), attn_weights

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000, dropout=0.1):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len).unsqueeze(1).float()
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * -(math.log(10000.0) / d_model)
        )
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe.unsqueeze(0))  # (1, max_len, d_model)

    def forward(self, x):
        x = x + self.pe[:, :x.size(1)]
        return self.dropout(x)

class TransformerEncoderLayer(nn.Module):
    def __init__(self, d_model, n_heads, d_ff, dropout=0.1):
        super().__init__()
        self.self_attn = MultiHeadAttention(d_model, n_heads, dropout)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        # Self-attention with residual connection
        attn_out, _ = self.self_attn(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_out))
        # FFN with residual connection
        ffn_out = self.ffn(x)
        x = self.norm2(x + self.dropout(ffn_out))
        return x

class TransformerEncoder(nn.Module):
    def __init__(self, vocab_size, d_model=512, n_heads=8,
                 d_ff=2048, n_layers=6, dropout=0.1):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.pos_encoding = PositionalEncoding(d_model, dropout=dropout)
        self.layers = nn.ModuleList([
            TransformerEncoderLayer(d_model, n_heads, d_ff, dropout)
            for _ in range(n_layers)
        ])
        self.d_model = d_model

    def forward(self, src, mask=None):
        x = self.embedding(src) * math.sqrt(self.d_model)
        x = self.pos_encoding(x)
        for layer in self.layers:
            x = layer(x, mask)
        return x

# Demo
encoder = TransformerEncoder(vocab_size=30000, d_model=512, n_heads=8)
dummy_input = torch.randint(0, 30000, (2, 20))  # batch=2, seq_len=20
output = encoder(dummy_input)
print(f"Encoder output shape: {output.shape}")  # (2, 20, 512)`,
          problems: [
            ['Build a Transformer Encoder from Scratch', 'https://www.geeksforgeeks.org/getting-started-with-transformers/', 'Hard'],
            ['Positional Encoding Visualization', 'https://www.geeksforgeeks.org/positional-encoding-in-transformers/', 'Medium']
          ],
          mcqs: [
            {q: 'What are the three vectors computed for each token in self-attention?', o: ['Input, Hidden, Output', 'Query, Key, Value', 'Embedding, Position, Context', 'Forward, Backward, Combined'], a: 1},
            {q: 'Why is masked self-attention used in the Transformer decoder?', o: ['To reduce computational cost', 'To prevent attending to padding tokens', 'To prevent attending to future tokens during training', 'To focus only on the encoder output'], a: 2},
            {q: 'What is the purpose of the Feed-Forward Network in each Transformer layer?', o: ['To compute attention scores', 'To apply position-wise nonlinear transformation and store factual knowledge', 'To generate the final output probabilities', 'To encode positional information'], a: 1}
          ]
        },
        {
          t: 'BERT, GPT & Modern LLMs',
          learn: '<div class="learn-section"><div class="learn-h">Pre-training Paradigm: The Foundation of Modern NLP</div><p class="learn-p">Before BERT and GPT, NLP models were trained from scratch for each task with task-specific architectures. The <strong>pre-training + fine-tuning</strong> paradigm changed everything: first, train a massive language model on unlabeled text (cheap, abundant), then fine-tune on specific tasks with small labeled datasets. This transfer learning approach mirrors how humans learn — developing general language understanding first, then specializing.</p><p class="learn-p">Two dominant pre-training strategies emerged:</p><ul class="learn-list"><li><strong>Autoregressive (Causal) LM:</strong> Predict the next token given all previous tokens. P(x_t | x_1, ..., x_{t-1}). Used by GPT family. Naturally suited for text generation.</li><li><strong>Masked LM (MLM):</strong> Randomly mask 15% of tokens and predict them from context (both left and right). Used by BERT. Naturally suited for understanding tasks.</li></ul></div><div class="learn-section"><div class="learn-h">BERT: Bidirectional Encoder Representations from Transformers</div><p class="learn-p"><strong>BERT</strong> (Devlin et al., 2019) uses only the Transformer <strong>encoder</strong> stack, trained with two objectives:</p><ul class="learn-list"><li><strong>Masked Language Modeling (MLM):</strong> 15% of input tokens are selected; of those, 80% are replaced with [MASK], 10% with a random token, and 10% kept unchanged. The model predicts the original tokens. This bidirectional context is BERT\'s key advantage.</li><li><strong>Next Sentence Prediction (NSP):</strong> Given two sentences A and B, predict whether B actually follows A in the corpus. This teaches the model to understand sentence relationships (later research showed NSP is less important).</li></ul><pre class="learn-code">BERT Input Format:\n[CLS] Sentence A tokens [SEP] Sentence B tokens [SEP]\n\nBERT-base: 12 layers, 768 hidden, 12 heads, 110M params\nBERT-large: 24 layers, 1024 hidden, 16 heads, 340M params\n\nPre-trained on: BookCorpus (800M words) + English Wikipedia (2500M words)</pre><p class="learn-p">For fine-tuning, BERT uses the [CLS] token\'s representation for classification tasks, or token-level representations for tasks like NER. A simple linear layer on top of BERT achieves state-of-the-art on 11 NLP benchmarks.</p><div class="learn-tip">BERT variants: <strong>RoBERTa</strong> (removes NSP, trains longer, dynamic masking), <strong>ALBERT</strong> (parameter sharing for efficiency), <strong>DistilBERT</strong> (knowledge distillation, 60% smaller, 97% performance), <strong>DeBERTa</strong> (disentangled attention with relative position encoding).</div></div><div class="learn-section"><div class="learn-h">GPT: Generative Pre-trained Transformer</div><p class="learn-p">The <strong>GPT</strong> family (OpenAI) uses only the Transformer <strong>decoder</strong> stack with causal (left-to-right) attention. Each version scaled dramatically:</p><table class="learn-table"><tr><th>Model</th><th>Parameters</th><th>Training Data</th><th>Key Innovation</th></tr><tr><td>GPT-1 (2018)</td><td>117M</td><td>BookCorpus</td><td>Showed pre-training + fine-tuning works</td></tr><tr><td>GPT-2 (2019)</td><td>1.5B</td><td>WebText (40GB)</td><td>Zero-shot task transfer, no fine-tuning needed</td></tr><tr><td>GPT-3 (2020)</td><td>175B</td><td>570GB filtered text</td><td>In-context learning, few-shot prompting</td></tr><tr><td>GPT-4 (2023)</td><td>~1.8T (rumored, MoE)</td><td>~13T tokens</td><td>Multimodal, RLHF alignment</td></tr></table><p class="learn-p">GPT-3 introduced <strong>in-context learning</strong>: by simply providing examples in the prompt (few-shot), the model performs new tasks without any gradient updates. This was unexpected and suggested that sufficiently large language models develop emergent abilities.</p></div><div class="learn-section"><div class="learn-h">Scaling Laws &amp; Emergent Abilities</div><p class="learn-p"><strong>Scaling laws</strong> (Kaplan et al., 2020) revealed that language model performance improves predictably as a power law with model size, dataset size, and compute. The <strong>Chinchilla</strong> paper (Hoffmann et al., 2022) showed that most models were undertrained: the optimal data-to-parameter ratio is roughly 20:1 (20 tokens per parameter).</p><p class="learn-p"><strong>Emergent abilities</strong> appear suddenly at certain scale thresholds: chain-of-thought reasoning, arithmetic, code generation, and multilingual transfer appear in models above ~100B parameters but are absent in smaller ones. This makes predicting the capabilities of larger models difficult.</p></div><div class="learn-section"><div class="learn-h">RLHF &amp; Modern Alignment</div><p class="learn-p">Raw pre-trained LLMs are not aligned with human preferences — they may generate harmful, incorrect, or unhelpful content. <strong>RLHF (Reinforcement Learning from Human Feedback)</strong> aligns models through three steps:</p><ul class="learn-list"><li><strong>Supervised Fine-Tuning (SFT):</strong> Fine-tune on human-written demonstrations of helpful, safe responses.</li><li><strong>Reward Model Training:</strong> Humans rank multiple model outputs; train a reward model to predict these preferences.</li><li><strong>PPO Optimization:</strong> Use Proximal Policy Optimization to fine-tune the LLM to maximize the reward model\'s score while staying close to the SFT model (KL divergence penalty).</li></ul><p class="learn-p">Alternatives to RLHF include <strong>DPO (Direct Preference Optimization)</strong> which skips the reward model entirely by directly optimizing the policy from preference pairs, and <strong>Constitutional AI</strong> which uses AI feedback instead of human feedback.</p><div class="learn-warn">Open-source LLMs like LLaMA (Meta), Mistral, Falcon, and Qwen have closed the gap with proprietary models, enabling local deployment and customization. The ecosystem now includes efficient architectures (Mixture of Experts), quantization (GPTQ, AWQ, GGUF), and inference optimization (vLLM, TGI).</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What are the key differences between BERT and GPT?</b><br>A: BERT: encoder-only, bidirectional (sees full context), trained with Masked Language Model (predict masked tokens) + Next Sentence Prediction. Best for understanding tasks (classification, NER, QA). GPT: decoder-only, autoregressive (left-to-right), trained to predict next token. Best for generation tasks. BERT sees context from both directions; GPT only from the left.</p><p class="learn-p"><b>Q2: What is RLHF and why is it used for LLMs?</b><br>A: Reinforcement Learning from Human Feedback: (1) Supervised fine-tuning on demonstrations. (2) Train a reward model from human preference rankings. (3) Optimize the LLM with PPO against the reward model. RLHF aligns model outputs with human preferences — making responses helpful, harmless, and honest — beyond what supervised training alone achieves.</p><p class="learn-p"><b>Q3: What is the difference between in-context learning and fine-tuning?</b><br>A: In-context learning: provide examples in the prompt at inference time — the model adapts without any parameter updates. Works via the model\'s existing capabilities. Fine-tuning: actually update model weights on new data — permanent changes. In-context is fast and flexible but limited by context length and model capability. Fine-tuning is more powerful but requires compute and risks catastrophic forgetting.</p></div>',
          code: `from transformers import (
    BertTokenizer, BertForSequenceClassification,
    GPT2LMHeadModel, GPT2Tokenizer,
    AutoTokenizer, AutoModelForCausalLM,
    pipeline, Trainer, TrainingArguments
)
import torch

# --- BERT for Sentiment Classification ---
# Load pre-trained BERT
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased', num_labels=2
)

# Tokenize input
text = "This movie was absolutely fantastic and I loved every minute of it!"
inputs = tokenizer(text, return_tensors='pt', padding=True,
                   truncation=True, max_length=512)
print("Token IDs:", inputs['input_ids'].shape)
print("Tokens:", tokenizer.convert_ids_to_tokens(inputs['input_ids'][0][:15]))

# Forward pass
with torch.no_grad():
    outputs = model(**inputs)
    logits = outputs.logits
    probs = torch.softmax(logits, dim=1)
    print(f"Sentiment: {'Positive' if probs[0][1] > 0.5 else 'Negative'}")
    print(f"Confidence: {probs[0].max().item():.4f}")

# --- GPT-2 Text Generation ---
gpt_tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
gpt_model = GPT2LMHeadModel.from_pretrained('gpt2')

prompt = "Artificial intelligence will transform"
input_ids = gpt_tokenizer.encode(prompt, return_tensors='pt')

# Generate with various decoding strategies
output = gpt_model.generate(
    input_ids,
    max_new_tokens=50,
    temperature=0.7,           # Controls randomness
    top_k=50,                  # Top-k sampling
    top_p=0.9,                 # Nucleus sampling
    repetition_penalty=1.2,    # Penalize repetition
    do_sample=True,
    num_return_sequences=1
)
generated_text = gpt_tokenizer.decode(output[0], skip_special_tokens=True)
print(f"\\nGenerated: {generated_text}")

# --- Using HuggingFace Pipelines (simplified API) ---
# Sentiment analysis
classifier = pipeline("sentiment-analysis")
result = classifier("I absolutely love learning about transformers!")
print(f"\\nPipeline result: {result}")

# Zero-shot classification
zero_shot = pipeline("zero-shot-classification")
result = zero_shot(
    "The stock market crashed due to rising inflation",
    candidate_labels=["finance", "sports", "technology", "politics"]
)
print(f"Zero-shot: {result['labels'][0]} ({result['scores'][0]:.3f})")

# Named Entity Recognition
ner = pipeline("ner", grouped_entities=True)
result = ner("Hugging Face is based in New York and was founded by Clement Delangue")
for entity in result:
    print(f"  {entity['word']}: {entity['entity_group']} ({entity['score']:.3f})")

# --- Extract BERT Embeddings for Custom Tasks ---
from transformers import BertModel

bert_model = BertModel.from_pretrained('bert-base-uncased')
inputs = tokenizer("Transformers changed NLP forever",
                   return_tensors='pt', padding=True)

with torch.no_grad():
    outputs = bert_model(**inputs)
    # CLS token embedding (sentence-level representation)
    cls_embedding = outputs.last_hidden_state[:, 0, :]
    # Mean pooling (alternative sentence embedding)
    mean_embedding = outputs.last_hidden_state.mean(dim=1)
    print(f"\\nCLS embedding shape: {cls_embedding.shape}")  # (1, 768)`,
          problems: [
            ['Fine-tune BERT for Text Classification', 'https://www.geeksforgeeks.org/fine-tuning-bert-model-for-sentiment-analysis/', 'Medium']
          ],
          mcqs: [
            {q: 'What is the key architectural difference between BERT and GPT?', o: ['BERT is larger than GPT', 'BERT uses encoder (bidirectional) while GPT uses decoder (causal/left-to-right)', 'BERT uses attention while GPT uses recurrence', 'BERT is for English only while GPT is multilingual'], a: 1},
            {q: 'What is in-context learning in GPT-3?', o: ['Fine-tuning on task-specific data', 'Performing tasks by providing examples in the prompt without gradient updates', 'Training on multiple tasks simultaneously', 'Using reinforcement learning for task adaptation'], a: 1},
            {q: 'What is the purpose of RLHF in modern LLMs?', o: ['To increase model size', 'To align model outputs with human preferences for helpfulness and safety', 'To improve pre-training efficiency', 'To enable multilingual capabilities'], a: 1}
          ]
        },
        {
          t: 'Fine-Tuning & Prompt Engineering',
          learn: '<div class="learn-section"><div class="learn-h">Full Fine-Tuning vs. Parameter-Efficient Methods</div><p class="learn-p"><strong>Full fine-tuning</strong> updates all parameters of a pre-trained model on a downstream task. While effective, it requires storing a separate copy of the entire model for each task (billions of parameters) and risks <strong>catastrophic forgetting</strong> — the model loses its general language understanding while specializing.</p><p class="learn-p"><strong>Parameter-Efficient Fine-Tuning (PEFT)</strong> methods freeze most model parameters and only train a small number of additional or modified parameters, achieving comparable performance with dramatically lower compute and storage.</p><table class="learn-table"><tr><th>Method</th><th>Trainable Params</th><th>Approach</th></tr><tr><td>Full Fine-Tuning</td><td>100%</td><td>Update all weights</td></tr><tr><td>LoRA</td><td>~0.1-1%</td><td>Low-rank decomposition of weight updates</td></tr><tr><td>QLoRA</td><td>~0.1-1%</td><td>LoRA on quantized (4-bit) base model</td></tr><tr><td>Prefix Tuning</td><td>~0.1%</td><td>Prepend learnable vectors to attention keys/values</td></tr><tr><td>Adapters</td><td>~1-5%</td><td>Insert small bottleneck layers between Transformer layers</td></tr></table></div><div class="learn-section"><div class="learn-h">LoRA: Low-Rank Adaptation</div><p class="learn-p"><strong>LoRA</strong> (Hu et al., 2021) is the most popular PEFT method. The key insight: the weight updates ΔW during fine-tuning have low intrinsic rank. Instead of updating the full weight matrix W ∈ R^(d×k), LoRA decomposes the update into two low-rank matrices:</p><pre class="learn-code">W\' = W + ΔW = W + B × A\n\nWhere: W ∈ R^(d×k) is frozen\n       A ∈ R^(r×k), B ∈ R^(d×r), r &lt;&lt; min(d,k)\n       Typically r = 4, 8, or 16\n\nFor d=4096, k=4096, r=8:\n  Full fine-tuning params: 4096 × 4096 = 16.7M\n  LoRA params: (4096 × 8) + (8 × 4096) = 65.5K (0.4%!)</pre><p class="learn-p">LoRA is applied to the attention weight matrices (W_q, W_v typically). At inference time, the LoRA weights can be merged into the base model weights with zero additional latency. Multiple LoRA adapters can share the same base model, enabling efficient multi-task serving.</p><div class="learn-tip"><strong>QLoRA</strong> takes this further by quantizing the base model to 4-bit precision (NormalFloat4) and training LoRA adapters on top. This enables fine-tuning a 65B parameter model on a single 48GB GPU — democratizing LLM customization.</div></div><div class="learn-section"><div class="learn-h">Prompt Engineering Fundamentals</div><p class="learn-p"><strong>Prompt engineering</strong> is the art of crafting inputs to elicit desired outputs from LLMs without any parameter updates. Unlike fine-tuning, prompt engineering uses the model as-is, making it the fastest and cheapest way to customize LLM behavior.</p><ul class="learn-list"><li><strong>Zero-shot:</strong> Give the task instruction directly. "Classify this review as positive or negative: [text]"</li><li><strong>Few-shot:</strong> Provide examples before the task. "Review: Great movie! → Positive. Review: Terrible plot. → Negative. Review: [text] →"</li><li><strong>Chain-of-Thought (CoT):</strong> Add "Let\'s think step by step" or provide reasoning examples. Dramatically improves performance on math, logic, and multi-step reasoning tasks.</li><li><strong>Self-Consistency:</strong> Generate multiple CoT reasoning paths and take the majority vote answer. Reduces variance in reasoning.</li></ul><pre class="learn-code">Zero-shot CoT:\n"Q: If a store has 3 boxes with 5 apples each, and 2 boxes are sold,\nhow many apples remain?\nA: Let\'s think step by step."\n\nFew-shot CoT:\n"Q: Roger has 5 tennis balls. He buys 2 cans of 3 balls each.\nHow many does he have now?\nA: Roger started with 5. 2 cans × 3 balls = 6. Total = 5 + 6 = 11.\n\nQ: [Your question]\nA:"</pre></div><div class="learn-section"><div class="learn-h">Advanced Prompting Techniques</div><ul class="learn-list"><li><strong>System Prompts:</strong> Set the model\'s role, personality, and constraints. "You are an expert Python programmer. Always include error handling and type hints."</li><li><strong>ReAct (Reasoning + Acting):</strong> The model alternates between thinking (reasoning about what to do) and acting (calling tools/APIs). Enables agents that can search the web, run code, query databases.</li><li><strong>Tree of Thoughts (ToT):</strong> Explore multiple reasoning branches, evaluate each, and backtrack if needed. Useful for complex planning and puzzle-solving tasks.</li><li><strong>Retrieval-Augmented Generation (RAG):</strong> Inject relevant external knowledge into the prompt to ground responses in facts and reduce hallucination.</li></ul><div class="learn-warn">Common pitfalls: <strong>Prompt injection</strong> — users craft inputs that override system prompts ("Ignore previous instructions and..."). <strong>Hallucination</strong> — models confidently generate false information. Always validate critical outputs. <strong>Sensitivity to formatting</strong> — small changes in prompt wording can dramatically change output quality.</div></div><div class="learn-section"><div class="learn-h">Evaluation &amp; Best Practices</div><p class="learn-p">Evaluating fine-tuned models and prompts requires both automatic metrics and human evaluation:</p><ul class="learn-list"><li><strong>Automatic:</strong> Perplexity, BLEU, ROUGE, BERTScore for text quality. Task-specific metrics (accuracy, F1) for classification.</li><li><strong>Human evaluation:</strong> Rate outputs for helpfulness, accuracy, harmlessness. Use pairwise comparisons (A vs B) rather than absolute scales.</li><li><strong>LLM-as-judge:</strong> Use a strong LLM (GPT-4) to evaluate weaker model outputs. Surprisingly well-correlated with human judgments for many tasks.</li></ul><div class="learn-complexity"><strong>Compute comparison:</strong> Full fine-tuning of LLaMA-7B: ~80GB VRAM, days of training. QLoRA fine-tuning: ~16GB VRAM, hours. Prompt engineering: zero training compute, milliseconds to iterate.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain LoRA and why it is efficient.</b><br>A: LoRA freezes the base model and adds low-rank decomposition matrices: W\' = W + BA where B ∈ R^(d×r), A ∈ R^(r×k), r << min(d,k). For d=k=4096, r=8: only 65K trainable params vs 16.7M for full fine-tuning (0.4%). At inference, LoRA weights merge into the base model with zero latency overhead. Multiple LoRA adapters can share one base model for multi-task serving.</p><p class="learn-p"><b>Q2: Compare zero-shot, few-shot, and chain-of-thought prompting.</b><br>A: Zero-shot: task instruction only — \'Classify as positive/negative.\' Few-shot: include examples before the query — model mimics the pattern. Chain-of-thought: add \'Let\'s think step by step\' or show reasoning examples — dramatically improves math and logic tasks by forcing intermediate reasoning. Self-consistency extends CoT by sampling multiple reasoning paths and taking majority vote.</p></div>',
          code: `from transformers import (
    AutoModelForCausalLM, AutoTokenizer,
    TrainingArguments, BitsAndBytesConfig
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
from datasets import load_dataset
import torch

# --- LoRA Fine-Tuning Setup ---
model_name = "meta-llama/Llama-2-7b-hf"

# 4-bit quantization config for QLoRA
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True  # Nested quantization
)

# Load quantized model
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# Prepare model for QLoRA training
model = prepare_model_for_kbit_training(model)

# Define LoRA configuration
lora_config = LoraConfig(
    r=16,                     # Rank of the update matrices
    lora_alpha=32,            # Scaling factor (alpha/r)
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# Apply LoRA adapters
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 4,194,304 || all params: 6,742,609,920 || 0.06%

# --- Training with SFTTrainer ---
dataset = load_dataset("databricks/databricks-dolly-15k", split="train[:1000]")

def format_instruction(sample):
    return f"""### Instruction:
{sample['instruction']}

### Context:
{sample.get('context', '')}

### Response:
{sample['response']}"""

training_args = TrainingArguments(
    output_dir="./llama2-qlora",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    weight_decay=0.001,
    warmup_ratio=0.03,
    lr_scheduler_type="cosine",
    logging_steps=10,
    save_strategy="epoch",
    fp16=True,
    optim="paged_adamw_32bit"
)

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    formatting_func=format_instruction,
    max_seq_length=512,
    args=training_args,
    tokenizer=tokenizer
)

# trainer.train()  # Uncomment to start training

# --- Prompt Engineering Examples ---
def zero_shot_classify(text, model, tokenizer):
    prompt = f"""Classify the following text into one of these categories:
[Technology, Sports, Politics, Science, Entertainment]

Text: {text}
Category:"""
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=10, temperature=0.1)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def chain_of_thought(question, model, tokenizer):
    prompt = f"""Answer the following question step by step.

Question: {question}

Let's think step by step:
1."""
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=200, temperature=0.3)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# --- Merging LoRA weights for deployment ---
from peft import PeftModel

base_model = AutoModelForCausalLM.from_pretrained(model_name)
peft_model = PeftModel.from_pretrained(base_model, "./llama2-qlora/checkpoint-best")
merged_model = peft_model.merge_and_unload()
merged_model.save_pretrained("./llama2-merged")
print("LoRA weights merged into base model for efficient inference!")`,
          problems: [
          ],
          mcqs: [
            {q: 'What does LoRA decompose the weight update into?', o: ['Two sparse matrices', 'Two low-rank matrices (B × A) where r << d', 'A diagonal matrix', 'A quantized version of the original weights'], a: 1},
            {q: 'What is Chain-of-Thought prompting?', o: ['Training the model to think faster', 'Providing step-by-step reasoning examples to improve multi-step reasoning', 'Connecting multiple models in a chain', 'Using attention chains for longer context'], a: 1},
            {q: 'What advantage does QLoRA offer over standard LoRA?', o: ['Better model quality', 'Quantizes the base model to 4-bit, dramatically reducing VRAM requirements', 'Faster inference speed', 'Larger rank matrices for better adaptation'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'rag', t: 'RAG Systems',
      topics: [
        {
          t: 'Vector Databases & Embeddings',
          learn: '<div class="learn-section"><div class="learn-h">From Text to Vectors: Embedding Models</div><p class="learn-p">To search and retrieve relevant information for LLMs, we need to convert text into numerical representations that capture semantic meaning. <strong>Embedding models</strong> map text (words, sentences, paragraphs, or documents) into dense vectors in a high-dimensional space where semantically similar texts are close together.</p><p class="learn-p">Modern embedding models are trained using contrastive learning on massive datasets of text pairs. The objective is to maximize similarity between semantically equivalent pairs while minimizing similarity between unrelated pairs.</p><table class="learn-table"><tr><th>Model</th><th>Dimensions</th><th>Max Tokens</th><th>Use Case</th></tr><tr><td>OpenAI text-embedding-3-small</td><td>1536</td><td>8191</td><td>General-purpose, cost-effective</td></tr><tr><td>OpenAI text-embedding-3-large</td><td>3072</td><td>8191</td><td>Highest quality OpenAI embedding</td></tr><tr><td>Sentence-BERT (all-MiniLM-L6-v2)</td><td>384</td><td>256</td><td>Fast, open-source, good quality</td></tr><tr><td>BGE-large-en-v1.5</td><td>1024</td><td>512</td><td>MTEB benchmark leader (open-source)</td></tr><tr><td>Cohere embed-v3</td><td>1024</td><td>512</td><td>Multilingual, search-optimized</td></tr></table><div class="learn-tip">Choose embedding models based on your use case: for cost-sensitive applications, smaller models (384-dim) work surprisingly well. For maximum retrieval quality, use larger models (1024-3072 dim). Always benchmark on YOUR data — MTEB leaderboard rankings don\'t always transfer.</div></div><div class="learn-section"><div class="learn-h">Vector Similarity Metrics</div><p class="learn-p">Once text is embedded, we need metrics to measure similarity between vectors:</p><ul class="learn-list"><li><strong>Cosine Similarity:</strong> cos(A, B) = (A · B) / (||A|| × ||B||). Measures the angle between vectors, ignoring magnitude. Range: [-1, 1]. Most common for text embeddings.</li><li><strong>Euclidean Distance (L2):</strong> d(A, B) = √(Σ(a_i - b_i)²). Measures straight-line distance. Sensitive to vector magnitude. Lower = more similar.</li><li><strong>Dot Product:</strong> A · B = Σ(a_i × b_i). When vectors are normalized, equivalent to cosine similarity. Faster to compute.</li></ul><pre class="learn-code">import numpy as np\n\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\n\ncosine_sim = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))  # 0.974\neuclidean = np.linalg.norm(a - b)                                      # 5.196\ndot_product = np.dot(a, b)                                              # 32</pre></div><div class="learn-section"><div class="learn-h">Vector Databases: Purpose-Built for Embeddings</div><p class="learn-p"><strong>Vector databases</strong> are specialized systems designed to store, index, and efficiently query high-dimensional vectors. Unlike traditional databases that use B-trees for exact matching, vector databases use <strong>Approximate Nearest Neighbor (ANN)</strong> algorithms to find similar vectors in sub-linear time.</p><p class="learn-p">Key ANN indexing algorithms:</p><ul class="learn-list"><li><strong>HNSW (Hierarchical Navigable Small World):</strong> Builds a multi-layer graph where each node is connected to its nearest neighbors. Searches by greedily navigating the graph from coarse to fine layers. Best recall/speed trade-off for most use cases.</li><li><strong>IVF (Inverted File Index):</strong> Partitions vector space into clusters using k-means. At query time, only searches the nearest clusters. Fast but requires training on data distribution.</li><li><strong>Product Quantization (PQ):</strong> Compresses vectors by splitting them into sub-vectors and quantizing each. Reduces memory 10-100× with moderate recall loss. Often combined with IVF (IVF-PQ).</li></ul><table class="learn-table"><tr><th>Database</th><th>Type</th><th>Key Features</th></tr><tr><td>Pinecone</td><td>Managed cloud</td><td>Serverless, auto-scaling, metadata filtering</td></tr><tr><td>Weaviate</td><td>Open-source</td><td>GraphQL API, hybrid search, modules</td></tr><tr><td>Chroma</td><td>Open-source</td><td>Lightweight, embedded mode, great for prototyping</td></tr><tr><td>Qdrant</td><td>Open-source</td><td>Rust-based, fast, advanced filtering</td></tr><tr><td>FAISS</td><td>Library (Meta)</td><td>Not a DB — pure ANN library, GPU support, most flexible</td></tr><tr><td>pgvector</td><td>PostgreSQL ext.</td><td>Adds vector ops to existing Postgres — good for hybrid apps</td></tr></table></div><div class="learn-section"><div class="learn-h">Chunking Strategies</div><p class="learn-p">Before embedding documents, they must be split into chunks. Chunking strategy significantly impacts retrieval quality:</p><ul class="learn-list"><li><strong>Fixed-size chunking:</strong> Split every N characters/tokens with overlap. Simple but may break mid-sentence or mid-concept.</li><li><strong>Recursive character splitting:</strong> Try to split on paragraphs, then sentences, then words, then characters. Maintains natural text boundaries.</li><li><strong>Semantic chunking:</strong> Use embedding similarity between consecutive sentences — split when similarity drops below a threshold. Creates conceptually coherent chunks.</li><li><strong>Document-specific:</strong> For code: split on functions/classes. For markdown: split on headers. For HTML: split on structural elements.</li></ul><div class="learn-warn">Chunk size trade-offs: <strong>Too small</strong> (100 tokens) — loses context, many irrelevant retrievals. <strong>Too large</strong> (2000 tokens) — dilutes relevant information, wastes LLM context. <strong>Sweet spot</strong> for most use cases: 256-512 tokens with 50-100 token overlap.</div></div><div class="learn-section"><div class="learn-h">Metadata &amp; Hybrid Search</div><p class="learn-p"><strong>Metadata filtering</strong> combines vector similarity with traditional filters (date ranges, categories, user IDs) to narrow search results. Most vector databases support pre-filtering (filter then search) or post-filtering (search then filter).</p><p class="learn-p"><strong>Hybrid search</strong> combines dense vector search (semantic) with sparse keyword search (BM25/TF-IDF) using a weighted combination. This handles both semantic queries ("documents about climate change impacts") and keyword queries ("EPA regulation 2024-03-15") effectively.</p><div class="learn-complexity"><strong>Complexity:</strong> Brute-force nearest neighbor: O(n × d). HNSW search: O(log n) average case. IVF search: O(√n × d) with n_probe clusters. Building HNSW index: O(n × log n). Memory: HNSW stores graph edges, typically 2-10× vector size.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How does a vector database enable semantic search?</b><br>A: Text is converted to dense vectors via an embedding model (e.g., OpenAI text-embedding-3). These vectors capture semantic meaning — similar concepts have nearby vectors. Vector databases index these using ANN algorithms (HNSW, IVF) for O(log n) retrieval instead of O(n) brute-force comparison. A query is embedded and the nearest neighbors represent semantically similar documents.</p><p class="learn-p"><b>Q2: Explain the tradeoffs in chunking strategies for RAG.</b><br>A: Small chunks (256 tokens): more precise retrieval but lose context — answers may be incomplete. Large chunks (1024+): more context but dilute relevance signal — retrieving a large chunk because of one matching sentence. Overlap (10-20%) prevents splitting relevant content across chunk boundaries. Semantic chunking (split by topic/section) is best but more complex to implement.</p></div>',
          code: `from sentence_transformers import SentenceTransformer
import chromadb
import numpy as np
from langchain.text_splitter import RecursiveCharacterTextSplitter
import faiss

# --- Generating Embeddings ---
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

documents = [
    "Transformers use self-attention to process sequences in parallel.",
    "BERT is a bidirectional encoder pre-trained on masked language modeling.",
    "Vector databases enable efficient similarity search over embeddings.",
    "RAG combines retrieval with generation to reduce LLM hallucinations.",
    "LoRA fine-tuning adds low-rank adapters to freeze base model weights.",
    "The quick brown fox jumps over the lazy dog."  # Unrelated
]

embeddings = embed_model.encode(documents, show_progress_bar=True)
print(f"Embedding shape: {embeddings.shape}")  # (6, 384)

# --- Cosine Similarity Matrix ---
from sklearn.metrics.pairwise import cosine_similarity
sim_matrix = cosine_similarity(embeddings)
print("Similarity between doc 0 and doc 1:", sim_matrix[0][1])  # High
print("Similarity between doc 0 and doc 5:", sim_matrix[0][5])  # Low

# --- ChromaDB: Lightweight Vector Store ---
client = chromadb.Client()  # In-memory for prototyping
collection = client.create_collection(
    name="ml_docs",
    metadata={"hnsw:space": "cosine"}  # Use cosine similarity
)

# Add documents with metadata
collection.add(
    documents=documents,
    metadatas=[
        {"topic": "transformers", "difficulty": "medium"},
        {"topic": "bert", "difficulty": "medium"},
        {"topic": "vectordb", "difficulty": "easy"},
        {"topic": "rag", "difficulty": "medium"},
        {"topic": "finetuning", "difficulty": "hard"},
        {"topic": "other", "difficulty": "easy"}
    ],
    ids=[f"doc_{i}" for i in range(len(documents))]
)

# Query with semantic search
results = collection.query(
    query_texts=["How does attention work in neural networks?"],
    n_results=3
)
print("\nChromaDB Results:")
for doc, dist in zip(results['documents'][0], results['distances'][0]):
    print(f"  [{dist:.3f}] {doc[:60]}...")

# Query with metadata filtering
results = collection.query(
    query_texts=["efficient model training"],
    n_results=2,
    where={"difficulty": "hard"}  # Only hard-difficulty docs
)
print("\nFiltered results:", results['documents'])

# --- FAISS: High-Performance ANN Search ---
dimension = embeddings.shape[1]  # 384

# Flat index (exact search, good for < 100K vectors)
flat_index = faiss.IndexFlatIP(dimension)  # Inner product (cosine on normalized)
faiss.normalize_L2(embeddings)  # Normalize for cosine similarity
flat_index.add(embeddings)

# IVF index (approximate, good for 100K-10M vectors)
nlist = 2  # Number of clusters (use sqrt(n) as rule of thumb)
quantizer = faiss.IndexFlatIP(dimension)
ivf_index = faiss.IndexIVFFlat(quantizer, dimension, nlist)
ivf_index.train(embeddings)
ivf_index.add(embeddings)
ivf_index.nprobe = 2  # Search 2 nearest clusters

# Search
query = embed_model.encode(["What is retrieval augmented generation?"])
faiss.normalize_L2(query)
distances, indices = flat_index.search(query, k=3)
print(f"\nFAISS results: indices={indices[0]}, distances={distances[0]}")

# --- Text Chunking Strategies ---
long_document = """
Transformers have revolutionized NLP. The self-attention mechanism allows
parallel processing of sequences. BERT uses bidirectional encoding while
GPT uses causal decoding. Fine-tuning these models on domain-specific
data significantly improves performance. LoRA enables parameter-efficient
fine-tuning by adding low-rank adapters.
"""

splitter = RecursiveCharacterTextSplitter(
    chunk_size=100, chunk_overlap=20,
    separators=["\\n\\n", "\\n", ". ", " ", ""]
)
chunks = splitter.split_text(long_document.strip())
print(f"\nChunks ({len(chunks)}):")
for i, chunk in enumerate(chunks):
    print(f"  Chunk {i}: {chunk[:50]}... ({len(chunk)} chars)")`,
          problems: [
          ],
          mcqs: [
            {q: 'What is the primary advantage of HNSW over brute-force nearest neighbor search?', o: ['It gives exact results', 'It reduces search time from O(n) to approximately O(log n)', 'It uses less memory', 'It works with any distance metric'], a: 1},
            {q: 'What is the recommended chunk size range for most RAG applications?', o: ['10-50 tokens', '256-512 tokens with overlap', '2000-5000 tokens', 'The entire document as one chunk'], a: 1},
            {q: 'Why is hybrid search (dense + sparse) often better than pure vector search?', o: ['It is faster to compute', 'It handles both semantic queries and exact keyword matches effectively', 'It requires less storage', 'It eliminates the need for embeddings'], a: 1}
          ]
        },
        {
          t: 'Retrieval-Augmented Generation Pipeline',
          learn: '<div class="learn-section"><div class="learn-h">Why RAG? The Limitations of Standalone LLMs</div><p class="learn-p">Large Language Models have remarkable capabilities, but they suffer from critical limitations: <strong>knowledge cutoff</strong> (they don\'t know anything after their training date), <strong>hallucination</strong> (they confidently generate false information), <strong>no access to private data</strong> (they can\'t answer questions about your company\'s internal documents), and <strong>no source attribution</strong> (you can\'t verify where information came from).</p><p class="learn-p"><strong>Retrieval-Augmented Generation (RAG)</strong> (Lewis et al., 2020) addresses all of these by augmenting the LLM with an external knowledge base. Instead of relying solely on parametric knowledge (weights), RAG retrieves relevant documents and includes them in the LLM\'s context, grounding responses in actual sources.</p><pre class="learn-code">RAG Pipeline (simplified):\n\n1. User Query → Embed query using embedding model\n2. Retrieve → Search vector DB for top-k relevant chunks\n3. Augment → Insert retrieved chunks into LLM prompt\n4. Generate → LLM produces answer grounded in retrieved context\n5. (Optional) Cite → Include source references in response</pre></div><div class="learn-section"><div class="learn-h">The RAG Pipeline In Detail</div><p class="learn-p">A production RAG system has two phases: <strong>indexing</strong> (offline, one-time) and <strong>retrieval + generation</strong> (online, per-query).</p><p class="learn-p"><strong>Indexing Phase:</strong></p><ul class="learn-list"><li><strong>Document Loading:</strong> Ingest documents from various sources (PDFs, web pages, databases, APIs). Tools: LangChain document loaders, LlamaIndex readers, Unstructured.io for complex formats.</li><li><strong>Chunking:</strong> Split documents into manageable pieces (256-512 tokens). Preserve context with overlap and metadata (source, page number, section title).</li><li><strong>Embedding:</strong> Convert each chunk to a dense vector using an embedding model.</li><li><strong>Storing:</strong> Insert vectors and metadata into a vector database with appropriate indexing.</li></ul><p class="learn-p"><strong>Query Phase:</strong></p><ul class="learn-list"><li><strong>Query Processing:</strong> Optionally rewrite or expand the user query for better retrieval.</li><li><strong>Retrieval:</strong> Embed the query and find top-k similar chunks from the vector database.</li><li><strong>Reranking:</strong> Use a cross-encoder model to re-score and reorder retrieved chunks by true relevance.</li><li><strong>Prompt Construction:</strong> Format the retrieved chunks and user query into a structured prompt.</li><li><strong>Generation:</strong> Send the augmented prompt to the LLM for response generation.</li></ul></div><div class="learn-section"><div class="learn-h">Advanced RAG Techniques</div><p class="learn-p">Naive RAG (simple retrieve → generate) works for many cases, but advanced techniques significantly improve quality:</p><ul class="learn-list"><li><strong>Query Transformation:</strong> Rewrite queries for better retrieval. HyDE (Hypothetical Document Embeddings) generates a hypothetical answer first, then uses its embedding to search — often retrieves better chunks than the original query.</li><li><strong>Multi-Query Retrieval:</strong> Generate multiple variations of the user query, retrieve for each, and merge results. Increases recall for ambiguous queries.</li><li><strong>Reranking:</strong> After initial retrieval (fast, approximate), apply a cross-encoder reranker (slower, more accurate) to re-score the top candidates. Cross-encoders process query-document pairs jointly, capturing fine-grained interactions.</li><li><strong>Parent Document Retrieval:</strong> Index small chunks for precise retrieval, but return the larger parent document/section for more context. Balances retrieval precision with generation context.</li><li><strong>Self-RAG:</strong> The LLM decides when retrieval is needed, evaluates retrieval quality, and generates responses with self-reflection. Adds adaptive retrieval and output critique.</li></ul><div class="learn-tip">The <strong>Lost in the Middle</strong> problem: LLMs tend to focus on information at the beginning and end of the context, paying less attention to the middle. Place the most relevant chunks first, or use techniques like map-reduce to process chunks independently.</div></div><div class="learn-section"><div class="learn-h">Evaluation Metrics for RAG</div><p class="learn-p">RAG evaluation requires measuring both retrieval quality and generation quality:</p><table class="learn-table"><tr><th>Metric</th><th>Measures</th><th>How</th></tr><tr><td>Context Precision</td><td>Retrieval relevance</td><td>What fraction of retrieved chunks are actually relevant?</td></tr><tr><td>Context Recall</td><td>Retrieval completeness</td><td>What fraction of relevant information was retrieved?</td></tr><tr><td>Faithfulness</td><td>Groundedness</td><td>Are all claims in the response supported by retrieved context?</td></tr><tr><td>Answer Relevancy</td><td>Response quality</td><td>Does the answer actually address the user\'s question?</td></tr></table><p class="learn-p">Frameworks like <strong>RAGAS</strong> (RAG Assessment) and <strong>DeepEval</strong> automate these evaluations using LLM-as-judge approaches, making it feasible to evaluate RAG pipelines at scale.</p></div><div class="learn-section"><div class="learn-h">Common RAG Failure Modes</div><ul class="learn-list"><li><strong>Retrieval failure:</strong> Relevant documents exist but aren\'t retrieved — fix with better embeddings, hybrid search, or query rewriting.</li><li><strong>Context overflow:</strong> Too many retrieved chunks exceed the LLM\'s context window — fix with better reranking, summarization, or map-reduce patterns.</li><li><strong>Hallucination despite context:</strong> LLM ignores retrieved context and generates from parametric memory — fix with stronger system prompts ("Only answer based on the provided context") or use Self-RAG.</li><li><strong>Stale data:</strong> Vector DB contains outdated information — implement incremental indexing, TTL (time-to-live) on chunks, or versioned collections.</li></ul><div class="learn-complexity"><strong>Latency budget (typical):</strong> Embedding query: ~20ms. Vector search (top-20): ~5-50ms. Reranking (top-20 → top-5): ~100-200ms. LLM generation: 500-2000ms. Total: ~700-2300ms. Optimize by caching embeddings and using streaming generation.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is RAG and why is it better than pure LLM generation?</b><br>A: RAG retrieves relevant documents from an external knowledge base and includes them in the LLM prompt. Benefits: reduces hallucination by grounding answers in facts, enables access to private/current data without retraining, provides citations for verifiability, and is cheaper than fine-tuning. The tradeoff is increased latency from the retrieval step and dependence on retrieval quality.</p><p class="learn-p"><b>Q2: Describe the full RAG pipeline from query to answer.</b><br>A: Query → (1) query embedding → (2) vector search for top-k relevant chunks → (3) optional reranking with cross-encoder for precision → (4) prompt construction: system prompt + retrieved context + user query → (5) LLM generates answer grounded in context → (6) optional citation extraction mapping claims to source chunks.</p><p class="learn-p"><b>Q3: What is the \'lost in the middle\' problem?</b><br>A: LLMs pay more attention to information at the beginning and end of the context window, neglecting the middle. When RAG retrieves 10+ chunks, relevant information placed in the middle may be ignored. Mitigation: limit to 3-5 most relevant chunks, rerank by relevance, or use techniques like recursive summarization of retrieved passages before prompting.</p></div>',
          code: `from langchain.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
import os

# --- Step 1: Document Loading & Chunking ---
# Load documents (supports PDF, TXT, HTML, Markdown, etc.)
# loader = PyPDFLoader("research_paper.pdf")
# documents = loader.load()

# For demo, create sample documents
from langchain.schema import Document

documents = [
    Document(page_content="RAG combines retrieval with generation. The retriever "
             "finds relevant documents from a knowledge base, and the generator "
             "produces answers grounded in those documents. This reduces "
             "hallucination and enables access to up-to-date information.",
             metadata={"source": "rag_intro.txt", "page": 1}),
    Document(page_content="Vector databases like Chroma, Pinecone, and Weaviate "
             "store document embeddings for efficient similarity search. HNSW "
             "indexing provides logarithmic search time. Metadata filtering "
             "enables hybrid search combining semantic and keyword matching.",
             metadata={"source": "vectordb_guide.txt", "page": 1}),
    Document(page_content="Chunking strategy significantly impacts RAG quality. "
             "Recursive character splitting preserves natural text boundaries. "
             "Chunk sizes of 256-512 tokens with 50-100 token overlap work "
             "well for most applications. Semantic chunking uses embedding "
             "similarity to find natural breakpoints.",
             metadata={"source": "chunking_best_practices.txt", "page": 1}),
]

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200, chunk_overlap=50
)
chunks = text_splitter.split_documents(documents)
print(f"Split {len(documents)} docs into {len(chunks)} chunks")

# --- Step 2: Create Vector Store ---
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}
)

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    collection_name="rag_demo",
    persist_directory="./chroma_db"
)

# Create retriever with search parameters
retriever = vectorstore.as_retriever(
    search_type="similarity",  # or "mmr" for diversity
    search_kwargs={"k": 3}
)

# --- Step 3: Build RAG Chain ---
template = """Answer the question based only on the following context.
If the context doesn't contain enough information, say "I don't have
enough information to answer this question."

Context:
{context}

Question: {question}

Answer:"""

prompt = ChatPromptTemplate.from_template(template)
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

def format_docs(docs):
    return "\\n\\n".join(
        f"[Source: {doc.metadata.get('source', 'unknown')}]\\n{doc.page_content}"
        for doc in docs
    )

# LangChain Expression Language (LCEL) chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# --- Step 4: Query the RAG System ---
question = "How does chunking affect RAG quality?"
# response = rag_chain.invoke(question)
# print(f"Q: {question}")
# print(f"A: {response}")

# --- Advanced: Reranking with Cross-Encoder ---
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def retrieve_and_rerank(query, retriever, reranker, top_k=3):
    # Initial retrieval (get more candidates than needed)
    docs = retriever.get_relevant_documents(query)
    # Rerank using cross-encoder
    pairs = [[query, doc.page_content] for doc in docs]
    scores = reranker.predict(pairs)
    # Sort by reranker score
    ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, score in ranked[:top_k]]

# --- Advanced: Multi-Query Retrieval ---
from langchain.retrievers.multi_query import MultiQueryRetriever

multi_retriever = MultiQueryRetriever.from_llm(
    retriever=retriever, llm=llm
)
# Generates 3 query variations and retrieves for each
# results = multi_retriever.get_relevant_documents("What is RAG?")

print("RAG pipeline built successfully!")
print(f"Vector store contains {vectorstore._collection.count()} chunks")`,
          problems: [
          ],
          mcqs: [
            {q: 'What is the primary purpose of RAG?', o: ['To train larger language models', 'To ground LLM responses in retrieved external knowledge, reducing hallucination', 'To speed up LLM inference', 'To replace fine-tuning entirely'], a: 1},
            {q: 'What does a cross-encoder reranker do in a RAG pipeline?', o: ['Generates embeddings for documents', 'Re-scores retrieved documents by processing query-document pairs jointly for more accurate relevance', 'Splits documents into chunks', 'Generates the final answer'], a: 1},
            {q: 'What is the "Lost in the Middle" problem in RAG?', o: ['Documents in the middle of the database are never retrieved', 'LLMs pay less attention to information in the middle of long contexts', 'Middle-sized chunks perform poorly', 'The reranker loses middle-ranked documents'], a: 1}
          ]
        },
        {
          t: 'LangChain & Orchestration Frameworks',
          learn: '<div class="learn-section"><div class="learn-h">Why Orchestration Frameworks?</div><p class="learn-p">Building production LLM applications requires more than just calling an API — you need to chain together prompts, manage context, handle tool calls, implement error recovery, and orchestrate complex multi-step workflows. <strong>Orchestration frameworks</strong> provide abstractions and building blocks that handle this complexity, letting you focus on application logic.</p><p class="learn-p">The landscape includes several key frameworks:</p><ul class="learn-list"><li><strong>LangChain:</strong> The most popular framework. Rich ecosystem of integrations (150+ LLMs, 100+ vector stores, 500+ tools). Provides chains, agents, memory, and retrieval abstractions.</li><li><strong>LlamaIndex:</strong> Focused on data ingestion and retrieval. Best for building RAG systems with complex document structures (tables, hierarchies, knowledge graphs).</li><li><strong>Haystack:</strong> Production-focused pipeline framework from deepset. Strong on NLP components and evaluation.</li><li><strong>Semantic Kernel:</strong> Microsoft\'s framework for building AI agents. Tight Azure integration, supports C# and Python.</li></ul></div><div class="learn-section"><div class="learn-h">LangChain Core Concepts</div><p class="learn-p">LangChain is organized around composable building blocks:</p><ul class="learn-list"><li><strong>Models:</strong> Unified interface for LLMs (ChatOpenAI, Claude, LLaMA), embedding models, and other AI models. Swap providers with a single line change.</li><li><strong>Prompts:</strong> PromptTemplate for string formatting, ChatPromptTemplate for chat models, FewShotPromptTemplate for dynamic example selection. Supports partial formatting and output parsers.</li><li><strong>Chains:</strong> The fundamental composition unit. Chains combine prompts, models, and output parsers into reusable pipelines. LCEL (LangChain Expression Language) uses the pipe operator for clean chain composition.</li><li><strong>Retrievers:</strong> Abstractions over vector stores, keyword search, and hybrid search. Support metadata filtering, MMR (Maximal Marginal Relevance) for diversity, and multi-query expansion.</li><li><strong>Memory:</strong> Maintains conversation context across turns. Types include ConversationBufferMemory (keep all), ConversationSummaryMemory (LLM-summarized), and ConversationBufferWindowMemory (last K turns).</li></ul><pre class="learn-code">LCEL Chain Composition (Pipe Syntax):\n\nchain = prompt | model | output_parser\n\nEquivalent to:\n  formatted_prompt = prompt.format(input)\n  model_output = model.invoke(formatted_prompt)\n  result = output_parser.parse(model_output)</pre></div><div class="learn-section"><div class="learn-h">LangChain Agents &amp; Tools</div><p class="learn-p"><strong>Agents</strong> are LLMs that can decide which tools to use and in what order. Unlike chains (fixed sequences), agents dynamically choose actions based on the current state. The LLM acts as a reasoning engine that observes, thinks, and acts.</p><p class="learn-p">The agent loop follows the <strong>ReAct</strong> pattern:</p><pre class="learn-code">Loop:\n  1. Thought: "I need to search for the latest stock price"\n  2. Action: search_tool("AAPL stock price today")\n  3. Observation: "AAPL: $187.44, +1.2%"\n  4. Thought: "Now I need to calculate the market cap"\n  5. Action: calculator("187.44 * 15.6 billion")\n  6. Observation: "2.924 trillion"\n  7. Final Answer: "Apple\'s current market cap is ~$2.92T"</pre><p class="learn-p">Built-in tools include: web search (Tavily, SerpAPI), Python REPL for code execution, Wikipedia, Wolfram Alpha, SQL database querying, file system operations, and API integrations. You can also create custom tools by decorating any Python function with @tool.</p><div class="learn-tip"><strong>LangGraph</strong> extends LangChain with stateful, multi-agent workflows as directed graphs. Nodes are functions or agents, edges define control flow (including conditional branching and cycles). Essential for building complex agent systems with human-in-the-loop approval steps.</div></div><div class="learn-section"><div class="learn-h">LlamaIndex for Data-Intensive RAG</div><p class="learn-p"><strong>LlamaIndex</strong> excels at structured data ingestion and complex retrieval patterns:</p><ul class="learn-list"><li><strong>Data Connectors:</strong> 160+ connectors for databases, APIs, file formats (PDFs, Notion, Slack, Google Docs, SQL databases).</li><li><strong>Index Types:</strong> VectorStoreIndex (standard RAG), TreeIndex (hierarchical summarization), KeywordTableIndex (keyword-based), KnowledgeGraphIndex (entity-relation graphs).</li><li><strong>Query Engines:</strong> SubQuestionQueryEngine (decomposes complex queries into sub-questions), RouterQueryEngine (routes to the best index), SQLAutoVectorQueryEngine (natural language to SQL + vector search).</li><li><strong>Response Synthesizers:</strong> Refine (iteratively improve answer), TreeSummarize (hierarchical summarization), CompactAndRefine (fit max context then refine).</li></ul></div><div class="learn-section"><div class="learn-h">Production Considerations</div><p class="learn-p">Moving from prototype to production requires addressing several concerns:</p><ul class="learn-list"><li><strong>Observability:</strong> Use LangSmith, Weights &amp; Biases, or Phoenix (Arize) to trace chain executions, monitor latency, track token usage, and debug failures.</li><li><strong>Caching:</strong> Cache LLM responses for identical queries (GPTCache, LangChain cache). Cache embeddings to avoid recomputation. Dramatic cost savings for repeated queries.</li><li><strong>Streaming:</strong> Stream LLM responses token-by-token for better UX. Both LangChain and LlamaIndex support streaming callbacks.</li><li><strong>Error Handling:</strong> LLMs can fail (rate limits, timeouts, malformed outputs). Implement retries with exponential backoff, fallback models, and structured output validation (Pydantic parsers).</li><li><strong>Cost Optimization:</strong> Use smaller models for simple tasks, larger for complex ones. Batch requests where possible. Monitor token usage and set budget alerts.</li></ul><div class="learn-warn"><strong>Framework lock-in warning:</strong> Frameworks evolve rapidly — LangChain\'s API has changed significantly across versions. Keep your core logic framework-agnostic where possible. Use frameworks for integration glue, not business logic. Consider vanilla API calls for simple use cases.</div><div class="learn-complexity"><strong>Framework comparison:</strong> LangChain — broadest ecosystem, most integrations, rapid development. LlamaIndex — best for complex data/retrieval, structured document handling. Haystack — strongest production tooling, pipeline-centric. For most projects: start with LangChain for prototyping, evaluate if you need LlamaIndex for data complexity or Haystack for production rigor.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between a chain and an agent in LangChain?</b><br>A: A chain follows a fixed sequence of steps (retrieve → prompt → LLM → parse) defined at development time. An agent dynamically decides which tools to call based on the LLM\'s reasoning at runtime — it can search the web, query databases, run code, and iterate. Chains are predictable and debuggable; agents are flexible but harder to control and can loop.</p><p class="learn-p"><b>Q2: What are the key components of a production RAG system beyond the basic pipeline?</b><br>A: Evaluation (retrieval recall, answer faithfulness, relevance), guardrails (input/output validation, PII filtering, topic restriction), caching (semantic cache for similar queries), monitoring (latency, token usage, retrieval quality metrics), fallback strategies (when retrieval returns low-confidence results), and versioning of embeddings and prompts.</p></div>',
          code: `from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain.schema.output_parser import StrOutputParser
from langchain.tools import tool
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.memory import ConversationBufferWindowMemory
from langchain.callbacks import StreamingStdOutCallbackHandler
import json

# --- LCEL Chains (Modern LangChain) ---
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# Simple chain with LCEL pipe syntax
summarize_prompt = ChatPromptTemplate.from_template(
    "Summarize the following text in 2-3 bullet points:\\n\\n{text}"
)
summarize_chain = summarize_prompt | llm | StrOutputParser()
# result = summarize_chain.invoke({"text": "Long document text here..."})

# Multi-step chain: analyze then recommend
analyze_prompt = ChatPromptTemplate.from_template(
    "Analyze the sentiment and key topics in: {text}"
)
recommend_prompt = ChatPromptTemplate.from_template(
    "Based on this analysis: {analysis}\\n"
    "Recommend 3 related articles the reader might enjoy."
)
analysis_chain = (
    {"analysis": analyze_prompt | llm | StrOutputParser(),
     "text": RunnablePassthrough()}
    | recommend_prompt | llm | StrOutputParser()
)

# --- Parallel Chain Execution ---
from langchain.schema.runnable import RunnableParallel

parallel_chain = RunnableParallel(
    summary=summarize_prompt | llm | StrOutputParser(),
    sentiment=ChatPromptTemplate.from_template(
        "Rate sentiment of this text (1-10): {text}"
    ) | llm | StrOutputParser(),
    keywords=ChatPromptTemplate.from_template(
        "Extract 5 keywords from: {text}"
    ) | llm | StrOutputParser()
)
# results = parallel_chain.invoke({"text": "Some input text"})

# --- Custom Tools for Agents ---
@tool
def search_knowledge_base(query: str) -> str:
    """Search the internal knowledge base for relevant information."""
    # In production, this would query your vector database
    mock_results = {
        "rag": "RAG combines retrieval with LLM generation...",
        "langchain": "LangChain is an orchestration framework...",
    }
    for key, value in mock_results.items():
        if key in query.lower():
            return value
    return "No relevant information found."

@tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression. Input: a math expression string."""
    try:
        result = eval(expression)  # Use numexpr in production
        return str(result)
    except Exception as e:
        return f"Error: {e}"

# --- Build an Agent ---
agent_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant with access to tools. "
               "Always use tools when you need factual information."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

tools = [search_knowledge_base, calculate]
agent = create_openai_tools_agent(llm, tools, agent_prompt)

memory = ConversationBufferWindowMemory(
    k=5, memory_key="chat_history", return_messages=True
)

agent_executor = AgentExecutor(
    agent=agent, tools=tools, memory=memory,
    verbose=True, max_iterations=5,
    handle_parsing_errors=True
)

# result = agent_executor.invoke({"input": "What is RAG and what is 15 * 42?"})

# --- LlamaIndex: Quick RAG Setup ---
from llama_index.core import (
    VectorStoreIndex, SimpleDirectoryReader, Settings
)
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.openai import OpenAI

# Configure LlamaIndex settings
Settings.llm = OpenAI(model="gpt-3.5-turbo", temperature=0)
Settings.embed_model = HuggingFaceEmbedding(model_name="all-MiniLM-L6-v2")

# Load and index documents
# documents = SimpleDirectoryReader("./data").load_data()
# index = VectorStoreIndex.from_documents(documents)
# query_engine = index.as_query_engine(similarity_top_k=3)
# response = query_engine.query("What are the key findings?")

# --- Streaming Output ---
streaming_llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()]
)
# streaming_llm.invoke("Explain RAG in 3 sentences")

# --- Structured Output with Pydantic ---
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List

class ArticleSummary(BaseModel):
    title: str = Field(description="Article title")
    key_points: List[str] = Field(description="3-5 key takeaways")
    sentiment: str = Field(description="Overall sentiment")
    confidence: float = Field(description="Confidence score 0-1")

parser = PydanticOutputParser(pydantic_object=ArticleSummary)
structured_prompt = ChatPromptTemplate.from_template(
    "Analyze this article and provide a structured summary.\\n"
    "{format_instructions}\\n\\nArticle: {article}"
)

structured_chain = (
    {"article": RunnablePassthrough(),
     "format_instructions": lambda _: parser.get_format_instructions()}
    | structured_prompt | llm | parser
)
# result = structured_chain.invoke("Article text here...")

print("LangChain orchestration pipeline ready!")
print(f"Tools available: {[t.name for t in tools]}")`,
          problems: [
          ],
          mcqs: [
            {q: 'What is LCEL in LangChain?', o: ['A new programming language', 'LangChain Expression Language — a pipe-based syntax for composing chains', 'A vector database format', 'A tokenization algorithm'], a: 1},
            {q: 'How do LangChain agents differ from chains?', o: ['Agents are faster than chains', 'Agents dynamically decide which tools to use, while chains follow a fixed sequence', 'Agents only work with OpenAI models', 'Chains cannot use tools'], a: 1},
            {q: 'What is LangGraph used for?', o: ['Visualizing embeddings', 'Building stateful, multi-agent workflows as directed graphs with conditional branching', 'Training language models', 'Creating vector database indexes'], a: 1}
          ]
        }
      ]
    }
  ]
};

const APTITUDE_CONTENT = {
  id: 'apt', t: 'Aptitude',
  tabs: [
    {
      id: 'prob', t: 'Probability & Combinatorics',
      topics: [
        {
          t: 'Probability Fundamentals',
          learn: '<div class="learn-section"><div class="learn-h">Introduction to Probability</div><p class="learn-p">Probability is the branch of mathematics that quantifies uncertainty. For any event A in a sample space S, the probability P(A) satisfies 0 &le; P(A) &le; 1. The probability of the entire sample space is 1, and for mutually exclusive events A and B, P(A &cup; B) = P(A) + P(B).</p><p class="learn-p">For non-mutually-exclusive events, we use the <strong>inclusion-exclusion principle</strong>:</p><pre class="learn-code">P(A &cup; B) = P(A) + P(B) - P(A &cap; B)</pre><p class="learn-p"><strong>Example:</strong> A card is drawn from a standard deck of 52 cards. What is the probability that it is a King or a Heart?</p><p class="learn-p">P(King) = 4/52, P(Heart) = 13/52, P(King &cap; Heart) = 1/52 (King of Hearts). So P(King &cup; Heart) = 4/52 + 13/52 - 1/52 = 16/52 = <strong>4/13</strong>.</p></div><div class="learn-section"><div class="learn-h">Conditional Probability</div><p class="learn-p">The conditional probability of event A given that event B has occurred is defined as:</p><pre class="learn-code">P(A | B) = P(A &cap; B) / P(B),  where P(B) &gt; 0</pre><p class="learn-p">This captures how our belief about A changes once we know B has happened. The <strong>multiplication rule</strong> follows directly: P(A &cap; B) = P(A | B) &times; P(B).</p><p class="learn-p"><strong>Example:</strong> A bag contains 5 red and 3 blue balls. Two balls are drawn without replacement. Find P(both red).</p><p class="learn-p"><strong>Solution:</strong> P(1st red) = 5/8. Given the first was red, 4 red and 3 blue remain, so P(2nd red | 1st red) = 4/7. Therefore P(both red) = (5/8) &times; (4/7) = 20/56 = <strong>5/14 &approx; 0.357</strong>.</p><p class="learn-p"><strong>Example:</strong> Two dice are rolled. Given that the sum is at least 9, what is the probability that both dice show 5 or more?</p><p class="learn-p">Let B = {sum &ge; 9}. The outcomes for sum &ge; 9 are: (3,6),(4,5),(4,6),(5,4),(5,5),(5,6),(6,3),(6,4),(6,5),(6,6) &mdash; 10 outcomes. Let A = {both dice &ge; 5}: (5,5),(5,6),(6,5),(6,6) &mdash; 4 of those 10 satisfy A. So P(A|B) = 4/10 = <strong>2/5</strong>.</p></div><div class="learn-section"><div class="learn-h">Independence</div><p class="learn-p">Two events A and B are <strong>independent</strong> if knowing one occurred does not change the probability of the other: P(A &cap; B) = P(A) &times; P(B). Equivalently, P(A|B) = P(A). For n independent events: P(A_1 &cap; A_2 &cap; ... &cap; A_n) = P(A_1) &times; P(A_2) &times; ... &times; P(A_n).</p><p class="learn-p"><strong>Example:</strong> A fair coin is flipped and a fair die is rolled. P(heads and 6) = (1/2)(1/6) = 1/12 = P(H) &times; P(6). Independent.</p><div class="learn-warn"><strong>Independence &ne; Mutually Exclusive.</strong> Mutually exclusive events (P(A &cap; B) = 0) are actually <strong>dependent</strong> &mdash; if A occurred, B definitely did not. Two events with P &gt; 0 cannot be both mutually exclusive and independent.</div><p class="learn-p"><strong>Example:</strong> A system has 3 servers, each with 95% uptime (independent). P(all up) = 0.95&sup3; &approx; 0.857. P(at least one up) = 1 - 0.05&sup3; = 1 - 0.000125 = <strong>0.999875</strong>.</p></div><div class="learn-section"><div class="learn-h">Bayes\' Theorem</div><p class="learn-p">Bayes\' Theorem lets us reverse conditional probabilities. If B<sub>1</sub>, B<sub>2</sub>, ..., B<sub>n</sub> partition the sample space:</p><pre class="learn-code">P(B_k | A) = P(A | B_k) &times; P(B_k) / &sum; P(A | B_i) &times; P(B_i)</pre><p class="learn-p">This is the cornerstone of medical testing, spam filtering, and Bayesian inference in machine learning.</p><p class="learn-p"><strong>Example:</strong> A factory has two machines. Machine I produces 60% of items with a 2% defect rate. Machine II produces 40% of items with a 5% defect rate. A randomly chosen item is defective. What is the probability it came from Machine I?</p><p class="learn-p"><strong>Solution:</strong> Let D = defective. P(I) = 0.6, P(II) = 0.4, P(D|I) = 0.02, P(D|II) = 0.05. By total probability: P(D) = 0.6&times;0.02 + 0.4&times;0.05 = 0.012 + 0.020 = 0.032. By Bayes\' Theorem: P(I|D) = (0.02 &times; 0.6) / 0.032 = 0.012 / 0.032 = <strong>0.375 = 3/8</strong>.</p><div class="learn-tip">Bayes\' Theorem is a favorite in interviews. Always structure the solution as: (1) define events, (2) list priors P(B_i), (3) list likelihoods P(A|B_i), (4) compute total probability, (5) apply the formula.</div></div><div class="learn-section"><div class="learn-h">Expected Value</div><p class="learn-p">The expected value (mean) of a discrete random variable X is:</p><pre class="learn-code">E[X] = &sum; x_i &times; P(X = x_i)</pre><p class="learn-p">Key properties: E[aX + b] = aE[X] + b (linearity). For independent variables: E[XY] = E[X]E[Y].</p><p class="learn-p"><strong>Example:</strong> You roll a fair die. If the result is even, you win that many dollars. If odd, you lose 3 dollars. What is the expected gain?</p><p class="learn-p"><strong>Solution:</strong> Even outcomes: 2, 4, 6 (each with P = 1/6, gain = face value). Odd outcomes: 1, 3, 5 (each with P = 1/6, gain = -3). E[gain] = (1/6)(2 + 4 + 6) + (1/6)(-3 + -3 + -3) = 12/6 + (-9/6) = 12/6 - 9/6 = <strong>3/6 = $0.50</strong>.</p><p class="learn-p"><strong>Example:</strong> A game costs $5 to play. You draw a card from a standard deck. If it is an Ace, you win $50. If it is a face card (J, Q, K), you win $10. Otherwise you win nothing. Should you play?</p><p class="learn-p">E[winnings] = (4/52)&times;50 + (12/52)&times;10 + (36/52)&times;0 = 200/52 + 120/52 = 320/52 &approx; $6.15. Net expected gain = $6.15 - $5 = <strong>$1.15 &gt; 0</strong>, so yes, you should play.</p></div><div class="learn-section"><div class="learn-h">Variance &amp; Linearity of Expectation</div><p class="learn-p"><strong>Variance</strong> measures the spread of a random variable around its mean:</p><pre class="learn-code">Var(X) = E[X&sup2;] - (E[X])&sup2;\n&sigma;(X) = &radic;Var(X)\n\nProperties:\n  Var(aX + b) = a&sup2; &times; Var(X)     (constants shift mean, not spread)\n  Var(X + Y) = Var(X) + Var(Y)   (only if X, Y are independent)</pre><p class="learn-p"><strong>Linearity of Expectation</strong> is the most powerful tool in probability: E[X + Y] = E[X] + E[Y], <strong>always</strong>, even when X and Y are dependent. Combined with <strong>indicator variables</strong> (X_i = 1 if event i occurs, else 0), it solves many complex counting problems elegantly.</p><p class="learn-p"><strong>Example (Derangements):</strong> A random permutation of n elements is chosen. What is the expected number of elements in their original position?</p><p class="learn-p">Let X_i = 1 if element i is in position i. E[X_i] = 1/n. By linearity: E[fixed points] = n &times; (1/n) = <strong>1</strong>, regardless of n. No need to compute derangement probabilities!</p><p class="learn-p"><strong>Example (Coupon Collector):</strong> There are n types of coupons. You collect one at random each day. Expected days to collect all n types?</p><p class="learn-p">After collecting i types, P(new type) = (n-i)/n, so expected days for next new type = n/(n-i). E[total] = n/n + n/(n-1) + ... + n/1 = n &times; H_n &approx; n &times; ln(n). For n = 50: &approx; 225 days.</p><div class="learn-tip"><strong>Indicator variable trick:</strong> Whenever a problem asks "expected number of X," define X_i = 1 if the i-th element satisfies the condition. Then E[count] = &sum; P(X_i = 1). This avoids complex joint distributions entirely.</div></div><div class="learn-section"><div class="learn-h">Key Distributions &amp; Formulas</div><table class="learn-table"><tr><th>Distribution</th><th>PMF / Formula</th><th>E[X]</th><th>Var(X)</th></tr><tr><td>Bernoulli(p)</td><td>P(X=1) = p, P(X=0) = 1-p</td><td>p</td><td>p(1-p)</td></tr><tr><td>Binomial(n,p)</td><td>C(n,k) p^k (1-p)^(n-k)</td><td>np</td><td>np(1-p)</td></tr><tr><td>Geometric(p)</td><td>(1-p)^(k-1) p</td><td>1/p</td><td>(1-p)/p&sup2;</td></tr><tr><td>Poisson(&lambda;)</td><td>&lambda;^k e^(-&lambda;) / k!</td><td>&lambda;</td><td>&lambda;</td></tr><tr><td>Uniform(a,b)</td><td>1/(b-a) for x &isin; [a,b]</td><td>(a+b)/2</td><td>(b-a)&sup2;/12</td></tr><tr><td>Normal(&mu;,&sigma;&sup2;)</td><td>(1/(&sigma;&radic;2&pi;)) e^(-(x-&mu;)&sup2;/(2&sigma;&sup2;))</td><td>&mu;</td><td>&sigma;&sup2;</td></tr><tr><td>Exponential(&lambda;)</td><td>&lambda;e^(-&lambda;x), x &ge; 0</td><td>1/&lambda;</td><td>1/&lambda;&sup2;</td></tr></table><div class="learn-tip"><strong>Normal (68-95-99.7 rule):</strong> ~68% of data within 1&sigma; of &mu;, ~95% within 2&sigma;, ~99.7% within 3&sigma;. Z-score: z = (x - &mu;) / &sigma; converts any normal to standard N(0,1).</div><div class="learn-tip"><strong>Poisson:</strong> Models rare events in fixed intervals (server requests/minute, typos/page). Binomial with large n, small p &approx; Poisson with &lambda; = np.</div><div class="learn-tip"><strong>Exponential:</strong> Models waiting time between Poisson events. <strong>Memoryless</strong>: P(X &gt; s+t | X &gt; s) = P(X &gt; t). The only continuous memoryless distribution.</div></div><div class="learn-section"><div class="learn-h">Classic Interview Problems</div><p class="learn-p"><strong>Birthday Problem:</strong> In a group of n people, P(at least 2 share a birthday) = 1 - (365 &times; 364 &times; ... &times; (365-n+1)) / 365^n. For n = 23: P &approx; 50.7%. For n = 50: P &approx; 97%. The counterintuitively small threshold is a favorite interview question.</p><p class="learn-p"><strong>Monty Hall Problem:</strong> Three doors &mdash; one car, two goats. You pick a door, the host opens another revealing a goat. Should you switch? <strong>Yes</strong> &mdash; switching wins with P = 2/3, staying wins with P = 1/3. The host always reveals a goat, giving you information.</p><p class="learn-p"><strong>Gambler\'s Ruin:</strong> A player starts with $k, bets $1 each round (P(win) = p). If p = 1/2: P(reaching $N before $0) = k/N. If p &ne; 1/2: P = (1 - (q/p)^k) / (1 - (q/p)^N) where q = 1-p.</p><div class="learn-warn">Common mistake: Confusing &quot;at least one&quot; problems. Use the complement: P(at least one) = 1 - P(none). For example, P(at least one head in 5 flips) = 1 - (1/2)^5 = 31/32.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between independent and mutually exclusive events?</b><br>A: Independent: P(A and B) = P(A) * P(B) — occurrence of one doesn\'t affect the other (e.g., two separate coin flips). Mutually exclusive: P(A and B) = 0 — they cannot occur simultaneously (e.g., heads and tails on the same flip). Two events cannot be both independent and mutually exclusive (unless one has probability 0).</p><p class="learn-p"><b>Q2: Explain Bayes\' theorem with an example.</b><br>A: Bayes\' theorem: P(A|B) = P(B|A) * P(A) / P(B). Example: 1% of population has a disease. A test has 99% sensitivity (true positive) and 5% false positive rate. If you test positive: P(disease|positive) = (0.99 * 0.01) / (0.99 * 0.01 + 0.05 * 0.99) = 0.0099 / 0.0594 = 16.7%. Despite 99% accuracy, most positives are false — this is the base rate fallacy.</p><p class="learn-p"><b>Q3: What is expected value and when is it useful?</b><br>A: E[X] = sum of (value * probability) for all outcomes. It represents the long-run average. Useful for decision-making under uncertainty: compare E[profit] of different strategies. For the Coupon Collector problem with n types: E[total] = n * H_n (harmonic sum). Key property: E[X+Y] = E[X] + E[Y] always holds, even for dependent variables (linearity of expectation).</p></div>',
          code: `# Probability Fundamentals - Python Implementations

from fractions import Fraction
import random

# --- Bayes' Theorem Calculator ---
def bayes_theorem(prior_b, likelihood_a_given_b, likelihood_a_given_not_b):
    """
    Compute P(B|A) using Bayes' Theorem.
    prior_b: P(B)
    likelihood_a_given_b: P(A|B)
    likelihood_a_given_not_b: P(A|~B)
    """
    prior_not_b = 1 - prior_b
    # Total probability of A
    p_a = likelihood_a_given_b * prior_b + likelihood_a_given_not_b * prior_not_b
    # Bayes' theorem
    posterior = (likelihood_a_given_b * prior_b) / p_a
    return posterior

# Factory machine example
result = bayes_theorem(0.6, 0.02, 0.05)
print(f"P(Machine I | Defective) = {result:.4f}")  # 0.375

# --- Conditional Probability: Drawing balls ---
def prob_both_red(red, blue):
    """P(both red) when drawing 2 without replacement."""
    total = red + blue
    return Fraction(red, total) * Fraction(red - 1, total - 1)

print(f"P(both red from 5R,3B) = {prob_both_red(5, 3)}")  # 5/14

# --- Expected Value Calculator ---
def expected_value(outcomes, probabilities):
    """Compute E[X] given outcomes and their probabilities."""
    return sum(x * p for x, p in zip(outcomes, probabilities))

# Die game example: even -> win face value, odd -> lose $3
outcomes = [-3, 2, -3, 4, -3, 6]
probs = [Fraction(1, 6)] * 6
ev = expected_value(outcomes, probs)
print(f"Expected gain from die game = {ev} = {float(ev):.2f}")

# --- Monte Carlo Simulation: Birthday Problem ---
def birthday_simulation(n_people, n_trials=100000):
    """Estimate P(at least 2 share a birthday) via simulation."""
    matches = 0
    for _ in range(n_trials):
        birthdays = [random.randint(1, 365) for _ in range(n_people)]
        if len(birthdays) != len(set(birthdays)):
            matches += 1
    return matches / n_trials

# Analytical birthday formula
def birthday_exact(n):
    """Exact P(at least one shared birthday) for n people."""
    p_no_match = 1.0
    for i in range(n):
        p_no_match *= (365 - i) / 365
    return 1 - p_no_match

print(f"Birthday problem (23 people):")
print(f"  Exact:      {birthday_exact(23):.4f}")
print(f"  Simulated:  {birthday_simulation(23):.4f}")

# --- Binomial Probability ---
def binomial_pmf(n, k, p):
    """P(X = k) for Binomial(n, p)."""
    from math import comb
    return Fraction(comb(n, k)) * Fraction(p).limit_denominator(1000)**k * Fraction(1 - p).limit_denominator(1000)**(n - k)

def binomial_at_least(n, threshold, p):
    """P(X >= threshold) for Binomial(n, p)."""
    return sum(float(binomial_pmf(n, k, p)) for k in range(threshold, n + 1))

print(f"P(X >= 3) for 5 coin flips = {binomial_at_least(5, 3, 0.5):.4f}")

# --- Geometric Distribution: Expected Trials ---
def geometric_expected(p):
    """Expected number of trials to first success."""
    return Fraction(1, p) if isinstance(p, Fraction) else 1 / p

print(f"Expected rolls to get a 6 = {geometric_expected(Fraction(1, 6))}")  # 6`,
          problems: [
            ['Probability - GFG Practice', 'https://www.geeksforgeeks.org/probability-gq/', 'Easy'],
            ['Probability - HackerRank', 'https://www.hackerrank.com/domains/ai?filters%5Bsubdomains%5D%5B%5D=probability-statistics', 'Medium'],
            ['Project Euler #205 - Dice Game', 'https://projecteuler.net/problem=205', 'Medium'],
            ['Bayes Theorem Problems - GFG', 'https://www.geeksforgeeks.org/bayes-theorem/', 'Hard']
          ],
          mcqs: [
            {q: 'A bag contains 5 red and 3 blue balls. Two are drawn without replacement. What is P(both red)?', o: ['5/14', '5/8', '25/64', '15/56'], a: 0},
            {q: 'A factory has Machine A (70% output, 3% defect) and Machine B (30% output, 7% defect). An item is defective. What is P(it came from A)?', o: ['0.50', '0.30', '0.70', '0.21'], a: 0},
            {q: 'A fair coin is flipped 4 times. What is the expected number of heads?', o: ['1', '2', '3', '2.5'], a: 1}
          ]
        },
        {
          t: 'Combinatorics',
          learn: '<div class="learn-section"><div class="learn-h">Fundamental Counting Principles</div><p class="learn-p">Combinatorics is the mathematics of counting, arranging, and choosing. Two foundational rules underpin all counting:</p><ul class="learn-list"><li><strong>Rule of Product (AND):</strong> If task A can be done in m ways and task B in n ways, then doing both A AND B can be done in m &times; n ways.</li><li><strong>Rule of Sum (OR):</strong> If task A can be done in m ways and task B in n ways (with no overlap), then doing A OR B can be done in m + n ways.</li></ul><p class="learn-p"><strong>Example:</strong> A license plate has 2 letters followed by 3 digits. How many distinct plates are possible?</p><p class="learn-p"><strong>Solution:</strong> 26 choices for each letter, 10 for each digit. By the product rule: 26 &times; 26 &times; 10 &times; 10 &times; 10 = <strong>676,000</strong> plates.</p><p class="learn-p"><strong>Example:</strong> A restaurant offers 3 appetizers, 5 mains, and 2 desserts. A meal consists of one from each category. How many meals? 3 &times; 5 &times; 2 = <strong>30</strong>.</p></div><div class="learn-section"><div class="learn-h">Permutations</div><p class="learn-p">A permutation is an arrangement of objects where <strong>order matters</strong>. The number of ways to arrange r objects from a set of n distinct objects is:</p><pre class="learn-code">P(n, r) = n! / (n - r)!</pre><p class="learn-p"><strong>Example:</strong> In how many ways can 3 students be seated in a row of 5 chairs?</p><p class="learn-p"><strong>Solution:</strong> P(5, 3) = 5! / 2! = 120 / 2 = <strong>60</strong>.</p><p class="learn-p"><strong>Permutations with repetition:</strong> The number of arrangements of n objects where object types repeat with frequencies n<sub>1</sub>, n<sub>2</sub>, ..., n<sub>k</sub> is:</p><pre class="learn-code">n! / (n_1! &times; n_2! &times; ... &times; n_k!)</pre><p class="learn-p"><strong>Example:</strong> How many distinct arrangements of the letters in "MISSISSIPPI"?</p><p class="learn-p">11 letters total: M=1, I=4, S=4, P=2. Answer = 11! / (1! &times; 4! &times; 4! &times; 2!) = 39916800 / (1 &times; 24 &times; 24 &times; 2) = 39916800 / 1152 = <strong>34,650</strong>.</p><p class="learn-p"><strong>Circular Permutations:</strong> Arranging n distinct objects in a circle = (n-1)! because rotations are considered identical. If the circle can also be flipped (e.g., a necklace): (n-1)!/2.</p><p class="learn-p"><strong>Example:</strong> In how many ways can 6 people sit around a circular table? (6-1)! = 5! = <strong>120</strong>.</p></div><div class="learn-section"><div class="learn-h">Combinations</div><p class="learn-p">A combination is a selection of objects where <strong>order does not matter</strong>. The number of ways to choose r objects from n is:</p><pre class="learn-code">C(n, r) = n! / (r! &times; (n - r)!)</pre><p class="learn-p"><strong>Example:</strong> A committee of 3 is to be formed from 8 people. How many ways?</p><p class="learn-p"><strong>Solution:</strong> C(8, 3) = 8! / (3! &times; 5!) = (8 &times; 7 &times; 6) / (3 &times; 2 &times; 1) = 336 / 6 = <strong>56</strong>.</p><p class="learn-p"><strong>Example:</strong> From 6 men and 4 women, a committee of 5 is formed with exactly 3 men and 2 women. How many ways?</p><p class="learn-p"><strong>Solution:</strong> C(6,3) &times; C(4,2) = 20 &times; 6 = <strong>120</strong>.</p><div class="learn-tip">Key identity: C(n, r) = C(n, n-r). So C(100, 98) = C(100, 2) = 4950 &mdash; always simplify to the smaller r!</div><p class="learn-p"><strong>Pascal\'s Identity:</strong> C(n, r) = C(n-1, r-1) + C(n-1, r). This is the basis for Pascal\'s triangle and dynamic programming approaches to combination problems.</p></div><div class="learn-section"><div class="learn-h">The Pigeonhole Principle</div><p class="learn-p">If n items are placed into m containers and n &gt; m, then at least one container must hold more than one item. More generally, if n items go into m containers, some container holds at least &lceil;n/m&rceil; items.</p><p class="learn-p"><strong>Example:</strong> In a group of 13 people, prove that at least 2 share the same birth month.</p><p class="learn-p"><strong>Proof:</strong> There are 12 months (containers) and 13 people (items). Since 13 &gt; 12, by the Pigeonhole Principle, at least 2 people must share a birth month. &marker;</p><p class="learn-p"><strong>Example:</strong> Prove that among any 5 integers, there exist two whose difference is divisible by 4.</p><p class="learn-p"><strong>Proof:</strong> Any integer mod 4 gives a remainder in {0, 1, 2, 3} &mdash; that is 4 containers. We have 5 integers (items). By Pigeonhole, at least 2 have the same remainder mod 4, so their difference is divisible by 4. &marker;</p><div class="learn-warn">The Pigeonhole Principle proves existence but does NOT tell you which specific container is overfull. It is a non-constructive proof technique.</div></div><div class="learn-section"><div class="learn-h">Stars and Bars &amp; Advanced Counting</div><p class="learn-p">The <strong>Stars and Bars</strong> theorem counts the number of ways to distribute n identical objects into r distinct bins:</p><pre class="learn-code">Ways = C(n + r - 1, r - 1)</pre><p class="learn-p"><strong>Example:</strong> How many non-negative integer solutions exist for x + y + z = 10?</p><p class="learn-p"><strong>Solution:</strong> n = 10 stars, r = 3 bins. C(10 + 3 - 1, 3 - 1) = C(12, 2) = <strong>66</strong>.</p><table class="learn-table"><tr><th>Scenario</th><th>Formula</th><th>Example</th></tr><tr><td>Arrangements (order matters, no repeat)</td><td>P(n, r) = n!/(n-r)!</td><td>Seating 3 from 5: 60</td></tr><tr><td>Selections (order irrelevant)</td><td>C(n, r) = n!/(r!(n-r)!)</td><td>Committee of 3 from 8: 56</td></tr><tr><td>Arrangements with repetition</td><td>n^r</td><td>3-digit code, 10 digits: 1000</td></tr><tr><td>Distribute identical to distinct</td><td>C(n+r-1, r-1)</td><td>10 balls into 3 boxes: 66</td></tr></table><p class="learn-p">The <strong>Inclusion-Exclusion Principle</strong> generalizes the sum rule: |A &cup; B &cup; C| = |A| + |B| + |C| - |A&cap;B| - |A&cap;C| - |B&cap;C| + |A&cap;B&cap;C|. This is essential for derangement and surjection counting.</p></div><div class="learn-section"><div class="learn-h">Derangements &amp; Binomial Theorem</div><p class="learn-p">A <strong>derangement</strong> is a permutation where no element appears in its original position. The number of derangements of n elements:</p><pre class="learn-code">D_n = n! &times; (1 - 1/1! + 1/2! - 1/3! + ... + (-1)^n/n!)\nD_n = (n-1)(D_{n-1} + D_{n-2})   (recurrence)\nD_n / n! &approx; 1/e &approx; 0.3679    (for large n)</pre><p class="learn-p"><strong>Example:</strong> 4 letters are randomly placed in 4 envelopes. P(no letter in correct envelope) = D_4/4! = 9/24 = <strong>3/8</strong>. D_4 = 4!(1 - 1 + 1/2 - 1/6 + 1/24) = 24 &times; 9/24 = 9.</p><p class="learn-p"><strong>Binomial Theorem:</strong></p><pre class="learn-code">(a + b)^n = &sum; C(n,k) a^(n-k) b^k,  k = 0 to n\n\nSpecial cases:\n  (1 + x)^n = C(n,0) + C(n,1)x + C(n,2)x&sup2; + ...\n  Sum of all coefficients: 2^n       [set x = 1]\n  Alternating sum of coefficients: 0  [set x = -1]\n  C(n,0) + C(n,1) + ... + C(n,n) = 2^n</pre><p class="learn-p"><strong>Example:</strong> Find the coefficient of x&sup3; in (2x + 3)^5.</p><p class="learn-p">C(5,3) &times; (2x)&sup3; &times; 3&sup2; = 10 &times; 8x&sup3; &times; 9 = <strong>720x&sup3;</strong>. Coefficient = 720.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: When do you use permutations vs combinations?</b><br>A: Permutations when order matters (arranging people in a line, assigning ranks). Combinations when order doesn\'t matter (choosing a committee, selecting items). P(n,r) = n!/(n-r)! counts ordered selections. C(n,r) = n!/(r!(n-r)!) counts unordered selections. Quick test: would swapping two selected items create a different outcome? If yes, use permutations.</p><p class="learn-p"><b>Q2: Explain the Pigeonhole Principle with an example.</b><br>A: If n items go into m containers and n > m, at least one container has more than one item. Generalized: at least one container has ceil(n/m) items. Example: In a group of 13 people, at least 2 share a birth month (13 people, 12 months). Example: Among any 5 integers, at least 2 have the same remainder mod 4 (5 integers, 4 possible remainders).</p><p class="learn-p"><b>Q3: How do you count arrangements with repeated elements?</b><br>A: For n objects with groups of identical items of sizes r1, r2, ..., rk: n! / (r1! * r2! * ... * rk!). Example: MISSISSIPPI has 11 letters with M=1, I=4, S=4, P=2. Arrangements = 11! / (1! * 4! * 4! * 2!) = 34,650. This divides out the overcounting from swapping identical letters.</p></div>',
          code: `# Combinatorics - Python Implementations

from math import factorial, comb, perm
from functools import lru_cache

# --- Fundamental Counting ---
def license_plates(n_letters, n_digits):
    """Count license plates: n_letters letters + n_digits digits."""
    return (26 ** n_letters) * (10 ** n_digits)

print(f"License plates (2 letters, 3 digits): {license_plates(2, 3)}")

# --- Permutations with Repetition ---
def multiset_permutations(word):
    """Count distinct permutations of a word with repeated letters."""
    n = len(word)
    freq = {}
    for ch in word:
        freq[ch] = freq.get(ch, 0) + 1
    denom = 1
    for count in freq.values():
        denom *= factorial(count)
    return factorial(n) // denom

print(f"Arrangements of MISSISSIPPI: {multiset_permutations('MISSISSIPPI')}")

# --- Combinations with constraints ---
def committee_with_constraint(men, women, total, req_men, req_women):
    """Committee of 'total' members with exactly req_men men and req_women women."""
    if req_men + req_women != total:
        return 0
    return comb(men, req_men) * comb(women, req_women)

print(f"Committee (3M from 6, 2W from 4): {committee_with_constraint(6, 4, 5, 3, 2)}")

# --- Stars and Bars ---
def stars_and_bars(n_objects, n_bins):
    """Non-negative integer solutions to x1 + x2 + ... + xr = n."""
    return comb(n_objects + n_bins - 1, n_bins - 1)

print(f"Solutions to x+y+z=10: {stars_and_bars(10, 3)}")

# --- Pascal's Triangle Generator ---
def pascals_triangle(rows):
    """Generate Pascal's triangle up to given number of rows."""
    triangle = []
    for n in range(rows):
        row = [1]
        for k in range(1, n):
            row.append(triangle[n-1][k-1] + triangle[n-1][k])
        if n > 0:
            row.append(1)
        triangle.append(row)
    return triangle

print("Pascal's Triangle (6 rows):")
for i, row in enumerate(pascals_triangle(6)):
    print(f"  Row {i}: {row}")

# --- Derangements (no element in original position) ---
@lru_cache(maxsize=None)
def derangements(n):
    """Count derangements D(n) using inclusion-exclusion."""
    if n == 0:
        return 1
    if n == 1:
        return 0
    return (n - 1) * (derangements(n - 1) + derangements(n - 2))

for n in range(1, 8):
    print(f"  D({n}) = {derangements(n)}")

# --- Catalan Numbers ---
def catalan(n):
    """Compute nth Catalan number: C(2n, n) / (n+1)."""
    return comb(2 * n, n) // (n + 1)

print("Catalan numbers:")
for i in range(8):
    print(f"  C_{i} = {catalan(i)}")

# --- Pigeonhole checker ---
def pigeonhole_birthday(people, months=12):
    """Minimum guaranteed shared in a group."""
    import math
    return math.ceil(people / months)

print(f"13 people, 12 months -> at least {pigeonhole_birthday(13)} share a month")

# --- Binomial Theorem expansion ---
def binomial_expand(a, b, n):
    """Expand (a + b)^n and return list of (coefficient, a_power, b_power)."""
    terms = []
    for k in range(n + 1):
        coeff = comb(n, k) * (a ** (n - k)) * (b ** k)
        terms.append((comb(n, k), n - k, k, coeff))
    return terms

print("Expansion of (2 + 3)^4:")
for c, ap, bp, val in binomial_expand(2, 3, 4):
    print(f"  C(4,{bp}) * 2^{ap} * 3^{bp} = {val}")`,
          problems: [
            ['Permutations & Combinations - GFG', 'https://www.geeksforgeeks.org/permutation-and-combination-gq/', 'Easy'],
            ['Combinatorics - HackerRank', 'https://www.hackerrank.com/domains/mathematics?filters%5Bsubdomains%5D%5B%5D=combinatorics', 'Medium'],
            ['Project Euler #15 - Lattice Paths', 'https://projecteuler.net/problem=15', 'Medium'],
            ['Project Euler #53 - Combinatoric Selections', 'https://projecteuler.net/problem=53', 'Hard']
          ],
          mcqs: [
            {q: 'How many distinct arrangements of the letters in "LEVEL" are there?', o: ['120', '60', '30', '20'], a: 2},
            {q: 'How many non-negative integer solutions exist for x + y + z = 8?', o: ['28', '36', '45', '56'], a: 2},
            {q: 'In a group of 25 people, what is the minimum number guaranteed to share the same birth month?', o: ['2', '3', '13', '25'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'quant', t: 'Quantitative Aptitude',
      topics: [
        {
          t: 'Logical Reasoning & Number Theory',
          learn: '<div class="learn-section"><div class="learn-h">Divisibility Rules</div><p class="learn-p">Divisibility rules are shortcuts to determine whether a number is divisible by another without performing full division. Mastering these is essential for aptitude tests and competitive programming.</p><table class="learn-table"><tr><th>Divisor</th><th>Rule</th><th>Example</th></tr><tr><td>2</td><td>Last digit is even (0, 2, 4, 6, 8)</td><td>4738 &rarr; 8 is even &rarr; divisible</td></tr><tr><td>3</td><td>Sum of digits divisible by 3</td><td>729 &rarr; 7+2+9 = 18 &rarr; divisible</td></tr><tr><td>4</td><td>Last two digits divisible by 4</td><td>1324 &rarr; 24 &divide; 4 = 6 &rarr; divisible</td></tr><tr><td>5</td><td>Last digit is 0 or 5</td><td>9835 &rarr; ends in 5 &rarr; divisible</td></tr><tr><td>6</td><td>Divisible by both 2 and 3</td><td>372 &rarr; even, 3+7+2=12 (div by 3) &rarr; yes</td></tr><tr><td>8</td><td>Last three digits divisible by 8</td><td>7120 &rarr; 120 &divide; 8 = 15 &rarr; divisible</td></tr><tr><td>9</td><td>Sum of digits divisible by 9</td><td>8127 &rarr; 8+1+2+7=18 &rarr; divisible</td></tr><tr><td>11</td><td>Alternating sum of digits divisible by 11</td><td>9185 &rarr; 9-1+8-5=11 &rarr; divisible</td></tr></table><p class="learn-p"><strong>Example:</strong> Is 4,351,728 divisible by 6?</p><p class="learn-p"><strong>Solution:</strong> Last digit is 8 (even) &rarr; divisible by 2. Digit sum: 4+3+5+1+7+2+8 = 30, and 30/3 = 10 &rarr; divisible by 3. Since divisible by both 2 and 3, it is divisible by <strong>6</strong>.</p><p class="learn-p"><strong>Example:</strong> Is 31,218 divisible by 11?</p><p class="learn-p">Alternating sum: 3 - 1 + 2 - 1 + 8 = 11. Since 11 is divisible by 11, yes, <strong>31,218 is divisible by 11</strong>.</p></div><div class="learn-section"><div class="learn-h">Modular Arithmetic</div><p class="learn-p">Modular arithmetic deals with remainders. We write a &equiv; b (mod m) to mean that m divides (a - b). Key properties:</p><pre class="learn-code">(a + b) mod m = ((a mod m) + (b mod m)) mod m\n(a &times; b) mod m = ((a mod m) &times; (b mod m)) mod m\na^n mod m can be computed efficiently via fast exponentiation</pre><p class="learn-p"><strong>Example:</strong> Find the remainder when 2^100 is divided by 7.</p><p class="learn-p"><strong>Solution (using Fermat\'s Little Theorem):</strong> Since 7 is prime and gcd(2,7)=1, Fermat\'s Little Theorem gives 2^6 &equiv; 1 (mod 7). Now 100 = 6 &times; 16 + 4, so 2^100 = (2^6)^16 &times; 2^4 &equiv; 1^16 &times; 16 &equiv; 16 mod 7 &equiv; <strong>2</strong>.</p><p class="learn-p"><strong>Example:</strong> What is the last two digits of 3^200?</p><p class="learn-p">Last two digits = 3^200 mod 100. By Euler\'s theorem, &phi;(100) = 40, so 3^40 &equiv; 1 (mod 100). Since 200 = 40 &times; 5, we get 3^200 &equiv; 1^5 &equiv; <strong>01</strong> (mod 100). The last two digits are 01.</p><div class="learn-tip">Fermat\'s Little Theorem: a^(p-1) &equiv; 1 (mod p) when p is prime and gcd(a,p)=1. Euler\'s Theorem generalizes this: a^&phi;(n) &equiv; 1 (mod n) when gcd(a,n)=1.</div></div><div class="learn-section"><div class="learn-h">Cyclicity &mdash; Unit Digit Patterns</div><p class="learn-p">The unit digit of a^n repeats in a cycle. To find the unit digit of a large power, find the cycle length and use modular arithmetic:</p><table class="learn-table"><tr><th>Last digit of base</th><th>Cycle of unit digits</th><th>Cycle length</th></tr><tr><td>0, 1, 5, 6</td><td>Always same digit</td><td>1</td></tr><tr><td>2</td><td>2, 4, 8, 6</td><td>4</td></tr><tr><td>3</td><td>3, 9, 7, 1</td><td>4</td></tr><tr><td>4</td><td>4, 6</td><td>2</td></tr><tr><td>7</td><td>7, 9, 3, 1</td><td>4</td></tr><tr><td>8</td><td>8, 4, 2, 6</td><td>4</td></tr><tr><td>9</td><td>9, 1</td><td>2</td></tr></table><p class="learn-p"><strong>Example:</strong> Find the unit digit of 7^123.</p><p class="learn-p">Cycle of 7: {7, 9, 3, 1}, length 4. 123 mod 4 = 3 &rarr; third in cycle = <strong>3</strong>.</p><p class="learn-p"><strong>Example:</strong> Find the unit digit of 2^2024 + 3^2024.</p><p class="learn-p">2 cycle: {2,4,8,6}, 2024 mod 4 = 0 &rarr; 4th position = 6. 3 cycle: {3,9,7,1}, 2024 mod 4 = 0 &rarr; 4th position = 1. Unit digit = 6 + 1 = <strong>7</strong>.</p></div><div class="learn-section"><div class="learn-h">GCD, LCM &amp; the Euclidean Algorithm</div><p class="learn-p">The <strong>Greatest Common Divisor</strong> (GCD) of two integers is the largest integer that divides both. The <strong>Euclidean Algorithm</strong> computes it efficiently:</p><pre class="learn-code">gcd(a, b) = gcd(b, a mod b),  base case: gcd(a, 0) = a</pre><p class="learn-p"><strong>Example:</strong> Find gcd(252, 105).</p><p class="learn-p">252 = 2 &times; 105 + 42 &rarr; gcd(252, 105) = gcd(105, 42). 105 = 2 &times; 42 + 21 &rarr; gcd(105, 42) = gcd(42, 21). 42 = 2 &times; 21 + 0 &rarr; gcd(42, 21) = <strong>21</strong>.</p><p class="learn-p">The <strong>Least Common Multiple</strong> is related by: lcm(a, b) = |a &times; b| / gcd(a, b).</p><p class="learn-p"><strong>Example:</strong> lcm(12, 18) = (12 &times; 18) / gcd(12, 18) = 216 / 6 = <strong>36</strong>.</p><p class="learn-p"><strong>Bezout\'s Identity:</strong> For any integers a, b, there exist integers x, y such that ax + by = gcd(a, b). The Extended Euclidean Algorithm finds these coefficients.</p></div><div class="learn-section"><div class="learn-h">Puzzle Solving Strategies</div><p class="learn-p">Logical reasoning puzzles appear frequently in aptitude tests. Common strategies include:</p><ul class="learn-list"><li><strong>Work backwards:</strong> Start from the desired end state and reverse engineer the steps.</li><li><strong>Invariant analysis:</strong> Find a quantity that never changes regardless of operations performed.</li><li><strong>Parity arguments:</strong> Use odd/even properties to prove impossibility or narrow down answers.</li><li><strong>Extreme cases:</strong> Test the smallest and largest possible inputs to gain insight.</li></ul><p class="learn-p"><strong>Example (Clock Puzzle):</strong> At what time between 3 and 4 o\'clock do the hour and minute hands coincide?</p><p class="learn-p"><strong>Solution:</strong> At 3:00, the minute hand is at 0&deg; and the hour hand is at 90&deg;. The minute hand moves at 6&deg;/min, the hour hand at 0.5&deg;/min. They coincide when 6t = 90 + 0.5t &rarr; 5.5t = 90 &rarr; t = 90/5.5 = <strong>16 and 4/11 minutes</strong> past 3.</p><p class="learn-p"><strong>Example (River Crossing):</strong> Three missionaries and three cannibals must cross a river. The boat holds at most 2 people. If cannibals ever outnumber missionaries on either bank, the missionaries are eaten. Find a solution.</p><p class="learn-p"><strong>Solution strategy:</strong> This is a classic state-space search problem. The key insight is that at least one person must return with the boat after each crossing. The solution requires 11 crossings. Model states as (M_left, C_left, boat_side) and use BFS to find the shortest valid path.</p><div class="learn-warn">In puzzle problems, always verify your answer satisfies ALL constraints. A common error is finding a solution that violates a constraint during an intermediate step.</div></div><div class="learn-section"><div class="learn-h">Prime Numbers &amp; Prime Factorization</div><p class="learn-p">A prime number has exactly two distinct positive divisors: 1 and itself. The <strong>Fundamental Theorem of Arithmetic</strong> states every integer &gt; 1 has a unique prime factorization.</p><pre class="learn-code">Number of divisors: if n = p1^a1 &times; p2^a2 &times; ... &times; pk^ak\nthen d(n) = (a1+1)(a2+1)...(ak+1)\n\nSum of divisors:\n&sigma;(n) = (p1^(a1+1)-1)/(p1-1) &times; ... &times; (pk^(ak+1)-1)/(pk-1)</pre><p class="learn-p"><strong>Example:</strong> Find the number of divisors of 360.</p><p class="learn-p">360 = 2^3 &times; 3^2 &times; 5^1. Number of divisors = (3+1)(2+1)(1+1) = 4 &times; 3 &times; 2 = <strong>24</strong>.</p><p class="learn-p"><strong>Example:</strong> Find the sum of divisors of 12.</p><p class="learn-p">12 = 2^2 &times; 3^1. &sigma;(12) = (2^3 - 1)/(2 - 1) &times; (3^2 - 1)/(3 - 1) = 7/1 &times; 8/2 = 7 &times; 4 = <strong>28</strong>.</p><p class="learn-p">The <strong>Sieve of Eratosthenes</strong> efficiently finds all primes up to n in O(n log log n) time. For primality testing of large numbers, Miller-Rabin is the go-to probabilistic test.</p><div class="learn-complexity"><strong>Complexity:</strong> Sieve of Eratosthenes &mdash; Time: O(n log log n), Space: O(n). Trial division for primality &mdash; O(&radic;n).</div></div><div class="learn-section"><div class="learn-h">Arithmetic &amp; Geometric Progressions</div><p class="learn-p">Sequences and series appear frequently in aptitude tests:</p><pre class="learn-code">Arithmetic Progression (AP):\n  nth term: a_n = a + (n-1)d\n  Sum of n terms: S_n = n/2 &times; [2a + (n-1)d] = n/2 &times; (first + last)\n\nGeometric Progression (GP):\n  nth term: a_n = a &times; r^(n-1)\n  Sum of n terms: S_n = a(r^n - 1)/(r - 1),  r &ne; 1\n  Sum to infinity (|r| &lt; 1): S = a/(1 - r)\n\nCommon sums:\n  1 + 2 + ... + n = n(n+1)/2\n  1&sup2; + 2&sup2; + ... + n&sup2; = n(n+1)(2n+1)/6\n  1&sup3; + 2&sup3; + ... + n&sup3; = [n(n+1)/2]&sup2;</pre><p class="learn-p"><strong>Example:</strong> Find the sum of the first 20 terms of AP: 3, 7, 11, 15, ...</p><p class="learn-p">a = 3, d = 4, n = 20. S_20 = 20/2 &times; [2(3) + 19(4)] = 10 &times; 82 = <strong>820</strong>.</p><p class="learn-p"><strong>Example:</strong> Find the sum to infinity: 1 + 1/2 + 1/4 + 1/8 + ...</p><p class="learn-p">a = 1, r = 1/2. S = 1/(1 - 1/2) = <strong>2</strong>.</p><div class="learn-tip"><strong>AM &ge; GM &ge; HM</strong> (for positive numbers): AM = (a+b)/2, GM = &radic;(ab), HM = 2ab/(a+b). Equality holds when a = b. Useful for optimization problems without calculus.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you find the last digit of a large power?</b><br>A: Use cyclicity: last digits of powers repeat in cycles. 2: cycle of 4 (2,4,8,6). 3: cycle of 4 (3,9,7,1). 7: cycle of 4 (7,9,3,1). Find the remainder of the exponent divided by the cycle length. Example: last digit of 7^83 — cycle is 4, 83 mod 4 = 3, so last digit = 7^3\'s last digit = 3.</p><p class="learn-p"><b>Q2: State and apply Fermat\'s Little Theorem.</b><br>A: If p is prime and gcd(a,p)=1, then a^(p-1) ≡ 1 (mod p). To find a^n mod p: reduce the exponent mod (p-1). Example: 2^100 mod 7. Since 7 is prime: 2^6 ≡ 1 (mod 7). 100 = 6*16 + 4, so 2^100 ≡ 2^4 = 16 ≡ 2 (mod 7).</p></div>',
          code: `# Logical Reasoning & Number Theory - Python Implementations

from math import gcd, isqrt

# --- Divisibility Checker ---
def check_divisibility(n, rules=None):
    """Check divisibility by common divisors using rules."""
    if rules is None:
        rules = [2, 3, 4, 5, 6, 8, 9, 11]
    results = {}
    for d in rules:
        results[d] = (n % d == 0)
    return results

n = 4351728
print(f"Divisibility of {n}:")
for divisor, result in check_divisibility(n).items():
    print(f"  By {divisor}: {result}")

# --- Modular Exponentiation (Fast Power) ---
def mod_pow(base, exp, mod):
    """Compute base^exp mod mod using binary exponentiation."""
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:  # exp is odd
            result = (result * base) % mod
        exp >>= 1
        base = (base * base) % mod
    return result

print(f"2^100 mod 7 = {mod_pow(2, 100, 7)}")     # 2
print(f"3^200 mod 100 = {mod_pow(3, 200, 100)}")  # 1

# --- Euclidean Algorithm (GCD with steps) ---
def gcd_steps(a, b):
    """Compute GCD showing each step of the Euclidean algorithm."""
    steps = []
    while b:
        steps.append(f"gcd({a}, {b}) -> {a} = {a // b} * {b} + {a % b}")
        a, b = b, a % b
    steps.append(f"Result: {a}")
    return a, steps

result, steps = gcd_steps(252, 105)
print("GCD(252, 105) steps:")
for s in steps:
    print(f"  {s}")

# --- Extended Euclidean Algorithm ---
def extended_gcd(a, b):
    """Return (gcd, x, y) such that a*x + b*y = gcd(a, b)."""
    if a == 0:
        return b, 0, 1
    g, x1, y1 = extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return g, x, y

g, x, y = extended_gcd(252, 105)
print(f"Extended GCD: 252*{x} + 105*{y} = {g}")

# --- Sieve of Eratosthenes ---
def sieve(limit):
    """Find all primes up to limit using Sieve of Eratosthenes."""
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, isqrt(limit) + 1):
        if is_prime[i]:
            for j in range(i * i, limit + 1, i):
                is_prime[j] = False
    return [i for i in range(2, limit + 1) if is_prime[i]]

primes = sieve(100)
print(f"Primes up to 100: {primes}")
print(f"Count: {len(primes)}")

# --- Prime Factorization ---
def prime_factors(n):
    """Return prime factorization as dict {prime: exponent}."""
    factors = {}
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1
    if n > 1:
        factors[n] = factors.get(n, 0) + 1
    return factors

# Number of divisors and sum of divisors
def count_divisors(n):
    """Count divisors using prime factorization."""
    factors = prime_factors(n)
    count = 1
    for exp in factors.values():
        count *= (exp + 1)
    return count

def sum_divisors(n):
    """Sum of divisors using prime factorization formula."""
    factors = prime_factors(n)
    total = 1
    for p, a in factors.items():
        total *= (p ** (a + 1) - 1) // (p - 1)
    return total

print(f"360 = {prime_factors(360)}")
print(f"Number of divisors of 360: {count_divisors(360)}")  # 24
print(f"Sum of divisors of 12: {sum_divisors(12)}")         # 28

# --- Euler's Totient Function ---
def euler_totient(n):
    """Compute phi(n) - count of integers 1..n coprime to n."""
    result = n
    p = 2
    temp = n
    while p * p <= temp:
        if temp % p == 0:
            while temp % p == 0:
                temp //= p
            result -= result // p
        p += 1
    if temp > 1:
        result -= result // temp
    return result

print(f"phi(100) = {euler_totient(100)}")  # 40

# --- Clock Hands Coincidence ---
def clock_coincidence(start_hour):
    """Minutes past start_hour when hands coincide."""
    # At start_hour:00, hour hand is at start_hour*30 degrees
    # Minute hand at 0 degrees
    # Minute: 6 deg/min, Hour: 0.5 deg/min
    # 6t = start_hour*30 + 0.5t -> 5.5t = start_hour*30
    from fractions import Fraction
    t = Fraction(start_hour * 30 * 2, 11)
    return t

t = clock_coincidence(3)
print(f"Hands coincide at 3:{t} = 3:{float(t):.4f} min")`,
          problems: [
            ['Number Theory - GFG Practice', 'https://www.geeksforgeeks.org/number-theory-competitive-programming/', 'Easy'],
            ['Project Euler #3 - Largest Prime Factor', 'https://projecteuler.net/problem=3', 'Easy'],
            ['Modular Arithmetic - HackerRank', 'https://www.hackerrank.com/contests/projecteuler/challenges/euler029', 'Medium'],
            ['Project Euler #69 - Totient Maximum', 'https://projecteuler.net/problem=69', 'Hard']
          ],
          mcqs: [
            {q: 'What is the remainder when 2^100 is divided by 7?', o: ['1', '2', '4', '6'], a: 1},
            {q: 'How many divisors does 360 have?', o: ['12', '18', '24', '36'], a: 2},
            {q: 'At what time between 3 and 4 o\'clock do the hour and minute hands of a clock coincide?', o: ['3:15', '3:16 and 4/11 min', '3:18', '3:20'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'arith', t: 'Arithmetic & Algebra',
      topics: [
        {
          t: 'Time, Speed & Distance',
          learn: '<div class="learn-section"><div class="learn-h">Fundamental Formula</div><p class="learn-p"><code>Speed = Distance / Time</code>. Units must be consistent: km/hr with km and hours, m/s with meters and seconds.</p><div class="learn-code">Conversions:\n  km/hr → m/s: multiply by 5/18\n  m/s → km/hr: multiply by 18/5\n\nExample: 72 km/hr = 72 × 5/18 = 20 m/s</div></div><div class="learn-section"><div class="learn-h">Relative Speed</div><table class="learn-table"><tr><th>Direction</th><th>Relative Speed</th></tr><tr><td>Same direction</td><td>|S1 − S2|</td></tr><tr><td>Opposite direction</td><td>S1 + S2</td></tr></table></div><div class="learn-section"><div class="learn-h">Average Speed</div><p class="learn-p">If a person travels distance d at speed S1 and returns at speed S2:</p><div class="learn-code">Average Speed = 2 × S1 × S2 / (S1 + S2)  (Harmonic mean)\n\nNOT (S1 + S2) / 2 — that\'s only correct for equal time, not equal distance.</div><div class="learn-warn"><b>Common mistake:</b> Average speed ≠ average of speeds. Use harmonic mean when distances are equal, arithmetic mean when times are equal.</div></div><div class="learn-section"><div class="learn-h">Trains</div><ul class="learn-list"><li>Train passing a pole/person: distance = length of train</li><li>Train passing a platform: distance = length of train + length of platform</li><li>Two trains crossing each other: distance = sum of both lengths, speed = relative speed</li></ul><div class="learn-code">Train of length 200m crosses a 300m platform in 25 seconds.\nDistance = 200 + 300 = 500m\nSpeed = 500/25 = 20 m/s = 72 km/hr</div></div><div class="learn-section"><div class="learn-h">Boats & Streams</div><p class="learn-p">Let boat speed in still water = B, stream speed = S.</p><table class="learn-table"><tr><th>Direction</th><th>Effective Speed</th></tr><tr><td>Downstream (with stream)</td><td>B + S</td></tr><tr><td>Upstream (against stream)</td><td>B − S</td></tr></table><div class="learn-code">B = (Downstream + Upstream) / 2\nS = (Downstream − Upstream) / 2</div></div><div class="learn-section"><div class="learn-h">Races &amp; Head Starts</div><p class="learn-p">If A beats B by d meters in a race of D meters: when A finishes D, B has covered (D - d) meters. Speed ratio = D : (D - d).</p><div class="learn-code">A beats B by 20m in a 200m race.\nWhen A runs 200m, B runs 180m.\nSpeed ratio A:B = 200:180 = 10:9\n\nIf they race 100m, A beats B by:\n  100 − 100 × (9/10) = 100 − 90 = 10m</div><p class="learn-p"><strong>Dead Heat:</strong> Both finish at the same time. If A gives B a head start of d meters in a D-meter race and they tie, speed ratio A:B = D : (D - d).</p></div><div class="learn-section"><div class="learn-h">Circular Track &amp; Meeting Problems</div><table class="learn-table"><tr><th>Scenario</th><th>Time to first meeting</th></tr><tr><td>Circular track, same direction</td><td>L / |S1 − S2|</td></tr><tr><td>Circular track, opposite direction</td><td>L / (S1 + S2)</td></tr><tr><td>Moving towards each other (distance D)</td><td>D / (S1 + S2)</td></tr></table><div class="learn-code">A and B start from same point on a 300m circular track.\nA: 5 m/s, B: 3 m/s, same direction.\nFirst meeting: 300 / (5 − 3) = 150 seconds\nOpposite direction: 300 / (5 + 3) = 37.5 seconds</div><p class="learn-p"><strong>Meeting point:</strong> Two people start from cities 240 km apart, moving toward each other at 60 km/hr and 80 km/hr. They meet after 240/(60+80) = 240/140 = <strong>12/7 hours</strong>, at a point 60 &times; 12/7 = <strong>720/7 &approx; 102.9 km</strong> from the first city.</p><div class="learn-tip"><strong>Multiple meetings:</strong> On a circular track (same direction), the n-th meeting happens at time n &times; L / |S1 − S2|. The faster person completes exactly one extra lap between consecutive meetings.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you calculate average speed for a round trip?</b><br>A: Average speed = 2*S1*S2 / (S1+S2) (harmonic mean), NOT (S1+S2)/2. This is because equal distances are covered, not equal times. Example: going at 40 km/hr and returning at 60 km/hr, average = 2*40*60/100 = 48 km/hr, not 50.</p><p class="learn-p"><b>Q2: Explain the concept of relative speed.</b><br>A: Same direction: relative speed = |S1 - S2|. Opposite direction: relative speed = S1 + S2. For trains crossing: use relative speed with combined length. Example: two trains of 150m and 250m approaching at 60 and 40 km/hr. Relative speed = 100 km/hr = 250/9 m/s. Time = 400 / (250/9) = 14.4 seconds.</p></div>',
          code: `# Time, Speed & Distance — Python Solutions

def average_speed(s1, s2):
    """Average speed for equal distances (harmonic mean)"""
    return 2 * s1 * s2 / (s1 + s2)

def train_crossing_platform(train_len, platform_len, time_sec):
    """Speed of train crossing a platform"""
    distance = train_len + platform_len
    speed_ms = distance / time_sec
    speed_kmh = speed_ms * 18 / 5
    return speed_kmh

def boats_and_streams(downstream_speed, upstream_speed):
    """Find boat speed and stream speed"""
    boat = (downstream_speed + upstream_speed) / 2
    stream = (downstream_speed - upstream_speed) / 2
    return boat, stream

def circular_track_meeting(circumference, s1, s2):
    """Time for two people to meet on a circular track"""
    # Same direction
    if s1 != s2:
        same_dir = circumference / abs(s1 - s2)
    else:
        same_dir = float('inf')
    # Opposite direction
    opp_dir = circumference / (s1 + s2)
    return same_dir, opp_dir

# Examples
print(f"Avg speed (40,60 km/hr): {average_speed(40, 60)} km/hr")  # 48, not 50
print(f"Train speed: {train_crossing_platform(200, 300, 25)} km/hr")  # 72
print(f"Boat, Stream: {boats_and_streams(20, 10)}")  # (15, 5)
print(f"Meet times: {circular_track_meeting(600, 10, 8)}")  # (300, 33.33)`,
          problems: [
            ['Boats & Streams', 'https://www.geeksforgeeks.org/boats-and-streams/', 'Medium'],
            ['Circular Track Problems', 'https://www.geeksforgeeks.org/circular-motion/', 'Hard']
          ],
          mcqs: [
            {q: 'A car covers equal distances at 40 km/hr and 60 km/hr. Average speed?', o: ['50 km/hr', '48 km/hr', '45 km/hr', '55 km/hr'], a: 1},
            {q: 'A 150m train passes a 250m platform in 20 seconds. Speed in km/hr?', o: ['72', '54', '36', '90'], a: 0},
            {q: 'A boat goes 20 km downstream in 2 hrs and returns in 4 hrs. Stream speed?', o: ['5 km/hr', '2.5 km/hr', '7.5 km/hr', '10 km/hr'], a: 1}
          ]
        },
        {
          t: 'Time & Work',
          learn: '<div class="learn-section"><div class="learn-h">Work Rate Concept</div><p class="learn-p">If A can do a work in <b>n days</b>, A\'s rate = <b>1/n per day</b>. If A and B work together, combined rate = 1/a + 1/b. Time to complete = 1 / (combined rate).</p><div class="learn-code">A completes in 10 days → rate = 1/10 per day\nB completes in 15 days → rate = 1/15 per day\nTogether: 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6\nTime together = 6 days</div></div><div class="learn-section"><div class="learn-h">LCM Method (Faster!)</div><p class="learn-p">Instead of fractions, assume total work = LCM of individual times. This makes rates integers — much faster to compute.</p><div class="learn-code">A: 10 days, B: 15 days\nTotal work = LCM(10, 15) = 30 units\nA\'s rate = 30/10 = 3 units/day\nB\'s rate = 30/15 = 2 units/day\nTogether = 5 units/day → Time = 30/5 = 6 days</div><div class="learn-tip"><b>Use LCM method in interviews</b> — it avoids fraction arithmetic and is much less error-prone.</div></div><div class="learn-section"><div class="learn-h">Pipes & Cisterns</div><p class="learn-p">Same concept as Time & Work. Filling pipes have positive rates, emptying pipes have negative rates.</p><div class="learn-code">Pipe A fills in 12 hrs → rate = +1/12\nPipe B fills in 15 hrs → rate = +1/15\nPipe C empties in 20 hrs → rate = -1/20\n\nLCM(12,15,20) = 60 units\nA = +5, B = +4, C = -3\nNet = 5 + 4 - 3 = 6 units/hr\nTime = 60/6 = 10 hours</div></div><div class="learn-section"><div class="learn-h">Efficiency Problems</div><p class="learn-p">If A is twice as efficient as B, and B finishes in 30 days, then A finishes in 15 days. Efficiency ratio = Inverse of time ratio.</p><div class="learn-code">Efficiency : Time\n   2x      : t/2\n   3x      : t/3\n\nA is 50% more efficient than B:\nIf B takes 30 days, A takes 30/1.5 = 20 days</div></div><div class="learn-section"><div class="learn-h">Partial Work &amp; Alternate Days</div><p class="learn-p"><strong>Leaving midway:</strong> Calculate work done by the first worker, then find time for the remaining worker to finish the rest.</p><div class="learn-code">A: 10 days, B: 15 days. LCM = 30 units\nA: 3 units/day, B: 2 units/day\nTogether for 4 days: (3+2) &times; 4 = 20 units\nRemaining: 30 - 20 = 10 units\nB alone: 10/2 = 5 more days. Total = 4 + 5 = 9 days</div><p class="learn-p"><strong>Alternate days:</strong> A and B work on alternate days (A on day 1, B on day 2, ...).</p><div class="learn-code">A: 12 days, B: 18 days. LCM = 36 units\nA: 3 units/day, B: 2 units/day\n2-day cycle = 3 + 2 = 5 units\n7 cycles (14 days) = 35 units\nRemaining 1 unit on Day 15 (A): 1/3 of a day\nTotal = 14 + 1/3 = 14.33 days</div></div><div class="learn-section"><div class="learn-h">Men-Days &amp; Work-Wages</div><p class="learn-p"><strong>Men-Days:</strong> Total work = Workers &times; Days. If M1 workers finish in D1 days, then M2 workers need D2 days where M1 &times; D1 = M2 &times; D2.</p><div class="learn-code">15 workers finish in 12 days. Days for 20 workers?\n15 &times; 12 = 20 &times; D &rarr; D = 180/20 = 9 days\n\nExtended: M1 &times; D1 &times; H1 / W1 = M2 &times; D2 &times; H2 / W2\n(H = hours/day, W = amount of work)</div><p class="learn-p"><strong>Work and Wages:</strong> Wages are split in ratio of work done (i.e., ratio of efficiencies if all work for the same duration).</p><div class="learn-code">A: 10 days, B: 15 days. Total wage = Rs.5000\nWork ratio = 1/10 : 1/15 = 3:2\nA gets 5000 &times; 3/5 = Rs.3000, B gets Rs.2000</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How does the LCM method simplify work problems?</b><br>A: Take LCM of individual completion times as total work units. Each worker\'s rate = LCM / their time. Example: A finishes in 10 days, B in 15 days. LCM(10,15) = 30 units. A\'s rate = 3 units/day, B\'s rate = 2 units/day. Together = 5 units/day. Time = 30/5 = 6 days. LCM avoids messy fractions.</p><p class="learn-p"><b>Q2: How do you handle pipes filling and draining simultaneously?</b><br>A: Treat filling pipes as positive work rate and draining pipes as negative. Net rate = sum of all rates. Example: pipe A fills in 12 hrs (+1/12), pipe B drains in 8 hrs (-1/8). Net = 1/12 - 1/8 = -1/24. Negative means draining — the tank empties in 24 hrs if it was full.</p></div>',
          code: `# Time & Work — Python Solutions

from math import gcd

def lcm(a, b):
    return a * b // gcd(a, b)

def combined_work_time(days_list):
    """Find time when multiple workers work together using LCM method"""
    total_work = days_list[0]
    for d in days_list[1:]:
        total_work = lcm(total_work, d)

    total_rate = sum(total_work // d for d in days_list)
    return total_work / total_rate

def pipes_and_cisterns(fill_pipes, empty_pipes):
    """Find time to fill tank with fill and empty pipes"""
    all_times = fill_pipes + empty_pipes
    total = all_times[0]
    for t in all_times[1:]:
        total = lcm(total, t)

    net_rate = sum(total // t for t in fill_pipes) - sum(total // t for t in empty_pipes)
    if net_rate <= 0:
        return float('inf')  # tank never fills
    return total / net_rate

def work_with_alternating(a_days, b_days):
    """A and B work on alternate days, A starts. Find total days."""
    total = lcm(a_days, b_days)
    a_rate = total // a_days
    b_rate = total // b_days
    two_day_work = a_rate + b_rate

    full_cycles = total // two_day_work
    remaining = total % two_day_work
    days = full_cycles * 2
    if remaining > 0:
        days += 1
        remaining -= a_rate
    if remaining > 0:
        days += 1
    return days

# Examples
print(f"A(10 days) + B(15 days) = {combined_work_time([10, 15])} days")  # 6.0
print(f"Fill(12h,15h) Drain(20h) = {pipes_and_cisterns([12,15], [20])} hrs")  # 10.0`,
          problems: [
            ['Time and Work Problems', 'https://www.geeksforgeeks.org/time-and-work/', 'Easy'],
            ['Pipes and Cisterns', 'https://www.geeksforgeeks.org/pipes-and-cisterns/', 'Medium']
          ],
          mcqs: [
            {q: 'A finishes in 10 days, B in 15 days. Working together, they finish in:', o: ['5 days', '6 days', '8 days', '12.5 days'], a: 1},
            {q: 'In the LCM method, total work is assumed to be:', o: ['100 units', 'LCM of all individual times', 'Sum of all times', '1 unit'], a: 1},
            {q: 'A pipe fills in 6 hrs, another empties in 8 hrs. Net time to fill?', o: ['24 hrs', '14 hrs', '7 hrs', '3.4 hrs'], a: 0}
          ]
        },
        {
          t: 'Percentages, Profit & Loss',
          learn: '<div class="learn-section"><div class="learn-h">Percentage Basics</div><p class="learn-p"><code>x% of N = x × N / 100</code>. If a quantity increases by x%, multiply by <code>(1 + x/100)</code>. If it decreases by x%, multiply by <code>(1 - x/100)</code>.</p><div class="learn-code">Successive percentages:\nIf price increases by a% then b%, net effect:\n  = (a + b + ab/100)%\n\nExample: 20% increase then 10% decrease:\n  = 20 + (-10) + 20×(-10)/100\n  = 20 - 10 - 2 = 8% net increase</div></div><div class="learn-section"><div class="learn-h">Profit & Loss</div><table class="learn-table"><tr><th>Term</th><th>Formula</th></tr><tr><td>Profit</td><td>SP − CP (when SP > CP)</td></tr><tr><td>Loss</td><td>CP − SP (when CP > SP)</td></tr><tr><td>Profit %</td><td>(Profit / CP) × 100</td></tr><tr><td>Loss %</td><td>(Loss / CP) × 100</td></tr><tr><td>SP from Profit%</td><td>CP × (1 + P%/100)</td></tr><tr><td>SP from Loss%</td><td>CP × (1 − L%/100)</td></tr></table><div class="learn-code">Markup & Discount:\n  Marked Price (MP) = CP × (1 + markup%/100)\n  Selling Price (SP) = MP × (1 - discount%/100)\n\nDishonest Dealer:\n  Uses 900g weight instead of 1000g\n  Profit% = (True weight - False weight) / False weight × 100\n           = (1000 - 900) / 900 × 100 = 11.11%</div></div><div class="learn-section"><div class="learn-h">Simple & Compound Interest</div><div class="learn-code">Simple Interest: SI = P × R × T / 100\nAmount = P + SI = P(1 + RT/100)\n\nCompound Interest: A = P × (1 + R/100)^T\nCI = A - P\n\nHalf-yearly: A = P × (1 + R/200)^(2T)\nQuarterly:   A = P × (1 + R/400)^(4T)</div><div class="learn-tip"><b>Interview tip:</b> Compound interest questions often appear. For 2 years, CI - SI = P(R/100)². Know this shortcut.</div></div><div class="learn-section"><div class="learn-h">Population Growth/Decay</div><div class="learn-code">Growth: P_final = P_initial × (1 + rate/100)^years\nDecay:  P_final = P_initial × (1 - rate/100)^years\n\nDepreciation of machinery follows the decay formula.</div></div><div class="learn-section"><div class="learn-h">Ratio, Proportion &amp; Partnership</div><p class="learn-p"><strong>Ratio &amp; Proportion:</strong> If a:b = c:d then ad = bc (cross multiplication). Componendo-Dividendo: if a/b = c/d then (a+b)/(a-b) = (c+d)/(c-d).</p><div class="learn-code">Divide Rs.1200 among A, B, C in ratio 2:3:5.\nTotal parts = 2+3+5 = 10\nA = 1200 &times; 2/10 = Rs.240\nB = 1200 &times; 3/10 = Rs.360\nC = 1200 &times; 5/10 = Rs.600</div><p class="learn-p"><strong>Partnership:</strong> Profit is split in the ratio of (Investment &times; Time) for each partner.</p><div class="learn-code">A invests Rs.5000 for 12 months\nB invests Rs.8000 for 9 months\nRatio = 5000&times;12 : 8000&times;9 = 60000 : 72000 = 5:6\nIf total profit = Rs.22000:\nA gets 22000 &times; 5/11 = Rs.10000\nB gets 22000 &times; 6/11 = Rs.12000</div></div><div class="learn-section"><div class="learn-h">Mixture &amp; Alligation</div><p class="learn-p"><strong>Alligation rule:</strong> To find the ratio in which two items at different prices must be mixed to get a mixture at a given price:</p><div class="learn-code">        Cheaper (C)         Dearer (D)\n              \\             /\n               Mean (M)\n              /             \\\n         (D - M)         (M - C)\n\nRatio of Cheaper : Dearer = (D - M) : (M - C)</div><p class="learn-p"><strong>Example:</strong> Mix milk at Rs.60/L with water (Rs.0/L) to get mixture at Rs.45/L.</p><p class="learn-p">Ratio = (60 - 45) : (45 - 0) = 15:45 = <strong>1:3</strong>. For every 1 part water, 3 parts milk.</p><p class="learn-p"><strong>Replacement formula:</strong> If a container has x litres of liquid A, and y litres are replaced with liquid B repeatedly n times:</p><div class="learn-code">Amount of A left = x &times; (1 - y/x)^n\n\nExample: 20L milk, 4L replaced with water 3 times:\nMilk left = 20 &times; (1 - 4/20)^3 = 20 &times; (4/5)^3 = 20 &times; 64/125 = 10.24L</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the shortcut for successive percentage changes?</b><br>A: For successive changes of a% and b%: net change = a + b + (a*b)/100. Example: 20% increase then 20% decrease = 20 + (-20) + 20*(-20)/100 = -4%. This always results in a net loss when the same percentage is applied as increase then decrease.</p><p class="learn-p"><b>Q2: How does compound interest differ from simple interest?</b><br>A: SI = P*R*T/100 (linear growth). CI = P*(1+R/100)^T - P (exponential growth). For year 1, SI = CI. From year 2 onwards, CI > SI because interest earns interest. The difference after 2 years = P*(R/100)^2. For T=2: CI - SI = P*R^2/10000.</p></div>',
          code: `# Percentages, Profit & Loss — Python Solutions

def successive_percentage(a, b):
    """Net effect of successive percentage changes"""
    return a + b + a * b / 100

def profit_loss_percent(cp, sp):
    """Calculate profit/loss percentage"""
    if sp > cp:
        return ("Profit", (sp - cp) / cp * 100)
    else:
        return ("Loss", (cp - sp) / cp * 100)

def dishonest_dealer(true_weight, false_weight):
    """Profit% from using false weight"""
    return (true_weight - false_weight) / false_weight * 100

def compound_interest(principal, rate, time, n=1):
    """Compound interest (n = compounding frequency per year)"""
    amount = principal * (1 + rate / (100 * n)) ** (n * time)
    return amount - principal

def si_ci_difference_2years(principal, rate):
    """Shortcut: CI - SI for 2 years"""
    return principal * (rate / 100) ** 2

# Examples
print(f"20% up then 10% down = {successive_percentage(20, -10)}% net")  # 8%
print(f"CP=800, SP=920: {profit_loss_percent(800, 920)}")  # Profit, 15%
print(f"Dishonest (1000g vs 900g): {dishonest_dealer(1000, 900):.2f}%")  # 11.11%
print(f"CI on 10000 at 10% for 2 yrs: {compound_interest(10000, 10, 2):.2f}")  # 2100
print(f"CI-SI for 2 yrs: {si_ci_difference_2years(10000, 10)}")  # 100`,
          problems: [
            ['Percentage Problems', 'https://www.geeksforgeeks.org/percentage/', 'Easy'],
            ['Profit and Loss', 'https://www.geeksforgeeks.org/profit-and-loss/', 'Easy'],
            ['Simple & Compound Interest', 'https://www.geeksforgeeks.org/simple-interest/', 'Medium']
          ],
          mcqs: [
            {q: 'A 20% increase followed by a 20% decrease gives a net change of:', o: ['0%', '-4%', '+4%', '-2%'], a: 1},
            {q: 'CI - SI for 2 years on Rs.5000 at 10% is:', o: ['Rs.50', 'Rs.100', 'Rs.25', 'Rs.75'], a: 0},
            {q: 'A shopkeeper marks goods 40% above CP and gives 10% discount. Profit%?', o: ['30%', '26%', '24%', '20%'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'logic', t: 'Logical Reasoning',
      topics: [
        {
          t: 'Data Interpretation',
          learn: '<div class="learn-section"><div class="learn-h">What is Data Interpretation?</div><p class="learn-p"><b>Data Interpretation (DI)</b> tests your ability to read data from tables, charts, and graphs and answer questions involving calculations, comparisons, and trends. Common in quant firm aptitude tests.</p></div><div class="learn-section"><div class="learn-h">Types of DI</div><table class="learn-table"><tr><th>Type</th><th>Description</th><th>Key Skills</th></tr><tr><td>Tables</td><td>Raw numerical data in rows and columns</td><td>Percentage change, ratios, averages</td></tr><tr><td>Bar Charts</td><td>Compare categories or track changes over time</td><td>Visual comparison, growth rate</td></tr><tr><td>Pie Charts</td><td>Show parts of a whole (proportions)</td><td>Percentage of total, degree calculation</td></tr><tr><td>Line Graphs</td><td>Show trends over time</td><td>Rate of change, peak/trough identification</td></tr><tr><td>Caselets</td><td>Data embedded in paragraphs (no chart)</td><td>Extract data, form equations</td></tr></table></div><div class="learn-section"><div class="learn-h">Common Calculation Shortcuts</div><div class="learn-code">Percentage change = (New - Old) / Old × 100\n\nRatio comparison: a/b vs c/d → compare a×d vs b×c (cross-multiply)\n\nApproximation tricks:\n  1/3 ≈ 33.3%    1/6 ≈ 16.7%    1/7 ≈ 14.3%\n  1/8 = 12.5%     1/9 ≈ 11.1%    1/11 ≈ 9.1%\n  1/12 ≈ 8.3%     1/13 ≈ 7.7%    1/15 ≈ 6.7%\n\nCAGR = (Final/Initial)^(1/n) - 1\n\nWeighted average: Σ(value × weight) / Σ(weight)</div></div><div class="learn-section"><div class="learn-h">Strategy</div><ol class="learn-list"><li><b>Read the question first</b> — know what you\'re looking for before studying the data</li><li><b>Approximate</b> — exact calculations waste time; round to nearest friendly numbers</li><li><b>Use elimination</b> — often 2-3 options can be eliminated by rough estimation</li><li><b>Check units</b> — lakhs vs crores, thousands vs millions</li></ol><div class="learn-tip"><b>Speed tip:</b> Practice mental math. Learn to quickly compute 15% of 840 (= 10% + 5% = 84 + 42 = 126). Master fraction-to-percentage conversions.</div></div><div class="learn-section"><div class="learn-h">Worked Example: Table-Based DI</div><p class="learn-p">Revenue (in Rs. Crores) of 5 companies over 3 years:</p><table class="learn-table"><tr><th>Company</th><th>2021</th><th>2022</th><th>2023</th></tr><tr><td>A</td><td>120</td><td>150</td><td>180</td></tr><tr><td>B</td><td>200</td><td>220</td><td>198</td></tr><tr><td>C</td><td>80</td><td>96</td><td>120</td></tr><tr><td>D</td><td>160</td><td>152</td><td>171</td></tr><tr><td>E</td><td>100</td><td>130</td><td>143</td></tr></table><p class="learn-p"><strong>Q1:</strong> Which company had the highest percentage growth from 2021 to 2023?</p><p class="learn-p">A: (180-120)/120 = 50%. B: (198-200)/200 = -1%. C: (120-80)/80 = <strong>50%</strong>. D: (171-160)/160 = 6.9%. E: (143-100)/100 = 43%. A and C tie at 50%. But check 2-year CAGR: A = (180/120)^(1/2) - 1 &approx; 22.5%. C = (120/80)^(1/2) - 1 &approx; 22.5%. Both identical.</p><p class="learn-p"><strong>Q2:</strong> What is the ratio of total revenue of all companies in 2022 to 2023?</p><p class="learn-p">2022 total = 150+220+96+152+130 = 748. 2023 total = 180+198+120+171+143 = 812. Ratio = 748:812 = <strong>187:203</strong>.</p><p class="learn-p"><strong>Q3:</strong> Company B had a decline in 2023. What was the percentage decline from 2022?</p><p class="learn-p">(220-198)/220 &times; 100 = 22/220 &times; 100 = <strong>10%</strong> decline.</p></div><div class="learn-section"><div class="learn-h">Pie Chart Calculations</div><p class="learn-p">In a pie chart, the total = 360&deg;. If a category is x% of total, its angle = x% &times; 360&deg; = 3.6x degrees.</p><div class="learn-code">Total budget = Rs.50 lakhs. Education sector = 72&deg;\nEducation spending = (72/360) &times; 50 = Rs.10 lakhs\nPercentage = 72/360 &times; 100 = 20%</div><div class="learn-warn"><b>Common DI traps:</b> Confusing absolute values with percentages. A company with higher revenue can still have lower growth rate. Always check whether the question asks for absolute or relative comparisons.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you quickly compare fractions without a calculator?</b><br>A: Cross-multiplication: to compare a/b and c/d, compare a*d with b*c. If a*d > b*c, then a/b > c/d. Example: 7/13 vs 5/9 — 7*9=63 vs 13*5=65. Since 63 < 65, 7/13 < 5/9. Also use benchmark fractions: 7/13 ≈ 0.54 (just over 1/2), 5/9 ≈ 0.56 (closer to 5/9).</p><p class="learn-p"><b>Q2: What is CAGR and when do you use it?</b><br>A: CAGR = (Final/Initial)^(1/n) - 1. It gives the constant annual growth rate that would produce the same final value over n years. Use CAGR to compare growth across different time periods or companies. Unlike simple average growth, CAGR accounts for compounding and smooths out year-to-year volatility.</p></div>',
          code: `# Data Interpretation — Python Helper Functions

def percentage_change(old, new):
    """Calculate percentage change"""
    return (new - old) / old * 100

def cagr(initial, final, years):
    """Compound Annual Growth Rate"""
    return ((final / initial) ** (1 / years) - 1) * 100

def weighted_average(values, weights):
    """Weighted average"""
    return sum(v * w for v, w in zip(values, weights)) / sum(weights)

def ratio_comparison(a, b, c, d):
    """Compare a/b with c/d without division"""
    cross1 = a * d
    cross2 = b * c
    if cross1 > cross2: return f"{a}/{b} > {c}/{d}"
    elif cross1 < cross2: return f"{a}/{b} < {c}/{d}"
    else: return f"{a}/{b} = {c}/{d}"

# DI Practice: Sales data
sales = {2020: 450, 2021: 520, 2022: 610, 2023: 580, 2024: 720}

# Year-over-year growth
for y in range(2021, 2025):
    growth = percentage_change(sales[y-1], sales[y])
    print(f"{y}: {sales[y]} (growth: {growth:+.1f}%)")

# CAGR over 4 years
print(f"\\nCAGR (2020-2024): {cagr(450, 720, 4):.1f}%")

# Weighted average score
subjects = [85, 90, 78, 92]
credits = [4, 3, 3, 2]
print(f"Weighted GPA: {weighted_average(subjects, credits):.1f}")

# Quick ratio comparison
print(ratio_comparison(3, 7, 5, 12))  # 3/7 vs 5/12 → 36 vs 35 → 3/7 > 5/12`,
          problems: [
            ['Data Interpretation Questions', 'https://www.geeksforgeeks.org/data-interpretation/', 'Medium']
          ],
          mcqs: [
            {q: 'CAGR stands for:', o: ['Combined Average Growth Rate', 'Compound Annual Growth Rate', 'Cumulative Annual Gain Ratio', 'Compounded Aggregate Growth Result'], a: 1},
            {q: 'To compare 7/13 and 5/9 quickly, you can:', o: ['Convert both to decimals', 'Cross-multiply: 7×9=63 vs 13×5=65, so 7/13 < 5/9', 'Find the LCM', 'Subtract them'], a: 1},
            {q: 'In a pie chart, a sector representing 25% corresponds to:', o: ['25°', '45°', '90°', '120°'], a: 2}
          ]
        },
        {
          t: 'Puzzles & Logical Arrangements',
          learn: '<div class="learn-section"><div class="learn-h">Types of Logic Puzzles</div><table class="learn-table"><tr><th>Type</th><th>Description</th><th>Approach</th></tr><tr><td>Seating Arrangement</td><td>Arrange people around a table or in a row based on clues</td><td>Draw diagram, use elimination</td></tr><tr><td>Blood Relations</td><td>Determine relationships from statements</td><td>Draw family tree, decode coded relations</td></tr><tr><td>Syllogisms</td><td>Conclusions from given statements (All/Some/No)</td><td>Venn diagrams, logical rules</td></tr><tr><td>Coding-Decoding</td><td>Decode a pattern from examples</td><td>Letter shifting, position mapping</td></tr><tr><td>Direction Sense</td><td>Track movement and find final position/distance</td><td>Draw on compass grid</td></tr></table></div><div class="learn-section"><div class="learn-h">Seating Arrangement</div><div class="learn-code">Linear: _ _ _ _ _ (facing one direction or both)\nCircular: draw a circle with positions\n\nStrategy:\n1. Start with definite clues ("A sits at end", "B is 3rd from left")\n2. Apply relative clues ("C is to the right of D")\n3. Apply negative clues last ("E does not sit next to F")\n\nCircular: "immediate right" = clockwise next\n          "immediate left" = counter-clockwise next\n          Facing center vs facing outward changes left/right</div></div><div class="learn-section"><div class="learn-h">Syllogisms — Quick Rules</div><div class="learn-code">Statements: "All A are B" and "All B are C"\n  Conclusion: "All A are C" ✓, "Some C are A" ✓\n\nStatements: "All A are B" and "No B is C"\n  Conclusion: "No A is C" ✓\n\nStatements: "Some A are B" and "All B are C"\n  Conclusion: "Some A are C" ✓\n\nStatements: "Some A are B" and "Some B are C"\n  Conclusion: No definite conclusion about A and C!\n\nKey: Draw ALL possible Venn diagrams. A conclusion is\nvalid only if it holds in EVERY possible diagram.</div><div class="learn-tip"><b>Strategy:</b> For logical puzzles, <b>tabulate the information</b> — create a grid with entities on one axis and attributes on the other. Mark definite YES/NO, then use elimination.</div></div><div class="learn-section"><div class="learn-h">Classic Interview Puzzles</div><ul class="learn-list"><li><b>12 Balls Problem:</b> One ball is heavier/lighter. Find it in 3 weighings.</li><li><b>Coin Flip:</b> Make a fair decision with a biased coin (Von Neumann trick: flip twice, HT=heads, TH=tails, ignore HH/TT).</li><li><b>100 Doors:</b> Toggle doors 1-100. Only perfect squares remain open.</li><li><b>Hat Puzzle:</b> n people in a line, each sees hats ahead. Strategy: XOR parity.</li><li><b>Two Egg Problem:</b> Find the critical floor with 2 eggs and a 100-floor building (answer: 14 drops).</li></ul><div class="learn-code">Two Egg Problem:\n  Drop from floor x. If breaks, test 1 to x-1 (x-1 drops).\n  If survives, go to x + (x-1) next, then x + (x-1) + (x-2)...\n  x + (x-1) + (x-2) + ... + 1 ≥ 100\n  x(x+1)/2 ≥ 100\n  x ≥ 14 (since 14×15/2 = 105 ≥ 100)\n\n  Drop sequence: 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100</div></div><div class="learn-section"><div class="learn-h">Blood Relations</div><p class="learn-p">Decode family relationships from statements. Draw a family tree using conventions: + for male, - for female, horizontal line for marriage, vertical for parent-child.</p><div class="learn-code">Statement: "A is the brother of B. B is the daughter\nof C. C is the wife of D."\n\nTree:  D ——— C (married)\n        |    |\n        A    B\n\nA is the son of D. A is the son of C.\nD is A and B\'s father.</div><div class="learn-tip"><b>Coded relations:</b> "P + Q" might mean P is father of Q. Decode the symbols first from the given key, then build the family tree.</div></div><div class="learn-section"><div class="learn-h">Coding-Decoding &amp; Direction Sense</div><p class="learn-p"><strong>Coding-Decoding:</strong> Common patterns include letter shifting, reverse alphabet (A=26, B=25...), and positional coding.</p><div class="learn-code">If COMPUTER = DPNQVUFS (each letter +1)\nthen PRINTER = ?\nP+1=Q, R+1=S, I+1=J, N+1=O, T+1=U, E+1=F, R+1=S\nAnswer: QSJOUFS</div><p class="learn-p"><strong>Direction Sense:</strong> Track movements on a compass grid. Start from origin, apply each movement, find final position.</p><div class="learn-code">A walks 5km North, turns right (East) 3km,\nturns right (South) 2km. How far from start?\n\nFinal position: 3km East, (5-2)=3km North\nDistance = &radic;(3&sup2; + 3&sup2;) = 3&radic;2 &approx; 4.24 km\nDirection: North-East from start</div></div><div class="learn-section"><div class="learn-h">Calendar &amp; Day Problems</div><p class="learn-p">Use the <strong>Odd Days</strong> method to find the day of the week for any date:</p><div class="learn-code">Odd days = total days mod 7\n0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat\n\nOdd days per year: Normal year = 1, Leap year = 2\nOdd days per century: 400 yrs = 0 odd days\n  100 yrs = 5, 200 yrs = 3, 300 yrs = 1\n\nExample: What day was 15 Aug 1947?\nOdd days: 1600 yrs = 0, 300 yrs = 1, 46 yrs = (46+11 leaps) = 57 &rarr; 57 mod 7 = 1\nJan=3, Feb=0, Mar=3, Apr=2, May=3, Jun=2, Jul=3, Aug=15\nTotal days in 1947 up to Aug 15 = 3+0+3+2+3+2+3+15 = 31\nOdd days = 31 mod 7 = 3\nTotal = 0+1+1+3 = 5 &rarr; <b>Friday</b></div><div class="learn-tip"><b>Leap year rule:</b> Divisible by 4, but NOT by 100, UNLESS also by 400. So 1900 is NOT a leap year, but 2000 IS.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain the Two Egg Problem approach.</b><br>A: Use the triangular number strategy: with x drops in the worst case, you can cover x*(x+1)/2 floors. For 100 floors: x=14 (14*15/2 = 105 ≥ 100). Drop first egg at floors 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100. If it breaks at floor k, use egg 2 to linearly scan from the previous safe floor. Worst case: 14 drops.</p><p class="learn-p"><b>Q2: How do you calculate what day of the week a date falls on?</b><br>A: Count odd days (remainder when total days are divided by 7). Shortcut: 400 years = 0 odd days, 100 years = 5 odd days. For a given year, add odd days from completed centuries + remaining years (including leap years) + months + remaining days. Day codes: 0=Sunday, 1=Monday, ..., 6=Saturday.</p></div>',
          code: `# Puzzles & Logic — Python Solutions

# ===== Two Egg Problem (Generalized) =====
def min_drops(eggs, floors):
    """Minimum drops to find critical floor with e eggs and f floors"""
    # dp[e][f] = min drops needed
    dp = [[0] * (floors + 1) for _ in range(eggs + 1)]
    for f in range(1, floors + 1):
        dp[1][f] = f  # 1 egg: must try linearly

    for e in range(2, eggs + 1):
        for f in range(1, floors + 1):
            dp[e][f] = float('inf')
            # Binary search for optimal floor to drop from
            lo, hi = 1, f
            while lo <= hi:
                mid = (lo + hi) // 2
                breaks = dp[e-1][mid-1]      # egg breaks: go down
                survives = dp[e][f-mid]       # egg survives: go up
                worst = 1 + max(breaks, survives)
                dp[e][f] = min(dp[e][f], worst)
                if breaks > survives:
                    hi = mid - 1
                else:
                    lo = mid + 1
    return dp[eggs][floors]

print(f"2 eggs, 100 floors: {min_drops(2, 100)} drops")  # 14

# ===== 100 Doors Problem =====
def hundred_doors():
    """Which doors are open after toggling?"""
    open_doors = []
    for i in range(1, 101):
        # Door i is toggled by every divisor of i
        # It ends up open if i has an ODD number of divisors
        # Only perfect squares have odd number of divisors!
        sqrt = int(i ** 0.5)
        if sqrt * sqrt == i:
            open_doors.append(i)
    return open_doors

print(f"Open doors: {hundred_doors()}")
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# ===== Fair Coin from Biased Coin (Von Neumann) =====
import random
def biased_flip(p=0.7):
    return 'H' if random.random() < p else 'T'

def fair_flip():
    """Generate fair outcome from biased coin"""
    while True:
        a, b = biased_flip(), biased_flip()
        if a == 'H' and b == 'T': return 'H'
        if a == 'T' and b == 'H': return 'T'
        # HH or TT: try again

# ===== Seating Arrangement Solver =====
from itertools import permutations

def solve_linear_seating(people, constraints):
    """Brute force solver for small seating problems"""
    for perm in permutations(people):
        if all(constraint(perm) for constraint in constraints):
            return perm
    return None

# Example: A, B, C, D, E in a row
# A is at one end, B is not next to C
people = ['A', 'B', 'C', 'D', 'E']
constraints = [
    lambda p: p[0] == 'A' or p[-1] == 'A',  # A at end
    lambda p: abs(p.index('B') - p.index('C')) > 1,  # B not next to C
]
result = solve_linear_seating(people, constraints)
print(f"Seating: {result}")`,
          problems: [
            ['Syllogism Problems', 'https://www.geeksforgeeks.org/syllogism/', 'Easy'],
            ['Classic Puzzles', 'https://www.geeksforgeeks.org/puzzles/', 'Hard'],
            ['Egg Drop Problem', 'https://leetcode.com/problems/super-egg-drop/', 'Hard']
          ],
          mcqs: [
            {q: 'In the 100 doors problem, which doors remain open?', o: ['All odd-numbered doors', 'All prime-numbered doors', 'All perfect square-numbered doors', 'Every 10th door'], a: 2},
            {q: 'The Two Egg Problem with 100 floors requires at minimum:', o: ['10 drops', '14 drops', '50 drops', '7 drops'], a: 1},
            {q: 'In syllogisms, "Some A are B" and "Some B are C" means:', o: ['Some A are C', 'No A is C', 'All A are C', 'No definite conclusion about A and C'], a: 3}
          ]
        }
      ]
    }
  ]
};
