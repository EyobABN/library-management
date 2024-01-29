import frappe


def get_context(context):
    context.books = frappe.get_list('Book', fields=['title', 'author', 'genre', 'publication_year', 'isbn', 'image', 'status'])
