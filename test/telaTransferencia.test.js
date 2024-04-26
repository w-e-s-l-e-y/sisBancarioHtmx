const { JSDOM } = require('jsdom');
const { fireEvent } = require('@testing-library/dom');
const TelaTransferencia = require('../views/TelaTransferencia'); // Caminho correto para a tela de transferência

describe('TelaTransferencia tests', () => {
  let document;
  let telaTransferencia;

  beforeAll(async () => {
    // Carregar a interface da tela de transferência
    document = await loadHTML(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Transferência</title>
        </head>
        <body>
          <label for="numeroContaDestino">Número da Conta Destino:</label>
          <input type="text" id="numeroContaDestino">
          <label for="valorTransferencia">Valor da Transferência:</label>
          <input type="text" id="valorTransferencia">
          <button id="btnTransferir">Transferir</button>
        </body>
      </html>
    `);

    // Instanciar a tela de transferência
    telaTransferencia = new TelaTransferencia(123456); // Número da conta de origem fictício
  });

  it('deve transferir o valor corretamente com dados válidos', () => {
    const numeroContaDestinoInput = document.getElementById('numeroContaDestino');
    const valorTransferenciaInput = document.getElementById('valorTransferencia');
    const btnTransferir = document.getElementById('btnTransferir');

    // Preencher os campos com dados válidos
    numeroContaDestinoInput.value = '987654'; // Número da conta destino fictício
    valorTransferenciaInput.value = '100.00'; // Valor fictício para transferência

    // Simular o clique no botão de transferir
    fireEvent.click(btnTransferir);

    // Agora podemos verificar se a transferência foi realizada corretamente
    // Isso pode ser feito verificando se a mensagem de sucesso foi exibida ou se o saldo da conta de origem foi atualizado corretamente
  });

  it('deve exibir mensagem de erro ao tentar transferir com dados inválidos', () => {
    const numeroContaDestinoInput = document.getElementById('numeroContaDestino');
    const valorTransferenciaInput = document.getElementById('valorTransferencia');
    const btnTransferir = document.getElementById('btnTransferir');

    // Preencher os campos com dados inválidos (por exemplo, deixar os campos em branco)
    numeroContaDestinoInput.value = '';
    valorTransferenciaInput.value = '';

    // Simular o clique no botão de transferir
    fireEvent.click(btnTransferir);

    // Agora podemos verificar se a mensagem de erro foi exibida corretamente
    // Isso pode ser feito verificando se a mensagem de erro é exibida na tela
  });

  // Mais testes podem ser adicionados para verificar outros aspectos da tela de transferência

});
