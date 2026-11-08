// Menerapkan tema tersimpan sebelum React dirender agar tidak berkedip.
(function () {
  try {
    var mode = localStorage.getItem('skilllearn_theme');
    var dark = mode === 'dark' || (mode !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
