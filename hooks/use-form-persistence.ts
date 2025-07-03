import { useEffect, useCallback } from 'react';
import { useStatefulStorage, StorageType } from './use-stateful-storage';

interface FormPersistenceConfig {
  storageKey: string;
  autoSaveInterval?: number; // in milliseconds
  storageType?: 'localStorage' | 'sessionStorage';
}

interface SavedFormData {
  formData: any;
  currentStep: number;
  timestamp: number;
  version: string; // to handle schema changes
}

export function useFormPersistence(
  formData: any,
  currentStep: number,
  config: FormPersistenceConfig
) {
  const { storageKey, autoSaveInterval = 30000, storageType = 'localStorage' } = config;

  // Convert storageType to the format expected by useStatefulStorage
  const storageTypeConverted: StorageType = storageType === 'localStorage' ? 'local' : 'session';

  const storage = useStatefulStorage<SavedFormData>({
    key: storageKey,
    type: storageTypeConverted,
  });

  // Save current form state to browser storage
  const saveToStorage = useCallback(() => {
    if (!formData || currentStep <= 0) return;

    const dataToSave: SavedFormData = {
      formData,
      currentStep,
      timestamp: Date.now(),
      version: '1.0', // increment when form schema changes
    };

    storage.setItem(dataToSave);
  }, [formData, currentStep, storage]);

  // Restore form data from browser storage
  const restoreFromStorage = useCallback(() => {
    const storedData = storage.getItem();
    if (!storedData) return null;

    // Check if data is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (Date.now() - storedData.timestamp > maxAge) {
      clearStorage();
      return null;
    }

    // Check version compatibility
    if (storedData.version !== '1.0') {
      clearStorage();
      return null;
    }

    return {
      formData: storedData.formData,
      currentStep: storedData.currentStep,
      timestamp: storedData.timestamp,
    };
  }, [storage]);

  // Clear stored data
  const clearStorage = useCallback(() => {
    storage.removeItem();
  }, [storage]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveInterval || currentStep <= 0) return;

    const interval = setInterval(saveToStorage, autoSaveInterval);
    return () => clearInterval(interval);
  }, [saveToStorage, autoSaveInterval, currentStep]);

  // Manual save on step change
  useEffect(() => {
    if (currentStep > 0) {
      saveToStorage();
    }
  }, [currentStep, saveToStorage]);

  const storedData = storage.getItem();

  return {
    saveToStorage,
    restoreFromStorage,
    clearStorage,
    hasStoredData: !!storedData,
    storedTimestamp: storedData?.timestamp,
  };
}
