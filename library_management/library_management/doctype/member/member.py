# Copyright (c) 2024, Eyob Alamerew Belay and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Member(Document):
	def before_save(self):
		'''
        Concatenate the first name and last name to update the full name before saving.

        This method is automatically called by Frappe before saving the Member document.
        It updates the `full_name` field based on the current values of `first_name` and `last_name`.

        Note: This method is intended for internal use and is automatically triggered during the save process.
        '''	
		self.full_name = f'{self.first_name} {self.last_name}'
