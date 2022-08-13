import * as functions from 'firebase-functions';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

type AllowedTypes = 'channel.follow';

/**
 * Make all fields optional.
 */
export interface EventSubBody {
  subscription?: {
    id?: string;
    status?: string;
    type?: AllowedTypes;
    version?: string;
    condition?: {
      broadcaster_user_id?: string;
    };
    transport?: {
      method?: string;
      callback?: string;
    };
    created_at?: string; // Timestamp string
    cost?: number;
  };
  event?: {
    user_id?: string; // Channel ID of the follower
    user_login?: string; // User login of the follower
    user_name?: string; // Display name of the follower
    broadcaster_user_id?: string; // Channel ID of the streamer
    broadcaster_user_login?: string; // User login of the streamer
    broadcaster_user_name?: string; // Display name of the streamer
    followed_at?: string; // Timestamp string
  };
}

if (!getApps().length) {
  initializeApp();
}

// Initialize outside of the handler function
const db = getFirestore();
const followersRef = db.collection('followers');

/**
 * New follower webhook handler
 * @param body body of POST request from EventSub
 * @return 204 status code
 */
export async function handleNewFollower(body: EventSubBody): Promise<number> {
  if (body?.subscription?.type !== 'channel.follow') {
    functions.logger.error(
      'Unrecognized subscription type',
      body?.subscription?.type
    );
    return 403;
  }

  const followerId = body.event?.user_id;
  const followerLogin = body.event?.user_login;
  const followerDisplayName = body.event?.user_name;

  const streamerId = body.event?.broadcaster_user_id;
  const streamerLogin = body.event?.broadcaster_user_login;
  const streamerDisplayName = body.event?.broadcaster_user_name;

  if (
    !followerId ||
    !followerLogin ||
    !followerDisplayName ||
    !streamerId ||
    !streamerLogin ||
    !streamerDisplayName ||
    !body.event?.followed_at
  ) {
    throw new Error(
      'EventSub notification is missing one or more required fields'
    );
  }

  // This should come after null check
  const timestampInMs = Date.parse(body.event?.followed_at);
  const documentId = `${followerId}_${streamerId}`;

  // Save the follower data in Firestore.
  // NOTE: If Twitch sends a webhook message multiple times for the same
  // follow notification, the notifications will have the same message ID.
  // Firestore will replace the document with the new one, but since they
  // are identical, there will be no effect. The original documents are
  // replaced rarely and therefore it's cheaper than checking for existing
  // ones before setting the new one for every new folloer.
  const doc = followersRef.doc(documentId);
  await doc.set({
    followerId,
    followerLogin,
    followerDisplayName,

    streamerId,
    streamerLogin,
    streamerDisplayName,

    timestamp: new Timestamp(
      Math.round(timestampInMs / 1000),
      (timestampInMs % 1000) * 1_000_000
    ),
  });

  return 204;
}
