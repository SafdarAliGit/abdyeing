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

frappe.ui.form.on('Greige Fabric Receipt Item', {
    greige_fabric_receipt_item_remove: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    quality: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    lot_no: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    no_of_bales: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    meter: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    new_lot_no: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (d.fabric_item && d.new_lot_no && d.meter) {
            frappe.call({
                method: 'frappe.client.insert',
                args: {
                    doc: {
                        doctype: 'Batch',
                        item: d.fabric_item,
                        batch_id: d.new_lot_no,
                        batch_qty: d.meter
                    }
                }
            });
            frappe.model.set_value(cdt, cdn, 'lot_no', d.new_lot_no);
            frappe.show_alert(`Batch ${d.new_lot_no} created`)
        } else {
            frappe.throw("Provide Row values");
        }
    }
});

function calculate_total(frm) {
    var total = 0;
    $.each(frm.doc.greige_fabric_receipt_item || [], function (i, d) {
        total += flt(d.meter);
    });
    frm.set_value("total_meters", total);
}
