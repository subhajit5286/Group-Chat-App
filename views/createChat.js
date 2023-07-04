document.getElementById('new-chat-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const participantEmail = document.getElementById('chat-mate-email').value;
        console.log(token,participantEmail)
        const res = await axios.post('http://localhost:5000/chat/addParticipant', {
            email: participantEmail
        },
        {
            headers: {
                'Authorization': token
            } 
        });
        console.log(res);
        if(res.status === 200) {
            console.log(res.data.group);
            const group = res.data.group;
            localStorage.setItem('createdGroupId', group.id);
            window.location.href = 'nameTheGroup.html';
        }
        if(res.status === 204) {
            alert('Email is not registered. Please send them an invite.');
            window.location.href = 'chat.html';
        }
    } catch (error) {
        console.log(error);
    }
};