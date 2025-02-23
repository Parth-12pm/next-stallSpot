// utils/profile.ts
import { ProfileFormData, UserRole } from '@/components/profile/types/profile';

export const initialFormData: ProfileFormData = {
  name: '',
  email: '',
  role: 'vendor',
  dateOfBirth: '',
  contact: '',
  address: '',
  companyDetails: {
    companyName: '',
    registrationType: 'GSTIN',
    registrationNumber: '',
    website: '',
  },
  accountDetails: {
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  },
  selfDescription: '',
  companyDetailsSkipped: false
};

export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const validateGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

export const validateCIN = (cin: string): boolean => {
  const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
  return cinRegex.test(cin);
};

export const validateUdyam = (udyam: string): boolean => {
  const udyamRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
  return udyamRegex.test(udyam);
};

// Helper function to check if company details are provided
const hasCompanyDetails = (data: Partial<ProfileFormData>): boolean => {
  return !!(
    data.companyDetails?.companyName ||
    data.companyDetails?.registrationNumber ||
    data.companyDetails?.registrationType
  );
};

export const validateProfileData = (
  data: Partial<ProfileFormData>,
  step: string,
  role: UserRole = 'vendor'
): string[] => {
  const errors: string[] = [];

  switch (step) {
    case 'basic':
      if (!data.name?.trim()) errors.push('Name is required');
      if (!data.dateOfBirth) errors.push('Date of birth is required');
      if (!data.contact?.trim()) errors.push('Contact number is required');
      if (!data.address?.trim()) errors.push('Address is required');
      
      if (data.dateOfBirth) {
        const age = calculateAge(data.dateOfBirth);
        if (age < 18) errors.push('Must be at least 18 years old');
      }
      break;

    case 'company':
      // For organizers, company details are always required
      if (role === 'organizer') {
        if (!data.companyDetails?.companyName?.trim()) {
          errors.push('Company name is required');
        }
        if (!data.companyDetails?.registrationType) {
          errors.push('Registration type is required');
        }
        if (!data.companyDetails?.registrationNumber?.trim()) {
          errors.push('Registration number is required');
        }
      } else if (hasCompanyDetails(data)) {
        // For vendors, validate only if any company detail is provided
        if (!data.companyDetails?.companyName?.trim()) {
          errors.push('Company name is required when providing company details');
        }
        if (!data.companyDetails?.registrationType) {
          errors.push('Registration type is required when providing company details');
        }
        if (!data.companyDetails?.registrationNumber?.trim()) {
          errors.push('Registration number is required when providing company details');
        }
      }

      // Validate registration number format if provided
      if (data.companyDetails?.registrationNumber && data.companyDetails?.registrationType) {
        const regNumber = data.companyDetails.registrationNumber;
        switch (data.companyDetails.registrationType) {
          case 'GSTIN':
            if (!validateGSTIN(regNumber)) {
              errors.push('Invalid GSTIN format');
            }
            break;
          case 'CIN':
            if (!validateCIN(regNumber)) {
              errors.push('Invalid CIN format');
            }
            break;
          case 'UDYAM':
            if (!validateUdyam(regNumber)) {
              errors.push('Invalid Udyam registration number format');
            }
            break;
        }
      }
      break;

    case 'bank':
      if (!data.accountDetails?.bankName?.trim()) {
        errors.push('Bank name is required');
      }
      if (!data.accountDetails?.accountNumber?.trim()) {
        errors.push('Account number is required');
      }
      if (!data.accountDetails?.ifscCode?.trim()) {
        errors.push('IFSC code is required');
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.accountDetails.ifscCode)) {
        errors.push('Invalid IFSC code format');
      }
      break;

    case 'additional':
      if (!data.selfDescription?.trim()) {
        errors.push('Self description is required');
      }
      break;
  }

  return errors;
};