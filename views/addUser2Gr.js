document.getElementById('add-user-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const participantEmail = document.getElementById('add-user-email').value;
        const groupName =  document.getElementById('add-user-group').value;
        console.log(token,participantEmail)
        const res = await axios.post('http://localhost:5000/chat/addUser', {
            email: participantEmail, groupName: groupName
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
            //localStorage.setItem('createdGroupId', group.id);
            window.location.href = 'chat.html';
        }
        if(res.status === 204) {
            alert('Email is not registered. Please send them an invite.');
            window.location.href = 'chat.html';
        }
    } catch (error) {
        console.log(error);
    }
};