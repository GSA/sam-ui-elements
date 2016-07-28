# SAM UI Kit JavaScript

The System for Award Management User Interface Kit (JavaScript) is a mouthful, and is a library intended for use by developers of the SAM environment to generate HTML output consistently across the environment as defined in the [US Web Design Standards](https://standards.usa.gov) and the [SAM Web Design Standards](http://briangilmangsa.github.io/sam-web-design-standards/).

## When we say

**Element:** We may be referring to an individual HTML element (&lt;li&gt;, for example), or an element as specified by the [US Web Design Standards (elements)](https://github.com/18F/web-design-standards/tree/staging/src/stylesheets/elements).

**Component:** We may be referring to a combination of *elements* (a form), an element with a specific purpose (state dropdown), or a component as designated by the [US Web Design Standards (components)](https://github.com/18F/web-design-standards/tree/staging/src/stylesheets/components).

**View:** We are referring to a a full page of content (the entirety of a single address in the browser). The UI Kit is not designed to generate this level of interface; instead, use the chosen template engine for the framework to generate HTML, elements, and components when and where appropriate.

**Framework:** A framework is considered a tool with a broad scope. For example, a model-view-controller framework usually has ways to establish routes, create database schemas, interact with model objects, create views, and so on.

**Library:** A tool with a narrow scope. For example, Gulp Uglify is a libary designed to compress (remove whitespace and the like) files related to website generation.

## How it works

Each component and element available in the UI Kit can be generated from a single function call. Each function takes a key-value array (in the case of JavaScript, we use JSON). The key-value array is used to determine the HTML output, which is returned by the method.

Therefore, these functions should be callable within the view template of a given framework. In the case of JavaScript, these functions are available both client- and server-side.

## Documentation

Documentation for using the UI Kit to generate elements and components (the keys and values for the JSON configuration) can be found in the [SAM Web Design Standards site](http://briangilmangsa.github.io/sam-web-design-standards/components/).
