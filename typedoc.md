# Working With Typedoc

## What is Typedoc
Typedoc increases developer productivity by generating code documentation from doc
comments and Typescript annotations within the code itself.  

## Setup And Configuration Options
Typedoc's output can be configured in a separate json file. Typedoc accepts the same
parameters for Typescript configuation as well as including options to configure 
Typedoc's output for your own needs.

A mostly complete list of properties for typedoc can be found at the 
[Typedoc Usage Guide](http://typedoc.org/guides/usage/)

A full list of configuration options for Typescript can be found in the
[Typescript Handbook](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

### **json**
The **json** property generates json ouput from Typedoc. If json property is set,
it will override all output. The 

```
$ typedoc --json path/to/file.json path/to/src
```

or  

``` json
"json": path/to/ouput/file.json
```

### **mode**
The **mode** property tells Typedoc how to treat files as it compiles. It has 
two values:
* `file`
* `module`

If `file` is selected, the project will be compiled into one, large namespace. If
`modules` is selected, each file will be treated as an individual module. The SAM
project should always use modules.

```
$ typedoc --mode modules
```

or

``` json 
"mode": "modules"
```

### **exclude**
The **exclude** property excludes files from the output from a given source.
**Exclude** will accept relative paths or globs.

```
$ typedoc --exclude **/directory/*.ts
```

or

``` json
"excludes": "**/directory/*.ts"
```

### **externalPattern**
The **externalPattern** property tells Typedoc which Typescript files are resolved
externally with a glob pattern.

```
$ typedoc --externalPattern **/*/*.d.ts
```

or 

``` json
"externalPattern: "**/*/*.d.ts"
```

### **excludeExternals**
The **excludeExternals** property is a boolean value that tells Typedoc to exclude
externally resolving files from its output. These files can be defined for Typedoc
using the **externalPattern** property.

```
$ typedoc --excludeExternals
```

or 

``` json
"excludeExternals": true 
```

## Doc Comments with Typedoc
Typedoc is based on javadoc doc comments. At this time, however, only the following
tags are available:
* @param \<param name>
* @return(s)

Typedoc allows any other tag which it will return as a definition list. For example,

``` Typescript
/**
 * @input  Model - A model to be consumed by this 
 
 * @output  Value - A value the component returns
 */
```

would have the following json output:

``` json
"tags": [
  {
    "tag": "input",
    "text": "Model - A model to be consumed by this component"
  },
  {
    "tag": "output",
    "text": "Value - A value the component returns"
  }
]
```


## Getting the Most Out of Typedoc with Typescript annotations
Typedoc benefits developers most when used with Typescript classes and annotations.
Properties and methods of classes will be automatically documented without the need 
to write out parameters and return types within doc blocks **as long as annotations
are used**.

In the following class

``` Typescript
export class Person {

  private fullName: string;

  constructor(public firstName: string, public lastName: string) {
    this.fullName = firstName + ' ' + lastName;
  }

  introduce(): string {
    return 'Hi, my name is ' + this.fullName;
  }

}
```

there is no need to document the constructor parameters, properties, or methods.
Typedoc handles all of it. *For example JSON output, see below*.

Further, there is no need to document the class methods individually since that 
information is captured from the annotations on the parameters and the return types.

By using annotations, developers are freed to only write descriptive documentation 
detailing the use and implementation of the code they are writing.

### Overriding Annotations

Sometimes, it might be advantageous to add more verbose documentation for parameters
or return types. In those cases, writing a standard doc block with @param or @return
will override the output from the annotations.

``` Typescript
/**
 * @param  name  Says hello to this name
 */
 sayHello(name: string): string {
   return "Hello, " + name;
 }
```

## Documenting Angular 2 Components with Typedoc and Typescript
In the case of Angular 2 components, the documentation should be directed towards
the end user of the component, and not the developer who is implementing it.

Angular 2 components act as interfaces, hiding the implemenation details from the
developers who use them and exposing only what is necessary for the component to work.

```html
<my-component [someInput]="controllerVariable" (someOuput)="controllerMethod()"></my-component>
```

In the above example, the developer using the component only needs to concern herself
with `someInput` and `someOuput`. 

Consider the following component

```Typescript

/**
 * MyAngularComponent <my-angular-component>
 * This component makes something magic happen in the DOM
 */
@Component({
  selector: 'my-angular-component'
})
class MyAngularComponent {
  @Input() someInput: string;
  @Ouput() someOutput: EventEmitter<any> = new EventEmitter<any>;

  private someProperty: string;

  constructor() {}

  someSecretMethod(param: SomeInterface): SomeInterface[] {
    return [].push(param);
  }

  ...
}

```

Typedoc's output will capture all the annotation data for every property and method 
inside this component. However, in creating documentation for the developers who 
will use this component, we will only be interested in the properties with the 
@Input and @Output decorators.

Luckily, Typedoc provides us with a decorator property for each property
of the component's class in the JSON output, so we can specifically target only 
those elements with @Input and @Output decorators. 

```json
  {
    "id": 568,
    "name": "someInput",
    "kind": 1024,
    "kindString": "Property",
    "decorators": [
      {
        "name": "Input",
        ...
      ...
    ...
```

This output allows us to write an algorithm to target only the properties of the
component that are publicly available to other developers.

## Example JSON output
The following class

``` Typescript
export class Person {

  private fullName: string;

  constructor(public firstName: string, public lastName: string) {
    this.fullName = firstName + ' ' + lastName;
  }

  introduce(): string {
    return 'Hi, my name is ' + this.fullName;
  }

}
```

would output


```json
...,
  {
    "id": 566,
    "name": "\"path/to/person\"",
    "kind": 1,
    "kindString": "External module",
    "flags": {
      "isExported": true
    },
    "originalName": "path/to/person.ts",
    "children": [
      {
        "id": 567,
        "name": "Person",
        "kind": 128,
        "kindString": "Class",
        "flags": {
          "isExported": true
        },
        "children": [
          {
            "id": 569,
            "name": "constructor",
            "kind": 512,
            "kindString": "Constructor",
            "flags": {
              "isExported": true
            },
            "signatures": [
              {
                "id": 572,
                "name": "new Person",
                "kind": 16384,
                "kindString": "Constructor signature",
                "flags": {},
                "parameters": [
                  {
                    "id": 573,
                    "name": "firstName",
                    "kind": 32768,
                    "kindString": "Parameter",
                    "flags": {},
                    "type": {
                      "type": "instrinct",
                      "name": "string"
                    }
                  },
                  {
                    "id": 574,
                    "name": "lastName",
                    "kind": 32768,
                    "kindString": "Parameter",
                    "flags": {},
                    "type": {
                      "type": "instrinct",
                      "name": "string"
                    }
                  }
                ],
                "type": {
                  "type": "reference",
                  "name": "Person",
                  "id": 567
                }
              }
            ],
            "sources": [
              {
                "fileName": "path/to/person.ts",
                "line": 3,
                "character": 27
              }
            ]
          },
          {
            "id": 570,
            "name": "firstName",
            "kind": 1024,
            "kindString": "Property",
            "flags": {
              "isConstructorProperty": true,
              "isExported": true,
              "isPublic": true
            },
            "sources": [
              {
                "fileName": "path/to/person.ts",
                "line": 5,
                "character": 30
              }
            ],
            "type": {
              "type": "instrinct",
              "name": "string"
            }
          },
          {
            "id": 568,
            "name": "fullName",
            "kind": 1024,
            "kindString": "Property",
            "flags": {
              "isPrivate": true,
              "isExported": true
            },
            "sources": [
              {
                "fileName": "path/to/person.ts",
                "line": 3,
                "character": 18
              }
            ],
            "type": {
              "type": "instrinct",
              "name": "string"
            }
          },
          {
            "id": 571,
            "name": "lastName",
            "kind": 1024,
            "kindString": "Property",
            "flags": {
              "isConstructorProperty": true,
              "isExported": true,
              "isPublic": true
            },
            "sources": [
              {
                "fileName": "path/to/person.ts",
                "line": 5,
                "character": 55
              }
            ],
            "type": {
              "type": "instrinct",
              "name": "string"
            }
          },
          {
            "id": 575,
            "name": "introduce",
            "kind": 2048,
            "kindString": "Method",
            "flags": {
              "isExported": true
            },
            "signatures": [
              {
                "id": 576,
                "name": "introduce",
                "kind": 4096,
                "kindString": "Call signature",
                "flags": {},
                "type": {
                  "type": "instrinct",
                  "name": "string"
                }
              }
            ],
            "sources": [
              {
                "fileName": "path/to/person.ts",
                "line": 9,
                "character": 11
              }
            ]
          }
        ],
        "groups": [
          {
            "title": "Constructors",
            "kind": 512,
            "children": [
              569
            ]
          },
          {
            "title": "Properties",
            "kind": 1024,
            "children": [
              570,
              568,
              571
            ]
          },
          {
            "title": "Methods",
            "kind": 2048,
            "children": [
              575
            ]
          }
        ],
        "sources": [
          {
            "fileName": "path/to/person.ts",
            "line": 1,
            "character": 19
          }
        ]
      }
    ],
    "groups": [
      {
        "title": "Classes",
        "kind": 128,
        "children": [
          567
        ]
      }
    ],
    "sources": [
      {
        "fileName": "path/to/person.ts",
        "line": 1,
        "character": 0
      }
    ]
  },
...
```


