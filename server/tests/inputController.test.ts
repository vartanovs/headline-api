/**
 * @module inputController.test.ts
 * @description Testing for Input Headline Variant Controller
 */

import * as httpMocks from 'node-mocks-http';

import { Request, Response } from 'express';

import inputController from '../controllers/inputController';
import errorMessages from '../utils/errorMessages';

let request: httpMocks.MockRequest<Request>;;
let response: httpMocks.MockResponse<Response>;
let next = jest.fn();

const nlp = require('compromise')

describe('Input Controller - Validate Input Middleware', () => {
  beforeEach(() => {
    response = httpMocks.createResponse();
    next.mockClear();
  })

  it('Client receives status 400 and "noHeadline" error if headline not provided in req.body', () => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/headline',
    });
    inputController.validateInput(request, response, next);
    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response._getData())).toEqual(errorMessages.headline.noHeadline);
    expect(next.mock.calls.length).toEqual(0);
  });

  it('Client receives status 400  and "invalidHeadline" error if req.body.headline is not a string', () => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/headline',
      body: {
        headline: []
      }
    });
    inputController.validateInput(request, response, next);
    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response._getData())).toEqual(errorMessages.headline.invalidHeadline);
    expect(next.mock.calls.length).toEqual(0);
  });

  it('Next is called if req.body contains a headline which is a string', () => {
    request = httpMocks.createRequest({
      method: 'POST',
      url: '/headline',
      body: {
        headline: 'Quick brown fox.'
      }
    });
    inputController.validateInput(request, response, next);
    expect(next.mock.calls.length).toEqual(1);
  });
});

describe('Input Controller - Parse Input Middleware', () => {
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

  it('Middleware calls compromise nlp module, passing in the headline', () => {
    inputController.parseInput(request, response, next);
    const locals = response._getLocals();
    expect(Object.keys(locals.headlineNLP)).toEqual(Object.keys(nlp(request.body.headline)));
  });

  it('Headline Array has an entry for each word in the headline', () => {
    inputController.parseInput(request, response, next);
    const locals = response._getLocals();
    expect(locals.headlineArray.length).toEqual(request.body.headline.split(' ').length);
  });

  it('Next is called once res.locals is popualted', () => {
    inputController.parseInput(request, response, next);
    expect(next.mock.calls.length).toEqual(1);
  });
});
