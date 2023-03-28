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

  generateRainbowColors();
}

function draw() {
  background(255);
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

  // A note-on message will have a command value of 9
  if (command === 9) {
    console.log("Note:", data1);
    changeBackgroundColor(data1);
  }
}

function changeBackgroundColor(pitch) {
  let index = pitch - lowestMidiNote;
  if (index >= 0 && index < numKeys) {
    background(rainbowColors[index]);
    redraw();
  }
}

function generateRainbowColors() {
  let baseColors = [
    color(255, 0, 0),      // Red
    color(255, 127, 0),    // Orange
    color(255, 255, 0),    // Yellow
    color(0, 255, 0),      // Green
    color(0, 0, 255),      // Blue
    color(75, 0, 130),     // Indigo
    color(148, 0, 211)     // Violet
  ];

  rainbowColors = [];

  for (let i = 0; i < baseColors.length - 1; i++) {
    let numInterpolations = numKeys / (baseColors.length - 1);
    for (let j = 0; j < numInterpolations; j++) {
      let t = j / numInterpolations;
      let interpolatedColor = lerpColor(baseColors[i], baseColors[i + 1], t);
      rainbowColors.push(interpolatedColor);
    }
  }
}
