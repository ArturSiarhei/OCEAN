const sketch4 = (p) => {
  let particles = [];
  let fireflies = [];
  let bubbles = [];
  const maxBubbles = 30;
  let nextBubbleTime = 0;
  let canvas;
  
  let jellyfishes = [];

  p.setup = () => {
    const parent = document.getElementById('section4');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas = p.createCanvas(w, h);
    canvas.parent('section4');

    p.frameRate(60);

    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 60; i++) {
      fireflies.push(new Firefly(p.random(2, 1)));
    }

    for (let i = 0; i < 20; i++) {
      jellyfishes.push(new Jellyfish(p.random(w), p.random(h)));
    }

    nextBubbleTime = p.millis() + p.random(300, 3000);
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

    for (let j of jellyfishes) {
      j.move();
      j.display();
    }

    handleBubbles();

    const leftMargin = 200;
    const maxWidth = 600;

    const title = "Bathypelagic\nzone";
    const description = `Bathypelagic Zone is the deep ocean layer between 1000 and 4000 meters. It is pitch dark, with high pressure and low temperatures. Inhabitants are rare and mysterious, many with bioluminescent features, such as the anglerfish and giant squid. This zone plays an important role in deep-sea ecosystems, supporting life in the ocean’s depths.`;

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

    // Координаты описания:
    const descX = p.width - 200 - descMaxWidth;
    const descY = p.height - 200 - descHeight;

    p.textAlign(p.LEFT, p.TOP);
    p.text(description, descX, descY, descMaxWidth);
  };

  p.windowResized = () => {
    const parent = document.getElementById('section4');
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    p.resizeCanvas(w, h);
  };

  function setGradientBackground() {
    let ctx = p.drawingContext;
    let gradient = ctx.createLinearGradient(0, 0, 0, p.height);
    gradient.addColorStop(0, '#0A1E3C');
    gradient.addColorStop(1, '#061224');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, p.width, p.height);
  }

  function drawCursorGlow() {
    const radius = 300;
    const gradient = p.drawingContext.createRadialGradient(
      p.mouseX, p.mouseY, 0,
      p.mouseX, p.mouseY, radius
    );
    gradient.addColorStop(0, 'rgba(6, 30, 67, 1.5)');
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

  class Jellyfish {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = p.random(20, 40);
      this.speed = p.random(0.3, 1);
      this.offset = p.random(p.TWO_PI);
      this.alpha = p.random(40, 40);
    }

    move() {
      this.y -= this.speed;
      if (this.y + this.size < 0) {
        this.y = p.height + this.size;
        this.x = p.random(p.width);
      }
    }

    display() {
      p.noStroke();
      for (let i = 10; i > 0; i--) {
        p.fill(100, 200, 255, (this.alpha / i) * 0.2);
        p.ellipse(this.x, this.y, this.size + i * 8);
      }
      p.fill(150, 220, 255, this.alpha);
      p.ellipse(this.x, this.y, this.size);

      p.stroke(150, 220, 255, this.alpha * 0.6);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < 5; i++) {
        let xOff = p.sin(p.frameCount * 0.1 + i + this.offset) * 10;
        p.vertex(this.x + xOff + i * 5 - 10, this.y + this.size / 2 + i * 10);
      }
      p.endShape();
    }
  }
};

new p5(sketch4, 'section4');
