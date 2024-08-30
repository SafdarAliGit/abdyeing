# Copyright (c) 2024, TechVentures and contributors
# For license information, please see license.txt

import frappe


from frappe.model.document import Document


class GreigeMendingEntry(Document):
    def on_submit(self):
        se = frappe.new_doc("Stock Entry")
        se.stock_entry_type = 'Material Transfer'
        se.ref_doctype = self.doctype
        se.ref_no = self.name
        for item in self.greige_mending_entry_item:
            it = se.append("items", {})
            it.s_warehouse = self.source_warehouse
            it.t_warehouse = self.target_warehouse
            it.item_code = item.item_code
            it.qty = item.meter
            it.batch_no = item.lot_no
            it.allow_zero_valuation_rate = 1
        try:
            se.submit()
        except Exception as e:
            frappe.throw(str(e))
