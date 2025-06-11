export async function bootstrapInit() {
  // Import bootstrap directly instead of using useEffectAsync
  try {
    await import('bootstrap');
  } catch (error) {
    console.warn('Bootstrap could not be loaded:', error);
  }
}
