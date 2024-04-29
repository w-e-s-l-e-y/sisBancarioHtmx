const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const routes = require('./routes/index');
const { inicializarBanco } = require('./db/models');

const app = express();

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', routes);

// Inicializar o banco de dados e sincronizar os modelos
inicializarBanco()
  .then(() => {
    // O banco de dados foi inicializado com sucesso
    // Iniciar o servidor Express
    const server = app.listen(3000, () => {
      console.log(`Express is running on port 3000`);
    });
  })
  .catch((err) => {
    // Se ocorrer um erro ao inicializar o banco de dados
    console.error('Erro ao inicializar o banco de dados:', err);
  });

// Exporta o app para que ele possa ser importado em outros arquivos, como os testes
module.exports = app;

