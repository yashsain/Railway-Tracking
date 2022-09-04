const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

module.exports = (params) => {
  const { loginService } = params;

  router.get('/', (req, res) => {
    const error = req.session.feedback ? req.session.feedback.error : false;

    const successMessage = req.session.feedback ? req.session.feedback.message : false;

    req.session.feedback = {};

    res.render('layout', {
      title: 'Foggot Password',
      template: 'forgot_password',
      error,
      successMessage,
    });
  });

  router.post('/', async (req, res, next) => {
    try {
      const user = await loginService.getUser(req.body.email);
      if (user == null) {
        req.session.feedback = {
          error: 'Please Register with this email!',
        };
        return res.redirect('/forgot_password');
      }

      // storing sender credentials for email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'trainstatusteam@gmail.com',
          pass: 'status2219train',
        },
      });

      // mail info needs to be sent.
      const mailOptions = {
        from: 'trainstatusteam@gmail.com',
        to: req.body.email,
        subject: 'Reset Password Request',
        text: `Your password for train status website is "${user.password}"`,
      };

      // sending mail using nodemailer module method sendmail()
      transporter.sendMail(mailOptions, (error) => {
        // handelling error if any occurs
        if (error) {
          req.session.feedback = {
            error: `${error}`,
          };
          return res.redirect('/forgot_password');
        }
        return res.redirect('/forgot_password');
      });
      // set session feedback message to return to user.
      req.session.feedback = {
        message: 'Email sent with Password!',
      };
      return res.redirect('/forgot_password');
    } catch (err) {
      // return to next with error message
      // if found.
      return next(err);
    }
  });
  return router;
};
