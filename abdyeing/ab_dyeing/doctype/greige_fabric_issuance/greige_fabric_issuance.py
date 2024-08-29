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
        se.ref_no = self.name
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
                s_batch = frappe.get_doc("Batch", item.fabric_lot_no)
                if s_batch:
                    s_batch.g_lot_no = item.fabric_lot_no if item.fabric_lot_no else None
                s_batch.save()

            for item in self.greige_fabric_issuance_item:
                t_batch = frappe.get_doc("Batch", item.m_lot_no)
                if t_batch:
                    t_batch.quality = s_batch.quality if s_batch.quality else None
                    t_batch.construction = s_batch.construction if s_batch.construction else None
                    t_batch.greige_width = s_batch.greige_width if s_batch.greige_width else None
                t_batch.save()

        except Exception as e:
            frappe.throw(str(e))
