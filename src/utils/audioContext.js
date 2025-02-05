let audioContext;

export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Immediately unlocks/resumes the AudioContext in a user gesture.
 */
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    // Resume the context
    ctx.resume();

    // Optionally: play a short silent buffer so iOS knows we're really using audio
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  }
}
