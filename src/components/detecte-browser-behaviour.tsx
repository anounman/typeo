import { useEffect } from 'react';

type Options = {
  // Only show the warning if this condition is true (e.g., game in progress)
  enabled?: boolean;
  // The message to show in the confirmation dialog
  message?: string;
  // Optional callback to run when the user attempts to leave
  onBeforeLeave?: () => void;
};

/**
 * Hook to detect and handle page leave/refresh attempts
 */
export const usePageLeaveDetection = ({
  enabled = true,
  message = "You have unsaved changes. Are you sure you want to leave?",
  onBeforeLeave
}: Options = {}) => {
  useEffect(() => {
    // Skip if not enabled
    if (!enabled) return;
    
    // Handle beforeunload event (refresh, close tab, etc.)
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (onBeforeLeave) {
        onBeforeLeave();
      }
      
      // Standard way to show a confirmation dialog
      event.preventDefault();
      
      // Set the return value (though most modern browsers show a generic message)
      event.returnValue = message;
      return message;
    };

    // Listen for page refresh/close events
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, message, onBeforeLeave]);
};