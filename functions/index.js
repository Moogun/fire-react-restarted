const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.bigben = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1 // london is UTC + 1hr;
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`);
});

exports.makeUppercase = functions.database.ref('/users/{uid}/username')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.uid, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });

// Keeps track of the length of the 'likes' child list in a separate property.
// exports.countQuestion = functions.database.ref('/posts/{postid}/likes/{likeid}').onWrite(
exports.countQuestion = functions.database.ref('/questions/{tid}/{cid}/{qid}').onWrite(
    (change, context) => {
      // const collectionRef = change.after.ref.parent;
      // const countRef = collectionRef.parent.child('questions_count');
      // console.log('change', change, context);
      let tid = context.params.tid
      let cid = context.params.cid

      const countRef = admin.database().ref(`/courses/${cid}/metadata/questionCount`)


      // const countRef = admin.database().ref(`/courses/${cid}/metadata/questionCount`).transaction(current => {
      //   return (current || 0) + 1;
      // });

      const original = change.after.val();
      // console.log('Uppercasing', context.params.tid, original);

      let increment;
      if (change.after.exists() && !change.before.exists()) {
        increment = 1;
      } else if (!change.after.exists() && change.before.exists()) {
        increment = -1;
      } else {
        return null;
      }

      // Return the promise from countRef.transaction() so our function
      // waits for this async event to complete before it exits.
      return countRef.transaction((current) => {
        return (current || 0) + increment;
      }).then(() => {
        return console.log('Counter updated.');
      });
    });

// If the number of likes gets deleted, recount the number of likes
// exports.recountQuestions = functions.database.ref('/questions/{postid}/likes_count').onDelete((snap) => {
//   const counterRef = snap.ref;
//   const collectionRef = counterRef.parent.child('likes');
//
//   // Return the promise from counterRef.set() so our function
//   // waits for this async event to complete before it exits.
//   return collectionRef.once('value')
//       .then((messagesData) => counterRef.set(messagesData.numChildren()));
// });
