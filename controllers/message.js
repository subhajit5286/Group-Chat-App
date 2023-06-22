const Message = require('../models/message');

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