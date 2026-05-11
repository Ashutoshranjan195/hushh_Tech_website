import { useState } from "react";
import countryList from "react-select-country-list";

export interface KYCFormData {
  // Individual fields
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  residentialAddress: string;
  taxIdentificationNumber: string;
  // Entity fields
  entityName: string;
  entityType: string;
  registrationNumber: string;
  registeredAddress: string;
  incorporationCountry: string;
  // Common
  sourceOfFunds: string;
  purposeOfInvestment: string;
  pepDeclaration: string;
  // Step 4
  taxResidency: string;
  fatcaStatus: string;
}

export interface BeneficialOwner {
  name: string;
  dateOfBirth: string;
  nationality: string;
  ownershipPercentage: string;
  residentialAddress: string;
}

export interface AuthorizedSignatory {
  name: string;
  title: string;
  email: string;
}

export interface KYCFiles {
  proofOfIdentity: File | null;
  proofOfAddress: File | null;
  bankStatement: File | null;
  // Entity specific
  certificateOfIncorporation: File | null;
  memorandumOfAssociation: File | null;
  boardResolution: File | null;
}

const initialFormData: KYCFormData = {
  fullName: "",
  dateOfBirth: "",
  nationality: "",
  residentialAddress: "",
  taxIdentificationNumber: "",
  entityName: "",
  entityType: "",
  registrationNumber: "",
  registeredAddress: "",
  incorporationCountry: "",
  sourceOfFunds: "",
  purposeOfInvestment: "",
  pepDeclaration: "",
  taxResidency: "",
  fatcaStatus: "",
};

const initialFiles: KYCFiles = {
  proofOfIdentity: null,
  proofOfAddress: null,
  bankStatement: null,
  certificateOfIncorporation: null,
  memorandumOfAssociation: null,
  boardResolution: null,
};

export function useKYCForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [investorType, setInvestorType] = useState<"individual" | "entity" | "">(
    ""
  );
  const [formData, setFormData] = useState<KYCFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof KYCFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedDeclarations, setAcceptedDeclarations] = useState<string[]>([]);
  const [files, setFiles] = useState<KYCFiles>(initialFiles);
  const [beneficialOwners, setBeneficialOwners] = useState<BeneficialOwner[]>([]);
  const [beneficialOwnerIdFiles, setBeneficialOwnerIdFiles] = useState<
    Record<number, File | null>
  >({});
  const [authorizedSignatories, setAuthorizedSignatories] = useState<
    AuthorizedSignatory[]
  >([]);

  const countryOptions = countryList().getData();

  const handleInputChange = (
    field: keyof KYCFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFileChange = (field: keyof KYCFiles, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const validateStep = (step: number): boolean => {
    const errors: Partial<Record<keyof KYCFormData, string>> = {};

    if (step === 2) {
      if (investorType === "individual") {
        if (!formData.fullName.trim()) errors.fullName = "Full name is required";
        if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        if (!formData.nationality) errors.nationality = "Nationality is required";
        if (!formData.residentialAddress.trim())
          errors.residentialAddress = "Residential address is required";
      } else if (investorType === "entity") {
        if (!formData.entityName.trim()) errors.entityName = "Entity name is required";
        if (!formData.entityType.trim()) errors.entityType = "Entity type is required";
        if (!formData.registrationNumber.trim())
          errors.registrationNumber = "Registration number is required";
        if (!formData.registeredAddress.trim())
          errors.registeredAddress = "Registered address is required";
        if (!formData.incorporationCountry)
          errors.incorporationCountry = "Country of incorporation is required";
      }
      if (!formData.sourceOfFunds.trim())
        errors.sourceOfFunds = "Source of funds is required";
      if (!formData.purposeOfInvestment.trim())
        errors.purposeOfInvestment = "Purpose of investment is required";
    }

    if (step === 3) {
      if (investorType === "individual") {
        if (!files.proofOfIdentity) {
          setFormErrors({ ...errors, proofOfIdentity: "Proof of identity is required" } as typeof errors);
          return false;
        }
        if (!files.proofOfAddress) {
          setFormErrors({ ...errors, proofOfAddress: "Proof of address is required" } as typeof errors);
          return false;
        }
      } else if (investorType === "entity") {
        if (!files.certificateOfIncorporation) {
          setFormErrors({ ...errors, certificateOfIncorporation: "Certificate of incorporation is required" } as typeof errors);
          return false;
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    try {
      // Submission logic will be wired to the API route
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("KYC submitted", { investorType, formData, files });
    } catch (err) {
      console.error("KYC submission error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    investorType,
    setInvestorType,
    formData,
    handleInputChange,
    formErrors,
    isSubmitting,
    acceptedDeclarations,
    setAcceptedDeclarations,
    files,
    handleFileChange,
    beneficialOwners,
    setBeneficialOwners,
    beneficialOwnerIdFiles,
    setBeneficialOwnerIdFiles,
    authorizedSignatories,
    setAuthorizedSignatories,
    countryOptions,
    validateStep,
    handleSubmit,
  };
}
