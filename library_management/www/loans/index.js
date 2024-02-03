// Load books and members on document
document.addEventListener('DOMContentLoaded', function() {
  const ul = document.getElementById('loanList');

});

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
  if (validateForm()) {
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
  if (validateForm()) {
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
    method: 'library_management.api.loan_api.create_loan',
    args: {
      book_data: docData
    },
    callback: (r) => {
      window.location.reload(true);
      (r.message);
    },
    error: (r) => {
      console.error(r);
    }
  })
}

// Function to update a document in the Frappe backend
function updateDocInBackend(docName, docData) {
  frappe.call({
    method: 'library_management.api.loan_api.update_loan',
    args: {
      book_name: docName,
      update_data: docData
    },
    callback: (r) => {
      window.location.reload(true);
    },
    error: (r) => {
      console.error(r);
    }
  })
}

// Function to validate the submitted data
function validateForm() {
  // Get form elements
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const publicationYear = document.getElementById('publication_year').value;
  const genre = document.getElementById('genre').value;
  const isbn = document.getElementById('isbn').value;
  const status = document.getElementById('status').value;

  // Clear previous error messages
  clearErrorMessages();

  // Validate submitted data
  if (title.trim() === '') {
    displayErrorMessage('title', 'Title is required');
    return false;
  }

  if (author.trim() === '') {
    displayErrorMessage('author', 'Author is required');
    return false;
  }

  if (
    publicationYear.trim() === '' ||
    isNaN(publicationYear) ||
    !/^\d+$/.test(publicationYear) || // Must be all digits
    publicationYear > new Date().getFullYear() // Must not be in the future
  ) {
    displayErrorMessage('publication_year', 'Invalid Publication Year');
    return false;
  }

  if (genre === '') {
    displayErrorMessage('genre', 'Genre is required');
    return false;
  }

  if (isbn.trim() !== '' && !isValidISBN(isbn)) {
    displayErrorMessage('isbn', 'Invalid ISBN format. Please enter a valid ISBN.');
    return false;
  }

  if (status === '') {
    displayErrorMessage('status', 'Status is required');
    return false;
  }

  // If all validations pass, return true to submit the form
  return true;
}

// Function to validate ISBN format
function isValidISBN(isbn) {
  // Remove hyphens from the input
  const cleanedISBN = isbn.replace(/-/g, '');

  // Check if the cleaned ISBN is either a 10-digit number (with the last digit possibly being 'X') or a 13-digit number
  if (!/^\d{9}(\d|X)$/.test(cleanedISBN) && !/^\d{13}$/.test(cleanedISBN)) {
    return false;
  }

  if (cleanedISBN.length === 10) {
    let sum = 0;
    // Calculate the sum of each digit multiplied by its position (1-indexed)
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedISBN[i]) * (i + 1);
    }
    // The check digit can be 'X' (representing 10) or a number
    let checkDigit = cleanedISBN[9] === 'X' ? 10 : parseInt(cleanedISBN[9]);
    sum += checkDigit * 10;
    // The sum modulo 11 should be 0 for a valid ISBN-10
    return sum % 11 === 0;
  } else if (cleanedISBN.length === 13) {
    let sum = 0;
    // Calculate the sum of each digit, with odd-position digits multiplied by 1 and even-position digits multiplied by 3
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanedISBN[i]) * (i % 2 === 0 ? 1 : 3);
    }
    // The check digit is 10 minus the sum modulo 10, but if the result is 10, it should be replaced with 0
    let checkDigit = 10 - (sum % 10);
    if (checkDigit === 10) checkDigit = 0;
    // The check digit should match the last digit of the ISBN-13 for it to be valid
    return checkDigit === parseInt(cleanedISBN[12]);
  }

  return false;
}

// Function to display error messages
function displayErrorMessage(fieldId, message) {
  var errorElement = document.getElementById(fieldId + 'Error');
  errorElement.innerHTML = message;
}

// Function to clear error messages
function clearErrorMessages() {
  var errorElements = document.querySelectorAll('.error');
  errorElements.forEach(element => element.innerHTML = '');
}
