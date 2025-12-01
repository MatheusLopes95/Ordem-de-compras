function maskPhone(value) {
  value = value.replace(/\D/g, "");       
  value = value.slice(0, 11);             

  if (value.length > 2) {
    value = "(" + value.slice(0, 2) + ") " + value.slice(2);
  }

  if (value.length > 9) {
    value = value.replace(/(\(\d{2}\)\s\d{5})(\d{1,4})/, "$1-$2");
  }

  return value;
}

function maskCpf(value) {
  value = value.replace(/\D/g, "");
  value = value.slice(0, 11);

  if (value.length > 3) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
  }
  if (value.length > 7) {
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  }
  if (value.length > 11) {
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
  } else {
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  }

  return value;
}
