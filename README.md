# Library Management System

## Challenge

### Objective

Create a basic library management system with a custom API using the Frappe framework. This system will manage books, members, and loans in a library. The goal is to assess your ability to build a full-stack application with Frappe and demonstrate your understanding of API development.

### Core Features

- Book Management:
  - Create a DocType Book with fields like Title, Author, Publish Date, and ISBN.
  - Implement CRUD operations for books.
- Membership Management:
  - Create a DocType Member with fields like Name, Membership ID, Email, and Phone Number.
  - Implement CRUD operations for members.
- Loan Management:
  - Create a DocType Loan for tracking book loans.
  - Include fields such as Member, Book, Loan Date, and Return Date.
  - Add functionality to check the availability of books for loan.
- User Interface:
  - Develop intuitive forms for data entry and display.
  - Include necessary validation checks.
- Reports:
  - Create a report for all currently loaned books.
  - Generate a report for overdue books.
- Custom API Development:
  - Develop a REST API that allows external applications to interact with your library system.
  - The API should support operations like adding, retrieving, updating, and deleting books and members.
  - Ensure the API includes authentication to secure access.
- Advanced Features (Optional):
  - Automated email reminders for overdue books.
  - Feature for members to reserve books.
  - User authentication and roles management (admin, librarian, member).

## License

MIT
