import * as crypto from 'crypto';
import * as functions from "firebase-functions";

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';


function getSecret(): string {
  // TODO: Get your secret from secure storage. This is the secret you passed 
  // when you subscribed to the event.
  return 'secret_value';//process.env.TWITCH_EVENTSUB_SECRET!;
}

// Build the message used to get the HMAC.
function getHmacMessage(request: functions.https.Request): string {
  const headers = request.headers;
  const twitchMessageId = headers[TWITCH_MESSAGE_ID]?.toString() || '';
  const twitchMessageTimestamp = headers[TWITCH_MESSAGE_TIMESTAMP]?.toString() || '';
  const rawBody = request.rawBody.toString();
  return twitchMessageId + twitchMessageTimestamp + rawBody;
}

// Get the HMAC.
function getHmac(secret: string, message: string) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac: string, verifySignature: string) {
  functions.logger.info('hmac_verify:', hmac);
  functions.logger.info('signature:', verifySignature);
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}


export const verifyHandler = (
  request: functions.https.Request,
  response: functions.Response<string>) => {
  
  //functions.logger.info("Secret value:", process.env.THIS_IS_SECRET, "haha");
  //functions.logger.info("Undefined value:", process.env.THIS_IS_UNDEFINED_SECRET, "hehe");

  const secret = getSecret();
  const message = getHmacMessage(request);
  const hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare to Twitch's



  if (true === verifyMessage(hmac, request.headers[TWITCH_MESSAGE_SIGNATURE]?.toString() || '')) {
    functions.logger.info("signatures match");

    // Get JSON object from body, so you can process the message.
    functions.logger.info(request.body);

    // Handle notification...
  }
  else {
    functions.logger.info('403, hmac:', hmac);
    response.sendStatus(403);
    return;
  }

  response.send("Hello from Firebase!");
};