const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');  

const sequelize = require('./util/database');

const app = express();

const User = require('./models/user');
const Message = require('./models/message');


const userRoutes = require('./routes/user');    
const messageRoutes = require('./routes/message');

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use('/user', userRoutes);
app.use('/message', messageRoutes);

User.hasMany(Message);
Message.belongsTo(User);

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

