jQuery(function ($) {
    var Util = window.Util();

    // Initially all optional fields are hidden via a "hide" class on the fieldset.
    // We remove the "hide" class after setting each individual field to display:none.
    Util.getOptionalFields().css('display', 'none');
    Util.getRelevantFields( $("#type").val() ).css('display', 'block');
    $('#optionalFields').removeClass('hide');

    // Set up the text area for syntax highlighting
    CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: 'javascript',
        theme: "solarized dark",
        lineNumbers: true,
        styleActiveLine: true,
        extraKeys: {
            Tab: function (cm) {
                var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                cm.replaceSelection(spaces, "end", "+input");
            },
            'Cmd-/': 'toggleComment'
        }
    });

    // Suggest possible matches for card names from our JSON file.
    // Populate fields if user clicks on a suggested name.
    $("#title").typeahead([
        {
            name: 'cards',
            valueKey: 'title',
            prefetch: '/cards.json',
            template: '<p><strong>{{title}}</strong> – {{setname}} #{{number}}</p>',
            engine: Hogan
        }
    ]).on("typeahead:selected", Util.autoPopulateFields)
    .on("typeahead:selected", updateImagePreview);

    // When the user sets the card type or uses auto-populate,
    // hide all fields and then show only fields relevant to that card type.
    $("#type").on('change', showRelevantFields);

    function showRelevantFields() {
        var visibleFields = Util.getOptionalFields().filter(':visible'),
            doneFn = function() { Util.getRelevantFields( $("#type").val() ).slideDown(); };
        visibleFields.slideUp().promise().done(doneFn);
    }

    function updateImagePreview() {
        $("#previewImage").attr('src', imageUrl({
            setName: $("#setName").val(),
            setNumber: $("#setNumber").val()
        }));
    }

    var mapSetName = {
        "Core": 1,
        "What Lies Ahead": 2,
        "Trace Amount": 2,
        "Cyber Exodus": 2,
        "A Study in Static": 2,
        "Humanity's Shadow": 2,
        "Future Proof": 2,
        "Creation and Control": 3,
        "Opening Moves": 4,
        "Second Thoughts": 4,
        "Mala Tempora": 4,
        "Game Night Kits": 0
    };

    function alsciendeIndex(card) {
        var index = '' + card.setNumber;
        index = index.length >= 3 ? index : (new Array(3 - index.length + 1).join('0') + index);
        index = mapSetName[card.setName] + index;
        index = index.length >= 5 ? index : (new Array(5 - index.length + 1).join('0') + index);
        return index;
    }

    function imageUrl(card) {
        return "http://netrunnercards.info/assets/images/cards/300x418/" + alsciendeIndex(card) + ".png";
    }
});