/**
 * Code Block Component
 * 
 * A refined syntax-highlighted code display with copy functionality.
 * Features smooth transitions, elegant theming, and clear visual hierarchy.
 * 
 * Aesthetic: Technical elegance with functional precision
 */

import { Highlight, themes } from "prism-react-renderer";
import { useState, useEffect } from "react";
import { Copy, Check, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  showLanguageBadge?: boolean;
  className?: string;
  maxHeight?: string;
  title?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = true,
  showCopyButton = true,
  showLanguageBadge = true,
  className,
  maxHeight = "400px",
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect and watch for theme changes
  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains("dark");
    setIsDark(checkDark());

    const observer = new MutationObserver(() => {
      setIsDark(checkDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const trimmedCode = code.trim();
  const lineCount = trimmedCode.split("\n").length;

  // Custom theme colors matching our design system
  const customDarkTheme = {
    ...themes.nightOwl,
    plain: {
      ...themes.nightOwl.plain,
      backgroundColor: "transparent",
    },
  };

  const customLightTheme = {
    ...themes.github,
    plain: {
      ...themes.github.plain,
      backgroundColor: "transparent",
    },
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden",
        "bg-gradient-to-br border",
        isDark
          ? "from-slate-900 via-slate-900 to-slate-800 border-slate-700/50"
          : "from-slate-50 via-white to-slate-50 border-slate-200",
        className
      )}
    >
      {/* Header bar */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 border-b",
          isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-100/80 border-slate-200"
        )}
      >
        <div className="flex items-center gap-2">
          {/* Decorative dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>

          {/* Title or language badge */}
          {(title || showLanguageBadge) && (
            <div className="flex items-center gap-2 ml-3">
              <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">
                {title || language}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Line count */}
          <span className="text-xs text-muted-foreground font-mono">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>

          {/* Copy button */}
          {showCopyButton && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200",
                copied && "opacity-100"
              )}
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Code content */}
      <Highlight
        theme={isDark ? customDarkTheme : customLightTheme}
        code={trimmedCode}
        language={language as any}
      >
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(highlightClassName, "p-4 overflow-auto text-sm leading-relaxed")}
            style={{
              ...style,
              maxHeight: maxHeight === "none" ? undefined : maxHeight,
              margin: 0,
            }}
          >
            <code className="font-mono">
              {tokens.map((line, lineIndex) => {
                const lineProps = getLineProps({ line });
                return (
                  <div
                    key={lineIndex}
                    {...lineProps}
                    className={cn(lineProps.className, "table-row hover:bg-primary/5 transition-colors")}
                  >
                    {showLineNumbers && (
                      <span
                        className={cn(
                          "table-cell pr-4 text-right select-none font-mono text-xs",
                          isDark ? "text-slate-600" : "text-slate-400"
                        )}
                        style={{ minWidth: "2.5rem" }}
                      >
                        {lineIndex + 1}
                      </span>
                    )}
                    <span className="table-cell">
                      {line.map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>

      {/* Copy success overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-200 pointer-events-none",
          copied ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-green-500">Copied!</span>
        </div>
      </div>
    </div>
  );
}
