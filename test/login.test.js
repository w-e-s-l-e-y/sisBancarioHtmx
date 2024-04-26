const request = require('supertest');
const app = require('../app');

describe('Teste de login', () => {
  test('Deve retornar status 200 ao realizar login com dados válidos', async () => {
    const response = await request(app)
      .post('/login')
      .send({ nome: 'exemplo', numeroConta: 123456 });

    expect(response.statusCode).toBe(200);
  });

  test('Deve retornar status 400 ao realizar login com dados inválidos', async () => {
    const response = await request(app)
      .post('/login')
      .send({ nome: '', numeroConta: '' });

    expect(response.statusCode).toBe(400);
  });
});
