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

To send emails, your have to replace your email and your password

If your gmail account use two factors authentication, generate an application password
https://security.google.com/settings/security/apppasswords

```
firebase functions:config:set gmailconfig.user="{EMAIL}"
firebase functions:config:set gmailconfig.password="{PASSWORD}"
firebase functions:config:set app.name="Plan your meals"
firebase functions:config:set app.url="https://xxx.com"
```

If you want to see your actual config :

```
firebase functions:config:get
```
