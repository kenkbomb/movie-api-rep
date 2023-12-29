const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./public/models'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ Username: username })
      .then((user) => {
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        console.log('finished');
        return callback(null, user);
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);


passport.use(new JWTStrategy(
    {
        jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey:'yourJTWSecret'
    },async(jwtpayload,callback)=>
    {
        return await Users.findById(jwtpayload._id).then((user)=>{
            return callback(null,user);
        }).catch((error)=>
        {
            console.log(errorr);
            return callback(null,error);

        })
    }
))
