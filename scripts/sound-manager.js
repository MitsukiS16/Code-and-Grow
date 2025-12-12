const DEFAULT_SETTINGS = {
  bgmEnabled: true,
  sfxEnabled: true,
  volume: 0.6,
};

// get saved settings or defaults
function getAudioSettings() {
  const saved = localStorage.getItem("audioSettings");
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
}

function saveAudioSettings(settings) {
  localStorage.setItem("audioSettings", JSON.stringify(settings));
}

function isBgmEnabled() {
  return getAudioSettings().bgmEnabled;
}

function isSfxEnabled() {
  return getAudioSettings().sfxEnabled;
}

function getVolume() {
  return getAudioSettings().volume;
}

// modify settings
function setBgmEnabled(enabled) {
  const settings = getAudioSettings();
  settings.bgmEnabled = enabled;
  saveAudioSettings(settings);

  const bgm = document.getElementById("bgmAudio");
  if (bgm) {
    if (enabled) {
      bgm.play().catch(() => {});
    } else {
      bgm.pause();
      localStorage.removeItem("bgmCurrentTime");
    }
  }
}

function setSfxEnabled(enabled) {
  const settings = getAudioSettings();
  settings.sfxEnabled = enabled;
  saveAudioSettings(settings);
}

function setVolume(volume) {
  const settings = getAudioSettings();
  settings.volume = volume;
  saveAudioSettings(settings);

  const bgm = document.getElementById("bgmAudio");
  if (bgm) {
    bgm.volume = volume;
  }
}

function playSound(soundName) {
  if (!isSfxEnabled()) return;
  const audio = document.getElementById(soundName + "Sound");
  if (audio) {
    audio.volume = getVolume();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

// background music
function initBgm() {
  const bgm = document.getElementById("bgmAudio");
  if (!bgm) return;

  const settings = getAudioSettings();
  bgm.volume = settings.volume;
  bgm.loop = true;

  if (!settings.bgmEnabled) {
    return;
  }

  const savedTime = localStorage.getItem("bgmCurrentTime");
  if (savedTime) {
    bgm.currentTime = parseFloat(savedTime);
  }

  bgm.play().catch(() => {
    document.addEventListener(
      "click",
      function playOnClick() {
        if (isBgmEnabled()) {
          const savedTime = localStorage.getItem("bgmCurrentTime");
          if (savedTime) {
            bgm.currentTime = parseFloat(savedTime);
          }
          bgm.play().catch(() => {});
        }
        document.removeEventListener("click", playOnClick);
      },
      { once: true }
    );
  });

  setInterval(() => {
    if (!bgm.paused && isBgmEnabled()) {
      localStorage.setItem("bgmCurrentTime", bgm.currentTime.toString());
    }
  }, 1000);
}

function saveBgmPosition() {
  const bgm = document.getElementById("bgmAudio");
  if (bgm && !bgm.paused && isBgmEnabled()) {
    localStorage.setItem("bgmCurrentTime", bgm.currentTime.toString());
  }
}

// sound effects for buttons
function initSoundButtons() {
  const soundElements = document.querySelectorAll("[data-sound]");

  soundElements.forEach((element) => {
    element.addEventListener("click", function (e) {
      const soundName = this.dataset.sound;
      const href = this.getAttribute("href");

      saveBgmPosition();

      if (href) {
        e.preventDefault();
        playSound(soundName);
        setTimeout(() => {
          window.location.href = href;
        }, 150);
      } else {
        playSound(soundName);
      }
    });
  });
}

function initSettingsPage() {
  const bgmToggle = document.getElementById("bgmToggle");
  const sfxToggle = document.getElementById("sfxToggle");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeDisplay = document.getElementById("volumeDisplay");
  const hintsToggle = document.getElementById("hintsToggle");

  if (!bgmToggle && !sfxToggle && !volumeSlider) return;

  const settings = getAudioSettings();

  if (bgmToggle) {
    bgmToggle.checked = settings.bgmEnabled;
    bgmToggle.addEventListener("change", function () {
      setBgmEnabled(this.checked);
    });
  }

  if (sfxToggle) {
    sfxToggle.checked = settings.sfxEnabled;
    sfxToggle.addEventListener("change", function () {
      setSfxEnabled(this.checked);
      if (this.checked) {
        playSound("click");
      }
    });
  }

  if (volumeSlider && volumeDisplay) {
    const volumePercent = Math.round(settings.volume * 100);
    volumeSlider.value = volumePercent;
    volumeDisplay.textContent = volumePercent + "%";

    volumeSlider.addEventListener("input", function () {
      const volume = this.value / 100;
      volumeDisplay.textContent = this.value + "%";
      setVolume(volume);
    });
  }

  if (hintsToggle) {
    let hintsEnabled = localStorage.getItem("hintsEnabled");

    if (hintsEnabled === null) {
      hintsEnabled = "true";
      localStorage.setItem("hintsEnabled", hintsEnabled);
    }

    hintsToggle.checked = hintsEnabled === "true";
    hintsToggle.addEventListener("change", function () {
      localStorage.setItem("hintsEnabled", this.checked);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initBgm();
  initSoundButtons();
  initSettingsPage();
});

window.addEventListener("beforeunload", saveBgmPosition);
