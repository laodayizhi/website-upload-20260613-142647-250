const video = document.querySelector('[data-video-player]');
const playButton = document.querySelector('[data-play-button]');
let attached = false;
let hlsInstance = null;

const attachStream = async () => {
  if (!video || attached) {
    return;
  }

  const streamUrl = video.dataset.m3u8;
  if (!streamUrl) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl;
    attached = true;
    return;
  }

  try {
    const module = await import('./hls-vendor-dru42stk.js');
    const Hls = module.H || module.default;
    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      attached = true;
      return;
    }
  } catch (error) {
    attached = false;
  }

  video.src = streamUrl;
  attached = true;
};

const playVideo = async () => {
  if (!video) {
    return;
  }

  await attachStream();
  try {
    await video.play();
    if (playButton) {
      playButton.classList.add('is-hidden');
    }
  } catch (error) {
    if (playButton) {
      playButton.classList.remove('is-hidden');
    }
  }
};

if (video && playButton) {
  playButton.addEventListener('click', playVideo);
  video.addEventListener('click', () => {
    if (video.paused) {
      playVideo();
    }
  });
  video.addEventListener('play', () => {
    playButton.classList.add('is-hidden');
  });
  video.addEventListener('pause', () => {
    if (video.currentTime === 0 || video.ended) {
      playButton.classList.remove('is-hidden');
    }
  });
}

window.addEventListener('pagehide', () => {
  if (hlsInstance) {
    hlsInstance.destroy();
  }
});
