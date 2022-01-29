let userList = []

const form = document.querySelector('#regForm');
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const email = document.querySelector('#email');
const output = document.querySelector('#users');
let btnText = document.querySelector('#btnText');
let isInEditMode = false;
let userInEditMode = '';

const validateText = (input) => {
  if(input.value.trim() === '') {
    setError(input, 'Name cannot be empty');
    return false;
  }
  else if(input.value.trim().length < 2) {
    setError(input, 'Name must contain at least 2 letters');
    return false;
  }
  else {
    setSuccess(input);
    return true;
  }
}

const validateEmail = email => {
  let regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if(email.value.trim() === '') {
    setError(email, 'You need to enter an email address');
    return false;
  } 
  else if(!regEx.test(email.value)) {
    setError(email, 'Email address is not valid');
    return false;
  }
  else if (alreadyExists(email.value) === true) {
    // console.log('found in validate');
    setError(email, 'Email address already exists');
    return false;
  }
  else {
    setSuccess(email)
    return true;
  }
}

const setError = (input, textMessage) => {
  const parent = input.parentElement;
  parent.classList.add('is-invalid');
  parent.classList.remove('is-valid');
  parent.querySelector('.invalid-input').innerText = textMessage;
}

const setSuccess = input => {
  const parent = input.parentElement;
  parent.classList.remove('is-invalid');
  parent.classList.add('is-valid');
}

const validate = input => {
  switch(input.type) {
    case 'text': return validateText(input)
    case 'email': return validateEmail(input)
    default:
      break;
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();

  errors = []

  for(let i = 0; i < form.length; i++) {
    errors[i] = validate(form[i])
  }
  // console.log(errors)
  if(!errors.includes(false)) {
    if(!isInEditMode){
    const user = {
      id: Date.now().toString(),
      firstName : firstName.value,
      lastName : lastName.value,
      email : email.value
    }
    // console.log(user);
    pushIntoList(user);
    }
   else {
    const user2 = {
      id: userInEditMode,
      firstName : firstName.value,
      lastName : lastName.value,
      email : email.value 
    }
   updateUser(user2);
   btnText.innerHTML='REGISTER';
  } 
    listUsers();
    emptyForm(); 
  }
})

const updateUser = (user) => {
  for(var i = 0; i < userList.length; i++) {
    if(userList[i].id === user.id){
      break;
    }
  }
  if (i<=userList.length) {
  const userEdit = userList[i];
  userEdit.firstName = firstName.value;  
  userEdit.lastName = lastName.value;  
  userEdit.email = email.value;  
  }
}

const emptyForm = () => {
  firstName.value = '';
  lastName.value = '';
  email.value = '';
  firstName.parentElement.classList.remove('is-valid');
  lastName.parentElement.classList.remove('is-valid');
  email.parentElement.classList.remove('is-valid');
  isInEditMode = false;
  userInEditMode = '';
}

const pushIntoList = (newUser) => {
  userList.push(newUser)
}

const listUsers = () => {
  output.innerHTML = '';
  userList.forEach(anv => {
    output.innerHTML += `
   <div class="reg-user" id="${anv.id}">
    <div>
    <p class="column">${anv.firstName} ${anv.lastName}</p>
    <p class="sm">${anv.email}</p>
    </div>
    <div>
    <button id="btnEdit" type="button" class="btn btn-secondary btn-blue">Edit</button>
    <button id="btnRemove" type="button" class="btn btn-secondary">X</button>
    </div>
    </div>
    `;
  })
}

listUsers();

output.addEventListener('click', e => {
  if(e.target.type === 'button') {

    if(e.target.id === 'btnRemove') {
    userList = userList.filter(anv => anv.id !== e.target.parentNode.parentNode.id);
    listUsers();
    }
    else if(e.target.id === 'btnEdit') {
      editUser(e.target.parentNode.parentNode.id);
    }

  }
})

const editUser = (userEditId) => {
  console.log(userEditId);
  for(var i = 0; i < userList.length; i++) {
    if(userList[i].id === userEditId) {
      break;
    }
  }
  if (i<=userList.length) {
  const userEdit = userList[i];
  // console.log(userEdit.firstName);
  fillForm(userEdit); 
  btnText.innerHTML='SAVE CHANGES';
  }
}

const fillForm = (user) => {
  firstName.value = user.firstName;
  lastName.value = user.lastName;
  email.value = user.email;
  firstName.parentElement.classList.remove('is-valid');
  lastName.parentElement.classList.remove('is-valid');
  email.parentElement.classList.remove('is-valid');
  isInEditMode = true;
  userInEditMode = user.id;  
  // console.log(user.firstName);
}

function alreadyExists (email) {
  for(var i = 0; i < userList.length; i++) {
    if(userList[i].email === email && userList[i].id !== userInEditMode){
      // console.log('found');
      return true;
    }
    // else {console.log('not found')}
  }
  return false;
}