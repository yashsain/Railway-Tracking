const express = require('express');

const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = (params) => {
  // registerservice was passed through parameters
  // destructering params to include only
  // registerservice for this page.
  const { registerService } = params;

  // control of get request for '/register' url request
  router.get('/', (req, res, next) => {
    try {
      // session feedback message from server
      // (server response to request)
      const error = req.session.feedback ? req.session.feedback.errors : false;

      const successMessage = req.session.feedback ? req.session.feedback.message : false;

      // reintiallizing session feedback after esch request.
      req.session.feedback = {};

      return res.render('layout', {
        title: 'Register',
        template: 'register',
        error,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  // control of POST request for '/register' url request
  router.post(
    '/',
    [
      check('name').trim().isLength({ min: 3 }).escape().withMessage('A name is required'),
      check('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('A valid email address is required'),
      check('password').trim().isLength({ min: 8 }).escape().withMessage('A password is required'),
    ],
    async (req, res, next) => {
      try {
        /*
          validate the format of inputs.
        */
        const errors = validationResult(req.body);

        if (!errors.isEmpty()) {
          req.session.register = {
            errors: errors.array(),
          };
          return res.redirect('/register');
        }

        const user = await registerService.getUser(req.body.email);
        if (user == null) {
          const { name, email, password } = req.body;
          await registerService.addEntry(name, email, password);
          req.session.feedback = {
            message: 'Thank you for registration!',
          };
          return res.redirect('/register');
        }
        req.session.feedback = {
          message: 'email already in use!',
        };
        return res.redirect('/register');
      } catch (err) {
        return next(err);
      }
    }
  );

  return router;
};
