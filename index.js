/**used for setting up a server */
const express = require('express');
const morgan = require('morgan');//USED FOR LOGGING
/**used for creating a unique id value */
const uuid = require('uuid');
const fs = require('fs');//REQUIRED TO HELP WITH LOGGING
const path = require('path');
/**REQUIRED FOR SERVER SIDE VALIDATION*/
const { check, validationResult } = require('express-validator');
/**REQUIRED FOR READING/WRITING OF THE DOCUMENT BODY*/
const bodyParser = require('body-parser');
/**assign express and its functions to a variable for later use */
const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
const logStream = fs.createWriteStream(path.join(__dirname,'log.txt'),{flags:'a'});//REQUIRED FOR LOGGING
/**import mongoose...ei model,schema */
const mongoose = require('mongoose');
const models = require('./models.js');
/**create the movies schema/model access*/
const MOVIES = models.Movie;
/**create the user schema/model access*/
const USERS = models.User;

//mongoose.connect('mongodb://127.0.0.1:27017/myFlexDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//https://myflixdb-162c62e51cf6.herokuapp.com/users
//127.0.0.1:8080/users



app.use(morgan('combined', {stream: logStream}));//USED FOR LOGGING

/**below, CORS logic for domain restriction and access...*/
//-------------------------------------------------------------------------------------------------------------
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com','http://localhost:1234','https://myflixdb-162c62e51cf6.herokuapp.com/','https://kbomb-flix.netlify.app','http://localhost:4200','http://localhost:4200/','https://kenkbomb.github.io/myFlixAngular/'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
//----------------------------------------------------------------------------------------------------------------
let auth = require('./auth')(app);//should be placed after the bodyparser middleware function.
const passport = require('passport');
require('./passport');
/**Below, URL endpoints... 13 in total*/


// home page..-----------------------------------------------------------
app.get('/',(req,res)=>
{
    res.send('hi, welcome to Kens movie night!...:)');
});
//------------------------------------------------------------------------------------------------

//below, adds a NEW USER...--------------------------------------------------------------
/**add a new user */
app.post('/users',

/**in the code below, validation logic has been added to a few important fields: username, password, and email. The validation code first ensures that the fields actually contain something (as each field is required); then, it checks that the data within follows the correct format. After these five checkBody functions comes the error-handling function, which puts any errors that occurred into a new variable that’s sent back to the user in a JSON object as an HTTP response. If an error occurs, the rest of the code will not execute, keeping your database safe from any potentially malicious code. In addition, the client is notified of the error, which will allow them to fix it and resubmit their data if it was, in fact, a harmless mistake.*/

  [ check('Username', 'Username is required').isLength({min: 2}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  async (req, res) => {
     /**check the validation object for errors*/
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

    let hashedPassword = USERS.hashPassword(req.body.Password);
    await USERS.findOne({ Username:req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          USERS
            .create({
              Username: req.body.Username,
              Password:hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });//------------------------------------------------------------------------------------------------

//below, get a MOVIE by title
/**get a movie by title */
app.get('/movies/:Title',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    await MOVIES.findOne({Title:req.params.Title}).then((movie)=>
    {
        res.json(movie);
    }).catch((err)=>
    {
        console.error(err);
        res.status(500).send('Error ' + err);
    })
})//--------------------------------------------------------------------------------------

//below get ALL movies....--------------------------------------------
/**get all movies */
app.get('/movies', passport.authenticate('jwt', { session: false }),
 async(req,res)=>
{
    await MOVIES.find().then((movies)=>
    {
        res.status(200).json(movies);
    }).catch((err)=>
    {
        console.error('error ' + err);
        res.status(500).send('Error ' + err);
    })
    
});

//---------------------------------------------------------------------
//below, just a test endpoint...
app.get('/tests',(req,res)=>
{
    res.send('test here');
});
//---------------------------------------------------------------------

//below,gets a USER by name...-------------------------------------------------------
/**get a user by name */
app.get('/users/:Username',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    await USERS.findOne({Username:req.params.Username}).then((user)=>
    {
        res.json(user);
    }).catch((err)=>
        {
            console.error(err);
            res.status(500).send('Error ' + err);
        })
})
//-----------------------------------------------------------------------------------

//below, get ALL users...----------------------------------------------
/**get all users */
app.get('/users',passport.authenticate('jwt', { session: false }),
async(req,res)=>
{
    await USERS.find().then((users)=>
    {
        res.json(users);
    }).catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    }
    )
   });
//------------------------------------------------------------------------------------------------


/**below, post a new movie...*/
app.post('/movies',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    await MOVIES.findOne({Title:req.body.Title}).then((movie)=>
    {
        if(movie)
        {
            return res.status(400).send(req.body.Title + 'already exists!');
        }
        else {
    MOVIES.create({
        Title:req.body.Title,
        Director:req.body.Director,
        Genre:req.body.Genre,
        Release:req.body.Release,
        Tagline:req.body.Tagline,
        Imagepath:req.body.Imagepath,
        Description:req.body.Description
    }).then((movie)=>
    {
        res.json(movie);   
    }).catch((err)=>
    {
        console.error(err);
        res.status(400).send('Error ' + err);
    }
    )
}
})
})
;
//-----------------------------------------------------------------------------------------------------

//below, adds a new MOVIE to a USERS 'favorites'...-----------------------------------------------------
/**add a new fav movie to a users account */
app.put('/users/:Username/favs/',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await USERS.findOneAndUpdate({Username:req.params.Username},{$push:{Favorites:req.body.MovieID}},{new:true}).then((user)=>
    {
        res.json(user);
    }).catch((err)=>
    {
        console.error(err);
        res.status(500).send('Error ' + err);
    })
    
});//-------------------------------------------------------------------------------------------------------

//below, deletes a MOVIE by name...----------------------------------------------------
/**deletes a movie by name */
app.delete('/movies/:Title',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    await MOVIES.findOneAndDelete({Title:req.params.Title}).then((movie)=>
    {
        if(!movie)
        {
            res.status(400).send(req.params.Title + ' was not found!');
        }
        if(movie){
             res.status(200).send(req.params.Title + ' was removed');
        }
    }).catch(err=>
        {
            console.error(err);
            res.status(500).send('Error '+ err);
        })

});
//-------------------------------------------------------------------------------------------------------
//below, deletes a user by name...
/**delete a user */
app.delete('/users/:Username',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    if(req.user.Username !== req.params.Username){
        console.log('user logged in as: '+ req.user.Username + ' passed this user as param:  ' + req.params.Username);
        return res.status(400).send('Permission denied, you cannot delete other users');
    }
    await USERS.findOneAndDelete({Username:req.params.Username}).then((user)=>
    {
        if(!user)
        {
            res.status(400).send(req.params.Username + ' not found!');
        }
        if(user)
        {
            res.status(200).send(req.params.Username + ' has been removed');
        }
    }).catch(err=>
        {
            console.error(err);
            res.status(500).send('Error '+ err);
        })
    })
//-------------------------------------------------------------------------------------------------------

/**below, delete a movie/favorite from a USERS favorites...*/
app.delete('/users/:Username/favs/:movieID',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await USERS.findOneAndUpdate({Username:req.params.Username},{$pull:{Favorites:req.params.movieID}},{new:true}).then((user)=>
    {
        res.json(user);
    }).catch((err)=>
    {
        console.error(err);
        res.status(500).send('Error ' + err);
    })
    
});


//----------------------------------------------------------------------------------------------------

//below, updates a USER by name...---------------------------------------------------------------------
app.put('/users/:Username',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    //let hashedPassword = USERS.hashPassword(req.body.Password);
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await USERS.findOneAndUpdate({Username:req.params.Username},{$set:{Username:req.body.Username,Password:USERS.hashPassword(req.body.Password),Email:req.body.Email,Birthday:req.body.Birthday}},{new:true}).catch((err)=>
    {
        console.error(err);
        res.status(500).send('Error ' + err);
    }).then((user)=>
    {
        res.json(user);//added this THEN to return the updated user doc to the body, else it seems to hang in postman
    })
    
});
//------------------------------------------------------------------------------------------------
//below, updates a MOVIE by title...--------------------------------------------------------------
app.put('/movies/:Title',passport.authenticate('jwt', { session: false }),async(req,res)=>
{
    await MOVIES.findOneAndUpdate({Title:req.params.Title},{$set:{Title:req.body.Title,Director:req.body.Director,Genre:req.body.Genre,Release:req.body.Release,Tagline:req.body.Tagline,Description:req.body.Description}}).then((movie)=>
    {
        if(!movie)
        {
            res.status(400).send(req.params.Title + ' was not found!');
        }
        if(movie)
        {
            res.json(movie);
        }
    }).catch((err)=>
        {
            console.error(err);
            res.status(500).send('Error ' + err);
        })
})
//------------------------------------------------------------------------------------------------------------
app.get('/documentation',(req,res)=>
{

});


app.use(express.static('public'));



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

//app.listen(8080, () => {
   // console.log('Your app is listening on port 8080.');
 // });

 

 const port = process.env.PORT || 8080;
 app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
 });

