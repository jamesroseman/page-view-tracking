/**
 * This JavaScript injection requires jQuery to be loaded on the client webpage.
 */

console.log("[x] Loaded JavaScript Tracker!");

function trackEvent(trackerId, eventName, eventValue) {
  console.log(`[-] Tracking event ${eventName} (value: ${eventValue}) - <${trackerId}>`);

  const response = $.post(
    {
      url: "http://localhost:8085",
      data: JSON.stringify({
        "operationName": "TrackEvent",
        "query": "mutation TrackEvent($trackerId: String!, $name: String!, $value:Float) {\ntrackEvent(trackerId: $trackerId, name: $name, value: $value) {\n        id\n        wasSuccessful\n      }\n    }",
        "variables": {
          "trackerId": trackerId,
          "name": eventName,
          "value": eventValue,
        }
      }),
      contentType: 'application/json'
    }
  )
    .done(function() {
      console.log('[x] Tracked!');
    })
    .fail(function(message) {
      console.log('[o] Error tracking event...');
      console.log(message?.responseJSON?.errors.map((error) => error.message).join("\n"));
    });

  return response;
}