import frappe


@frappe.whitelist(allow_guest=True)
def login(usr, pwd):
    try:
        frappe.local.login_manager.authenticate(usr, pwd)
        frappe.local.login_manager.post_login()
        return "Logged In"
    except frappe.AuthenticationError as e:
        frappe.local.response['http_status_code'] = 401
        return frappe.throw(frappe._("Invalid Login Credentials"))
