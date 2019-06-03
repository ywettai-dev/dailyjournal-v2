//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
const port = 3000;

const app = express();

//ejs engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

//express link for public - static folder
app.use(express.static('public'));

//Express server
app.listen(process.env.PORT || port, () => console.log(`Daily Journal starts on ${port}`));

//Establish DB connection
mongoose.connect("mongodb://localhost:27017/dailyJournalTestDB", {
  useNewUrlParser: true
});

mongoose.set('useFindAndModify', false);

//Setup post schema
const postSchema = {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
};

//Setup post model
const Post = mongoose.model("Post", postSchema);

let defaultPosts = [];

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Home
app.get('/', (req, res) => {

  Post.find({}, (err, foundPosts) => {
    if (!err) {
      res.render('home', {
        homeInitialContent: homeStartingContent,
        homePosts: foundPosts
      });
    }
  });
});

//Express route params to postDetail
app.get('/posts/:postID', (req, res) => {

  const reqID = req.params.postID;

  Post.findOne({
    _id: reqID
  }, (err, foundPost) => {
    if (!err) {
      if (foundPost) {
        res.render('post', {
          title: foundPost.title,
          content: foundPost.content
        });
      }
    }
  });
});

//About
app.get('/about', (req, res) => {
  res.render('about', {
    aboutInitialContent: aboutContent
  });
});

//Contact
app.get('/contact', (req, res) => {
  res.render('contact', {
    contactInitialContent: contactContent
  });
});

//Compose
app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {

  const postTitle = req.body.postTitle;
  const postContent = req.body.postContent;

  const post = new Post({
    title: postTitle,
    content: postContent
  });

  post.save((err) => {
    if (!err) {
      res.redirect('/');
    }
  });
});