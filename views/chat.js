document.getElementById('addForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const message = document.getElementById('text').value;
        const groupId = localStorage.getItem('groupId');
        if(!groupId) {
            alert('Please select a group first.');
            return document.getElementById('text').value = '';
            // throw new Error('no group selected');
        }
        console.log(message)
        const res = await axios.post('http://localhost:5000/message/send', 
        {
            message: message,
            groupId: groupId
        },
        {
            headers: {
                'Authorization': token
            }
        });
        console.log(res)
        document.getElementById('text').value = '';

    } catch (error) {
        console.log('error while sending msg', error);
    }
};
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // const res = await axios.get('http://localhost:5000/message/fetch');
        // if(res.status === 200){
        //     console.log(res.data)
        // }
        localStorage.removeItem('groupId');
        setInterval(() => {
            //fetchMessagesAndShowToUser();
            fetchGroupsAndShowToUser(); 
        }, 1000);  
    } catch (error) {
        console.log(error);
    }
});
async function fetchMessagesAndShowToUser(groupId, intervalId) {
    try {
        //const res = await axios.get('http://localhost:5000/message/fetch');
        // console.log('fetch res', res);
        localStorage.setItem('intervalId', intervalId);
        let oldMessages = JSON.parse(localStorage.getItem('messages'));
        let lastMsgId;
        let messages;
        if(!oldMessages) {
            console.log('no old messages');
            oldMessages = [];
            lastMsgId = 0;
        }else{
        //if(lastMsgId !== 0) {
            messages = oldMessages;
            lastMsgId = oldMessages[oldMessages.length - 1].id;
        }
        console.log('last msg id', lastMsgId);
        // console.log('oldmsgs1', oldMessages);
        //const res = await axios.get(`http://localhost:5000/message/fetchNewMsgs/?lastMsgId=${lastMsgId}`);
        const res = await axios.get(`http://localhost:5000/message/fetchNewMsgs/?lastMsgId=${lastMsgId}&groupId=${groupId}`);
        console.log(res)
        if(res.status === 200){

           // const messages = res.data.messages;
            const newMessages = res.data.messages;
            //let messages = oldMessages.concat(newMessages);
            messages = oldMessages.concat(newMessages);
            if(messages.length > 10){
                messages = messages.slice(messages.length - 10, messages.length);
            }
            // console.log('messages', messages);
            // localStorage.setItem('messages', JSON.stringify(messages));
            // showChatToUser(messages);
        }    
         let currentMsgs = [];
        for(let i =0 ; i < messages.length; i++) {
            if(messages[i].groupId == groupId){
                currentMsgs.push(messages[i]);
            }
        }
        console.log('msgs to show:', currentMsgs);
        localStorage.setItem('messages', JSON.stringify(messages));
        showChatToUser(currentMsgs);
    } catch (error) {
        console.log(error);
    }
};
function showChatToUser(messages) {
    try {
        const chatBody = document.getElementById('chat-body');
        
        chatBody.innerHTML = '';
        messages.forEach((message) => {
           // chatBody.innerHTML += message.message + `<br>`;
            chatBody.innerHTML += `
                <p>
                    ${message.from}: ${message.message}
                </p>
                <br>
            `;
        });
    } catch (error) {
        console.log(error);
    }
}
document.getElementById('new-group-btn').onclick = async (e) => {
    window.location.href = 'createChat.html';
};
document.getElementById('add-user-btn').onclick = async (e) => {
    window.location.href = 'addUser2Gr.html';
};
async function fetchGroupsAndShowToUser() {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/chat/getGroups', {
            headers: {
                'Authorization': token
            }
        });
        console.log('get groups response:', res);
        if(res.status === 200) {
            const groups = res.data.groups;
            showGrouopsToUser(groups);
        }
    } catch (error) {
        console.log(error);
    }
}

function showGrouopsToUser(groups) {
    try {
        // console.log(groups);
        const chatList = document.getElementById('chat-list');
        chatList.innerHTML = '';
        groups.forEach(group => {
            // console.log(group);
            // console.log(group.name);
            chatList.innerHTML += `
                <p id="${group.id}" style="border: 2px solid green; margin: 1px 2px;padding-top: 15px;font-weight: bold;background-color: yellow;">${group.name}</p>
                
            `;
        });
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('chat-list').onclick = async (e) => {
    e.preventDefault();
    try {
        e.target.classList.add('active');
        const previousIntervalId = localStorage.getItem('intervalId');
        if(previousIntervalId) {
            clearInterval(previousIntervalId);
        }
        console.log(e.target.nodeName);
        if(e.target.nodeName === 'P') {
            // e.target.setAttribute('class', 'active');
            const groupId = e.target.id;
            await new Promise((resolve, reject) => {

                localStorage.setItem('groupId', groupId);
                // localStorage.removeItem('messages');

                resolve();
            });
            const token = localStorage.getItem('token');
        //     const res = await axios.post('http://localhost:5000/chat/addUser', 
        // {
        //     headers: {
        //         'Authorization': token
        //     } 
        // });
            const intervalId = setInterval(() => {

                fetchMessagesAndShowToUser(groupId, intervalId);
            }, 1000);
        }
    } catch (error) {
        console.log(error);
    }
}