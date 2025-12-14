document.addEventListener("DOMContentLoaded", () => {
  const panda = document.getElementById("panda");
  if (!panda) {
    console.error("panda-animation.js: #panda element not found.");
    return;
  }

  const PNG_HAPPY = "/assets/panda-young.png";
  const PNG_SAD = "/assets/panda-sad.png";
  const GIF = "/assets/panda-young.gif";

  const gifUrl = () => `${GIF}?t=${Date.now()}`;

  function getCurrentPng() {
    if (panda.src.includes('sleeping')) {
      return panda.src;
    }
    
    const energy = typeof getEnergy === 'function' ? getEnergy() : 10;
    const health = typeof getHealth === 'function' ? getHealth() : 5;
    if (energy <= 2 || health <= 1) {
      return PNG_SAD;
    }
    return PNG_HAPPY;
  }

  function getCurrentGif() {
    const energy = typeof getEnergy === 'function' ? getEnergy() : 10;
    const health = typeof getHealth === 'function' ? getHealth() : 5;
    return gifUrl(GIF);
  }

  panda.addEventListener("mouseenter", () => {
    if (panda.src.includes('sleeping')) return;
    panda.src = getCurrentGif();
  });
  panda.addEventListener("mouseleave", () => {
    if (panda.src.includes('sleeping')) return;
    panda.src = getCurrentPng();
  });

  panda.addEventListener(
    "touchstart",
    (e) => {
      if (panda.src.includes('sleeping')) return;
      e.preventDefault && e.preventDefault();
      panda.src = getCurrentGif();
    },
    { passive: false }
  );

  panda.addEventListener("touchend", () => {
    if (panda.src.includes('sleeping')) return;
    panda.src = getCurrentPng();
  });
  panda.addEventListener("touchcancel", () => {
    if (panda.src.includes('sleeping')) return;
    panda.src = getCurrentPng();
  });

  const imgPre = new Image();
  imgPre.src = GIF;
});
