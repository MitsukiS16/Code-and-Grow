document.addEventListener("DOMContentLoaded", () => {
  const bed = document.querySelector(".bed");
  const modal = document.getElementById("sleepModal");
  const wakeUpBtn = document.getElementById("wakeUpBtn");
  const panda = document.getElementById("panda");

  let isSleeping = false;

  function movePandaToBed() {
    const bedRect = bed.getBoundingClientRect();
    panda.style.position = 'fixed';
    panda.style.left = (bedRect.left + bedRect.width * 0.28) + 'px';
    panda.style.top = (bedRect.top + bedRect.height * 0.2) + 'px';
    panda.style.bottom = 'auto';
    panda.src = "/assets/panda-young-sleeping.png";
  }

  function movePandaBack() {
    panda.style.position = '';
    panda.style.left = '';
    panda.style.top = '';
    panda.style.bottom = '';
    panda.src = "/assets/panda-young.png";
  }

  window.addEventListener('resize', () => {
    if (isSleeping) {
      movePandaToBed();
    }
  });

  if (bed && modal) {
    bed.addEventListener("click", () => {
      isSleeping = true;
      movePandaToBed();

      modal.style.display = "flex";
      wakeUpBtn.style.display = "none";

      setTimeout(() => {
        wakeUpBtn.style.display = "inline-block";
      }, 5000);
    });
  }

  if (wakeUpBtn) {
    wakeUpBtn.addEventListener('click', function() {
      if (typeof fullRestore === 'function') {
        fullRestore();
      }

      isSleeping = false;
      movePandaBack();

      modal.style.display = "none";
    });
  }
});