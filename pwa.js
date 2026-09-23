if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .catch(error => console.warn('No se pudo activar el modo sin conexión:', error));
  });
}
