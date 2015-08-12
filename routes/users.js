var express = require('express');
var models = require("../models/");
var User = models.User;
var Page = models.Page;
var router = express.Router();
var Promise = require('bluebird');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}).exec().then(function(users){
    console.log("Users",users);
    res.render('users',{users: users});
  }).then(null, next);
});

router.get('/:id', function(req, res, next){
  var userPromise = User.findById(req.params.id).exec();
  var pagesPromise = Page.find({ author: req.params.id }).exec();
  Promise.join(userPromise, pagesPromise, function(user, pages){
    console.log(pages);
    res.render('user', { user: user, pages: pages });
  }).then(null, next);
});
module.exports = router;
