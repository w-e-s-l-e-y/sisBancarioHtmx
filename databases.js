// database.js

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Caminho para o arquivo do banco de dados SQLite
const dbPath = path.resolve('C:\\Users\\964772\\Documents\\GitHub\\SistemaBancario\\SistemaBancario\\src\\main\\java\\org\\example\\wykbank.db');

// Configuração do Sequelize para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
});

// Definir modelo Cliente
const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

// Definir modelo ContaCorrente
const ContaCorrente = sequelize.define('ContaCorrente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  ativa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cheque_especial: {
    type: DataTypes.DECIMAL(10, 2),
  },
});

// Definir relacionamento entre Cliente e ContaCorrente
Cliente.hasOne(ContaCorrente, { foreignKey: 'cliente_id' });
ContaCorrente.belongsTo(Cliente, { foreignKey: 'cliente_id' });

// Função para inicializar o banco de dados
async function initializeDatabase() {
  try {
    // Testa a conexão com o banco de dados
    await sequelize.authenticate();

    // Sincroniza os modelos com o banco de dados
    await sequelize.sync();

    console.log('Banco de dados pronto');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}

module.exports = { sequelize, initializeDatabase, Cliente, ContaCorrente };
