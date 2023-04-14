class VerticalBarAnimation extends GenesisAnimation {
  constructor() {
    super();
    this.bars = new Map();
    this.fadeOutDuration = 3000; // 1 second fade out duration
  }

  exponentialOut(t) {
    return 1 - Math.pow(2, -10 * t);
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
    // will need to move this later...
    background(0);
    let currentTime = millis();
    for (const [note, bar] of this.bars) {
      let x = map(note, 21, 108, 0, width);
      let alpha = 255;
      let barW = width / 88;

      if (bar.releaseTime !== null) {
        let timeSinceRelease = currentTime - bar.releaseTime;
        let easing = this.exponentialOut(timeSinceRelease / this.fadeOutDuration);
        if (timeSinceRelease >= this.fadeOutDuration) {
          this.bars.delete(note);
          continue;
        }
        // alpha = map(timeSinceRelease, 0, this.fadeOutDuration, 255, 0);
        // barW = map(timeSinceRelease, 0, this.fadeOutDuration, barW, bar.velocity > 60 ? barW * 5 : 0);
        alpha = map(timeSinceRelease, 0, this.fadeOutDuration, 255, 0);
        barW = map(timeSinceRelease, 0, this.fadeOutDuration, barW, 0);
      }

      let barColor = color(bar.color.levels[0], bar.color.levels[1], bar.color.levels[2], alpha);
      fill(barColor);
      noStroke();
      rect(x - barW/2, 0, barW, height);
    }
  }
}
