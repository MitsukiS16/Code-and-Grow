document.addEventListener("DOMContentLoaded", () => {
  const bed = document.querySelector(".bed");
  const modal = document.getElementById("sleepModal");
  const wakeUpBtn = document.getElementById("wakeUpBtn");
  const panda = document.querySelector(".panda"); // main panda on board

  bed.addEventListener("click", () => {
    modal.style.display = "flex";
    wakeUpBtn.style.display = "none";

    panda.src = "/assets/panda-young-sleeping.png";

    setTimeout(() => {
      wakeUpBtn.style.display = "inline-block";
    }, 5000);
  });

  wakeUpBtn.addEventListener("click", () => {
    modal.style.display = "none";
    panda.src = "/assets/panda-young.png";
  });
});
