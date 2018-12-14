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


export const challengeUpdate = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "*");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.set("Access-Control-Max-Age", "3600");
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

  if (domain === undefined || updatedBy === undefined) {
    response.status(400).send('Empty post request');
    return;
  }
  
  mailOptions.subject = mailOptions.subject + ' : ' + domain + ' : ' + updatedBy
  mailOptions.html =
    ((id !== undefined ) ? ('<b>Id: </b>' + id + '<br>'):'') +
    ((name !== undefined) ? ('<b>Name: </b>' + name + '<br>'):'') +
    ((description !== undefined) ? ('<b>Description: </b>' + description + '<br>'):'') +
    ((impact !== undefined) ? ('<b>Impact: </b>' + impact + '<br>'):'') +
    ((contributor !== undefined) ? ('<b>Contributor: </b>' + contributor + '<br>'):'') +
    ((domain !== undefined) ? ('<b>Domain: </b>' + domain + '<br>'):'') +
    ((status !== undefined) ? ('<b>Status: </b>' + status + '<br>'):'') +
    ((priority !== undefined) ? ('<b>Priority: </b>' + priority + '<br>'):'') +
    ((recommendation !== undefined) ? ('<b>Recommendation: </b>' + recommendation + '<br>'):'') +
    ((githubURL !== undefined) ? ('<b>Github URL: </b>' + githubURL + '<br>'):'') +
    ((owner !== undefined) ? ('<b>Owner: </b>' + owner + '<br>'):'') +
    ((implementor !== undefined) ? ('<b>Implementor: </b>' + implementor + '<br>'):'') +
    ((updatedOn !== undefined) ? ('<b>UpdatedOn: </b>' + updatedOn + '<br>'):'') +
    ((updatedBy !== undefined) ? ('<b>UpdatedBy: </b>' + updatedBy + '<br>'):'');

  cors(request, response, () => {
    mailTransport.sendMail(mailOptions)
      .then(() => {
        response.status(200).send('Email Sent');
        return;
      })
      .catch((error) => {
        console.error('There was an error while sending the email:', error);
        response.status(400).send('There was an error while sending the email:' + error);
        return;
      })
  });
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