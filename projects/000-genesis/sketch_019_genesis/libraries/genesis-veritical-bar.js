class VerticalBarAnimation extends GenesisAnimation {
  constructor() {
    super();
    this.bars = new Map();
    this.fadeOutDuration = 1000; // 1 second fade out duration
  }

  onKeyPress(note, velocity, color) {
    let releaseTime = null;
    this.bars.set(note, { velocity, color, releaseTime });
  }

  onKeyRelease(note, velocity) {
    let bar = this.bars.get(note);
    if (bar) {
      bar.releaseTime = millis(); // Set release time to the current time
    }
  }

  update() {
    let currentTime = millis();
    for (const [note, bar] of this.bars) {
      let x = map(note, 21, 108, 0, width);
      let alpha = 255;

      if (bar.releaseTime !== null) {
        let timeSinceRelease = currentTime - bar.releaseTime;
        if (timeSinceRelease >= this.fadeOutDuration) {
          this.bars.delete(note);
          continue;
        }
        alpha = map(timeSinceRelease, 0, this.fadeOutDuration, 255, 0);
      }

      let barColor = color(bar.color.levels[0], bar.color.levels[1], bar.color.levels[2], alpha);
      fill(barColor);
      noStroke();
      rect(x, 0, width / 88, height); // Assuming 88 keys on a standard keyboard
    }
  }
}
