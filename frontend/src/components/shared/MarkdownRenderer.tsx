/**
 * Markdown Renderer Component
 * 
 * A refined, typography-focused markdown renderer that converts
 * markdown content into beautifully styled React elements.
 * 
 * Aesthetic: Clean editorial with careful typographic hierarchy
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with refined typography
          h1: ({ children }) => (
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground mb-6 pb-3 border-b border-border/50">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground mt-10 mb-4 first:mt-0">
              <span className="relative">
                {children}
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground mt-8 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-display text-lg font-medium text-foreground mt-6 mb-2">
              {children}
            </h4>
          ),

          // Paragraphs with comfortable reading line-height
          p: ({ children }) => (
            <p className="text-muted-foreground leading-7 mb-4 last:mb-0">
              {children}
            </p>
          ),

          // Emphasis with subtle styling
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/90">{children}</em>
          ),

          // Lists with refined bullets
          ul: ({ children }) => (
            <ul className="mb-4 space-y-2 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-2 pl-1 list-decimal list-inside marker:text-primary/60 marker:font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground leading-7 flex items-start gap-2">
              <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
              <span className="flex-1">{children}</span>
            </li>
          ),

          // Blockquote with editorial styling
          blockquote: ({ children }) => (
            <blockquote className="relative my-6 pl-5 border-l-2 border-primary/40 bg-muted/30 py-4 pr-4 rounded-r-lg">
              <div className="absolute -left-px top-0 w-0.5 h-8 bg-primary rounded-full" />
              <div className="text-muted-foreground italic">
                {children}
              </div>
            </blockquote>
          ),

          // Code with clean mono styling
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-muted/80 text-foreground px-1.5 py-0.5 rounded-md text-[0.875em] font-mono border border-border/40"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={cn(
                  "block bg-muted/60 p-4 rounded-lg overflow-x-auto font-mono text-sm text-foreground border border-border/40",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-hidden rounded-lg">
              {children}
            </pre>
          ),

          // Tables with refined styling
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50 border-b border-border/60">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/40">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-muted/30">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-muted-foreground">
              {children}
            </td>
          ),

          // Links with subtle underline animation
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary font-medium underline decoration-primary/30 underline-offset-2 hover:decoration-primary/60 transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          ),

          // Images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="my-6 rounded-lg border border-border/40 shadow-sm"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
