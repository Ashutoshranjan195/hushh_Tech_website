import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  SimpleGrid,
  Heading,
  Text,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import { KYCFormData } from "../hooks/useKYCForm";

interface Step2Props {
  investorType: "individual" | "entity" | "";
  formData: KYCFormData;
  formErrors: Partial<Record<keyof KYCFormData, string>>;
  handleInputChange: (field: keyof KYCFormData, value: string) => void;
  countryOptions: { value: string; label: string }[];
  onNext: () => void;
  onBack: () => void;
}

const Step2InvestorDetails: React.FC<Step2Props> = ({
  investorType,
  formData,
  formErrors,
  handleInputChange,
  countryOptions,
  onNext,
  onBack,
}) => {
  return (
    <Box>
      <Heading size="md" mb={2}>
        {investorType === "individual" ? "Personal Details" : "Entity Details"}
      </Heading>
      <Text color="gray.500" mb={6}>
        {investorType === "individual"
          ? "Please provide your personal information as it appears on your official documents."
          : "Please provide the legal details of your organization."}
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
        {investorType === "individual" && (
          <>
            <FormControl isInvalid={!!formErrors.fullName}>
              <FormLabel>Full Legal Name</FormLabel>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="As on passport / ID"
              />
              <FormErrorMessage>{formErrors.fullName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.dateOfBirth}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              />
              <FormErrorMessage>{formErrors.dateOfBirth}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.nationality}>
              <FormLabel>Nationality</FormLabel>
              <Select
                placeholder="Select country"
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
              >
                {countryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formErrors.nationality}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.taxIdentificationNumber}>
              <FormLabel>Tax Identification Number (TIN)</FormLabel>
              <Input
                value={formData.taxIdentificationNumber}
                onChange={(e) =>
                  handleInputChange("taxIdentificationNumber", e.target.value)
                }
                placeholder="Optional"
              />
              <FormErrorMessage>{formErrors.taxIdentificationNumber}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.residentialAddress} gridColumn={{ md: "span 2" }}>
              <FormLabel>Residential Address</FormLabel>
              <Textarea
                value={formData.residentialAddress}
                onChange={(e) =>
                  handleInputChange("residentialAddress", e.target.value)
                }
                placeholder="Full residential address"
                rows={2}
              />
              <FormErrorMessage>{formErrors.residentialAddress}</FormErrorMessage>
            </FormControl>
          </>
        )}

        {investorType === "entity" && (
          <>
            <FormControl isInvalid={!!formErrors.entityName}>
              <FormLabel>Legal Entity Name</FormLabel>
              <Input
                value={formData.entityName}
                onChange={(e) => handleInputChange("entityName", e.target.value)}
                placeholder="Full registered name"
              />
              <FormErrorMessage>{formErrors.entityName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.entityType}>
              <FormLabel>Entity Type</FormLabel>
              <Select
                placeholder="Select type"
                value={formData.entityType}
                onChange={(e) => handleInputChange("entityType", e.target.value)}
              >
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
                <option value="partnership">Partnership</option>
                <option value="trust">Trust</option>
                <option value="fund">Fund</option>
                <option value="other">Other</option>
              </Select>
              <FormErrorMessage>{formErrors.entityType}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.registrationNumber}>
              <FormLabel>Registration / CIN Number</FormLabel>
              <Input
                value={formData.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                placeholder="Company registration number"
              />
              <FormErrorMessage>{formErrors.registrationNumber}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.incorporationCountry}>
              <FormLabel>Country of Incorporation</FormLabel>
              <Select
                placeholder="Select country"
                value={formData.incorporationCountry}
                onChange={(e) =>
                  handleInputChange("incorporationCountry", e.target.value)
                }
              >
                {countryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formErrors.incorporationCountry}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.registeredAddress} gridColumn={{ md: "span 2" }}>
              <FormLabel>Registered Address</FormLabel>
              <Textarea
                value={formData.registeredAddress}
                onChange={(e) =>
                  handleInputChange("registeredAddress", e.target.value)
                }
                placeholder="Full registered address"
                rows={2}
              />
              <FormErrorMessage>{formErrors.registeredAddress}</FormErrorMessage>
            </FormControl>
          </>
        )}

        {/* Common fields */}
        <FormControl isInvalid={!!formErrors.sourceOfFunds}>
          <FormLabel>Source of Funds</FormLabel>
          <Select
            placeholder="Select source"
            value={formData.sourceOfFunds}
            onChange={(e) => handleInputChange("sourceOfFunds", e.target.value)}
          >
            <option value="salary">Salary / Employment</option>
            <option value="business">Business Income</option>
            <option value="investments">Investments</option>
            <option value="inheritance">Inheritance</option>
            <option value="savings">Savings</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage>{formErrors.sourceOfFunds}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formErrors.purposeOfInvestment}>
          <FormLabel>Purpose of Investment</FormLabel>
          <Select
            placeholder="Select purpose"
            value={formData.purposeOfInvestment}
            onChange={(e) => handleInputChange("purposeOfInvestment", e.target.value)}
          >
            <option value="wealth_growth">Wealth Growth</option>
            <option value="retirement">Retirement Planning</option>
            <option value="income">Income Generation</option>
            <option value="diversification">Portfolio Diversification</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage>{formErrors.purposeOfInvestment}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formErrors.pepDeclaration} gridColumn={{ md: "span 2" }}>
          <FormLabel>
            Are you a Politically Exposed Person (PEP) or related to one?
          </FormLabel>
          <Select
            placeholder="Select"
            value={formData.pepDeclaration}
            onChange={(e) => handleInputChange("pepDeclaration", e.target.value)}
          >
            <option value="no">No</option>
            <option value="yes">Yes — I am a PEP</option>
            <option value="related">Yes — I am related to a PEP</option>
          </Select>
          <FormErrorMessage>{formErrors.pepDeclaration}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <HStack spacing={4} justify="flex-end">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={onNext}
          bgGradient="linear(to-r, #00A9E0, #6DD3EF)"
          color="white"
          _hover={{ bgGradient: "linear(to-r, #0090C0, #50C0E0)" }}
        >
          Continue →
        </Button>
      </HStack>
    </Box>
  );
};

export default Step2InvestorDetails;
