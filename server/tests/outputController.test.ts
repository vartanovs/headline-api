/**
 * @module outputController.test.ts
 * @description Testing for Output Controller
 */

import { checkSynonyms, wordToProperCase } from "../controllers/outputController";
import { thesaurusCache } from "./localStubs";

describe('Helper Function - Check Synonyms', () => {
  it('Returns an array of all thesaurus synonyms matching the part of speech passed in', () => {
    const quickSynonyms = checkSynonyms('quick', 'adjective', thesaurusCache);
    const adjectiveCount = thesaurusCache.quick.adjective.length;
    expect(quickSynonyms).toHaveLength(adjectiveCount);
  });

  it('Returns an array of "count" thesaurus synonyms if count is less than total synonyms', () => {
    const quickSynonyms = checkSynonyms('quick', 'adjective', thesaurusCache, 3);
    expect(quickSynonyms).toHaveLength(3);
  });

  it('Returns an array of only the word passed in if no matching part of speech', () => {
    const quickSynonyms = checkSynonyms('quick', 'verb', thesaurusCache);
    expect(quickSynonyms).toHaveLength(1);
    expect(quickSynonyms[0]).toEqual('quick');
  });
});

describe('Helper Function - Word to Proper Case', () => {
  it('Returns a word with the first letter capitalized', () => {
    const hello = 'hello'
    expect(hello[0]).not.toEqual(hello[0].toUpperCase());
    const properHello = wordToProperCase(hello)
    expect(properHello).toHaveLength(hello.length);
    expect(properHello[0]).toEqual(properHello[0].toUpperCase());
    expect(properHello.substr(1)).toEqual(hello.substr(1));
  })
});