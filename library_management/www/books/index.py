import frappe


def get_context(context):
    # Get current user and their roles
    current_user = frappe.session.user
    user_roles = frappe.get_roles()

    # Set context for current user
    context.books = frappe.get_list('Book', fields=['name', 'title', 'author', 'genre', 'publication_year', 'isbn', 'image', 'status'])
    context.user = current_user
    context.is_librarian = 'Librarian' in user_roles
