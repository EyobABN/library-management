import frappe


def get_context(context):
    # Get current user and their roles
    current_user = frappe.session.user
    user_roles = frappe.get_roles()

    # Set context for current user
    context.loans = frappe.get_list('Loan', fields=['name', 'member', 'book', 'loan_date', 'return_date', 'overdue', 'returned'])
    context.user = current_user
    context.is_librarian = 'Librarian' in user_roles
