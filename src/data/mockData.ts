import { BlogPost } from "@/components/BlogCard";
import { Comment } from "@/components/CommentSystem";

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React Hooks",
    excerpt: "Learn the fundamentals of React Hooks and how they can simplify your component logic. We'll cover useState, useEffect, and custom hooks.",
    content: `# Getting Started with React Hooks

React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components. In this comprehensive guide, we'll explore the most important hooks and how to use them effectively.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They allow you to use state and other React features without writing a class component.

## useState Hook

The useState hook is the most basic hook and allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Custom Hooks

Custom hooks are a mechanism to reuse stateful logic between components. They're JavaScript functions whose names start with "use" and that may call other hooks:

\`\`\`javascript
import { useState, useEffect } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
\`\`\`

## Best Practices

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call them from React function components or custom hooks
3. **Use the ESLint plugin** - The rules of hooks ESLint plugin helps enforce these rules

## Conclusion

React Hooks provide a powerful way to write more concise and reusable components. Start with useState and useEffect, then explore other hooks like useContext, useReducer, and custom hooks as your needs grow.`,
    author: "Sarah Chen",
    category: "React",
    publishedAt: "2024-01-15",
    commentCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
  },
  {
    id: "2", 
    title: "Understanding TypeScript Interfaces",
    excerpt: "Dive deep into TypeScript interfaces and learn how they can help you write more robust and maintainable code with better type safety.",
    content: `# Understanding TypeScript Interfaces

TypeScript interfaces are one of the core features that make TypeScript so powerful for building large-scale applications. They provide a way to define contracts within your code and ensure type safety across your application.

## What are Interfaces?

Interfaces in TypeScript are a way to define the shape of an object. They specify what properties an object should have and what types those properties should be.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

## Optional Properties

You can make properties optional by adding a \`?\` after the property name:

\`\`\`typescript
interface Config {
  host: string;
  port?: number; // Optional
  ssl?: boolean; // Optional
}
\`\`\`

## Function Types

Interfaces can also describe function types:

\`\`\`typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

const mySearch: SearchFunc = function(src, sub) {
  return src.search(sub) > -1;
};
\`\`\`

## Extending Interfaces

Interfaces can extend other interfaces, allowing you to copy members from one interface into another:

\`\`\`typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const myDog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever"
};
\`\`\`

## Best Practices

1. **Use PascalCase** for interface names
2. **Prefix with 'I'** only when necessary for disambiguation
3. **Keep interfaces focused** - each interface should have a single responsibility
4. **Use readonly** for immutable properties

## Conclusion

TypeScript interfaces are essential for writing maintainable, type-safe code. They help catch errors at compile time and make your code more self-documenting.`,
    author: "Michael Rodriguez",
    category: "TypeScript",
    publishedAt: "2024-01-12",
    commentCount: 5,
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop"
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt: "A comprehensive comparison between CSS Grid and Flexbox. Learn the strengths of each layout method and when to use them in your projects.",
    content: `# CSS Grid vs Flexbox: When to Use Which

Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes. Understanding when to use each one will make you a more effective front-end developer.

## CSS Grid: Two-Dimensional Layouts

CSS Grid is designed for two-dimensional layouts - it can handle both rows and columns simultaneously.

### When to Use CSS Grid:

1. **Complex layouts** with both rows and columns
2. **Webpage layouts** like headers, sidebars, content areas
3. **Card layouts** where you need precise control
4. **Overlapping elements**

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  gap: 20px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

## Flexbox: One-Dimensional Layouts

Flexbox is designed for one-dimensional layouts - either a row or a column.

### When to Use Flexbox:

1. **Navigation bars**
2. **Centering content**
3. **Distributing space** between items
4. **Aligning items** within a container

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.flex-item {
  flex: 1; /* Equal width items */
}
\`\`\`

## Combining Both

Often, the best approach is to use both Grid and Flexbox together:

\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas: "header" "main" "footer";
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## Quick Decision Guide

**Use CSS Grid when:**
- You need a 2D layout (rows AND columns)
- You're designing the overall page layout
- You need to align items in two dimensions

**Use Flexbox when:**
- You need a 1D layout (row OR column)
- You're working with components within a layout
- You need to distribute space or align items along one axis

## Conclusion

Both CSS Grid and Flexbox are essential tools in modern web development. Grid excels at overall layout structure, while Flexbox is perfect for component-level arrangements. Master both to become a layout expert!`,
    author: "Emma Thompson",
    category: "CSS",
    publishedAt: "2024-01-10",
    commentCount: 12,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop"
  },
  {
    id: "4",
    title: "Building Responsive Web Applications",
    excerpt: "Master the art of responsive design with modern CSS techniques, mobile-first approach, and progressive enhancement strategies.",
    content: `# Building Responsive Web Applications

Responsive design is no longer optional in modern web development. With users accessing websites from countless devices, creating flexible, adaptive layouts is essential.

## Mobile-First Approach

Start designing for mobile devices first, then progressively enhance for larger screens:

\`\`\`css
/* Mobile styles (default) */
.container {
  padding: 16px;
  font-size: 14px;
}

/* Tablet styles */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    font-size: 18px;
  }
}
\`\`\`

## Flexible Units

Use relative units instead of fixed pixels:

- **rem/em** for typography and spacing
- **%** for widths
- **vw/vh** for viewport-based sizing
- **fr** in CSS Grid

## Responsive Images

Optimize images for different screen sizes and resolutions:

\`\`\`html
<picture>
  <source media="(min-width: 1024px)" srcset="hero-large.jpg">
  <source media="(min-width: 768px)" srcset="hero-medium.jpg">
  <img src="hero-small.jpg" alt="Hero image">
</picture>
\`\`\`

## Container Queries

The future of responsive design with container queries:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .card {
    display: flex;
    gap: 16px;
  }
}
\`\`\`

## Testing Strategies

1. **Use browser dev tools** for device simulation
2. **Test on real devices** when possible
3. **Use responsive design testing tools**
4. **Consider touch targets** (minimum 44px)

## Performance Considerations

- **Lazy load images** below the fold
- **Use modern image formats** (WebP, AVIF)
- **Minimize CSS** and remove unused styles
- **Optimize Critical Rendering Path**

## Conclusion

Responsive design requires thinking beyond device categories. Focus on content, user experience, and progressive enhancement to create truly adaptive web applications.`,
    author: "David Kim",
    category: "Web Design",
    publishedAt: "2024-01-08",
    commentCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=400&fit=crop"
  }
];

export const mockComments: Comment[] = [
  {
    id: "1",
    author: "Alex Johnson",
    content: "Great explanation of React Hooks! The useState example really helped me understand the concept better.",
    createdAt: "2024-01-16T10:30:00Z",
    postId: "1"
  },
  {
    id: "2", 
    author: "Maria Garcia",
    content: "I've been struggling with useEffect, but your explanation of the dependency array made it click. Thank you!",
    createdAt: "2024-01-16T14:15:00Z",
    postId: "1"
  },
  {
    id: "3",
    author: "James Wilson",
    content: "The custom hooks section is gold. I never thought about reusing stateful logic that way.",
    createdAt: "2024-01-17T09:45:00Z",
    postId: "1"
  },
  {
    id: "4",
    author: "Lisa Chen",
    content: "TypeScript interfaces can be tricky, but this breakdown makes them much clearer. The extending interfaces part was particularly helpful.",
    createdAt: "2024-01-13T16:20:00Z", 
    postId: "2"
  },
  {
    id: "5",
    author: "Tom Brown",
    content: "Finally understand when to use Grid vs Flexbox! The decision guide at the end is perfect.",
    createdAt: "2024-01-11T11:30:00Z",
    postId: "3"
  }
];

export const categories = ["React", "TypeScript", "CSS", "Web Design", "JavaScript", "Node.js"];

// Helper functions for data manipulation
export const getPostById = (id: string): BlogPost | undefined => {
  return mockPosts.find(post => post.id === id);
};

export const getCommentsByPostId = (postId: string): Comment[] => {
  return mockComments.filter(comment => comment.postId === postId);
};

export const addComment = (comment: Omit<Comment, "id" | "createdAt">): Comment => {
  const newComment: Comment = {
    ...comment,
    id: (mockComments.length + 1).toString(),
    createdAt: new Date().toISOString()
  };
  mockComments.push(newComment);
  
  // Update comment count in the corresponding post
  const post = mockPosts.find(p => p.id === comment.postId);
  if (post) {
    post.commentCount++;
  }
  
  return newComment;
};

export const addPost = (post: Omit<BlogPost, "id" | "publishedAt" | "commentCount">): BlogPost => {
  const newPost: BlogPost = {
    ...post,
    id: (mockPosts.length + 1).toString(),
    publishedAt: new Date().toISOString(),
    commentCount: 0
  };
  mockPosts.unshift(newPost); // Add to beginning
  return newPost;
};

export const updatePost = (id: string, updates: Partial<BlogPost>): BlogPost | undefined => {
  const postIndex = mockPosts.findIndex(post => post.id === id);
  if (postIndex === -1) return undefined;
  
  mockPosts[postIndex] = { ...mockPosts[postIndex], ...updates };
  return mockPosts[postIndex];
};

export const deletePost = (id: string): boolean => {
  const postIndex = mockPosts.findIndex(post => post.id === id);
  if (postIndex === -1) return false;
  
  mockPosts.splice(postIndex, 1);
  // Also remove associated comments
  const commentIndices = [];
  for (let i = mockComments.length - 1; i >= 0; i--) {
    if (mockComments[i].postId === id) {
      commentIndices.push(i);
    }
  }
  commentIndices.forEach(index => mockComments.splice(index, 1));
  
  return true;
};