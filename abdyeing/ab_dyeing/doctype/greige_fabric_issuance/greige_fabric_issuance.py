# Copyright (c) 2024, TechVentures and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class GreigeFabricIssuance(Document):
    def on_submit(self):
        se = frappe.new_doc("Stock Entry")
        se.stock_entry_type = "Repack"
        se.purpose = "Repack"
        se.posting_date = self.date
        source_warehouse = self.source_warehouse
        se.ref_doctype = 'Greige Fabric Issuance'
        se.ref_no =  self.name
        for item in self.greige_fabric_issuance_item:
            se.append("items", {
                "s_warehouse": source_warehouse,
                "t_warehouse": "",
                "item_code": item.item_code,
                "qty": item.qty_issue,
                "batch_no": item.fabric_lot_no if item.fabric_lot_no else None,
                "allow_zero_valuation_rate": 1
            })
            se.append("items", {
                "s_warehouse": "",
                "t_warehouse": 'Work In Progress - ABD',
                "item_code": item.item_code,
                "qty": item.qty_issue,
                "batch_no": item.m_lot_no if item.m_lot_no else None,
                "allow_zero_valuation_rate": 1
            })
        try:
            se.submit()
            for item in self.greige_fabric_issuance_item:
                batch = frappe.get_doc("Batch", item.fabric_lot_no)
                if batch:
                    batch.m_lot_no = item.m_lot_no if item.m_lot_no else None
                batch.save()

        except Exception as e:
            frappe.throw(str(e))
