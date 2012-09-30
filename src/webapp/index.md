# mdify

HTML5-based Markdown viewer featuring offline rendering, transparent navigation between connected `.md` documents and responsive design.
Heavily influenced by awesome [gist.io](http://gist.io).
Source code is freely available at [github.com/mdify/mdify.github.com](https://github.com/mdify/mdify.github.com/tree/develop).

### Sources:

GitHub

> ?github=&lt;username/repository/branch/file&gt;

example: [mdify.github.com/?github=lorem/shyiko/master/readme.md](https://mdify.github.com/?github=lorem/shyiko/master/readme.md)

Gist

> ?gist=&lt;gist id&gt;

example: [mdify.github.com/?gist=3135754](https://mdify.github.com/?gist=3135754)

CORS

> ?cors=&lt;URL of the resource accessible through CORS&gt;

example: [mdify.github.com/?cors=http://corsy.jit.su?get=http://pastebin.com/raw.php?i=HkNtAGFw](https://mdify.github.com/?cors=http://corsy.jit.su?get=http://pastebin.com/raw.php?i=HkNtAGFw)<br/>
browser support: [caniuse.com/cors](http://caniuse.com/cors)

Drag&Drop

usage: drag and drop any `.md` file onto the page<br/>
browser support: [caniuse.com/dragndrop](http://caniuse.com/dragndrop) and [caniuse.com/filereader](http://caniuse.com/filereader)

### Additional parameters

> &hh

description: force header to hide<br/>
example: [mdify.github.com/?gist=3135754&hh](https://mdify.github.com/?gist=3135754&hh)

> &ci

description: center images<br/>
example: [mdify.github.com/?gist=3135754&ci](https://mdify.github.com/?gist=3135754&ci)

> &hd

description: hide description. applicable to the gists only<br/>
example: [mdify.github.com/?gist=3135754&hd](https://mdify.github.com/?gist=3135754&hd)

