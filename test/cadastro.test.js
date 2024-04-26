const request = require('supertest');
const app = require('../app');

describe('Teste de cadastro', () => {
  test('Deve retornar status 200 ao cadastrar um novo cliente com dados válidos', async () => {
    const response = await request(app)
      .post('/cadastro')
      .send({ nome: 'exemplo', idade: 30, email: 'exemplo@example.com', tipo: 1, saldoInicial: 1000 });

    expect(response.statusCode).toBe(200);
  });

  test('Deve retornar status 400 ao cadastrar um novo cliente com dados inválidos', async () => {
    const response = await request(app)
      .post('/cadastro')
      .send({ nome: '', idade: '', email: '', tipo: '', saldoInicial: '' });

    expect(response.statusCode).toBe(400);
  });
});
