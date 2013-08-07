function Util() {
    function getOptionalFields () {
        return $('#optionalFields input[type="text"]').closest('.form-group');
    }

    function getRelevantFields(cardType) {
        var fields;
        switch( cardType ) {
        case "Identity":
            fields = $("#baseLink, #minimumDeckSize, #influenceLimit");
            break;
        case "Operation":
            fields = $("#influenceValue, #playCost");
            break;
        case "Agenda":
            fields = $("#advancementReq, #agendaPoints");
            break;
        case "Ice":
            fields = $("#influenceValue, #rezCost, #strength");
            break;
        case "Upgrade":
            fields = $("#influenceValue, #rezCost, #trashCost");
            break;
        case "Asset":
            fields = $("#influenceValue, #rezCost, #trashCost");
            break;
        case "Hardware":
            fields = $("#influenceValue, #installCost");
            break;
        case "Resource":
            fields = $("#influenceValue, #installCost");
            break;
        case "Program":
            fields = $("#influenceValue, #installCost, #memoryCost, #strength");
            break;
        case "Event":
            fields = $("#influenceValue, #playCost");
            break;
        default:
            return $("");
        }
        return fields.closest('.form-group');
    }

    function autoPopulateFields (evt, card) {
        var extracted = {
            "title": card.title,
            "faction": card.faction,
            "unique": card.uniqueness === 1,
            "type": card.type,
            "subtype": card.subtype,
            "setName": card.setname,
            "setNumber": card.number,
            "code": card.code,
            "influenceValue": card.factioncost,
            "baseLink": card.baselink,
            "minimumDeckSize": card.minimumdecksize,
            "influenceLimit": card.influencelimit,
            "playCost": card.cost,
            "advancementReq": card.advancementcost,
            "agendaPoints": card.agendapoints,
            "rezCost": card.cost,
            "strength": card.strength,
            "trashCost": card.trash,
            "installCost": card.cost,
            "memoryCost": card.memoryunits
        };

        $.each(extracted, function(key, value) {
            var o = $("#" + key);
            if (o.is('input[type=text]')) {
                o.val(value);
            } else if (o.is('input[type=checkbox]')) {
                o.prop('checked', value);
            } else if (o.is('select')) {
                o.val(value);
            }
        });

        $("#type").trigger('change');
    }

    return {
        getOptionalFields: getOptionalFields,
        getRelevantFields: getRelevantFields,
        autoPopulateFields: autoPopulateFields
    };
}