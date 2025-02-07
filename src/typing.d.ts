// interface Window {
//   grecaptcha: {
//     ready(callback: () => void): void;
//     render(element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }): void;
//   };
// }

declare interface Window {
  grecaptcha: {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
}
