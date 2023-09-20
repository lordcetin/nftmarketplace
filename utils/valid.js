let valid = (name, email, password, confPass) => {

  if(name == "" || email == "" || password == "" || confPass == ""){
  return 'Please add all fields.'
  }
 if(!validateEmail(email)){
  return 'Invalid Email'
  }
if(password.length < 8){
  return 'Password must be at least 8 characters.'
  }
if(password !== confPass){
  return 'Confirm password did not match.'
  }
}


function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default valid