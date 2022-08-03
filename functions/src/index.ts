import * as functions from "firebase-functions";
//import {handler} from "./handler";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//


//const REGION = "us-central1";




// const REGION = process.env.CLOUD_FUNCTION_REGION;

/*export const helloWorld = functions
    .region(REGION)
    .runWith({secrets: ["THIS_IS_SECRET"]})
    .https.onRequest(handler);
*/

export const verify = functions.https.onRequest(() => {});

// export const path1 = functions.region(REGION).https.onRequest(handler2);
