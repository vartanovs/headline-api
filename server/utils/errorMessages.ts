
/**
 * @module errorMessages.ts
 * @description Error Message Utility
 */

const errorMessages = {
  headline: {
    noHeadline: { 'error': 'No headline provided' },
    invalidHeadline: { 'error': 'Headline must be a string' },
  },
  thesaurus: {
    couldNotAccess: { 'error': 'An error occured with your request, please try again later'}
  }
};

export default errorMessages;
