# Copyright (c) 2024, Eyob Alamerew Belay and contributors
# For license information, please see license.txt

from frappe.model.document import Document
import frappe
from datetime import datetime


class Book(Document):
    def validate(self):
        '''
        Validate the Book document before saving.

        This method is automatically called by Frappe during the validation process.
        It invokes custom validation methods, such as `validate_publication_year` and `validate_isbn`.
        '''
        # Call custom validators
        self.validate_publication_year()
        self.validate_isbn()

    def validate_publication_year(self):
        '''
        Validate the publication year of the book.

        This method checks if the provided publication year is a valid year and not in the future.

        Raises:
        frappe.ValidationError: If the publication year is not a valid year.
        '''
        # Get the value of the publication_year field
        publication_year = self.publication_year

        # Check if the value is a valid year
        current_year = datetime.now().year
        if not (
            publication_year.isdigit() and # year must be a number
            int(publication_year) <= current_year # year cannot be in the future
        ):
            frappe.throw(frappe._("Publication year must be a valid year"))

    def validate_isbn(self):
        '''
        Validate the ISBN of the book.

        This method checks if the provided ISBN is of a valid format.

        Raises:
        frappe.ValidationError: If the ISBN is not a valid format.
        '''
        # Get the value of the ISBN field
        isbn = self.isbn

        # Check if the value is a valid ISBN
        if isbn and not self.is_valid_isbn(isbn):
            frappe.throw(frappe._("Invalid ISBN format. Please enter a valid ISBN."), title="Invalid ISBN")

    def is_valid_isbn(self, isbn):
        '''
        Check the validity of the ISBN.

        This method checks if the provided ISBN is a valid 10 or 13-digit number.

        Parameters:
        - isbn (str): The ISBN to be validated.

        Returns:
        bool: True if the ISBN is valid, False otherwise.
        '''
        # Remove hyphens from the ISBN for validation
        cleaned_isbn = ''.join(isbn.split('-'))

        # Check if the cleaned ISBN is a valid 10 or 13-digit number
        if not cleaned_isbn.isdigit() or len(cleaned_isbn) not in (10, 13):
            return False

        if len(cleaned_isbn) == 10:
            # Validate ISBN-10
            return sum(int(n) * (i + 1) for i, n in enumerate(cleaned_isbn)) % 11 == 0
        elif len(cleaned_isbn) == 13:
            # Validate the ISBN-13 checksum
            check_digit = int(cleaned_isbn[-1])
            isbn_digits = [int(digit) for digit in cleaned_isbn[:-1]]
            checksum = sum((n if i % 2 == 0 else n * 3) for i, n  in enumerate(isbn_digits)) % 10
            return (10 - checksum) == check_digit
