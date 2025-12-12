/**
 * Global Timer Type Fix for Node.js v22 compatibility
 * Resolves setTimeout/setInterval return type conflicts across the entire codebase
 */

declare global {
  // Override the NodeJS.Timeout to be compatible with both Node.js and browser environments
  namespace NodeJS {
    interface Timeout extends ReturnType<typeof setTimeout> {}
  }
  
  // Ensure setTimeout and setInterval return proper types
  function setTimeout(callback: (...args: any[]) => void, ms?: number, ...args: any[]): NodeJS.Timeout;
  function setInterval(callback: (...args: any[]) => void, ms?: number, ...args: any[]): NodeJS.Timeout;
  function clearTimeout(timeoutId: NodeJS.Timeout | undefined): void;
  function clearInterval(intervalId: NodeJS.Timeout | undefined): void;
}

export {};
