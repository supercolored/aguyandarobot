let numKeys = 88;
let lowestMidiNote = 21;
let highestMidiNote = 108;

function setup() {
  createCanvas(800, 600);
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API is not supported in your browser.");
  }
}

function draw() {
  // The background will be updated in the onMIDIMessage() function
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
    drawVerticalBar(data1);
  }
}

function drawVerticalBar(pitch) {
  let index = pitch - lowestMidiNote;
  if (index >= 0 && index < numKeys) {
    let colorPos = map(index, 0, numKeys - 1, 0, 1);
    let noteColor = lerpColor(color(255, 0, 0), color(148, 0, 211), colorPos);
    let barWidth = width / numKeys;
    let x = map(index, 0, numKeys - 1, 0, width - barWidth);

    fill(noteColor);
    noStroke();
    rect(x, 0, barWidth, height);
    redraw();
  }
}
