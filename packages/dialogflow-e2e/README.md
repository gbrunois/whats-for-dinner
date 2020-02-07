# How to

https://developers.google.com/assistant/sdk/guides/service/python/embed/config-dev-project-and-account

# enable API

https://console.developers.google.com/apis/api/embeddedassistant.googleapis.com/overview?project=<PROJECT_NAME>

# register new device

https://console.actions.google.com/u/0/project/<PROJECT_NAME>/deviceregistration/

# connect to google assistant

https://github.com/codeforequity-at/botium-connector-google-assistant

# create service account with DialogflowAdmin API Role

https://console.cloud.google.com/iam-admin/serviceaccounts?project=<PROJECT_NAME>

Issue with botium-connector-google-assistant0.04 => end conversation response sended two times

- Launch E2E

```
npm run e2e
```

- Launch Only one test

  - add a @debug decorator on the scenario you want to test

  ```
  npm run tag @debug
  ```

- Test connection to DialogFlow via Botium

```
botium-cli emulator
```
