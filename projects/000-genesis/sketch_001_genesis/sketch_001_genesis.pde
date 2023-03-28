import themidibus.*;
import themidibus.MidiListener;
import themidibus.Note;
import themidibus.Controller;

MidiBus myBus;
int numKeys = 88;
int lowestMidiNote = 21;
int highestMidiNote = 108;
color[] colors = new color[numKeys];

void setup() {
  size(800, 600);
  MidiBus.list();
  myBus = new MidiBus(this, 1, -1); // Connect to the MIDI device
  myBus.addMidiListener(new MyMidiListener());
  generateColorMap();
}

void draw() {
  // The screen will be updated in the noteOn() function
  noLoop();
}

void generateColorMap() {
  for (int i = 0; i < numKeys; i++) {
    float colorPos = map(i, 0, numKeys - 1, 0, 1);
    colors[i] = lerpColor(color(255, 0, 0), color(148, 0, 211), colorPos); // Red to Violet
  }
}

class MyMidiListener implements MidiListener {
  void noteOn(int channel, int pitch, int velocity) {
    int index = pitch - lowestMidiNote;
    if (index >= 0 && index < numKeys) {
      color noteColor = colors[index];
      drawVerticalBar(noteColor);
    }
  }

  void noteOff(int channel, int pitch, int velocity) {
    // Handle note-off events if needed
  }

  // Handle other MIDI events
  void controllerChange(int channel, int number, int value) {}
  void noteOn(Note note) {}
  void noteOff(Note note) {}
  void controllerChange(Controller controller) {}
}

void drawVerticalBar(color noteColor) {
  int barWidth = width / numKeys;
  int x = int(map(red(noteColor), 0, 255, 0, width - barWidth));
  fill(noteColor);
  rect(x, 0, barWidth, height);
}
