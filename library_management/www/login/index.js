document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  frappe.call({
      method: "library_management.api.auth.login",
      args: {
          usr: username,
          pwd: password
      },
      callback: function(response) {
          if (response.message === "Logged In") {
              // Redirect or perform actions after successful login
              window.location.href = "/libman";
          } else {
              // Handle login failure
              alert("Login failed. Please check your credentials.");
          }
      }
  });
});
