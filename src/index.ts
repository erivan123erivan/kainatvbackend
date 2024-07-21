import { getPostByID, incrementLike } from "./controllers/postController";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter = require('./routes/users');
const signupRouter = require('./routes/signup');
const postRouter = require('./routes/post');
const libraryRouter = require('./routes/library');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as per your needs
app.use(bodyParser.urlencoded({ extended: true }));




app.use('/users', usersRouter);
app.use('/signup', signupRouter);






app.use('/post', postRouter);
app.get('/post/:id', getPostByID);
app.use('/library', libraryRouter); // Ensure the prefix is '/library'




// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
