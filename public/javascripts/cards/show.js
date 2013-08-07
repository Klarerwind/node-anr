// Execute on DOM ready
jQuery(function ($) {
    CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: 'javascript',
        theme: "solarized dark",
        lineNumbers: true,
        readOnly: true
    });
});