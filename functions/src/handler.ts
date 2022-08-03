import * as functions from "firebase-functions";

export const handler = (
    request: functions.https.Request,
    response: functions.Response<string>) => {
  // functions.logger.info('client', { request });
  //functions.logger.info("Secret value:", process.env.THIS_IS_SECRET, "haha");
  //functions.logger.info("Undefined value:", process.env.THIS_IS_UNDEFINED_SECRET, "hehe");
  /* functions.logger.warn("method", request.method, "text");
  functions.logger.info(
      "Hello unstructured logs!", request.method, 'hahahah',
      {anyKey: false, anyValue: 'hello'});
  functions.logger.info("Hello structured logs!", {structuredData: true});*/
  //response.send("Hello from Firebase!");
};
