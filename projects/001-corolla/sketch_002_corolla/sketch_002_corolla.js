const numHarmonics = 3;
const maxPetalSize = 375;
const bloomDuration = 3.5 * 1000; // in milliseconds
let startTime;

function setup() {
  createCanvas(800, 800);
  startTime = millis();
}

function draw() {
  background(240, 234, 214);

  let t = millis() - startTime;
  let normalizedTime = t / bloomDuration;

  let petalSize = 0;

  for (let i = 1; i <= numHarmonics; i++) {
    let harmonicWeight = 1 / (i * i);
    let harmonic = sin(2 * PI * i * normalizedTime);

    petalSize += harmonicWeight * harmonic;
  }

  petalSize = maxPetalSize * (1 - exp(-4 * petalSize));

  if (t < bloomDuration) {
    for (let i = 0; i < 4; i++) {
      push();
      translate(width / 2, height / 2);
      rotate(PI / 2 * i);
      drawPetal(0, 0, petalSize);
      pop();
    }
  } else {
    for (let i = 0; i < 4; i++) {
      push();
      translate(width / 2, height / 2);
      rotate(PI / 2 * i);
      drawPetal(0, 0, maxPetalSize);
      pop();
    }
  }
}

function drawPetal(x, y, size) {
  fill(255, 0, 0); // Red color
  noStroke();
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 3, x - size / 3, y - size, x, y - size);
  bezierVertex(x + size / 3, y - size, x + size / 2, y - size / 3, x, y);
  endShape(CLOSE);
}
