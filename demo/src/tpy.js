var pyodide = null;
var lang = document.getElementById('chose-lang').value;

document.getElementById('chose-lang').addEventListener('change', (event) => {
    lang = event.target.value;
    if(lang == 'js'){
	output.getSession().setMode("ace/mode/javascript");
    } else if(lang == 'go'){
	output.getSession().setMode("ace/mode/golang");
    }
    output.setValue(generate(editor.getValue()));
    output.clearSelection();
    output.setHighlightActiveLine(false);
});

async function main(){
    pyodide = await loadPyodide({
        indexURL : "https://cdn.jsdelivr.net/pyodide/v0.18.0/full/"
    });
    await pyodide.loadPackage("micropip");
    await pyodide.runPythonAsync(`
import micropip
await micropip.install('kithon')
`);
    await pyodide.runPythonAsync(`
import os 
from os import path
import js
from kithon import __path__, Transpiler


translators_dirr = path.join(path.split(__path__[0])[0], 'translators')

go_templates = []
for dirr, _, files in os.walk(path.join(translators_dirr, 'go')):
    go_templates += [\
        open(f'{dirr}/{f}', 'r') \
        for f in files
    ]
transpiler_go = Transpiler('\\n'.join(list(map(lambda t: t.read(), go_templates))))

js_templates = []
for dirr, _, files in os.walk(path.join(translators_dirr, 'js')):
    js_templates += [\
        open(f'{dirr}/{f}', 'r') \
        for f in files
    ]
transpiler_js = Transpiler('\\n'.join(list(map(lambda t: t.read(), js_templates))))
`);
}

main();

var saved_code = 'error';

function generate(code){
    try{
	out_code = pyodide.runPython(`transpiler_${lang}.generate(js.code)`);
	saved_code = out_code;
    }catch{
	out_code = saved_code;
    }
    return out_code;
}
