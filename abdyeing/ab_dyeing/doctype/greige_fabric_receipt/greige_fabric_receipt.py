# Copyright (c) 2024, TechVentures and contributors
# For license information, please see license.txt

import frappe
from frappe.integrations.oauth2_logins import custom
from frappe.model.document import Document


class GreigeFabricReceipt(Document):
    def on_submit(self):
        se = frappe.new_doc("Stock Entry")
        se.customer = self.customer
        se.stock_entry_type = 'Material Receipt'
        for item in self.greige_fabric_receipt_item:
            it = se.append("items", {})
            it.t_warehouse = self.warehouse
            it.item_code = item.fabric_item
            it.qty = item.meter
            it.batch_no = item.lot_no
            it.allow_zero_valuation_rate = 1

        try:
            se.submit()
            sle = frappe.get_all(
                'Stock Ledger Entry',
                filters={
                    'voucher_type': 'Stock Entry',
                    'voucher_no': se.name
                },
                fields=['name']
            )
            sle_obj = frappe.get_doc('Stock Ledger Entry', sle[0]['name'])
            sle_obj.customer = self.customer
            sle_obj.save()
            for item in self.greige_fabric_receipt_item:
                batch = frappe.get_doc("Batch", item.lot_no)
                if batch:
                    batch.quality = item.quality if item.quality else None
                    batch.construction = item.construction if item.construction else None
                    batch.greige_width = item.greige_width if item.greige_width else None
                batch.save()
        except Exception as e:
            frappe.throw(str(e))
