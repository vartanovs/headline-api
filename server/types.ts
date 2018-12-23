/**
 * @module server/types.ts
 * @description Common Types and Interfaces
 */

// Interface for Objects produced by compromise NLP library
export interface INLPTagsObject {
  text: string,
  normal: string,
  tags: string[],
}

// Interface for Thesaurus Object
export interface IThesaurus {
  [word: string]: any,
};

// Interface for Synonym List
export interface ISynonym {
  [partOfSpeech: string]: string[],  
};