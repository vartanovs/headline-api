/**
 * @module server/app.ts
 * @description Server Declaration
 */

// Import express and body-parser
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Import middleware
import inputController from './controllers/inputController';
import thesaurusController from './controllers/thesaurusController';
import outputController from './controllers/outputController';

// Invoke express server and apply middleware to parse json
const app = express();
app.use(bodyParser.json())

// POST /headline - Route for client to provide headline => respond with array of alternate headlines
app.post('/headline',
  inputController.validateInput,
  inputController.parseInput,
  thesaurusController.readCache,
  thesaurusController.thesaurusLookup,
  outputController.findSynonyms,
  outputController.generateOutput,
  (_: express.Request, res: express.Response) => res.json(res.locals.alternateHeadlines));

const redirectMessage = 'Welcome to the Headline API.<br>\
  This route is not active.<br>\
  Please send a POST request with your headline to "/headline".<br>\
  We will respond with alternate headlines.'

// All other requests result in a 404 and redirect message
app.use('*',
  (_: express.Request, res: express.Response) => res.status(404).send(redirectMessage));

export default app;
