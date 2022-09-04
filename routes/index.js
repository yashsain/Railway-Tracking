const express = require('express');

/*  
  all file routers are imported
  as functions for navigation 
*/
const login = require('./login');
const register = require('./register');
const pnr = require('./pnr');
const train = require('./train');
const logout = require('./logout');
const forgotPassword = require('./forgot_password');

const router = express.Router();

module.exports = (params) => {
  router.get('/', (req, res) => {
    res.render('pages', { title: 'Welcome' });
  });

  /*  
    routes initialized relative to index url. 
    server.js => index.js => different routes 
    with relative url to index.
  */
  router.use('/login', login(params));
  router.use('/register', register(params));
  router.use('/pnr', pnr());
  router.use('/train', train());
  router.use('/logout', logout());
  router.use('/forgot_password', forgotPassword(params));
  return router;
};
