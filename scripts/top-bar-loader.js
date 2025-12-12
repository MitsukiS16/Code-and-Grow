fetch("/main-pages/components/top-bar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("topBar").innerHTML = html;

    // Dispatch an event so other scripts can safely run
    document.dispatchEvent(new Event("topbar-loaded"));
  });
