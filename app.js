const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');  

const sequelize = require('./util/database');

const app = express();

const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const GroupUser = require('./models/groupUser');


const userRoutes = require('./routes/user');    
const messageRoutes = require('./routes/message');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/chat', chatRoutes);
app.use('/admin', adminRoutes);

User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User, {through: GroupUser});
User.belongsToMany(Group, {through: GroupUser});

Group.hasMany(Message);
Message.belongsTo(Group);

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

