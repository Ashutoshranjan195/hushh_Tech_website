import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
} from "@chakra-ui/react";

interface Step1Props {
  investorType: "individual" | "entity" | "";
  setInvestorType: (type: "individual" | "entity") => void;
  onNext: () => void;
}

const Step1InvestorType: React.FC<Step1Props> = ({
  investorType,
  setInvestorType,
  onNext,
}) => {
  return (
    <Box>
      <Heading size="md" mb={2}>
        Select Investor Type
      </Heading>
      <Text color="gray.500" mb={6}>
        Choose the category that best describes you or your organization.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
        {/* Individual */}
        <Box
          as="button"
          onClick={() => setInvestorType("individual")}
          border="2px solid"
          borderColor={investorType === "individual" ? "blue.400" : "gray.200"}
          borderRadius="lg"
          p={6}
          textAlign="left"
          bg={investorType === "individual" ? "blue.50" : "white"}
          _hover={{ borderColor: "blue.300", bg: "blue.50" }}
          transition="all 0.2s"
          w="100%"
        >
          <VStack align="start" spacing={2}>
            <Text fontSize="2xl">👤</Text>
            <Text fontWeight="700" fontSize="lg">
              Individual
            </Text>
            <Text color="gray.500" fontSize="sm">
              A natural person investing in their own capacity.
            </Text>
          </VStack>
        </Box>

        {/* Entity */}
        <Box
          as="button"
          onClick={() => setInvestorType("entity")}
          border="2px solid"
          borderColor={investorType === "entity" ? "blue.400" : "gray.200"}
          borderRadius="lg"
          p={6}
          textAlign="left"
          bg={investorType === "entity" ? "blue.50" : "white"}
          _hover={{ borderColor: "blue.300", bg: "blue.50" }}
          transition="all 0.2s"
          w="100%"
        >
          <VStack align="start" spacing={2}>
            <Text fontSize="2xl">🏢</Text>
            <Text fontWeight="700" fontSize="lg">
              Entity / Corporate
            </Text>
            <Text color="gray.500" fontSize="sm">
              A company, trust, fund, or other legal entity.
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>

      <Button
        onClick={onNext}
        isDisabled={!investorType}
        bgGradient="linear(to-r, #00A9E0, #6DD3EF)"
        color="white"
        _hover={{ bgGradient: "linear(to-r, #0090C0, #50C0E0)" }}
        size="lg"
        w={{ base: "100%", md: "auto" }}
      >
        Continue →
      </Button>
    </Box>
  );
};

export default Step1InvestorType;
