# mdify

HTML5-based Markdown viewer featuring offline rendering, transparent navigation between connected `.md` documents and responsive design.
Heavily influenced by awesome [gist.io](http://gist.io).
Source code is freely available at [github.com/mdify/mdify.github.com](https://github.com/mdify/mdify.github.com/tree/develop).

### Sources:

BitBucket

> ?bitbucket=&lt;username/repository/branch/file&gt;

example: [mdify.github.com/?bitbucket=shyiko/mdify-sample/master/basics.of.markdown.syntax.md](mdify.github.com/?bitbucket=shyiko/mdify-sample/master/basics.of.markdown.syntax.md)

GitHub

> ?github=&lt;username/repository/branch/file&gt;

example: [mdify.github.com/?github=shyiko/lorem/master/readme.md](mdify.github.com/?github=shyiko/lorem/master/readme.md)

Gist

> ?gist=&lt;gist id&gt;

example: [mdify.github.com/?gist=2843375](mdify.github.com/?gist=2843375)

CORS

> ?cors=&lt;[encoded](http://www.freeformatter.com/url-encoder.html) URL of the resource accessible through CORS&gt;

example: [mdify.github.com/?cors=http%3A%2F%2Fcorsy.jit.su%3Fget%3D...](mdify.github.com/?cors=http%3A%2F%2Fcorsy.jit.su%3Fget%3Dhttp%3A%2F%2Fpastebin.com%2Fraw.php%3Fi%3DHkNtAGFw)<br/>
browser requirements: [caniuse.com/cors](http://caniuse.com/cors)

Drag&Drop

usage: drag and drop any `.md` file onto the page<br/>
browser requirements: [caniuse.com/dragndrop](http://caniuse.com/dragndrop) and [caniuse.com/filereader](http://caniuse.com/filereader)

### Additional query parameters

> &hh

description: force header to hide<br/>
example: [mdify.github.com/?gist=2843375&hh](mdify.github.com/?gist=2843375&hh)

> &ci

description: center images<br/>
example: [mdify.github.com/?gist=bfc69f42cd966117bf83&ci](mdify.github.com/?gist=bfc69f42cd966117bf83&ci)

> &hd

description: hide description. applicable to gists only<br/>
example: [mdify.github.com/?gist=2843375&hd](mdify.github.com/?gist=2843375&hd)

