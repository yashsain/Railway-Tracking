const express = require('express');

const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    // destrong session for a user by
    // setting session login varable to null
    req.session.login = null;
    res.redirect('/');
  });
  return router;
};
