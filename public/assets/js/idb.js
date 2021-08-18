let db;

const request = indexedDB.open("pizza_hunt", 1);

request.onupgradeneeded = function (event) {
    // save reference to database
    const db = event.target.result;
    // create an object store for the new pizza, autoincrement
    db.createObjectStore("new_pizza", { autoIncrement: true })
}

request.onsuccess = function (event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result

    if (navigator.onLine) {
        uploadPizza()
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode)
}

// If no internet is available and user attempts to save pizza, this function will run
function saveRecord(record) {
    // establishes connection to the offline db with read and write perms
    const transaction = db.transaction(["new_pizza"], "readwrite");

    // access the objectStore for new_pizza
    const pizzaObjectStore = transaction.objectStore("new_pizza");

    // add the new pizza record to the db
    pizzaObjectStore.add(record)
}

function uploadPizza() {
    const transaction = db.transaction(["new_pizza"], "readwrite");

    const pizzaObjectStore = transaction.objectStore("new_pizza");

    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    // access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    // clear all items in your store
                    pizzaObjectStore.clear();

                    alert('All saved pizza has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

window.addEventListener("online", uploadPizza)