document.addEventListener("DOMContentLoaded", () => {
  const bed = document.querySelector(".bed");
  const modal = document.getElementById("sleepModal");
  const wakeUpBtn = document.getElementById("wakeUpBtn");

  bed.addEventListener("click", () => {
    modal.style.display = "flex";
    wakeUpBtn.style.display = "none";

    setTimeout(() => {
      wakeUpBtn.style.display = "inline-block";
    }, 5000);
  });

  wakeUpBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
});
