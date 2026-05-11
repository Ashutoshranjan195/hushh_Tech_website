import React from "react";
import {
  Box, Button, FormControl, FormLabel, FormErrorMessage,
  Input, Heading, Text, VStack, HStack, Divider, SimpleGrid, Select,
} from "@chakra-ui/react";
import { KYCFiles, BeneficialOwner, AuthorizedSignatory } from "../hooks/useKYCForm";

interface Step3Props {
  investorType: "individual" | "entity" | "";
  files: KYCFiles;
  handleFileChange: (field: keyof KYCFiles, file: File | null) => void;
  beneficialOwners: BeneficialOwner[];
  setBeneficialOwners: React.Dispatch<React.SetStateAction<BeneficialOwner[]>>;
  beneficialOwnerIdFiles: Record<number, File | null>;
  setBeneficialOwnerIdFiles: React.Dispatch<React.SetStateAction<Record<number, File | null>>>;
  authorizedSignatories: AuthorizedSignatory[];
  setAuthorizedSignatories: React.Dispatch<React.SetStateAction<AuthorizedSignatory[]>>;
  countryOptions: { value: string; label: string }[];
  formErrors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

const FileUploadField: React.FC<{
  label: string; hint?: string; value: File | null;
  onChange: (file: File | null) => void; error?: string;
}> = ({ label, hint, value, onChange, error }) => (
  <FormControl isInvalid={!!error}>
    <FormLabel fontWeight="600">{label}</FormLabel>
    {hint && <Text fontSize="xs" color="gray.500" mb={1}>{hint}</Text>}
    <Input type="file" accept=".pdf,.jpg,.jpeg,.png"
      onChange={(e) => onChange(e.target.files?.[0] ?? null)} p={1} />
    {value && <Text fontSize="xs" color="green.500" mt={1}>✓ {value.name}</Text>}
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);

const Step3Documents: React.FC<Step3Props> = ({
  investorType, files, handleFileChange, beneficialOwners, setBeneficialOwners,
  beneficialOwnerIdFiles, setBeneficialOwnerIdFiles, authorizedSignatories,
  setAuthorizedSignatories, countryOptions, formErrors, onNext, onBack,
}) => {
  const addOwner = () => setBeneficialOwners((p) => [
    ...p, { name: "", dateOfBirth: "", nationality: "", ownershipPercentage: "", residentialAddress: "" }
  ]);
  const updateOwner = (i: number, field: keyof BeneficialOwner, val: string) =>
    setBeneficialOwners((p) => p.map((o, idx) => idx === i ? { ...o, [field]: val } : o));
  const removeOwner = (i: number) => {
    setBeneficialOwners((p) => p.filter((_, idx) => idx !== i));
    setBeneficialOwnerIdFiles((p) => { const n = { ...p }; delete n[i]; return n; });
  };

  const addSignatory = () => setAuthorizedSignatories((p) => [...p, { name: "", title: "", email: "" }]);
  const updateSignatory = (i: number, field: keyof AuthorizedSignatory, val: string) =>
    setAuthorizedSignatories((p) => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const removeSignatory = (i: number) =>
    setAuthorizedSignatories((p) => p.filter((_, idx) => idx !== i));

  return (
    <Box>
      <Heading size="md" mb={2}>Document Upload</Heading>
      <Text color="gray.500" mb={6}>Upload clear copies (PDF, JPG, PNG).</Text>
      <VStack spacing={5} align="stretch">
        {investorType === "individual" && (
          <>
            <FileUploadField label="Proof of Identity *" hint="Passport, national ID, or driver's license"
              value={files.proofOfIdentity} onChange={(f) => handleFileChange("proofOfIdentity", f)}
              error={formErrors.proofOfIdentity} />
            <FileUploadField label="Proof of Address *" hint="Bank statement or utility bill (≤3 months)"
              value={files.proofOfAddress} onChange={(f) => handleFileChange("proofOfAddress", f)}
              error={formErrors.proofOfAddress} />
            <FileUploadField label="Bank Statement (Optional)" hint="Last 3 months"
              value={files.bankStatement} onChange={(f) => handleFileChange("bankStatement", f)} />
          </>
        )}
        {investorType === "entity" && (
          <>
            <FileUploadField label="Certificate of Incorporation *" hint="Official government-issued certificate"
              value={files.certificateOfIncorporation} onChange={(f) => handleFileChange("certificateOfIncorporation", f)}
              error={formErrors.certificateOfIncorporation} />
            <FileUploadField label="Memorandum & Articles of Association"
              value={files.memorandumOfAssociation} onChange={(f) => handleFileChange("memorandumOfAssociation", f)} />
            <FileUploadField label="Board Resolution" hint="Authorizing the investment and signatories"
              value={files.boardResolution} onChange={(f) => handleFileChange("boardResolution", f)} />
            <Divider />
            <Box>
              <HStack justify="space-between" mb={3}>
                <Heading size="sm">Beneficial Owners (≥25%)</Heading>
                <Button size="sm" onClick={addOwner} variant="outline" colorScheme="blue">+ Add</Button>
              </HStack>
              {beneficialOwners.map((owner, i) => (
                <Box key={i} border="1px solid" borderColor="gray.200" borderRadius="md" p={4} mb={3}>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="600">Owner {i + 1}</Text>
                    <Button size="xs" colorScheme="red" variant="ghost" onClick={() => removeOwner(i)}>Remove</Button>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    <FormControl><FormLabel fontSize="sm">Full Name</FormLabel>
                      <Input size="sm" value={owner.name} onChange={(e) => updateOwner(i, "name", e.target.value)} /></FormControl>
                    <FormControl><FormLabel fontSize="sm">Date of Birth</FormLabel>
                      <Input size="sm" type="date" value={owner.dateOfBirth} onChange={(e) => updateOwner(i, "dateOfBirth", e.target.value)} /></FormControl>
                    <FormControl><FormLabel fontSize="sm">Nationality</FormLabel>
                      <Select size="sm" placeholder="Select" value={owner.nationality} onChange={(e) => updateOwner(i, "nationality", e.target.value)}>
                        {countryOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </Select></FormControl>
                    <FormControl><FormLabel fontSize="sm">Ownership %</FormLabel>
                      <Input size="sm" type="number" min={25} max={100} value={owner.ownershipPercentage}
                        onChange={(e) => updateOwner(i, "ownershipPercentage", e.target.value)} /></FormControl>
                    <FormControl gridColumn={{ md: "span 2" }}><FormLabel fontSize="sm">Residential Address</FormLabel>
                      <Input size="sm" value={owner.residentialAddress} onChange={(e) => updateOwner(i, "residentialAddress", e.target.value)} /></FormControl>
                    <FormControl gridColumn={{ md: "span 2" }}><FormLabel fontSize="sm">Proof of Identity</FormLabel>
                      <Input size="sm" type="file" accept=".pdf,.jpg,.jpeg,.png" p={1}
                        onChange={(e) => setBeneficialOwnerIdFiles((p) => ({ ...p, [i]: e.target.files?.[0] ?? null }))} />
                    </FormControl>
                  </SimpleGrid>
                </Box>
              ))}
            </Box>
            <Divider />
            <Box>
              <HStack justify="space-between" mb={3}>
                <Heading size="sm">Authorized Signatories</Heading>
                <Button size="sm" onClick={addSignatory} variant="outline" colorScheme="blue">+ Add</Button>
              </HStack>
              {authorizedSignatories.map((sig, i) => (
                <Box key={i} border="1px solid" borderColor="gray.200" borderRadius="md" p={4} mb={3}>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="600">Signatory {i + 1}</Text>
                    <Button size="xs" colorScheme="red" variant="ghost" onClick={() => removeSignatory(i)}>Remove</Button>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                    <FormControl><FormLabel fontSize="sm">Full Name</FormLabel>
                      <Input size="sm" value={sig.name} onChange={(e) => updateSignatory(i, "name", e.target.value)} /></FormControl>
                    <FormControl><FormLabel fontSize="sm">Title / Role</FormLabel>
                      <Input size="sm" value={sig.title} onChange={(e) => updateSignatory(i, "title", e.target.value)} /></FormControl>
                    <FormControl><FormLabel fontSize="sm">Email</FormLabel>
                      <Input size="sm" type="email" value={sig.email} onChange={(e) => updateSignatory(i, "email", e.target.value)} /></FormControl>
                  </SimpleGrid>
                </Box>
              ))}
            </Box>
          </>
        )}
      </VStack>
      <HStack spacing={4} justify="flex-end" mt={8}>
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} bgGradient="linear(to-r, #00A9E0, #6DD3EF)" color="white"
          _hover={{ bgGradient: "linear(to-r, #0090C0, #50C0E0)" }}>Continue →</Button>
      </HStack>
    </Box>
  );
};

export default Step3Documents;
