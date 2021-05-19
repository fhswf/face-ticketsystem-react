import { PDFDocument } from "pdf-lib";
import path from "path";
import { visitorField2PdfField, contractorField2PdfField } from "./mapping/DisclosureMapping";
import download from 'downloadjs'
import config from "../config/Config";
import { fileToArrayBuffer } from "./Utils";

/**
 * Checks a Yes/No Checkbox depending on the condition.
 * @param form The PDF-Form (pdfDoc.getForm()).
 * @param condition When true, yes will be checked, otherwise no.
 * @param basePdfField An object with a 'yes' and 'no' property whose values are the checkbox-field of the PDF file.
 * @private
 */
function _checkCheckBox(form, condition, basePdfField) {
    form.getCheckBox(condition
        ? basePdfField.yes
        : basePdfField.no
    ).check();
}

/**
 * Fills out a visitor disclosure.
 * @param disclosure The disclosure to be used to fill out the PDF file.
 * @param visitor The visitor (User who filled out the form).
 */
export function fillVisitorDisclosurePDF(disclosure, visitor) {
    // TODO Check if this still works in production!
    fetch(path.join(__dirname, 'public/', config.files.disclosure.visitor))
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => PDFDocument.load(arrayBuffer))
        .then(pdfDoc => {
            let form = pdfDoc.getForm();

            // Visitor-Info
            form.getTextField(visitorField2PdfField.visitor.name)
                .setText(visitor.personal.lastname + ', ' + visitor.personal.firstname);
            form.getTextField(visitorField2PdfField.visitor.address)
                .setText(visitor.personal.zipcode + ' ' + visitor.personal.city + ', '
                    + visitor.personal.address1 + visitor.personal.address2
                    + (visitor.personal.country ? ', ' : '') + visitor.personal.country
                );
            form.getTextField(visitorField2PdfField.visitor.phone)
                .setText(visitor.personal.phonenumber ? visitor.personal.phonenumber : '');

            // Patient-Info
            form.getTextField(visitorField2PdfField.patient).setText(disclosure.patient ? disclosure.patient : '');
            form.getTextField(visitorField2PdfField.station).setText(disclosure.station ? disclosure.station : '');

            // Symptoms-Info
            for (let symptom in disclosure.symptoms) {
                _checkCheckBox(form, disclosure.symptoms[symptom], visitorField2PdfField.symptoms[symptom]);
            }

            // Return from Risk-Area info
            _checkCheckBox(form, disclosure.returnRiskarea, visitorField2PdfField.returnRiskarea);
            form.getTextField(visitorField2PdfField.riskarea).setText(disclosure.riskarea ? disclosure.riskarea : '');
            form.getTextField(visitorField2PdfField.riskdate).setText(disclosure.riskdate ? disclosure.riskdate : '');

            // Additional information
            _checkCheckBox(form, disclosure.quarantine, visitorField2PdfField.quarantine);
            _checkCheckBox(form, disclosure.contactLungs, visitorField2PdfField.contactLungs);
            _checkCheckBox(form, disclosure.contactCovid, visitorField2PdfField.contactCovid);
            form.getTextField(visitorField2PdfField.signatureVisitor).setText(
                disclosure.formDate
                    ? new Date(disclosure.formDate).toLocaleDateString(config.i18n.time)
                    : new Date().toLocaleDateString(config.i18n.time)
            );

            // Save the filled out PDF and let the user download it
            pdfDoc.save().then(pdfBytes => {
                download(pdfBytes, disclosure._id + ".pdf", "application/pdf");
            })
        })
}

/**
 * Fills out a contractor disclosure.
 * @param disclosure The disclosure to be used to fill out the PDF file.
 * @param contractor The contractor (User who filled out the form).
 */
export function fillContractorDisclosurePDF(disclosure, contractor) {
    // TODO Check if this still works in production!
    fetch(path.join(__dirname, 'public/', config.files.disclosure.contractor))
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => PDFDocument.load(arrayBuffer))
        .then(pdfDoc => {
            let form = pdfDoc.getForm();

            // Contractor-Info
            form.getTextField(contractorField2PdfField.contractor.name)
                .setText(contractor.personal.lastname + ', ' + contractor.personal.firstname);
            form.getTextField(contractorField2PdfField.contractor.address)
                .setText(contractor.personal.zipcode + ' ' + contractor.personal.city + ', '
                    + contractor.personal.address1 + contractor.personal.address2
                    + (contractor.personal.country ? ', ' : '') + contractor.personal.country
                );
            form.getTextField(contractorField2PdfField.contractor.phone)
                .setText(contractor.personal.phonenumber ? contractor.personal.phonenumber : '');

            // Patient-Info
            form.getTextField(contractorField2PdfField.firm).setText(disclosure.firm ? disclosure.firm : '');
            form.getTextField(contractorField2PdfField.station).setText(disclosure.station ? disclosure.station : '');

            // Symptoms-Info
            for (let symptom in disclosure.symptoms) {
                try {
                    _checkCheckBox(form, disclosure.symptoms[symptom], contractorField2PdfField.symptoms[symptom]);
                }
                catch (err) {
                    console.log('mapping for %s failed: %o', symptom, err)
                }
            }

            // Return from Risk-Area info
            _checkCheckBox(form, disclosure.returnRiskarea, contractorField2PdfField.returnRiskarea);
            form.getTextField(contractorField2PdfField.riskarea).setText(disclosure.riskarea ? disclosure.riskarea : '');
            form.getTextField(contractorField2PdfField.riskdate).setText(disclosure.riskdate ? disclosure.riskdate : '');

            // Additional information
            _checkCheckBox(form, disclosure.contactLungs, contractorField2PdfField.contactLungs);
            _checkCheckBox(form, disclosure.contactCovid, contractorField2PdfField.contactCovid);
            form.getTextField(contractorField2PdfField.signatureContractor).setText(
                disclosure.formDate
                    ? new Date(disclosure.formDate).toLocaleDateString(config.i18n.time)
                    : new Date().toLocaleDateString(config.i18n.time)
            );

            // Save the filled out PDF and let the user download it
            pdfDoc.save().then(pdfBytes => {
                download(pdfBytes, disclosure._id + ".pdf", "application/pdf");
            })
        })
}


/**
 * Determine the form field of a PDF Document and creates a console log containing these field informations.
 * @param file The PDF File object.
 * @returns {Promise<PDFField[]>}
 */
export function getFormFieldsFromPDF(file) {
    return fileToArrayBuffer(file)
        .then(arrayBuffer => PDFDocument.load(arrayBuffer))
        .then(form => {
            console.info("form", form);
            for (let i = 0; i < form.getForm().getFields().length; i++) {
                console.log("field[" + i + "]:", form.getForm().getFields()[i].getName())
            }
            return form.getForm().getFields();
        })
}