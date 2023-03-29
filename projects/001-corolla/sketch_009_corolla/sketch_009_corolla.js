let t = 0;
let rotationDuration = 1.618;
let bloomingDuration = 1.618 * 3 / 4;
let noiseScale = 0.015;
let noiseStrength = 0.5;
let petalWidth = 0.75;
let spiralAmount = 0.2;

function setup() {
  createCanvas(800, 800);
  background(240);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(240);
  translate(width / 2, height / 2);

  let easedT = sexticOut(t / bloomingDuration);
  let rotationT = 1 - exponentialOut((t % rotationDuration) / rotationDuration);
  rotate(TWO_PI * rotationT);

  for (let i = 0; i < 4; i++) {
    push();
    rotate((TWO_PI / 4) * i);
    drawPetal(easedT);
    pop();
  }

  t += 1 / (bloomingDuration * 60);
  if (t > bloomingDuration) {
    noLoop();
  }
}

function drawPetal(t) {
  let maxRadius = 375;

  beginShape();
  for (let angle = 0; angle <= PI; angle += 0.01) {
    let radius = petalRadius(t, angle);
    let x = radius * cos(angle);
    let y = radius * sin(angle);

    let noiseValue = noise(angle * noiseScale * 3, t * noiseScale);
    if (noiseValue > 0.6) {
      x += noiseStrength * cos(angle) * (noiseValue - 0.6);
      y += noiseStrength * sin(angle) * (noiseValue - 0.6);
    }

    let spiralFactor = spiralAmount * angle * t;
    x += spiralFactor * cos(angle);
    y += spiralFactor * sin(angle);

    vertex(x, y);
  }
  endShape();
}

function petalRadius(t, angle) {
  let maxRadius = 375;
  let A = maxRadius * petalWidth * sin(2 * angle);
  let B = maxRadius * (1 - petalWidth) * cos(angle);

  let dampingFactor = exp(-0.5 * t);
  let oscillation = A * sin(t) + B * cos(t);

  let radius = maxRadius * (1 - dampingFactor) + oscillation * dampingFactor;
  return radius;
}

function sexticOut(t) {
  return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t);
}

function exponentialOut(t) {
  return 1 - Math.pow(2, -10 * t);
}
