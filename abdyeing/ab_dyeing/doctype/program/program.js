// Copyright (c) 2024, TechVentures and contributors
// For license information, please see license.txt

frappe.ui.form.on('Program', {
    refresh: function (frm) {
        frm.set_query('construction', 'program_item', function (doc, cdt, cdn) {
            return {
                filters: [
                    ["Item", "item_group", "in", ["Fabric"]]
                ]
            };
        });
        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(__('Generate Greige Fabric Issuance'), function () {
                open_new_issuance(frm);
            });
        }

    }
});
frappe.ui.form.on('Program Item', {
    program_item_remove: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    pcs: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    quality: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    qty: function (frm, cdt, cdn) {
        calculate_total(frm);
    },
    meters: function (frm, cdt, cdn) {
        calculate_total(frm);
    },

});

function open_new_issuance(frm) {
    let name_value = frm.doc.name;
    frappe.new_doc('Greige Fabric Issuance', {
        'program_no': name_value
    });
}


function calculate_total(frm) {
    var total = 0;
    $.each(frm.doc.program_item || [], function (i, d) {
        total += flt(d.meters);
    });
    frm.set_value("total_meters", total);
}