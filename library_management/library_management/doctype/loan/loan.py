# Copyright (c) 2024, Eyob Alamerew Belay and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe

class Loan(Document):
    def validate(self):
        '''
        Validate the Loan document before saving.

        This method is automatically called by Frappe during the validation process.
        It invokes custom validation methods, such as `validate_book_availability`.
        '''
        # Call custom validators
        self.validate_book_availability()
    
    def validate_book_availability(self):
        '''
        Validate the availability of the selected book.

        This method checks whether the selected book is available for loan.
        If the book is unavailable, a validation error is raised.

        Raises:
        frappe.ValidationError: If the selected book is not available.
        '''
        # Get book
        book_doc = frappe.get_doc("Book", self.book)
        if book_doc.status == 'Unavailable':
            frappe.throw(frappe._("The selected book is not available for loan."))
