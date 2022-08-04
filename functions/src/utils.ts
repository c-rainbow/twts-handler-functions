export function getHeaderValue(input: string | string[] | undefined): string | null {
  if (typeof input === 'string') {
    return input;
  }
  /**
   * https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#list-of-request-headers,
   * According to this page, all EventSub related headers have one value maximum.
   * It shouldn't send string[] and we can assume a string[] header value is invalid.
   */
  return null;
}
