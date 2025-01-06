// types/profile.ts
export type UserRole = 'organizer' | 'vendor';
export type RegistrationType = 'CIN' | 'GSTIN' | 'UDYAM';

export interface CompanyDetails {
  companyName: string;
  registrationType: RegistrationType;
  registrationNumber: string;
  website?: string;
}

export interface AccountDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  role: UserRole;
  dateOfBirth: string;
  contact: string;
  address: string;
  companyDetails: CompanyDetails;
  accountDetails: AccountDetails;
  selfDescription: string;
  profilePicture?: string;
}

export type FormStep = 'basic' | 'company' | 'bank' | 'additional';

export interface StepProps {
  data: ProfileFormData;
  onUpdate: (data: Partial<ProfileFormData>) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isLastStep?: boolean;
}

export const FORM_STEPS = [
  {
    id: 'basic' as const,
    title: 'Basic Information',
    description: 'Start with your personal details'
  },
  {
    id: 'company' as const,
    title: 'Company Details',
    description: 'Tell us about your business'
  },
  {
    id: 'bank' as const,
    title: 'Bank Information',
    description: 'Add your banking details'
  },
  {
    id: 'additional' as const,
    title: 'Additional Information',
    description: 'Complete your profile'
  }
];


export const REGISTRATION_TYPES = [
  { value: 'CIN', label: 'Corporate Identity Number (CIN)' },
  { value: 'GSTIN', label: 'GST Registration Number' },
  { value: 'UDYAM', label: 'Udyam Registration Number' }
] as const;