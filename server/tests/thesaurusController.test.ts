/**
 * @module inputController.test.ts
 * @description Testing for Thesaurus Controller
 */

import * as httpMocks from 'node-mocks-http';

import { Request, Response } from 'express';

import thesaurusController, { bhtApiLookup } from '../controllers/thesaurusController';

import { headlineArray, thesaurusCache } from './localStubs';

let request: httpMocks.MockRequest<Request>;;
let response: httpMocks.MockResponse<Response>;
let next = jest.fn();

describe('Helper Function - Big Huge Thesaurus API Lookup', () => {
  it('Hits the Big Huge Thesaurus URL, returning an object indicating synonyms', async () => {
    const data = await bhtApiLookup('dinosaur');
    expect(data).toHaveProperty('noun');
    expect(data.noun).toHaveProperty('syn');
  })
});

describe('Thesaurus Controller - Read Cache Middleware', () => {
  beforeEach(() => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/headline',
      body: {
        headline: 'Quick brown fox.'
      }
    });
    response = httpMocks.createResponse();
    next.mockClear();
  })

  it('Thesaurus Cache written into res.locals', async () => {
    await thesaurusController.readCache(request, response, next);
    expect(response._getLocals()).toHaveProperty('thesaurusCache');
  });

  it('Next is called once res.locals is populated', async () => {
    await thesaurusController.readCache(request, response, next);
    expect(next.mock.calls.length).toEqual(1);
  });
});

describe('Thesaurus Controller - Thesaurus Lookup Middleware', () => {
  beforeEach(() => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/headline',
      body: {
        headline: 'Quick brown fox.'
      }
    });
    next.mockClear();
  })

  it('Will populate thesaurusCache.json and res.locals.thesaurusCache', async () => {
    response = httpMocks.createResponse({
      locals: {
        headlineArray: headlineArray,
        thesaurusCache: {},
      }
    });
    await thesaurusController.thesaurusLookup(request, response, next);
    expect(response._getLocals()).toHaveProperty('thesaurusCache');
    expect(Object.keys(response._getLocals().thesaurusCache).length).toEqual(response._getLocals().headlineArray.length);
  });

  it('Will use contents of res.locals.thesaurusCache if available', async () => {
    response = httpMocks.createResponse({
      locals: {
        headlineArray: headlineArray,
        thesaurusCache: thesaurusCache,
      },
    });
    await thesaurusController.thesaurusLookup(request, response, next);
    expect(response._getLocals()).toHaveProperty('thesaurusCache');
    expect(Object.keys(response._getLocals().thesaurusCache).length).toEqual(response._getLocals().headlineArray.length);
  });

  it('Next is called once res.locals is populated', async () => {
    response = httpMocks.createResponse({
      locals: {
        headlineArray: headlineArray,
        thesaurusCache: thesaurusCache,
      },
    });
    await thesaurusController.thesaurusLookup(request, response, next);
    expect(next.mock.calls.length).toEqual(1);
  });
});
