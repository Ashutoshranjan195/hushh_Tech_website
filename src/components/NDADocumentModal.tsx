import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Spinner,
  useToast,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import { acceptNda, generateNdaPdfBlob } from "../services/access/accessControlApi";
import type { Session } from "@supabase/supabase-js";

export interface NDAMetadata {
  investor_type?: string;
  metadata?: string;
  [key: string]: unknown;
}

interface NDADocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ndaMetadata: NDAMetadata | null;
  session: Session;
  onAccept: () => void;
}

const NDADocumentModal: React.FC<NDADocumentModalProps> = ({
  isOpen,
  onClose,
  ndaMetadata,
  session,
  onAccept,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Generate NDA PDF and create a blob URL.
  const generateNdaPDF = useCallback(async () => {
    if (loading || !session?.access_token || !ndaMetadata) return;
    
    setLoading(true);
    
    const loadingToastId = toast({
      title: "Generating NDA Document",
      description: "Please wait while we prepare your NDA document...",
      status: "loading",
      duration: null, // No auto-dismiss
      isClosable: false,
    });
    
    try {
      const responseBlob = await generateNdaPdfBlob(
        session.access_token,
        ndaMetadata!
      );
      
      // Close the loading toast
      toast.close(loadingToastId);
      
      // Create a Blob URL directly from the response blob
      if (isOpen) {
        const url = URL.createObjectURL(responseBlob);
        setPdfUrl(url);
      }
      
      toast({
        title: "Document Ready",
        description: "Your NDA document has been generated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      console.error("Error generating NDA PDF:", error);
      
      // Close the loading toast
      toast.close(loadingToastId);
      
      // More detailed error handling
      let errorMessage = "Failed to generate NDA PDF.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: unknown } };
        // Server responded with an error
        if (axiosError.response.data instanceof Blob) {
          // Try to read the error message from the Blob
          try {
            const text = await axiosError.response.data.text();
            const errorData = JSON.parse(text) as { message?: string };
            errorMessage = errorData.message || errorMessage;
          } catch (e: unknown) {
            console.error("Error parsing error blob:", e);
          }
        } else if (axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          errorMessage = (axiosError.response.data as { message: string }).message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    setLoading(false);
  }, [isOpen, ndaMetadata, session?.access_token, toast, loading]);

  useEffect(() => {
    // Only generate PDF when modal is open and we have metadata and haven't started/finished yet
    if (isOpen && ndaMetadata && !pdfUrl && !loading) {
      generateNdaPDF();
    }
    
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
  }, [isOpen, ndaMetadata, pdfUrl, loading, generateNdaPDF]);

  const downloadPDF = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "NDA.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleAcceptNda = async () => {
    if (!confirmed) {
      toast({
        title: "Confirm NDA Acceptance",
        description: "Please check the box to confirm your NDA acceptance.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (isSubmitting) return; // Prevent multiple clicks
    setIsSubmitting(true);
    try {
      const resData = await acceptNda(session.access_token);
      if (resData === "Approved" || resData === "Already Approved") {
        toast({
          title: "NDA Accepted",
          description: "Your NDA has been accepted. Access granted.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        onAccept(); // Callback from parent
        onClose();
      }
    } catch (error: unknown) {
      console.error("Error accepting NDA:", error);
      let errorMessage = "Could not accept NDA.";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: unknown } };
        if (typeof axiosError.response.data === 'string') {
          errorMessage = axiosError.response.data;
        } else if (axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          errorMessage = (axiosError.response.data as { message: string }).message;
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a manual retry button in case the API call fails
  const handleRetryGeneratePDF = () => {
    setPdfUrl(null); // Clear any existing URL
    generateNdaPDF(); // Try again
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>NDA Document</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" maxH="70vh">
          {loading ? (
            <Box textAlign="center" py={8}>
              <Spinner size="xl" />
              <Text mt={4}>Generating NDA document, please wait...</Text>
            </Box>
          ) : pdfUrl ? (
            <Box width="100%" height="500px" overflow="hidden">
              <iframe
                src={pdfUrl}
                title="NDA Document"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            </Box>
          ) : (
            <Box textAlign="center" py={8}>
              <Text mb={4}>No document available.</Text>
              <Button onClick={handleRetryGeneratePDF} colorScheme="blue">
                Retry PDF Generation
              </Button>
            </Box>
          )}
          <Box mt={4}>
            <Checkbox
              isChecked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              aria-label="Confirm NDA Acceptance"
            >
              I confirm that I have read and accept the terms of the NDA.
            </Checkbox>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={downloadPDF} colorScheme="blue" mr={4} isDisabled={!pdfUrl}>
            Download PDF
          </Button>
          <Button isLoading={isSubmitting} onClick={handleAcceptNda} colorScheme="blue" isDisabled={!pdfUrl || !confirmed}>
            Accept NDA
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NDADocumentModal;
