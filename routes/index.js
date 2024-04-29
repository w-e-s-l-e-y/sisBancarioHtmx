const express = require('express');
const session = require('express-session');
const path = require('path');
const { Cliente } = require('../db/models');

const router = express.Router();

// Configuração do middleware de sessão
router.use(session({
  secret: 'suaChaveSecretaAqui',
  resave: false,
  saveUninitialized: true
}));

// Middleware para redirecionamento após cadastro bem-sucedido
const redirecionarAposCadastro = (req, res, next) => {
  if (req.cadastroSucesso) {
    // Configura a mensagem de sucesso na sessão
    req.session.successMessage = 'Cliente cadastrado com sucesso!';
  }
  next(); // Continue com o próximo middleware ou tratamento de rota
};


// Defina a rota para a página inicial
router.get('/', (req, res) => {
  // Renderize a página inicial e passe a mensagem de sucesso, se houver
  res.render('index', { successMessage: req.session.successMessage });
  // Limpe a mensagem de sucesso após exibi-la
  delete req.session.successMessage;
});

// Defina a rota para a página de login
router.get('/login', (req, res) => {
  res.render('login'); // Renderiza o arquivo Pug 'login.pug'
});

// POST /login
router.post('/login', async (req, res) => {
  const { nome, numeroConta } = req.body;

  try {
    // Verifique se existe um cliente com o nome e número da conta fornecidos
    const cliente = await Cliente.findOne({ where: { nome, id: numeroConta } });

    if (cliente) {
      // Se o cliente existir, redirecione para a tela da conta corrente
      res.redirect('/conta-corrente'); 
    } else {
      console.log('Cliente não encontrado:', nome, numeroConta);
      // Se os dados não forem válidos, renderize a página de login novamente com uma mensagem de erro
      res.render('login', { error: 'Nome ou número da conta inválidos. Por favor, tente novamente.' });
    }
  } catch (error) {
    console.error('Erro ao verificar dados de login:', error);
    res.status(500).send('Erro ao verificar dados de login. Por favor, tente novamente mais tarde.');
  }
});

// GET /conta-corrente
router.get('/conta-corrente', async (req, res) => {
  try {
    // Aqui você pode fazer qualquer lógica necessária para carregar os dados da conta-corrente
    // por exemplo, buscar os dados do banco de dados ou de outra fonte de dados
    // e então renderizar a página correspondente
    res.render('conta-corrente'); // Substitua 'conta-corrente' pelo nome do arquivo Pug correspondente
  } catch (error) {
    console.error('Erro ao carregar página de conta-corrente:', error);
    res.status(500).send('Erro ao carregar página de conta-corrente. Por favor, tente novamente mais tarde.');
  }
});

// POST /conta-corrente (redireciona para a rota GET correspondente)
router.post('/conta-corrente', (req, res) => {
  res.redirect('/conta-corrente');
});

// Defina a rota para a página de cadastro
router.get('/cadastro', (req, res) => {
  res.render('cadastro'); // Renderiza o arquivo Pug 'cadastro.pug'
});

// Rota POST /cadastro
router.post('/cadastro', async (req, res, next) => {
  const { nome, idade, email, tipo, saldoInicial } = req.body;

  try {
    // Crie um novo cliente com os dados fornecidos
    const novoCliente = await Cliente.create({
      nome,
      idade,
      email,
      tipo,
      saldoInicial,
      ativo: 1 // Definindo ativo como 1 por padrão
    });

    // Marca que o cadastro foi bem-sucedido
    req.cadastroSucesso = true;
    req.novoCliente = novoCliente; // Armazena o novo cliente nos dados da requisição
    next(); // Chama o próximo middleware
  } catch (error) {
    // Se houver um erro ao criar o cliente, envie uma resposta com status 400 (Bad Request)
    console.error('Erro ao cadastrar cliente:', error);
    res.status(400).json({ error: 'Erro ao cadastrar cliente. Verifique os dados fornecidos.' });
  }
}, redirecionarAposCadastro); // Aplica o middleware de redirecionamento após o tratamento da rota de cadastro

module.exports = router;
