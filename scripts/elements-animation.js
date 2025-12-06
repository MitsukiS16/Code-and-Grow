document.addEventListener("DOMContentLoaded", () => {
  const house = document.querySelector(".house");
  const popup = document.getElementById("housePopup");

  const bridge = document.querySelector(".bridge");
  const bridgePopup = document.getElementById("bridgePopup");

  const bed = document.querySelector(".bed");
  const bedPopup = document.getElementById("bedPopup");

  const wardrobe = document.querySelector(".wardrobe");
  const wardrobePopup = document.getElementById("wardrobePopup");

  if (house && popup) {
    house.addEventListener("mouseenter", () => {
      popup.style.opacity = "1";
    });

    house.addEventListener("mouseleave", () => {
      popup.style.opacity = "0";
    });
  }

  if (bridge && bridgePopup) {
    bridge.addEventListener("mouseenter", () => {
      bridgePopup.style.opacity = "1";
    });

    bridge.addEventListener("mouseleave", () => {
      bridgePopup.style.opacity = "0";
    });
  }

  if (bed && bedPopup) {
    bed.addEventListener("mouseenter", () => {
      bedPopup.style.opacity = "1";
    });

    bed.addEventListener("mouseleave", () => {
      bedPopup.style.opacity = "0";
    });
  }

  if (wardrobe && wardrobePopup) {
    wardrobe.addEventListener("mouseenter", () => {
      wardrobePopup.style.opacity = "1";
    });

    wardrobe.addEventListener("mouseleave", () => {
      wardrobePopup.style.opacity = "0";
    });
  }
});
