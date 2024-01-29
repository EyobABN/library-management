import frappe

def authenticate_request(request):
    '''
    Authenticate a request based on the provided Authorization header.

    Parameters:
    - request: The request object containing headers.

    Returns:
    The authenticated user if successful.

    Raises:
    - frappe.AuthenticationError: If the Authorization header is missing or invalid.
    '''

    # Extract auth header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('token '):
        frappe.throw('Error: Invalid Authorization header', frappe.AuthenticationError)

    # Split the token into api_key and api_secret
    api_key, api_secret = auth_header[6:].split(':')

    # Look up the user with the given api_key
    user = frappe.get_value('User', {'api_key': api_key})
    if not user:
        frappe.throw('Error: Unauthenticated request', frappe.AuthenticationError)

    # If we got this far, the request is potentially valid
    return user

@frappe.whitelist()
def get_books():
    '''
    Fetch a list of books with details.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Returns:
    A list of dictionaries containing book details, including 'name', 'title', 'author',
    'genre', 'publication_year', 'isbn', and 'available'.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    return frappe.get_all('Book', fields=['name', 'title', 'author', 'genre', 'publication_year', 'isbn', 'available'])

@frappe.whitelist()
def create_book(book_data):
    '''
    Create a new Book document with the provided data.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Parameters:
    - book_data: A dictionary containing data for the new book, including 'title', 'author',
      'genre', 'publication_year', 'isbn', and 'available'.

    Returns:
    The name of the newly created Book document.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    # Create the Book document without explicit validation
    new_doc = {'doctype': 'Book'}
    for attribute, value in book_data.items():
        if attribute in ['title', 'author', 'genre', 'publication_year', 'isbn', 'available']:
            new_doc[attribute] = value
    doc = frappe.get_doc(new_doc)
    # Save the document, Frappe will handle validation
    doc.insert()
    return doc.name

@frappe.whitelist()
def get_book(book_name):
    '''
    Fetch details of a specific Book.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Parameters:
    - book_name: The name of the Book document to retrieve.

    Returns:
    A dictionary containing details of the specified book, including 'name', 'title', 'author',
    'genre', 'publication_year', 'isbn', and 'available'.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    book = frappe.get_doc('Book', book_name).as_dict()
    return {
        'name': book['name'],
        'title': book['title'],
        'author': book['author'],
        'genre': book['genre'],
        'publication_year': book['publication_year'],
        'isbn': book['isbn'],
        'available': book['available'],
    }

@frappe.whitelist()
def update_book(book_name, update_data):
    '''
    Update details of a specific Book.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Parameters:
    - book_name: The name of the Book document to update.
    - update_data: A dictionary containing the fields to update and their new values.

    Returns:
    The name of the updated Book document.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    doc = frappe.get_doc('Book', book_name)
    doc.update(update_data)
    doc.save()
    return doc.name

@frappe.whitelist()
def delete_book(book_name):
    '''
    Delete a specific Book.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Parameters:
    - book_name: The name of the Book document to delete.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    frappe.delete_doc('Book', book_name)
