const Message = require('../models/message');
const { Op } = require("sequelize");

exports.saveMessage = async (req, res, next) => {
    try {
        const message = req.body.message;
         //console.log(message);
        if(isValidMessage(message)){
            await req.user.createMessage({
                message: message
            });
            res.status(200).json({message: 'msg saved to database'});
        } else {
            throw new Error('invalid message format');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'something went wrong'});
    }
};

function isValidMessage(message) {
    if(typeof message === 'string' && message.length > 0){
        return true;
    } else {
        return false;
    }
}
exports.fetchNewMessages  = async (req, res, next) => {
    try {
        //const messages = await Message.findAll();
        const lastMsgId = +req.query.lastMsgId;
        console.log('msg id in backend:', lastMsgId);
        const messages = await Message.findAll({where: {id: {[Op.gt]: lastMsgId}}});
        console.log(messages)
        res.status(200).json({messages: messages});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'could not fetch messages'});
    }
}