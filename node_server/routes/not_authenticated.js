var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('not_authenticated', {title: 'Not Authenticated'});
});

module.exports = router;