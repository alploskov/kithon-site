window.onload = () => {
let lang = document.getElementById('chose-lang').value;

let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/python");
editor.setShowPrintMargin(false);
editor.clearSelection();

editor.getSession().on('change', () => {
    re_generate();
});

let output = ace.edit("output");
output.renderer.$cursorLayer.element.style.display = 'none';
output.setTheme("ace/theme/chrome");
output.setReadOnly(true);
output.setShowPrintMargin(false);
output.getSession().mergeUndoDeltas = true;
output.setHighlightActiveLine(false);

let set_output_lang = (lang) => {
    let langs = new Map()
	.set("js", "javascript")
        .set("go", "golang");
    output.getSession().setMode(`ace/mode/${langs.get(lang)}`);
};

set_output_lang(lang);

document.getElementById('chose-lang').addEventListener('change', (event) => {
    lang = event.target.value;
    set_output_lang(lang);
    re_generate();
});

let write_code = (code) => {
    output.setValue(code);
    output.clearSelection();
    output.setHighlightActiveLine(false);
};

let read_code = () => {
    return editor.getValue();
};

let saved_code = 'error';
let re_generate = (code) => {
    let out_code = '';
    try {
	gen = pyscript.interpreter.globals.get('gen');
	out_code = gen(lang, read_code());
	saved_code = out_code;
    } catch {
	out_code = saved_code;
    }
    write_code(out_code);
};
}
