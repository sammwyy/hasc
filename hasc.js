/* START: Context Tree */
const contextTree = {
  _variables: new Map(),

  isVariableDeclared: Function,
  addVariable: Function,
  getVariable: Function,
  assignVariable: Function,
};

contextTree.isVariableDeclared = (key) => {
  return contextTree._variables.get(key) != null;
};

contextTree.addVariable = (type, key, value) => {
  if (contextTree.isVariableDeclared(key)) {
    throw new Error("Variable " + key + " is already declared.");
  }

  switch (type) {
    case "number":
      value = parseInt(value);
      break;
    case "boolean":
      value = new Boolean(value);
      break;
    case "string":
    case "function":
      value = value;
      break;
    default:
      throw new Error("Type " + type + " isn't defined.");
  }

  contextTree._variables.set(key, {
    type,
    value,
  });
};

contextTree.getVariable = (key) => {
  if (!contextTree.isVariableDeclared(key)) {
    throw new Error("Variable " + key + " isn't defined.");
  }

  return contextTree._variables.get(key).value;
};

contextTree.assignVariable = (type, key, value) => {
  contextTree.isVariableDeclared(key);
  contextTree._variables.delete(key);
  contextTree.addVariable(type, key, value);
};

/* END: Context Tree */

/* START: Evaluation */
window.addEventListener("load", () => {
  const rootElements = document.querySelectorAll("[evalWith=hasc]");

  for (let rootEl of rootElements) {
    evalElement(rootEl);
  }
});

function evalVariable(element) {
  const type = element.tagName.toLowerCase().split(":")[1];
  const key = element.attributes[0];
  const value = element.innerText;

  contextTree.addVariable(type, key.name, value);
}

function evalRender(element) {
  element.style.display = "inherit";
}

function evalValue(element) {
  const key = element.attributes[0].name;
  const value = contextTree.getVariable(key);
  element.innerText += value;
}

function evalExpression(expression) {
  return eval("(function() { return " + expression + " } )()");
}

function evalIf(element) {
  let condition = element.getAttribute("$");
  for (let variable of contextTree._variables.entries()) {
    const [key, varObject] = variable;
    const regex = new RegExp(key, "g");

    const value =
      varObject.type === "string"
        ? '"' + varObject.value + '"'
        : varObject.value;

    condition = condition.replace(regex, value);
  }

  const isTrue = evalExpression(condition);
  element.setAttribute("isTrue", isTrue);
}

function evalThen(element) {
  const parent = element.parentNode;

  if (parent.getAttribute("isTrue") == "true") {
    element.style.display = "inherit";
  } else {
    element.style.display = "none";
  }
}

function evalElse(element) {
  const parent = element.parentNode;
  if (parent.getAttribute("isTrue") == "false") {
    element.style.display = "inherit";
  } else {
    element.style.display = "none";
  }
}

function evalFunction(element) {
  const key = element.attributes[0];
  const value = element.innerHTML;

  contextTree.addVariable("function", key.name, value);
}

function evalCall(element) {
  const key = element.attributes[0];
  const func = contextTree.getVariable(key.name);
  element.innerHTML = func;
}

function evalElement(element) {
  if (element.tagName == null) {
    return;
  }

  const tagName = element.tagName.toLowerCase();

  if (tagName.startsWith("var:")) {
    evalVariable(element);
  } else if (tagName == "render") {
    evalRender(element);
  } else if (tagName == "value") {
    evalValue(element);
  } else if (tagName == "if") {
    evalIf(element);
  } else if (tagName == "then") {
    evalThen(element);
  } else if (tagName == "else") {
    evalElse(element);
  } else if (tagName == "function") {
    evalFunction(element);
    return;
  } else if (tagName == "call") {
    evalCall(element);
  }
  const children = element.childNodes;
  for (let child of children) {
    evalElement(child);
  }
}
/* END: Evaluation */
