

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');//USED FOR DECRYPTION/HASHING

let movieSchema = mongoose.Schema({
    Title:{type:String,required:true},
    Director:{type:String,required:true},
    Genre:{type:String,required:true},
    Release:String,
    Tagline:String,
    Imagepath:String,
    Description:String
});

let userSchema = mongoose.Schema({
    Username:{type:String,required:true},
    Password:{type:String,required:true},
    Email:{type:String,required:true},
    Birthday:{type:Date,required:true},
    Favorites:[{type:mongoose.Schema.Types.ObjectId,ref:'Movie'}]
});
//--------------------------------------------------------------------------------------------------------
/**below, code for hashing and validating the users password...*/

userSchema.statics.hashPassword = (password)=>
{
    return bcrypt.hashSync(password,10);
};

userSchema.methods.validatePassword = function(password)
{
    console.log(password + '  ' + this.Password);
    return bcrypt.compareSync(password,this.Password);
};

//-------------------------------------------------------------------------------------------------------
/**below, the movie and user schema models to be exported and used elsewhere in the app(index.js)*/
const Movie = mongoose.model('Movie',movieSchema);
const User = mongoose.model("User",userSchema);

module.exports.Movie = Movie;
module.exports.User = User;