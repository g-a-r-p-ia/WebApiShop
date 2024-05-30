const uri = 'api/Products';
let products = [];

function getProducts(categoryId) {
    fetch(`${uri}?categoryId=${categoryId}`)
        .then(response => response.json())
        .then(data => _displayProducts(data))
        .catch(error => console.error('Unable to get products.', error));
}

function addProduct() {
    const addNameTextbox = document.getElementById('add-name');
    const addCostTextbox = document.getElementById('add-cost');
    const addCountTextbox = document.getElementById('add-count');

    const product = {
        name: addNameTextbox.value.trim(),
        cost: parseInt(addCostTextbox.value.trim(), 10),
        count: addCountTextbox.value.trim(),
        categoryId: parseInt(new URLSearchParams(window.location.search).get('categoryId'), 10)
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(() => {
            getProducts(product.categoryId);
            addNameTextbox.value = '';
            addCostTextbox.value = '';
            addCountTextbox.value = '';
        })
        .catch(error => console.error('Unable to add product.', error));
}

function deleteProduct(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getProducts(parseInt(new URLSearchParams(window.location.search).get('categoryId'), 10)))
        .catch(error => console.error('Unable to delete product.', error));
}

function displayEditForm(id) {
    const product = products.find(product => product.id === id);

    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-cost').value = product.cost;
    document.getElementById('edit-count').value = product.count;
    document.getElementById('editProduct').style.display = 'block';
}

function updateProduct() {
    const productId = document.getElementById('edit-id').value;
    const product = {
        id: parseInt(productId, 10),
        name: document.getElementById('edit-name').value.trim(),
        cost: parseInt(document.getElementById('edit-cost').value.trim(), 10),
        count: document.getElementById('edit-count').value.trim(),
        categoryId: parseInt(new URLSearchParams(window.location.search).get('categoryId'), 10)
    };

    fetch(`${uri}/${productId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(() => getProducts(product.categoryId))
        .catch(error => console.error('Unable to update product.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editProduct').style.display = 'none';
}

function _displayProducts(data) {
    const tBody = document.getElementById('products');
    tBody.innerHTML = '';

    data.forEach(product => {
        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode = document.createTextNode(product.name);
        td1.appendChild(textNode);

        let td2 = tr.insertCell(1);
        let costNode = document.createTextNode(product.cost);
        td2.appendChild(costNode);

        let td3 = tr.insertCell(2);
        let countNode = document.createTextNode(product.count);
        td3.appendChild(countNode);

        let td4 = tr.insertCell(3);

        let editButton = document.createElement('button');
        editButton.innerText = 'Змінити';
        editButton.setAttribute('onclick', `displayEditForm(${product.id})`);
        td4.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Видалити';
        deleteButton.setAttribute('onclick', `deleteProduct(${product.id})`);
        td4.appendChild(deleteButton);
    });

    products = data;
}
