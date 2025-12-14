fetch("/components/top-bar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("topBar").innerHTML = html;

    if (typeof initSoundButtons === 'function') {
      initSoundButtons();
    }

    initSettingsModal();

    // Dispatch an event so other scripts can safely run
    document.dispatchEvent(new Event("topbar-loaded"));
  });

function initSettingsModal() {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');

  if (!settingsBtn || !settingsModal) return;

  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
    loadSettingsState();
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });

  bindSettingsControls();
}

function loadSettingsState() {
  const settings = typeof getAudioSettings === 'function' ? getAudioSettings() : { bgmEnabled: true, sfxEnabled: true, volume: 0.6 };
  
  const bgmToggle = document.getElementById('bgmToggle');
  const sfxToggle = document.getElementById('sfxToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeDisplay = document.getElementById('volumeDisplay');
  const hintsToggle = document.getElementById('hintsToggle');

  if (bgmToggle) bgmToggle.checked = settings.bgmEnabled;
  if (sfxToggle) sfxToggle.checked = settings.sfxEnabled;
  if (volumeSlider) {
    const volumePercent = Math.round(settings.volume * 100);
    volumeSlider.value = volumePercent;
    if (volumeDisplay) volumeDisplay.textContent = volumePercent + '%';
  }
  if (hintsToggle) {
    hintsToggle.checked = localStorage.getItem('hintsEnabled') !== 'false';
  }
}

function bindSettingsControls() {
  const bgmToggle = document.getElementById('bgmToggle');
  const sfxToggle = document.getElementById('sfxToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeDisplay = document.getElementById('volumeDisplay');
  const hintsToggle = document.getElementById('hintsToggle');

  if (bgmToggle) {
    bgmToggle.addEventListener('change', function() {
      if (typeof setBgmEnabled === 'function') {
        setBgmEnabled(this.checked);
      }
    });
  }

  if (sfxToggle) {
    sfxToggle.addEventListener('change', function() {
      if (typeof setSfxEnabled === 'function') {
        setSfxEnabled(this.checked);
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
      const volume = this.value / 100;
      if (volumeDisplay) volumeDisplay.textContent = this.value + '%';
      if (typeof setVolume === 'function') {
        setVolume(volume);
      }
    });
  }

  if (hintsToggle) {
    hintsToggle.addEventListener('change', function() {
      localStorage.setItem('hintsEnabled', this.checked);
      const hintBtn = document.getElementById('hintBtn');
      const hintPopup = document.getElementById('hintPopup');
      
      if (hintBtn) {
        hintBtn.style.display = this.checked ? 'flex' : 'none';
      }
      if (hintPopup) {
        hintPopup.style.display = 'none';
      }
    });
  }
}