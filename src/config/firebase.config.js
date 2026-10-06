import admin from "firebase-admin";
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_CONFIG);

const intializeFirebase = () => {
    admin.initializeApp({
        credential: admin.cert(serviceAccount)
    });
}

export default intializeFirebase;