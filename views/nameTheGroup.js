document.getElementById('group-name-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const groupname = document.getElementById('groupname');
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/chat/nameTheGroup', 
            {groupname: groupname.value, groupid: localStorage.getItem('createdGroupId')},
            {
                headers: {
                    'Authorization': token
                } 
            } 
        );
        console.log('naming grp response:', res);
        if(res.status === 200) {
            window.location.href = 'chat.html';
        }
    } catch (error) {
        console.log(error);
    }
};