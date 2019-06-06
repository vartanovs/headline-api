# Headline Generation API
This API allows users to submit a headline (a string such as an article or blog headline) and receive an array of possible alternative headlines.

Alternative headlines are generated through the following process:
1. The headline is passed through the 'compromise' JavaScript natural language processing module
2. This process identified the part of speech of each word in the headline.
3. Each word is passed through the Big Huge Thesaurus via API to identify synonyms.
4. Synonyms that are the same part of speech are stored into a synonym dictionary.
5. New headlines are generated by selecting synonyms from this dictionary.

## Big Huge Thesaurus API Key
Running this API will require you to have a BHT API Key. Please follow these steps:
1. Go to https://words.bighugelabs.com/api.php
2. Select 'Get an API Key'
3. Select 'Create An Account'
4. Create your account using your e-mail address
5. Describe your application under 'Get an API Key'
6. Receive your API Key

In the project folder, please create a file called '.env'  
Inside the file, please add the following contents:
```
BHT_API_KEY=[YOUR API KEY GOES HERE]
BHT_URL=http://words.bighugelabs.com/api/2
```
This URL and the API KEY you place in .env will be used whenever you hit the Big Huge Thesaurus API.

## App Activation
Running this API from your local machine will require Docker and Docker-Compose.

From the terminal, navigate to the folder containing this project and run:

```sh
$ docker-compose up
```

For machines with Node and NPM installed locally, this command also works:
```sh
$ npm run docker-prod
```

## Usage
Upon running the script above, you will observe the following in the terminal:
```sh
$ Creating api-server ... done
$ Attaching to api-server
...
api-server    | > headline-api@1.0.0 start /usr/src/app
api-server    | > ts-node server
api-server    | Server listening on PORT: 3000
```

This indicates that a server should be running on your local machine.  
Navigate to http://localhost:3000/ and you will see the following message:
> Welcome to the Headline API.  
> This route is not active.  
> Please send a POST request with your headline to "/headline".  
> We will respond with alternate headlines.

This indicates the API is live. You may now issue a POST request to the following endpoint:
```html
localhost:3000/headline
```
With the following body in JSON format:
```JSON
{ "headline": "Quick red alligator" }
```
... substituting the string for any string

Expect the response to match the following JSON format:
```JSON
[
  "Speedy reddish gator.",
  "Fast cherry crocodilian.",
  "Agile ruddy alligator.",
  ...
]
```

## Testing

```sh
$ docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## NPM Scripts
If you have Node and Node Package Manager installed locally, navigate to the project folder and the following scripts are available from the terminal.
```sh
$ npm install
```
This will install all project depenencies on yourlocal machine. This is needed to run the application without the use of docker.
```sh
$ npm start
```
This will start the production server on PORT 3000.
```sh
$ npm run dev
```
This will start the development server on PORT 3000. The server will refresh in response to any changes to non-test files in the server directory.
```sh
$ npm test
```
This will run the test suite.
```sh
$ npm test-coverage
```
This will run the test suite and output a test coverage report.
```sh
$ npm run docker-prod
```
If Docker is installed, this will activate a docker container with all depenencies installed into a volume. The container will activate the production server.
```sh
$ npm run docker-dev
```
If Docker is installed, this will activate a docker container with all depenencies installed into a volume. The container will activate the development server.
```sh
$ npm run docker-test
```
If Docker is installed, this will activate a docker container with all depenencies installed into a volume. The container will run the test suite, generating a test coverage report, and then exit.
```sh
$ npm run docker-update
```
This will update the vartanovs/headline-api image with the latest dependencies and scripts in package.json and push the image to Docker Hub. Running this script is not recommended.