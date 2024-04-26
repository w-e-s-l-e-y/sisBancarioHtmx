const { JSDOM } = require('jsdom');
const { fireEvent } = require('@testing-library/dom');
const InterfacePrincipal = require('../views/InterfacePrincipal'); // Importe a classe InterfacePrincipal conforme necessário

describe('InterfacePrincipal tests', () => {
  let document;
  let interfacePrincipal;

  beforeAll(async () => {
    // Carregar a interface principal
    document = await loadHTML(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Sistema Bancário</title>
        </head>
        <body>
          <label id="lblSaldo">Saldo atual: R$ 1000.00</label>
          <button id="btnDeposito">Depósito</button>
          <button id="btnSaque">Saque</button>
          <button id="btnTransferir">Transferir</button>
        </body>
      </html>
    `);

    // Instanciar a interface principal com uma conta fictícia
    interfacePrincipal = new InterfacePrincipal(new ContaCorrente(123, 1000.0, true)); // Número da conta, saldo inicial e status da conta
  });

  it('deve realizar um depósito corretamente', () => {
    const btnDeposito = document.getElementById('btnDeposito');

    // Simular um depósito de R$ 500
    fireEvent.click(btnDeposito);
    // Agora podemos verificar se o saldo foi atualizado corretamente na tela e no banco de dados
  });

  it('deve realizar um saque corretamente', () => {
    const btnSaque = document.getElementById('btnSaque');

    // Simular um saque de R$ 200
    fireEvent.click(btnSaque);
    // Agora podemos verificar se o saldo foi atualizado corretamente na tela e no banco de dados
  });

  it('deve abrir a tela de transferência corretamente', () => {
    const btnTransferir = document.getElementById('btnTransferir');

    // Simular o clique no botão de transferência
    fireEvent.click(btnTransferir);
    // Agora podemos verificar se a tela de transferência foi aberta corretamente
  });

  // Mais testes podem ser adicionados para verificar outros aspectos da interface principal

});
