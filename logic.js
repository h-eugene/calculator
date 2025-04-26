function operate(op, a, b) {
  switch (op) {
    case "+": (a,b)=> a+b;
    case "-": (a,b)=> a-b;
    case "×": (a,b)=> a*b;
    case "÷": (a,b)=> a/b;
    case "%": (a,b)=> (a%b + b) % b;
    default:
      return NaN;
  }
}

function evaluate(expression) {
  const tokens = [];
  let currentNumber = '';
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if ("+-×÷%".includes(char)) {
      if (currentNumber) {
        tokens.push(parseFloat(currentNumber));
        currentNumber = '';
      }
      tokens.push(char);
    } else {
      currentNumber += char;
    }
  }
  
  if (currentNumber) {
    tokens.push(parseFloat(currentNumber));
  }

  for (let i = 1; i < tokens.length; i += 2) {
    if (tokens[i] === '×' || tokens[i] === '÷' || tokens[i] === '%') {
      const a = tokens[i-1];
      const op = tokens[i];
      const b = tokens[i+1];
      
      if (op === '÷' && b === 0) {
        return "Error: Division by zero";
      }
      
      let result;
      switch (op) {
        case '×': result = a * b; break;
        case '÷': result = a / b; break;
        case '%': result = ((a % b) + b) % b; break;
      }
      
      tokens.splice(i-1, 3, result);
      i -= 2;
    }
  }
  
  let result = tokens[0];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const b = tokens[i+1];
    
    if (op === '+') {
      result += b;
    } else if (op === '-') {
      result -= b;
    }
  }
  
  return result;
}

function changeSign() {
  const result = document.querySelector(".result");
  const content = result.textContent;
  
  if (content === "0" || content === "") return;
  
  const ops = {"+": true, "-": true, "%": true, "×": true, "÷": true};
  const lastOperatorIndex = Array.from(content).findLastIndex(c => c in ops);
  
  if (lastOperatorIndex === -1) {
    if (content.startsWith("-")) {
      result.textContent = content.substring(1);
    } else {
      result.textContent = "-" + content;
    }
  } else {
    const afterOperator = content.substring(lastOperatorIndex + 1);
    const beforeOperator = content.substring(0, lastOperatorIndex + 1);
    
    if (afterOperator.startsWith("-")) {
      result.textContent = beforeOperator + afterOperator.substring(1);
    } else {
      result.textContent = beforeOperator + "-" + afterOperator;
    }
  }
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
  if (id.slice(0,3) === "btn") {
    let symbol = e.target.textContent.trim();
    let content = result.textContent.trim();
    if (content === "0") {
      if (symbol === ".") {
        result.textContent += ".";
      } else {
        result.textContent = symbol;
      }
    } else {
      if (symbol === ".") {
        let ops = {"+":1, "-":1, "%":2, "×":2, "÷":2};
        let l = content.split("").findLastIndex(el => el in ops);
        let number = content.slice(l+1);
        if (!number.includes(".")) {
            if (l!=-1) {
              result.textContent += "0";
            }
            result.textContent += ".";
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

const keyboardMap = {
  "1": "#btn1", "2": "#btn2", "3": "#btn3",
  "4": "#btn4", "5": "#btn5", "6": "#btn6",
  "7": "#btn7", "8": "#btn8", "9": "#btn9",
  "0": "#btn0", ".": "#btnDot",
  "*": "#multiply",
  "-": "#subtract",
  "+": "#add",
  "%": "#modulo",
  "/": "#divide",
  "=": "#equal",
  "Enter": "#equal",
  "Backspace": "#backspace",
};

function keyHandler(e) {
  const id = keyboardMap[e.key];
  if (id) {
    const btn = document.querySelector(id);
    btn.style.opacity = 0.7;
    btn.dispatchEvent(new Event("click"));
  }
}

function keyUp(e) {
  const id = keyboardMap[e.key];
  if (id) {
    const btn = document.querySelector(id);
    btn.style.opacity = 1;
  }
}

document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("click", displaySymbol));
document.addEventListener("keydown", keyHandler);
document.addEventListener("keyup", keyUp);
function hover(e) {
  e.target.style.opacity = 0.7;
}

function unhover(e) {
  e.target.style.opacity = 1;
}


document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("mouseenter", hover));
document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("mouseleave", unhover));