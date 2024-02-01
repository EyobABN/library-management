# Library Management System

A basic library management system with a custom API, built using the Frappe framework. This system manages books, members, and loans in a library.

## Installation

Make sure *Bench* is installed on your local machine. If you haven't installed Bench, follow the official [installation guide](https://frappeframework.com/docs/user/en/installation).

- Initialize the Frappe bench

  ```bash
  bench init [bench-name]
  ```

- Go to the newly created bench directory

  ```bash
  cd [bench-name]
  ```

- Create a new site

  ```bash
  bench new-site [site-name]
  ```

- Download and add this app to the bench

  ```bash
  bench get-app [app-name] <https://github.com/EyobABN/library-management.git>
  ```

- Install this app on your newly created site

  ```bash
  bench --site [site-name] install-app [app-name]
  ```

- Start the development server
  
  ```bash
  bench start
  ```

## Features

- Book Management:
  - [x] The Book DocType has the fields: Title, Author, Genre, Publication Year, ISBN, and Image.
  - [x] CRUD operations available via custom API.
- Membership Management:
  - [x] The Member DocType has the fields: Name, Membership ID, Email, and Phone Number.
  - [x] CRUD operations available via custom API.
- Loan Management:
  - [x] The Loan DocType tracks book loans and has the fields: Member, Book, Loan Date, and Return Date.
  - [x] Validation has been implemented.
- User Interface:
  - [x] Has intuitive forms for data entry and display.
  - [x] Validation has been implemented.
- Authentication and Role Management:
  - [x] Users can log into the app
  - [x] Only users with the Librarian role are able to add, loan, modify, and delete books.
- Reports:
  - Create a report for all currently loaned books
  - Generate a report for overdue books
- Advanced Features:
  - [x] User authentication and role management (admin, librarian, member)
  - Automated email reminders for overdue books
  - Feature for members to reserve books

## Custom API

- The custom REST API allows external applications to interact with the library system.
- The API supports operations like adding, retrieving, updating, and deleting books and members.
- The API includes authentication to secure access.

### API Endpoints

| Endpoint | Role | Purpose |
|----------|------|---------|
| /api/method/library_management.api.get_books | Anyone | Retrieves the list of books that the library has |
| /api/method/library_management.api.create_book | Librarian | Creates a new book |
| /api/method/library_management.api.get_book | Anyone | Retrieves a single book |
| /api/method/library_management.api.update_book | Librarian | Updates a book |
| /api/method/library_management.api.delete_book | Librarian | Deletes a book |
| /api/method/library_management.api.get_members | Librarian | Returns the list of members currently registered at the library |
| /api/method/library_management.api.create_member | Librarian | Creates a new member |
| /api/method/library_management.api.get_member | Librarian | Retrieves a single member |
| /api/method/library_management.api.update_member | Librarian | Updates a member |
| /api/method/library_management.api.delete_member | Librarian | Deletes a member |

## License

MIT
