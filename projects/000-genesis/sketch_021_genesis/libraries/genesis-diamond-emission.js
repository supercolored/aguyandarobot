class DiamondEmissionAnimation extends GenesisAnimation {
  constructor() {
    super();
    this.diamonds = new Map();
    this.fadeOutDuration = 1000; // 1 second fade out duration
    this.hx = 10; // half of the width of the diamond
  }

  onKeyPress(note, velocity, color) {
    let releaseTime = null;
    let shape = { vertecies: [] };
    this.diamonds.set(note, { velocity, color, releaseTime, shape });
  }

  onKeyRelease(note, velocity) {
    let diamond = this.diamonds.get(note);
    if (diamond) {
      diamond.releaseTime = millis(); // Set release time to the current time
    }
  }

  update() {
    // will need to move this
    background(0);
    let currentTime = millis();
    let xmid = width / 2;
    let ymid = height / 2;
    for (const [note, diamond] of this.diamonds) {
      let x = map(note, 21, 108, 0, width);
      let alpha = 255;

      if (diamond.shape.vertecies.length === 0) {
        diamond.shape.vertecies.push({ x: xmid, y: ymid - this.hx });
        diamond.shape.vertecies.push({ x: xmid + this.hx, y: ymid });
        diamond.shape.vertecies.push({ x: xmid, y: ymid + this.hx });
        diamond.shape.vertecies.push({ x: xmid - this.hx, y: ymid });
      }

      if (diamond.releaseTime !== null) {
        let timeSinceRelease = currentTime - diamond.releaseTime;
        if (timeSinceRelease >= this.fadeOutDuration) {
          this.diamonds.delete(note);
          continue;
        }
        // fade out
        // alpha = map(timeSinceRelease, 0, this.fadeOutDuration, 255, 0);

        // expand the diamond
        let expand = 2000;
        let y1 = ymid - this.hx;
        let x2 = xmid + this.hx;
        let y3 = ymid + this.hx;
        let x4 = xmid - this.hx;
        let ex_y1 = map(timeSinceRelease, 0, this.fadeOutDuration, y1, y1 - expand);
        let ex_x2 = map(timeSinceRelease, 0, this.fadeOutDuration, x2, x2 + expand);
        let ex_y3 = map(timeSinceRelease, 0, this.fadeOutDuration, y3, y3 + expand);
        let ex_x4 = map(timeSinceRelease, 0, this.fadeOutDuration, x4, x4 - expand);

        diamond.shape.vertecies[0].y = ex_y1;
        diamond.shape.vertecies[1].x = ex_x2;
        diamond.shape.vertecies[2].y = ex_y3;
        diamond.shape.vertecies[3].x = ex_x4;
      }

      let diamondColor = color(diamond.color.levels[0], diamond.color.levels[1], diamond.color.levels[2], alpha);
      fill(diamondColor);
      noStroke();

      beginShape();
      for (let v of diamond.shape.vertecies) vertex(v.x, v.y);
      endShape();
    }
  }
}
