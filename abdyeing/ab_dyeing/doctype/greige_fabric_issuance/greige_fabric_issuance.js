// Copyright (c) 2024, TechVentures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Greige Fabric Issuance', {
    refresh: function (frm) {
        frm.set_query('fabric_lot_no', 'greige_fabric_issuance_item', function (doc, cdt, cdn) {
            return {
                filters: [
                    ["Item", "item_group", "in", ["Fabric"]],
                    ["Item", "has_batch_no", "=", 1]  // Filtering items that have a batch number
                ]
            };
        });

    }
});
