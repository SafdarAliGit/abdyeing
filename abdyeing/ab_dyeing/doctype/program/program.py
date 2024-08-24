import frappe
from frappe.model.document import Document

class Program(Document):
    pass
    # def on_submit(self):
    #     so = frappe.new_doc("Sales Order")
    #     so.customer = self.customer
    #     so.transaction_date = self.date
    #     so.order_type = 'Sales'
    #     for item in self.program_item:
    #         it = so.append("items", {})
    #         it.item_code = item.construction
    #         it.qty = item.qty
    #         it.delivery_date = self.date
    #
    #     try:
    #         so.save()
    #     except Exception as e:
    #         frappe.throw(str(e))
