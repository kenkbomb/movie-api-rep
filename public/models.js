const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title:{type:String,required:true},
    Director:{type:String,required:true},
    Genre:{type:String,required:true},
    Release:String,
    Tagline:String,
    Imagepath:String,
    Description:String
})

let userSchema = mongoose.Schema({
    Name:{type:String,required:true},
    Password:{type:String,required:true},
    Email:{type:String,required:true},
    Birthday:Date,
    Favorites:[{type:mongoose.Schema.Types.ObjectId,ref:'Movie'}]
})

const Movie = mongoose.model('Movie',movieSchema);
const User = mongoose.model("User",userSchema);

module.exports.Movie = Movie;
module.exports.User = User;