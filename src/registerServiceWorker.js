export default function register() {
  // Check that service workers are registered
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
}
