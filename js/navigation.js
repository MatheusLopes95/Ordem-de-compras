document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.dataset.page;
  document.querySelectorAll(".nav-link").forEach(link => {
    const page = link.dataset.page;
    if (page === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  addManualLogoutButton();
});

function addManualLogoutButton() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  if (nav.dataset.hasLogout === "true") return;

  const existingLogout = nav.querySelector('.manual-logout-btn');
  if (existingLogout) {
    existingLogout.remove();
  }

  const logoutBtn = document.createElement('a');
  logoutBtn.href = '#';
  logoutBtn.className = 'nav-link manual-logout-btn';
  logoutBtn.innerHTML = 'Sair do sistema';
  logoutBtn.style.marginTop = 'auto';
  logoutBtn.style.borderTop = '1px solid #374151';
  logoutBtn.style.paddingTop = '12px';
  logoutBtn.style.color = '#ef4444';

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Deseja realmente sair do sistema?')) {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('purchaseSystem_clients');
      sessionStorage.removeItem('purchaseSystem_products');
      sessionStorage.removeItem('purchaseSystem_orders');
      window.location.href = 'index.html';
    }
  });

  nav.appendChild(logoutBtn);

  nav.dataset.hasLogout = "true";
}