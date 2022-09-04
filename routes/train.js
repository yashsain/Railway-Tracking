const express = require('express');
const request = require('request');

const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    // if session login variable is null ( failed login )
    // redirect to login page.
    if (req.session.login === null) res.redirect('/login');
    res.render('pages/pnr.ejs', { name: req.session.login });
  });

  // API is not working ( ignore !!! )
  router.post('/', (req, res) => {
    const options = {
      method: 'POST',
      url: 'https://trains.p.rapidapi.com/',
      headers: {
        'x-rapidapi-host': 'trains.p.rapidapi.com',
        'x-rapidapi-key': 'd4bbf13effmsh58b9040eb04de6dp1f609ejsn72429f161441',
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: { search: `'${req.body.input}'` },
      json: true,
    };

    request(options, (error, response, body) => {
      if (error) throw new Error(error);
      res.render('pages/train_show.ejs', { final: body });
    });
  });

  return router;
};
