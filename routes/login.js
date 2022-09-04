const express = require('express');

const router = express.Router();

module.exports = (params) => {
  // loginservice was passed through parameters
  // destructering params to include only
  // loginservice for this page.
  const { loginService } = params;

  // control of get request for '/login' url request
  router.get('/', (req, res) => {
    // session feedback message from server
    // (server response to request)
    const message = req.session.feedback ? req.session.feedback.message : false;

    // reintiallizing session feedback after esch request.
    req.session.feedback = {};
    res.render('layout', { title: 'Login', template: 'login', message });
  });

  // control of POST request for '/login' url request
  router.post('/', async (req, res, next) => {
    try {
      // initiallizing session login variable to
      // monitor login state of user
      req.session.login = null;

      // get user datails by passing email of user
      const user = await loginService.getUser(req.body.email);

      // if no user found
      if (user == null) {
        res.redirect('/register');
      } else if (user.email === req.body.email && user.password === req.body.password) {
        // set session login variable to name
        // of user after successful login
        req.session.login = user.name;
        return res.redirect('/pnr');
      }
      // if password doesn't matches.
      req.session.feedback = {
        message: 'Wrong email or password!',
      };
      return res.redirect('/login');
    } catch (err) {
      // return to next with error message
      // if found.
      return next(err);
    }
  });
  return router;
};
