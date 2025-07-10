class MatrixRain {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Configurações padrão e mesclagem com opções do usuário
    this.settings = {
      font_size: 16,
      font_family: "monospace",
      characters: "01",
      // Se quiser usar caracteres japoneses, descomente a linha abaixo e comente a linha acima
      //   characters:
      //     "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789",
      color: "#068a2d", // Verde Matrix clássico
      rainbow: false,
      speed: 30, // Frames por segundo
      ...options,
    };

    this.hue = 0; // Para o efeito arco-íris
    this.drops = [];
    this.lastTime = 0;
    this.timer = 0;

    this.initialize();
    this.animate = this.animate.bind(this); // Garante o 'this' correto no loop
  }

  initialize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.ceil(this.canvas.width / this.settings.font_size);

    // Reinicia as gotas para cada coluna
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(
        (Math.random() * this.canvas.height) / this.settings.font_size
      );
    }
  }

  draw() {
    // Fundo preto semi-transparente para criar o efeito de rastro
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Estilo dos caracteres
    this.ctx.font = this.settings.font_size + "px " + this.settings.font_family;

    // Efeito de brilho
    this.ctx.shadowBlur = 10;

    for (let i = 0; i < this.drops.length; i++) {
      const text =
        this.settings.characters[
          Math.floor(Math.random() * this.settings.characters.length)
        ];
      const x = i * this.settings.font_size;
      const y = this.drops[i] * this.settings.font_size;

      // Define a cor
      if (this.settings.rainbow) {
        this.hue += 0.5;
        this.ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        this.ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
      } else {
        this.ctx.fillStyle = this.settings.color;
        this.ctx.shadowColor = this.settings.color;
      }

      // Desenha o caractere principal (mais claro/branco)
      this.ctx.fillStyle = "#ccffcc";
      this.ctx.fillText(text, x, y);

      // Desenha o mesmo caractere com a cor principal para dar o efeito de rastro
      if (this.settings.rainbow) {
        this.ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
      } else {
        this.ctx.fillStyle = this.settings.color;
      }
      this.ctx.fillText(text, x, y);

      // Move a gota para baixo
      this.drops[i]++;

      // Se a gota sair da tela, a envia de volta para o topo com uma chance aleatória
      if (
        this.drops[i] * this.settings.font_size > this.canvas.height &&
        Math.random() > 0.975
      ) {
        this.drops[i] = 0;
      }
    }
  }

  animate(timestamp) {
    // Limita a taxa de quadros (FPS) para controlar a velocidade
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    const interval = 1000 / this.settings.speed;

    if (this.timer > interval) {
      this.draw();
      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }

    requestAnimationFrame(this.animate);
  }
}

// --- INICIALIZAÇÃO E CONTROLES ---

const canvas = document.getElementById("matrix-canvas");
const matrixEffect = new MatrixRain(canvas);

// Inicia a animação
matrixEffect.animate(0);

// Lógica do Painel de Controle
const controlsPanel = document.getElementById("controls");
const toggleButton = document.getElementById("toggle-controls");

const colorPicker = document.getElementById("color-picker");
const rainbowToggle = document.getElementById("rainbow-toggle");
const speedSlider = document.getElementById("speed-slider");
const speedValue = document.getElementById("speed-value");
const fontsizeSlider = document.getElementById("fontsize-slider");
const fontsizeValue = document.getElementById("fontsize-value");

// Esconder/Mostrar painel
toggleButton.addEventListener("click", () => {
  controlsPanel.classList.toggle("hidden");
  if (controlsPanel.classList.contains("hidden")) {
    toggleButton.textContent = "Mostrar Painel";
  } else {
    toggleButton.textContent = "Esconder Painel";
  }
});

// Atualizar cor
colorPicker.addEventListener("input", (e) => {
  matrixEffect.settings.color = e.target.value;
  rainbowToggle.checked = false; // Desativa o arco-íris ao escolher uma cor
  matrixEffect.settings.rainbow = false;
});

// Ativar/Desativar arco-íris
rainbowToggle.addEventListener("change", (e) => {
  matrixEffect.settings.rainbow = e.target.checked;
});

// Atualizar velocidade
speedSlider.addEventListener("input", (e) => {
  const speed = parseInt(e.target.value, 10);
  matrixEffect.settings.speed = speed;
  speedValue.textContent = speed;
});

// Atualizar tamanho da fonte
fontsizeSlider.addEventListener("input", (e) => {
  const size = parseInt(e.target.value, 10);
  matrixEffect.settings.font_size = size;
  fontsizeValue.textContent = size;
  matrixEffect.initialize(); // Reinicia para recalcular colunas com o novo tamanho
});

// Ajustar ao redimensionar a janela
window.addEventListener("resize", () => {
  matrixEffect.initialize();
});
