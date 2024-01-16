/*passport is an authentication middleware for node.js and express.
It uses blocks of code called strategies to enable certain means of authentication and authorization multiple times throughout your application. Strategies can range from basic HTTP authentication to JWT-based authentication and third party OAuth with specific providers such as Facebook and Google.

npm install passport --save

npm install passport-local --save

npm install passport-jwt --save

npm install jsonwebtoken --save

--save flag is so that each module gets added to package.json
*/

const passport = require('passport'),                 //passport reqs
  LocalStrategy = require('passport-local').Strategy, //passport reqs
  Models = require('./models'),                //imported from the models.js files
  passportJWT = require('passport-jwt');              //passport reqs

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(//below, takes in an object with a username and password field
    {
      usernameField: 'username',
      passwordField: 'password',
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
        /*if(!user.validatePassword(password))
        {
          console.log("incorrect password");
          
          return callback(null, false, { message: 'Incorrect password.' });
        }*/
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
        secretOrKey:'your_jwt_secret'
    },async(jwtpayload,callback)=>
    {
        return await Users.findById(jwtpayload._id).then((user)=>{
            return callback(null,user);
        }).catch((error)=>
        {
            console.log(error);
            return callback(null,error);

        })
    }
))
