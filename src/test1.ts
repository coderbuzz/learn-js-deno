import "./my_module.ts";
// import { esbuild } from './deps.ts';

import MyComponent from "./MyComponent.tsx";

console.log(JSON.stringify(MyComponent()));
// console.log(MyComponent());

console.log("index.ts");
// console.log(esbuild);

const jsxNodes = {
  "key": null,
  "ref": null,
  "props": {
    "children": [{
      "type": "div",
      "key": null,
      "ref": null,
      "props": { "children": " Header" },
      "_owner": null,
    }, {
      "type": "div",
      "key": null,
      "ref": null,
      "props": {
        "style": { "width": "100%", "height": "100%" },
        "children": {
          "type": "span",
          "key": null,
          "ref": null,
          "props": { "children": "Hello world!" },
          "_owner": null,
        },
      },
      "_owner": null,
    }],
  },
  "_owner": null,
};

if (jsxNodes) {
  
}