let numKeys = 88;
let lowestMidiNote = 21;
let highestMidiNote = 108;
let keyColors;
let angle = 0;
let circlePositions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  keyColors = [
    color(255, 0, 0),      // Red
    color(255, 127, 0),    // Orange
    color(255, 255, 0),    // Yellow
    color(0, 255, 0),      // Green
    color(0, 0, 255),      // Blue
    color(75, 0, 130),     // Indigo
    color(148, 0, 211)     // Violet
  ];
  
  background(240, 234, 214); // Eggshell color

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API is not supported in your browser.");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (hasFadingCircles()) {
    updateCircles();
  }
}

function onMIDISuccess(midiAccess) {
  console.log("MIDI Access Object", midiAccess);
  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = onMIDIMessage;
  }
}

function onMIDIFailure() {
  console.log("Could not access your MIDI devices.");
}

function onMIDIMessage(message) {
  let command = message.data[0] >> 4;
  let channel = message.data[0] & 0xf;
  let data1 = message.data[1];
  let data2 = message.data[2];

  // Note-on message
  if (command === 9 && data2 > 0) {
    console.log("Note:", data1);
    drawCircle(data1);
  }

  // Note-off message or note-on with zero velocity
  if (command === 8 || (command === 9 && data2 === 0)) {
    console.log("Note off:", data1);
    clearCircle(data1);
  }
}

function clearCircle(pitch) {
  let position = circlePositions[pitch];
  if (position) {
    position.fadeStartTime = millis();
    position.isFading = true;
  }
}

function drawCircle(pitch) {
  let index = pitch - lowestMidiNote;
  if (index >= 0 && index < numKeys) {
    let colorPos = map(index, 0, numKeys - 1, 0, keyColors.length - 1);
    let keyColorIndex1 = int(colorPos);
    let keyColorIndex2 = min(keyColorIndex1 + 1, keyColors.length - 1);
    let lerpAmt = colorPos - keyColorIndex1;

    let noteColor = lerpColor(keyColors[keyColorIndex1], keyColors[keyColorIndex2], lerpAmt);

    // Calculate the circle's position using sine and cosine functions
    let radius = map(index, 0, numKeys - 1, 0, min(width, height) / 2);
    let x = width / 2 + radius * cos(angle);
    let y = height / 2 + radius * sin(angle);

    // Increment the angle for the next circle
    angle += radians(10);

    // Save the circle's position
    circlePositions[pitch] = { x: x, y: y, color: noteColor, isFading: false };


    fill(noteColor);
    noStroke();
    ellipse(x, y, 50, 50);
    redraw();
  }
}

function updateCircles() {
  background(240, 234, 214); // Eggshell color
  for (let pitch in circlePositions) {
    let position = circlePositions[pitch];
    if (position.isFading) {
      let elapsed = millis() - position.fadeStartTime;
      let fadeDuration = 1000; // 1 second

      if (elapsed >= fadeDuration) {
        // The circle has fully faded, remove it
        delete circlePositions[pitch];
      } else {
        // Update the circle's opacity
        let alpha = map(elapsed, 0, fadeDuration, 255, 0);
        let fadedColor = color(red(position.color), green(position.color), blue(position.color), alpha);

        // Calculate the new radius
        let newRadius = map(elapsed, 0, fadeDuration, 50, 10);

        fill(fadedColor);
        noStroke();
        ellipse(position.x, position.y, newRadius, newRadius);
      }
    } else {
      // If the circle is not fading, draw it with the original color
      fill(position.color);
      noStroke();
      ellipse(position.x, position.y, 50, 50);
    }
  }
}

function hasFadingCircles() {
  for (let pitch in circlePositions) {
    if (circlePositions[pitch].isFading) {
      return true;
    }
  }
  return false;
}
