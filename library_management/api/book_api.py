import frappe


@frappe.whitelist()
def get_books():
    '''
    Fetch a list of books with details.

    This method only accepts authenticated requests.

    Returns:
    A list of dictionaries containing book details, including 'name', 'title', 'author',
    'genre', 'publication_year', 'isbn', and 'status'.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    return frappe.get_all('Book', fields=['name', 'title', 'author', 'genre', 'publication_year', 'isbn', 'status'])

@frappe.whitelist()
def create_book(book_data):
    '''
    Create a new Book document with the provided data.

    This method only accepts authenticated requests.

    Parameters:
    - book_data: A dictionary containing data for the new book, including 'title', 'author',
      'genre', 'publication_year', 'isbn', and 'status'.

    Returns:
    The name of the newly created Book document.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    # Create the Book document without explicit validation
    new_doc = {'doctype': 'Book'}
    for attribute, value in book_data.items():
        if attribute in ['title', 'author', 'genre', 'publication_year', 'isbn', 'status']:
            new_doc[attribute] = value
    doc = frappe.get_doc(new_doc)
    # Save the document, Frappe will handle validation
    doc.insert()
    return doc.name

@frappe.whitelist()
def get_book(book_name):
    '''
    Fetch details of a specific Book.

    This method only accepts authenticated requests.

    Parameters:
    - book_name: The name of the Book document to retrieve.

    Returns:
    A dictionary containing details of the specified book, including 'name', 'title', 'author',
    'genre', 'publication_year', 'isbn', and 'status'.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    book = frappe.get_doc('Book', book_name).as_dict()
    return {
        'name': book['name'],
        'title': book['title'],
        'author': book['author'],
        'genre': book['genre'],
        'publication_year': book['publication_year'],
        'isbn': book['isbn'],
        'status': book['status'],
    }

@frappe.whitelist()
def update_book(book_name, update_data):
    '''
    Update details of a specific Book.

    This method only accepts authenticated requests.

    Parameters:
    - book_name: The name of the Book document to update.
    - update_data: A dictionary containing the fields to update and their new values.

    Returns:
    The name of the updated Book document.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    doc = frappe.get_doc('Book', book_name)
    doc.update(update_data)
    doc.save()
    return doc.name

@frappe.whitelist()
def delete_book(book_name):
    '''
    Delete a specific Book.

    This method only accepts authenticated requests.

    Parameters:
    - book_name: The name of the Book document to delete.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    frappe.delete_doc('Book', book_name)
