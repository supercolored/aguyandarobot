// Constants
const animationDuration = 100 * 1000;
const numberOfLines = 4;

// Easing function
function quinticEasingOut(t) {
  t -= 1;
  return t * t * t * t * t + 1;
}

// Line class
class Line {
  constructor(x, y, direction, delay) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.delay = delay;
    this.startTime = millis() + delay;
    this.finished = false;
  }

  update() {
    if (millis() < this.startTime) {
      return;
    }

    let t = (millis() - this.startTime) / animationDuration;
    let easingValue = quinticEasingOut(t);
    this.y += this.direction * easingValue * (height / 2);
    this.finished = (this.direction === 1 && this.y >= height/2) || (this.direction === -1 && this.y <= 0);
  }

  draw() {
    stroke(255);
    line(this.x - (0.4 * width), this.y, this.x + (0.4 * width), this.y);
  }
}

// Global variables
let lines = [];

// p5.js setup function
function setup() {
  createCanvas(windowWidth, windowHeight);
  const delayBetweenLines = 1000; // A tenth of a second delay in milliseconds

  for (let i = 0; i < numberOfLines; i++) {
    const x = width / 2;
    const y = height / 2;
    const direction = i < numberOfLines / 2 ? 1 : -1;
    const delay = (i % 2) * delayBetweenLines;
    lines.push(new Line(x, y, direction, delay));
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
