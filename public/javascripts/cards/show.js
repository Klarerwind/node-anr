// Execute on DOM ready
jQuery(function ($) {
    var Util = window.Util();

    // Initially all optional fields are hidden via a "hide" class on the fieldset.
    // We remove the "hide" class after setting each individual field to display:none.
    Util.getOptionalFields().css('display', 'none');
    Util.getRelevantFields( $("#type").val()).css('display', 'block');
    $('#optionalFields').removeClass('hide');

    CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: 'javascript',
        theme: "solarized dark",
        lineNumbers: true,
        readOnly: true
    });
});