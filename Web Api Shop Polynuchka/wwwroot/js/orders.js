const uriOrders = 'api/Orders';
const uriUsers = 'api/Users';
const uriProducts = 'api/Products';
let orders = [];
let users = [];
let products = [];

function getOrders() {
    fetch(uriOrders)
        .then(response => response.json())
        .then(data => {
            orders = data;
            _displayOrders();
        })
        .catch(error => console.error('Unable to get orders.', error));
}

function getUsersAndProducts() {
    Promise.all([
        fetch(uriUsers).then(response => response.json()),
        fetch(uriProducts).then(response => response.json())
    ])
        .then(data => {
            users = data[0];
            products = data[1];
            _populateSelect('add-user', users);
            _populateSelect('add-product', products);
            _populateSelect('edit-user', users);
            _populateSelect('edit-product', products);
        })
        .catch(error => console.error('Unable to get users or products.', error));
}

function _populateSelect(elementId, items) {
    const select = document.getElementById(elementId);
    select.innerHTML = '';
    items.forEach(item => {
        let option = document.createElement('option');
        option.value = item.id;
        option.text = item.name;
        select.appendChild(option);
    });
}

function addOrder() {
    const addUserSelect = document.getElementById('add-user');
    const addProductSelect = document.getElementById('add-product');

    const order = {
        userId: parseInt(addUserSelect.value, 10),
        productId: parseInt(addProductSelect.value, 10)
    };

    fetch(uriOrders, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
        .then(response => response.json())
        .then(() => {
            getOrders();
            addUserSelect.value = '';
            addProductSelect.value = '';
        })
        .catch(error => console.error('Unable to add order.', error));
}

function deleteOrder(id) {
    fetch(`${uriOrders}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getOrders())
        .catch(error => console.error('Unable to delete order.', error));
}

function displayEditForm(id) {
    const order = orders.find(order => order.id === id);

    document.getElementById('edit-id').value = order.id;
    document.getElementById('edit-user').value = order.userId;
    document.getElementById('edit-product').value = order.productId;
    document.getElementById('editOrder').style.display = 'block';
}

function updateOrder() {
    const orderId = document.getElementById('edit-id').value;
    const order = {
        id: parseInt(orderId, 10),
        userId: parseInt(document.getElementById('edit-user').value, 10),
        productId: parseInt(document.getElementById('edit-product').value, 10)
    };

    fetch(`${uriOrders}/${orderId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
        .then(() => getOrders())
        .catch(error => console.error('Unable to update order.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editOrder').style.display = 'none';
}

function _displayOrders() {
    const tBody = document.getElementById('orders');
    tBody.innerHTML = '';

    orders.forEach(order => {
        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let user = users.find(user => user.id === order.userId);
        let textNode1 = document.createTextNode(user ? user.name : 'Unknown User');
        td1.appendChild(textNode1);

        let td2 = tr.insertCell(1);
        let product = products.find(product => product.id === order.productId);
        let textNode2 = document.createTextNode(product ? product.name : 'Unknown Product');
        td2.appendChild(textNode2);

        let td3 = tr.insertCell(2);

        let editButton = document.createElement('button');
        editButton.innerText = 'Змінити';
        editButton.setAttribute('onclick', `displayEditForm(${order.id})`);
        td3.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Видалити';
        deleteButton.setAttribute('onclick', `deleteOrder(${order.id})`);
        td3.appendChild(deleteButton);
    });
}
