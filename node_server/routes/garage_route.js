/**
 * Created by pux19 on 2/1/2016.
 */

var express = require('express');
var router = express.Router();

var garage_control = require("../garage_control");
var keys = require('../keys.json');

var passport = null;

function render_garage(req, res, next) {
    res.render(
        'garage_route',
        {
            title: 'Garage Control Center',
            garage: garage_control,
            client_id: keys.google_key,
            authenticated: req.isAuthenticated()
        });
}

router.get('/', render_garage);

router.get('/toggle', function(req, res, next) {
    if (req.isAuthenticated()) {
        garage_control.toggleDoor();
        res.redirect(req.baseUrl);
    }
    else {
        res.redirect('/not_authenticated');
    }
});

router.set_passport = function (new_passport) {
    passport = new_passport
};

module.exports = router;
