import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LegalDocumentsContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedDocuments: string[];
  setCompletedDocuments: (completed: string[]) => void;
}

const LegalDocumentsContext = createContext<LegalDocumentsContextType | undefined>(undefined);

interface LegalDocumentProviderProps {
  children: ReactNode;
}

export function LegalDocumentProvider({ children }: LegalDocumentProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedDocuments, setCompletedDocuments] = useState<string[]>([]);

  const value: LegalDocumentsContextType = {
    currentStep,
    setCurrentStep,
    completedDocuments,
    setCompletedDocuments,
  };

  return <LegalDocumentsContext.Provider value={value}>{children}</LegalDocumentsContext.Provider>;
}

export function useLegalDocuments() {
  const context = useContext(LegalDocumentsContext);
  if (context === undefined) {
    throw new Error('useLegalDocuments must be used within a LegalDocumentProvider');
  }
  return context;
}
