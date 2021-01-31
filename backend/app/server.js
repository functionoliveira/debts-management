const app = require('express')();
const server = require('http').createServer(app);
const { handleError } = require('./helpers/error');
// Carrega as rotas da aplicação
require('./routes/index')(app);
// Handle erros
app.use((err, req, res, next) => {
  handleError(err, res);
});
// Start do servidor
server.listen(80, () => {
  console.log('Server listening on localhost: 80');
});