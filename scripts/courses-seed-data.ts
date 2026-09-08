export interface SeedLessonData {
  title: string;
  contentType: "article" | "video" | "document" | "quiz";
  duration: number;
  description: string;
  content: string;
  videoUrl?: string;
}

export interface SeedModuleData {
  title: string;
  description: string;
  lessons: SeedLessonData[];
}

export interface SeedCourseData {
  title: string;
  slug: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  modules: SeedModuleData[];
}

export const SEED_COURSES_DATA: SeedCourseData[] = [
  // =========================================================================
  // COURSE 1: JavaScript Fundamentals
  // =========================================================================
  {
    title: "JavaScript Fundamentals",
    slug: "javascript-fundamentals",
    description:
      "Learn the fundamentals of JavaScript, including variables, functions, objects, arrays, asynchronous programming, and modern JavaScript concepts.",
    category: "Programming",
    level: "beginner",
    thumbnail:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1000&auto=format&fit=crop",
    modules: [
      {
        title: "Introduction to JavaScript",
        description: "Core introduction to the JavaScript runtime environment, history, and syntax basics.",
        lessons: [
          {
            title: "What is JavaScript?",
            contentType: "article",
            duration: 10,
            description: "Understand the origin, evolution, and role of JavaScript in web development.",
            content: `### Introduction to JavaScript

JavaScript is a high-level, interpreted or Just-In-Time (JIT) compiled programming language that conforms to the ECMAScript specification. Originally created in 1995 by Brendan Eich in just 10 days, it has evolved into one of the most versatile and ubiquitous programming languages in the world.

### The Role of JavaScript in Web Development

Web pages are traditionally built from three foundational technologies:
1. **HTML (HyperText Markup Language)**: Defines the semantic structure, content hierarchy, and DOM elements.
2. **CSS (Cascading Style Sheets)**: Dictates visual aesthetics, layout grids, animations, and responsive styling.
3. **JavaScript**: Provides dynamic interactivity, state manipulation, network communication, and real-time client computation.

### Beyond the Browser

While JavaScript was initially designed to run exclusively inside web browsers, modern runtimes such as Node.js, Deno, and Bun have expanded its capabilities to:
- Server-side web APIs and microservices.
- Desktop applications via frameworks like Electron and Tauri.
- Mobile application development with React Native.
- Cloud functions and edge compute runtimes.

### Summary
JavaScript empowers developers to build complete full-stack applications with a unified language, vibrant ecosystem (npm), and event-driven architecture.`,
          },
          {
            title: "How JavaScript Works",
            contentType: "article",
            duration: 12,
            description: "Explore the V8 engine, call stack, memory heap, and the JavaScript event loop.",
            content: `### How JavaScript Executes Under the Hood

To master JavaScript, it is essential to understand how JavaScript engines, such as Google's V8 or Mozilla's SpiderMonkey, execute code.

### The JavaScript Engine Architecture

At its core, the JavaScript runtime consists of two primary memory structures:
1. **Memory Heap**: An unstructured memory pool where objects, arrays, and variables are allocated.
2. **Call Stack**: A Last-In, First-Out (LIFO) data structure that tracks the execution context of running functions.

### The Single-Threaded Nature & Event Loop

JavaScript is inherently **single-threaded**, meaning it has a single call stack and can only execute one statement at any given time. However, it achieves high-throughput non-blocking asynchronous operations through the **Event Loop**.

\`\`\`javascript
console.log("Start");

setTimeout(() => {
  console.log("Asynchronous Timer");
}, 0);

console.log("End");
\`\`\`

**Output:**
\`\`\`text
Start
End
Asynchronous Timer
\`\`\`

### Execution Flow
1. \`console.log("Start")\` enters the call stack, executes, and pops off.
2. \`setTimeout\` is passed to the browser Web API, which schedules the callback to the Task Queue.
3. \`console.log("End")\` executes on the call stack.
4. Once the call stack is completely empty, the **Event Loop** moves the callback from the Task Queue to the Call Stack.

### Key Takeaways
JavaScript provides fast, non-blocking I/O without requiring complex manual thread synchronization.`,
          },
          {
            title: "Variables and Data Types",
            contentType: "article",
            duration: 12,
            description: "Deep dive into primitive data types, reference types, and dynamic typing.",
            content: `### Variables & Types in JavaScript

JavaScript is a dynamically typed language. This means you do not declare variable types explicitly; instead, types are associated with values at runtime.

### Primitive Types
JavaScript features seven primitive data types that are immutable and passed by value:
- **String**: Sequences of characters (\`"SmartLearn"\`, \`'Next.js'\`).
- **Number**: 64-bit floating-point numbers (\`42\`, \`3.1415\`).
- **BigInt**: Arbitrary precision integers (\`9007199254740991n\`).
- **Boolean**: Logical values (\`true\` or \`false\`).
- **Undefined**: Variable that has been declared but not assigned a value.
- **Null**: Intentional absence of any object value.
- **Symbol**: Unique and immutable identifier.

### Reference Types (Objects)
Unlike primitives, objects, arrays, and functions are mutable reference types stored in the memory heap:

\`\`\`javascript
// Declaring modern variables with const and let
const courseName = "JavaScript Fundamentals";
let studentCount = 1250;
const isPublished = true;

const courseMetadata = {
  instructor: "Sarah Jenkins",
  difficulty: "Beginner",
  tags: ["javascript", "web", "programming"]
};
\`\`\`

### Why Avoid 'var'?
Historically, \`var\` was used, but it suffers from function-scoping and variable hoisting issues. Modern ECMAScript relies strictly on \`let\` for mutable variables and \`const\` for immutable bindings.`,
          },
          {
            title: "Operators and Expressions",
            contentType: "article",
            duration: 10,
            description: "Arithmetic, logical, comparison, and nullish coalescing operators.",
            content: `### Operators & Expressions in Modern JavaScript

Expressions produce values, and operators allow you to manipulate, combine, and compare them.

### Arithmetic and Assignment
- \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (modulus), and \`**\` (exponentiation).
- Shorthand assignment: \`+=\`, \`-=\`, \`*=\`.

### Comparison & Strict Equality
Always favor strict equality (\`===\`) over loose equality (\`==\`) to avoid implicit type coercion bugs:

\`\`\`javascript
console.log(5 === "5"); // false (checks both type and value)
console.log(5 == "5");  // true (implicit coercion - avoid!)
\`\`\`

### Logical & Nullish Operators
Modern JavaScript includes powerful short-circuiting operators:
- **Logical AND (\`&&\`)**: Evaluates until the first falsy operand.
- **Logical OR (\`||\`)**: Evaluates until the first truthy operand.
- **Nullish Coalescing (\`??\`)**: Returns right-hand side only if left-hand side is \`null\` or \`undefined\` (preserving falsy values like \`0\` or \`""\`).

\`\`\`javascript
const defaultLimit = userLimit ?? 20;
const isEligible = hasPrerequisites && isEnrolled;
\`\`\`

### Summary
Mastering strict equality and nullish coalescing prevents subtle runtime bugs in data parsing and configuration logic.`,
          },
        ],
      },
      {
        title: "Control Flow",
        description: "Conditionals, decision making, iterative loops, and functional control flow.",
        lessons: [
          {
            title: "Conditional Statements",
            contentType: "article",
            duration: 10,
            description: "Master if, else if, else, and ternary operator expressions.",
            content: `### Decision Making with Conditional Statements

Conditional statements execute specific code paths depending on boolean conditions.

### The if-else Ladder
\`\`\`javascript
const grade = 88;

if (grade >= 90) {
  console.log("Grade: A");
} else if (grade >= 80) {
  console.log("Grade: B");
} else if (grade >= 70) {
  console.log("Grade: C");
} else {
  console.log("Needs improvement");
}
\`\`\`

### Ternary Expressions
For simple inline assignments based on a condition, use the ternary operator:
\`\`\`javascript
const status = isEnrolled ? "Active Student" : "Guest";
\`\`\`

### Best Practices
- Avoid deeply nested conditional statements; prefer early return guards in functions.
- Ensure conditions evaluate boolean expressions rather than relying on ambiguous truthy/falsy coercion.`,
          },
          {
            title: "Switch Statements",
            contentType: "article",
            duration: 8,
            description: "Using switch-case statements for multi-branch branching logic.",
            content: `### Multi-Branch Control with Switch Statements

When comparing a single expression against multiple distinct candidate values, a \`switch\` statement provides cleaner readability than an extensive \`if-else\` ladder.

\`\`\`javascript
function getCourseBadgeColor(category) {
  switch (category.toLowerCase()) {
    case "programming":
      return "#6366F1";
    case "database":
      return "#10B981";
    case "artificial intelligence":
      return "#8B5CF6";
    case "cloud computing":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
}
\`\`\`

### Important Rules
- Remember to include \`break\` statements to prevent unwanted case fall-through unless intentional.
- Always supply a \`default\` case to handle unexpected or unhandled values.`,
          },
          {
            title: "Loops in JavaScript",
            contentType: "article",
            duration: 12,
            description: "Iterate across collections using for, while, for...of, and for...in loops.",
            content: `### Iteration in Modern JavaScript

Iteration allows repetitive execution of code blocks across datasets.

### Traditional For and While Loops
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(\`Iteration \${i}\`);
}

let counter = 3;
while (counter > 0) {
  console.log(counter);
  counter--;
}
\`\`\`

### Modern Iterators: for...of vs for...in
- **for...of**: Iterates over iterable values (Arrays, Strings, Sets, Maps).
- **for...in**: Iterates over enumerable property keys of an object.

\`\`\`javascript
const frameworkList = ["React", "Next.js", "Express"];

for (const framework of frameworkList) {
  console.log(\`Framework: \${framework}\`);
}
\`\`\`

### Choosing the Right Loop
In modern functional programming, array iteration is frequently handled using high-order methods such as \`.map()\`, \`.filter()\`, and \`.forEach()\`.`,
          },
          {
            title: "Functions",
            contentType: "article",
            duration: 14,
            description: "Function declarations, expressions, parameters, return values, and closures.",
            content: `### First-Class Functions in JavaScript

In JavaScript, functions are first-class citizens. This means they can be assigned to variables, passed as arguments to other functions, and returned from functions.

### Function Declarations vs Expressions
\`\`\`javascript
// Function declaration (hoisted)
function calculateAverage(scores) {
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}

// Function expression
const formatCurrency = function(amount) {
  return \`$\${amount.toFixed(2)}\`;
};
\`\`\`

### Closures
A closure is the combination of a function bundled together with references to its surrounding lexical environment:

\`\`\`javascript
function createCounter(initialValue = 0) {
  let count = initialValue;
  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    get() { return count; }
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
\`\`\`

Closures enable data privacy, encapsulation, and state preservation in functional programming.`,
          },
        ],
      },
      {
        title: "Arrays and Objects",
        description: "Data structures for collections, key-value mappings, and functional array transformations.",
        lessons: [
          {
            title: "Working with Arrays",
            contentType: "article",
            duration: 10,
            description: "Array instantiation, index access, length manipulation, and basic mutations.",
            content: `### Arrays as Ordered Lists

An Array in JavaScript is an ordered collection of values indexed by numerical keys starting at index \`0\`.

\`\`\`javascript
const lessons = ["Variables", "Loops", "Functions", "Objects"];

console.log(lessons[0]); // "Variables"
console.log(lessons.length); // 4

// Mutating array elements
lessons.push("Async JavaScript"); // Adds to end
const removed = lessons.pop(); // Removes from end
\`\`\`

Arrays can store heterogeneous data types simultaneously, including nested arrays and objects.`,
          },
          {
            title: "Array Methods",
            contentType: "article",
            duration: 15,
            description: "Transform and filter data with map, filter, reduce, find, and some.",
            content: `### Functional Array Transformation Methods

Modern JavaScript emphasizes declarative, immutable data processing using built-in array methods.

\`\`\`javascript
const courseList = [
  { id: 1, title: "JavaScript", students: 1200, category: "Web" },
  { id: 2, title: "Python", students: 1500, category: "AI" },
  { id: 3, title: "SQL", students: 800, category: "Database" },
];

// 1. .map() - Transform every item
const titles = courseList.map((c) => c.title);

// 2. .filter() - Select matching items
const popular = courseList.filter((c) => c.students > 1000);

// 3. .reduce() - Accumulate to a single value
const totalStudents = courseList.reduce((acc, c) => acc + c.students, 0);

console.log(\`Total Enrolled: \${totalStudents}\`); // 3500
\`\`\`

These functional methods avoid mutating the original array, which is critical for state management in React and Redux.`,
          },
          {
            title: "JavaScript Objects",
            contentType: "article",
            duration: 12,
            description: "Key-value dictionaries, property accessors, and prototype chains.",
            content: `### Objects as Key-Value Collections

Objects in JavaScript are dynamic collections of properties containing key-value associations.

\`\`\`javascript
const student = {
  id: "std_101",
  name: "Alex Rivera",
  enrolledCourses: ["JavaScript Fundamentals"],
  progress: 75,
  isActive: true,
};

// Accessing properties
console.log(student.name); // Dot notation
console.log(student["progress"]); // Bracket notation

// Dynamic property addition
student.completedAt = new Date().toISOString();
\`\`\`

Objects form the basis for JSON (JavaScript Object Notation), the standard communication protocol for web APIs.`,
          },
          {
            title: "Object Methods",
            contentType: "article",
            duration: 10,
            description: "Static Object methods: Object.keys, Object.values, Object.entries, and Object.assign.",
            content: `### Static Object Utilities in Modern JavaScript

ES6+ provides comprehensive utilities for introspecting and cloning objects.

\`\`\`javascript
const courseStats = {
  lessons: 20,
  quizzes: 5,
  assignments: 2,
};

// Extract keys and values
const keys = Object.keys(courseStats); // ["lessons", "quizzes", "assignments"]
const values = Object.values(courseStats); // [20, 5, 2]
const entries = Object.entries(courseStats); // [["lessons", 20], ...]

// Immutably clone or merge objects
const updatedStats = {
  ...courseStats,
  projects: 1,
};
\`\`\``,
          },
        ],
      },
      {
        title: "Modern JavaScript",
        description: "ES6+ standards including arrow functions, destructuring, and spread operators.",
        lessons: [
          {
            title: "ES6 Features",
            contentType: "article",
            duration: 12,
            description: "Overview of template literals, default parameters, modules, and let/const.",
            content: `### The Modern ECMAScript Era

ECMAScript 2015 (ES6) introduced the most substantial modernization to JavaScript in the language's history.

Key capabilities introduced:
1. **Template Literals**: Multiline strings and string interpolation with \`\${expression}\`.
2. **Default Parameters**: Fallback values for function arguments.
3. **ES Modules**: Native \`import\` and \`export\` syntax replacing CommonJS.
4. **Block-Scoped Variables**: \`let\` and \`const\`.`,
          },
          {
            title: "Arrow Functions",
            contentType: "article",
            duration: 10,
            description: "Concise syntax and lexical 'this' binding in arrow function expressions.",
            content: `### Arrow Function Expressions

Arrow functions provide compact syntax and, crucially, do not create their own \`this\` context:

\`\`\`javascript
// Traditional syntax
const add = function(a, b) {
  return a + b;
};

// Concise arrow function
const addArrow = (a, b) => a + b;
\`\`\`

Lexical \`this\` binding makes arrow functions ideal for callbacks inside classes and object methods.`,
          },
          {
            title: "Destructuring",
            contentType: "article",
            duration: 10,
            description: "Extract values from arrays and objects into distinct variables cleanly.",
            content: `### Destructuring Assignment

Destructuring unpacks values from arrays or properties from objects into distinct variables:

\`\`\`javascript
const user = { name: "Elena", role: "Instructor", country: "Canada" };

// Object destructuring with default fallback
const { name, role, status = "active" } = user;

// Array destructuring
const coordinates = [37.7749, -122.4194];
const [latitude, longitude] = coordinates;
\`\`\``,
          },
          {
            title: "Spread and Rest Operators",
            contentType: "article",
            duration: 10,
            description: "Expanding and collecting collections using the ... syntax.",
            content: `### Spread & Rest Operators (...)

The three dots (\`...\`) serve two distinct purposes based on usage context:

\`\`\`javascript
// 1. Rest: Collect multiple elements into an array
function logActivities(userId, ...activities) {
  console.log(\`User \${userId} performed \${activities.length} activities\`);
}

// 2. Spread: Expand array or object elements
const coreSkills = ["JavaScript", "HTML", "CSS"];
const fullStackSkills = [...coreSkills, "Node.js", "PostgreSQL"];
\`\`\``,
          },
        ],
      },
      {
        title: "Asynchronous JavaScript",
        description: "Callbacks, Promises, async/await patterns, and network data fetching.",
        lessons: [
          {
            title: "Callbacks",
            contentType: "article",
            duration: 10,
            description: "Passing functions as callbacks and understanding callback hell.",
            content: `### Asynchronous Callbacks & Inversion of Control

Historically, JavaScript handled asynchronous operations such as timers, filesystem reads, and HTTP requests using callback functions.

\`\`\`javascript
function fetchUserData(userId, callback) {
  setTimeout(() => {
    callback(null, { id: userId, username: "dev_coder" });
  }, 1000);
}
\`\`\`

When asynchronous actions depend on previous asynchronous actions, callbacks lead to deeply nested "callback hell". Promises were introduced to solve this.`,
          },
          {
            title: "Promises",
            contentType: "article",
            duration: 14,
            description: "Promise states (pending, fulfilled, rejected) and method chaining.",
            content: `### The Promise Specification

A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.

A Promise exists in one of three states:
1. **Pending**: Initial state, neither fulfilled nor rejected.
2. **Fulfilled**: The operation completed successfully.
3. **Rejected**: The operation failed.

\`\`\`javascript
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

delay(1000)
  .then(() => console.log("1 second elapsed"))
  .catch((err) => console.error("Error occurred", err));
\`\`\``,
          },
          {
            title: "Async and Await",
            contentType: "article",
            duration: 14,
            description: "Writing asynchronous code that looks and behaves like synchronous code.",
            content: `### Syntactic Sugar with Async / Await

Introduced in ES2017, \`async/await\` provides ergonomic syntax built on top of Promises:

\`\`\`javascript
async function loadCourseData(courseId) {
  try {
    const response = await fetch(\`/api/courses/\${courseId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load course:", error);
    throw error;
  }
}
\`\`\`

Using \`try...catch\` blocks with \`await\` makes error handling predictable and readable.`,
          },
          {
            title: "Fetch API",
            contentType: "article",
            duration: 12,
            description: "Making network requests using the standard browser and Node.js fetch interface.",
            content: `### Modern HTTP Requests with Fetch API

The \`fetch()\` method starts the process of fetching a resource from the network, returning a Promise that resolves to the Response object.

\`\`\`javascript
async function postLearningNote(note) {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return res.json();
}
\`\`\``,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // COURSE 2: React.js Complete Guide
  // =========================================================================
  {
    title: "React.js Complete Guide",
    slug: "react-js-complete-guide",
    description:
      "Learn how to build modern interactive web applications using React, components, hooks, state management, and modern development patterns.",
    category: "Web Development",
    level: "intermediate",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
    modules: [
      {
        title: "React Fundamentals",
        description: "Component model, Virtual DOM, JSX syntax, and props communication.",
        lessons: [
          {
            title: "Introduction to React",
            contentType: "article",
            duration: 10,
            description: "What makes React the dominant UI library: declarative components and the virtual DOM.",
            content: `### What is React?

React is an open-source, component-based frontend JavaScript library developed by Meta. Instead of directly manipulating the browser DOM, React allows developers to build user interfaces using declarative components that automatically re-render when state changes.

### The Virtual DOM Reconciliation
When state changes in a React application:
1. React creates a new Virtual DOM tree representation.
2. React runs a **diffing algorithm** comparing the new tree against the previous Virtual DOM tree.
3. React computes the minimal set of real DOM operations required and updates the actual DOM in a batch (Reconciliation).`,
          },
          {
            title: "Creating React Components",
            contentType: "article",
            duration: 12,
            description: "Functional components, return structures, and modular architecture.",
            content: `### Functional Components in React

Modern React components are pure JavaScript functions that accept props and return JSX describing what should appear on screen.

\`\`\`tsx
interface CourseBadgeProps {
  level: "beginner" | "intermediate" | "advanced";
}

export function CourseBadge({ level }: CourseBadgeProps) {
  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize bg-indigo-500/20 text-indigo-400">
      {level}
    </span>
  );
}
\`\`\``,
          },
          {
            title: "JSX Explained",
            contentType: "article",
            duration: 10,
            description: "Syntax extension for JavaScript combining markup structure with programming logic.",
            content: `### JavaScript XML (JSX)

JSX is a syntax extension that resembles HTML but compiles down to standard JavaScript function calls (\`React.createElement\` or JSX runtime).

### Rules of JSX
1. **Single Root Element**: Components must return a single root element or Fragment (\`<></>\`).
2. **Close All Tags**: Self-closing elements must explicitly end with \`/>\`.
3. **CamelCase Attributes**: Use \`className\` instead of \`class\`, and \`htmlFor\` instead of \`for\`.
4. **Embedded Expressions**: Embed JavaScript values inside curly braces \`{expression}\`.`,
          },
          {
            title: "Props and Component Communication",
            contentType: "article",
            duration: 12,
            description: "Passing data unidirectionally from parent components to child components.",
            content: `### Unidirectional Data Flow

In React, data flows downward from parent components to child components via **props** (short for properties). Props are strictly read-only (immutable) to child components.

\`\`\`tsx
export function LessonList({ lessons, onSelectLesson }) {
  return (
    <ul className="space-y-2">
      {lessons.map((lesson) => (
        <li key={lesson.id} onClick={() => onSelectLesson(lesson.id)}>
          {lesson.title}
        </li>
      ))}
    </ul>
  );
}
\`\`\``,
          },
        ],
      },
      {
        title: "State and Events",
        description: "Local state, user interactions, event handlers, and conditional rendering.",
        lessons: [
          {
            title: "Understanding State",
            contentType: "article",
            duration: 10,
            description: "State vs props: managing dynamic component memory.",
            content: `### Component State

While props allow a parent to configure a child, **state** is a component's personal memory that persists across renders and triggers UI updates when modified.`,
          },
          {
            title: "useState Hook",
            contentType: "article",
            duration: 14,
            description: "Declaring, updating, and preserving state in functional components.",
            content: `### The useState Hook

\`\`\`tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button 
      onClick={() => setCount((prev) => prev + 1)}
      className="px-4 py-2 bg-indigo-600 rounded text-white"
    >
      Count: {count}
    </button>
  );
}
\`\`\`

Always use functional updates \`setCount(prev => prev + 1)\` when the new state relies on the previous state.`,
          },
          {
            title: "Handling Events",
            contentType: "article",
            duration: 10,
            description: "Synthetic events, form submission, and event propagation.",
            content: `### Event Handling in React

React wraps native browser events in a cross-browser compatible **SyntheticEvent** wrapper.

\`\`\`tsx
export function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}
\`\`\``,
          },
          {
            title: "Conditional Rendering",
            contentType: "article",
            duration: 10,
            description: "Rendering different UI elements using ternary expressions and short-circuit operators.",
            content: `### Conditional Rendering Patterns

1. **Short-circuiting (\`&&\`)**: \`{isLoading && <LoadingSpinner />}\`
2. **Ternary Operator**: \`{isEnrolled ? <ResumeButton /> : <EnrollButton />}\`
3. **Early return pattern**: Return null or loading skeleton before rendering complex content.`,
          },
        ],
      },
      {
        title: "React Hooks",
        description: "Built-in hooks: useEffect, useContext, and writing reusable custom hooks.",
        lessons: [
          {
            title: "Introduction to Hooks",
            contentType: "article",
            duration: 10,
            description: "The motivation behind hooks and the Rules of Hooks.",
            content: `### Rules of Hooks
1. Only call hooks at the **top level** of functional components or custom hooks (never inside loops, conditions, or nested functions).
2. Only call hooks from React function components or custom hook functions.`,
          },
          {
            title: "useEffect Explained",
            contentType: "article",
            duration: 15,
            description: "Managing side effects: data fetching, subscriptions, timers, and cleanups.",
            content: `### Synchronizing with Side Effects

\`\`\`tsx
import { useEffect, useState } from "react";

export function CourseViewer({ courseId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(\`/api/courses/\${courseId}\`)
      .then((res) => res.json())
      .then((resData) => {
        if (!ignore) setData(resData);
      });

    return () => {
      ignore = true; // Cleanup to avoid race conditions
    };
  }, [courseId]); // Re-run effect when courseId changes
}
\`\`\``,
          },
          {
            title: "useContext",
            contentType: "article",
            duration: 12,
            description: "Sharing global state across component trees without prop drilling.",
            content: `### Avoiding Prop Drilling with Context

The \`useContext\` hook allows components to subscribe to React context values without manually passing props through intermediate children. Ideal for themes, user auth state, and localization.`,
          },
          {
            title: "Custom Hooks",
            contentType: "article",
            duration: 14,
            description: "Extracting component logic into reusable JavaScript functions prefixed with 'use'.",
            content: `### Reusable Custom Hooks

\`\`\`tsx
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
\`\`\``,
          },
        ],
      },
      {
        title: "Advanced React",
        description: "Performance optimization, memoization techniques, and modern architecture.",
        lessons: [
          {
            title: "Component Lifecycle",
            contentType: "article",
            duration: 10,
            description: "Mounting, updating, and unmounting phases in modern React.",
            content: `### Understanding the Component Lifecycle

Components transition through three distinct phases:
1. **Mounting**: When the component is first created and inserted into the DOM.
2. **Updating**: When props or state change, triggering a re-render.
3. **Unmounting**: When the component is removed from the DOM.`,
          },
          {
            title: "Performance Optimization",
            contentType: "article",
            duration: 12,
            description: "Identifying unnecessary re-renders with React Profiler and code-splitting.",
            content: `### Optimizing React Applications

- Lazy loading heavy components with \`React.lazy()\` and \`<Suspense>\`.
- Windowing and virtualization for long lists with packages like \`react-window\`.
- Keeping state as local as possible to prevent wide re-render cascades.`,
          },
          {
            title: "Memoization",
            contentType: "article",
            duration: 12,
            description: "React.memo, useMemo, and useCallback deep dive.",
            content: `### Memoization Primitives
- **React.memo**: Skips re-rendering a component if its props haven't changed.
- **useMemo**: Caches the result of an expensive calculation between renders.
- **useCallback**: Caches a function definition between renders to preserve reference equality.`,
          },
          {
            title: "React Best Practices",
            contentType: "article",
            duration: 12,
            description: "Clean architecture, component co-location, and error boundaries.",
            content: `### Industry Best Practices
1. Favor composition over inheritance.
2. Co-locate state and styles with the components that use them.
3. Wrap UI boundaries with \`<ErrorBoundary>\` to isolate rendering failures.
4. Keep functions pure and side effects contained inside effects or event handlers.`,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // COURSE 3: Python Programming from Beginner to Intermediate
  // =========================================================================
  {
    title: "Python Programming from Beginner to Intermediate",
    slug: "python-programming-from-beginner-to-intermediate",
    description:
      "Learn Python programming from the basics to intermediate concepts including functions, object-oriented programming, files, and real-world applications.",
    category: "Programming",
    level: "beginner",
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1000&auto=format&fit=crop",
    modules: [
      {
        title: "Python Basics",
        description: "Syntax, interpreter, dynamic typing, and fundamental input/output.",
        lessons: [
          {
            title: "Introduction to Python",
            contentType: "article",
            duration: 10,
            description: "Philosophy, versatility, and setting up the Python environment.",
            content: `### Why Learn Python?

Python is an interpreted, high-level, general-purpose programming language known for its clear syntax and readability. Designed by Guido van Rossum and released in 1991, Python follows the philosophy: "Readability counts."

Python is the leading language in data science, machine learning, web backend development, automation scripting, and scientific computing.`,
          },
          {
            title: "Variables and Data Types",
            contentType: "article",
            duration: 12,
            description: "Integers, floats, strings, booleans, and type conversion in Python.",
            content: `### Python Data Types

\`\`\`python
# Declaring variables in Python
course_name = "Python Programming"
enrolled_students = 2450
course_rating = 4.85
is_certified = True

# Type inspection
print(type(enrolled_students)) # <class 'int'>
print(type(course_rating))      # <class 'float'>
\`\`\``,
          },
          {
            title: "Input and Output",
            contentType: "article",
            duration: 8,
            description: "Reading console input and formatting strings with f-strings.",
            content: `### Standard I/O in Python

\`\`\`python
# Reading input from user
user_name = input("Enter your username: ")

# Modern formatted string literals (f-strings)
print(f"Welcome back to SmartLearn, {user_name}!")
\`\`\``,
          },
          {
            title: "Operators",
            contentType: "article",
            duration: 10,
            description: "Arithmetic, comparison, logical, and membership operators (in, not in).",
            content: `### Operators in Python

\`\`\`python
# Floor division vs true division
print(7 / 2)  # 3.5
print(7 // 2) # 3

# Membership operators
supported_formats = ["pdf", "txt", "md"]
print("pdf" in supported_formats) # True
\`\`\``,
          },
        ],
      },
      {
        title: "Control Structures",
        description: "Branching with if-elif-else, loops, functions, and error handling.",
        lessons: [
          {
            title: "Conditional Statements",
            contentType: "article",
            duration: 10,
            description: "Using indentation-based blocks for if, elif, and else logic.",
            content: `### Python Conditionals

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"

print(f"Final Grade: {grade}")
\`\`\``,
          },
          {
            title: "Loops",
            contentType: "article",
            duration: 12,
            description: "for in range, while loops, break, and continue statements.",
            content: `### Loops and Iteration

\`\`\`python
# Iterating with range
for i in range(1, 5):
    print(f"Lesson step {i}")

# Iterating over lists
topics = ["Variables", "Loops", "Classes"]
for topic in topics:
    print(f"Topic: {topic}")
\`\`\``,
          },
          {
            title: "Functions",
            contentType: "article",
            duration: 12,
            description: "Defining functions with def, default arguments, *args, and **kwargs.",
            content: `### Defining Functions in Python

\`\`\`python
def calculate_progress(completed: int, total: int) -> float:
    """Computes the progress percentage."""
    if total == 0:
        return 0.0
    return round((completed / total) * 100, 2)

print(calculate_progress(8, 10)) # 80.0
\`\`\``,
          },
          {
            title: "Error Handling",
            contentType: "article",
            duration: 10,
            description: "Catching exceptions with try, except, else, and finally.",
            content: `### Exception Handling with try-except

\`\`\`python
try:
    with open("notes.txt", "r") as f:
        content = f.read()
except FileNotFoundError:
    print("Warning: notes.txt was not found.")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    print("Operation attempt finished.")
\`\`\``,
          },
        ],
      },
      {
        title: "Data Structures",
        description: "Built-in collections: lists, tuples, dictionaries, and sets.",
        lessons: [
          {
            title: "Lists",
            contentType: "article",
            duration: 12,
            description: "Mutable ordered sequences, slicing, and list comprehensions.",
            content: `### Python Lists & List Comprehensions

\`\`\`python
numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers if n % 2 != 0]
print(squares) # [1, 9, 25]
\`\`\``,
          },
          {
            title: "Tuples",
            contentType: "article",
            duration: 8,
            description: "Immutable ordered sequences, packing, and tuple unpacking.",
            content: `### Immutable Tuples

Tuples are declared with parentheses and cannot be modified after creation:
\`\`\`python
geo_location = (37.7749, -122.4194)
lat, lon = geo_location
\`\`\``,
          },
          {
            title: "Dictionaries",
            contentType: "article",
            duration: 14,
            description: "Key-value hash maps, dictionary comprehensions, and methods.",
            content: `### Python Dictionaries

\`\`\`python
course = {
    "title": "Python Programming",
    "level": "Beginner",
    "students": 2450
}

# Safe key retrieval with get()
instructor = course.get("instructor", "Unassigned")
\`\`\``,
          },
          {
            title: "Sets",
            contentType: "article",
            duration: 10,
            description: "Unordered collections of unique elements with set mathematics.",
            content: `### Sets & Set Mathematics

\`\`\`python
registered_users = {"alex", "elena", "sarah"}
active_learners = {"elena", "marcus"}

# Intersection and Union
both = registered_users & active_learners # {"elena"}
all_users = registered_users | active_learners
\`\`\``,
          },
        ],
      },
      {
        title: "Object-Oriented Programming",
        description: "Classes, encapsulation, constructors, inheritance, and polymorphism.",
        lessons: [
          {
            title: "Classes and Objects",
            contentType: "article",
            duration: 12,
            description: "Blueprints for creating objects with instance methods.",
            content: `### OOP in Python

\`\`\`python
class Course:
    def __init__(self, title: str, category: str):
        self.title = title
        self.category = category
        self.is_published = False

    def publish(self):
        self.is_published = True
\`\`\``,
          },
          {
            title: "Constructors",
            contentType: "article",
            duration: 10,
            description: "The __init__ method, self reference, and instance attributes.",
            content: `### Constructors & Instance Initializers

The \`__init__\` method is the constructor in Python, automatically executed whenever a new instance of the class is instantiated.`,
          },
          {
            title: "Inheritance",
            contentType: "article",
            duration: 12,
            description: "Extending classes with super() and method overriding.",
            content: `### Class Inheritance

\`\`\`python
class Lesson:
    def __init__(self, title: str):
        self.title = title

class VideoLesson(Lesson):
    def __init__(self, title: str, video_url: str):
        super().__init__(title)
        self.video_url = video_url
\`\`\``,
          },
          {
            title: "Polymorphism",
            contentType: "article",
            duration: 10,
            description: "Duck typing, abstract methods, and polymorphic behavior in Python.",
            content: `### Polymorphism & Duck Typing

"If it walks like a duck and quacks like a duck, it's a duck." Python utilizes dynamic duck typing rather than rigid nominal interfaces.`,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // COURSE 4: Data Structures and Algorithms
  // =========================================================================
  {
    title: "Data Structures and Algorithms",
    slug: "data-structures-and-algorithms",
    description:
      "Learn fundamental data structures and algorithms used in software engineering and technical interviews.",
    category: "Computer Science",
    level: "intermediate",
    thumbnail:
      "https://images.unsplash.com/photo-1516116211227-bbc15b8ec523?q=80&w=1000&auto=format&fit=crop",
    modules: [
      {
        title: "Introduction to DSA",
        description: "Foundations of computational efficiency, Big O notation, and analysis.",
        lessons: [
          {
            title: "What are Data Structures?",
            contentType: "article",
            duration: 10,
            description: "How data organization impacts algorithm design and memory layout.",
            content: `### Foundations of Data Structures

A data structure is a specialized format for organizing, processing, retrieving, and storing data in computer memory. Choosing the right data structure directly determines whether an algorithm runs in milliseconds or hours.`,
          },
          {
            title: "Algorithm Analysis",
            contentType: "article",
            duration: 12,
            description: "Evaluating algorithmic correctness, worst-case, and best-case execution.",
            content: `### Asymptotic Complexity Analysis

We analyze algorithms independently of machine hardware specifications by measuring how runtime and memory grow as the input size (\`n\`) approaches infinity.`,
          },
          {
            title: "Time Complexity",
            contentType: "article",
            duration: 14,
            description: "Big O notation: O(1), O(log n), O(n), O(n log n), O(n^2).",
            content: `### Big O Time Complexity Hierarchy

- **O(1)** Constant time: Array index access.
- **O(log n)** Logarithmic: Binary search.
- **O(n)** Linear: Single iteration over an array.
- **O(n log n)** Linearithmic: Merge sort, Quick sort.
- **O(n^2)** Quadratic: Nested loops, Bubble sort.
- **O(2^n)** Exponential: Recursive Fibonacci.`,
          },
          {
            title: "Space Complexity",
            contentType: "article",
            duration: 10,
            description: "Auxiliary memory usage and call stack allocation.",
            content: `### Space Complexity

Space complexity measures total auxiliary memory required by an algorithm, including variables, arrays, and call stack frames generated by recursive functions.`,
          },
        ],
      },
      {
        title: "Linear Data Structures",
        description: "Contiguous and linked linear structures: Arrays, Lists, Stacks, Queues.",
        lessons: [
          {
            title: "Arrays",
            contentType: "article",
            duration: 10,
            description: "Contiguous memory allocation, random access, and dynamic resizing.",
            content: `### Arrays in Memory

Arrays allocate contiguous blocks of memory. This allows O(1) random access via base address pointer arithmetic (\`address = base + index * size\`).`,
          },
          {
            title: "Linked Lists",
            contentType: "article",
            duration: 14,
            description: "Singly and doubly linked lists: node pointer structures and insertions.",
            content: `### Singly Linked Lists

Unlike arrays, linked lists consist of discrete nodes scattered across memory, each containing a value and a pointer to the next node. Inserting at the head is O(1).`,
          },
          {
            title: "Stacks",
            contentType: "article",
            duration: 12,
            description: "LIFO (Last In First Out) structures: push, pop, and call stack modeling.",
            content: `### Stack Data Structure

A Stack enforces Last-In, First-Out (LIFO) order. Common applications include browser history (back button), undo operations, and syntax parenthesis matching.`,
          },
          {
            title: "Queues",
            contentType: "article",
            duration: 12,
            description: "FIFO (First In First Out) structures and circular buffer implementations.",
            content: `### Queue Data Structure

A Queue enforces First-In, First-Out (FIFO) order. Essential for task scheduling, print queues, and breadth-first search (BFS) graph traversals.`,
          },
        ],
      },
      {
        title: "Trees and Graphs",
        description: "Hierarchical and network data structures: BSTs, representations, and traversals.",
        lessons: [
          {
            title: "Binary Trees",
            contentType: "article",
            duration: 12,
            description: "Tree terminology: root, leaf, height, depth, and binary trees.",
            content: `### Hierarchical Binary Trees

A tree is an acyclic connected graph. In a binary tree, each node has at most two children (left and right).`,
          },
          {
            title: "Binary Search Trees",
            contentType: "article",
            duration: 15,
            description: "BST invariant property: left < root < right and balanced tree considerations.",
            content: `### Binary Search Tree (BST)

In a BST:
- All keys in the left subtree are smaller than the node's key.
- All keys in the right subtree are larger than the node's key.

Searching, insertion, and deletion operate in average O(log n) time.`,
          },
          {
            title: "Graph Fundamentals",
            contentType: "article",
            duration: 12,
            description: "Vertices, edges, directed vs undirected, and adjacency matrix vs list.",
            content: `### Graph Representations

Graphs model pairwise relationships between objects (vertices) connected by edges. Most modern applications represent graphs using **Adjacency Lists** for O(V + E) memory efficiency.`,
          },
          {
            title: "Graph Traversal",
            contentType: "article",
            duration: 15,
            description: "Depth-First Search (DFS) and Breadth-First Search (BFS) algorithms.",
            content: `### Traversing Graph Structures
- **DFS**: Explores as deep as possible along each branch before backtracking (implemented via recursion or stack).
- **BFS**: Explores all neighbors at current depth before moving deeper (implemented via queue).`,
          },
        ],
      },
      {
        title: "Algorithms",
        description: "Searching, sorting, recursion, and dynamic programming introduction.",
        lessons: [
          {
            title: "Searching Algorithms",
            contentType: "article",
            duration: 12,
            description: "Linear search vs binary search on sorted sequences.",
            content: `### Binary Search Algorithm

Binary search repeatedly divides the search interval in half. It requires the array to be sorted and completes in O(log n) time.`,
          },
          {
            title: "Sorting Algorithms",
            contentType: "article",
            duration: 15,
            description: "Comparison of Bubble, Insertion, Merge Sort, and Quick Sort.",
            content: `### Efficient Sorting

Merge Sort utilizes a divide-and-conquer strategy guaranteeing O(n log n) worst-case runtime by recursively splitting and merging sorted halves.`,
          },
          {
            title: "Recursion",
            contentType: "article",
            duration: 14,
            description: "Base cases, recursive steps, and the call stack unwinding.",
            content: `### Designing Recursive Algorithms

Every correct recursive function requires:
1. **Base Case**: A terminating condition that stops recursion without calling itself.
2. **Recursive Step**: Moving the input closer to the base case.`,
          },
          {
            title: "Dynamic Programming Introduction",
            contentType: "article",
            duration: 16,
            description: "Memoization (top-down) and Tabulation (bottom-up) optimization.",
            content: `### Dynamic Programming (DP)

DP solves complex problems by breaking them down into overlapping subproblems and storing subproblem results to avoid redundant calculations.`,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // COURSE 5: SQL and Database Fundamentals
  // =========================================================================
  {
    title: "SQL and Database Fundamentals",
    slug: "sql-and-database-fundamentals",
    description:
      "Learn relational databases, SQL queries, joins, normalization, indexes, and database design.",
    category: "Database",
    level: "beginner",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000&auto=format&fit=crop",
    modules: [
      {
        title: "Database Basics",
        description: "Relational models, tables, columns, rows, and key constraints.",
        lessons: [
          {
            title: "Introduction to Databases",
            contentType: "article",
            duration: 10,
            description: "Database Management Systems (DBMS) vs flat files and spreadsheets.",
            content: `### What is a Database?

A database is an organized collection of structured information or data stored electronically in a computer system, controlled by a Database Management System (DBMS).`,
          },
          {
            title: "Relational Databases",
            contentType: "article",
            duration: 10,
            description: "Codd's relational model: tables, rows (tuples), and columns (attributes).",
            content: `### The Relational Model

Relational databases organize data into tables consisting of rows and columns. Examples include PostgreSQL, MySQL, SQLite, and MariaDB.`,
          },
          {
            title: "Tables and Relationships",
            contentType: "article",
            duration: 12,
            description: "One-to-One, One-to-Many, and Many-to-Many relationships.",
            content: `### Entity Relationships

1. **One-to-One (1:1)**: A user has one profile.
2. **One-to-Many (1:N)**: A course has many lessons.
3. **Many-to-Many (M:N)**: Students enroll in many courses via a junction table.`,
          },
          {
            title: "Primary and Foreign Keys",
            contentType: "article",
            duration: 12,
            description: "Enforcing referential integrity and unique identification.",
            content: `### Keys in Relational Modeling

- **Primary Key (PK)**: Uniquely identifies each record in a table.
- **Foreign Key (FK)**: A field referencing the primary key of another table to guarantee referential integrity.`,
          },
        ],
      },
      {
        title: "SQL Fundamentals",
        description: "Standard querying: SELECT, WHERE, ORDER BY, LIMIT, and aggregate math.",
        lessons: [
          {
            title: "SELECT Queries",
            contentType: "article",
            duration: 10,
            description: "Retrieving specific columns and calculated expressions.",
            content: `### Basic SQL Retrieval

\`\`\`sql
SELECT title, category, level 
FROM courses;
\`\`\``,
          },
          {
            title: "WHERE Conditions",
            contentType: "article",
            duration: 12,
            description: "Filtering records with comparison operators, AND, OR, and LIKE.",
            content: `### Filtering with WHERE

\`\`\`sql
SELECT * FROM courses 
WHERE category = 'Programming' 
  AND level = 'beginner';
\`\`\``,
          },
          {
            title: "ORDER BY and LIMIT",
            contentType: "article",
            duration: 10,
            description: "Sorting result sets ascending/descending and implementing pagination.",
            content: `### Sorting and Limiting

\`\`\`sql
SELECT title, enrolled_count 
FROM courses 
ORDER BY enrolled_count DESC 
LIMIT 10 OFFSET 0;
\`\`\``,
          },
          {
            title: "Aggregate Functions",
            contentType: "article",
            duration: 12,
            description: "COUNT, SUM, AVG, MIN, and MAX across tabular records.",
            content: `### Aggregate Math Functions

\`\`\`sql
SELECT 
  COUNT(*) AS total_courses,
  AVG(duration_minutes) AS avg_duration 
FROM lessons;
\`\`\``,
          },
        ],
      },
      {
        title: "Advanced SQL",
        description: "Joins, subqueries, grouping, and Common Table Expressions (CTEs).",
        lessons: [
          {
            title: "SQL Joins",
            contentType: "article",
            duration: 15,
            description: "INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
            content: `### Combining Tables with Joins

\`\`\`sql
SELECT 
  c.title AS course_title,
  m.title AS module_title
FROM courses c
INNER JOIN modules m ON c.id = m.course_id;
\`\`\``,
          },
          {
            title: "Subqueries",
            contentType: "article",
            duration: 14,
            description: "Nested queries in SELECT, WHERE, and FROM clauses.",
            content: `### Nested Subqueries

\`\`\`sql
SELECT title FROM courses 
WHERE id IN (
  SELECT course_id FROM enrollments 
  GROUP BY course_id 
  HAVING COUNT(user_id) > 100
);
\`\`\``,
          },
          {
            title: "GROUP BY and HAVING",
            contentType: "article",
            duration: 12,
            description: "Aggregating rows into summary groups and filtering groups with HAVING.",
            content: `### Grouping Records

\`\`\`sql
SELECT category, COUNT(*) as course_count 
FROM courses 
GROUP BY category 
HAVING COUNT(*) >= 2;
\`\`\``,
          },
          {
            title: "Common Table Expressions",
            contentType: "article",
            duration: 14,
            description: "WITH clauses for clean, readable, and recursive subquery abstractions.",
            content: `### Common Table Expressions (CTEs)

\`\`\`sql
WITH RankedCourses AS (
  SELECT title, category,
         RANK() OVER (PARTITION BY category ORDER BY enrolled_count DESC) as rank
  FROM courses
)
SELECT * FROM RankedCourses WHERE rank = 1;
\`\`\``,
          },
        ],
      },
      {
        title: "Database Design",
        description: "Normalization forms, indexes, query plans, and schema design best practices.",
        lessons: [
          {
            title: "Database Normalization",
            contentType: "article",
            duration: 15,
            description: "Eliminating redundancy: First, Second, and Third Normal Forms (1NF, 2NF, 3NF).",
            content: `### Database Normalization Principles

Normalization organizes database columns and tables to reduce data redundancy and improve data integrity (1NF: atomic values, 2NF: no partial key dependencies, 3NF: no transitive dependencies).`,
          },
          {
            title: "Indexes",
            contentType: "article",
            duration: 14,
            description: "B-Tree indexes, compound indexes, and how indexes accelerate queries.",
            content: `### Database Indexing Strategy

Indexes are auxiliary data structures (commonly B-Trees) that allow the database engine to find specific rows in O(log n) time rather than performing full table scans.`,
          },
          {
            title: "Query Optimization",
            contentType: "article",
            duration: 12,
            description: "Using EXPLAIN ANALYZE to inspect query execution plans.",
            content: `### Query Optimization

Analyze execution plans using \`EXPLAIN ANALYZE\` to detect sequential scans, missing indexes, and slow join algorithms.`,
          },
          {
            title: "Database Best Practices",
            contentType: "article",
            duration: 12,
            description: "Transactions (ACID), connection pooling, migrations, and backups.",
            content: `### Production Best Practices

1. Enforce ACID properties (Atomicity, Consistency, Isolation, Durability) using transactions.
2. Utilize connection pools to reuse active socket connections.
3. Manage schema evolution with automated versioned migration scripts.`,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // COURSE 6: Introduction to Artificial Intelligence
  // =========================================================================
  {
    title: "Introduction to Artificial Intelligence",
    slug: "introduction-to-artificial-intelligence",
    description:
      "Understand the fundamentals of artificial intelligence, machine learning, neural networks, generative AI, and modern AI applications.",
    category: "Artificial Intelligence",
    level: "beginner",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop",
    modules: [
      {
        title: "AI Fundamentals",
        description: "Core definitions, historical timeline, Turing tests, and practical AI domains.",
        lessons: [
          {
            title: "What is Artificial Intelligence?",
            contentType: "article",
            duration: 10,
            description: "Definitions of artificial intelligence, reasoning, perception, and learning.",
            content: `### Defining Artificial Intelligence

Artificial Intelligence (AI) refers to the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.`,
          },
          {
            title: "History of AI",
            contentType: "article",
            duration: 12,
            description: "From Alan Turing and Dartmouth 1956 to AI winters and deep learning renaissance.",
            content: `### The Evolution of AI

- **1950**: Alan Turing publishes "Computing Machinery and Intelligence" proposing the Turing Test.
- **1956**: Dartmouth Conference coins the term "Artificial Intelligence".
- **1970s-80s**: The "AI Winters" caused by overpromising and computational limitations.
- **2012-Present**: Deep learning explosion enabled by GPUs and massive datasets.`,
          },
          {
            title: "Types of AI",
            contentType: "article",
            duration: 10,
            description: "Narrow AI (ANI) vs General AI (AGI) vs Super AI (ASI).",
            content: `### Spectrum of AI Capabilities

1. **Artificial Narrow Intelligence (ANI)**: Dedicated to solving a single specific task (e.g., chess engines, Siri, spam filters). All current AI is ANI.
2. **Artificial General Intelligence (AGI)**: Theoretical AI with human-level cognitive flexibility across all domains.
3. **Artificial Superintelligence (ASI)**: Hypothetical intelligence surpassing human capability.`,
          },
          {
            title: "Real World AI Applications",
            contentType: "article",
            duration: 10,
            description: "Healthcare diagnostics, autonomous vehicles, search engines, and finance.",
            content: `### AI in Production Today

Modern AI powers semantic vector search, fraud detection in banking, real-time medical imaging diagnosis, automated language translation, and autonomous navigation.`,
          },
        ],
      },
      {
        title: "Machine Learning",
        description: "Supervised, unsupervised, and reinforcement learning paradigms.",
        lessons: [
          {
            title: "Introduction to Machine Learning",
            contentType: "article",
            duration: 12,
            description: "How machine learning differs from traditional algorithmic programming.",
            content: `### The Machine Learning Paradigm

Traditional programming combines rules and data to produce answers. Machine learning combines data and answers to discover the underlying mathematical rules.`,
          },
          {
            title: "Supervised Learning",
            contentType: "article",
            duration: 14,
            description: "Training models with labeled datasets: regression and classification.",
            content: `### Supervised Learning

In supervised learning, the model is trained on an input-output dataset with known ground truth labels. Examples:
- **Classification**: Predicting discrete categories (e.g. spam vs ham).
- **Regression**: Predicting continuous numeric values (e.g. house prices).`,
          },
          {
            title: "Unsupervised Learning",
            contentType: "article",
            duration: 12,
            description: "Clustering, dimensionality reduction, and pattern discovery in unlabeled data.",
            content: `### Unsupervised Learning

Unsupervised learning algorithms find hidden patterns or data groupings without human supervision or pre-existing labels (e.g. K-Means clustering, PCA).`,
          },
          {
            title: "Reinforcement Learning",
            contentType: "article",
            duration: 12,
            description: "Agents learning optimal policies via rewards and penalties.",
            content: `### Learning Through Interaction

In reinforcement learning, an agent takes actions in an environment to maximize a cumulative reward signal. Fundamental to robotics and game playing (e.g. AlphaGo).`,
          },
        ],
      },
      {
        title: "Deep Learning",
        description: "Multi-layer neural networks, backpropagation, and perceptual models.",
        lessons: [
          {
            title: "Neural Networks",
            contentType: "article",
            duration: 14,
            description: "Neurons, weights, biases, and activation functions (ReLU, Sigmoid).",
            content: `### Artificial Neural Networks (ANN)

Inspired by biological neural circuits, ANNs consist of interconnected nodes (neurons) organized into an input layer, hidden layers, and an output layer.`,
          },
          {
            title: "Deep Learning Fundamentals",
            contentType: "article",
            duration: 12,
            description: "Why depth matters: hierarchical feature representations.",
            content: `### Hierarchical Feature Extraction

Deep learning uses deep neural networks (many hidden layers) to automatically discover representations needed for feature detection without manual feature engineering.`,
          },
          {
            title: "Training Neural Networks",
            contentType: "article",
            duration: 15,
            description: "Loss functions, forward propagation, gradient descent, and backpropagation.",
            content: `### The Backpropagation Algorithm

During training, the network computes predictions, calculates error via a loss function, and propagates gradients backward using the chain rule of calculus to update weights via gradient descent.`,
          },
          {
            title: "Applications of Deep Learning",
            contentType: "article",
            duration: 12,
            description: "Computer vision (CNNs), natural language processing (Transformers), and audio.",
            content: `### Deep Learning Breakthroughs

- **Computer Vision**: Convolutional Neural Networks for object detection.
- **NLP**: Transformer architectures for natural language understanding and generation.`,
          },
        ],
      },
      {
        title: "Generative AI",
        description: "Large language models, prompt engineering, and ethical AI alignment.",
        lessons: [
          {
            title: "What is Generative AI?",
            contentType: "article",
            duration: 12,
            description: "Creation of synthetic content: text, code, images, audio, and video.",
            content: `### The Generative AI Revolution

Unlike discriminative models that classify data, generative models learn the probability distribution of training data to generate novel, realistic artifacts.`,
          },
          {
            title: "Large Language Models",
            contentType: "article",
            duration: 15,
            description: "Transformers, self-attention mechanisms, and autoregressive text generation.",
            content: `### Large Language Models (LLMs)

LLMs such as GPT-4 are trained on vast text corpora using self-attention mechanisms to predict next tokens in sequence, developing emergent reasoning capabilities.`,
          },
          {
            title: "Prompt Engineering",
            contentType: "article",
            duration: 14,
            description: "Techniques for guiding LLM outputs: few-shot, chain-of-thought, and system prompts.",
            content: `### Effective Prompt Engineering

- **System Prompts**: Setting behavioral boundaries and personas.
- **Few-Shot Prompting**: Providing examples of desired inputs and outputs.
- **Chain of Thought (CoT)**: Instructing the model to think step-by-step.`,
          },
          {
            title: "Responsible AI",
            contentType: "article",
            duration: 12,
            description: "Hallucinations, bias mitigation, safety alignment, and copyright.",
            content: `### AI Ethics and Alignment

Developing production AI requires addressing hallucinations, bias in training datasets, model security (jailbreaks), and data privacy.`,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // COURSE 7: Cloud Computing Fundamentals
  // =========================================================================
  {
    title: "Cloud Computing Fundamentals",
    slug: "cloud-computing-fundamentals",
    description:
      "Learn cloud computing concepts, cloud service models, virtualization, containers, and modern cloud infrastructure.",
    category: "Cloud Computing",
    level: "beginner",
    thumbnail:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop",
    modules: [
      {
        title: "Cloud Fundamentals",
        description: "Definition, economic models, deployment types, and cloud architecture.",
        lessons: [
          {
            title: "What is Cloud Computing?",
            contentType: "article",
            duration: 10,
            description: "On-demand delivery of compute power, storage, and databases over the internet.",
            content: `### The Cloud Revolution

Cloud computing is the on-demand delivery of IT resources over the internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers, organizations rent computing capacity from providers like AWS, Azure, and Google Cloud.`,
          },
          {
            title: "Benefits of Cloud Computing",
            contentType: "article",
            duration: 10,
            description: "Agility, elasticity, cost savings, high availability, and global reach.",
            content: `### Advantages of the Cloud

1. **Trade Capital Expense for Variable Expense**: Pay only for what you consume.
2. **Elasticity**: Scale resources up or down automatically in response to demand.
3. **High Availability**: Redundant regional data centers eliminate single points of failure.`,
          },
          {
            title: "Public, Private, and Hybrid Cloud",
            contentType: "article",
            duration: 12,
            description: "Evaluating cloud deployment models for compliance and security.",
            content: `### Cloud Deployment Models

- **Public Cloud**: Cloud services delivered over the public internet by third-party providers.
- **Private Cloud**: Infrastructure dedicated entirely to a single enterprise.
- **Hybrid Cloud**: Connects private infrastructure with public cloud environments for elasticity.`,
          },
          {
            title: "Cloud Architecture",
            contentType: "article",
            duration: 12,
            description: "Regions, Availability Zones (AZs), and edge locations.",
            content: `### Cloud Global Infrastructure

Cloud providers organize physical data centers into **Regions** (geographical areas) containing multiple isolated **Availability Zones** connected through low-latency fiber links.`,
          },
        ],
      },
      {
        title: "Cloud Service Models",
        description: "IaaS, PaaS, SaaS, and the evolution toward serverless computing.",
        lessons: [
          {
            title: "Infrastructure as a Service",
            contentType: "article",
            duration: 10,
            description: "IaaS: Raw computing resources, virtual machines, storage, and networks.",
            content: `### Infrastructure as a Service (IaaS)

IaaS provides virtualized computing resources over the internet. You manage the operating system, middleware, and application, while the provider manages physical servers and networking.`,
          },
          {
            title: "Platform as a Service",
            contentType: "article",
            duration: 10,
            description: "PaaS: Managed development runtimes, databases, and deployment platforms.",
            content: `### Platform as a Service (PaaS)

PaaS delivers hardware and software tools over the internet, allowing developers to focus on application code without managing underlying operating systems or patching servers.`,
          },
          {
            title: "Software as a Service",
            contentType: "article",
            duration: 10,
            description: "SaaS: End-user applications delivered directly via web browsers.",
            content: `### Software as a Service (SaaS)

SaaS provides fully managed web software applications directly to users over the web. Examples include SmartLearn, GitHub, Slack, and Google Workspace.`,
          },
          {
            title: "Serverless Computing",
            contentType: "article",
            duration: 12,
            description: "Function-as-a-Service (FaaS), event-driven execution, and zero idle costs.",
            content: `### Serverless Architecture

Serverless computing allows developers to build applications without thinking about servers. Code runs in stateless ephemeral compute containers triggered by events (e.g., AWS Lambda, Vercel Serverless Functions).`,
          },
        ],
      },
      {
        title: "Cloud Technologies",
        description: "Virtualization, containerization, Docker fundamentals, and Kubernetes.",
        lessons: [
          {
            title: "Virtual Machines",
            contentType: "article",
            duration: 12,
            description: "Hypervisors (Type 1 and Type 2) and virtual hardware partitioning.",
            content: `### Virtualization Technologies

Virtualization uses a hypervisor to simulate hardware functionality and create multiple virtual machines (VMs) running independent guest operating systems on a single physical host.`,
          },
          {
            title: "Containers",
            contentType: "article",
            duration: 12,
            description: "Containers vs virtual machines: OS-level virtualization.",
            content: `### Containers vs Virtual Machines

Unlike VMs that package an entire guest operating system, containers share the host OS kernel and isolate user spaces. They are lightweight, start in milliseconds, and consume minimal resources.`,
          },
          {
            title: "Docker Fundamentals",
            contentType: "article",
            duration: 14,
            description: "Images, containers, Dockerfiles, and container registries.",
            content: `### Modern Containerization with Docker

Docker standardizes container packaging:
- **Dockerfile**: Text file containing instructions to assemble an image.
- **Docker Image**: Read-only template containing application code, runtime, libraries, and settings.
- **Docker Container**: A running instance of an image.`,
          },
          {
            title: "Kubernetes Introduction",
            contentType: "article",
            duration: 15,
            description: "Container orchestration: pods, services, deployments, and self-healing.",
            content: `### Container Orchestration with Kubernetes

Kubernetes (K8s) is an open-source platform for managing containerized workloads and services, facilitating both declarative configuration and automation:
- **Pod**: Smallest deployable compute unit in Kubernetes.
- **Service**: Abstraction defining logical set of Pods and access policy.
- **Deployment**: Declarative updates for Pods and ReplicaSets.`,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // COURSE 8: Next.js Full Stack Development
  // =========================================================================
  {
    title: "Next.js Full Stack Development",
    slug: "next-js-full-stack-development",
    description:
      "Learn how to build modern full-stack web applications using Next.js, React, API routes, databases, authentication, and deployment.",
    category: "Web Development",
    level: "intermediate",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    modules: [
      {
        title: "Next.js Fundamentals",
        description: "App Router architecture, layouts, and React Server Components.",
        lessons: [
          {
            title: "Introduction to Next.js",
            contentType: "article",
            duration: 10,
            description: "The React framework for the web: SSR, SSG, and hybrid rendering.",
            content: `### Next.js Architecture

Next.js is a full-stack React framework built by Vercel that combines server-side rendering (SSR), static site generation (SSG), React Server Components (RSC), and file-system routing.`,
          },
          {
            title: "App Router",
            contentType: "article",
            duration: 12,
            description: "File-system based routing using the app directory convention.",
            content: `### Next.js App Router

The App Router operates within the \`app/\` directory. Folders define route segments, and special files define UI hierarchy:
- \`page.tsx\`: Unique UI for a route.
- \`layout.tsx\`: Shared UI wrapping route children.
- \`loading.tsx\`: Loading UI wrapped in React Suspense.
- \`error.tsx\`: Error boundary UI.`,
          },
          {
            title: "Pages and Layouts",
            contentType: "article",
            duration: 12,
            description: "Nested layouts, state preservation, and navigation transitions.",
            content: `### Layouts & Component Nesting

Layouts preserve state across navigations and do not re-render when switching between child route pages. Root layouts wrap all pages and declare global HTML and body tags.`,
          },
          {
            title: "Server and Client Components",
            contentType: "article",
            duration: 15,
            description: "RSC architecture: when to use server vs client components.",
            content: `### React Server Components (RSC)

In Next.js App Router, components are **Server Components** by default:
- **Server Components**: Run exclusively on the server, can directly query databases and access secrets, and send zero JavaScript to the client bundle.
- **Client Components (\`"use client"\`)**: Opt in to client-side interactivity, state (\`useState\`), effects (\`useEffect\`), and browser APIs.`,
          },
        ],
      },
      {
        title: "Routing and Data",
        description: "Dynamic route params, data fetching on the server, and API Route Handlers.",
        lessons: [
          {
            title: "Dynamic Routes",
            contentType: "article",
            duration: 10,
            description: "Declaring dynamic segments using bracket notation like [courseId].",
            content: `### Dynamic Route Segments

Dynamic routes are created by wrapping folder names in square brackets: \`app/courses/[courseId]/page.tsx\`. The dynamic param is passed directly to the page component.`,
          },
          {
            title: "Route Parameters",
            contentType: "article",
            duration: 12,
            description: "Async params in Next.js 15+ and searchParams handling.",
            content: `### Modern Route Parameters

In modern Next.js, \`params\` and \`searchParams\` are asynchronous promises that must be awaited in server components:

\`\`\`tsx
export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <div>Course: {courseId}</div>;
}
\`\`\``,
          },
          {
            title: "Server Data Fetching",
            contentType: "article",
            duration: 14,
            description: "Fetching directly from databases or cached fetch calls on the server.",
            content: `### Direct Server Fetching

Server Components can directly query databases (like MongoDB Atlas) using repository functions without requiring an intermediate HTTP fetch round-trip.`,
          },
          {
            title: "API Routes",
            contentType: "article",
            duration: 14,
            description: "Writing RESTful endpoints in app/api/ with Route Handlers.",
            content: `### Route Handlers in Next.js

Route Handlers are defined in \`route.ts\` files inside the \`app/\` directory and export standard HTTP method handlers (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`, \`PATCH\`).`,
          },
        ],
      },
      {
        title: "Full Stack Features",
        description: "Database repositories, authentication with Clerk, and middleware guards.",
        lessons: [
          {
            title: "Database Integration",
            contentType: "article",
            duration: 14,
            description: "Connecting MongoDB with connection pooling and type-safe schemas.",
            content: `### MongoDB with Next.js

Learn how to manage MongoDB connection pooling across serverless Lambdas using cached global client promises to prevent connection leaks.`,
          },
          {
            title: "Authentication",
            contentType: "article",
            duration: 14,
            description: "Securing routes and managing user sessions with Clerk v7.",
            content: `### Authentication with Clerk

Integrating Clerk with Next.js provides authentication, session management, and role-based access control (RBAC) across server components, client components, and API routes.`,
          },
          {
            title: "Forms and Validation",
            contentType: "article",
            duration: 12,
            description: "Validating client and server inputs with Zod and React Hook Form.",
            content: `### End-to-End Validation

Never trust client inputs! Validate payloads on the client for instant user feedback and on the server using Zod schemas for airtight security.`,
          },
          {
            title: "Middleware and Security",
            contentType: "article",
            duration: 14,
            description: "Route interception, rate limiting, and HTTP security headers.",
            content: `### Next.js Proxy & Middleware

Use \`proxy.ts\` or \`middleware.ts\` to protect sensitive route groups and inject security headers (\`X-Frame-Options\`, \`CSP\`) before requests reach application components.`,
          },
        ],
      },
      {
        title: "Production Deployment",
        description: "Environment secrets, build optimization, and deploying to Vercel.",
        lessons: [
          {
            title: "Environment Variables",
            contentType: "article",
            duration: 10,
            description: "Protecting server secrets from client exposure using NEXT_PUBLIC prefixes.",
            content: `### Environment Security

Only prefix variables with \`NEXT_PUBLIC_\` if they are explicitly intended to be bundled into client browser JavaScript. Server secrets must remain private.`,
          },
          {
            title: "Performance Optimization",
            contentType: "article",
            duration: 12,
            description: "Turbopack builds, image optimization with next/image, and caching.",
            content: `### Production Web Vitals

Next.js provides automatic image optimization, font preloading, and aggressive JavaScript bundle dead-code elimination to achieve high Google Lighthouse scores.`,
          },
          {
            title: "Production Builds",
            contentType: "article",
            duration: 12,
            description: "Running npm run build, type verification, and static page analysis.",
            content: `### Verifying Production Builds

Running \`next build\` compiles TypeScript, validates page routes, checks static exports, and packages serverless lambda bundles.`,
          },
          {
            title: "Deploying with Vercel",
            contentType: "article",
            duration: 12,
            description: "Zero-configuration continuous deployment from GitHub to Vercel.",
            content: `### Git-Driven Deployment

Pushing commits to GitHub automatically triggers continuous integration builds on Vercel, creating instant preview deployments for pull requests and zero-downtime production releases.`,
          },
        ],
      },
    ],
  },
];
