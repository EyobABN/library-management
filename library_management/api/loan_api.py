import frappe
import json


@frappe.whitelist()
def get_loans():
    '''
    Fetch a list of loans with details.

    This method only accepts authenticated requests.

    Returns:
    A list of dictionaries containing loan details, including 'name', 'book', 'member',
    'loan_date', 'return_date', 'overdue', and 'returned'.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    return frappe.get_all('Loan', fields=['name', 'book', 'member', 'loan_date', 'return_date', 'overdue', 'returned'])

@frappe.whitelist()
def create_loan(loan_data):
    '''
    Create a new Loan document with the provided data.

    This method only accepts authenticated requests.

    Parameters:
    - loan_data: A dictionary containing data for the new loan, including 'name', 'book', 'member',
    'loan_date', 'return_date', 'overdue', and 'returned'.

    Returns:
    The name of the newly created Loan document.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    # Create the Loan document without explicit validation
    new_doc = {'doctype': 'Loan'}
    loan_data = json.loads(loan_data) if type(loan_data) is str else loan_data # If loan_data is string, convert to dict
    for attribute, value in loan_data.items():
        if attribute in ['book', 'member', 'loan_date', 'return_date', 'overdue', 'returned']:
            new_doc[attribute] = value
    doc = frappe.get_doc(new_doc)
    # Save the document, Frappe will handle validation
    doc.insert()
    return doc.name

@frappe.whitelist()
def get_loan(loan_name):
    '''
    Fetch details of a specific Loan.

    This method only accepts authenticated requests.

    Parameters:
    - loan_name: The name of the Loan document to retrieve.

    Returns:
    A dictionary containing details of the specified loan, including 'name', 'book', 'member',
    'loan_date', 'return_date', 'overdue', and 'returned'.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    loan = frappe.get_doc('Loan', loan_name).as_dict()
    return {
        'name': loan['name'],
        'book': loan['book'],
        'member': loan['member'],
        'loan_date': loan['loan_date'],
        'return_date': loan['return_date'],
        'overdue': loan['overdue'],
        'returned': loan['returned'],
    }

@frappe.whitelist()
def update_loan(loan_name, update_data):
    '''
    Update details of a specific Loan.

    This method only accepts authenticated requests.

    Parameters:
    - loan_name: The name of the Loan document to update.
    - update_data: A dictionary containing the fields to update and their new values.

    Returns:
    The name of the updated Loan document.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    doc = frappe.get_doc('Loan', loan_name)
    update_data = json.loads(update_data) if type(update_data) is str else update_data # If update_data is string, convert to dict
    doc.update(update_data)
    doc.save()
    return doc.name

@frappe.whitelist()
def delete_loan(loan_name):
    '''
    Delete a specific Loan.

    This method only accepts authenticated requests.

    Parameters:
    - loan_name: The name of the Loan document to delete.
    '''
    # Authenticate request
    if frappe.session.user == 'Guest':
        frappe.throw(frappe._('Error: Unauthenticated request'), frappe.AuthenticationError)

    frappe.delete_doc('Loan', loan_name)
