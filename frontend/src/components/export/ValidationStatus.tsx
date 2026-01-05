/**
 * Validation Status Component
 * 
 * Displays export readiness with clear visual indicators.
 * Aesthetic: Dashboard-like with progress tracking
 */

import { AlertCircle, AlertTriangle, Shield, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ValidationResult, ValidationError, ValidationWarning } from '@/lib/export-validator';

interface ValidationStatusProps {
  result: ValidationResult;
}

export function ValidationStatus({ result }: ValidationStatusProps) {
  const { isValid, errors, warnings, summary } = result;
  
  return (
    <Card className={cn(
      'overflow-hidden border-2 transition-colors duration-300',
      isValid 
        ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent' 
        : 'border-destructive/30 bg-gradient-to-br from-destructive/5 to-transparent'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl ring-1',
              isValid 
                ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' 
                : 'bg-destructive/10 text-destructive ring-destructive/20'
            )}>
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Export Readiness</CardTitle>
              <CardDescription className="text-xs">
                {summary.passedChecks} of {summary.totalChecks} checks passed
              </CardDescription>
            </div>
          </div>
          
          <StatusBadge isValid={isValid} warningCount={warnings.length} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={`${summary.completionPercentage * 1.76} 176`}
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-700 ease-out',
                  isValid ? 'text-emerald-500' : 'text-primary'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold tabular-nums">
                {summary.completionPercentage}%
              </span>
            </div>
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Errors</span>
              <span className={cn(
                'font-semibold tabular-nums',
                errors.length > 0 ? 'text-destructive' : 'text-emerald-500'
              )}>
                {errors.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Warnings</span>
              <span className={cn(
                'font-semibold tabular-nums',
                warnings.length > 0 ? 'text-amber-500' : 'text-emerald-500'
              )}>
                {warnings.length}
              </span>
            </div>
          </div>
        </div>
        
        {/* Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Must Fix ({errors.length})
            </h4>
            <ul className="space-y-2">
              {errors.map((error, index) => (
                <ValidationItem key={index} item={error} type="error" />
              ))}
            </ul>
          </div>
        )}
        
        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Recommended ({warnings.length})
            </h4>
            <ul className="space-y-2">
              {warnings.map((warning, index) => (
                <ValidationItem key={index} item={warning} type="warning" />
              ))}
            </ul>
          </div>
        )}
        
        {/* All good */}
        {isValid && warnings.length === 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
              <Sparkles className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                All checks passed!
              </p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                Your project is ready to export
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ isValid, warningCount }: { isValid: boolean; warningCount: number }) {
  if (!isValid) {
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-destructive/10 text-destructive border border-destructive/20">
        Not Ready
      </span>
    );
  }
  
  if (warningCount > 0) {
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        Ready
      </span>
    );
  }
  
  return (
    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
      Perfect
    </span>
  );
}

interface ValidationItemProps {
  item: ValidationError | ValidationWarning;
  type: 'error' | 'warning';
}

function ValidationItem({ item, type }: ValidationItemProps) {
  const Icon = type === 'error' ? AlertCircle : AlertTriangle;
  
  return (
    <li className={cn(
      'flex items-start gap-3 p-3 rounded-lg border',
      type === 'error' 
        ? 'bg-destructive/5 border-destructive/10' 
        : 'bg-amber-500/5 border-amber-500/10'
    )}>
      <Icon className={cn(
        'w-4 h-4 mt-0.5 flex-shrink-0',
        type === 'error' ? 'text-destructive' : 'text-amber-500'
      )} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{item.message}</p>
        {item.file && (
          <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
            {item.file}
          </p>
        )}
        {item.suggestion && (
          <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
            <span className="opacity-60">💡</span>
            <span>{item.suggestion}</span>
          </p>
        )}
      </div>
    </li>
  );
}
