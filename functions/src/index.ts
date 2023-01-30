import * as functions from 'firebase-functions';
import { recentFollowHandler } from './getRecentFollowers';
import { webhookHandler } from './webhookHandler';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const webhook = functions
  .runWith({
    secrets: [
      'TWITCH_EVENTSUB_SECRET',
    ],
  })
  .https.onRequest(webhookHandler);

export const recentFollowers = functions
  .runWith({
    secrets: [
      'TWITCH_CLIENT_ID',
      'TWITCH_CLIENT_SECRET',
      'TWITCH_EVENTSUB_SECRET',
    ],
  })
  .https.onRequest(recentFollowHandler);

// export const path1 = functions.region(REGION).https.onRequest(handler2);
