import * as functions from 'firebase-functions';

//import {initializeApp} from 'firebase-admin/app';
// import {getFirestore, Timestamp} from 'firebase-admin/firestore';
/*
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

/*
if (!clientId || !clientSecret) {
  throw new Error('Twitch client ID or client secret is missing');
}
*/
/*
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });
*/


// Initialize outside of the handler function
//initializeApp();
//const db = getFirestore();
//const followersRef = db.collection('followers');

/**
 *
 * @param body body of POST request from EventSub
 * @returns
 */
 export async function recentFollowHandler(
  req: functions.https.Request, res: functions.Response<string>) {

  // Check 1. Only allow POST requests
  if (req.method !== 'POST') {
    res.sendStatus(405);
    return;
  }

  // Check 2. Channel ID to download follower
  const channelId = req.body.channelId as string;
  if (!channelId) {
    res.status(403).send('Channel ID is required');
    return;
  }

  /*
  const response = await apiClient.users.getFollows({ followedUser: channelId, limit: 10 });
  for (const follower of response.data) {
    functions.logger.info('follower: ', follower);
  }
  */
}