const {
  authenticate,
  findUserByToken,
  // createUser,
  // updateUser,
  // updatePass
} = require('../db');

const express = require('express');
const app = express.Router();
const { isLoggedIn, isAdmin } = require('./middleware');

app.post('/register', async(req, res, next)=> {
  try {
    res.send(await createUser({username: req.body.username, password: req.body.password, is_admin: false, is_vip: false}));
  } catch (ex) {
    next(ex);
  }
})

app.put('/updateUser', async(req, res, next)=> {
  try {
    res.send(await updateUser({id: req.body.id, username: req.body.username}))
  } catch (ex) {
    next(ex)
  }
})

app.put('/updatePass', async(req, res, next)=> {
  try {
    res.send(await updatePass({id: req.body.id,  password: req.body.password}))
  } catch (ex) {
    next(ex)
  }
})

app.put('/adminUpdate', isAdmin, async(req, res, next)=> {
  try {
    res.send(await updateUser({username: req.body.username, password: req.body.password, is_admin: req.body.is_admin, is_vip: req.body.is_vip}))
  } catch (ex) {
    next(ex)
  }
})

app.post('/login', async(req, res, next)=> {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  }
  catch(ex){
    next(ex);
  }
});


app.get('/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  } 
  catch(ex){
    next(ex);
  }
});

module.exports = app;
