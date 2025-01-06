'use client';
// components/profile/steps/BankDetailsStep.tsx
import { useState } from 'react';
import { StepProps } from '@/components/profile/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateProfileData } from '@/components/profile/utils/profile';
import { useToast } from '@/hooks/use-toast';
import { Info, Eye, EyeOff } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function BankDetailsStep({
  data,
  onUpdate,
  onNext,
  onPrev,
}: StepProps) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const handleChange = (field: string, value: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    onUpdate({
      accountDetails: {
        ...data.accountDetails,
        [field]: value
      }
    });
  };

  const validateAndContinue = () => {
    const validationErrors = validateProfileData(data, 'bank');
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        const field = error.toLowerCase().includes('ifsc') ? 'ifscCode' :
                     error.toLowerCase().includes('account') ? 'accountNumber' : 'bankName';
        errorMap[field] = error;
      });
      setErrors(errorMap);
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
      });
      return;
    }
    onNext?.();
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '';
    const visibleDigits = 4;
    const maskedPortion = accountNumber.slice(0, -visibleDigits).replace(/./g, '•');
    const visiblePortion = accountNumber.slice(-visibleDigits);
    return maskedPortion + visiblePortion;
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <p className="text-sm text-muted-foreground flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Your bank details are encrypted and stored securely
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            value={data.accountDetails.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            placeholder="Enter bank name"
            className={errors.bankName ? 'border-destructive' : ''}
          />
          {errors.bankName && (
            <p className="text-sm text-destructive">{errors.bankName}</p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="accountNumber">Account Number</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setShowAccountNumber(!showAccountNumber)}
                  >
                    {showAccountNumber ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showAccountNumber ? 'Hide' : 'Show'} account number</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Input
              id="accountNumber"
              type={showAccountNumber ? "text" : "password"}
              value={data.accountDetails.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
              placeholder="Enter account number"
              className={errors.accountNumber ? 'border-destructive' : ''}
            />
            {!showAccountNumber && data.accountDetails.accountNumber && (
              <div className="absolute inset-0 flex items-center px-3 bg-background border rounded-md pointer-events-none">
                {maskAccountNumber(data.accountDetails.accountNumber)}
              </div>
            )}
          </div>
          {errors.accountNumber && (
            <p className="text-sm text-destructive">{errors.accountNumber}</p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>IFSC Format: ABCD0123456</p>
                  <p className="text-xs text-muted-foreground">First 4 characters: Bank code</p>
                  <p className="text-xs text-muted-foreground">5th character: 0</p>
                  <p className="text-xs text-muted-foreground">Last 6 characters: Branch code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="ifscCode"
            value={data.accountDetails.ifscCode}
            onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
            placeholder="Enter IFSC code"
            className={errors.ifscCode ? 'border-destructive' : ''}
            maxLength={11}
          />
          {errors.ifscCode && (
            <p className="text-sm text-destructive">{errors.ifscCode}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrev}
          className="w-24"
        >
          Back
        </Button>
        <Button 
          onClick={validateAndContinue}
          className="w-24"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}