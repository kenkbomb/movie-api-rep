const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
// const bparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const logStream = fs.createWriteStream(path.join(__dirname,'log.txt'),{flags:'a'});

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
}


];

app.get('/',(req,res)=>
{
    res.send('hi, welcome to Kens movie night!');
});

app.get('/movies',(req,res)=>
{
    res.json(topMovies);
});

app.get('/tests',(req,res)=>
{
    res.send('test here');
});

app.get('/movies/:title',(req,res)=>
{
//should return a movie by title...
res.send('found it');
});

app.post('/movies',(req,res)=>
{
//posts a new movie
res.send('add a new movie');
});

app.post('/users/movies',(req,res)=>
{
    res.send('add a new movie to this users file');
});

app.delete('/movies',(req,res)=>
{
//deletes a movie
res.send('delete a movie');
});

app.delete('/users/movies',(req,res)=>
{
    res.send('delete a movie from this users file');
});

app.post('/users',(req,res)=>
{
//adds a new user
res.send('add a new user');
});

app.put('/users',(req,res)=>
{
//allows user to update their username
res.send('allows user to update their username')

});

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