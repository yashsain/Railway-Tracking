const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const Loginervice = require('./service/loginservice');
const RegisterService = require('./service/registerservice');

const loginService = new Loginervice('./data/userdata.json');
const registerService = new RegisterService('./data/userdata.json');

const routes = require('./routes');

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['session4231', 'session5621'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './public')));

app.use(
  '/',
  routes({
    loginService,
    registerService,
  })
);

app.use((request, response, next) => {
  return next(createError(404, 'File not found'));
});

app.use((err, request, response) => {
  response.locals.message = err.message;
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on ${port}`);
});
