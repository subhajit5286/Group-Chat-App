var form=document.getElementById('addForm')

form.addEventListener('submit', saveUser);//

 async function saveUser(e){
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails ={
            name: e.target.name.value,
            email: e.target.email.value,
            phonenumber: e.target.phonenumber.value,
            password: e.target.password.value

        }
        console.log(signupDetails)
         let response = await axios.post("http://localhost:5000/user/signup",signupDetails)
        
        console.log(response.status,response.data)
        if(response.status === 201) {
            alert('Successfully Signed Up')
          window.location.href = "./login.html"

        } else if(response.status === 202) {
            alert('User Already Exist Please Login')
          window.location.href = "./login.html"

        } else {
          throw new Error('Failed to login')

        }

  }
  catch(err){
      document.body.innerHTML += `<div style="color:red;">${err} <div> `

  }
     
    
}
