let glowAlpha = 0;
let glowDirection = 1;

const sketch3 = (p) => {
  let particles = [];
  let fireflies = [];
  let eels = [];
  let bubbles = [];
  let fishies = [];
  const maxBubbles = 30;
  let nextBubbleTime = 0;
  let canvas;

  p.setup = () => {
    const parent = document.getElementById('section3');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas = p.createCanvas(w, h);
    canvas.parent('section3');

    p.frameRate(60);

    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 7; i++) {
      fireflies.push(new Firefly(p.random(3, 8)));
    }

    let eelPositionsX = [w * 0.2, w * 0.5, w * 0.8];
    let eelDirections = [1, 1, -1];
    for (let i = 0; i < 5; i++) {
      eels.push(new Eel(eelPositionsX[i], p.random(h), eelDirections[i]));
    }

    for (let i = 0; i < 5; i++) {
      fishies.push(new MesopelagicFish(p.random(w), p.random(h)));
    }

    nextBubbleTime = p.millis() + p.random(300, 3000);
  };

  p.draw = () => {
    setGradientBackground();

    for (let ptl of particles) {
      ptl.update();
      ptl.show();
    }

    for (let ff of fireflies) {
      ff.update();
      ff.show();
    }

    for (let eel of eels) {
      eel.update();
      eel.show();
    }

    for (let fish of fishies) {
      fish.update();
      fish.show();
    }

    handleBubbles();

    const textX = p.width - 800;
    const textY = 100;

    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(100);
    p.textFont('Quicksand');
    p.textLeading(100);
    p.text("Mesopelagic\nzone", textX, textY);

    const blockText = `Mesopelagic Zone, or twilight zone, extends from 200 to 1000 meters deep. Sunlight fades quickly, creating a dim environment where photosynthesis stops. Despite low light, many organisms use bioluminescence to hunt, communicate, or avoid predators. Common inhabitants include lanternfish, glowing jellyfish, and deep-sea squid. This zone is a key transition between surface and deep ocean, important for nutrient and carbon cycling.`;

    p.textSize(20);
    p.textFont('Quicksand');
    p.textLeading(28);
    p.textAlign(p.LEFT, p.BOTTOM);

    const blockX = 200;
    const blockY = p.height - 200;
    const blockWidth = 600;

    p.text(blockText, blockX, blockY - p.textAscent(), blockWidth);

    glowAlpha += glowDirection * 4;
    if (glowAlpha > 200) glowDirection = -1;
    if (glowAlpha < 80) glowDirection = 1;
  };

  p.windowResized = () => {
    const parent = document.getElementById('section3');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    p.resizeCanvas(w, h);

    let eelPositionsX = [w * 0.2, w * 0.5, w * 0.8];
    for (let i = 0; i < eels.length; i++) {
      eels[i].pos.x = eelPositionsX[i];
      eels[i].pos.y = p.random(h);
    }

    for (let fish of fishies) {
      fish.pos.x = p.random(w);
      fish.pos.y = p.random(h);
    }
  };

  function setGradientBackground() {
    let ctx = p.drawingContext;
    let gradient = ctx.createLinearGradient(0, 0, 0, p.height);
    gradient.addColorStop(0, '#0A3246');
    gradient.addColorStop(1, '#0A1E3C');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, p.width, p.height);
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
      this.wrap();
    }

    wrap() {
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
      this.alpha = p.random(100, 255);
      this.speed = p5.Vector.random2D().mult(p.random(0.1, 0.3));
      this.pulsePhase = p.random(p.TWO_PI);
    }

    update() {
      this.pos.add(this.speed);
      this.alpha = 180 + 75 * p.sin(p.frameCount * 0.1 + this.pulsePhase);
      this.wrap();
    }

    wrap() {
      if (this.pos.x > p.width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = p.height;
    }

    show() {
      p.noStroke();
      p.fill(255, 255, 180, this.alpha);
      p.ellipse(this.pos.x, this.pos.y, this.size);
      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = p.color(255, 255, 200, this.alpha);
      p.ellipse(this.pos.x, this.pos.y, this.size + 8);
      p.drawingContext.shadowBlur = 0;
    }
  }

  class Eel {
    constructor(x, y, direction) {
      this.pos = p.createVector(x, y);
      this.length = p.random(80, 130);
      this.speed = p.random(0.4, 1.2) * direction;
      this.alpha = 140;
      this.color = p.color(100, 100, 100, this.alpha);
    }

    update() {
      this.pos.x += this.speed;
      if (this.speed > 0 && this.pos.x > p.width + this.length) this.pos.x = -this.length;
      if (this.speed < 0 && this.pos.x < -this.length) this.pos.x = p.width + this.length;
    }

    show() {
      p.push();
      p.translate(this.pos.x, this.pos.y);
      p.noFill();
      p.stroke(this.color);
      p.strokeWeight(3);

      p.beginShape();
      let segments = 20;
      for (let i = 0; i <= segments; i++) {
        let x = p.map(i, 0, segments, 0, this.length);
        let phase = p.frameCount * 0.15;
        if (this.speed < 0) phase = -phase;
        let y = p.sin(i * 0.8 + phase) * 3;
        p.vertex(x, y);
      }
      p.endShape();

      p.pop();
    }
  }

  class Bubble {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-0.3, 0.3), p.random(-1, -2));
      this.alpha = 20;
      this.size = p.random(5, 15);
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

  class MesopelagicFish {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.baseBodyLength = p.random(30, 60);
      this.baseBodyHeight = p.random(10, 25);
      this.speed = p.random(0.5, 1.5);
      this.direction = p.random() < 0.5 ? 1 : -1;
      this.alpha = p.random(120, 180);
      this.colorBody = p.color(100, 120, 140, this.alpha);
      this.colorGlow = p.color(255, 230, 150, this.alpha * 0.7);
      this.glowSize = p.random(12, 18);
      this.scaleFactor = 1;
    }

    update() {
      this.pos.x += this.speed * this.direction;
      if (this.pos.x > p.width + this.baseBodyLength * this.scaleFactor) this.pos.x = -this.baseBodyLength * this.scaleFactor;
      if (this.pos.x < -this.baseBodyLength * this.scaleFactor) this.pos.x = p.width + this.baseBodyLength * this.scaleFactor;
    }

    show() {
      p.push();
      p.translate(this.pos.x, this.pos.y);
      if (this.direction < 0) {
        p.scale(-1, 1);
      }

      p.scale(this.scaleFactor);

      const w = this.baseBodyLength;
      const h = this.baseBodyHeight;

      const ctx = p.drawingContext;

      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(100, 120, 140, 0.8)';

      let gradientBody = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      gradientBody.addColorStop(0, '#384861');
      gradientBody.addColorStop(1, '#555750');

      ctx.fillStyle = gradientBody;
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, p.TWO_PI);
      ctx.fill();

      p.noStroke();
      p.fill(56, 72, 97, 100);
      p.triangle(-w / 1.5, 0, -w / 1.5 - h, h * 0.7, -w / 1.5 - h * 2, -h);

      ctx.shadowBlur = 0;

      const glowX = w / 1.2;
      const glowY = -h * 0.8;
      const glowRadius = h * 0.4;

      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(255, 230, 150, ${glowAlpha / 255})`;

      let gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
      gradient.addColorStop(0, `rgba(255, 230, 150, ${glowAlpha / 255})`);
      gradient.addColorStop(1, 'rgba(255, 230, 150, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(glowX, glowY, glowRadius, 0, p.TWO_PI);
      ctx.fill();

      ctx.shadowBlur = 0;
      p.fill(255, 230, 150, glowAlpha);
      p.circle(glowX, glowY, h * 0.6);

      p.pop();
    }
  }
};

new p5(sketch3, 'section3');
