let activeNotes = new Map();

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupMIDI();
  introSetup();
  // animation = new VerticalBarAnimation();
}

function draw() {
  if (appState === "intro") {
    introUpdate();
  } else {
    background(0);
    animation.update();
  }
}

function mouseClicked() {
  if (appState === "intro") {
    introMouseClicked();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function triggerAnimation(note, velocity, keyPressed) {
  let color = getColorFromNoteAndVelocity(note, velocity);
  console.log(GENESIS_NOTE_MAP[note], color.levels);
  if (keyPressed) {
    animation.onKeyPress(note, velocity, color);
  } else {
    animation.onKeyRelease(note, velocity);
  }
}

function getColorFromNoteAndVelocity(note, velocity) {
  let hue = map(note, 21, 108, 0, 330); // MIDI range: 21 (A0) to 108 (C8)
  let brightness = map(velocity, 0, 127, 30, 100); // MIDI velocity range: 0 to 127
  colorMode(HSB, 360, 100, 100); // Set color mode to HSB
  let noteColor = color(hue, 100, brightness);
  colorMode(RGB, 255); // Reset color mode to RGB
  return noteColor;
}

function setupMIDI() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API not supported");
  }
}

function onMIDISuccess(midiAccess) {
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = onMIDIMessage;
  }
}

function onMIDIFailure() {
  console.log("Failed to get MIDI access");
}

function onMIDIMessage(event) {
  let command = event.data[0] >> 4;
  let note = event.data[1];
  let velocity = event.data[2];

  if (command === 0x09 && velocity > 0) { // Note on
    activeNotes.set(note, velocity);
    triggerAnimation(note, velocity, true);
  } else if (command === 0x08 || (command === 0x09 && velocity === 0)) { // Note off
    activeNotes.delete(note);
    triggerAnimation(note, velocity, false);
  }
}
