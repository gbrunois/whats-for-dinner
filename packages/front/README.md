#Installation

Create a .env.local file from a [firebase config object](http://support.google.com/firebase/answer/7015592)

```
VUE_APP_API_KEY='api-key'
VUE_APP_AUTH_DOMAIN='project-id.firebaseapp.com'
VUE_APP_DATABASE_URL='https://project-id.firebaseio.com'
VUE_APP_PROJECT_ID='project-id'
VUE_APP_STORAGE_BUCKET='project-id.appspot.com'
VUE_APP_MESSAGING_SENDER_ID='sender-id'
VUE_APP_CLOUD_FUNCTIONS_URL='https://europe-west1-project-id.cloudfunctions.net'
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Run your unit tests

```
npm run test:unit
```
