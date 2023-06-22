document.getElementById('addForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const message = document.getElementById('text').value;
        console.log(message)
        const res = await axios.post('http://localhost:5000/message/send', 
        {
            message: message
        },
        {
            headers: {
                'Authorization': token
            }
        });
        console.log(res)

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
        setInterval(() => {
            fetchMessagesAndShowToUser();
        }, 1000);  
    } catch (error) {
        console.log(error);
    }
});
async function fetchMessagesAndShowToUser() {
    try {
        const res = await axios.get('http://localhost:5000/message/fetch');
        // console.log('fetch res', res);
        if(res.status === 200){

            const messages = res.data.messages;
            showChatToUser(messages);
        }    
    } catch (error) {
        console.log(error);
    }
};
function showChatToUser(messages) {
    try {
        const chatBody = document.getElementById('chat-body');
        
        chatBody.innerHTML = '';
        messages.forEach((message) => {
            chatBody.innerHTML += message.message + `<br>`;
        });
    } catch (error) {
        console.log(error);
    }
}