/**
 * @module inputController.ts
 * @description User Input Controller
 */

import { Request, Response, NextFunction } from 'express';
import { INLPTagsObject } from '../types';
import errorMessages from '../utils/errorMessages';

const nlp = require('compromise')

/**
 * Middleware - Parse input into individual words and their parts of speech using Natural Language Processing (compromise library)
 */
const parseInput = (req: Request, res: Response, next: NextFunction): void | Response => {
  res.locals.headlineNLP = nlp(req.body.headline);
  res.locals.headlineArray = res.locals.headlineNLP.out('tags') as INLPTagsObject[];
  return next();
}

/**
 * Middleware - Confirm that a 'headline' body parameter was provided with a valid input
 */
const validateInput = (req: Request, res: Response, next: NextFunction): void | Response => {
  if (!req.body.headline) return res.status(400).json(errorMessages.headline.noHeadline);
  if (typeof req.body.headline !== 'string') return res.status(400).json(errorMessages.headline.invalidHeadline);
  return next();
}

// Generate module export object and export
const inputController = {
  parseInput,
  validateInput,
}

export default inputController;
