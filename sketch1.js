const sketch1 = (p) => {
  let seagulls = [];
  let canvas;

  p.setup = () => {
    const parent = document.getElementById('section1');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas = p.createCanvas(w, h);
    canvas.parent('section1');
    p.noStroke();
    p.frameRate(60);

    initSeagulls();
  };

  p.draw = () => {
    setSunsetGradient();

    for (let s of seagulls) {
      s.update();
      s.show();
    }

    const fontSize = p.width / 5;
    p.textSize(fontSize);
    p.textAlign(p.CENTER, p.BASELINE);
    p.fill(255, 200);
    p.noStroke();
    p.textFont('Quicksand');

    const centerX = p.width / 2;
    const centerY = p.height / 2;

    const textAscent = p.textAscent();
    const textDescent = p.textDescent();
    const textBottom = centerY + textDescent / 2;

    // Главный текст в центре
    p.text('OCEAN', centerX, textBottom);

    // Дополнительный текст "ZONES" у нижнего края
    const zonesFontSize = 40;
    p.textSize(zonesFontSize);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.fill(255);
    p.textFont('Quicksand');
    p.text('ZONES', centerX, p.height - 50);

    drawLineWaves(textBottom, p.height);
  };

  p.windowResized = () => {
    const parent = document.getElementById('section1');
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    p.resizeCanvas(w, h);
  };

  function setSunsetGradient() {
    for (let y = 0; y < p.height; y++) {
      let t = p.map(y, 0, p.height, 0, 1);

      let c1 = p.color('#FF6B95'); // розово-малиновый
      let c2 = p.color('#FFD496'); // оранжевый
      let c3 = p.color('#1C577A'); // тёмно-синий

      let c;
      if (t < 0.5) {
        c = p.lerpColor(c1, c2, t * 2);
      } else {
        c = p.lerpColor(c2, c3, (t - 0.5) * 2);
      }

      p.stroke(c);
      p.line(0, y, p.width, y);
    }
  }

  function drawLineWaves(startY, endY) {
    p.noFill();
    const time = p.millis() * 0.001;
    const waveFreq = 0.015;
    const xStep = 5;

    const mouseX = p.mouseX;
    const mouseY = p.mouseY;
    const influenceRadius = 300;

    for (let y = startY; y < endY;) {
      const tNorm = p.map(y, startY, endY, 0, 1);
      const ampBase = p.lerp(2, 48, tNorm);
      let spacing = p.lerp(4, 10, tNorm) * 3;

      p.beginShape();
      p.stroke(255, 180);
      for (let x = 0; x <= p.width; x += xStep) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = influenceRadius * influenceRadius;

        const influence = p.constrain(0.6 - distSq / maxDistSq, 0, 1);
        const ampFactor = p.lerp(1, 0, influence);

        const noiseFactor = p.noise(x * 0.005, y * 0.005, time * 0.3);
        const amp = ampBase * ampFactor;
        const phase = x * waveFreq + time + y * 0.05;
        const yOffset = Math.sin(phase) * amp * noiseFactor;

        p.vertex(x, y + yOffset);
      }
      p.endShape();

      y += spacing;
    }
  }

  function initSeagulls() {
    seagulls = [];
    for (let i = 0; i < 3; i++) {
      seagulls.push(new Seagull(i));
    }
  }

  class Seagull {
    constructor(type) {
      this.size = p.random(3, 5);
      this.baseX = p.random(p.width);
      this.baseY = p.random(p.height * 0.15, p.height * 0.3);
      this.speed = p.random(0.005, 0.01);
      this.wingSpeed = p.random(0.2, 0.4);
      this.wingAngle = 0;
      this.motionType = type % 3;
      this.timeOffset = p.random(1000);
    }

    update() {
      this.t = p.frameCount * this.speed + this.timeOffset;

      if (this.motionType === 0) {
        this.x = this.baseX + p.cos(this.t) * 30;
        this.y = this.baseY + p.sin(this.t) * 15;
      } else if (this.motionType === 1) {
        this.x = (this.baseX + (this.t * 30)) % p.width;
        this.y = this.baseY + p.sin(this.t * 2) * 10;
      } else {
        this.x = (this.baseX + this.t * 40) % p.width;
        this.y = this.baseY;
      }

      this.wingAngle = p.sin(p.frameCount * this.wingSpeed) * p.PI / 8;
    }

    show() {
      p.push();
      p.translate(this.x, this.y);
      p.scale(this.size);
      p.stroke(255);
      p.strokeWeight(0.5);
      p.noFill();

      p.beginShape();
      p.vertex(-2, 0);
      p.quadraticVertex(-1, -1 + this.wingAngle, 0, 0);
      p.quadraticVertex(1, -1 + this.wingAngle, 2, 0);
      p.endShape();
      p.pop();
    }
  }
};

new p5(sketch1, 'section1');
