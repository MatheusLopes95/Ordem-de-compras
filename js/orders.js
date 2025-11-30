function getClientNameById(id) {
  const clients = loadFromStorage(LS_CLIENTS_KEY);
  const client = clients.find(c => String(c.id) === String(id));
  return client ? client.name : "Cliente não encontrado";
}

function getProductById(id) {
  const products = loadFromStorage(LS_PRODUCTS_KEY);
  return products.find(p => String(p.id) === String(id)) || null;
}

function populateOrderClientSelect() {
  const select = document.getElementById("orderClientSelect");
  const clients = loadFromStorage(LS_CLIENTS_KEY);

  select.innerHTML = "";

  if (!clients.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Nenhum cliente cadastrado";
    select.appendChild(opt);
    select.disabled = true;
    return;
  }

  select.disabled = false;
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione um cliente";
  select.appendChild(placeholder);

  clients.forEach(client => {
    const opt = document.createElement("option");
    opt.value = client.id;
    opt.textContent = client.name;
    select.appendChild(opt);
  });
}

function createOrderItemRow() {
  const container = document.getElementById("orderItemsContainer");
  const emptyText = document.getElementById("orderItemsEmptyText");
  emptyText.style.display = "none";

  const products = loadFromStorage(LS_PRODUCTS_KEY);

  const row = document.createElement("div");
  row.className = "item-row";

  const productSelect = document.createElement("select");
  productSelect.className = "item-product-select";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione";
  productSelect.appendChild(placeholder);

  products.forEach(product => {
    const opt = document.createElement("option");
    opt.value = product.id;
    opt.textContent = `${product.name} (${formatCurrency(product.basePrice)})`;
    productSelect.appendChild(opt);
  });

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.min = "1";
  qtyInput.step = "1";
  qtyInput.value = "1";

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.min = "0";
  priceInput.step = "0.01";
  priceInput.value = "0";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn-remove";
  removeBtn.title = "Remover item";
  removeBtn.textContent = "×";

  productSelect.addEventListener("change", () => {
    const product = getProductById(productSelect.value);
    if (product) {
      priceInput.value = product.basePrice;
    }
  });

  removeBtn.addEventListener("click", () => {
    row.remove();
    const rowsLeft = container.querySelectorAll(".item-row").length;
    if (!rowsLeft) {
      emptyText.style.display = "block";
    }
  });

  row.appendChild(productSelect);
  row.appendChild(qtyInput);
  row.appendChild(priceInput);
  row.appendChild(removeBtn);

  container.appendChild(row);
}

function renderOrders() {
  const ordersList = document.getElementById("ordersList");
  const statusFilter = document.getElementById("orderStatusFilter").value;
  const orders = loadFromStorage(LS_ORDERS_KEY);

  if (!orders.length) {
    ordersList.classList.add("muted");
    ordersList.innerHTML = "Nenhuma ordem cadastrada ainda.";
    return;
  }

  const filtered = statusFilter === "todas"
    ? orders
    : orders.filter(o => o.status === statusFilter);

  if (!filtered.length) {
    ordersList.classList.add("muted");
    ordersList.innerHTML = "Nenhuma ordem com esse status.";
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Data</th>
          <th>Itens</th>
          <th>Total</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const order of filtered) {
    const dateLabel = order.date
      ? new Date(order.date).toLocaleDateString("pt-BR")
      : "Sem data";

    const itemsLines = order.items.map(item => {
      const product = getProductById(item.productId);
      const name = product ? product.name : "Produto removido";
      const subtotal = item.quantity * item.unitPrice;
      return `<li>${name} x${item.quantity} (${formatCurrency(item.unitPrice)} cada, subtotal ${formatCurrency(subtotal)})</li>`;
    }).join("");

    const notes = order.notes
      ? `<div class="order-notes">Obs: ${order.notes}</div>`
      : "";

    html += `
      <tr>
        <td>${getClientNameById(order.clientId)}</td>
        <td>${dateLabel}</td>
        <td>
          <ul class="order-items-list">
            ${itemsLines}
          </ul>
          ${notes}
        </td>
        <td class="total">${formatCurrency(order.total)}</td>
        <td>
          <span class="${badgeClassForStatus(order.status)}">
            ${labelForStatus(order.status)}
          </span>
        </td>
        <td>
          <button class="btn btn-danger btn-sm" data-id="${order.id}" data-action="delete-order">
            Excluir
          </button>
        </td>
      </tr>
    `;
  }

  html += "</tbody></table>";
  ordersList.classList.remove("muted");
  ordersList.innerHTML = html;

  ordersList.querySelectorAll("button[data-action='delete-order']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteOrder(id);
    });
  });
}

function deleteOrder(id) {
  let orders = loadFromStorage(LS_ORDERS_KEY);
  orders = orders.filter(o => String(o.id) !== String(id));
  saveToStorage(LS_ORDERS_KEY, orders);
  renderOrders();
}

function setupOrderForm() {
  const addItemBtn = document.getElementById("addOrderItemBtn");
  const statusFilter = document.getElementById("orderStatusFilter");
  const form = document.getElementById("orderForm");
  const dateInput = document.getElementById("orderDate");
  const warning = document.getElementById("ordersWarning");

  const today = new Date();
  dateInput.value = today.toISOString().slice(0, 10);

  addItemBtn.addEventListener("click", () => {
    const products = loadFromStorage(LS_PRODUCTS_KEY);
    if (!products.length) {
      alert("Cadastre pelo menos um produto antes de adicionar itens.");
      return;
    }
    createOrderItemRow();
  });

  statusFilter.addEventListener("change", () => {
    renderOrders();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const clients = loadFromStorage(LS_CLIENTS_KEY);
    const products = loadFromStorage(LS_PRODUCTS_KEY);

    if (!clients.length || !products.length) {
      alert("Cadastre pelo menos um cliente e um produto.");
      return;
    }

    const clientId = document.getElementById("orderClientSelect").value;
    const date = document.getElementById("orderDate").value;
    const status = document.getElementById("orderStatus").value;
    const notes = document.getElementById("orderNotes").value.trim();
    const itemsContainer = document.getElementById("orderItemsContainer");
    const itemRows = itemsContainer.querySelectorAll(".item-row");

    if (!clientId) {
      alert("Selecione um cliente.");
      return;
    }

    if (!itemRows.length) {
      alert("Adicione pelo menos um item.");
      return;
    }

    const items = [];
    let total = 0;

    for (const row of itemRows) {
      const productSelect = row.querySelector(".item-product-select");
      const [qtyInput, priceInput] = row.querySelectorAll("input[type='number']");

      const productId = productSelect.value;
      const quantity = Number(qtyInput.value) || 0;
      const unitPrice = Number(priceInput.value) || 0;

      if (!productId || quantity <= 0) {
        continue;
      }

      const subtotal = quantity * unitPrice;
      total += subtotal;

      items.push({
        productId,
        quantity,
        unitPrice,
      });
    }

    if (!items.length) {
      alert("Preencha pelo menos um item válido.");
      return;
    }

    const orders = loadFromStorage(LS_ORDERS_KEY);

    const newOrder = {
      id: Date.now(),
      clientId,
      date: date || null,
      status,
      notes,
      items,
      total,
    };

    orders.push(newOrder);
    saveToStorage(LS_ORDERS_KEY, orders);

    form.reset();
    document.getElementById("orderItemsContainer").innerHTML = `
      <div class="items-empty" id="orderItemsEmptyText">
        Nenhum item adicionado ainda.
      </div>
      <div class="item-row-header">
        <span>Produto</span>
        <span>Qtd</span>
        <span>Preço unitário</span>
        <span></span>
      </div>
    `;

    const today2 = new Date();
    document.getElementById("orderDate").value = today2.toISOString().slice(0, 10);
    populateOrderClientSelect();
    renderOrders();
  });

  const clients = loadFromStorage(LS_CLIENTS_KEY);
  const products = loadFromStorage(LS_PRODUCTS_KEY);
  warning.style.display = (!clients.length || !products.length) ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  populateOrderClientSelect();
  setupOrderForm();
  renderOrders();
});
