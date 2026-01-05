/**
 * Export Button Component
 * 
 * A dramatic, satisfying export button with progress states.
 * Aesthetic: Bold, tactile, with clear visual feedback
 */

import { useState } from 'react';
import { Download, Loader2, CheckCircle2, AlertCircle, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadExport, type ExportProgress } from '@/lib/export-generator';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  disabled?: boolean;
  projectName?: string;
  className?: string;
}

type ExportState = 'idle' | 'exporting' | 'success' | 'error';

export function ExportButton({ disabled, projectName, className }: ExportButtonProps) {
  const [state, setState] = useState<ExportState>('idle');
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleExport = async () => {
    setState('exporting');
    setError(null);
    
    try {
      await downloadExport(
        { projectName },
        (progress) => setProgress(progress)
      );
      
      setState('success');
      
      // Reset to idle after 4 seconds
      setTimeout(() => {
        setState('idle');
        setProgress(null);
      }, 4000);
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Export failed');
      
      // Reset to idle after 6 seconds
      setTimeout(() => {
        setState('idle');
        setError(null);
      }, 6000);
    }
  };
  
  const getButtonContent = () => {
    switch (state) {
      case 'exporting':
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="ml-2">{progress?.stage || 'Preparing...'}</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span className="ml-2">Downloaded!</span>
            <Sparkles className="w-4 h-4 ml-1 animate-pulse" />
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-5 h-5" />
            <span className="ml-2">Export Failed</span>
          </>
        );
      default:
        return (
          <>
            <Rocket className="w-5 h-5" />
            <span className="ml-2">Export Project</span>
            <Download className="w-4 h-4 ml-2 opacity-60" />
          </>
        );
    }
  };
  
  const getButtonStyles = () => {
    switch (state) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/25';
      case 'exporting':
        return 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground';
      default:
        return 'bg-gradient-to-r from-primary via-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-600 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30';
    }
  };
  
  return (
    <div className={cn('space-y-3', className)}>
      <Button
        size="lg"
        disabled={disabled || state === 'exporting'}
        onClick={handleExport}
        className={cn(
          'w-full h-14 text-base font-semibold rounded-xl transition-all duration-300',
          'transform active:scale-[0.98]',
          getButtonStyles(),
          disabled && 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground shadow-none'
        )}
      >
        {getButtonContent()}
      </Button>
      
      {/* Progress bar */}
      {state === 'exporting' && progress && (
        <div className="relative">
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <span className="absolute right-0 -top-5 text-xs text-muted-foreground tabular-nums">
            {progress.percentage}%
          </span>
        </div>
      )}
      
      {/* Error message */}
      {state === 'error' && error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* Idle hint */}
      {state === 'idle' && !disabled && (
        <p className="text-xs text-center text-muted-foreground">
          Generates a production-ready Next.js scaffold
        </p>
      )}
      
      {/* Disabled hint */}
      {state === 'idle' && disabled && (
        <p className="text-xs text-center text-muted-foreground">
          Fix validation errors above to enable export
        </p>
      )}
    </div>
  );
}
