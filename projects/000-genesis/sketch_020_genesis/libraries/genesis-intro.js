let animation;
let appState = "intro";

let animations = [
  { source: "vertical-bar.js", name: "VERTICAL BARS", class: VerticalBarAnimation },
  { source: "circular-spiral.js", name: "CIRCULAR SPIRALS", class: CircularSpiralAnimation },
];

let genesisText = "GENESIS";
let initialSpacing = 20;
let introElapsedTime = 0;
let introLetterTimes = new Array(genesisText.length).fill(0).map((_, i) => i * 161);
let introDuration = 10000;
let introComplete = false;
let introFadeSpeed = 300;
let animationOptionsDelay = 1618; // Time in milliseconds

function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}

function introSetup() {
  // Setup variables and initialize p5.Typewriter library (if needed)
}

function introUpdate() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  noStroke();

  let progress = introElapsedTime / introDuration;
  let easedProgress = easeOutQuint(progress);
  let letterSpacing = map(easedProgress, 0, 1, 0, 20);

  // Draw the "GENESIS" text
  for (let i = 0; i < genesisText.length; i++) {
    let opacity = 0;
    let letterTime = millis() - introLetterTimes[i];
    if (letterTime >= 0) {
      opacity = map(letterTime, 0, introFadeSpeed, 0, 255); // Updated fade-in speed
    }
    fill(255, opacity);
    let x = width / 2 - (genesisText.length * (letterSpacing + initialSpacing)) / 2 + i * (letterSpacing + initialSpacing);
    text(genesisText[i], x, height / 2 - 50);
  }

  introElapsedTime += deltaTime;
  if (introElapsedTime >= introDuration && !introComplete) {
    introComplete = true;
  }

  if (introComplete || introElapsedTime > animationOptionsDelay) {
    introDrawAnimationOptions();
  }
}

function introFadeOut() {
  let fadeOutStartTime = millis();
  let fadeOutDuration = 1000;
  let fadeOutInterval = setInterval(() => {
    let fadeOutElapsedTime = millis() - fadeOutStartTime;
    let fadeOutRatio = map(fadeOutElapsedTime, 0, fadeOutDuration, 1, 0);
    background(0, 255 * fadeOutRatio);
    if (fadeOutElapsedTime >= fadeOutDuration) {
      clearInterval(fadeOutInterval);
    }
  }, 16);
}

function showAnimationOptions() {
  animations.forEach((animation, index) => {
    let y = height / 2 + 100 + 30 * index;
    fill(255);
    text(animation.name, width / 2, y);
  });
}

function introDrawAnimationOptions() {
  textAlign(CENTER, CENTER);
  textSize(12);
  noStroke();

  animations.forEach((animation, index) => {
    let y = height / 2 + 100 + 30 * index;
    fill(255);
    text(animation.name, width / 2, y);

    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > y - 12 && mouseY < y + 12) {
      fill(255, 50);
      rect(width / 2, y, 200, 24);
    }
  });
}

function introMouseClicked() {
  animations.forEach((animation, index) => {
    let y = height / 2 + 100 + 30 * index;
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > y - 12 && mouseY < y + 12) {
      handleAnimationSelection(animation.name);
    }
  });
}

function handleAnimationSelection(name) {
  if(animations.find(animation => animation.name === name) === undefined) {
    console.error(`Animation "${name}" not found.`);
    return;
  }

  let selection = animations.find(animation => animation.name === name);

  animation = new selection.class();

  introFadeOut();
  appState = "main";
}
