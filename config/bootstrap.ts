export async function bootstrapInit() {
  // Only import bootstrap on the client side
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      await import('bootstrap');
    } catch (error) {
      console.warn('Bootstrap could not be loaded:', error);
    }
  }
}
