const mj = function (tex) {
    return MathJax.tex2svg(tex, {em: 16, ex: 6, display: false});
}

let parenthesis = 'keep'
let implicit = 'hide'

document.forms.formulario.addEventListener('submit', function(e) {
    e.preventDefault(); // Don't send form
    document.getElementById('equation').style.border = "3px solid black";
    document.getElementById('vars').style.border = "3px solid black";
    var resultadoLab = calculadoraLabística(this.elements.func.value, this.elements.vars.value);
    
    try {
        document.getElementById('result').style.display = 'flex';
        document.getElementById('text').textContent = resultadoLab[0];
        console.log(document.getElementById('image').childElementCount);
        if(document.getElementById('image').childElementCount >= 1){
            var latex = document.getElementsByClassName('MathJax CtxtMenu_Attached_0')[0]
            latex.parentNode.removeChild(latex);
        }
        MathJax.typesetClear();
        document.getElementById('image').appendChild(mj(math.parse(resultadoLab[1]).toTex({parenthesis: parenthesis, implicit: implicit})));
    } catch (error) {
        console.log(error)
        console.log("erro")
        return
    }

  });

function calculadoraLabística(expr, vars) {
    if(expr == '')
        return []

    expr = expr.replaceAll('**', '^');
    expr = expr.replaceAll(',', '.');

    try{
        expr = math.simplify(expr).toString();
    }
    catch{
        document.getElementById('equation').style.border="3px solid red";
        return
    }

    try{
        var variables = vars.split(",").map(function(item) {
            return item.trim();
          });
    }
    catch{
        document.getElementById('vars').style.border="3px solid red";
        return
    }

    var finalFunc = '';
    for (let i = 0; i < variables.length; i++) {
        
        try{
            diff = math.derivative(expr, variables[i]).toString();

            if(i != variables.length - 1){
                finalFunc = finalFunc.concat(`((${diff}) * inc_${variables[i]})^2 + `);
            }
            else{
                finalFunc = finalFunc.concat(`((${diff}) * inc_${variables[i]})^2`);
            }
        }
        catch{
            document.getElementById('equation').style.border="3px solid red";
            document.getElementById('vars').style.border="3px solid red";
            return
            console.log("erro")
        }
    }
    var texResult = `sqrt(${finalFunc.replaceAll('inc', 'σ')})`;
    finalFunc = finalFunc.replaceAll('.', ',');
    
    return [`SQRT(${finalFunc})`, texResult];
}