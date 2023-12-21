const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
// const bparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
// const { default: mongoose } = require('mongoose');
const app = express();
const logStream = fs.createWriteStream(path.join(__dirname,'log.txt'),{flags:'a'});
const mongoose = require('mongoose');
const models = require('./public/models');

const MOVIES = models.Movie;
const USERS = models.User;

mongoose.connect('mongodb://127.0.0.1:27017/myFlexDB', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(morgan('combined', {stream: logStream}));
// app.use(bodyParser.json());


// home page..-----------------------------------------------------------
app.get('/',(req,res)=>
{
    res.send('hi, welcome to Kens movie night!');
});//--------------------------------------------------------------------

//below, get a MOVIE by title
app.get('/movies/:Title',async(req,res)=>
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
app.get('/movies',async(req,res)=>
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
app.get('/tests',(req,res)=>
{
    res.send('test here');
});
//---------------------------------------------------------------------

//below,gets a USER by name...-------------------------------------------------------
app.get('/users/:username',async(req,res)=>
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
app.get('/users',async(req,res)=>
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
//----------------------------------------------------------------------

app.post('/movies',async(req,res)=>
{
    await MOVIES.findOne({Title:req.body.Title}).then((movie)=>
    {
        if(movies)
        {
            return res.status(400).send(req.body.Title + 'already exists!');
        }
        else {
    
    
     MOVIES.create({
        Title:req.body.Title,
        Director:req.body.Director,Genre:req.body.Genre,Release:req.body.Release,Tagline:req.body.Tagline,Imagepath:req.body.Imagepath,Description:req.body.Description
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
app.post('/users/:Username/movies/:MovieID',async(req,res)=>
{
    await USERS.findOneAndUpdate({Username:req.params.Username},{$push:{Favorites:req.params.MovieID}},{new:true}).then((user)=>
    {
        res.json(user);
    }).catch((err)=>
    {
        console.error(err);
        res.status(500).send('Error ' + err);
    })
    
});//-------------------------------------------------------------------------------------------------------

//below, deletes a MOVIE by name...----------------------------------------------------
app.delete('/movies/:Title',async(req,res)=>
{
    await MOVIES.findOneAndRemove({Title:req.params.Title}).then((movie)=>
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

//below, delete a movie/favorite from a USERS file...----------------------------------
app.post('/users/:Username/movies/:MovieID',async(req,res)=>
{
    await USERS.findOneAndUpdate({Username:req.params.Username},{$pop:{Favorites:req.params.MovieID}},{new:true}).then((user)=>
    {
        res.json(user);
    }).catch((err)=>
    {
        console.error(err);
        res.status(500).send('Error ' + err);
    })
    
});

//below, adds a NEW USER...--------------------------------------------------------------
app.post('/users',async(req,res)=>
{
    await USERS.findOne({Username:req.body.Username})
   .then((user)=>
   {
    if(user)
    {
        return res.status(400).send(req.Username + 'already exists!');
    }
    else{
        users.create({
            Username:req.body.Username,
            Password:req.body.Password,
            Email:req.body.Email,
            Birthday:req.body.Birthday
        }).then((user)=>{
            res.status(201).json(user)}).catch((error)=>
            {
                console.error(error);
                res.status(500).send('Error ' + error);
            })
        }
    })
    
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});
//------------------------------------------------------------------------------------------------


//below, updates a USER by name...---------------------------------------------------------------------
app.put('/users/:Username',async(req,res)=>
{
    await USERS.findOneAndUpdate({Username:req.params.Username},{$set:{Username:req.body.Username,Password:req.body.Password,Email:req.body.Email,Birthday:req.body.Birthday}},{new:true}).catch((err)=>
    {
        console.error(err);
        res.status(500).send('Error ' + err);
    })

});
//------------------------------------------------------------------------------------------------
//below, updates a MOVIE by title...--------------------------------------------------------------
app.get('/movies/:Title',async(req,res)=>
{
    await findOneAndUpdate({Title:req.params.Title},{$set:{Title:req.body.Title,Director:req.body.Director,Genre:req.body.Genre,Release:req.body.Release,Tagline:req.body.Tagline,Description:req.body.Description}}).then((movie)=>
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });