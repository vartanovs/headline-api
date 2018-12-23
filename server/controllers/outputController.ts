/**
 * @module outputController.ts
 * @description Output Headline Variant Controller
 */

// Import Interfaces and Types
import { Response, Request, NextFunction } from 'express';
import { ISynonym, IThesaurus, INLPTagsObject } from "../types";
import fsAsync from '../utils/asyncFileSystem';
import * as path from 'path';

/**
 * Helper Function - Scan Thesaurus for synonyms, return array of synonyms if available, otherwise return array with original word 
 * @param word Word to look up in thesaurus
 * @param partOfSpeech Part of Speech to look up (noun, adjective, adverb, etc)
 * @param thesaurus Thesaurus object
 * @param count How many synonyms to return
 */
export const checkSynonyms = (word: string, partOfSpeech: string, thesaurus: IThesaurus, count: number = Infinity): string[] => {
  return thesaurus[word][partOfSpeech] ? thesaurus[word][partOfSpeech].slice(0, count) : [word];
}

/**
 * Helper Function - Capitalize the first letter in a word
 */
export const wordToProperCase = (word: string) => word[0].toUpperCase() + word.substr(1);

/**
 * Middleware - Generates an array of same part-of-speech synonyms for each word in the headline
 */
const findSynonyms = (_: Request, res: Response, next: NextFunction) => {
  // Generate object to hold synonyms for each word in headline
  const headlineSynonyms: ISynonym = {};
  // Iterate through headline array, generating synonyms for each word
  for (let nlpTag of res.locals.headlineArray) {
    if (nlpTag.tags.includes('Noun')) {
      headlineSynonyms[nlpTag.normal] = checkSynonyms(nlpTag.normal, 'noun', res.locals.thesaurusCache);
    } else if (nlpTag.tags.includes('Verb')) {
      headlineSynonyms[nlpTag.normal] = checkSynonyms(nlpTag.normal, 'verb', res.locals.thesaurusCache);
    } else if (nlpTag.tags.includes('Adjective')) {
      headlineSynonyms[nlpTag.normal] = checkSynonyms(nlpTag.normal, 'adjective', res.locals.thesaurusCache);
    } else if (nlpTag.tags.includes('Adverb')) {
      headlineSynonyms[nlpTag.normal] = checkSynonyms(nlpTag.normal, 'adverb', res.locals.thesaurusCache);
    } else {
      headlineSynonyms[nlpTag.normal] = [nlpTag.normal];
    }
  }
  res.locals.headlineSynonyms = headlineSynonyms;
  return next();
}

/**
 * Middleware - Generates an array of alternate headlines
 */
const generateOutput = (req: Request, res: Response, next: NextFunction) => {
  const { headlineArray, headlineSynonyms } = res.locals;

  // Determine how many alternate sentences to generate based on word with most synonyms
  const targetAlternateSentenceCount = Math.max(...Object.values(headlineSynonyms).map((arr: string[]) => arr.length));

  // Declare an array in res.locals to hold alternate headlines
  res.locals.alternateHeadlines = [];

  // Generate alternate sentances to push into res.locals
  while (res.locals.alternateHeadlines.length < targetAlternateSentenceCount) {
    // Loop through each word in the headline, substituting in a synonym
    let alternateHeadline: string = req.body.headline;
    headlineArray.forEach((word: INLPTagsObject) => {
      let wordToReplace = word.normal;
      let synonym = headlineSynonyms[word.normal][res.locals.alternateHeadlines.length % headlineSynonyms[word.normal].length];
      // If the word is in proper case, ensure the synonym is also proper case
      if (word.text[0].toUpperCase() === word.text[0]) {
        synonym = wordToProperCase(synonym);
        wordToReplace = wordToProperCase(wordToReplace);
      }
      alternateHeadline = alternateHeadline.replace(wordToReplace, synonym);
    });
    // Push alternate headlines into res.locals array
    res.locals.alternateHeadlines.push(alternateHeadline);
  }
  const someData = res.locals.headlineArray;
  fsAsync.writeFile(path.resolve(__dirname, '../tests/stubs.json'), JSON.stringify(someData, null, 2));
  return next();
}

// Generate module export object and export
const outputController = {
  findSynonyms,
  generateOutput,
}

export default outputController;
