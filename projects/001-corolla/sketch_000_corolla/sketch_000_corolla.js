let t = 0;
let dt = 0.01;
let n = 5; // Number of petals

function setup() {
  createCanvas(600, 600);
  background(240, 234, 214);
}

function draw() {
  background(240, 234, 214);
  translate(width / 2, height / 2);

  for (let theta = 0; theta < TWO_PI; theta += TWO_PI / 360) {
    let r = A(t) * (1 + B(t) * cos(n * theta));
    let { x, y } = polarToCartesian(r, theta);
    stroke(255, 0, 0);
    point(x, y);
  }

  t += dt;
}

function A(t) {
  // Modify this function to control the size of the petals
  return 100 + 30 * sin(t);
}

function B(t) {
  // Modify this function to control the shape of the petals
  return 0.2 * cos(t);
}

function polarToCartesian(r, theta) {
  let x = r * cos(theta);
  let y = r * sin(theta);
  return { x, y };
}
