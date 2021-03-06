/**
 * Mapping from visitor disclosure field (with additional fields) to PDF field.
 * The field names are taken from 'Selbstauskunft_Besucher_20201119.pdf'.
 * @type {{symptoms: {breathless: {no: string, yes: string}, throat: {no: string, yes: string}, taste: {no: string, yes: string}, fever: {no: string, yes: string}, bellyache: {no: string, yes: string}, musclePain: {no: string, yes: string}, headache: {no: string, yes: string}, air: {no: string, yes: string}, smell: {no: string, yes: string}, cough: {no: string, yes: string}, vomit: {no: string, yes: string}}, contactLungs: {no: string, yes: string}, signatureInstitue: string, patient: string, station: string, temperature: string, riskdate: string, quarantine: {no: string, yes: string}, contactCovid: {no: string, yes: string}, visitor: {address: string, phone: string, name: string}, signatureVisitor: string, returnRiskarea: {no: string, yes: string}, riskarea: string}}
 */
export const visitorField2PdfField = {
    visitor: {
        name: 'Name Vorname',
        address: 'Anschrift',
        phone: 'Telefonnummer'
    },
    patient: 'Name Vorname_2',
    station: 'Station',
    symptoms: {
        cough: {
            yes: 'Ja_2',
            no: 'Nein_2'
        },
        musclePain: {
            yes: 'Ja_3',
            no: 'Nein_3'
        },
        fever: {
            yes: 'Ja_4',
            no: 'Nein_4'
        },
        vomit: {
            yes: 'Ja_5',
            no: 'Nein_5'
        },
        throat: {
            yes: 'Ja_6',
            no: 'Nein_6'
        },
        bellyache: {
            yes: 'Ja_7',
            no: 'Nein_7'
        },
        headache: {
            yes: 'Ja_8',
            no: 'Nein_8'
        },
        taste: {
            yes: 'Ja_9',
            no: 'Nein_9'
        },
        smell: {
            yes: 'Ja_10',
            no: 'Nein_10'
        },
        air: {
            yes: 'Ja_11',
            no: 'Nein_11'
        },
        breathless: {
            yes: 'Ja_12',
            no: 'Nein_12'
        },
    },
    returnRiskarea: {
        yes: 'Ja',
        no: 'Nein'
    },
    temperature: 'Text1',
    riskarea: 'Text2',
    riskdate: 'Text3',
    quarantine: {
        yes: 'Ja_13',
        no: 'Nein_13'
    },
    contactLungs: {
        yes: 'Ja_14',
        no: 'Nein_14'
    },
    contactCovid: {
        yes: 'Ja_15',
        no: 'Nein_15'
    },
    // The double spaces are intended, it's like that in the PDF file
    signatureVisitor: 'Datum  Unterschrift Besucherin',
    signatureInstitue: 'Datum  Unterschrift Einrichtung'
};

/**
 * Mapping from visitor disclosure field (with additional fields) to PDF field.
 * The field names are taken from 'Selbstauskunft_Besucher_20201119.pdf'.
 * @type {{symptoms: {breathless: {no: string, yes: string}, throat: {no: string, yes: string}, taste: {no: string, yes: string}, fever: {no: string, yes: string}, bellyache: {no: string, yes: string}, musclePain: {no: string, yes: string}, headache: {no: string, yes: string}, air: {no: string, yes: string}, smell: {no: string, yes: string}, cough: {no: string, yes: string}, vomit: {no: string, yes: string}}, contactLungs: {no: string, yes: string}, signatureInstitue: string, patient: string, station: string, temperature: string, riskdate: string, quarantine: {no: string, yes: string}, contactCovid: {no: string, yes: string}, visitor: {address: string, phone: string, name: string}, signatureVisitor: string, returnRiskarea: {no: string, yes: string}, riskarea: string}}
 */
export const contractorField2PdfField = {
    contractor: {
        name: 'Name Vorname',
        address: 'Anschrift privat'
    },
    phone: 'Telefonnummer privat',
    firm: 'Firma',
    station: 'Station Bereich Geb??ude',
    symptoms: {
        cough: {
            yes: 'cough_j',
            no: 'cough_n'
        },
        musclePain: {
            yes: 'musclePain_j',
            no: 'musclePain_n'
        },
        fever: {
            yes: 'fever_j',
            no: 'fever_n'
        },
        vomit: {
            yes: 'vomit_j',
            no: 'vomit_n'
        },
        throat: {
            yes: 'throat_j',
            no: 'throat_n'
        },
        bellyache: {
            yes: 'bellyache_j',
            no: 'bellyache_n'
        },
        headache: {
            yes: 'headache_j',
            no: 'headache_n'
        },
        taste: {
            yes: 'taste_j',
            no: 'taste_n'
        },
        smell: {
            yes: 'smell_j',
            no: 'smell_n'
        },
        breathless: {
            yes: 'breath_j',
            no: 'breath_n'
        },
    },
    returnRiskarea: {
        yes: 'Ja_10',
        no: 'Nein_10'
    },
    temperature: 'Text1',
    riskarea: 'Risikogebiet',
    riskdate: 'R??ckkehrdatum',
    contactLungs: {
        yes: 'Ja_12',
        no: 'Nein_12'
    },
    contactCovid: {
        yes: 'Ja_11',
        no: 'Nein_11'
    },
    // The double spaces are intended, it's like that in the PDF file
    signatureContractor: 'Datum Unterschrift Dienstleister',
    signatureInstitue: 'Datum  Unterschrift Einrichtung'
};