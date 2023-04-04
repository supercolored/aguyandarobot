class GenesisAnimation {
  constructor() {}
  onKeyPress(note, velocity, color) {}
  onKeyRelease(note, velocity) {}
  update() {}
}

const GENESIS_NOTE_MAP = (() => {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  let noteMap = {};
  for (let i = 0; i < 128; i++) {
    let octave = Math.floor(i / 12) - 1;
    let noteName = noteNames[i % 12];
    noteMap[i] = noteName + octave;
  }
  return noteMap;
})();
