/**
 * @module inputController.ts
 * @description Thesaurus API Controller
 */

import * as path from 'path';
import fetch from 'node-fetch';

// Import Interfaces and Types
import { Response, Request, NextFunction } from 'express';
import { IThesaurus, ISynonym } from '../types';

import errorMessages from '../utils/errorMessages';
import fsAsync from '../utils/asyncFileSystem';

import * as dotenv from 'dotenv';
dotenv.config();

const thesaurusCacheFilePath = process.env.NODE_ENV === 'test' ?
  path.resolve(__dirname, '../tests/thesaurusCache.json') :
  path.resolve(__dirname, '../utils/thesaurusCache.json');

/**
 * Helper Function to Look Up Word in Big Huge Thesaurus
 * @param lookupWord 
 * @returns Promise which resolves to thesaurus object
 */
export const bhtApiLookup = (lookupWord: string): Promise<any> => {
  const thesaurusURL = `${process.env.BHT_URL as string}/${process.env.BHT_API_KEY as string}/${lookupWord}/json`;
  return fetch(thesaurusURL)
    .then(res => res.json())
    .catch(err => console.error(err))
}

/**
 * Middleware which reads Local Thesaurus Cache and assigns it to res.locals
 */
const readCache = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  await fsAsync.readFile(thesaurusCacheFilePath)
    .then(thesaurusCache => {
      res.locals.thesaurusCache = thesaurusCache as IThesaurus;
      return next();
    })
    .catch(err => {
      console.error('Thesaurus Cache Read Error: ', err);
      return res.status(500).json(errorMessages.thesaurus.couldNotAccess);
    });
};

/**
 * Middleware which iterates through headline, finding Thesaurus entry for each word
 */
const thesaurusLookup = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  // Iterate through headline array, checking for each word in thesaurusCache
  for (let nlpTag of res.locals.headlineArray) {
    if (!res.locals.thesaurusCache[nlpTag.normal]) {
      // If word isn't in local thesaurus cache, hit Big Huge Thesaurus API to find synonyms
      let rawSynonymArray = await bhtApiLookup(nlpTag.normal);
      // If error, assign empty object to synonymArray
      rawSynonymArray = rawSynonymArray || {};
      let parsedSynonymArray: ISynonym = {};
      for (let partOfSpeech in rawSynonymArray) {
        // Remove multi-word synonyms from cached API response
        parsedSynonymArray[partOfSpeech] = rawSynonymArray[partOfSpeech].syn.filter((word: string) => word.split(' ').length === 1);
        // Set all synonyms to lower-case
        parsedSynonymArray[partOfSpeech] = parsedSynonymArray[partOfSpeech].map((word: string) => word.toLowerCase());
        // If not already included, add word as its own synonym
        if (!parsedSynonymArray[partOfSpeech].includes(nlpTag.normal.toLowerCase())) {
          parsedSynonymArray[partOfSpeech].unshift(nlpTag.normal.toLowerCase());
        }
      };
      // Add synonyms (or null if error) to thesaurus cache
      res.locals.thesaurusCache[nlpTag.normal] = parsedSynonymArray;
      await fsAsync.writeFile(thesaurusCacheFilePath, JSON.stringify(res.locals.thesaurusCache, null, 2));
    }
  }
  return next();
};

// Generate module export object and export
const thesaurusController = {
  readCache,
  thesaurusLookup,
}

export default thesaurusController;
