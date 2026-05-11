import React from "react";
import {
  Box, Button, Checkbox, FormControl, FormLabel, FormErrorMessage,
  Select, Heading, Text, VStack, HStack, Divider, Stack,
} from "@chakra-ui/react";
import { KYCFormData } from "../hooks/useKYCForm";

interface Step4Props {
  formData: KYCFormData;
  handleInputChange: (field: keyof KYCFormData, value: string) => void;
  acceptedDeclarations: string[];
  setAcceptedDeclarations: React.Dispatch<React.SetStateAction<string[]>>;
  formErrors: Partial<Record<keyof KYCFormData, string>>;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

const DECLARATIONS = [
  {
    id: "accuracy",
    text: "I confirm that all information provided in this form is true, accurate, and complete to the best of my knowledge.",
  },
  {
    id: "aml",
    text: "I acknowledge that Hushh is required to comply with AML/KYC regulations and may request additional documentation.",
  },
  {
    id: "updates",
    text: "I agree to promptly notify Hushh of any material changes to the information provided.",
  },
  {
    id: "terms",
    text: "I have read and agree to the Terms of Service and Privacy Policy.",
  },
];

const Step4Declarations: React.FC<Step4Props> = ({
  formData, handleInputChange, acceptedDeclarations, setAcceptedDeclarations,
  formErrors, isSubmitting, onBack, onSubmit,
}) => {
  const toggleDeclaration = (id: string) => {
    setAcceptedDeclarations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const allAccepted = DECLARATIONS.every((d) => acceptedDeclarations.includes(d.id));

  return (
    <Box>
      <Heading size="md" mb={2}>Declarations & Compliance</Heading>
      <Text color="gray.500" mb={6}>
        Please complete the tax residency information and accept all declarations to submit.
      </Text>

      <VStack spacing={4} align="stretch" mb={6}>
        <FormControl isInvalid={!!formErrors.taxResidency}>
          <FormLabel>Country of Tax Residency</FormLabel>
          <Select placeholder="Select country" value={formData.taxResidency}
            onChange={(e) => handleInputChange("taxResidency", e.target.value)}>
            <option value="US">United States</option>
            <option value="IN">India</option>
            <option value="GB">United Kingdom</option>
            <option value="SG">Singapore</option>
            <option value="AE">United Arab Emirates</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage>{formErrors.taxResidency}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formErrors.fatcaStatus}>
          <FormLabel>FATCA / CRS Status</FormLabel>
          <Select placeholder="Select status" value={formData.fatcaStatus}
            onChange={(e) => handleInputChange("fatcaStatus", e.target.value)}>
            <option value="us_person">US Person (FATCA applicable)</option>
            <option value="non_us_reportable">Non-US Reportable Person (CRS applicable)</option>
            <option value="non_reportable">Non-Reportable Person</option>
            <option value="entity_financial">Financial Institution</option>
            <option value="entity_non_financial">Non-Financial Entity</option>
          </Select>
          <FormErrorMessage>{formErrors.fatcaStatus}</FormErrorMessage>
        </FormControl>
      </VStack>

      <Divider mb={6} />

      <Heading size="sm" mb={4}>Declarations</Heading>
      <Stack spacing={3} mb={8}>
        {DECLARATIONS.map((decl) => (
          <Checkbox
            key={decl.id}
            isChecked={acceptedDeclarations.includes(decl.id)}
            onChange={() => toggleDeclaration(decl.id)}
            colorScheme="blue"
            alignItems="flex-start"
          >
            <Text fontSize="sm" mt={0.5}>{decl.text}</Text>
          </Checkbox>
        ))}
      </Stack>

      {!allAccepted && (
        <Text fontSize="sm" color="red.500" mb={4}>
          Please accept all declarations before submitting.
        </Text>
      )}

      <HStack spacing={4} justify="flex-end">
        <Button variant="outline" onClick={onBack} isDisabled={isSubmitting}>
          ← Back
        </Button>
        <Button
          onClick={onSubmit}
          isDisabled={!allAccepted}
          isLoading={isSubmitting}
          loadingText="Submitting..."
          bgGradient="linear(to-r, #00A9E0, #6DD3EF)"
          color="white"
          _hover={{ bgGradient: "linear(to-r, #0090C0, #50C0E0)" }}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          Submit KYC Application
        </Button>
      </HStack>
    </Box>
  );
};

export default Step4Declarations;
