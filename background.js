var messageSelector = '#u_0_0 > div > div > div._1q5- > div._20bp > div._4_j4 > div._mh6 > div > div._4rv3 > div > div > div > div._5rp7._5rp8 > div > div > div > div > div > span > span';

var spaceTypes = {
  'default': 'A',
  'noWidth': 'B',
  'hair': 'C',
  'punctuation': 'D',
  // 'default': '&#x0020;',
  // 'noWidth': '&#x180E;',
  // 'hair': '&#x200A;',
  // 'punctuation': '&#x2008;',
}

var kernStyles = {
  'default': [
    { 'spaceType': 'hair',
      'probability': 3/10,
      'multiple':  1,
    },
    { 'spaceType': 'punctuation',
      'probability': 3/10,
      'multiple': 1,
    },
    { 'spaceType': 'default',
      'probability': 2/10,
      'multiple': 1,
    },
    { 'spaceType': 'default',
      'probability': 1/10,
      'multiple': 2,
    },
  ],
  'mobileHate': [
    { 'spaceType': 'hair',
      'probability': 4/10,
      'multiple': 1,
    },
    { 'spaceType': 'hair',
      'probability': 3/10,
      'multiple': 2,
    },
    { 'spaceType': 'hair',
      'probability': 2/10,
      'multiple': 4,
    },
    { 'spaceType': 'hair',
      'probability': 1/15,
      'multiple': 6,
    },
  ],
}

var shouldKern = true;


function initialKern() {
  document.querySelector('[aria-label="Type a message..."]').addEventListener('keydown', domKern, false);
}
initialKern();

function domKern(e) {
  if (shouldKern && e.keyCode === 13 && !e.shiftKey) {
    var rawTextInput = document.querySelector(messageSelector);
    if (rawTextInput) {
      rawTextInput.innerHTML = properKerning(rawTextInput.innerText);
    }
  }
}

function properKerning(text, kernStyle) {
  var textObj = stringToObject(text);
  var kernOptions = kernStyle ? kernStyles[kernStyle] :  pickRandom(kernStyles);

  for (letter in textObj) {
    for (var i = 0; i < kernOptions.length; i++) {
      var kernOption = kernOptions[i];
      if (Math.random() < kernOption.probability) {
        textObj[letter] += spaceTypes[kernOption.spaceType].repeat(kernOption.multiple);
      }
    }
  }

  return objectToString(textObj);
}

function stringToObject(text) {
  var obj = {};
  for (var i = 0; i < text.length; i++) {
    obj[i] = text[i];
  }
  return obj;
}

function objectToString(obj) {
  var text = "";
  for (key in obj) {
    text += obj[key];
  }
  return text;
}

function pickRandom(selection) {
  if (typeof selection != 'object') {
    return null;
  }

  if (selection.length) {
    var random
    return selection[Math.trunc(Math.random() * selection.length)];
  }

  return selection[pickRandom(Object.keys(selection))];
}
