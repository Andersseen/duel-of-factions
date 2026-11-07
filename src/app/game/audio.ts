import type { SoundSettings } from "./models";
// Original procedural ambient score and small synthesized action cues.
export class GameAudio {
  ctx: AudioContext | null = null;
  timer: ReturnType<typeof setInterval> | null = null;
  step = 0;
  active = true;
  scene = "menu";
  master!: GainNode;
  musicBus!: GainNode;
  fxBus!: GainNode;
  constructor(public settings: SoundSettings) {
    this.settings = settings;
    this.ctx = null;
    this.timer = null;
    this.step = 0;
    this.active = true;
    this.scene = "menu";
  }
  unlock() {
    try {
      if (!this.ctx) {
        this.ctx = new window.AudioContext();
        this.master = this.ctx.createGain();
        this.musicBus = this.ctx.createGain();
        this.fxBus = this.ctx.createGain();
        this.musicBus.connect(this.master);
        this.fxBus.connect(this.master);
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended" && this.active)
        this.ctx
          .resume()
          .then(() => this.update())
          .catch(() => {});
      else this.update();
    } catch {}
  }
  tone(
    freq: number,
    duration = 0.2,
    volume = 0.1,
    type: OscillatorType = "sine",
    delay = 0,
    music = false,
  ) {
    if (!this.ctx || !this.active) return;
    const now = this.ctx.currentTime + delay,
      o = this.ctx.createOscillator(),
      g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(volume, now + 0.025);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    o.connect(g);
    g.connect(music ? this.musicBus : this.fxBus);
    o.start(now);
    o.stop(now + duration + 0.03);
  }
  cue(kind: string) {
    if (!this.settings.effects || !this.active) return;
    const v = 0.22;
    if (kind === "win") {
      [261.63, 329.63, 392, 523.25].forEach((n, i) =>
        this.tone(n, 0.8, v, "sine", i * 0.13),
      );
    } else if (kind === "lose") {
      [293.66, 261.63, 220, 146.83].forEach((n, i) =>
        this.tone(n, 0.7, v * 0.65, "sine", i * 0.15),
      );
    } else if (kind === "scorch") {
      [130, 98, 65].forEach((n, i) =>
        this.tone(n, 0.3, v * 0.5, "triangle", i * 0.07),
      );
      this.noise(0.5, v * 0.35);
    } else if (kind === "weather") {
      this.noise(0.9, v * 0.18);
      this.tone(587, 0.9, v * 0.2);
      this.tone(440, 0.8, v * 0.15, "sine", 0.15);
    } else if (kind === "medic") {
      [392, 523, 659].forEach((n, i) =>
        this.tone(n, 0.45, v * 0.55, "sine", i * 0.1),
      );
    } else if (kind === "play") {
      this.tone(196, 0.17, v * 0.5, "triangle");
      this.tone(294, 0.22, v * 0.35, "sine", 0.06);
    } else if (kind === "pass") {
      this.tone(220, 0.25, v * 0.35);
      this.tone(165, 0.4, v * 0.3, "sine", 0.12);
    } else {
      this.tone(440, 0.07, v * 0.17, "sine");
    }
  }
  noise(duration: number, volume: number) {
    if (!this.ctx) return;
    const n = Math.floor(this.ctx.sampleRate * duration),
      buffer = this.ctx.createBuffer(1, n, this.ctx.sampleRate),
      data = buffer.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    let source = this.ctx.createBufferSource(),
      filter = this.ctx.createBiquadFilter(),
      gain = this.ctx.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.value = 900;
    gain.gain.value = volume;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.fxBus);
    source.start();
  }
  update() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.settings.volume, now, 0.03);
    this.musicBus.gain.setTargetAtTime(this.settings.music ? 1 : 0, now, 0.03);
    this.fxBus.gain.setTargetAtTime(this.settings.effects ? 1 : 0, now, 0.03);
    if (this.settings.music && this.settings.volume > 0 && this.active) {
      if (!this.timer) {
        this.phrase();
        this.timer = setInterval(
          () => this.phrase(),
          this.scene === "battle" ? 2400 : 4800,
        );
      }
    } else {
      clearInterval(this.timer ?? undefined);
      this.timer = null;
    }
  }
  phrase() {
    if (!this.ctx || this.ctx.state !== "running") return;
    if (this.scene === "battle") {
      this.battlePhrase();
      return;
    }
    const chords = [
        [146.83, 220, 293.66, 349.23],
        [130.81, 196, 261.63, 329.63],
        [174.61, 220, 261.63, 349.23],
        [130.81, 196, 293.66, 392],
      ],
      chord = chords[this.step++ % chords.length],
      v = 0.035;
    chord.forEach((n, i) => {
      this.tone(n, 4.5, v, "sine", i * 0.05, true);
      this.tone(n * 2, 1.5, v * 0.4, "sine", i * 0.65 + 0.3, true);
    });
  }
  setScene(scene: string) {
    if (this.scene === scene) return;
    this.scene = scene;
    this.step = 0;
    clearInterval(this.timer ?? undefined);
    this.timer = null;
    if (this.ctx) {
      const old = this.musicBus;
      old.gain.cancelScheduledValues(this.ctx.currentTime);
      old.gain.setTargetAtTime(0, this.ctx.currentTime, 0.18);
      setTimeout(() => old.disconnect(), 5500);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0;
      this.musicBus.connect(this.master);
      this.update();
    }
  }
  battlePhrase() {
    if (!this.ctx) return;
    // 100 BPM: low drum pulse, plucked ostinato, restrained harmonic strings.
    const roots = [146.83, 130.81, 174.61, 110],
      root = roots[this.step++ % 4];
    [1, 1.5, 2, 2.4].forEach((ratio, i) =>
      this.tone(root * ratio, 2.3, 0.022, "triangle", i * 0.025, true),
    );
    const motif = [1, 1.5, 2, 1.5, 1.2, 1.5, 2, 2.4];
    motif.forEach((ratio, i) =>
      this.tone(
        root * ratio,
        0.24,
        i % 2 ? 0.025 : 0.04,
        "triangle",
        i * 0.3,
        true,
      ),
    );
    for (let i = 0; i < 4; i++) {
      const time = this.ctx.currentTime + i * 0.6,
        o = this.ctx.createOscillator(),
        g = this.ctx.createGain();
      o.frequency.setValueAtTime(i % 2 ? 96 : 115, time);
      o.frequency.exponentialRampToValueAtTime(42, time + 0.18);
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(i % 2 ? 0.07 : 0.11, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
      o.connect(g);
      g.connect(this.musicBus);
      o.start(time);
      o.stop(time + 0.32);
      this.tone(440, 0.065, 0.012, "triangle", i * 0.6 + 0.3, true);
    }
  }
  setActive(active: boolean) {
    this.active = active;
    if (!active) {
      clearInterval(this.timer ?? undefined);
      this.timer = null;
      this.ctx?.suspend().catch(() => {});
    } else if (this.ctx) {
      this.ctx
        .resume()
        .then(() => this.update())
        .catch(() => {});
    }
  }
  destroy() {
    clearInterval(this.timer ?? undefined);
    this.timer = null;
    void this.ctx?.close();
    this.ctx = null;
  }
}
