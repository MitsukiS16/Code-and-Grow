// panda-animation.js
document.addEventListener("DOMContentLoaded", () => {
  const panda = document.getElementById("panda");
  if (!panda) {
    console.error("panda-animation.js: #panda element not found.");
    return;
  }

  const PNG = "/assets/panda-young.png";
  const GIF = "/assets/panda-young.gif";

  const gifUrl = () => `${GIF}?t=${Date.now()}`;

  panda.addEventListener("mouseenter", () => {
    panda.src = gifUrl();
  });
  panda.addEventListener("mouseleave", () => {
    panda.src = PNG;
  });

  panda.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault && e.preventDefault();
      panda.src = gifUrl();
    },
    { passive: false }
  );

  panda.addEventListener("touchend", () => {
    panda.src = PNG;
  });
  panda.addEventListener("touchcancel", () => {
    panda.src = PNG;
  });

  const imgPre = new Image();
  imgPre.src = GIF;
});
