console.log("[sdavidbastos] Flappy Bird");

const som_HIT = new Audio();
som_HIT.src = "./efeitos/hit.wav"

console.log(som_HIT)

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("#game-canvas");

const contexto = canvas.getContext("2d");

// PLANO DE FUNDO
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 276,
  altura: 204,
  x: 0,
  y: canvas.height - 276,
  desenha() {
    contexto.fillStyle = "#70c5ce";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX,
      planoDeFundo.spriteY,
      planoDeFundo.largura,
      planoDeFundo.altura,
      planoDeFundo.x,
      planoDeFundo.y,
      planoDeFundo.largura,
      planoDeFundo.altura
    );
    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX,
      planoDeFundo.spriteY,
      planoDeFundo.largura,
      planoDeFundo.altura,
      planoDeFundo.x + planoDeFundo.largura,
      planoDeFundo.y,
      planoDeFundo.largura,
      planoDeFundo.altura
    );
  },
};

// CHÃO
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX,
      chao.spriteY,
      chao.largura,
      chao.altura,
      chao.x,
      chao.y,
      chao.largura,
      chao.altura
    );
    contexto.drawImage(
      sprites,
      chao.spriteX,
      chao.spriteY,
      chao.largura,
      chao.altura,
      chao.x + chao.largura,
      chao.y,
      chao.largura,
      chao.altura
    );
  },
};

// PASSARO

// Funções

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}
function criaFlappyBird() {
  // FlappyBird
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 35,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
      console.log(`[antes] ${flappyBird.velocidade}`);
      flappyBird.velocidade = -flappyBird.pulo;
      console.log(`[depois] ${flappyBird.velocidade}`);
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if (fazColisao(flappyBird, chao)) {
        console.log("Fez colisão");
        som_HIT.play()
        
        setTimeout(()=>{}, 500)

        return mudaParaTela(Telas.INICIO);
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        flappyBird.spriteX,
        flappyBird.spriteY,
        flappyBird.largura,
        flappyBird.altura,
        flappyBird.x,
        flappyBird.y,
        flappyBird.largura,
        flappyBird.altura
      );
    },
  };

  return flappyBird;
}

// MENSAGEM GET  READY

const mensagemGetReady = {
  sX: 134,
  sY: 0,
  l: 174,
  h: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      this.sX,
      this.sY,
      this.l,
      this.h,
      this.x,
      this.y,
      this.l,
      this.h
    );
  },
};

/**
 * Telas
 */

const globais = {};

let telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
  if(telaAtiva.inicializa){
    telaAtiva.inicializa()
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
    },
    desenha() {
      planoDeFundo.desenha();

      chao.desenha();

      globais.flappyBird.desenha();

      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {},
  },
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();

    chao.desenha();

    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  requestAnimationFrame(loop);
}

mudaParaTela(Telas.INICIO);
loop();

canvas.addEventListener("click", function () {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

window.addEventListener("keydown", function (event) {
  const tecla = event.code;
  if (tecla === "Space" || tecla === "ArrowUp") {
    event.preventDefault();
    if (telaAtiva.click) {
      telaAtiva.click();
    }
  }
});
