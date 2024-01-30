// Function to open the edit modal with book details
function openModal(docName='') {
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
          const modal = document.getElementById("modal");
          modal.style.display = "block";
        
          document.getElementById("modalHeader").textContent = book.title;
        
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
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    document.getElementById("modalHeader").innerText = "Add a new book";
    document.getElementById("submitButton").innerText = "Add Book"
  }
}

// Function to close the edit modal
function closeEditModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Function to update the book
function updateDoc() {
  const docName = document.getElementById("docName").value;
  const updateData = {}
  const updateDocInBackend = () => {
    frappe.call({
      method: 'library_management.api.book_api.update_book',
      args: {
        book_name: docName,
        update_data: updateData
      },
      callback: (r) => {
        window.location.reload(true);
        console.log(r.message);
      },
      error: (r) => {
        window.location.reload(true);
        console.error(r);
      }
    })
  }
  // Prepare update data to be sent as payload in post request
  updateData['title'] = document.getElementById('title').value;
  updateData['author'] = document.getElementById('author').value;
  updateData['publication_year'] = document.getElementById('publication_year').value;
  updateData['genre'] = document.getElementById('genre').value;
  updateData['isbn'] = document.getElementById('isbn').value;
  updateData['status'] = document.getElementById('status').value;

  // Upload image file
  const file = document.getElementById('image').files[0];
  if (file) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/method/upload_file', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-Frappe-CSRF-Token', frappe.csrf_token);
  
    let form_data = new FormData();
  
    form_data.append('file', file, file.name);
  
    form_data.append('doctype', 'Book');
    form_data.append('docname', docName);
  
    // Add event listeners
    xhr.onload = function() {
      if (xhr.status == 200) {
        updateData['image'] = '/files/' + file.name
        console.log("File uploaded successfully");

        updateDocInBackend();
      } else {
        console.error("File upload failed with status " + xhr.status);
        window.location.reload(true);
      }
    };
  
    xhr.onerror = function() {
      console.error("Request failed");
      window.location.reload(true);
    };
  
    xhr.send(form_data);
  } else {
    updateDocInBackend();
  }
}
