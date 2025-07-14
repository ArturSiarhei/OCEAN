const sketch5 = (p) => {
  let particles = [];
  let fireflies = [];
  let bubbles = [];
  const maxBubbles = 30;
  let nextBubbleTime = 0;
  let canvas;

  let squid1, squid2;

  p.setup = () => {
    const parent = document.getElementById('section5');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas = p.createCanvas(w, h);
    canvas.parent('section5');

    p.frameRate(60);

    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 60; i++) {
      fireflies.push(new Firefly(p.random(2, 1)));
    }

    nextBubbleTime = p.millis() + p.random(300, 3000);

    squid1 = new GiantSquid(w * 0.3, h * 0.7, 1);
    squid2 = new GiantSquid(w * 0.7, h * 0.3, -1);
  };

  p.draw = () => {
    setGradientBackground();

    drawCursorGlow();

    for (let ptl of particles) {
      ptl.update();
      ptl.show();
    }

    for (let ff of fireflies) {
      ff.update();
      ff.show();
    }

    handleBubbles();

    squid1.update();
    squid1.show();
    squid2.update();
    squid2.show();

    if (p.abs(squid1.pos.x - squid2.pos.x) < 150) {
      if (squid1.pos.y < squid2.pos.y) {
        squid1.pos.y -= 0.5;
        squid2.pos.y += 0.5;
      } else {
        squid1.pos.y += 0.5;
        squid2.pos.y -= 0.5;
      }
    }

    const titleX = p.width - 800;
    const titleY = 100;
    const title = "Abyssopelagic\nzone";

    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(100);
    p.textFont('Quicksand');
    p.textLeading(1 * 100);
    p.text(title, titleX, titleY);

    const description = `Abyssopelagic Zone lies between 4000 and 6000 meters deep. It is pitch dark, near freezing, and under immense pressure. Life here is sparse and adapted to extreme conditions, with strange and rarely seen creatures like sea spiders and deep-sea dwarfs. This zone remains one of the least explored parts of the ocean, holding many mysteries about deep-sea life and geology.`;

    const blockX = 200;
    const blockY = p.height - 200;
    const blockWidth = 600;
    const descSize = 20;

    p.textSize(descSize);
    p.textFont('Quicksand');
    p.textLeading(1.4 * descSize);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(description, blockX, blockY - p.textAscent(), blockWidth);
  };

  p.windowResized = () => {
    const parent = document.getElementById('section5');
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    p.resizeCanvas(w, h);

    squid1.pos.x = p.constrain(squid1.pos.x, 0, w);
    squid1.pos.y = p.constrain(squid1.pos.y, 0, h);
    squid2.pos.x = p.constrain(squid2.pos.x, 0, w);
    squid2.pos.y = p.constrain(squid2.pos.y, 0, h);
  };

  function setGradientBackground() {
    let ctx = p.drawingContext;
    let gradient = ctx.createLinearGradient(0, 0, 0, p.height);
    gradient.addColorStop(0, '#061224');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, p.width, p.height);
  }

  function drawCursorGlow() {
    const radius = 400;
    const gradient = p.drawingContext.createRadialGradient(
      p.mouseX, p.mouseY, 0,
      p.mouseX, p.mouseY, radius
    );
    gradient.addColorStop(0, 'rgba(24, 36, 56, 0.5)');
    gradient.addColorStop(1, 'rgba(6, 30, 67, 0)');

    p.drawingContext.fillStyle = gradient;
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
  }

  function handleBubbles() {
    const now = p.millis();

    if (now > nextBubbleTime && bubbles.length < maxBubbles) {
      let x = p.mouseX || p.width / 2;
      let y = p.mouseY || p.height / 2;
      bubbles.push(new Bubble(x + p.random(-5, 5), y + p.random(-5, 5)));
      nextBubbleTime = now + p.random(100, 1000);
    }

    for (let i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].update();
      bubbles[i].show();

      if (bubbles[i].pos.y + bubbles[i].size < 0) {
        bubbles.splice(i, 1);
      }
    }
  }

  class Particle {
    constructor() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p.createVector(p.random(-0.2, 0.2), p.random(-0.1, 0.1));
      this.size = p.random(1, 3);
      this.alpha = p.random(50, 150);
    }

    update() {
      this.pos.add(this.vel);
      this.pos.x += p.sin(p.frameCount * 0.01 + this.pos.y) * 0.2;
      this.pos.y += p.cos(p.frameCount * 0.01 + this.pos.x) * 0.1;

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

  class Firefly {
    constructor(size) {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.size = size;
      this.baseAlpha = 25;
      this.speed = p5.Vector.random2D().mult(p.random(0.1, 2));
      this.pulsePhase = p.random(p.TWO_PI);
    }

    update() {
      this.pos.add(this.speed);

      if (this.pos.x > p.width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = p.height;
    }

    show() {
      const mouse = p.createVector(p.mouseX, p.mouseY);
      const d = p.dist(this.pos.x, this.pos.y, mouse.x, mouse.y);

      const maxDist = 400;
      let brightnessFactor = p.constrain(1 - d / maxDist, 0, 1);
      brightnessFactor = p.pow(brightnessFactor, 2);

      const dynamicAlpha = this.baseAlpha + brightnessFactor * 230;
      const glowAlpha = brightnessFactor * 200;

      p.noStroke();
      p.fill(255, 255, 180, dynamicAlpha);
      p.ellipse(this.pos.x, this.pos.y, this.size);

      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = p.color(255, 255, 200, glowAlpha);
      p.ellipse(this.pos.x, this.pos.y, this.size + 8);
      p.drawingContext.shadowBlur = 0;
    }
  }

  class Bubble {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-0.3, 0.3), p.random(-1, -2));
      this.alpha = 50;
      this.size = p.random(3, 8);
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

  class GiantSquid {
    constructor(x, y, direction = 1) {
      this.pos = p.createVector(x, y);
      this.bodyLength = 200;
      this.bodyWidth = 80;
      this.tentacleCount = 8;
      this.tentacleLength = 220;
      this.tentacles = [];
      this.direction = direction;
      this.speed = 0.3;

      for (let i = 0; i < this.tentacleCount; i++) {
        this.tentacles.push({
          angleOffset: p.map(i, 0, this.tentacleCount - 1, -p.PI / 4, p.PI / 4),
          phase: p.random(p.TWO_PI),
        });
      }
    }

    update() {
      for (let t of this.tentacles) {
        t.phase += 0.015;
      }

      this.pos.x += this.speed * this.direction;

      if (this.pos.x > p.width - this.bodyWidth / 2) this.direction = -1;
      if (this.pos.x < this.bodyWidth / 2) this.direction = 1;
    }

    show() {
      p.push();
      p.translate(this.pos.x, this.pos.y);

      p.noStroke();
      p.fill('#000000');
      p.ellipse(0, 0, this.bodyWidth, this.bodyLength);

      p.fill('#000000');
      p.ellipse(0, -this.bodyLength / 2.5, this.bodyWidth * 0.8, this.bodyWidth * 0.8);

      p.fill('#090909');
      p.ellipse(-this.bodyWidth * 0.25, -this.bodyLength / 2.5 - 5, 15, 20);
      p.ellipse(this.bodyWidth * 0.25, -this.bodyLength / 2.5 - 5, 15, 20);

      p.stroke('#000000');
      p.strokeWeight(15);
      p.noFill();

      p.push();
      p.translate(0, this.bodyLength / 2);
      for (let i = 0; i < this.tentacleCount; i++) {
        let t = this.tentacles[i];
        p.push();
        p.rotate(t.angleOffset);

        p.beginShape();
        for (let j = 0; j <= 40; j++) {
          let tNorm = j / 40;
          let wave = p.sin(t.phase + tNorm * p.TWO_PI * 2) * 10 * (1 - tNorm);
          let x = wave;
          let y = tNorm * this.tentacleLength;
          p.curveVertex(x, y);
        }
        p.endShape();

        p.pop();
      }
      p.pop();

      p.pop();
    }
  }
};

new p5(sketch5, 'section5');
