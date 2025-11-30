function renderClients() {
  const container = document.getElementById("clientsList");
  const clients = loadFromStorage(LS_CLIENTS_KEY);

  if (!clients.length) {
    container.classList.add("muted");
    container.innerHTML = "Nenhum cliente cadastrado ainda.";
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const client of clients) {
    html += `
      <tr>
        <td>${client.name}</td>
        <td>${client.cpf}</td>
        <td>${client.email || "-"}</td>
        <td>${client.phone || "-"}</td>
        <td>
          <button class="btn btn-danger btn-sm" data-id="${client.id}" data-action="delete-client">
            Excluir
          </button>
        </td>
      </tr>
    `;
  }

  html += "</tbody></table>";
  container.classList.remove("muted");
  container.innerHTML = html;

  container.querySelectorAll("button[data-action='delete-client']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteClient(id);
    });
  });
}

function deleteClient(id) {
  let clients = loadFromStorage(LS_CLIENTS_KEY);
  let orders = loadFromStorage(LS_ORDERS_KEY);

  clients = clients.filter(c => String(c.id) !== String(id));
  orders = orders.filter(o => String(o.clientId) !== String(id));

  saveToStorage(LS_CLIENTS_KEY, clients);
  saveToStorage(LS_ORDERS_KEY, orders);

  renderClients();
}

function setupClientForm() {
  const form = document.getElementById("clientForm");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("clientName").value.trim();
    const cpf = document.getElementById("clientCpf").value.trim();
    const email = document.getElementById("clientEmail").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();

    if (!name) {
      alert("Informe o nome do cliente.");
      return;
    }

    if (!cpf) {
      alert("Informe o CPF do cliente.");
      return;
    }

    const clients = loadFromStorage(LS_CLIENTS_KEY);

    const newClient = {
      id: Date.now(),
      name,
      cpf,
      email: email || null,
      phone: phone || null,
    };

    clients.push(newClient);
    saveToStorage(LS_CLIENTS_KEY, clients);

    form.reset();
    renderClients();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("clientPhone")
  const cpfInput = document.getElementById("clientCpf")

  if (phoneInput) {
    phoneInput.addEventListener("input", e => {
      e.target.value = maskPhone(e.target.value)
    })
  }
  if (cpfInput) {
    cpfInput.addEventListener("input", e => {
      e.target.value = maskCpf(e.target.value)
    })
  }
  setupClientForm();
  renderClients();
});
