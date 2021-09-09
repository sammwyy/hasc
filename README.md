# HasC
Convert HTML in to a programming language.

## How to use?

### Variables

Variables can be defined using the following syntax `<var:type name>value</var:type>`, by example:

```html
<!-- Create string variable -->
<var:string name> Sammwy </var:string>

<!-- Create number variable -->
<var:number age> 19 </var:number>

<!-- Create boolean variable -->
<var:boolean isProgrammer> true </var:boolean>

### Value

Once a variable is defined we can use it in the DOM using the value tag followed by the name of the variable.

```html
<!-- Define variable -->
<var:number age> 19 </var:number>

<!-- Use variable value -->
<value age></value>
```


### IF

We can run code under specific conditions using the IF element and passing the condition through the $ attribute using the following syntax: `<if $="true"> </if>`. Then you must define a Then tag which will contain the code in case the condition is true. Optionally you can add an Else tag to run code in case it is false.

```html
<var:number age> 19 </var:number>

<if $="age > 17">
  <then>
    <!-- Code if true -->
  </then>
  
  <else>
    <!-- Code if false -->
  </else>
</if>
```

### Render

The code that runs in Functions and IF will not be shown in the DOM so there is a <render> tag which will show what is inside the DOM. This can be used in IF or Functions.

```html
<render>
  <h1>Hello World</h1>
</render>
```

### Functions

Functions allow you to create pieces of code inside and reuse it every time we call them.

```html
<!-- Define function -->
<function myFunction>
  <render>Hello </render>
</function>

<!-- Call declared function -->
<call myFunction></call>
```
  
