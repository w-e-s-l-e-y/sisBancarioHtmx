const { Sequelize, DataTypes } = require('sequelize');

const fs = require('fs');

// Verificar se o arquivo do banco de dados existe, e criar se não existir
const dbPath = 'wykbank.db';
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
    console.log('Banco de dados criado com sucesso em:', dbPath);
}

// Criar uma instância do Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'wykbank.db'
});
// Definir o modelo Cliente
const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ativo: {
        type: DataTypes.INTEGER,
        defaultValue: 1 // Definindo um valor padrão para ativo
      }
}, {
    freezeTableName: true, // Impede que o Sequelize pluralize o nome da tabela
    timestamps: false // Desativa a criação automática dos campos createdAt e updatedAt
});

// Definir o modelo ContaCorrente
const ContaCorrente = sequelize.define('ContaCorrente', {
    saldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    ativa: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cheque_especial: {
      type: DataTypes.DECIMAL(10, 2)
    }
  }, {
    freezeTableName: true, // Impede que o Sequelize pluralize o nome da tabela
    timestamps: false // Desativa a criação automática dos campos createdAt e updatedAt
});

  

// Função para inicializar o banco de dados
async function inicializarBanco() {
    try {
        await sequelize.authenticate();
        console.log('Conexão estabelecida com o banco de dados SQLite');
        await sequelize.sync();
        console.log('Tabelas sincronizadas com sucesso');

        // Verificar se os dados já foram semeados
        const clientesSemeados = await Cliente.findAll();
        if (clientesSemeados.length === 0) {
            // Se não houver clientes semeados, semeie os dados
            console.log('Semeando dados na tabela Cliente...');

            // Inserir dados na tabela Cliente
            await Cliente.bulkCreate([
                {
                    nome: 'João',
                    idade: 30,
                    email: 'joao@example.com',
                    tipo: 1,
                    ativo: true
                },
                // Adicione mais clientes aqui, se necessário
            ]);

            console.log('Dados semeados com sucesso na tabela Cliente');
        } else {
            console.log('Os dados já foram semeados na tabela Cliente');
        }

        // Verificar se os dados já foram semeados na tabela ContaCorrente
        const contasSemeadas = await ContaCorrente.findAll();
        if (contasSemeadas.length === 0) {
            // Se não houver contas semeadas, semeie os dados
            console.log('Semeando dados na tabela ContaCorrente...');

            // Inserir dados na tabela ContaCorrente
            await ContaCorrente.bulkCreate([
                {
                    saldo: 1000,
                    ativa: true,
                    cliente_id: 1 // Supondo que o cliente João tenha o ID 1
                },
                // Adicione mais contas aqui, se necessário
            ]);

            console.log('Dados semeados com sucesso na tabela ContaCorrente');
        } else {
            console.log('Os dados já foram semeados na tabela ContaCorrente');
        }
    } catch (error) {
        console.error('Erro ao conectar e sincronizar tabelas:', error);
    }
}

// Exportar os modelos e a função de inicialização do banco de dados
module.exports = {
    sequelize,
    Cliente,
    ContaCorrente,
    inicializarBanco
};
