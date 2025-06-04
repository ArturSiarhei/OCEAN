const sketch3 = (p) => {
  let raysLayer;
  let particles = [];
  let fireflies = [];
  let eels = [];
  let rayPositions = [];
  const RAY_COUNT = 15;
  let bubbles = [];
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

    raysLayer = p.createGraphics(w, h);
    raysLayer.noStroke();

    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 5; i++) {
      fireflies.push(new Firefly(p.random(3, 8)));
    }

    let eelPositionsX = [w * 0.2, w * 0.5, w * 0.8];
    let eelDirections = [1, 1, -1];
    for (let i = 0; i < 3; i++) {
      eels.push(new Eel(eelPositionsX[i], p.random(h), eelDirections[i]));
    }

    for (let i = 0; i < RAY_COUNT; i++) {
      rayPositions[i] = p.random(w * 0.05, w * 0.95);
    }

    nextBubbleTime = p.millis() + p.random(300, 3000);
  };

  p.draw = () => {
    p.background(10, 30, 60);

    raysLayer.clear();
    drawLightRays(raysLayer);
    raysLayer.filter(p.BLUR, 7);
    p.image(raysLayer, 0, 0);

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

    handleBubbles();

    // Рисуем текст "Mesopelagic zone" в 2 строки, справа 800px, сверху 100px
    const textX = p.width - 800;
    const textY = 100;

    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(100);
    p.textFont('Quicksand');
    p.textLeading(1 * 100);
    p.text("Mesopelagic\nzone", textX, textY);

    // Текстовый блок снизу слева с отступом 100 слева и 200 снизу, max ширина 600px
    const blockText = `Mesopelagic Zone, or twilight zone, extends from 200 to 1000 meters deep. Sunlight fades quickly, creating a dim environment where photosynthesis stops. Despite low light, many organisms use bioluminescence to hunt, communicate, or avoid predators. Common inhabitants include lanternfish, glowing jellyfish, and deep-sea squid. This zone is a key transition between surface and deep ocean, important for nutrient and carbon cycling.`;

    p.textSize(20);
    p.textFont('Quicksand');
    p.textLeading(1.4 * 20);
    p.textAlign(p.LEFT, p.BOTTOM);

    const blockX = 200;
    const blockY = p.height - 200;
    const blockWidth = 600;

    p.text(blockText, blockX, blockY - p.textAscent(), blockWidth);
  };

  p.windowResized = () => {
    const parent = document.getElementById('section3');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    p.resizeCanvas(w, h);
    raysLayer = p.createGraphics(w, h);
    raysLayer.noStroke();

    let eelPositionsX = [w * 0.2, w * 0.5, w * 0.8];
    for (let i = 0; i < eels.length; i++) {
      eels[i].pos.x = eelPositionsX[i];
      eels[i].pos.y = p.random(h);
    }

    rayPositions = [];
    for (let i = 0; i < RAY_COUNT; i++) {
      rayPositions[i] = p.random(w * 0.05, w * 0.95);
    }
  };

  function drawLightRays(pg) {
    pg.blendMode(p.ADD);
    for (let i = 0; i < RAY_COUNT; i++) {
      let t = p.frameCount * 0.024 + i * 1.5;
      let baseX = rayPositions[i] + p.sin(t * 0.7 + i) * 30;
      let topWidth = 60 + p.sin(t * 1.5 + i) * 20;
      let bottomWidth = 10;

      for (let y = 0; y < p.height; y++) {
        let inter = y / p.height;
        let w = p.lerp(topWidth, bottomWidth, inter);
        let alpha = p.map(y, 0, p.height, 30, 0);

        pg.fill(255, 255, 230, alpha);
        pg.rect(baseX - w / 2, y, w, 1);
      }
    }
    pg.blendMode(p.BLEND);
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
};

new p5(sketch3, 'section3');
