#Warning :
Enable dialogflow webhook before deploy firebase cloud function

- Launch Unit tests

```
npm run test
```

- Deploy the function (ensure the correct gcp project is activated)

```
npm run deploy
```

# Prepare your environment

## Dialogflow

- Create an action on google project
- Add Web site Owner [https://search.google.com/search-console]
- Account linking : copy the key and execute :

```
firebase functions:config:set dialogflow.client_id=<API_KEY>
```

## Cloud functions

To send emails, your have to replace your email and your application gmail password

If your gmail account use two factors authentication, generate an application gmail password
https://security.google.com/settings/security/apppasswords

```bash
firebase functions:config:set gmailconfig.user="${GMAIL_EMAIL_ADRESS}"
firebase functions:config:set gmailconfig.password="${GMAIL_APP_PASSWORD}"
firebase functions:config:set app.name="Plan your meals"
firebase functions:config:set app.url="https://${PROJECT_ID}.firebaseapp.com "
firebase functions:config:set app.cors_origin.0="https://${PROJECT_ID}.web.app"
firebase functions:config:set app.cors_origin.1="https://${PROJECT_ID}.firebaseapp.com"
```

If you want to see your actual config :

```bash
firebase functions:config:get
```

## Debug & Emulation

```
npm run serve:debug
```

Next you can attach to node process on port 9229
