var express = require('express');
var models = require("../models/");
var User = models.User;
var Page = models.Page;

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  Page.find({}).exec().then(function(pages){
    res.render('index',{
      pages: pages
    });
  });
});

router.post('/',function(req,res,next){
  var page;
  User.findOne({name: req.body.authorName}).exec().then(function(user){
    if(user === null){
      var newUser = new User({
        name: { first: req.body.authorName.split(" ")[0],
                last: req.body.authorName.split(" ")[1]
              },
        email: req.body.authorEmail
      });
      newUser.save().then(function(saveUser){
        page = new Page({
          title: req.body.title,
          content: req.body.content,
          urlTitle: models.generateUrlTitle(req.body.title),
          author: saveUser._id,
          tags: req.body.tags.split(" ")
        });
      }).then(function(){
        page.save(function(err){
          console.log("Error in page",err);
        }).then(function(savedPage){
          console.log("Saveed");
          res.redirect(savedPage.route); // route virtual FTW
        }).then(null, next);
      });
    }else{
      page = new Page({
        title: req.body.title,
        content: req.body.content,
        urlTitle: models.generateUrlTitle(req.body.title),
        author: user._id
      });
      page.save().then(function(savedPage){
        console.log("Saveed");
        res.redirect(savedPage.route); // route virtual FTW
      }).then(null, next);
    }
  });
});

router.get('/add',function(req,res,next){
  res.render("addpage");
});

router.get('/:urlTitle', function (req, res, next) {
  console.log("We hit");
  Page.findOne({ urlTitle: req.params.urlTitle }).exec().then(function(foundPage){
    User.findById(foundPage.author).then(function(foundUser){
      console.log("We found a user",foundUser);
      var firstName = foundUser.name.first;
      var lastName = foundUser.name.last;
      var name = firstName + " " + lastName;
      return name;
    }).then(function(name){
      console.log("The name of the user",name);
      foundPage['name'] = name;
      console.log("FoundPage",foundPage);
      res.render("wikipage",foundPage);
    });
  });
});


module.exports = router;
