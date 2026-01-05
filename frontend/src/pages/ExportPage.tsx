/**
 * Export Page
 * 
 * The grand finale - where projects become reality.
 * Aesthetic: Clean, confident, with a sense of accomplishment
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  RefreshCw, 
  Rocket, 
  Sparkles, 
  FileCode2, 
  Database, 
  Palette, 
  BookOpen,
  ArrowRight,
  Zap,
  Box,
  GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExportButton } from '@/components/export/ExportButton';
import { ExportPreview } from '@/components/export/ExportPreview';
import { ValidationStatus } from '@/components/export/ValidationStatus';
import { validateExport, type ValidationResult } from '@/lib/export-validator';
import { collectExportFiles, getExportStats } from '@/lib/export-generator';
import { loadProductOverview } from '@/lib/product-loader';
import { cn } from '@/lib/utils';

// Stack items for display
const stackItems = [
  { 
    icon: Box, 
    name: 'Next.js 15', 
    desc: 'App Router', 
    color: 'text-slate-600 dark:text-slate-300',
    bg: 'bg-slate-500/10'
  },
  { 
    icon: Database, 
    name: 'Prisma', 
    desc: 'PostgreSQL', 
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-500/10'
  },
  { 
    icon: GitBranch, 
    name: 'Clerk', 
    desc: 'Auth', 
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10'
  },
  { 
    icon: Palette, 
    name: 'Tailwind v4', 
    desc: 'Styling', 
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
];

export default function ExportPage() {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [exportFiles, setExportFiles] = useState<Map<string, string>>(new Map());
  
  // Get project data
  const overview = loadProductOverview();
  const projectName = overview?.name || 'My Project';
  
  // Run validation on mount and when refreshed
  const runValidation = () => {
    setIsValidating(true);
    // Small delay to show loading state
    setTimeout(() => {
      const result = validateExport();
      setValidation(result);
      setIsValidating(false);
      
      // Collect files for preview
      try {
        const files = collectExportFiles({ projectName });
        setExportFiles(files);
      } catch {
        // Ignore errors during file collection
      }
    }, 400);
  };
  
  useEffect(() => {
    runValidation();
  }, []);
  
  // Calculate stats
  const stats = useMemo(() => {
    if (exportFiles.size === 0) return null;
    return getExportStats(exportFiles);
  }, [exportFiles]);
  
  return (
    <div className="min-h-full">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-muted/50 via-background to-muted/30">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-500 text-white shadow-lg shadow-primary/25">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight">
                    Export
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Generate your production-ready scaffold
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={runValidation}
              disabled={isValidating}
              className="gap-2"
            >
              <RefreshCw className={cn(
                'w-4 h-4 transition-transform',
                isValidating && 'animate-spin'
              )} />
              Refresh
            </Button>
          </div>
          
          {/* Project Name Display */}
          {overview && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{projectName}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <code className="text-xs font-mono text-muted-foreground">
                {projectName.toLowerCase().replace(/\s+/g, '-')}.zip
              </code>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          {/* Left Column - Preview */}
          <div className="space-y-6">
            {/* Export Preview */}
            {exportFiles.size > 0 ? (
              <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <ExportPreview 
                  files={exportFiles} 
                  projectName={projectName}
                />
              </div>
            ) : (
              <Card className="h-[500px] flex items-center justify-center">
                <div className="text-center space-y-3">
                  <RefreshCw className="w-8 h-8 mx-auto text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading preview...</p>
                </div>
              </Card>
            )}
          </div>
          
          {/* Right Column - Validation & Export */}
          <div className="space-y-6">
            {/* Validation status */}
            <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              {validation ? (
                <ValidationStatus result={validation} />
              ) : (
                <Card className="h-64 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <RefreshCw className="w-8 h-8 mx-auto text-muted-foreground animate-spin" />
                    <p className="text-sm text-muted-foreground">Validating project...</p>
                  </div>
                </Card>
              )}
            </div>
            
            {/* Export button */}
            <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <ExportButton
                disabled={!validation?.isValid || isValidating}
                projectName={projectName}
              />
            </div>
            
            {/* Stats */}
            {stats && (
              <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <Card className="border-dashed">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileCode2 className="w-4 h-4" />
                        <span>{stats.fileCount} files</span>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {stats.formattedSize}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        
        {/* Golden Stack Section */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <Card className="border-2 border-border/50 overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">The Golden Stack</CardTitle>
                  <CardDescription className="text-xs">
                    Opinionated, production-ready technologies
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stackItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.name}
                      className={cn(
                        'group p-4 rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-transparent',
                        'hover:border-border hover:shadow-sm transition-all duration-200',
                        'opacity-0 animate-scale-in'
                      )}
                      style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'forwards' }}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                        item.bg
                      )}>
                        <Icon className={cn('w-5 h-5', item.color)} />
                      </div>
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* What's Included Section */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <Card className="border-dashed">
            <CardContent className="py-8">
              <div className="flex flex-col items-center text-center max-w-xl mx-auto">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/10 text-primary ring-1 ring-primary/10">
                  <Rocket className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">Ready for AI Agents</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Your export includes comprehensive instructions for Cursor, Windsurf, Claude Code, and other AI coding agents. 
                  Open <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">docs/prompts/kickoff.md</code> to start building.
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { icon: BookOpen, label: 'Step-by-step guides' },
                    { icon: FileCode2, label: 'Pre-built components' },
                    { icon: Database, label: 'Database schema' },
                    { icon: Palette, label: 'Design tokens' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <span 
                        key={item.label}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs font-medium"
                      >
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {item.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
