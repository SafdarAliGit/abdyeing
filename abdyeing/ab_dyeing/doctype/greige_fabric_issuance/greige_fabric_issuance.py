# Copyright (c) 2024, TechVentures and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class GreigeFabricIssuance(Document):
    def on_submit(self):
        se = frappe.new_doc("Stock Entry")
        se.stock_entry_type = 'Material Transfer'
        for item in self.greige_fabric_issuance_item:
            it = se.append("items", {})
            it.s_warehouse = self.source_warehouse
            it.t_warehouse = 'Work In Progress - ABD'
            it.item_code = item.item_code
            it.qty = item.qty_issue
            it.batch_no = item.fabric_lot_no

        try:
            se.submit()
            for item in self.greige_fabric_issuance_item:
                batch = frappe.get_doc("Batch", item.fabric_lot_no)
                if batch:
                    batch.m_lot_no = item.m_lot_no if item.m_lot_no else None
                batch.save()

        except Exception as e:
            frappe.throw(str(e))
