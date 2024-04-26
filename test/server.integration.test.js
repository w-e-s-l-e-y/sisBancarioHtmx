const request = require('supertest');
const app = require('../app');

describe('Testes de Integração', () => {
  it('Deve retornar o status 200 para a rota principal', async () => {
    const response = await request(app).get('/contacts');
    expect(response.statusCode).toBe(200);
  });

  it('Deve retornar o status 404 para uma rota inexistente', async () => {
    const response = await request(app).get('/rota-inexistente');
    expect(response.statusCode).toBe(404);
  });
});

describe('Teste de integração do servidor', () => {
  it('deve responder com status 200 ao fazer uma solicitação GET para a raiz', async () => {
    const response = await request(app).get('/contacts');
    expect(response.statusCode).toBe(200);
  });
});
