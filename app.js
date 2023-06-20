const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');  

const sequelize = require('./util/database');

const app = express();

const User = require('./models/user');


const userRoutes = require('./routes/user');    

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use('/user', userRoutes);


sequelize 
  .sync({force:false}) 
  .then(result => {
    //console.log(result);
    app.listen(5000,()=>{
        console.log('server running')
    })
})
.catch(err => {
    console.log(err);
});

