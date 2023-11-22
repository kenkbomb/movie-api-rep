const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();
const logStream = fs.createWriteStream(path.join(__dirname,'log.txt'),{flags:'a'});

app.use(morgan('combined', {stream: logStream}));

let topMovies = [
{
    Title:'Blade Runner 2049',
    Director:'Denis Villenueve',
    year: '2017'
},
{
    Title:'Batman Forever',
    Director:'Joel Schumacher',
    year:'1998'
},
{
    Title:'The Highlander',
    Director:'Russel Mulcahy',
    year:'1986'
},
{
    Title:'Night of the Living Dead',
    Director:'George A Romero',
    year: '1968'
},
{
    Title:'Dumb and Dumber',
    Director: 'Peter Farrelly',
    year:'1994'
},
{
    Title:'Taxi Driver',
    Director: 'Martin Scorsecse',
    year: '1976'
},
{
    Title:'Rocky 3',
    Director: 'Slyvester Stallone',
    year: '1979'
},
{
    Title: 'Masters of the universe',
    Director: 'Gary Goddard',
    year: '1987'
},
{
    Title: 'Fist of the North Star',
    Director:'Toyoo Ashida',
    year: '1986'
},
{
    Title: 'M3gan',
    Director:'Gerard Johnstone',
    year:'2022'
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

app.use(express.static('public'));



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });