const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const routes = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', routes);

if (require.main === module) {
  const server = app.listen(3000, () => {
    console.log(`Express is running on port 3000`);
  });
}
// Exporta o app para que ele possa ser importado em outros arquivos, como os testes
module.exports = app;
