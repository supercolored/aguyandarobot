function setup() {
  createCanvas(400, 400);
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API is not supported in your browser.");
  }
}

function draw() {
  background(220);
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
  }
}
