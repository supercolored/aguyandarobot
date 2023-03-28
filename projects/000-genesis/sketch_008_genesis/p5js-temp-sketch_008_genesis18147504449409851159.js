let numKeys = 88;
let lowestMidiNote = 21;
let highestMidiNote = 108;
let rainbowColors;

function setup() {
  createCanvas(800, 600);
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API is not supported in your browser.");
  }

  rainbowColors = [
    color(255, 0, 0),      // Red
    color(255, 127, 0),    // Orange
    color(255, 255, 0),    // Yellow
    color(0, 255, 0),      // Green
    color(0, 0, 255),      // Blue
    color(75, 0, 130),     // Indigo
    color(148, 0, 211)     // Violet
  ];
}

function draw() {
  background(255);
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

  // A note-on message will have a command value of 9
  if (command === 9) {
    console.log("Note:", data1);
    drawVerticalBar(data1);
  }
}

function drawVerticalBar(pitch) {
  let index = pitch - lowestMidiNote;
  if (index >= 0 && index < numKeys) {
    let colorPos = map(index, 0, numKeys - 1, 0, rainbowColors.length - 1);
    let firstColorIndex = floor(colorPos);
    let secondColorIndex = min(ceil(colorPos), rainbowColors.length - 1);
    let noteColor = lerpColor(rainbowColors[firstColorIndex], rainbowColors[secondColorIndex], colorPos % 1);
    let barWidth = width / numKeys;
    let x = map(index, 0, numKeys - 1, 0, width - barWidth);

    fill(noteColor);
    noStroke();
    rect(x, 0, barWidth, height);
    redraw();
  }
}
