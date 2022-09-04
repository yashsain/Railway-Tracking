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
      method: 'GET',
      url: 'https://indianrailways.p.rapidapi.com/index.php',
      qs: { pnr: `'${req.body.input}'` },
      headers: {
        'x-rapidapi-host': 'indianrailways.p.rapidapi.com',
        'x-rapidapi-key': 'd4bbf13effmsh58b9040eb04de6dp1f609ejsn72429f161441',
      },
    };

    request(options, (error, response, body) => {
      if (error) throw new Error(error);
      res.render('pages/pnr_show.ejs', { final: body });
    });
  });

  return router;
};
