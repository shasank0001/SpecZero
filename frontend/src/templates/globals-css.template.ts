import type { TemplateConfig } from './types';

export function generateGlobalsCss(_config: TemplateConfig): string {
  return `@import "tailwindcss";

@theme {
  --font-sans: "Outfit", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}

:root {
  --background: 0 0% 99%;
  --foreground: 240 10% 10%;

  --card: 0 0% 100%;
  --card-foreground: 240 10% 10%;

  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 10%;

  --primary: 240 60% 55%;
  --primary-foreground: 0 0% 100%;

  --secondary: 240 5% 96%;
  --secondary-foreground: 240 10% 30%;

  --muted: 240 5% 94%;
  --muted-foreground: 240 5% 45%;

  --accent: 240 5% 96%;
  --accent-foreground: 240 10% 30%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  --border: 240 5% 90%;
  --input: 240 5% 90%;
  --ring: 240 60% 55%;
}

.dark {
  --background: 240 10% 6%;
  --foreground: 0 0% 95%;

  --card: 240 10% 8%;
  --card-foreground: 0 0% 95%;

  --popover: 240 10% 8%;
  --popover-foreground: 0 0% 95%;

  --primary: 240 60% 60%;
  --primary-foreground: 0 0% 100%;

  --secondary: 240 5% 15%;
  --secondary-foreground: 0 0% 85%;

  --muted: 240 5% 18%;
  --muted-foreground: 240 5% 55%;

  --accent: 240 5% 15%;
  --accent-foreground: 0 0% 85%;

  --destructive: 0 62% 50%;
  --destructive-foreground: 0 0% 100%;

  --border: 240 5% 18%;
  --input: 240 5% 18%;
  --ring: 240 60% 60%;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
`;
}
