function renderProducts() {
  const container = document.getElementById("productsList");
  const products = loadFromStorage(LS_PRODUCTS_KEY);

  if (!products.length) {
    container.classList.add("muted");
    container.innerHTML = "Nenhum produto cadastrado ainda.";
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Preço base</th>
          <th>Descrição</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const product of products) {
    html += `
      <tr>
        <td>${product.name}</td>
        <td>${formatCurrency(product.basePrice)}</td>
        <td>${product.description || "-"}</td>
        <td>
          <button class="btn btn-danger btn-sm" data-id="${product.id}" data-action="delete-product">
            Excluir
          </button>
        </td>
      </tr>
    `;
  }

  html += "</tbody></table>";
  container.classList.remove("muted");
  container.innerHTML = html;

  container.querySelectorAll("button[data-action='delete-product']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteProduct(id);
    });
  });
}

function deleteProduct(id) {
  let products = loadFromStorage(LS_PRODUCTS_KEY);
  let orders = loadFromStorage(LS_ORDERS_KEY);

  products = products.filter(p => String(p.id) !== String(id));

  orders = orders
    .map(order => ({
      ...order,
      items: order.items.filter(item => String(item.productId) !== String(id)),
    }))
    .filter(order => order.items.length > 0);

  saveToStorage(LS_PRODUCTS_KEY, products);
  saveToStorage(LS_ORDERS_KEY, orders);

  renderProducts();
}

function setupProductForm() {
  const form = document.getElementById("productForm");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const price = Number(document.getElementById("productPrice").value) || 0;
    const description = document.getElementById("productDescription").value.trim();

    if (!name) {
      alert("Informe o nome do produto.");
      return;
    }

    if (price < 0) {
      alert("Preço inválido.");
      return;
    }

    const products = loadFromStorage(LS_PRODUCTS_KEY);

    const newProduct = {
      id: Date.now(),
      name,
      basePrice: price,
      description: description || null,
    };

    products.push(newProduct);
    saveToStorage(LS_PRODUCTS_KEY, products);

    form.reset();
    renderProducts();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupProductForm();
  renderProducts();
});

