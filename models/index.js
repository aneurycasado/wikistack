var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
var marked = require('marked');
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var statuses = ['open', 'closed'];

var pageSchema = new mongoose.Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {type: String, enum: statuses},
  date:     {type: Date, default: Date.now },
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags:     {type: Array}
});

var userSchema = new mongoose.Schema({
  name: {
    first: {type: String, required: true},
    last: {type: String, required: true}
  },
  email: {type: String, required: true, unique: true}
});

pageSchema.virtual("route").get(function(){
  return "/wiki/" + this.urlTitle;
});


pageSchema.virtual('renderedContent').get(function(){
  return marked(this.content);
});

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

function generateUrlTitle (title) {
  if (typeof title !== 'undefined' && title !== '') {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}


module.exports = {
  Page: Page,
  User: User,
  generateUrlTitle: generateUrlTitle
};
