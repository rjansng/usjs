// https://sdany.somee.com/usjs/shopee/filter/png_trans.js
// http://lo.on/trans.png
let version = 'v20240216';
let memo = '透明滿版圖檔';

let file = 'iVBORw0KGgoAAAANSUhEUgAAAhwAAAFACAMAAADAhFVfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAAAAAKVnuc8AAAACdFJOU/8A5bcwSgAAAAlwSFlzAAAScwAAEnMBjCK5BwAAAsBJREFUeF7t0oEAAAAMBKG9v/QIzqAYukGQgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CDJQZKDJAdJDpIcJDlIcpDkIMlBkoMkB0kOkhwkOUhykOQgyUGSgyQHSQ6SHCQ5SHKQ5CBsD0SPox/eVPyDAAAAAElFTkSuQmCC';

var Base64Binary = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function (input) {
        var bytes = (input.length / 4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    removePaddingChars: function (input) {
        var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
        if (lkey == 64) {
            return input.substring(0, input.length - 1);
        }
        return input;
    },

    decode: function (input, arrayBuffer) {
        //get last chars to see if are valid
        input = this.removePaddingChars(input);
        input = this.removePaddingChars(input);

        var bytes = parseInt((input.length / 4) * 3, 10);

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i = 0; i < bytes; i += 3) {
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i + 1] = chr2;
            if (enc4 != 64) uarray[i + 2] = chr3;
        }

        return uarray;
    }
}

let headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'image/png',
    'Date': new Date().toUTCString(),
};

$done({ response: { status: 200, headers: headers, body: Base64Binary.decode(file) } });
