jQuery(function ($) {
    var Util = window.Util(),
        optFields = $('#optionalFields');

    // Initially all optional fields are hidden via a "hide" class on the fieldset.
    // We remove the "hide" class after setting each individual field to display:none.
    Util.hideAllOptionalFields(optFields.removeClass.bind(optFields, 'hide'));

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
    ]).on("typeahead:selected", Util.autoPopulateFields);

    // When the user sets the card type, hide all fields and then
    // show only fields relevant to that card type.
    $("#type").on('change', function () {
        Util.hideVisibleOptionalFields(function () {
            Util.showRelevantFields($("#type").val());
        });
    });
});