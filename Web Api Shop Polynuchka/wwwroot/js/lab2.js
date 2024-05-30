const uri = 'api/Categories';
let categories = [];

function getCategories() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get categories.', error));
}

function addCategory() {
    const addNameTextbox = document.getElementById('add-name');

    const category = {
        name: addNameTextbox.value.trim(),
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(response => response.json())
        .then(() => {
            getCategories();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add category.', error));
}

function deleteCategory(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getCategories())
        .catch(error => console.error('Unable to delete category.', error));
}

function displayEditForm(id) {
    const category = categories.find(category => category.id === id);

    document.getElementById('edit-id').value = category.id;
    document.getElementById('edit-name').value = category.name;
    document.getElementById('editCategory').style.display = 'block';
}

function updateCategory() {
    const categoryId = document.getElementById('edit-id').value;
    const category = {
        id: parseInt(categoryId, 10),
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${categoryId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(() => getCategories())
        .catch(error => console.error('Unable to update category.', error));

    closeInput();

    return false;
}


function closeInput() {
    document.getElementById('editCategory').style.display = 'none';
}

function viewProducts(categoryId) {
    window.location.href = `products.html?categoryId=${categoryId}`;
}

function _displayCategories(data) {
    const tBody = document.getElementById('categories');
    tBody.innerHTML = '';

    data.forEach(category => {
        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode = document.createTextNode(category.name);
        td1.appendChild(textNode);

        let td2 = tr.insertCell(1);

        let editButton = document.createElement('button');
        editButton.innerText = 'Змінити';
        editButton.setAttribute('onclick', `displayEditForm(${category.id})`);
        td2.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Видалити';
        deleteButton.setAttribute('onclick', `deleteCategory(${category.id})`);
        td2.appendChild(deleteButton);

        let viewButton = document.createElement('button');
        viewButton.innerText = 'Переглянути товари';
        viewButton.setAttribute('onclick', `viewProducts(${category.id})`);
        td2.appendChild(viewButton);
        
    });

    categories = data;
}
