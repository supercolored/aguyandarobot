let t = 0;
let nPetals = 4;
let maxTime = 3.5 * 60; // 3.5 seconds

function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(240, 234, 214);
  translate(width / 2, height / 2);

  for (let i = 0; i < nPetals; i++) {
    let petalAngle = TWO_PI * i / nPetals;
    drawPetal(petalAngle);
  }

  t++;
  if (t > maxTime) {
    noLoop();
  }
}

function drawPetal(angle) {
  push();
  rotate(angle);
  
  let nPoints = 100;
  let maxSize = 375;
  let maxNoise = 0.05;
  let nInflections = 2;
  
  let dampedOscillation = maxSize * (1 - exp(-0.005 * t)) * sin(0.01 * t);
  let noiseFactor = map(t, 0, maxTime, maxNoise, 0);
  
  beginShape();
  for (let i = 0; i <= nPoints; i++) {
    let theta = map(i, 0, nPoints, 0, PI);
    let x = dampedOscillation * sin(theta);
    let y = -dampedOscillation * cos(theta);

    let inflectionA = map(sin(nInflections * theta), -1, 1, 1, 1.4);
    let inflectionB = map(cos(nInflections * theta + angle), -1, 1, 1, 1.4);
    let inflectionFactor = inflectionA * inflectionB;
    
    let nStretches = floor(random(0, 6));
    let noiseStrength = map(sin(nStretches * theta), -1, 1, 0, noiseFactor);
    let noisyRadius = dampedOscillation * inflectionFactor * (1 + noiseStrength);

    x = noisyRadius * sin(theta) * 0.75;
    y = -noisyRadius * cos(theta) * 0.75;

    vertex(x, y);
  }
  endShape(CLOSE);
  
  pop();
}
