# Firebase functions for the ERS-HCL site

This project holds the serverless firebase functions used by the ERS-HCL hybrid site (which is build using gatsbyJS)

## Pre-requisite

- Install firebase cli

```
npm install -g firebase-tools
```

Login to your firebase account

## Deploy

- Run the following command to deploy the functions

```
firebase functions:config:set gmail.email=<EMAIL> gmail.password=<PWD> gmail.recepiants=<EMAIL_RECEPIANTS>
firebase deploy
```