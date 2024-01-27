# Copyright (c) 2024, Eyob Alamerew Belay and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe
from datetime import datetime

class Loan(Document):
    def before_save(self):
        '''
        Set the status of the loaned book
        
        This method is automatically called by Frappe whenever
        a Book doc is saved - whether it is the first time after
        creation or subsequently during updates.
        '''
        # Convert return date to a datetime.date object
        return_date = datetime.strptime(self.return_date, "%Y-%m-%d").date()

        # Set the overdue field of the doc, if the book is returned, set overdue to 0
        self.overdue = 1 if not self.returned and return_date < datetime.now().date() else 0

        # Get the book that has just been loaned out
        book = frappe.get_doc('Book', self.book)

        # Check if book has been returned and set book status accordingly
        book.status = 'Unavailable' if not self.returned else 'Available'
        book.save()

    def validate(self):
        '''
        Validate the Loan document before saving.

        This method is automatically called by Frappe during the validation process.
        It invokes custom validation methods, such as `validate_book_availability`.
        '''
        # Call custom validators
        if not self.returned: # skip checking book availability if self.returned == 1 (i.e., the book is being returned)
            self.validate_book_availability()
        self.validate_return_date()
    
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
    
    def validate_return_date(self):
        '''
        Validate loan_date is not more recent than return_date.
        
        Raises:
        frappe.ValidationError: If loan_date is more recent than return_date'''
        # Convert loan and return dates to a datetime.date object
        loan_date = datetime.strptime(self.loan_date, "%Y-%m-%d").date()
        return_date = datetime.strptime(self.return_date, "%Y-%m-%d").date()
        if loan_date > return_date:
            frappe.throw("Loan date cannot be more recent than return date.")
