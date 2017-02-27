var webpack = require('webpack');

/**
Webpack combines all files that are required by the entry (/app/main.js) and exports to output (/bin/bundle.js).

For this app, webpack is required in order to include the NODE_ENV environment variable on the front end.
This is required in app/app.js to change your $rootScope.serverUrl.

Note, index.html is now pointing at /bin/bundle.js, not each individual js file.
Any changes made in app/app.js won't automatically be reflected in /bin/bundle.js.
To make that happen, you need to run the command "webpack" on the command line. I've included "webpack" in your package.json. You might need to "npm install".
Alternatively, you run a webpack server while in development, then all changes will automatically be webpackified. It's like nodemon. Start a webpack server using "npm run webpack-server".

To combine your

Love,
Nick
**/
new webpack.EnvironmentPlugin(['NODE_ENV']);

module.exports = {
  entry: [
    __dirname + '/app/main.js'
  ],
  output: {
    path: __dirname + '/bin/',
    filename: 'bundle.js'
  }
}
