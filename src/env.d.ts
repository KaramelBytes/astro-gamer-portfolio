/// <reference types="astro/client" />

// Add type declarations for Astro client directives
declare namespace JSX {
  interface IntrinsicElements {
    // Allow client:* directives on all elements
    [elemName: string]: any;
  }
}

// Extend the Window interface if needed
declare global {
  interface Window {
    // Add any global browser API declarations here if needed
  }
}
