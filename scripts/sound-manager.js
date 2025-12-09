// ============ 音频管理系统 ============

// 默认设置
const DEFAULT_SETTINGS = {
  bgmEnabled: true,
  sfxEnabled: true,
  volume: 0.6
};

// ============ 设置管理 ============
function getAudioSettings() {
  const saved = localStorage.getItem('audioSettings');
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
}

function saveAudioSettings(settings) {
  localStorage.setItem('audioSettings', JSON.stringify(settings));
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

// ============ 设置修改 ============
function setBgmEnabled(enabled) {
  const settings = getAudioSettings();
  settings.bgmEnabled = enabled;
  saveAudioSettings(settings);
  
  const bgm = document.getElementById('bgmAudio');
  if (bgm) {
    if (enabled) {
      bgm.play().catch(() => {});
    } else {
      bgm.pause();
      // 清除保存的播放位置
      localStorage.removeItem('bgmCurrentTime');
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
  
  const bgm = document.getElementById('bgmAudio');
  if (bgm) {
    bgm.volume = volume;
  }
}

// ============ 音效播放 ============
function playSound(soundName) {
  if (!isSfxEnabled()) return;
  
  const audio = document.getElementById(soundName + 'Sound');
  if (audio) {
    audio.volume = getVolume();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

// ============ 背景音乐管理 ============
function initBgm() {
  const bgm = document.getElementById('bgmAudio');
  if (!bgm) return;
  
  const settings = getAudioSettings();
  bgm.volume = settings.volume;
  bgm.loop = true;
  
  // 如果音乐被禁用，不播放
  if (!settings.bgmEnabled) {
    return;
  }
  
  // 恢复播放位置
  const savedTime = localStorage.getItem('bgmCurrentTime');
  if (savedTime) {
    bgm.currentTime = parseFloat(savedTime);
  }
  
  // 尝试播放
  bgm.play().catch(() => {
    // 自动播放被阻止，等待用户交互
    document.addEventListener('click', function playOnClick() {
      if (isBgmEnabled()) {
        const savedTime = localStorage.getItem('bgmCurrentTime');
        if (savedTime) {
          bgm.currentTime = parseFloat(savedTime);
        }
        bgm.play().catch(() => {});
      }
      document.removeEventListener('click', playOnClick);
    }, { once: true });
  });
  
  // 定期保存播放位置（每秒）
  setInterval(() => {
    if (!bgm.paused && isBgmEnabled()) {
      localStorage.setItem('bgmCurrentTime', bgm.currentTime.toString());
    }
  }, 1000);
}

// 页面离开前保存播放位置
function saveBgmPosition() {
  const bgm = document.getElementById('bgmAudio');
  if (bgm && !bgm.paused && isBgmEnabled()) {
    localStorage.setItem('bgmCurrentTime', bgm.currentTime.toString());
  }
}

// ============ 音效按钮 ============
function initSoundButtons() {
  const soundElements = document.querySelectorAll('[data-sound]');
  
  soundElements.forEach(element => {
    element.addEventListener('click', function(e) {
      const soundName = this.dataset.sound;
      const href = this.getAttribute('href');
      
      // 保存音乐播放位置
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

// ============ 初始化 ============
document.addEventListener('DOMContentLoaded', function() {
  initBgm();
  initSoundButtons();
});

// 页面关闭/跳转前保存位置
window.addEventListener('beforeunload', saveBgmPosition);