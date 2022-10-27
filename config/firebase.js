var admin = require("firebase-admin");

var serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert({...serviceAccount,private_key:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')}),
  storageBucket: "sem5backend.appspot.com"
});

module.exports = {
  storage: admin.storage()
};
