// Constants
const animationDuration = 10 * 1000;
const numberOfLines = 4;
const delayBetweenLines = 1000; // A tenth of a second delay in milliseconds

const DIRECTION = {
  UP: -1,
  DOWN: 1
};

let lines = [];
let lineIDs = [];

// p5.js setup function
function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < numberOfLines; i++) {
    const x = width / 2;
    const y = height / 2;
    // const direction = i < numberOfLines / 2 ? 1 : -1;
    // const delay = (i % 2) * delayBetweenLines;
    lineIDs.push(i);
    lines.push(new Line(x, y, DIRECTION.UP, 1000 * i, lineIDs.length - 1));
  }
}

// p5.js draw function
function draw() {
  background(0);
  for (const line of lines) {
    line.update();
    line.draw();
  }
}


class Line {
  constructor(x, y, direction = DIRECTION.UP, delay = 1000, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.delay = delay;
    this.startTime = millis() + delay;
    this.finished = false;
  }

  update() {
    // don't update if we haven't started yet, or if we're finished
    if (millis() < this.startTime || this.finished) {
      return;
    }

    let t = (millis() - this.startTime) / animationDuration;
    let easingValue = quinticEasingOut(t);
    this.y += this.direction * easingValue * (height);
    console.table({
      id: this.id, 
      t, 
      easingValue, 
      y: this.y, 
      direction: this.direction, 
      finished: this.finished
    });
    this.finished = (this.direction === 1 && this.y >= height / 2) || (this.direction === -1 && this.y <= 0);
  }

  draw() {
    // don't draw if we haven't started yet, or if we're finished
    if (millis() < this.startTime || this.finished) {
      return;
    }

    stroke(255);
    line(this.x - (0.4 * width), this.y, this.x + (0.4 * width), this.y);
  }
}

function quinticEasingOut(t) {
  t -= 1;
  return t * t * t * t * t + 1;
}