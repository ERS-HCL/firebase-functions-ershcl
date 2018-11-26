import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const gmailRecepiants = functions.config().gmail.recepiants;
const mailFrom = '"ERS Open Source" <noreply@ersoss.com>';
const mailSubject = 'New Challenge Update !'

const whitelist = ['http://localhost:8000', 'https://ers-hcl.github.io/']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
const cors = require('cors')(corsOptions);

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


export const challengeUpdate = functions.https.onRequest(async (request, response) => {

  const {
    updatedOn,
    updatedBy,
    id,
    name,
    description,
    impact,
    contributor,
    domain,
    status,
    priority,
    recommendation,
    githubURL,
    owner,
    implementor
  } = request.body;


  const mailOptions = {
    from: mailFrom,
    to: gmailRecepiants,
    subject: mailSubject,
    html: ''
  };
  mailOptions.subject = mailOptions.subject + ' : ' + domain + ' : ' + updatedBy
  mailOptions.html =
    ((id) && ('<b>Id: </b>' + id + '<br>')) +
    ((name) && ('<b>Name: </b>' + name + '<br>')) +
    ((description) && ('<b>Description: </b>' + description + '<br>')) +
    ((impact) && ('<b>Impact: </b>' + impact + '<br>')) +
    ((contributor) && ('<b>Contributor: </b>' + contributor + '<br>')) +
    ((domain) && ('<b>Domain: </b>' + domain + '<br>')) +
    ((status) && ('<b>Status: </b>' + status + '<br>')) +
    ((priority) && ('<b>Priority: </b>' + priority + '<br>')) +
    ((recommendation) && ('<b>Recommendation: </b>' + recommendation + '<br>')) +
    ((githubURL) && ('<b>Github URL: </b>' + githubURL + '<br>')) +
    ((owner) && ('<b>Owner: </b>' + owner + '<br>')) +
    ((implementor) && ('<b>Implementor: </b>' + implementor + '<br>')) +
    ((updatedOn) && ('<b>UpdatedOn: </b>' + updatedOn + '<br>')) +
    ((updatedBy) && ('<b>UpdatedBy: </b>' + updatedBy + '<br>'));

  return cors(request, response, async () => {
    try {
      await mailTransport.sendMail(mailOptions);

      //  console.log(val);
      response.send('Email Sent');

    } catch (error) {
      console.error('There was an error while sending the email:', error);
    }
  })
});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

/* export const sendChallengeUpdateEmail = functions.database.ref('/data').onWrite(async (change) => {
  const snapshot = change.after;
  const val = snapshot.val();

  const mailOptions = {
    from: mailFrom,
    to: gmailRecepiants,
    subject: '',
    text: ''
  };
  mailOptions.subject = 'New Challenge Update !'
  mailOptions.text = JSON.stringify(val);
  try {
    await mailTransport.sendMail(mailOptions);
    console.log(val);
  } catch (error) {
    console.error('There was an error while sending the email:', error);
  }
  return null;

});
 */