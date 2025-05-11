export async function navigateWithTransition(callback) {
  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      await callback();
    });
  } else {
    await callback();
  }
}
