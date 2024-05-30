const uri = 'api/Users';
let users = [];

function getUsers() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayUsers(data))
        .catch(error => console.error('Unable to get users.', error));
}

function addUser() {
    const addNameTextbox = document.getElementById('add-name');
    const addLoginTextbox = document.getElementById('add-login');
    const addPasswordTextbox = document.getElementById('add-password');

    const user = {
        name: addNameTextbox.value.trim(),
        login: addLoginTextbox.value.trim(),
        password: addPasswordTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(() => {
            getUsers();
            addNameTextbox.value = '';
            addLoginTextbox.value = '';
            addPasswordTextbox.value = '';
        })
        .catch(error => console.error('Unable to add user.', error));
}

function deleteUser(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getUsers())
        .catch(error => console.error('Unable to delete user.', error));
}

function displayEditForm(id) {
    const user = users.find(user => user.id === id);

    document.getElementById('edit-id').value = user.id;
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-login').value = user.login;
    document.getElementById('edit-password').value = user.password;
    document.getElementById('editUser').style.display = 'block';
}

function updateUser() {
    const userId = document.getElementById('edit-id').value;
    const user = {
        id: parseInt(userId, 10),
        name: document.getElementById('edit-name').value.trim(),
        login: document.getElementById('edit-login').value.trim(),
        password: document.getElementById('edit-password').value.trim()
    };

    fetch(`${uri}/${userId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(() => getUsers())
        .catch(error => console.error('Unable to update user.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editUser').style.display = 'none';
}

function _displayUsers(data) {
    const tBody = document.getElementById('users');
    tBody.innerHTML = '';

    data.forEach(user => {
        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode1 = document.createTextNode(user.name);
        td1.appendChild(textNode1);

        let td2 = tr.insertCell(1);
        let textNode2 = document.createTextNode(user.login);
        td2.appendChild(textNode2);

        let td3 = tr.insertCell(2);
        let textNode3 = document.createTextNode(user.password);
        td3.appendChild(textNode3);

        let td4 = tr.insertCell(3);

        let editButton = document.createElement('button');
        editButton.innerText = 'Змінити';
        editButton.setAttribute('onclick', `displayEditForm(${user.id})`);
        td4.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Видалити';
        deleteButton.setAttribute('onclick', `deleteUser(${user.id})`);
        td4.appendChild(deleteButton);
    });

    users = data;
}

