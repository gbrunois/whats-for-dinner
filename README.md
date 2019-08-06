[![Build Status](https://travis-ci.com/gbrunois/whats-for-dinner.svg?branch=master)](https://travis-ci.com/gbrunois/whats-for-dinner)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

# whats-for-dinner

Plan your meals is an application to plan the meals of the week

# Installation

## Firebase

    - Create a firebase project
    - Enable Firestore

## Dialogflow

    - Create an action on google project

# Continous delivery

- Linked with Travis CI
  ...Generate firebase API KEY: [How-to](https://docs.travis-ci.com/user/deployment/firebase/)

Configurer travis :
clé API Firebase : https://docs.travis-ci.com/user/deployment/firebase/

OAuth consent screen in the Google Cloud Console
https://console.cloud.google.com/apis/credentials/consent?project=plan-your-meals&folder&organizationId&duration=P1D

Clé API : account linking page
firebase functions:config:set dialogflow.client_id=<Clé api>
display conf : firebase functions:config:get

Google Search Console
Add owner
https://search.google.com/search-console?resource_id=https%3A%2F%2Fplan-your-meals.web.app%2F
