[![Build Status](https://travis-ci.com/gbrunois/whats-for-dinner.svg?branch=master)](https://travis-ci.com/gbrunois/whats-for-dinner)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

# whats-for-dinner

Plan your meals is an application to plan the meals of the week

# Installation

## Firebase

    - Create a firebase project
    - Enable Firestore
    - Enable billing on Google Cloud Project
    - Configure Consent Screen [https://console.cloud.google.com/apis/credentials/consent]

## Dialogflow

    - Create an action on google project
    - Add Web site Owner [https://search.google.com/search-console]
    - Account linking : copy the key and
    ```
    firebase functions:config:set dialogflow.client_id=<API_KEY>
    ```

# Continous delivery

- Linked with Travis CI
  ...Generate firebase API KEY: [How-to](https://docs.travis-ci.com/user/deployment/firebase/)
