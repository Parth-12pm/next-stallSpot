// hooks/useAutosave.ts
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProfileFormData } from '@/components/profile/types/profile';
import { useToast } from './use-toast';

const AUTOSAVE_INTERVAL = 3000; // 3 seconds
const DRAFT_KEY = 'profile_draft';

interface AutosaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasChanges: boolean;
}

export function useAutosave(formData: ProfileFormData) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [autosaveState, setAutosaveState] = useState<AutosaveState>({
    lastSaved: null,
    isSaving: false,
    hasChanges: false,
  });

  const previousDataRef = useRef<string>(JSON.stringify(formData));

  // Check for changes
  useEffect(() => {
    const currentData = JSON.stringify(formData);
    if (currentData !== previousDataRef.current) {
      setAutosaveState(prev => ({ ...prev, hasChanges: true }));
      previousDataRef.current = currentData;
    }
  }, [formData]);

  // Autosave logic
  useEffect(() => {
    if (!session?.user?.email || !autosaveState.hasChanges) return;

    const timer = setTimeout(async () => {
      try {
        setAutosaveState(prev => ({ ...prev, isSaving: true }));

        // Save to localStorage
        const draft = {
          formData,
          timestamp: new Date().toISOString(),
          userEmail: session.user.email,
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));

        // Optional: Save to backend
        // await fetch('/api/profile/draft', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(draft),
        // });

        setAutosaveState({
          lastSaved: new Date(),
          isSaving: false,
          hasChanges: false,
        });
      } catch (error) {
        console.error('Autosave error:', error);
        toast({
          title: "Autosave Failed",
          description: "Your changes couldn't be saved automatically",
          variant: "destructive",
        });
        setAutosaveState(prev => ({ ...prev, isSaving: false }));
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [formData, session?.user?.email, autosaveState.hasChanges, toast]);

  // Load draft on mount
  const loadDraft = (): ProfileFormData | null => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (!savedDraft) return null;

      const draft = JSON.parse(savedDraft);
      if (draft.userEmail !== session?.user?.email) return null;

      // Check if draft is not too old (e.g., 24 hours)
      const draftAge = new Date().getTime() - new Date(draft.timestamp).getTime();
      if (draftAge > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }

      return draft.formData;
    } catch {
      return null;
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  return {
    lastSaved: autosaveState.lastSaved,
    isSaving: autosaveState.isSaving,
    hasChanges: autosaveState.hasChanges,
    loadDraft,
    clearDraft,
  };
}