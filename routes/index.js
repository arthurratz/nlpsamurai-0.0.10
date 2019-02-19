'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'NLP-Samurai@0.0.10 Demo' });
});

router.get('/concepts', function (req, res) {
    res.render('concepts', { title: 'Add New Concept Modal' });
});

router.get('/answers', function (req, res) {
    res.render('answers', { title: 'Answers View Modal' });
});

router.get('/modify', function (req, res) {
    res.render('updates', { title: 'Modify Concept Modal' });
});

router.get('/confirm', function (req, res) {
    res.render('confirm', { title: 'Confirm Removal Modal' });
});

module.exports = router;
