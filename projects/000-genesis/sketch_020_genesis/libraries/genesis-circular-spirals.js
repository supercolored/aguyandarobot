class CircularSpiralAnimation extends Animation {
    constructor() {
      super();
      this.numKeys = 88;
      this.lowestMidiNote = 21;
      this.highestMidiNote = 108;
      this.keyColors = [
        color(255, 0, 0), // Red
        color(255, 127, 0), // Orange
        color(255, 255, 0), // Yellow
        color(0, 255, 0), // Green
        color(0, 0, 255), // Blue
        color(75, 0, 130), // Indigo
        color(148, 0, 211), // Violet
      ];
      this.angle = 0;
      this.circlePositions = [];
    }
  
    setup() {
      // Code specific to CircularSpiralAnimation setup (if any) can be added here
    }
  
    update() {
      if (this.hasFadingCircles()) {
        this.updateCircles();
      }
    }

    onKeyPress(note, velocity, color) {
      //console.log(note);
      this.drawCircle(note);
    }

    onKeyRelease(note, velocity) {
      this.clearCircle(note);
    }
  
    clearCircle(pitch) {
      let position = this.circlePositions[pitch];
      if (position) {
        position.fadeStartTime = millis();
        position.isFading = true;
      }
    }
  
    drawCircle(pitch) {
      let index = pitch - this.lowestMidiNote;
      if (index >= 0 && index < this.numKeys) {
        let colorPos = map(index, 0, this.numKeys - 1, 0, this.keyColors.length - 1);
        let keyColorIndex1 = int(colorPos);
        let keyColorIndex2 = min(keyColorIndex1 + 1, this.keyColors.length - 1);
        let lerpAmt = colorPos - keyColorIndex1;
    
        let noteColor = lerpColor(this.keyColors[keyColorIndex1], this.keyColors[keyColorIndex2], lerpAmt);
    
        // Calculate the circle's position using sine and cosine functions
        let radius = map(index, 0, this.numKeys - 1, 0, min(width, height) / 2);
        let x = width / 2 + radius * cos(this.angle);
        let y = height / 2 + radius * sin(this.angle);
    
        // Increment the this.angle for the next circle
        this.angle += radians(10);
    
        // Save the circle's position
        this.circlePositions[pitch] = { x: x, y: y, color: noteColor, isFading: false };
    
        fill(noteColor);
        noStroke();
        ellipse(x, y, 50, 50);
        redraw();
      }
    }
  
    updateCircles() {
      background(0);
      for (let pitch in this.circlePositions) {
        let position = this.circlePositions[pitch];
        if (position.isFading) {
          let elapsed = millis() - position.fadeStartTime;
          let fadeDuration = 1000; // 1 second

          if (elapsed >= fadeDuration) {
            // The circle has fully faded, remove it
            delete this.circlePositions[pitch];
          } else {
            // Update the circle's opacity
            let alpha = map(elapsed, 0, fadeDuration, 255, 0);
            let fadedColor = color(red(position.color), green(position.color), blue(position.color), alpha);

            // Calculate the new radius
            let newRadius = map(elapsed, 0, fadeDuration, 50, 10);

            // Calculate the falling distance with easing
            let easing = 0.5 * pow(elapsed / fadeDuration, 2);
            let newY = position.y + (height - position.y) * easing;

            fill(fadedColor);
            noStroke();
            ellipse(position.x, newY, newRadius, newRadius);
          }
        } else {
          // If the circle is not fading, draw it with the original color
          fill(position.color);
          noStroke();
          ellipse(position.x, position.y, 50, 50);
        }
      }
    }
  
    hasFadingCircles() {
      for (let pitch in this.circlePositions) {
        if (this.circlePositions[pitch].isFading) {
          return true;
        }
      }
      return false;
    }
  }
  