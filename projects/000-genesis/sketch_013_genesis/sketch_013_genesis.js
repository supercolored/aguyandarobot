let numKeys = 88;
let lowestMidiNote = 21;
let highestMidiNote = 108;
let keyColors;

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
  background(240, 234, 214); // Eggshell color
  noLoop();
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
    drawVerticalBar(data1);
  }

  // Note-off message or note-on with zero velocity
  if (command === 8 || (command === 9 && data2 === 0)) {
    clearVerticalBar(data1);
  }
}

function drawVerticalBar(pitch) {
  let index = pitch - lowestMidiNote;
  if (index >= 0 && index < numKeys) {
    let colorPos = map(index, 0, numKeys - 1, 0, keyColors.length - 1);
    let keyColorIndex1 = int(colorPos);
    let keyColorIndex2 = min(keyColorIndex1 + 1, keyColors.length - 1);
    let lerpAmt = colorPos - keyColorIndex1;

    let noteColor = lerpColor(keyColors[keyColorIndex1], keyColors[keyColorIndex2], lerpAmt);
    let barWidth = width / numKeys;
    let x = map(index, 0, numKeys - 1, 0, width - barWidth);

    fill(noteColor);
    noStroke();
    rect(x, 0, barWidth, height);
    redraw();
  }
}

function clearVerticalBar(pitch) {
  let index = pitch - lowestMidiNote;
  if (index >= 0 && index < numKeys) {
    let barWidth = width / numKeys;
    let x = map(index, 0, numKeys - 1, 0, width - barWidth);

    // Add padding to the left and right of the bar
    let padding = 1;
    x = max(x - padding, 0);

    fill(255);
    noStroke();
    rect(x, 0, barWidth + 2 * padding, height);
    redraw();
  }
}
