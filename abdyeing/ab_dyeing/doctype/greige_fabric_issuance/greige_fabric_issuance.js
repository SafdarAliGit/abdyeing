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
    },
    new_lot_no: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (d.item_code && d.new_lot_no && d.qty_issue) {
            frappe.call({
                method: 'frappe.client.insert',
                args: {
                    doc: {
                        doctype: 'Batch',
                        item: d.item_code,
                        batch_id: d.new_lot_no,
                        batch_qty: d.qty_issue
                    }
                }
            });
            frappe.model.set_value(cdt, cdn, 'm_lot_no', d.new_lot_no);
            frappe.show_alert(`Batch ${d.new_lot_no} created`);
        }else {
            frappe.throw("Provide Row values");
        }
    }

});

function calculate_total(frm) {
    var total = 0;
    $.each(frm.doc.greige_fabric_issuance_item || [], function (i, d) {
        total += flt(d.qty_issue);
    });
    frm.set_value("total_qty_issue", total);
}