const EXPRESS     = require('express')
const ROUTER      = EXPRESS.Router()
const JWTTOKEN    = require('jwt-decode')
const JWT         = require('jsonwebtoken')

var connection    = require('../../server')
var userLoggedIN  = null


//revealing his posts only.
ROUTER.post('/profile', (req, res) => {
  var userToken            = req.body


  var decoded              = (JWTTOKEN(userToken.token)).username
  userLoggedIN             = decoded


  var retrieveWitsSqlQuery = 'SELECT * FROM events WHERE username = ?'

  //Retrieve the wits posted by the current user:
  connection.connection.query(retrieveWitsSqlQuery, userLoggedIN,
    function (
      err,
      respond) {
      if (err) {
        res.status(400).json("There is a problem in retrieving the wits of the current user")
      } else {
        res.status(200).send(respond)
      }
    }
  )
})

// Retrieving wits liked by the current user:
ROUTER.post('/likedWitsTab', (req, res) => {
  var userInfo                = req.body

  var decoded                 = (JWTTOKEN(userInfo.token)).username

  userLoggedIN                = decoded

  var defaultWitTableSqlQuery = 'UPDATE events ' +
                                'SET boolValue = false'

  var updateWitTableSqlQuery  = 'UPDATE events ' +
                                'INNER JOIN likes ON ' +
                                '(events.wit_id = likes.wit_id AND likes.username = ?) ' +
                                'SET events.boolValue =true'


  var retrieveWitSqlQuery = 'Select * FROM events WHERE boolValue =1'

  //Updating the boolValue to its default value false (which means no one liked the wits)
  connection.connection.query(defaultWitTableSqlQuery, userLoggedIN,
    function (
      err) {
        if (err) {
          res.status(400).json("There is a problem in putting the default Value for boolValue in events table");
        }
    }
  )

  //Update the value of BoolValue to 1 if the current User liked the wits
  connection.connection.query(updateWitTableSqlQuery, userLoggedIN,
    function (
      err) {
        if (err) {
          res.status(400).json("There is a problem in setting the value for boolValue in events table");
        }
        else {
          //Retrieve the wits which were liked by the current user and send it to the frontend
          connection.connection.query(retrieveWitSqlQuery,
            function (
              err,
              respond) {
                if (err) {
                  res.status(400).json("There was a problem in retrieving the wits which the user liked");
                } else {
                  res.status(200).send(respond);
                }
            }
          )
        }
    }
  )
})

// username request method
ROUTER.post('/editUsername', function (req, res) {
  let userData = req.body;

  // editing the username
  if (userData.username != null) {

    // condition - if the username is already in the database (because it has to be a unique username)
    if (userData.username == userLoggedIN) {
      res.status(401).json("Username entered is the same as the original username")
      return
    }

    //checks if the username exists in the database
    var sqlCheckSqlQuery = 'SELECT * FROM users WHERE username = ?'

    connection.connection.query(sqlCheckSqlQuery, userData.username,
      function (
        err,
        respond) {
        if (err) {
          res.status(400).json("There is a problem retrieving the username in the database")
        }
        if (respond.length == 1) {
          res.status(401).json("This username is already taken")
        }
      })

    //selects the id of the username in the database
    var editSqlQuery = 'Select user_id from users WHERE username = ?'

    connection.connection.query(editSqlQuery, userLoggedIN,
      function
        (err,
          respond) {
        if (err) {

          res.status(400).json("Error from retrieving the user_id sql");
        } else {

            // changes the username in the database
            var updateSqlQuery = 'UPDATE users SET username = ? WHERE user_id = ?'
            connection.connection.query(updateSqlQuery, [userData.username, respond[0].user_id],
              function (
                err) {
                if (err) {
                  res.status(400).json("Error from updating the username in the sql")

                } else {
                    userLoggedIN = userData.username;
                    let payload = { username: userLoggedIN }
                    let token = JWT.sign(payload, 'secretKey')
                    res.status(200).send({ token })
                }
            })
        }
      })
  }
})

// password request method
ROUTER.post('/editEmail', (req, res) => {
  var userData = req.body;

  if (userData.email != null) {

    //checks if the email exists in the database
    var checkSqlQuery = 'SELECT * FROM users WHERE email = ?'

    var editEmailSqlQuery = 'UPDATE users SET email = ? WHERE username = ?'

    //Check if the email already exists --> email is unique
    connection.connection.query(checkSqlQuery, [userData.email],
      function (
        err,
        respond) {
          if (err) {
            res.status(400).json("There is a problem retrieving the email in the database")
          } else {
            if (respond.length == 1) {
              res.status(401).json("This email is already taken")
            }
          }
      }
    )

    //changes the email in the database
    connection.connection.query(editEmailSqlQuery, [userData.email, userLoggedIN],
      function (
        err) {
          if (err) {
            res.status(400).json("Error from updating the email in the sql")
          } else {
            let payload = { username: userLoggedIN };
            let token = JWT.sign(payload, 'secretKey');
            res.status(200).send({ token });
          }
      }
    )
  }
})

// age request method
ROUTER.post('/editAge', (req, res) => {
  var userData = req.body;

  if (userData.age != null) {


    var editAgeSqlQuery = 'UPDATE users SET age = ? WHERE username = ?'

    // changes the age in the database
    connection.connection.query(editAgeSqlQuery, [userData.age, userLoggedIN],
      function (
        err) {
          if (err) {
            res.status(400).json("Error from updating the age in the sql")
          } else {
            let payload = { username: userLoggedIN }
            let token = JWT.sign(payload, 'secretKey')
            res.status(200).send({ token })
          }
      })
  }
})

// reset password method
ROUTER.post('/resetPassword', (req, res) => {
  var userData = req.body;

  var oldPassword = userData.oldPassword
  var newPassword = userData.password

  if (oldPassword != null) {

    var checkSqlQuery = "SELECT password from users WHERE username = ?"

    var newPassSqlQuery = 'UPDATE users SET password = ? WHERE username = ?'

    //check if the password exists in the database
    connection.connection.query(checkSqlQuery, userLoggedIN,
      function (
        err,
        respond) {
          if (err) {
            res.status(400).json("Error from retrieving the password from sql")
          } else {
            password_sql = respond[0].password
              if (password_sql != oldPassword) {
                res.status(401).json("Wrong password")
              } else {
                if (newPassword != null) {

                  // changes the password in the database
                  connection.connection.query(newPassSqlQuery, [newPassword, userLoggedIN],
                    function (
                      err,
                      respond2) {
                      if (err) {
                        res.status(400).json("There was a problem updating the password in the query")
                      } else {
                        res.status(200).send(respond2)
                      }
                    }
                  )
                }
              }
            }
      }
    )
  }
}
)

// send token request
ROUTER.post('/User', (req, res) => {
  var userToken = req.body

  decoded = JWTTOKEN(userToken.token).username;

  userLoggedIN = decoded

  res.status(200).json("Received token: " + userLoggedIN);
})

module.exports = ROUTER;
