// hooks/useFormPersistence.ts
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileFormData, FormStep } from '@/components/profile/types/profile';

const STORAGE_KEY = 'profile_form_data';

interface FormUpdate extends Partial<ProfileFormData> {
  _completedSteps?: FormStep[];
}

export function useFormPersistence(
  isCompletion: boolean,
  initialData: ProfileFormData
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [currentStep, setCurrentStep] = useState<FormStep>(() => {
    // Try to get step from URL first
    const stepParam = searchParams.get('step');
    return (stepParam as FormStep) || 'basic';
  });
  const [completedSteps, setCompletedSteps] = useState<FormStep[]>([]);
  const [loading, setLoading] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    if (!isCompletion) return;

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
        
        // Determine completed steps based on filled data
        const completed: FormStep[] = [];
        if (parsed.name && parsed.dateOfBirth && parsed.contact && parsed.address) {
          completed.push('basic');
        }
        if (parsed.companyDetails?.companyName && parsed.companyDetails?.registrationNumber) {
          completed.push('company');
        }
        if (parsed.accountDetails?.bankName && parsed.accountDetails?.accountNumber && parsed.accountDetails?.ifscCode) {
          completed.push('bank');
        }
        if (parsed.selfDescription) {
          completed.push('additional');
        }
        setCompletedSteps(completed);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, [isCompletion]);

  // Save data on updates
  useEffect(() => {
    if (isCompletion) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isCompletion]);

  // Update URL when step changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('step', currentStep);
    router.replace(url.pathname + url.search);
  }, [currentStep, router]);

  const handleStepUpdate = (stepData: FormUpdate) => {
    if ('_completedSteps' in stepData) {
      const { _completedSteps, ...formUpdate } = stepData;
      if (_completedSteps) {
        setCompletedSteps(_completedSteps);
      }
      if (Object.keys(formUpdate).length > 0) {
        setFormData(prev => ({ ...prev, ...formUpdate }));
      }
    } else {
      setFormData(prev => ({ ...prev, ...stepData }));
    }
  };

  const handleNext = () => {
    const steps: FormStep[] = ['basic', 'company', 'bank', 'additional'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const steps: FormStep[] = ['basic', 'company', 'bank', 'additional'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const clearFormData = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    formData,
    currentStep,
    completedSteps,
    loading,
    setLoading,
    handleStepUpdate,
    handleNext,
    handlePrev,
    clearFormData,
    setCurrentStep,
  };
}