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
const cookieParser = require('cookie-parser');
const session = require('express-session')
const _ = require('lodash');

// module variables
const config = require('./config.json');
const defaultConfig = config.dev;
const environment = process.env.NODE_ENV || 'dev';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
global.gConfig = finalConfig;


dotenv.config({ path: '.env.dev' });

let routes = require("./routes/routes")
const app = express();
/**
 * Connect to MongoDB.
 */

mongoose.connect(global.gConfig.mongo_uri, {
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
const port = global.gConfig.server_port
 app.set('host', process.env.NODE_ENV_IP || 'localhost');
 app.set('port', port || 8080);
 app.use(expressStatusMonitor());
 app.use(logger('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(cookieParser());

//  app.use(session({
//   key: 'user_session_id',
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//       expires: 600000
//   }
// }));

app.use((req, res, next) => {
  if (req.cookies.user_session_id && !req.session.user) {
      res.clearCookie('user_session_id');        
  }
  next();
});


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
app.use(routes)


  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  

module.exports = app