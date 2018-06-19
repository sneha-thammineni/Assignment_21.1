var moment = require('moment');
module.exports = {

  // show the home page
  showHome: (req, res) => {
    res.render('pages/home', { moment: moment });
  }

};