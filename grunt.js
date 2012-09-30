module.exports = function (grunt) {

    grunt.initConfig({
        server: {
            base: ['src/webapp', 'target/generated'],
            port: 8000
        },
        watch: {
            stylus: {
                files: ['src/webapp/*.styl'],
                tasks: 'stylus on-demand-reload'
            },
            html: {
                files: ['src/webapp/*.html'],
                tasks: 'on-demand-reload'
            }
        },
        reload: {
            port: 8001,
            proxy: {
                host: 'localhost',
                port: 8000
            }
        },
        stylus: {
            index: {
                src: 'src/webapp/index.styl',
                dest: 'target/generated/index.css'
            }
        },
        minjs: {
            release: 'target/release'
        },
        mincss: {
            release: 'target/release'
        },
        minhtml: {
            release: 'target/release'
        },
        context: {
            release: {
                options: {
                    server: {
                        base: ['target/release']
                    },
                    watch: {}
                }
            }
        },
        rsync: {
            release: {
                src: ['src/webapp', 'target/generated'],
                dest: 'target/release',
                exclude: ['package.json', 'index.styl'],
                deleteBefore: true
            }
        },
        lint: {
            files: ['grunt.js', 'src/webapp/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-context');
    grunt.loadNpmTasks('grunt-reload');
    grunt.loadNpmTasks('grunt-htmlcompressor');

    grunt.registerTask('default', 'stylus server reload watch');
    grunt.registerTask('release', 'stylus rsync minjs mincss minhtml');
    grunt.registerTask('rserver', 'context:release server watch');

    grunt.registerTask('server', 'Static Web Server', function() {
        // server task, provided by grunt, doesn't support multiple base directories
        // this one - does
        var path = require('path'), connect = require('connect'),
            port = grunt.config('server.port'),
            base = grunt.config('server.base'),
            middleware = [];
        for (var i = 0; i < base.length; i++) {
            middleware.push(connect['static'](base[i]));
        }
        connect.apply(null, middleware).listen(port);
        grunt.log.writeln('Static Web Server listing on port ' + port);
    });

    grunt.registerTask('on-demand-reload', 'On Demand Reload', function() {
        try {
            grunt.task.current.requires('reload');
            grunt.task.run('reload');
        } catch(ex) {
            // means 'reload' wasn't started before,
            // so there is no need to call for update
        }
    });

    grunt.registerMultiTask('stylus', 'Stylus Compiler', function() {
        var stylus = require('stylus'), path = require('path'),
            sourceFile = this.file.src,
            destFile = this.file.dest,
            sourceFileContent = grunt.file.read(sourceFile);
        stylus.render(sourceFileContent, { filename: destFile, paths: [path.dirname(sourceFile)] }, function(err, css){
            if (err) {
                grunt.warn(err);
            } else {
                grunt.file.write(destFile, css);
                grunt.log.writeln(sourceFile + ' compiled into ' + destFile);
            }
        });
    });

    grunt.registerMultiTask('minjs', 'Recursive Uglify', function() {
        var directory = this.file.src;
        grunt.file.recurse(directory, function(file) {
            if (file.substr(-3) === '.js') {
                var sourceJS = grunt.file.read(file);
                var minifiedJS = grunt.helper('uglify', sourceJS, grunt.config('uglify'));
                grunt.file.write(file, minifiedJS);
                grunt.log.writeln('Uglified "' + file + '".');
                grunt.helper('min_max_info', minifiedJS, sourceJS);
            }
        });
    });

    grunt.registerMultiTask('mincss', 'Recursive Sqwish', function() {
        var directory = this.file.src;
        var sqwish = require('sqwish');
        grunt.file.recurse(directory, function(file) {
            if (file.substr(-4) === '.css') {
                var sourceCSS = grunt.file.read(file);
                var minifiedCSS = sqwish.minify(sourceCSS, false);
                // sqwish removes line breaks which may cause IE go nuts
                // r.js/css seems like a better option
                grunt.file.write(file, minifiedCSS);
                grunt.log.writeln('Sqwished "' + file + '".');
                grunt.helper('min_max_info', minifiedCSS, sourceCSS);
            }
        });
    });

    grunt.registerMultiTask('minhtml', 'Recursive HTML Compression', function() {
        var directory = this.file.src,
            taskDone = this.async(),
            totalNumberOfHTMLFiles = 0,
            numberOfCompressedHTMLFiles = 0;
        grunt.file.recurse(directory, function(file) {
            if (file.substr(-5) === '.html') {
                totalNumberOfHTMLFiles++;
                grunt.helper('htmlcompressor', file, {}, function(minifiedHTML) {
                    var sourceHTML = grunt.file.read(file);
                    grunt.file.write(file, minifiedHTML);
                    grunt.log.writeln('Compressed "' + file + '".');
                    grunt.helper('min_max_info', minifiedHTML, sourceHTML);
                    numberOfCompressedHTMLFiles++;
                });
            }
        });
        // workaround over grunt-htmlcompressor's htmlcompressor helper design
        var wid = setInterval(function() {
            if (totalNumberOfHTMLFiles === numberOfCompressedHTMLFiles) {
                clearInterval(wid);
                taskDone();
            }
        }, 500);
    });

    grunt.registerMultiTask('rsync', 'RSync', (function() {
        var fs = require('fs'),
            rmdirSyncRecursive = function(path) {
                var files = fs.readdirSync(path);
                for (var i = 0; i < files.length; i++) {
                    var file = path + '/' + files[i], stat = fs.lstatSync(file);
                    if (stat.isDirectory()) {
                        rmdirSyncRecursive(file);
                    } else {
                        fs.unlinkSync(file);
                    }
                }
                return fs.rmdirSync(path);
            },
            cpdirSyncRecursive = function(src, dest, includeFn) {
                try {
                    fs.mkdirSync(dest, fs.statSync(src).mode);
                } catch (e) {
                    if (e.code !== 'EEXIST') throw e;
                }
                var files = fs.readdirSync(src);
                for (var i = 0; i < files.length; i++) {
                    var srcFile = src + '/' + files[i], srcStat = fs.lstatSync(srcFile),
                        destFile = dest + '/' + files[i];
                    if (includeFn && !includeFn(srcFile)) {
                        continue;
                    }
                    if (srcStat.isDirectory()) {
                        cpdirSyncRecursive(srcFile, destFile, includeFn);
                    } else if (srcStat.isSymbolicLink()) {
                        var symlink = fs.readlinkSync(srcFile);
                        fs.symlinkSync(symlink, destFile);
                    } else {
                        var content = fs.readFileSync(srcFile);
                        fs.writeFileSync(destFile, content);
                    }
                }
            },
            /**
             * @param options options
             * @param {String} options.src source directory
             * @param {String} options.dest target directory
             * @param {Boolean} options.deleteBefore false by default.
             * indicates whether to remove destination directory before synchronization
             * @param {Array} options.exclude file names to exclude. optional
             */
            rsync = function(options) {
                if (fs.existsSync(options.dest)) {
                    if (options.deleteBefore) {
                        rmdirSyncRecursive(options.dest);
                    }
                } else {
                    // mkdir -p emulation would be great
                    fs.mkdirSync(options.dest);
                }
                options.exclude = options.exclude || [];
                var inclusionFn = function(file) {
                    file = file.replace(/\\/g, '/');
                    for (var i = 0; i < options.exclude.length; i++) {
                        var exclusion = options.exclude[i];
                        var index = file.indexOf(exclusion);
                        if (index > -1 && (index === 0 || file[index - 1] === '/') &&
                            (file.length === index + exclusion.length || file[index + exclusion.length] === '/')) {
                            return false;
                        }
                    }
                    return true;
                };
                for (var i = 0; i < options.src.length; i++) {
                    var src = options.src[i];
                    cpdirSyncRecursive(src, options.dest, inclusionFn);
                }
            };
        return function() {
            rsync(this.data);
        };
    }()));

};
