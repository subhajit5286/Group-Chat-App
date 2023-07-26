const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');  

const sequelize = require('./util/database');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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

// app.use('/', function (req, res) {
//   res.sendFile(path.join(__dirname , 'views/login.html'));
// })

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/chat', chatRoutes);
app.use('/admin', adminRoutes);
app.use((req,res)=>{
  res.sendFile(path.join(__dirname,`${req.url}`));
})
User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User, {through: GroupUser});
User.belongsToMany(Group, {through: GroupUser});

Group.hasMany(Message);
Message.belongsTo(Group);

var onlineusers=0
var onlineusers1=0;

var cns = io.of('/chat1')

cns.on('connection', (socket) => { 
  onlineusers1++
  console.log('connected1',onlineusers1) 
  cns.emit('user-connected', onlineusers1)
  
  socket.on('groups',groups=>{
    cns.emit('group-s',groups)
  })
  socket.on('messages',messages=>{
    cns.emit('messages-s',messages)
  })

  socket.on('disconnect',()=>{
    onlineusers1--
    console.log('disconnected1',onlineusers1) 
    cns.emit('user-connected', onlineusers1)
  })
});

// io.on('connection', (socket) => { 
//   onlineusers++
//   //io.emit('user-connected', onlineusers)
//   console.log('connected',onlineusers) 
//   socket.on('email',email=>{
//     console.log(email,onlineusers)
//     //socket.broadcast.emit('user-connected', onlineusers)
//   })
//   socket.on('disconnect',()=>{
//     onlineusers--
//    //socket.broadcast.emit('user-connected', onlineusers)
//     console.log('disconnected',onlineusers) 
//   })
// });

sequelize 
  .sync({force:false}) 
  .then(result => {
    //console.log(result);
    server.listen(5000,()=>{
        console.log('server running')
    })
})
.catch(err => {
    console.log(err);
});

