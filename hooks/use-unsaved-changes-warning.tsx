import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { ConfirmationModal } from '../components/shared/confirmation-modal';

export interface UseUnsavedChangesWarningOptions {
  /**
   * Whether the form has unsaved changes (typically from Formik's form.dirty)
   */
  isDirty: boolean;

  /**
   * Additional condition to determine if warning should be shown
   * For example: !form.isSubmitting to avoid warning during submission
   * @default true
   */
  shouldWarn?: boolean;

  /**
   * Disable the warning entirely
   * @default false
   */
  disabled?: boolean;
}

/**
 * Custom hook to warn users about unsaved changes when navigating away from a page
 *
 * @example
 * ```typescript
 * const form = useFormik({ ... });
 *
 * useUnsavedChangesWarning({
 *   isDirty: form.dirty,
 *   shouldWarn: !form.isSubmitting
 * });
 * ```
 */
export function useUnsavedChangesWarning(options: UseUnsavedChangesWarningOptions) {
  const { isDirty, shouldWarn = true, disabled = false } = options;

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [nextUrl, setNextUrl] = useState<string>('');
  const [isLeaving, setIsLeaving] = useState(false);

  // Ref to prevent multiple rapid navigation attempts
  const isHandlingNavigationRef = useRef(false);

  // Determine if we should actually warn
  const shouldShowWarning = isDirty && shouldWarn && !disabled && !isLeaving;

  // Handle "Leave Anyway" confirmation
  const handleConfirmLeave = useCallback(() => {
    setShowModal(false);
    setIsLeaving(true);

    // Navigate to the stored URL after a brief delay
    setTimeout(() => {
      router.push(nextUrl);
      // Reset isLeaving after navigation completes
      setTimeout(() => setIsLeaving(false), 100);
    }, 0);
  }, [nextUrl, router]);

  // Handle "Stay on Page"
  const handleStayOnPage = useCallback(() => {
    setShowModal(false);
    setNextUrl('');
    isHandlingNavigationRef.current = false;
  }, []);

  // Handle Next.js router navigation
  useEffect(() => {
    if (!shouldShowWarning) {
      return;
    }

    const handleRouteChange = (url: string) => {
      // Prevent rapid navigation attempts
      if (isHandlingNavigationRef.current) {
        throw 'Navigation already being handled';
      }

      // Don't warn if navigating to the same page
      if (router.asPath === url) {
        return;
      }

      // Show confirmation modal and block navigation
      isHandlingNavigationRef.current = true;
      setNextUrl(url);
      setShowModal(true);

      // Throw error to cancel the navigation
      // Next.js router expects this to cancel the route change
      throw 'Navigation cancelled due to unsaved changes';
    };

    // Attach the event listener
    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      isHandlingNavigationRef.current = false;
    };
  }, [shouldShowWarning, router]);

  // Handle browser beforeunload (tab close, refresh, external navigation)
  useEffect(() => {
    if (!shouldShowWarning) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Prevent default behavior and show browser warning
      e.preventDefault();

      // Modern browsers ignore custom messages and show a generic warning
      // Setting returnValue is required for some browsers
      e.returnValue = '';

      return '';
    };

    // Attach the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldShowWarning]);

  // Reset isLeaving when isDirty becomes false (e.g., after successful save)
  useEffect(() => {
    if (!isDirty) {
      setIsLeaving(false);
    }
  }, [isDirty]);

  // Return the modal component (rendered by the hook)
  return (
    <ConfirmationModal
      isOpen={showModal}
      onClose={handleStayOnPage}
      onConfirm={handleConfirmLeave}
      title="Unsaved Changes"
      message="You have unsaved changes that will be lost if you leave this page. Are you sure you want to continue?"
      confirmText="Leave Anyway"
      cancelText="Stay on Page"
      confirmButtonColor="danger"
      icon="warning"
    />
  );
}
