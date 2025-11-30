function checkAuth() {
  return true;
}

function logout() {
  sessionStorage.removeItem('purchaseSystem_clients');
  sessionStorage.removeItem('purchaseSystem_products');
  sessionStorage.removeItem('purchaseSystem_orders');
  
  window.location.href = 'index.html';
}

function addLogoutButton() {
  const nav = document.querySelector('.nav');
  
  if (!nav) return;

  const existingLogout = nav.querySelector('.logout-btn');
  if (existingLogout) return;
  
  const logoutBtn = document.createElement('a');
  logoutBtn.href = '#';
  logoutBtn.className = 'nav-link logout-btn';
  logoutBtn.innerHTML = 'Sair do sistema';
  
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Deseja realmente sair do sistema?')) {
      logout();
    }
  });
  
  nav.appendChild(logoutBtn);
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    addLogoutButton();
  }, 100);
});