function resetPhone(keys) {
  (keys || []).forEach(function (k) { localStorage.removeItem(k); });
  location.reload();
}
