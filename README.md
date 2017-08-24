# Uncensore.js

Tiny library to reveal uncensored thoughts.

## Installation

```bash
npm install --save uncensore
```

## Markup

Markup defines only 2 custom HTML5 attributes.

### 1. data-censore

As the rule this attribute applies to inline element, because assumes to wrap short phrase only.

```html
<span data-censore="бля">видете ли</span>
```

### 2. data-uncensore

`data-uncensore` attribute applies to uncensore container element in case if application state is active, otherwise it's does not simply exists. This attribute appears automaticly and doesn't need to be set manually.

## Usage

*Note: in examples below concrete class object overrides class itself. it's not good practice, however simple example not assumed to use few class object simultaneously.*

### 1. Include
#### Direct include

Include script into your project and execute code right after DOM loaded.

```html
<!-- ... -->
<script src="/static/assets/vendor/unsektor/uncensore.js"></script>
<script>
window.addEventListener('DOMContentLoaded', function (e) {
    var uncensore = new uncensore();
});
</script>
</body>
<!-- ... -->
```

#### Include in frontend application

```js
// AMD
define(['uncensore'], function (uncensore) {
    // ...
})

// ES6 / ES2015 module
import uncensore from 'uncensore'

// CommonJS
var uncensore = require('unsektor/uncensore');

// Property of window object
window.uncensore()
// ... or simply 
uncensore();
```

### 2. Use

**Example 1 (Simplest way):** 

```js
// Make sure that library initialization is not before DOM loaded, because
// it's required to detect application state for instant highligth.
window.addEventListener('DOMContentLoaded', function () {
    window.uncensore = new uncensore();
});
```

**Example 2 (Example 1 + customization):** 

```js
// Custom uncensore container DOM element
var uncensoreContainer = document.querySelector('#myContainer');

// Web-site page URI to redirect user first time used this function
var uncensoreInfoPageURI = window.location.protocol + '//www.example.tld/censore';

var uncensore = new uncensore(uncensoreContainer, {
    'uri': uncensoreInfoPageURI
});

```
**Example 3 (Example 2 + domain configuration):**

If your web-aplplication also serves subdomains, it's required to define base domain (e.g., 'example.tld').

```js
// Custom uncensore container DOM element
var uncensoreContainer = document.body;

// Web-site page URI to redirect user first time used this function
var uncensoreInfoPageURI = window.location.protocol + '//www.example.tld/censore';

// Domain configuration option (e.g., 'example.com' or 'subdomain.example.com'). 
// If not specified, defaults to the host portion of the current document location 
// (but not including subdomains).
var uncensoreDomain = 'example.tld';

var uncensore = new uncensore(uncensoreContainer, {
    'uri': uncensoreInfoPageURI,
    'domain': uncensoreDomain
});
```

**Example 4 (Example 3 + Custom code):**

```js
var uncensore = require('unsektor/uncensore');
var uncensoreContainer = document.body;

/* @group Optional code block */
var censureToggledHandler = function (e) {
    if (!e.detail.state){
        e.detail.censoredElement.removeAttribute('aria-label');
        e.detail.censoredElement.classList.remove('tooltipped', 'tooltipped-n')
    } else {
        if (e.detail.censureValueBefore !== "") {
            e.detail.censoredElement.setAttribute('aria-label', e.detail.censureValueBefore);
            e.detail.censoredElement.classList.add('tooltipped', 'tooltipped-n')
        }
    }
};

// Subscribe handler callback function to uncencsore container to handle uncensore toggle action event.
uncensoreContainer.addEventListener('censureToggled', censureToggledHandler);
/* @end */

window.uncensore = new uncensore(uncensoreContainer, {
    'uri': uncensoreInfoPageURI,
    'domain': uncensoreDomain
});
```

if uncensore instance defined in global scope, you may toggle application mode manually. It's useful to build web-site page to warn user first time used this function. For example:

```html
<!-- ... -->
<div class="button" onclick="uncensore.toggle();">
    <span data-censore="Bring the fucking censore back">Turn censore off</span>
</div>
<!-- ... -->
```

### 3. Stylization

This library is not specially designed to be compatible with each markup methodology, because idea assumes to hide censored content, especially from SEO robots.

```scss
// SCSS code

/* Censored element stylization */
[data-censore] {
  // disabled state
  border-bottom: 1px rgba(0, 0, 0, .12) dotted;

  // enabled state
  body[data-uncensore] & {
    background: rgba(255, 0, 0, .08);
    cursor: pointer;
    transition: background-color .3s ease;
    border-bottom-color: transparent;
  }
}

/* Other element stylization depending on uncensore application state */
.censore-block {
  // disabled state
  color: white;

  // enabled state
  body[data-uncensore] & {
    color: red;
  }
}

// Note: code will be different in case if your application uses not-standard container element.
```

Finally, writing some custom code using event system (like in example 4) makes possible to extend this application as needed. 

## Keyboard shortuct

This library also provides a keyboard shortcut to toggle application state `⌥D` (`Alt + D`).

## Acknowledgment

+ Александр Котомкин
+ Анна Желяк

## [Change Log](CHANGELOG.md)
## [License ISC](LICENSE.md)

