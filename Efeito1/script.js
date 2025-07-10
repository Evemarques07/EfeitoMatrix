class MatrixEffect {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.config = {
      fontSize: 16,
      fontFamily: "monospace",
      chars:
        "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      trailColor: "rgba(0, 0, 0, 0.05)",
      ...config,
    };
    this.characters = this.config.chars.split("");
    this.drops = [];
    this.hue = 0;
    this.init();
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.config.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = 1;
    }
  }

  draw() {
    this.ctx.fillStyle = this.config.trailColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`;

    for (let i = 0; i < this.drops.length; i++) {
      const text =
        this.characters[Math.floor(Math.random() * this.characters.length)];
      const x = i * this.config.fontSize;
      const y = this.drops[i] * this.config.fontSize;

      // Define a cor do rastro
      if (this.config.rainbow) {
        const rr = Math.floor(127 * Math.sin(0.01 * this.hue + 0) + 128);
        const rg = Math.floor(127 * Math.sin(0.01 * this.hue + 2) + 128);
        const rb = Math.floor(127 * Math.sin(0.01 * this.hue + 4) + 128);
        this.ctx.fillStyle = `rgb(${rr}, ${rg}, ${rb})`;
      } else {
        this.ctx.fillStyle = this.config.fontColor;
      }

      this.ctx.fillText(text, x, y);

      this.ctx.fillStyle = "#fff";
      this.ctx.fillText(text, x, y);

      if (y > this.canvas.height && Math.random() > 0.98) {
        this.drops[i] = 0;
      }

      this.drops[i]++;
    }

    if (this.config.rainbow) {
      this.hue++;
    }
  }

  start() {
    const loop = () => {
      this.draw();
      setTimeout(loop, this.config.speed);
    };
    loop();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("matrix-canvas");

  const config = {
    speed: 50,
    rainbow: false,
    fontColor: "#00ff41",
  };

  const matrixEffect = new MatrixEffect(canvas, config);
  matrixEffect.start();

  const rainbowToggle = document.getElementById("rainbow-toggle");
  const speedSlider = document.getElementById("speed-slider");
  const colorPicker = document.getElementById("color-picker");

  rainbowToggle.addEventListener("change", (e) => {
    matrixEffect.config.rainbow = e.target.checked;
    colorPicker.disabled = e.target.checked;
  });

  speedSlider.addEventListener("input", (e) => {
    matrixEffect.config.speed = 160 - e.target.value;
  });

  colorPicker.addEventListener("input", (e) => {
    matrixEffect.config.fontColor = e.target.value;
  });

  window.addEventListener("resize", () => {
    matrixEffect.init();
  });

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )})`
      : null;
  }

  window.livelyPropertyListener = function (name, val) {
    switch (name) {
      case "matrixColor":
        matrixEffect.config.fontColor = hexToRgb(val);
        break;
      case "rainBow":
        matrixEffect.config.rainbow = val;
        break;
      case "rainbowSpeed":
        break;
    }
  };
});
