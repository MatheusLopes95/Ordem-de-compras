function setLoginStatus(loggedIn) {
  if (loggedIn) {
    sessionStorage.setItem('isLoggedIn', 'true');
  } else {
    sessionStorage.removeItem('isLoggedIn');
  }
}

function checkLoginStatus() {
  return sessionStorage.getItem('isLoggedIn') === 'true';
}

function redirectToClients() {
  window.location.href = 'clients.html';
}

function setupLoginForm() {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    

    setLoginStatus(true);
    redirectToClients();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (checkLoginStatus()) {
    redirectToClients();
    return;
  }
  
  setupLoginForm();
  
  document.querySelector('.btn-login').focus();
});