/**
 * The translations of the application. The first level of attributes must refer to a language.
 * @see react-redux-i18n
 */
const translationObject = {
    de: {
        nav: {
            home: 'Startseite',
            tickets: 'Tickets',
            showTickets: 'Alle Tickets anzeigen',
            addTicket: 'Neues Ticket hinzufügen',
            account: 'Benutzerkonto',
            showaccount: 'Konto einsehen',
            editaccount: 'Konto bearbeiten',
            logout: 'Ausloggen',
            disclosures: 'Selbstauskünfte',
            showDisclosures: 'Meine Selbstauskünfte anzeigen',
            addVisitorDisclosure: 'Neue Selbstauskunft für Besucher*innen erstellen'
        },
        header: {
            login: 'Anmelden',
            register: 'Registrieren',
            loginData: 'Anmelde Daten',
            personalData: 'Persönliche Daten',
            addressData: 'Anschrift',
            updateUser: 'Account bearbeiten',
            disclosure: {
                disclosureVisitor: 'Selbstauskunft für Besucher*innen',
                patient: 'Besuchter Patient',
                healthComplains: 'Angaben zu möglichen Gesundheitsbeschwerden',
                symptoms: 'Aktuelle Symptome oder innerhalb der letzten 14 Tage neu aufgetreten',
                airwaySymptoms: 'Akute Atemwegssymptome',
                note: 'Hinweis',
                selfCommitment: 'Selbstverpflichtung',
                dataPersistence: 'Einverständnis Datenspeicherung'
            },
            qr: 'QR-Code',
            ticket: {
                ticket: 'Ticket',
                availableTickets: 'Verfügbare Tickets',
                create: 'Neues Ticket anlegen',
                details: 'Ticket-Details',
                custom: 'Benutzerdefinierte Felder'
            }
        },
        table: {
            date: 'Datum',
            documentType: 'Dokumententyp',
            details: 'Details',
            actions: 'Aktionen'
        },
        question: {
            disclosure: {
                returnRiskarea: 'Reiserückkehrer aus einem Risikogebiet innerhalb der letzten 14 Tage?',
                quarantine: 'Befinden Sie sich zurzeit in häuslicher Quarantäne?',
                contactLungs: 'Hatten Sie in den letzten 14 Tagen Kontakt zu Personen mit einer akuten respiratorischen'
                    + ' Erkrankung (z.B. Bronchitis/Lungenentzündung)?',
                contactCovid: 'Sind Sie Kontaktperson (KP1) von einem bestätigtem COVID-19-Fall?'
            }
        },
        message: {
            loginFail: 'Der Nutzername und das Passwort sind nicht korrekt.',
            loginFetchError: 'Beim Übertragen der Login-Daten ist etwas schief gelaufen.',
            logoutFail: 'Fehler beim Ausloggen',
            registerFailTitle: 'Registrierung fehlgeschlagen',
            registerFailText: 'Ihr Account konnte nicht erstellt werden.',
            updateAccountFailTitle: 'Aktualisierung fehlgeschlagen',
            updateAccountFailText: 'Ihr Account konnte nicht aktualisiert werden.',
            updateAccountSuccessTitle: 'Konto aktualisiert',
            updateAccountSuccessText: 'Ihr Account wurde erfolgreich aktualisiert.',
            saveDisclosureFailTitle: 'Fehler beim Speichern',
            saveDisclosureFailText: 'Das Formular zur Selbstauskunft konnte nicht gespeichert werden.',
            saveDisclosureSuccessTitle: 'Selbstauskunft gespeichert',
            saveDisclosureSuccessText: 'Das Formular zur Selbstauskunft wurde erfolgreich gespeichert. Sie können es '
                + 'nun in der Gesamtübersicht als PDF oder QR-Code herunterladen.',
            saveTicketFailTitle: 'Fehler beim Erstellen des Tickets',
            saveTicketFailText: 'Das Ticket konnte nicht erstellt.',
            saveTicketSuccessTitle: 'Ticket gespeichert',
            saveTicketSuccessText: 'Das Ticket wurde erfolgreich gespeichert. Sie kehren zur Ticketübersicht zurück.'
        },
        feedback: {
            enterEmailLogin: 'Bitte geben Sie Ihre E-Mail Adresse ein.',
            enterPasswordLogin: 'Bitte geben Sie Ihr Passwort ein.',
            enterEmailRegister: 'Bitte geben Sie eine gültige E-Mail Adresse ein.',
            emailOccupied: 'Diese E-Mail ist bereits vergeben.',
            enterPasswordRegister: 'Bitte geben Sie ein Passwort ein.',
            enterRepeatPassword: 'Bitte wiederholen Sie Ihr Passwort.',
            passwordTooShort: 'Ihr Password muss mindestens %{min} Zeichen lang sein.',
            passwordsDontMatch: 'Die beiden Passwörter stimmen nicht über ein.',
            enterSalutation: 'Bitte wählen Sie Ihre Anrede aus.',
            enterFirstName: 'Bitte geben Sie Ihren Vornamen ein.',
            enterLastName: 'Bitte geben Sie Ihren Nachnamen ein.',
            enterPhone: 'Bitte geben Sie Ihre Telefonnummer ein.',
            enterZip: 'Bitte geben Sie Ihre Postleitzahl ein.',
            enterCity: 'Bitte geben Sie die Stadt an, in welcher Sie wohnen.',
            enterAddress1: 'Bitte geben Sie Ihre Anschrift (Straße und Hausnummer) ein.',
            uploadImage: 'Bitte laden Sie ein Foto von sich hoch.',
            noFaceFound: 'Auf dem ausgewählten Bereich ist kein Gesicht zu erkennen.',
            disclosure: {
                name: 'Bitte geben Sie den Namen des Patienten an, welchen Sie besuchen möchten.',
                station: 'Bitte geben Sie an, auf welcher Station sich der Patient befindet.',
                option: 'Bitte wählen Sie Ja oder Nein aus.',
                riskarea: 'Bitte geben Sie an, in welchem Risikogebiet Sie sich in den letzten 14 Tagen aufgehalten haben.',
                riskdate: 'Bitte geben Sie an, an welchem Tag Sie aus dem Risikogebiet zurückgekehrt sind.'
            },
            ticket: {
                name: 'Bitte geben Sie die Bezeichnung des Tickets ein.',
                price: {
                    value: 'Bitte geben Sie den Preis des Tickets ein.',
                    currency: 'Bitte wählen Sie die Währung des Ticketpreises aus.'
                },
                status: 'Bitte wählen Sie den Status des Tickets aus.',
                buyLimit: 'Bitte geben Sie das Kauflimit der Tickets ein. Wählen Sie 0 wenn es kein Kauflimit für Tickets geben soll.',
                enterStatus: 'Bitte wählen Sie einen gültigen Ticketstatus.'
            }
        },
        data: {
            email: 'E-Mail',
            password: 'Passwort',
            repeatPassword: 'Passwort wiederholen',
            salutation: 'Anrede',
            salutations: {
                man: 'Herr',
                woman: 'Frau',
                na: 'keine Angabe'
            },
            firstname: 'Vorname',
            lastname: 'Nachname',
            picture: 'Foto',
            phone: 'Telefonnummer',
            country: 'Land',
            zipcode: 'PLZ',
            city: 'Stadt',
            address1: 'Adresse',
            address2: 'Adresszusatz',
            yes: 'Ja',
            no: 'Nein',
            disclosure: {
                name: 'Name, Vorname',
                station: 'Station',
                cough: 'Husten',
                musclePain: 'Muskel-/Gelenkschmerzen',
                fever: 'Fieber',
                vomit: 'Übelkeit/Erbrechen',
                throat: 'Halsschmerzen',
                bellyache: 'Magen-/Darmbeschwerden',
                headache: 'Kopfschmerzen',
                taste: 'Geschmacksverlust',
                smell: 'Geruchsverlust',
                air: 'Luftnot',
                breathless: 'Kurzatmigkeit',
                riskarea: 'Risikogebiet',
                riskdate: 'Rückkehrdatum'
            },
            ticket: {
                name: 'Ticketbezeichnung',
                price: {
                    value: 'Preis',
                    currency: 'Währung'
                },
                status: {
                    title: 'Ticketstatus',
                    purchasable: 'Erwerbbar',
                    inactive: 'Deaktiviert'
                },
                buyLimit: 'Kauflimit'
            }
        },
        placeholder: {
            email: 'E-Mail Adresse eingeben',
            password: 'Passwort eingeben',
            repeatPassword: 'Passwort erneut eingeben',
            salutation: 'Anrede auswählen',
            firstname: 'Vornamen eingeben',
            lastname: 'Nachnamen eingeben',
            picture: 'Laden Sie ein Foto von sich hoch',
            phone: 'Telefonnummer eingeben',
            country: 'Land auswählen',
            zipcode: 'Postleitzahl eingeben',
            city: 'Stadt eingeben',
            address1: 'Adresse eingeben (Straße, Hausnummer)',
            address2: 'Adresszusatz eingeben (Stockwerk, etc.)'
        },
        controls: {
            login: 'Einloggen',
            loggingIn: 'Wird eingeloggt...',
            register: 'Registrieren',
            registering: 'Wird registriert...',
            update: 'Aktualisieren',
            updating: 'Wird aktualisiert...',
            camera: 'Kamera',
            upload: 'Foto hochladen',
            back: 'Zurürck',
            delete: 'Entfernen',
            reupload: 'Anderes Foto hochladen',
            changeUpload: 'Quelle des Fotos ändern',
            takePhoto: 'Foto aufnehmen',
            retakePhoto: 'Neues Foto aufnehmen',
            selectVideo: 'Kamera auswählen',
            saveDisclosure: 'Selbstauskunft abschließen',
            showDetails: 'Details einsehen',
            generateQR: 'QR-Code erstellen',
            generatePDF: 'PDF-Datei erstellen',
            download: 'Download',
            ok: 'Ok',
            close: 'Schließen',
            createTicket: 'Ticket anlegen',
            buyTicket: 'Ticker kaufen'
        },
        information: {
            imageProcessing: 'Aufgrund des Ladens der Gesichtserkennung kann das erstmalige Hochladen eines Bildes '
                + 'evtl. etwas Zeit in Anspruch nehmen.',
            disclosure: {
                greetingVisitor: 'Sehr geehrte Besucherinnen und Besucher,',
                introduction: 'zu Ihrem eigenen Schutz sowie, dem Schutz von Patienten und Klinikmitarbeitern möchten '
                    + 'wir Sie bitten, folgende Angaben zu machen bzw. Fragen zu beantworten. Bitte bringen Sie den '
                    + 'QR-Code oder ausgedruckten und ausgefüllten Fragebogen unterschrieben zu Ihrem Patientenbesuch '
                    + 'mit. Vielen Dank vorab dafür.',
                quarantine: 'Sollten Sie sich zurzeit in häuslicher Qurantäne befinden, möchten wir Sie bitten, sich '
                    + 'vorab mit der behandelnden Fachabteilung telefonisch in Verbindung zu setzen.',
                noAccess: 'Sollten Sie eine dieser Fragen mit „Ja“ beantworten, bitten wir um Verständnis, dass ein ' +
                    'Besuch dann leider nicht möglich ist.',
                selfCommitment: 'Als Besucher verpflichte ich mich, mich ausschließlich beim benannten Patienten und ' +
                    'in dessen Zimmer aufzuhalten, während des gesamten Besuchs einen Mund-Nasen-Schutz zu tragen und ' +
                    'einen Mindestabstand von 1,5 m zu wahren. Die geltenden Hygienerichtlinien wurden mir mitgeteilt. ' +
                    'Ich verpflichte mich, diese einzuhalten.',
                dataPersistence1: 'Ich bin damit einverstanden, dass die von mir erhobenen Daten gespeichert werden. ' +
                    'Die Angaben sind gem. der "Coronaschutzverordnung-NRW" freiwillig, aber ohne Angabe dürfen wir ' +
                    'Ihnen keinen Zugang gewähren.',
                dataPersistence2: 'Sie haben jederzeit die Möglichkeit, Ihre Einwilligung in die Speicherung ganz oder ' +
                    'in Teilen ohne Angabe von Gründen zu widerrufen. Diese Widerrufserklärung ist an die Märkische ' +
                    'Kliniken GmbH zu richten. Ihr Widerruf gilt allerdings erst ab dem Zeitpunkt, zu dem Sie diesen ' +
                    'aussprechen. Er hat keine Rückwirkung. Die Verarbeitung Ihrer Daten bis zu diesem Zeitpunkt bleibt ' +
                    'rechtmäßig. Sie wurden auf den Aushang zu den "Informationspflichten bezüglich der Erhebung von ' +
                    'Daten von Besuchern bzw. Kontaktpersonen von Patienten" hingewiesen.'
            },
            ticket: {
                buyLimit: 'Tragen Sie den Wert 0 ein, falls es kein Kauflimit geben soll.'
            }
        }
    }
};

export default translationObject;