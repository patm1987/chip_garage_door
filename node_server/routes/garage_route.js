/**
 * Created by pux19 on 2/1/2016.
 */

var express = require('express');
var router = express.Router();

var garage_control = require("../garage_control");

function render_garage(req, res, next) {
    res.render(
        'garage_route',
        {
            title: 'Garage Control Center',
            garage: garage_control
        });
}

router.get('/', render_garage);

router.get('/toggle', function(req, res, next) {
    garage_control.toggleDoor();
    res.redirect(req.baseUrl);
});

module.exports = router;
