let t = 0;
let numPetals = 4;
let maxPetalSize = 375;
let duration = 3.5 * 1000;
let harmonics = 3;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
}

function draw() {
  background(240, 234, 214);

  translate(width / 2, height / 2);

  for (let i = 0; i < numPetals; i++) {
    let angleOffset = 360 / numPetals * i;
    let scaleFactor = map(t, 0, duration, 0, maxPetalSize);
    let dampingFactor = 1 - t / duration;

    beginShape();
    vertex(0, 0);

    for (let angle = 0; angle <= 180; angle++) {
      let r = scaleFactor * A(t, angle + angleOffset) * B(t, angle + angleOffset) * dampingFactor;
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertex(x, y);
    }

    endShape(CLOSE);
  }

  t += 16.67; // Advance time by 1/60th of a second (assuming 60 FPS)

  if (t > duration) {
    noLoop(); // Stop the animation after reaching the maximum duration
  }
}

function A(t, angle) {
  let sum = 0;
  for (let n = 1; n <= harmonics; n++) {
    sum += cos(n * angle + t / 100 * n);
  }
  return sum / harmonics;
}

function B(t, angle) {
  let sum = 0;
  for (let n = 1; n <= harmonics; n++) {
    sum += sin(2 * n * angle + t / 100 * n);
  }
  return sum / harmonics;
}
