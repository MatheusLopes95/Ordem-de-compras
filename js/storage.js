let appData = {
  clients: [],
  products: [],
  orders: []
};

const SS_CLIENTS_KEY = "purchaseSystem_clients";
const SS_PRODUCTS_KEY = "purchaseSystem_products";
const SS_ORDERS_KEY = "purchaseSystem_orders";

function loadFromStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.warn('Erro ao carregar do sessionStorage:', error);
  }
  
  switch (key) {
    case SS_CLIENTS_KEY: return appData.clients;
    case SS_PRODUCTS_KEY: return appData.products;
    case SS_ORDERS_KEY: return appData.orders;
    default: return [];
  }
}

function saveToStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Erro ao salvar no sessionStorage:', error);
  }
  
  switch (key) {
    case SS_CLIENTS_KEY: appData.clients = value; break;
    case SS_PRODUCTS_KEY: appData.products = value; break;
    case SS_ORDERS_KEY: appData.orders = value; break;
  }
}

const LS_CLIENTS_KEY = SS_CLIENTS_KEY;
const LS_PRODUCTS_KEY = SS_PRODUCTS_KEY;
const LS_ORDERS_KEY = SS_ORDERS_KEY;

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function badgeClassForStatus(status) {
  switch (status) {
    case "aprovada": return "badge badge-aprovada";
    case "recebida": return "badge badge-recebida";
    case "cancelada": return "badge badge-cancelada";
    default: return "badge badge-pendente";
  }
}

function labelForStatus(status) {
  switch (status) {
    case "aprovada": return "Aprovada";
    case "recebida": return "Recebida";
    case "cancelada": return "Cancelada";
    default: return "Pendente";
  }
}