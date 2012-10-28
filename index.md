# mdify

[gist.io](http://gist.io)-inspired HTML5-powered [Markdown](http://daringfireball.net/projects/markdown) viewer for [Bitbucket](https://bitbucket.org), [Github](https://github.com) + [Gist](https://gist.github.com) hosted, [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing)-accessible resources, with a support of Drag & Drop and fully functional offline mode. It consists solely of HTML/CSS/JS and no server-side code whatsoever.

### Sources:

Bitbucket

> ?bitbucket=&lt;username/repository/branch/file&gt;

example: [mdify.github.com/?bitbucket=shyiko/mdify-sample/master/basics.of.markdown.syntax.md](http://mdify.github.com/?bitbucket=shyiko/mdify-sample/master/basics.of.markdown.syntax.md)

Github

> ?github=&lt;username/repository/branch/file&gt;

example: [mdify.github.com/?github=shyiko/lorem/master/readme.md](http://mdify.github.com/?github=shyiko/lorem/master/readme.md)

Gist

> ?gist=&lt;gist id&gt;

example: [mdify.github.com/?gist=2843375](http://mdify.github.com/?gist=2843375)

CORS

> ?cors=&lt;[encoded](http://www.freeformatter.com/url-encoder.html) URL of the resource accessible through CORS&gt;

example: [mdify.github.com/?cors=http%3A%2F%2Fcorsy.jit.su%3Fget%3D...](http://mdify.github.com/?cors=http%3A%2F%2Fcorsy.jit.su%3Fget%3Dhttp%3A%2F%2Fpastebin.com%2Fraw.php%3Fi%3DHkNtAGFw)<br/>
browser requirements: [caniuse.com/cors](http://caniuse.com/cors)

Drag&Drop

usage: drag and drop any `.md` file onto the page<br/>
browser requirements: [caniuse.com/dragndrop](http://caniuse.com/dragndrop) and [caniuse.com/filereader](http://caniuse.com/filereader)

### Additional query parameters

> &hh

description: force header to hide<br/>
example: [mdify.github.com/?gist=2843375&hh](http://mdify.github.com/?gist=2843375&hh)

> &ci

description: center images<br/>
example: [mdify.github.com/?gist=bfc69f42cd966117bf83&ci](http://mdify.github.com/?gist=bfc69f42cd966117bf83&ci)

> &hd

description: hide description. applicable to gists only<br/>
example: [mdify.github.com/?gist=2843375&hd](http://mdify.github.com/?gist=2843375&hd)

Source code, authored by [Stanley Shyiko](http://twitter.com/shyiko), is freely available at [github.com/mdify/mdify.github.com](https://github.com/mdify/mdify.github.com/tree/develop).
