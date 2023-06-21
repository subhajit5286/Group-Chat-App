document.getElementById('addForm').onsubmit = async (e) => {
    e.preventDefault();

    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let res = await axios.post('http://localhost:5000/user/login', {email, password});
        console.log(res);
        if(res.status === 200) {
            email.value = '';
            password.value = '';
            confirm('User logged in successfully!');

            localStorage.setItem('token', res.data.token);

            // window.location.href = 'tracker.html';
        }  

    } catch (error) {
        console.log(error);

        if(error.response.status === 401) {
            alert('Password is incorrect!');
        }
        if(error.response.status === 404) {
            alert('User doesnot exist!');
        }
    }

};