import * as functions from 'firebase-functions';
import { recentFollowHandler } from './getRecentFollowers';
import { webhookHandler } from './webhookHandler';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//


// const REGION = "us-central1";


// const REGION = process.env.CLOUD_FUNCTION_REGION;

/* export const helloWorld = functions
    .region(REGION)
    .runWith({secrets: ["THIS_IS_SECRET"]})
    .https.onRequest(handler);
*/
export const webhook = functions.https.onRequest(webhookHandler);

export const recentFollowers = functions.https.onRequest(recentFollowHandler);

// export const path1 = functions.region(REGION).https.onRequest(handler2);
