

const jwtSecret = 'your_jwt_secret';//MUST MATCH THE SECRETORKEY VALUE FROM PASSPORT IN JWTSTRATEGY SECTION
const jwt = require('jsonwebtoken');
const passport = require('passport');//THE PASSPORT MODULE/MIDDLEWARE
require('./passport.js');//OUR LOCAL PASSPORT.JS FILE

/*The code BELOW first uses the the LocalStrategy you defined in the previous section to check that the username and password in the body of the request exist in the database. If they do, you use the generateJWTToken(); function to create a JWT based on the username and password, which you then send back as a response to the client. If the username and password don’t exist, you return the error message you receive from LocalStrategy back to the client.*/

let generateJWTToken = (user)=>
{
    return jwt.sign(user,jwtSecret,{
      subject:user.Username,
      expiresIn:'7d',
      algorithm:'HS256'});
}

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right, authentication error ' + user,
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
        /*This is, in fact, ES6 shorthand for res.json({ user: user, token: token }). With ES6, if your keys are the same as your values, you can use this shorthand.*/
      });
    })(req, res);
  });
}