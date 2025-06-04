const sketch2 = (p) => {
  let lightWaves = [];
  let particles = [];
  let jellyfish = [];
  let bubbles = [];
  let canvas;

  let lastMouseX = null;
  let lastMouseY = null;
  let mouseStillFrames = 0;

  // Таймер для создания пузырьков
  let nextBubbleTime = 0;

  // Максимальное количество пузырьков одновременно
  const maxBubbles = 30;

  p.setup = () => {
    const parent = document.getElementById('section2');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas = p.createCanvas(w, h);
    canvas.parent('section2');
    p.noStroke();
    p.frameRate(60);

    for (let i = 0; i < 15; i++) {
      lightWaves.push(new LightWave(i * (p.height / 15)));
    }

    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 6; i++) {
      jellyfish.push(new Jellyfish(p.random(p.width), p.random(p.height)));
    }

    nextBubbleTime = p.millis() + p.random(100, 1000);
  };

  p.draw = () => {
    setGradientBackground();

    for (let wave of lightWaves) wave.update(), wave.show();
    for (let particle of particles) particle.update(), particle.show();
    for (let j of jellyfish) j.update(), j.show();

    handleBubbles();

    drawTitleAndParagraph();
  };

  function handleBubbles() {
    const now = p.millis();

    if (now > nextBubbleTime && bubbles.length < maxBubbles) {
      bubbles.push(new Bubble(p.mouseX + p.random(-5, 5), p.mouseY + p.random(-5, 5)));
      nextBubbleTime = now + p.random(50, 500);
    }

    lastMouseX = p.mouseX;
    lastMouseY = p.mouseY;

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.update();
      b.show();
      if (b.pos.y + b.size < 0) {
        bubbles.splice(i, 1);
      }
    }
  }

  function setGradientBackground() {
    for (let y = 0; y < p.height; y++) {
      let inter = p.map(y, 0, p.height, 0, 1);
      let top = p.color(10, 50, 70);
      let bottom = p.color(0, 100, 140);
      let c = p.lerpColor(top, bottom, inter);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }
  }

  function drawTitleAndParagraph() {
    const leftMargin = 200;
    const maxWidth = 600;

    const title = "Photic zone";
    const description = `Photic Zone is the upper layer of the ocean, extending down to about 200 meters where sunlight penetrates enough for photosynthesis. It’s a bright, vibrant environment teeming with marine life such as fish, corals, and jellyfish. This zone supports most of the ocean’s plant and animal life and plays a crucial role in the Earth’s oxygen production and carbon cycle.
`;

    // Заголовок
    const titleSize = 100;
    p.textFont('Quicksand');
    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(titleSize);
    p.textLeading(1 * titleSize);
    p.text(title, leftMargin, 100);

    const descSize = 20;
    p.textSize(descSize);
    p.textLeading(1.4 * descSize);

    const descMaxWidth = maxWidth;

    const approxLines = 7;
    const lineHeight = 1.4 * descSize;
    const descHeight = approxLines * lineHeight;

    const descX = p.width - 200 - descMaxWidth;
    const descY = p.height - 200 - descHeight;

    p.textAlign(p.LEFT, p.TOP);
    p.text(description, descX, descY, descMaxWidth);
  }

  class LightWave {
    constructor(yOffset) {
      this.yOffset = yOffset;
      this.points = [];
      this.speed = p.random(0.0003, 0.0005);
      this.alpha = p.random(20, 60);
      this.weight = p.random(1, 2);
      this.phase = p.random(p.TWO_PI);

      let step = 30;
      for (let x = -step; x <= p.width + step; x += step) {
        this.points.push(p.createVector(x, yOffset));
      }
    }

    update() {
      let t = p.frameCount * this.speed * 60 + this.phase;
      for (let i = 0; i < this.points.length; i++) {
        let pt = this.points[i];
        let xNorm = p.map(i, 0, this.points.length - 1, 0, p.TWO_PI);
        let amp = 30;
        pt.y = this.yOffset + p.sin(xNorm + t) * amp;
      }
    }

    show() {
      p.noFill();
      p.stroke(180, 230, 255, this.alpha);
      p.strokeWeight(this.weight);

      p.beginShape();
      p.curveVertex(this.points[0].x, this.points[0].y);
      for (let pt of this.points) p.curveVertex(pt.x, pt.y);
      p.curveVertex(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
      p.endShape();
    }
  }

  class Particle {
    constructor() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.size = p.random(1, 3);
      this.alpha = p.random(50, 120);
      this.speed = p5.Vector.random2D().mult(p.random(0.2, 0.5));
    }

    update() {
      this.pos.add(this.speed);
      this.alpha += p.sin(p.frameCount * 0.05 + this.pos.x * 0.1) * 2;
      this.alpha = p.constrain(this.alpha, 40, 120);

      if (this.pos.x > p.width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = p.height;
    }

    show() {
      p.noStroke();
      p.fill(200, 220, 255, this.alpha);
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }

  class Jellyfish {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.size = p.random(30, 50);
      this.speed = p.random(0.2, 0.5);
      this.phase = p.random(p.TWO_PI);
      this.alpha = p.random(80, 150);
    }

    update() {
      this.pos.y -= this.speed;
      if (this.pos.y < -this.size) this.pos.y = p.height + this.size;
      this.pos.x += p.sin(p.frameCount * 0.02 + this.phase) * 0.5;
      this.phase += 0.02;
    }

    show() {
      p.push();
      p.translate(this.pos.x, this.pos.y);
      let pulse = 1 + 0.1 * p.sin(p.frameCount * 0.1 + this.phase);
      p.scale(pulse);

      p.noStroke();
      p.fill(180, 200, 255, this.alpha);
      p.ellipse(0, 0, this.size, this.size * 0.6);

      p.stroke(180, 200, 255, this.alpha * 0.53);
      p.strokeWeight(2);
      p.noFill();
      for (let i = -2; i <= 2; i++) {
        let xOff = i * (this.size / 8);
        p.beginShape();
        for (let y = 0; y < this.size * 1.5; y += 3) {
          let x = xOff + p.sin(p.frameCount * 0.08 + y * 0.1 + i) * 3;
          p.vertex(x, y);
        }
        p.endShape();
      }

      p.pop();
    }
  }

  class Bubble {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-0.3, 0.3), p.random(-1, -2));
      this.alpha = 20;
      this.size = p.random(8, 25);
    }

    update() {
      this.pos.add(this.vel);
    }

    show() {
      p.noStroke();
      p.fill(255, 255, 255, this.alpha);
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }
};

new p5(sketch2, 'section2');
