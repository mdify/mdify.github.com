/**
 * window.atob polyfill
 * @see https://github.com/davidchambers/Base64.js
 */
(function () {
    var rmap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    window.atob || (
        window.atob = function (input) {
            input = input.replace(/=+$/, '');
            if (input.length % 4 == 1) throw Error();
            for (
                var bc = 0, bs, buffer, idx = 0, output = '';
                buffer = input.charAt(idx++);
                ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
            ) {
                buffer = rmap.indexOf(buffer);
            }
            return output;
        });
}());

/**
 * @param $ zepto instance
 * @param marked marked instance
 * @param hljs highlight.js instance
 */
(function($, marked, hljs, undefined) {

    var pygments2hljs = {
            /**
             * Custom lang mappings between pygments (used by GitHub) and highlight.js
             * @see http://pygments.org/docs/lexers
             * @see https://github.com/isagalaev/highlight.js/blob/master/classref.txt
             */
            as: 'actionscript', as3: 'actionscript', actionscript3: 'actionscript', apacheconf: 'apache',
            aconf: 'apache', nasm: 'avrasm', sh: 'bash', ksh: 'bash', clj: 'clojure', 'coffee-script': 'coffeescript',
            'c++': 'cpp', c: 'cpp', csharp: 'cs', 'c#': 'cs', pas: 'delphi', pascal: 'delphi', objectpascal: 'delphi',
            udiff: 'diff', jinja: 'django', bat: 'dos', hs: 'haskell', cfg: 'ini', js: 'javascript',
            'common-lisp': 'lisp', cl: 'lisp', newlisp: 'lisp', 'objective-c': 'objectivec', 'obj-c': 'objectivec',
            objc: 'objectivec', pl: 'perl', php3: 'php', php4: 'php', php5: 'php', py: 'python', py3: 'python',
            python3: 'python', rb: 'ruby', duby: 'ruby', squeak: 'smalltalk', mysql: 'sql', plpgsql: 'sql',
            psql: 'sql', postgresql: 'sql', postgres: 'sql', sqlite3: 'sql', latex: 'tex', vapi: 'vala', html: 'xml'
        },
        /**
         * @see {@link mdify}
         */
        resolvers = {
            gist: function(id, callback) {
                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    url: 'https://api.github.com/gists/' + id,
                    success: function(res) {
                        var content, files = res.data.files;
                        if (files) {
                            for (var file in files) {
                                content = files[file].content;
                                if (file.toLowerCase().substr(-3) === '.md') {
                                    break;
                                }
                            }
                        }
                        callback({
                            link: {href: 'https://gist.github.com/' + id, text: 'gist: ' + id},
                            title: res.data.description,
                            markdown: content
                        });
                    },
                    error: function() {
                        callback({error: 'The requested gist is not available.'});
                    }
                });
            },
            github: function(username, repository, branch, file, callback) {
                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    url: 'https://api.github.com/repos/' + username + '/' + repository + '/contents/' + file + '?ref=' + branch,
                    success: function(res) {
                        var decodedContent = res.data.encoding === "base64" ?
                            window.atob(res.data.content.replace(/\n/g, "")) : res.data.content;
                        callback({
                            link: {
                                href: 'https://github.com/' + username + '/' + repository + '/blob/' + branch + '/' + file,
                                text: 'github: ' + username + '/' + repository + '/' + branch + '/' + file
                            },
                            markdown: decodedContent
                        });
                    },
                    error: function() {
                        callback({error: 'The requested github file is not available.'});
                    }
                });
            },
            bitbucket: function(username, repository, branch, file, callback) {
                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    url: 'https://api.bitbucket.org/1.0/repositories/' + username + '/' + repository + '/src/' + branch + '/' + file,
                    success: function(res) {
                        callback({
                            link: {
                                href: 'https://bitbucket.org/' + username + '/' + repository + '/src/' + branch + '/' + file,
                                text: 'bitbucket: ' + username + '/' + repository + '/' + branch + '/' + file
                            },
                            markdown: res.data
                        });
                    },
                    error: function() {
                        callback({error: 'The requested bitbucket file is not available.'});
                    }
                });
            },
            cors: function(url, callback) {
                $.ajax({
                    type: 'GET',
                    url: url,
                    success: function(data) {
                        var text = url;
                        if (text.indexOf('http://') === 0) {
                            text = text.substr(7);
                        }
                        callback({
                            link: {href: url, text: 'cors: ' + text},
                            markdown: data
                        });
                    },
                    error: function() {
                        callback({error: 'The requested resource is not available.'});
                    }
                });
            }
        },
        /**
         * @param {Object} options {
         *     gist: 'gist id',
         *     github: 'username/repository/branch/file',
         *     cors: 'url'
         * }. only one entry is required
         * @param {Function} callback function({link: {href: '', text: ''}, title: '', markdown: '', error: ''})
         */
        mdify = function(options, callback) {
            if (options.gist) {
                return resolvers.gist(options.gist, callback);
            }
            var services = ['github', 'bitbucket'];
            for (var i = 0; i < services.length; i++) {
                var service = services[i];
                if (options[service]) {
                    var link = options[service], split = link.split('/', 3), file = '';
                    if (split.length === 3) {
                        var username = split[0], repository = split[1], branch = split[2];
                        file = link.substr(username.length + repository.length + branch.length + 3).trim();
                    }
                    if (file === '') {
                        return callback({error: 'The value of "' + service + '" request parameter does not conform ' +
                            'to the "username/repository/branch/file" pattern.'});
                    }
                    return resolvers[service](username, repository, branch, file, callback);
                }
            }
            if (options.cors) {
                return resolvers.cors(options.cors, callback);
            }
            resolvers.cors('index.md', function(o) { // obviously no CORS is going to be involved
                callback({markdown: o.markdown, error: o.error});
            });
        },
        /**
         * ?key1=value1&key2=value2 -> {key1: 'value1', key2: 'value2'}
         */
        queryParameters = (function () {
            var match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, query = window.location.search.substring(1),
                decode = function (s) {
                    return decodeURIComponent(s.replace(pl, ' '));
                }, result = {};
            while (match = search.exec(query)) {
                result[decode(match[1])] = decode(match[2]);
            }
            return result;
        }()),
        /**
         * @param {Function} callback($header, $article)
         */
        display = (function() {
            var $section = $('body>section'), $header = $section.children('header'), $article = $section.children('article');
            return function(fn) {
                $section.fadeOut(500, function() {
                    $header.show();
                    fn($header, $article);
                    $section.fadeIn(500);
                });
            };
        }()),
        /**
         * Custom Modernizr tests
         */
        Modernizr = {
            filereader: !!(window.File && window.FileList && window.FileReader),
            drop: 'ondrop' in document,
            cors: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest())
        };

    window.Modernizr = window.Modernizr || Modernizr;

    marked.setOptions({
        gfm: true,
        pedantic: false,
        sanitize: false,
        highlight: function(code, lang) {
            var language = pygments2hljs[lang] || lang;
            if (language) {
                try {
                    return hljs.highlight(language, code).value;
                } catch (e) {
                    console.log('Unable to apply highlight.js using language ' + lang +
                        '. Error: ' + e);
                }
            }
            return code;
        }
    });

    mdify(queryParameters, function(o) {
        display(function($header, $article) {
            if (o.link !== undefined) {
                $header.html('<a href="' + o.link.href + '">' + o.link.text + '</a>');
            }
            if (o.markdown !== undefined) {
                $article.html(marked(o.markdown));
                if (o.title !== undefined && queryParameters['hd'] === undefined) {
                    $('<h1>' + o.title + '</h1>').prependTo($article);
                }
            } else {
                $header.hide();
                o.error = o.error || 'No content found.';
                $article.html('<div class="center">' + o.error + '</div>');
            }
            if (queryParameters['hh'] !== undefined || o.link === undefined) {
                $header.hide();
            }
            if (queryParameters['ci'] !== undefined) {
                $article.find('img').closest('p').css({'text-align': 'center'});
            }
        });
    });

    if (Modernizr.drop && Modernizr.filereader) {
        $(document).on('drop', function(event) {
            var files = event.dataTransfer.files;
            if (files) {
                var file = files[0],
                    reader = new FileReader();
                reader.onload = function(e) {
                    var markdown = e.target.result;
                    display(function($header, $article) {
                        $header.html('<a>' + 'file: ' + file.name + '</a>');
                        $article.html(marked(markdown));
                    });
                };
                reader.readAsText(file);
            }
            return false;
        });
    }

}($, marked, hljs));