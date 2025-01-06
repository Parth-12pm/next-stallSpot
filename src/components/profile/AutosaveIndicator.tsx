// components/profile/AutosaveIndicator.tsx
import { Loader2, Check } from 'lucide-react';

interface AutosaveIndicatorProps {
  lastSaved: Date | null;
  isSaving: boolean;
  hasChanges: boolean;
}

export function AutosaveIndicator({ 
  lastSaved, 
  isSaving, 
  hasChanges 
}: AutosaveIndicatorProps) {
  return (
    <div className="text-xs text-muted-foreground absolute top-4 right-4">
      {isSaving ? (
        <span className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </span>
      ) : hasChanges ? (
        <span>Unsaved changes</span>
      ) : lastSaved ? (
        <span className="flex items-center gap-1">
          <Check className="h-3 w-3" />
          Saved
        </span>
      ) : null}
    </div>
  );
}