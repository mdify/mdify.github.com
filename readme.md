Overview
--------

Current branch represents development codebase. In order to get release build:

1. install Node.js and NPM (for details look [here](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
1. clone https://github.com/mdify/mdify.github.com.git
1. cd mdify.github.com
1. git checkout develop
1. npm install
1. either "export PATH=$(pwd)/node_modules/.bin:$PATH" or "sudo npm install -g grunt"
1. grunt release # output goes to the target/release directory
