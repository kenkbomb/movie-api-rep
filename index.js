const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
// const bparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const app = express();
const logStream = fs.createWriteStream(path.join(__dirname,'log.txt'),{flags:'a'});
// const mongoose = require('mongoose');
const models = require('./public/models');

const MOVIES = models.Movie;
const USERS = models.User;

mongoose.connect('mongodb://localhost:27017/myFlexDB', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(morgan('combined', {stream: logStream}));
// app.use(bodyParser.json());

let topMovies = [
{
    Title:'Blade Runner 2049',
    Director:'Denis Villenueve',
    year: '2017',
    genre:'science fiction'
},
{
    Title:'Batman Forever',
    Director:'Joel Schumacher',
    year:'1998',
    genre:'thriller'
},
{
    Title:'The Highlander',
    Director:'Russel Mulcahy',
    year:'1986',
    genre:'action/fantasy'
},
{
    Title:'Night of the Living Dead',
    Director:'George A Romero',
    year: '1968',
    genre:'horror'
},
{
    Title:'Dumb and Dumber',
    Director: 'Peter Farrelly',
    year:'1994',
    genre:'comedy'
},
{
    Title:'Taxi Driver',
    Director: 'Martin Scorsecse',
    year: '1976',
    genre:'drama'
},
{
    Title:'Rocky 3',
    Director: 'Slyvester Stallone',
    year: '1979',
    genre:'drama'
},
{
    Title: 'Masters of the universe',
    Director: 'Gary Goddard',
    year: '1987',
    genre:'action'
},
{
    Title: 'Fist of the North Star',
    Director:'Toyoo Ashida',
    year: '1986',
    genre:'anime'
},
{
    Title: 'M3GAN',
    Director:'Gerard Johnstone',
    year:'2022',
    genre:'horror'
},
{
    Title:'The Shining',
    Director:'Stanley Kubrick',
    year:'1978',
    genre:'horror'
}
];
// home page..-----------------------------------------------------------
app.get('/',(req,res)=>
{
    res.send('hi, welcome to Kens movie night!');
});//--------------------------------------------------------------------
//below,get a MOVIE by title
app.get('/movies/:Title',async(req,res)=>
{
    await MOVIES.findOne({Title:MOVIES.params.Title}).then((movie)=>
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
        res.status(201).json(users);
    }).catch((err)=>{console.error(err);
        res.status(500).send('Error' + err);
    }
    )
   });
//----------------------------------------------------------------------

app.post('/movies',(req,res)=>
{
//posts a new movie
res.send('add a new movie');
});
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
app.delete('/users/movies',(req,res)=>
{
    res.send('delete a movie from this users file');
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

//below, deletes a USER by ...
app.delete('/users',(req,res)=>
{
    res.send('deletes a user');
});
//------------------------------------------------------------------------------------------------

//below, updates a USER by name...---------------------------------------------------------------------
app.put('/users/:Username',async(req,res)=>
{
    await USERS.findOneAndUpdate({Username:req.params.Username},{$set:{Username:req.body.username,Password:req.body.Password,Email:req.body.Email,Birthday:req.body.Birthday}},{new:true}).catch((err)=>
    {
        console.error(err);
        res.status(500).send('Error ' + err);
    })

});
//------------------------------------------------------------------------------------------------
//below, updates a MOVIE by title...--------------------------------------------------------------
app.get('/movies/:Title',async(req,res)=>
{
    await findOneAndUpdate({Title:req.params.Title},{$set:{Title:req.body.Title,Director:req.body.Director,Genre:req.body.genre,Release:req.body.release,Tagline:req.body.Tagline,Description:req.body.Description}}).then((movie)=>
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