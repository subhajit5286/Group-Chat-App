const User = require('../models/user');
const Group = require('../models/group');
const GroupUser = require('../models/groupUser');
const { Op } = require('sequelize');

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
        // await newGroup.addUser(user, {
        //     through: {isAdmin: false}
        // });
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
        
        const groupId = newGroup.id;
        console.log(groupId,user)
        const verifiedAdmin = await GroupUser.findOne({where: {[Op.and]: [{userId: req.user.id}, {isAdmin: true}, {groupId: groupId}]}});
        if(!verifiedAdmin){
            return res.status(203).json({message: 'you dont have permissions'});
        };

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

exports.getMembers = async (req, res, next) => {
    try {
        
        const groupId = +req.query.groupId;
        const members = await GroupUser.findAll({where: {groupId: groupId}});
        
       let membersToSend = [];
        for(let i = 0; i < members.length; i ++) {
            const user = await User.findByPk(members[i].userId);

            if(user) {
                let newPart = {};
                const userInGroupUser = await GroupUser.findOne({where: {[Op.and]: [{userId: user.id}, {groupId: groupId}]}});
                newPart['isAdmin'] = userInGroupUser.isAdmin;
                const userToSend = {
                    ...user,
                    ...newPart
                }
                membersToSend.push(userToSend);
            }
        }
         console.log(membersToSend);
        res.status(200).json({members: membersToSend});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'something went wrong'});
    }
}

