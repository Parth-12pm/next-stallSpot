import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { StepProps, REGISTRATION_TYPES, UserRole } from '@/components/profile/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateProfileData } from '@/components/profile/utils/profile';
import { useToast } from '@/hooks/use-toast';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

const registrationFormats = {
  CIN: 'Format: L12345AB1234ABC123456',
  GSTIN: 'Format: 22AAAAA0000A1Z5',
  UDYAM: 'Format: UDYAM-XX-00-0000000'
};

export function CompanyDetailsStep({
  data,
  onUpdate,
  onNext,
  onPrev,
}: StepProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [includeCompanyDetails, setIncludeCompanyDetails] = useState(
    !!data.companyDetails?.companyName || session?.user?.role === 'organizer'
  );
  
  const isOrganizer = session?.user?.role === 'organizer';

  const handleToggleCompanyDetails = (checked: boolean) => {
    setIncludeCompanyDetails(checked);
    if (!checked) {
      // Set company details to undefined when toggled off
      onUpdate({
        companyDetails: undefined
      });
      setErrors({});
    }
  };

  const handleChange = (field: string, value: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    onUpdate({
      companyDetails: {
        ...data.companyDetails,
        [field]: value
      }
    });
  };

  const validateAndContinue = () => {
    // Skip validation if vendor doesn't want to include company details
    if (!isOrganizer && !includeCompanyDetails) {
      onNext?.();
      return;
    }

    const userRole = (session?.user?.role as UserRole) || 'vendor';
    const validationErrors = validateProfileData(data, 'company', userRole);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        const field = error.toLowerCase().includes('registration') ? 'registrationNumber' : 'companyName';
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

  return (
    <div className="space-y-6">
      {!isOrganizer && (
        <div className="flex items-center justify-between border-b pb-4">
          <div className="space-y-0.5">
            <Label className="text-base">Company Registration</Label>
            <p className="text-sm text-muted-foreground">
              Would you like to add your company details?
            </p>
          </div>
          <Switch
            checked={includeCompanyDetails}
            onCheckedChange={handleToggleCompanyDetails}
          />
        </div>
      )}

      {(isOrganizer || includeCompanyDetails) && (
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="companyName">
              Company Name
              {isOrganizer && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id="companyName"
              value={data.companyDetails.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Enter your company name"
              className={errors.companyName ? 'border-destructive' : ''}
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="registrationType">
              Registration Type
              {isOrganizer && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={data.companyDetails.registrationType}
              onValueChange={(value) => handleChange('registrationType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select registration type" />
              </SelectTrigger>
              <SelectContent>
                {REGISTRATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="registrationNumber">
                Registration Number
                {isOrganizer && <span className="text-destructive ml-1">*</span>}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{registrationFormats[data.companyDetails.registrationType]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="registrationNumber"
              value={data.companyDetails.registrationNumber}
              onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
              placeholder="Enter registration number"
              className={errors.registrationNumber ? 'border-destructive' : ''}
            />
            {errors.registrationNumber && (
              <p className="text-sm text-destructive">{errors.registrationNumber}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              type="url"
              value={data.companyDetails.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://"
            />
          </div>
        </div>
      )}

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