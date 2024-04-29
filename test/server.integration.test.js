const request = require('supertest');
const app = require('../app');

describe('Testes de Integração', () => {
  it('Deve retornar o status 404 para uma rota inexistente', async () => {
    const response = await request(app).get('/rota-inexistente');
    expect(response.statusCode).toBe(404);
  });

  it('Deve retornar o status 200 para a rota principal', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('Deve retornar o status 200 para a rota de login', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
  });

  it('Deve redirecionar para a tela de conta corrente após o login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ nome: 'exemplo', numeroConta: '123456' }); // Fornecer dados válidos de login
    expect(response.headers.location).toBe('/conta-corrente');
  });

  it('Deve retornar o status 200 para a rota de conta corrente', async () => {
    const response = await request(app).get('/conta-corrente');
    expect(response.statusCode).toBe(200);
  });

  it('Deve retornar o status 200 para a rota de cadastro', async () => {
    const response = await request(app).get('/cadastro');
    expect(response.statusCode).toBe(200);
  });

  it('Deve retornar o status 201 ao cadastrar um novo cliente com dados válidos', async () => {
    const response = await request(app)
      .post('/cadastro')
      .send({ nome: 'exemplo', idade: 30, email: 'exemplo@example.com', tipo: 1, saldoInicial: 1000 });

    expect(response.statusCode).toBe(201);
  });

  it('Deve retornar o status 400 ao cadastrar um novo cliente com dados inválidos', async () => {
    const response = await request(app)
      .post('/cadastro')
      .send({ nome: '', idade: '', email: '', tipo: '', saldoInicial: '' });

    expect(response.statusCode).toBe(400);
  });
});
