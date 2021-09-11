/* START: Context Tree ******************************************************************/

const contextTree = {
  _variables: new Map(),
  isVariableDeclared: Function,
  addVariable: Function,
  getVariable: Function,
  assignVariable: Function
};

contextTree.isVariableDeclared = (key) => {
  return contextTree._variables.get(key) != null;
};

contextTree.addVariable = (type, key, value) => {
  if (contextTree.isVariableDeclared(key)) {
    throw new Error("Variable " + key + " is already declared.");
  }

  // Format values before saving
  switch (type) {
    case "number":
      value = parseInt(value);
      break;

    case "boolean":
      value = new Boolean(value);
      break;

    case "string":
      value = `"${value}"`;
      break;

    case "function":
      value = value;
      break;

    default:
      throw new Error("Type " + type + " isn't defined.");
  }

  contextTree._variables.set(key, value);
};

contextTree.getVariable = (key) => {
  if (!contextTree.isVariableDeclared(key)) {
    throw new Error("Variable " + key + " isn't defined.");
  }

  return contextTree._variables.get(key);
};

contextTree.assignVariable = (type, key, value) => {
  contextTree.isVariableDeclared(key);
  contextTree._variables.delete(key);
  contextTree.addVariable(type, key, value);
};

/* START: Evaluation ********************************************************************/

window.addEventListener("load", () => {
  const rootElements = document.querySelectorAll("[evalWith=hasc]");

  for (let rootEl of rootElements) evalElement(rootEl);
});

function evalVariable(element) {
  const type = element.tagName.toLowerCase().split(":")[1];
  const key = element.attributes[0].name;
  const value = element.innerText;

  contextTree.addVariable(type, key, value);
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
    const [key, value] = variable;
    const regex = new RegExp(key, "g");

    condition = condition.replace(regex, value);
  }

  const isTrue = evalExpression(condition);
  element.setAttribute("isTrue", isTrue);
}

function evalThen(element) {
  const parent = element.parentNode;
  element.style.display = parent.getAttribute("isTrue") == "true" ? "inherit" : "none";
}

function evalElse(element) {
  const parent = element.parentNode;
  element.style.display = parent.getAttribute("isTrue") == "false" ? "inherit" : "none";
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
  if (element.tagName == null) return;

  let tagName = element.tagName.toLowerCase();
  tagName = tagName.startsWith("var:") ? "var" : tagName;

  // Associate tagname with their respective evaluation functions
  const _evalElement = (tagName) => {
    return {
      var: evalVariable,
      value: evalValue,
      if: evalIf,
      then: evalThen,
      else: evalElse,
      function: evalFunction,
      call: evalCall
    }[tagName];
  };

  const func = _evalElement(tagName);
  if (func) func(element);

  for (let child of element.childNodes) evalElement(child);
}
