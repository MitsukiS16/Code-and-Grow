document.addEventListener("DOMContentLoaded", () => {
  const wardrobe = document.querySelector(".wardrobe");
  const wardrobeModal = document.getElementById("wardrobeModal");
  const closeWardrobeBtn = document.getElementById("closeWardrobeBtn");

  if (wardrobe && wardrobeModal) {
    wardrobe.addEventListener("click", () => {
      wardrobeModal.style.display = "flex";
    });
  }

  if (closeWardrobeBtn) {
    closeWardrobeBtn.addEventListener("click", () => {
      wardrobeModal.style.display = "none";
    });

    wardrobeModal.addEventListener("click", (e) => {
      if (e.target === wardrobeModal) {
        wardrobeModal.style.display = "none";
      }
    });
  }
});