// Copyright (c) 2024, TechVentures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Greige Fabric Receipt', {
    refresh: function (frm) {
        frm.set_query('fabric_item', 'greige_fabric_receipt_item', function (doc, cdt, cdn) {
            return {
                filters: [
                    ["Item", "item_group", "in", ["Fabric"]]
                ]
            };
        });
    }
});
