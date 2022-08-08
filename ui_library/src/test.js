var XMLHttpRequest = require('xhr2');

const staff_data = {
    "staff": [
        {
            "staff_data": {
                "lastname": "Alvar",
                "firstnames": "Paul",
                "form_of_address": "Mr",
                "nationality": "British",
                "user_name": "palvar"
            },
            "address": {
                "street": "64 Orchard Road",
                "city_postcode": "ME 76Z89 Mount Everest",
                "State_Country": "UK"
            },
            "ids": {
                "staff_id_1": "52CB4646",
                "staff_id_2": "DE4EF0"
            },
            "work": {
                "function": "Nurse",
                "position": "Nurse Director",
                "department": "Renal"
            },
            "phone": {
                "telephone_work": "05403 6360589"
            }
        },
        {
            "staff_data": {
                "lastname": "Baloun",
                "firstnames": "David",
                "form_of_address": "Mr.",
                "birth_date": "1959-05-26",
                "nationality": "British",
                "user_name": "palvar"
            },
            "work": {
                "profession": "dialysis support worker",
                "function": "Nurse"
            },
            "phone": {
                "telephone_work": "05403 1350539"
            },
            "address": {
                "street": "60 Orchard Road",
                "city_postcode": "ME 76Z89 Mount Everest",
                "State_Country": "UK"
            },
            "ids": {
                "staff_id_1": "23BE7263",
                "staff_id_2": "AE3FF1"
            }
        },
        {
            "staff_data": {
                "lastname": "Batenga",
                "firstnames": "Mercy",
                "form_of_address": "Mrs.",
                "birth_date": "1964-04-25",
                "nationality": "Indian",
                "user_name": "mpatenga"
            },
            "work": {
                "profession": "Nurse",
                "function": "Nurse"
            },
            "phone": {
                "telephone_work": "05403 1665359"
            },
            "address": {
                "street": "62 Orchard Road",
                "city_postcode": "ME 76Z89 Mount Everest",
                "State_Country": "UK"
            },
            "ids": {
                "staff_id_1": "11FF2088",
                "staff_id_2": "CC1CC2"
            }
        },
        {
            "staff_data": {
                "lastname": "Challinor",
                "firstnames": "Randi",
                "form_of_address": "Mr.",
                "birth_date": "1973-06-28",
                "nationality": "British",
                "user_name": "rchallinor"
            },
            "work": {
                "profession": "Senior Dialysis Nurse",
                "function": "Nurse"
            },
            "phone": {
                "telephone_work": "05401 9731214"
            },
            "address": {
                "street": "61 Orchard Road",
                "city_postcode": "ME 76Z89 Mount Everest",
                "State_Country": "UK"
            },
            "ids": {
                "staff_id_1": "98AF3212",
                "staff_id_2": "AC12AF43"
            }
        },
        {
            "staff_data": {
                "lastname": "Conception",
                "firstnames": "Patience",
                "form_of_address": "Mrs.",
                "birth_date": "1976-04-03",
                "nationality": "British",
                "user_name": "pconception"
            },
            "work": {
                "profession": "Nurse",
                "function": "Nurse"
            },
            "phone": {
                "telephone_work": "05408 6126182"
            },
            "address": {
                "street": "32 Peanuts Road",
                "city_postcode": "ME 76Z89 Mount Everest",
                "State_Country": "UK"
            },
            "ids": {
                "staff_id_1": "66CD1212",
                "staff_id_2": "CD12DC67"
            }
        },
        {
            "staff_data": {
                "lastname": "Dixon",
                "firstnames": "Kathryn",
                "form_of_address": "Ms.",
                "birth_date": "1957-07-08",
                "nationality": "British",
                "user_name": "kdixon"
            },
            "work": {
                "profession": "Nurse",
                "function": "Nurse"
            },
            "phone": {
                "telephone_work": "05408 1112121"
            },
            "address": {
                "street": "98 Peanuts Road",
                "city_postcode": "ME 76Z89 Mount Everest",
                "State_Country": "UK"
            },
            "ids": {
                "staff_id_1": "96AC21AA73",
                "staff_id_2": "AF61DE"
            }
        },
        {
            "staff_data": {
                "lastname": "Jonas",
                "firstnames": "Lisa",
                "form_of_address": "Mrs.",
                "birth_date": "1987-12-16",
                "nationality": "British",
                "user_name": "ljonas",
                "title_": "Dr."
            },
            "work": {
                "profession": "Physician",
                "function": "Doctor"
            },
            "phone": {
                "telephone_work": "05403 7283621"
            },
            "address": {
                "street": "13 Peanuts Road",
                "city_postcode": "ME 76Z89 Mount Everest",
                "State_Country": "UK"
            },
            "ids": {
                "staff_id_1": "53DE19EC",
                "staff_id_2": "CE22DA"
            }
        }
    ]
};

const medications_data = {
    "medications": [
        {
            "trade_name": "Alfacalcidol 0.25mcg",
            "manufacturer": "generic",
            "package_data": 30,
            "prep_form": "capsule",
            "dosing_str": 0.25,
            "dosing_unit": "ug",
            "active": "active"
        },
        {
            "trade_name": "Alfacalcidol 1.0mcg",
            "manufacturer": "generic",
            "package_data": 30,
            "prep_form": "capsule",
            "dosing_str": 1,
            "dosing_unit": "ug",
            "active": "active"
        },
        {
            "trade_name": "Alfacalcidol 2.0mcg Amp",
            "manufacturer": "generic",
            "package_data": 30,
            "prep_form": "ampule",
            "dosing_str": 2,
            "dosing_unit": "ug",
            "active": "active"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 130,
            "dosing_unit": "ug",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 300,
            "dosing_unit": "ug",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 40,
            "dosing_unit": "ug",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 100,
            "dosing_unit": "ug",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 60,
            "dosing_unit": "ug",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 10,
            "dosing_unit": "ug",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 80,
            "dosing_unit": "mg",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 30,
            "dosing_unit": "ug",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Aranesp",
            "manufacturer": "Amgen",
            "package_data": 6,
            "prep_form": "pre-filled syringe",
            "dosing_str": 20,
            "dosing_unit": "ug",
            "active": "active",
            "category": "Erypo"
        },
        {
            "trade_name": "Chlorphenamine",
            "manufacturer": "generic",
            "package_data": 20,
            "prep_form": "tablet",
            "dosing_str": 4,
            "dosing_unit": "mg",
            "active": "active",
            "category": ""
        }
    ]
};

const notifications_data = {
    "notifications": [
        {
            "category_name": "Appointments for patients",
            "color": "dark blue",
            "notifications_type": "message",
            "pass_to_monitoring": true,
            "needs_confirmation": true
        },
        {
            "category_name": "Appointments for patients",
            "color": "dark blue",
            "notifications_type": "message",
            "pass_to_monitoring": true,
            "needs_confirmation": true,
            "allow_repetition": true
        },
        {
            "category_name": "Care handover",
            "color": "dark green",
            "notifications_type": "comment",
            "pass_to_monitoring": false,
            "needs_confirmation": true,
            "allow_repetition": false
        },
        {
            "category_name": "Doctors prescription once",
            "color": "white",
            "notifications_type": "message",
            "pass_to_monitoring": true,
            "needs_confirmation": true,
            "allow_repetition": false
        },
        {
            "category_name": "Doctors prescription with repetition",
            "color": "white",
            "notifications_type": "message",
            "pass_to_monitoring": true,
            "needs_confirmation": true,
            "allow_repetition": true
        },
        {
            "category_name": "Individual Patient Directive",
            "color": "dark blue",
            "notifications_type": "message",
            "pass_to_monitoring": true,
            "needs_confirmation": true,
            "allow_repetition": true
        },
        {
            "category_name": "Missed Dialysis",
            "color": "red",
            "notifications_type": "comment",
            "pass_to_monitoring": false,
            "needs_confirmation": true,
            "allow_repetition": false
        },
        {
            "category_name": "Report from CQI Meeting",
            "color": "magenta",
            "notifications_type": "comment",
            "pass_to_monitoring": false,
            "needs_confirmation": false,
            "allow_repetition": false
        },
        {
            "category_name": "Report from Dialysis treatment",
            "color": "yellow",
            "notifications_type": "comment",
            "pass_to_monitoring": false,
            "needs_confirmation": false,
            "allow_repetition": false,
            "used_for_monitoring_comments": true,
            "comments": "(from Monitoring)"
        },
        {
            "category_name": "Report on current problems",
            "color": "cyan",
            "notifications_type": "comment",
            "pass_to_monitoring": false,
            "needs_confirmation": false,
            "allow_repetition": false
        },
        {
            "category_name": "Report on current wound",
            "color": "green",
            "notifications_type": "comment",
            "pass_to_monitoring": false,
            "needs_confirmation": false,
            "allow_repetition": false
        },
        {
            "category_name": "Report on nursing",
            "color": "blue",
            "notifications_type": "comment",
            "pass_to_monitoring": false,
            "needs_confirmation": false,
            "allow_repetition": false
        },
        {
            "category_name": "Update from hospitalisation",
            "color": "red",
            "notifications_type": "comment",
            "pass_to_monitoring": false,
            "needs_confirmation": false,
            "allow_repetition": false
        }
    ]
};

const shifts_data = {
    "shifts": [
        {
            "name": "M-W-F AM Ward1",
            "center": "B. Braun",
            "ward": "Ward 1",
            "start_time": "07:00",
            "end_time": "12:00"
        },
        {
            "name": "M-W-F AM Ward2",
            "center": "B. Braun",
            "ward": "Ward 2",
            "start_time": "07:00",
            "end_time": "12:00"
        },
        {
            "name": "M-W-F PM Ward1",
            "center": "B. Braun",
            "ward": "Ward 1",
            "start_time": "13:00",
            "end_time": "18:00"
        },
        {
            "name": "M-W-F PM Ward2",
            "center": "B. Braun",
            "ward": "Ward 2",
            "start_time": "13:00",
            "end_time": "18:00"
        },
        {
            "name": "T-Th-S AM Ward1",
            "center": "B. Braun",
            "ward": "Ward 1",
            "start_time": "07:00",
            "end_time": "12:00"
        },
        {
            "name": "T-Th-S AM Ward2",
            "center": "B. Braun",
            "ward": "Ward 2",
            "start_time": "07:00",
            "end_time": "12:00"
        },
        {
            "name": "T-Th-S PM Ward1",
            "center": "B. Braun",
            "ward": "Ward 1",
            "start_time": "13:00",
            "end_time": "18:00"
        },
        {
            "name": "T-Th-S PM Ward2",
            "center": "B. Braun",
            "ward": "Ward 2",
            "start_time": "13:00",
            "end_time": "18:00"
        }
    ]
};

const data = [
    staff_data["staff"],
    medications_data["medications"],
    notifications_data["notifications"],
    shifts_data["shifts"]
]

const type = ["staff", "medication", "notification", "shift"]

const links = type.map(x => (
    `http://localhost:3000/${x}`
));

const insertData = (link, collection, type) => {
    console.log(link, type)
    collection.forEach(item => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", link);
        xhr.setRequestHeader("Accept", "application/vnd.api+json");
        xhr.setRequestHeader("Content-Type", "application/vnd.api+json");
        xhr.onload = () => console.log(xhr.responseText);
        let staffData = {
            "data": {
                "type": type,
                "attributes": item
            }
        };
        xhr.send(JSON.stringify(staffData));
    });
};

links.forEach((link, i) => {
    insertData(link, data[i], type[i]);
});

/*
data = `{
    "data": {
        "type": "people",
        "attributes": {
            "name": "Max",
            "email": "max@example.com",
            "gender": "male",
            "vla": "da"
        }
    }
}`;
*/
