const mj = function (tex) {
    return MathJax.tex2svg(tex, {em: 16, ex: 6, display: false});
}

let parenthesis = 'keep'
let implicit = 'hide'

document.forms.formulario.addEventListener('submit', function(e) {
    e.preventDefault(); // Don't send form
    var resultadoLab = calculadoraLabística(this.elements.func.value);
    console.log(resultadoLab)
    document.getElementById('text').textContent = resultadoLab[0];
    console.log(document.getElementById('image').childElementCount);
    if(document.getElementById('image').childElementCount >= 1){
        var latex = document.getElementsByClassName('MathJax CtxtMenu_Attached_0')[0]
        latex.parentNode.removeChild(latex);
    }
    MathJax.typesetClear();
    document.getElementById('image').appendChild(mj(math.parse(resultadoLab[1]).toTex({parenthesis: parenthesis, implicit: implicit})));
  });

function calculadoraLabística(expr) {
    expr = expr.replaceAll('**', '^');
    expr = expr.replaceAll(',', '.');

    expr = math.simplify(expr).toString();

    var variables = expr.match(/[a-z]/gi);

    var finalFunc = '';
    for (let i = 0; i < variables.length; i++) {
        diff = math.derivative(expr, variables[i]).toString();

        if(i != variables.length - 1){
            finalFunc = finalFunc.concat(`((${diff}) * inc_${variables[i]})^2 + `);
        }
        else{
            finalFunc = finalFunc.concat(`((${diff}) * inc_${variables[i]})^2`);
        }
    }
    var texResult = `sqrt(${finalFunc.replaceAll('inc', 'σ')})`;
    finalFunc = finalFunc.replaceAll('.', ',');
    
    return [`RAIZ(${finalFunc})`, texResult];
}