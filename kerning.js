var messageSelector = '#u_0_0 > div > div > div._1q5- > div._20bp > div._4_j4 > div._mh6 > div > div._4rv3 > div > div > div > div._5rp7._5rp8 > div > div > div > div > div > span > span';

var spaceTypes = {
    'default': String.fromCharCode(32),
    'noWidth': String.fromCharCode(6158),
    'hair': String.fromCharCode(8202),
    'punctuation': String.fromCharCode(8200),
}

var kernStyles = {
    'default': [{
        'spaceType': 'hair',
        'probability': 3 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'punctuation',
        'probability': 3 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'default',
        'probability': 2 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'default',
        'probability': 1 / 10,
        'multiple': 2,
    }, ],
    'mobileHate': [{
        'spaceType': 'hair',
        'probability': 4 / 10,
        'multiple': 1,
    }, {
        'spaceType': 'hair',
        'probability': 3 / 10,
        'multiple': 2,
    }, {
        'spaceType': 'hair',
        'probability': 2 / 10,
        'multiple': 4,
    }, {
        'spaceType': 'hair',
        'probability': 1 / 15,
        'multiple': 6,
    }, ],
}

function properKerning(text, kernStyle) {
    var textObj = stringToObject(text);
    var kernOptions = kernStyle ? kernStyles[kernStyle] : pickRandom(kernStyles);

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
