const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan')
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const expressStatusMonitor = require('express-status-monitor')


dotenv.config({ path: '.env.dev' });

let routes = require("./routes")
const app = express();
/**
 * Connect to MongoDB.
 */

mongoose.connect(process.env.MONGO_URI, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});


/**
 * set app variables
 *
 */
 app.set('host', process.env.NODE_ENV_IP || 'localhost');
 app.set('port', process.env.SERVER_PORT || 8080);
 app.use(expressStatusMonitor());
 app.use(logger('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'dev') {
    // only use in development
    app.use(errorHandler());
  } else {
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send('Server Error');
    });
  }


// Use Api routes in the App
app.use('/', routes)


  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  

module.exports = app