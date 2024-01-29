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
def get_members():
    '''
    Fetch a list of members with details.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Returns:
    A list of dictionaries containing member details, including 'name', 'full_name',
    'membership_id', 'email', and 'phone_number'.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    return frappe.get_all('Member', fields=['name', 'full_name', 'membership_id', 'email', 'phone_number'])

@frappe.whitelist()
def create_member(member_data):
    '''
    Create a new Member document with the provided data.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Parameters:
    - member_data: A dictionary containing data for the new member, including 'first_name',
      'last_name', 'membership_id', 'email', and 'phone_number'.

    Returns:
    The name of the newly created Member document.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    # Create the Book document without explicit validation
    new_doc = {'doctype': 'Member'}
    for attribute, value in member_data.items():
        if attribute in ['first_name', 'last_name', 'membership_id', 'email', 'phone_number']:
            new_doc[attribute] = value
    doc = frappe.get_doc(new_doc)
    # Save the document, Frappe will handle validation
    doc.insert()
    return doc.name

@frappe.whitelist()
def get_member(member_name):
    '''
    Fetch details of a specific Member.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Parameters:
    - member_name: The name of the Member document to retrieve.

    Returns:
    A dictionary containing details of the specified member, including 'name', 'full_name',
    'membership_id', 'email', and 'phone_number'.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    member = frappe.get_doc('Member', member_name).as_dict()
    return {
        'name': member['name'],
        'full_name': member['full_name'],
        'membership_id': member['membership_id'],
        'email': member['email'],
        'phone_number': member['phone_number'],
    }

@frappe.whitelist()
def update_member(member_name, update_data):
    '''
    Update details of a specific Member.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Parameters:
    - member_name: The name of the Member document to update.
    - update_data: A dictionary containing the fields to update and their new values.

    Returns:
    The name of the updated Member document.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    doc = frappe.get_doc('Member', member_name)
    doc.update(update_data)
    doc.save()
    return doc.name

@frappe.whitelist()
def delete_member(member_name):
    '''
    Delete a specific Member.

    This function requires authentication through the `authenticate_request` function,
    which validates the Authorization header in the request.

    Parameters:
    - member_name: The name of the Member document to delete.
    '''
    # Authenticate request
    authenticate_request(frappe.local.request)

    frappe.delete_doc('Member', member_name)
