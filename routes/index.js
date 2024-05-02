const express = require('express');
const session = require('express-session');
const path = require('path');
const { Cliente, ContaCorrente } = require('../db/models');


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
    const nomeCliente = req.novoCliente.nome; // Obtém o nome do novo cliente
    const idCliente = req.novoCliente.id; // Obtém o ID do novo cliente
    req.session.successMessage = `Bem-vindo ${nomeCliente}, sua conta é: ${idCliente}.`; // Mensagem de sucesso personalizada
    // Redireciona para a página inicial
    res.redirect('/');
  } else {
    next(); // Continue com o próximo middleware ou tratamento de rota
  }
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
      // Define o ID do cliente na sessão
      req.session.userId = cliente.id;

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
    console.log('Criando novo cliente:', nome, idade, email, tipo, saldoInicial);
    const novoCliente = await Cliente.create({
      nome,
      idade,
      email,
      tipo,
      ativo: 1 // Definindo ativo como 1 por padrão
    });

    console.log('Novo cliente criado:', novoCliente.toJSON());

    // Marca que o cadastro foi bem-sucedido
    req.cadastroSucesso = true;
    req.novoCliente = novoCliente; // Armazena o novo cliente nos dados da requisição
    
    // Agora, crie uma nova conta corrente para esse cliente
    console.log('Criando nova conta corrente para o cliente:', novoCliente.nome);
    const novaContaCorrente = await ContaCorrente.create({
      saldo: saldoInicial, // Usando o saldo inicial fornecido
      ativa: true,
      cliente_id: novoCliente.id // Vinculando a conta ao novo cliente criado
    });

    console.log('Nova conta corrente criada:', novaContaCorrente.toJSON());

    // Adiciona R$100,00 ao limite do cheque especial
    await novaContaCorrente.update({ cheque_especial: 100 });
    next(); // Continue com o próximo middleware ou tratamento de rota
  } catch (error) {
    // Se houver um erro ao criar o cliente ou a conta corrente, envie uma resposta com status 400 (Bad Request)
    console.error('Erro ao cadastrar cliente:', error);
    res.status(400).json({ error: 'Erro ao cadastrar cliente. Verifique os dados fornecidos.' });
  }
}, redirecionarAposCadastro);

// GET /realizar-deposito
router.get('/realizar-deposito', (req, res) => {
  res.render('deposito'); // Renderize o arquivo Pug correspondente ao depósito
});

// POST /realizar-deposito
router.post('/realizar-deposito', async (req, res) => {
  const { valorDeposito } = req.body;

  try {
    console.log('Valor do depósito recebido:', valorDeposito);

    // Verificar se o valor do depósito é maior que zero
    if (valorDeposito <= 0) {
      throw new Error('O valor do depósito deve ser maior que zero.');
    }

    // Atualizar o saldo na conta corrente do cliente
    const contaCorrente = await ContaCorrente.findOne({ where: { cliente_id: req.session.userId } });
    if (!contaCorrente) {
      throw new Error('Conta corrente não encontrada para o usuário logado.');
    }

    // Calcular o novo saldo
    const novoSaldo = parseFloat(contaCorrente.saldo) + parseFloat(valorDeposito);

    // Atualizar o saldo na conta corrente
    await ContaCorrente.update({ saldo: novoSaldo }, { where: { cliente_id: req.session.userId } });

    console.log('Depósito de', valorDeposito, 'realizado com sucesso na conta', contaCorrente.id);

    // Redirecionar para a página de sucesso após realizar o depósito
    res.redirect('/conta-corrente');

  } catch (error) {
    console.error('Erro ao realizar depósito:', error);
    res.status(500).json({ error: 'Erro ao realizar depósito. Por favor, tente novamente mais tarde.' });
  }
});


// GET /realizar-saque
router.get('/realizar-saque', (req, res) => {
  res.render('saque'); // Renderize o arquivo Pug correspondente ao saque
});

// POST /realizar-saque
router.post('/realizar-saque', async (req, res) => {
  const { valorSaque } = req.body;

  try {
    console.log('Valor do saque recebido:', valorSaque);
    // Implemente a lógica para realizar o saque aqui
    // Por exemplo, verifique se há saldo suficiente na conta corrente
    // e registre a transação de saque
    res.status(200).json({ message: 'Saque realizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao realizar saque:', error);
    res.status(500).json({ error: 'Erro ao realizar saque. Por favor, tente novamente mais tarde.' });
  }
});

// GET /realizar-transferencia
router.get('/realizar-transferencia', (req, res) => {
  res.render('transferir'); // Renderize o arquivo Pug correspondente à transferência
});

// POST /realizar-transferencia
router.post('/realizar-transferencia', async (req, res) => {
  const { valorTransferencia } = req.body;

  try {
    console.log('Valor da transferência recebido:', valorTransferencia);
    // Implemente a lógica para realizar a transferência aqui
    // Por exemplo, verifique se há saldo suficiente na conta corrente do remetente
    // e atualize os saldos das contas do remetente e do destinatário
    res.status(200).json({ message: 'Transferência realizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao realizar transferência:', error);
    res.status(500).json({ error: 'Erro ao realizar transferência. Por favor, tente novamente mais tarde.' });
  }
});



module.exports = router;
