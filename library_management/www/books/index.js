// Function to initialize the form modal by optionally populating the form fields with book details
function initModal(docName='') {
  if (docName) {
    // Load document to be updated
    frappe.call({
      method: 'frappe.client.get',
      args: {
        doctype: 'Book',
        name: docName
      },
      callback: function(response) {
        if (response.message) {
          const book = response.message;
        
          document.getElementById("formModalLabel").innerText = "Update Book";
          const submitButton = document.getElementById("submitButton");
          submitButton.innerText = "Update Book";
          submitButton.onclick = updateDoc;

          // Populate the form fields with book details
          document.getElementById("docName").value = book.name;
          document.getElementById("title").value = book.title;
          document.getElementById("author").value = book.author;
          document.getElementById("isbn").value = book.isbn;
          document.getElementById("genre").value = book.genre;
          document.getElementById("publication_year").value = book.publication_year;
          document.getElementById("status").value = book.status;

        } else {
          console.error('Book not found');
        }
      },
      error: function(err) {
        console.error(err);
      }
    });
  } else {
    // Display an empty form for adding a new document
    document.getElementById("formModalLabel").innerText = "Add a new Book";
    const submitButton = document.getElementById("submitButton");
    submitButton.innerText = "Add Book";
    submitButton.onclick = addDoc;

    // Reset the form fields in case they have been populated from a previous update command
    document.getElementById("docName").value = '';
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("isbn").value = '';
    document.getElementById("genre").value = '';
    document.getElementById("publication_year").value = '';
    document.getElementById("status").value = '';
  }
}

// Function to add a doc
function addDoc() {
  const docData = {};
  
  // Prepare data to be sent as payload in post request
  docData['title'] = document.getElementById('title').value;
  docData['author'] = document.getElementById('author').value;
  docData['publication_year'] = document.getElementById('publication_year').value;
  docData['genre'] = document.getElementById('genre').value;
  const isbn = document.getElementById('isbn').value;
  if (isbn) docData['isbn'] = isbn;
  docData['status'] = document.getElementById('status').value;

  // if a file has been selected, upload it and then update the doc
  const file = document.getElementById('image').files[0];
  if (file) {
    docData['image'] = '/files/' + file.name;
    uploadFile(file)
      .then(() => {
        addDocInBackend(docData);
      })
      .catch(e => console.error(e));
  } else {
    addDocInBackend(docData);
  }
}

// Function to delete a doc
function deleteDoc() {
  const docName = document.getElementById("docName").value;
  frappe.call({
    method: 'library_management.api.book_api.delete_book',
    args: {
      book_name: docName,
    },
    callback: () => {
      console.log('Document deleted successfully');
      window.location.reload(true);
    },
    error: (r) => {
      console.error(r);
    }
  })
}

// Function to update the document
function updateDoc() {
  const docName = document.getElementById("docName").value;
  const docData = {};
  
  // Prepare update data to be sent as payload in PUT request
  docData['title'] = document.getElementById('title').value;
  docData['author'] = document.getElementById('author').value;
  docData['publication_year'] = document.getElementById('publication_year').value;
  docData['genre'] = document.getElementById('genre').value;
  const isbn = document.getElementById('isbn').value;
  if (isbn) docData['isbn'] = isbn;
  docData['status'] = document.getElementById('status').value;

  // if a file has been selected, upload it and then update the doc
  const file = document.getElementById('image').files[0];
  if (file) {
    docData['image'] = '/files/' + file.name;
    uploadFile(file)
      .then(() => {
        updateDocInBackend(docName, docData);
      })
      .catch(e => console.error(e));
  } else {
    updateDocInBackend(docName, docData);
  }
}

// Function to upload a file to the Frappe backend
function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/method/upload_file', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-Frappe-CSRF-Token', frappe.csrf_token);

    let form_data = new FormData();
    form_data.append('file', file, file.name);

    // Add event listeners
    xhr.onload = function() {
      if (xhr.status == 200) {
        console.log("File uploaded successfully");
        resolve(xhr.response);
      } else {
        console.error("File upload failed with status " + xhr.status);
        reject(new Error("File upload failed with status " + xhr.status));
      }
    };

    xhr.onerror = function() {
      console.error("Request failed");
      reject(new Error("Request failed"));
    };

    xhr.send(form_data);
  });
}

// Function to add a document to the Frappe backend
function addDocInBackend(docData) {
  frappe.call({
    method: 'library_management.api.book_api.create_book',
    args: {
      book_data: docData
    },
    callback: (r) => {
      window.location.reload(true);
      console.log(r.message);
    },
    error: (r) => {
      console.error(r);
    }
  })
}

// Function to update a document in the Frappe backend
function updateDocInBackend(docName, docData) {
  frappe.call({
    method: 'library_management.api.book_api.update_book',
    args: {
      book_name: docName,
      update_data: docData
    },
    callback: (r) => {
      window.location.reload(true);
      console.log(r.message);
    },
    error: (r) => {
      console.error(r);
    }
  })
}
