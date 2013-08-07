function Util() {
    function resizeTitleField () {
        // typeahead.js causes the title div to be inline-block,
        // which messes with it's width
        $("#title").css('width', '160px');  // temporarily make it small
        setTimeout(function(){
            // then set real width after allowing other page elements to re-flow/resize
            $("#title").css('width', $('#subtype').css('width'));
        }, 0);
    }

    function hideAllOptionalFields (callback) {
        var visibleFields = $('#optionalFields input[type="text"]').closest('.form-group');
        callback = callback || $.noop;
        if (visibleFields.length) {
            visibleFields.hide(callback);
        } else {
            callback();
        }
    }

    function hideVisibleOptionalFields (callback) {
        var visibleFields = $('#optionalFields input[type="text"]').closest('.form-group').filter(':visible');
        callback = callback || $.noop;
        if (visibleFields.length) {
            visibleFields.slideUp(callback);
        } else {
            callback();
        }
    }

    function showRelevantFields(cardType) {
        switch( cardType ) {
        case "Identity":
            $("#baseLink, #minimumDeckSize, #influenceLimit").closest('.form-group').slideDown();
            break;
        case "Operation":
            $("#influenceValue, #playCost").closest('.form-group').slideDown();
            break;
        case "Agenda":
            $("#advancementReq, #agendaPoints").closest('.form-group').slideDown();
            break;
        case "Ice":
            $("#influenceValue, #rezCost, #strength").closest('.form-group').slideDown();
            break;
        case "Upgrade":
            $("#influenceValue, #rezCost, #trashCost").closest('.form-group').slideDown();
            break;
        case "Asset":
            $("#influenceValue, #rezCost, #trashCost").closest('.form-group').slideDown();
            break;
        case "Hardware":
            $("#influenceValue, #installCost").closest('.form-group').slideDown();
            break;
        case "Resource":
            $("#influenceValue, #installCost").closest('.form-group').slideDown();
            break;
        case "Program":
            $("#influenceValue, #installCost, #memoryCost, #strength").closest('.form-group').slideDown();
            break;
        case "Event":
            $("#influenceValue, #playCost").closest('.form-group').slideDown();
            break;
        }
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
        hideAllOptionalFields: hideAllOptionalFields,
        hideVisibleOptionalFields: hideVisibleOptionalFields,
        showRelevantFields: showRelevantFields,
        autoPopulateFields: autoPopulateFields
    };
}