# Copyright (c) 2024, Eyob Alamerew Belay and contributors
# For license information, please see license.txt

from frappe.model.document import Document
from frappe import _, throw, get_doc

class Loan(Document):
    def validate(self):
        # Call custom validators
        self.validate_book_availability()
    
    def validate_book_availability(self):
        # Get book
        book_doc = get_doc("Book", self.book)
        if not book_doc.available:
            throw(_("The selected book has already been loaned out."))
