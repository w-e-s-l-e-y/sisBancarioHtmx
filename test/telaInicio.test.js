const { JSDOM } = require('jsdom');
const { fireEvent } = require('@testing-library/dom');
const TelaInicio = require('../views/TelaInicio'); // Importe a classe TelaInicio conforme necessário

describe('TelaInicio tests', () => {
  let document;
  let telaInicio;

  beforeAll(async () => {
    // Carregar a interface da tela de início
    document = await loadHTML(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Banco WYK</title>
        </head>
        <body>
          <h1 id="titulo"></h1>
          <div id="botoes">
            <button id="btnLogin">Login</button>
            <button id="btnCadastro">Cadastro</button>
          </div>
        </body>
      </html>
    `);

    // Instanciar a tela de início
    telaInicio = new TelaInicio();
  });

  it('deve exibir o título correto', () => {
    const tituloElement = document.getElementById('titulo');
    expect(tituloElement.textContent).toBe('Banco WYK');
  });

  it('deve conter botões de login e cadastro', () => {
    const btnLogin = document.getElementById('btnLogin');
    const btnCadastro = document.getElementById('btnCadastro');
    expect(btnLogin).toBeTruthy();
    expect(btnCadastro).toBeTruthy();
  });

  it('deve abrir a tela de login ao clicar no botão de login', () => {
    const btnLogin = document.getElementById('btnLogin');
    fireEvent.click(btnLogin); // Simula um clique no botão de login

    // Agora podemos verificar se a tela de login foi aberta corretamente
    // Isso pode ser feito verificando se os elementos esperados estão presentes na tela de login
  });

  it('deve abrir a tela de cadastro ao clicar no botão de cadastro', () => {
    const btnCadastro = document.getElementById('btnCadastro');
    fireEvent.click(btnCadastro); // Simula um clique no botão de cadastro

    // Agora podemos verificar se a tela de cadastro foi aberta corretamente
    // Isso pode ser feito verificando se os elementos esperados estão presentes na tela de cadastro
  });

  // Mais testes podem ser adicionados para verificar outros aspectos da tela de início

});
