
chrome.webRequest.onBeforeRequest.addListener(
  function(request) {
    if(request.method == "POST") {
      var requestBody = decodeBody(request.requestBody.raw[0].bytes);
      requestBody = replaceParameterValue(requestBody, "body", function(full, key, value){
        return key + "GOSU";
      });
      request.requestBody = encodeBody(requestBody);
    }
    return {
      requestBody: request.requestBody
    };
  },
  { urls: ["https://www.messenger.com/messaging/send/*"] },
  [ "blocking", "requestBody" ]
);

function replaceParameterValue(queryString, parameter, replaceFunc) {
  return queryString.replace(RegExp('([?&]' + parameter + '=)([^&]*)'), replaceFunc);
}

function decodeBody(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function encodeBody(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
