var requestQueue = {};

chrome.webRequest.onBeforeRequest.addListener(
    function(request) {
        if(request.method == 'POST') {
            var requestBody = decodeBody(request.requestBody.raw[0].bytes);
            if (requestBody) {
                requestQueue[request.requestId] = requestBody;
            }
        }
        return {cancel: false};
    },
    {urls: ['https://www.messenger.com/messaging/send/*'] },
    ['blocking', 'requestBody']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(request) {
        var ekernalHeader = {
            name: 'ekernal-proxied',
            value:  'true',
        }

        for (var i = 0; i < request.requestHeaders.length; i++) {
            if (request.requestHeaders[i].name === ekernalHeader.name) {
                request.requestHeaders.splice(i, 1);
                console.log('PROXIED', JSON.stringify(request.requestHeaders));
                return {cancel: false};
            }
        }

        if (requestQueue[request.requestId] === undefined) {
            return {cancel: false};
        }

        console.log('UNPROXIED', JSON.stringify(request.requestHeaders));

        var requestBody = replaceParameterValue(requestQueue[request.requestId], 'body', function(full, key, value){
            if (value) {
                return key + properKerning(value);
            }
            return full;
        });

        makeRequest('POST', request.url, request.requestHeaders.concat(ekernalHeader), encodeBody(requestBody));
        return {cancel: true};
    },
    {urls: ['https://www.messenger.com/messaging/send/*'] },
    ['blocking', 'requestHeaders']
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

function makeRequest(type, path, headers, body) {
    var request = new XMLHttpRequest();
    request.open(type, path, true);

    for (var i = 0; i < headers.length; i++) {
        if (['Origin', 'User-Agent', 'Referer', 'Accept-Encoding', 'Cookie'].includes(headers[i].name)) {
            continue;
        }
        request.setRequestHeader(headers[i].name, headers[i].value || headers[i].binaryValue);
    }

    request.send(body);
}