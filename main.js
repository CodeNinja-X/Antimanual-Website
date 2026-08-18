// Antimanual Website Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  console.log('Antimanual product promotion website loaded.');

  const downloadBtns = document.querySelectorAll('#download-btn, .nav-cta-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      console.log('Download Antimanual button clicked.');
    });
  });
});
