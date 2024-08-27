// Copyright (c) 2024, TechVentures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Greige Fabric Issuance', {
    refresh: function (frm) {
        // frm.set_query('fabric_lot_no', 'greige_fabric_issuance_item', function (doc, cdt, cdn) {
        //     return {
        //         filters: [
        //             ["Item", "item_group", "in", ["Fabric"]],
        //             ["Item", "has_batch_no", "=", 1]  // Filtering items that have a batch number
        //         ]
        //     };
        // });

    }
});

frappe.ui.form.on('Greige Fabric Issuance Item', {
    greige_fabric_issuance_item_remove: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    available_qty: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    qty_issue: function (frm, cdt, cdn) {
        calculate_total(frm);
    }
});

function calculate_total(frm) {
    var total = 0;
    $.each(frm.doc.greige_fabric_issuance_item || [], function (i, d) {
        total += flt(d.qty_issue);
    });
    frm.set_value("total_qty_issue", total);
}