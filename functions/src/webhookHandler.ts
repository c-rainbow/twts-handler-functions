import * as functions from "firebase-functions";
import { getHeaderValue } from "./utils";
import { verifySignature } from "./verifySignature";


const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_REVOCATION = 'revocation';
const ALL_MESSAGE_TYPES = [
  MESSAGE_TYPE_NOTIFICATION,
  MESSAGE_TYPE_VERIFICATION,
  MESSAGE_TYPE_REVOCATION,
];


export const webhookHandler = (
    req: functions.https.Request,
    res: functions.Response<string>) => {
  
  // Check 1. Only allow POST requests
  if (req.method !== 'POST') {
    res.sendStatus(405);
    return;
  }

  // Check 2. See if a required header is missing.
  const messageType = getHeaderValue(req.headers[MESSAGE_TYPE]);
  if (!messageType || !ALL_MESSAGE_TYPES.includes(messageType)) {
    functions.logger.info('Invalid message type', messageType);
    res.sendStatus(403);
    return;
  }
  
  // Check 3. Match signature from Twitch
  if (!verifySignature(req)) {
    res.sendStatus(403);
    return;
  }

  switch (messageType) {
    case MESSAGE_TYPE_NOTIFICATION:
      // TODO: Store the information in Firestore
      res.sendStatus(200);
      return;
    case MESSAGE_TYPE_VERIFICATION:
      /**
       * TODO: More verification logic.
       * For now, just return 200. This is highly likely a valid message from Twitch
       * because the message signature matches.
       */
      // The default header is text/html.
      res.setHeader('content-type', 'text/plain').send(req.body.challenge);
      return;
    case MESSAGE_TYPE_REVOCATION:
      functions.logger.info('EventSub subscription is revoked.');
      res.sendStatus(204);
      return;
  }
};
