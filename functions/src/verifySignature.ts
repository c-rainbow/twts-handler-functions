import * as crypto from 'crypto';
import * as functions from 'firebase-functions';
import {getHeaderValue} from './utils';


// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();


// Build the message used to get the HMAC.
function getHmacMessage(twitchMessageId: string, twitchMessageTimestamp: string, rawBody: string): string {
  return twitchMessageId + twitchMessageTimestamp + rawBody;
}


// Get the HMAC.
function getHmac(secret: string, message: string) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}


// Verify whether your signature matches Twitch's signature.
function areEqualMessages(hmac: string, verifySignature: string) {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}


export function verifySignature(request: functions.https.Request) {
  // This is a required environment variable to verify webhook message.
  const secret = process.env.TWITCH_EVENTSUB_SECRET;
  if (!secret) {
    // Missing secret value is a critical error. Throw for 5xx response.
    throw new Error('Env variable TWITCH_EVENTSUB_SECRET is not defined');
  }

  // These are required header values for message verification.
  const headers = request.headers;
  const twitchMessageId = getHeaderValue(headers[TWITCH_MESSAGE_ID]);
  const twitchMessageTimestamp = getHeaderValue(headers[TWITCH_MESSAGE_TIMESTAMP]);
  const twitchMessageSignature = getHeaderValue(headers[TWITCH_MESSAGE_SIGNATURE]);
  if (!twitchMessageId || !twitchMessageTimestamp || !twitchMessageSignature) {
    // Missing header values are client-side issue. Return false and no need to throw.
    functions.logger.error('One or more required EventSub headers are missing.');
    return false;
  }

  const hmacMessage = getHmacMessage(
      twitchMessageId, twitchMessageTimestamp, request.rawBody.toString());
  const hmac = `sha256=${getHmac(secret, hmacMessage)}`;

  return areEqualMessages(hmac, twitchMessageSignature);
}
