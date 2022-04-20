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
await micropip.install('kithon/kithon-0.2.0-py3-none-any.whl')
`);
    await pyodide.runPythonAsync(`
from kithon import Transpiler
import js
transpiler_js = Transpiler()
transpiler_js.get_lang('js')
transpiler_go = Transpiler()
transpiler_go.get_lang('go')
`);
}

main();

var saved_code = 'error';

function generate(code){
    try{
	    out_code = pyodide.runPython(`transpiler_${lang}.generate("""${code}""")`);
	    saved_code = out_code;
    } catch {
	    out_code = saved_code;
    }
    return out_code;
}
