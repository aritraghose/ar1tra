// Theme init. Loaded as a blocking script in <head> (Layout.astro), so the `dark` class is set
// before anything is painted (no light flash), and served from 'self' so the
// Content-Security-Policy allows it. The toggle button's click handler lives in ThemeIcon.astro.
(() => {
  let theme = "";
  try {
    theme = localStorage.getItem("theme") ?? "";
  } catch {}
  if (!["dark", "light"].includes(theme)) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {}
})();
