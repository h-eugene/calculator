function add(a , b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function modulo(a,b) {
  return (a%b + b) % b;
}

function operate(op, a, b) {
  switch (op) {
    case "+": return add(a,b);
    case "-": return subtract(a,b);
    case "×": return multiply(a,b);
    case "÷": return divide(a,b);
    case "%": return modulo(a,b);
    default:
      return NaN;
  }
}

function evaluate(expression) {
  let result = []
  let ops = {"+":1, "-":1, "%":2, "×":2, "÷":2};
  let l = 0;
  for (let i =0; i<expression.length; i++) {
    if (expression[i] in ops) {
      
      result.push(+expression.slice(l,i));

      if (i!= expression.length - 1) {
        result.push(expression[i]);
      }
      l = i + 1;
    } else if (i === expression.length - 1) {
      result.push(+expression.slice(l,i+1));
    }
  }

  for (let i = 2; i<result.length; i++) {
    if (ops[result[i-1]] === 2) {
 
      let [a,op,b] = [result[i-2], result[i-1], result[i]];
      let temp1 = 0;
      if (result[i-3] == "-") {
        a = -a;
        temp1 = 1 + (i===4);
      }
      let temp2 = 0;
      if (b==0) {
        b = -result[i+2];
        temp2 = 2;
      }
      let value = operate(op, a, b);
      result.splice(i-2 - temp1,3 + temp1 + temp2,value);
      i-=2+temp1;
    }
  }
  for (let i = 2; i<result.length; i++) {
    if (ops[result[i-1]] === 1) {
      let [a,op,b] = [result[i-2], result[i-1], result[i]];
      let value = operate(op, a, b);
      result.splice(i-2,3,value);
      i-=2;
    }
  }
  return result[0];
}

function displaySymbol(e) {
  let result = document.querySelector(".result");
  let operations = {
    "add": "+",
    "subtract": "-",
    "multiply": "×",
    "divide": "÷",
    "modulo": "%",
  };
  let id = e.target.id;
  if (!id) {
    let symbol = e.target.textContent.trim();
    let content = result.textContent.trim();
    if (content === "0") {
      if (symbol === "," && !content.includes(",")) {
        result.textContent += ",";
      } else {
        result.textContent = symbol;
      }
    } else {
      if (symbol === ",") {
        if (!content.includes(",")) {
            result.textContent += ",";
        }
      } else {
        result.textContent += symbol;
      }
    }
  } else if (id in operations) {
    if (!result.textContent) {
      if (id === "subtract") {
        result.textContent += "-";
      }
      return;
    }
    let vals = Object.values(operations);
    let lastSymbol = result.textContent.at(-1);
    if (!vals.includes(lastSymbol)) {
      result.textContent += `${operations[id]}`;
    } else {
      if (id === "subtract" && lastSymbol !== "-") {
        result.textContent += "-";
      } else {
        result.textContent = result.textContent.slice(0, result.textContent.length - 1) + operations[id];
        lastSymbol = result.textContent.at(-2);
        if (vals.includes(lastSymbol)) {
          result.textContent = result.textContent.slice(0, result.textContent.length - 2) + operations[id];
        }
      }
    }
  } else if (id === "backspace") {
    result.textContent = result.textContent.slice(0, result.textContent.length - 1);
  } else if (id === "equal") {
    result.textContent = evaluate(result.textContent);
  } else if (id ==="changeSign") {
    if (!result.textContent) return;
    let ops = {"+":1, "-":1, "%":2, "×":2, "÷":2};
    let content = Array.from(result.textContent);
    let l = content.findLastIndex(el => el in ops);
    content.splice(l+1,0,"-");
    if (content[l] == "-") {
      content.splice(l, 2, !(content[l-1] in ops)?"+":"");
    }
    result.textContent = content.join("");
  }
}

document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("click", displaySymbol));
document.querySelector('.calculator').addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

function hover(e) {
  e.target.style.opacity = 0.7;
}

function unhover(e) {
  e.target.style.opacity = 1;
}

document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("mouseenter", hover));
document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("mouseleave", unhover));