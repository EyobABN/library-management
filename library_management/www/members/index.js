// Function to initialize the form modal by optionally populating the form fields with book details
function initModal(docName='') {
  if (docName) {
    // Load document to be updated
    frappe.call({
      method: 'frappe.client.get',
      args: {
        doctype: 'Member',
        name: docName
      },
      callback: function(response) {
        if (response.message) {
          const member = response.message;
        
          document.getElementById("formModalLabel").innerText = "Update Member";
          const submitButton = document.getElementById("submitButton");
          submitButton.innerText = "Update Member";
          submitButton.onclick = updateDoc;

          // Populate the form fields with member details
          document.getElementById("docName").value = member.name;
          document.getElementById("firstName").value = member.first_name;
          document.getElementById("lastName").value = member.last_name;
          document.getElementById("membershipID").value = member.membership_id;
          document.getElementById("email").value = member.email;
          document.getElementById("phoneNumber").value = member.phone_number;

        } else {
          console.error('Member not found');
        }
      },
      error: function(err) {
        console.error(err);
      }
    });
  } else {
    // Display an empty form for adding a new document
    document.getElementById("formModalLabel").innerText = "Add a new Member";
    const submitButton = document.getElementById("submitButton");
    submitButton.innerText = "Add Member";
    submitButton.onclick = addDoc;

    // Reset the form fields in case they have been populated from a previous update command
    document.getElementById("docName").value = '';
    document.getElementById("firstName").value = '';
    document.getElementById("lastName").value = '';
    document.getElementById("membershipID").value = '';
    document.getElementById("email").value = '';
    document.getElementById("phoneNumber").value = '';
  }
}

// Function to add a doc
function addDoc() {
  if (validateForm()) {
    const docData = {};

    // Prepare data to be sent as payload in post request
    docData['first_name'] = document.getElementById('firstName').value;
    docData['last_name'] = document.getElementById('lastName').value;
    docData['membership_id'] = document.getElementById('membershipID').value;
    docData['email'] = document.getElementById('email').value;
    docData['phone_number'] = document.getElementById('phoneNumber').value;
    
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
    method: 'library_management.api.member_api.delete_member',
    args: {
      member_name: docName,
    },
    callback: () => {
      console.log('Member deleted successfully');
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
    docData['first_name'] = document.getElementById('firstName').value;
    docData['last_name'] = document.getElementById('lastName').value;
    docData['membership_id'] = document.getElementById('membershipID').value;
    docData['email'] = document.getElementById('email').value;
    docData['phone_number'] = document.getElementById('phoneNumber').value;
  
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
    method: 'library_management.api.member_api.create_member',
    args: {
      member_data: docData
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
    method: 'library_management.api.member_api.update_member',
    args: {
      member_name: docName,
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
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const membershipID = document.getElementById("membershipID").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;

  // Clear previous error messages
  clearErrorMessages();

  // Validate submitted data
  if (firstName.trim() === '') {
    displayErrorMessage('firstName', 'First name is required');
    return false;
  }

  if (lastName.trim() === '') {
    displayErrorMessage('lastName', 'Last name is required');
    return false;
  }

  if (membershipID.trim() === '' ) {
    displayErrorMessage('membershipID', 'Membership ID is required');
    return false;
  }

  if (email.trim() === '') {
    displayErrorMessage('email', 'Email is required');
    return false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    displayErrorMessage('email', 'Please enter a valid email');
    return false;
  }

  if (phoneNumber.trim() === '') {
    displayErrorMessage('phoneNumber', 'Phone number is required.');
    return false;
  }

  // Validate phone number format
  const phoneRegex = /^(\+251\d{9}|0\d{9})$/;
  if (!phoneRegex.test(phoneNumber)) {
    displayErrorMessage('phoneNumber', 'Please enter a valid Ethiopian phone number');
    return false;
  }

  // If all validations pass, return true to submit the form
  return true;
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
