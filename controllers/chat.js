const User = require('../models/user');
const Group = require('../models/group');
const GroupUser = require('../models/groupUser');

exports.addParticipant = async (req, res, next) => {
    try {
        const email = req.body.email;
        let user = await User.findOne({where: {email: email}});
        if(!user){
            return res.status(204).json({message: 'email is not registered'})
        }
        const newGroup = await req.user.createGroup();
        console.log(newGroup)
        await newGroup.addUser(req.user, {
            through: {isAdmin: true}
        });
        await newGroup.addUser(user, {
            through: {isAdmin: false}
        });
        res.status(200).json({group: newGroup, message: 'added new user to group'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'something went wrong'});
    }
};
exports.addUser1 = async (req,res,next) =>{
     try {
        const email = req.body.email;
        const group = req.body.groupName;
        let user = await User.findOne({where: {email: email}});
        if(!user){
            return res.status(204).json({message: 'email is not registered'})
        }
        const newGroup = await Group.findOne({where: {name: group}});;
        console.log(newGroup,user)
        await newGroup.addUser(user, {
            through: {isAdmin: false}
        });
        res.status(200).json({group: newGroup, message: 'added new user to group'});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: 'something went wrong'});
    }
};

exports.setGroupName = async (req, res, next) => {
    try {
        const groupName = req.body.groupname;
        const groupId = req.body.groupid;
        console.log(groupName);
        if(groupName.length > 0 && typeof groupName === 'string') {
            const group = await Group.findByPk(groupId);
            await group.update({name: groupName});
            res.status(200).json({message: 'group name updated'});
        }else {
            throw new Error('invalid group name');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'something went wrong'});
    }
}

exports.getGroups = async (req, res, next) => {
    try {
        //const groups = await req.user.getGroups();
        const groups = await Group.findAll();
        if(groups.length === 0) {
            return res.status(201).json({message: 'no groups currently'});
        }
        res.status(200).json({groups: groups});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'something went wrong'});
    }
}