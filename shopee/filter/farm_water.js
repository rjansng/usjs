/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

/* 神密澆水功能，不能公開，你若發現了，表示你很用心，很利害喔。將下列兩行獨立腳本執行 即可實現自動澆水功能。
$persistentStore.write('f=1=9w3r/u//f+//Rawym8a5Fwj4gZWT', '蝦蝦果園KEY');
$persistentStore.write('自動', '蝦蝦果園通知澆水');
*/

let 蝦蝦果園KEY = $persistentStore.read('蝦蝦果園KEY') || '';
let 蝦蝦果園澆水KEY = $persistentStore.read('蝦蝦果園澆水KEY') || '';
let 蝦皮果園澆水KEY = $persistentStore.read('蝦皮果園澆水KEY') || '';
if (蝦蝦果園KEY == '') {
	if (蝦皮果園澆水KEY != '') { // 調整參數
		蝦蝦果園KEY = 蝦皮果園澆水KEY;
		$persistentStore.write(蝦蝦果園KEY, '蝦蝦果園KEY');
	}
	else if (蝦蝦果園澆水KEY != '') { // 調整參數
		蝦蝦果園KEY = 蝦蝦果園澆水KEY;
		$persistentStore.write(蝦蝦果園KEY, '蝦蝦果園KEY');
	}
}
$persistentStore.write(null, '蝦皮果園澆水KEY');
$persistentStore.write(null, '蝦蝦果園澆水KEY');

const EncryptCBC = (keyword) => {
	let secretKey = 蝦蝦果園KEY;
	try {
		let key = CryptoJS.enc.Utf8.parse(secretKey);
		let iv = CryptoJS.enc.Utf8.parse(secretKey.slice(0, 16));
		var encryptedData = CryptoJS.AES.encrypt(keyword, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
		return encryptedData.toString()
	} catch (error) {
		console.log(error)
		return ''
	}
}
// EncryptCBC("".concat(Date.now(), "-").concat(config.SPC_U));
// let plaintText = '1704775393633-732423754'
// console.log(plaintText);
// console.log(EncryptCBC(plaintText));


// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '狀態 澆水通知 更新作物 自動收成 站外澆水';
const title = '蝦蝦果園 ' + caption;
const version = 'v20240523';
let showNotification = true;
let showLog = true;
let config = null;
let dataList = [];
const NotShowNotification = $persistentStore.read('NotShowNotification'); if (NotShowNotification) { showNotification = false; }
const NotShowLog = $persistentStore.read('ShowLog'); if (NotShowLog) { showLog = false; }
function getRnd(len = 16) { return (Math.random() * 10 ** 20).toFixed(0).substring(0, len); }
function getToken() { return (new Date()).getTime().toString(); }
function loonNotifyArray(m) { if (Array.isArray(m)) { loonNotify(m[0], m[1]); } else { loonNotify(m); } };
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };
let nt_title = '';
function shopeeNotify(subtitle = '', message = '', url = '') {
	let nttitle = nt_title;
	if (nttitle == '') nttitle = '澆水';
	let title = `🍤 蝦蝦果園 ${nttitle}通知`;
	if (($persistentStore.read('TelegramUrl') || '') != '') {
		telegramNotify(title, subtitle, message);
	}
	else {
		$notification.post(title, subtitle, message, { 'openUrl': url });
		// console.log(title + '\t' + subtitle + '\t' + message);
	}
};

function telegramNotify(title, subtitle = '', message = '') {
	let TelegramUrl = $persistentStore.read('TelegramUrl') || '';
	if (TelegramUrl != '') {
		let telegramData = { url: TelegramUrl + encodeURIComponent(title + (subtitle != '' ? '\n' : '') + subtitle + (message != '' ? '\n' : '') + message) };
		$httpClient.get(telegramData, function (error, response, data) { });
	}
}

function handleError(error) {
	let sl = showLog; showLog = false; let msg = '❌';
	if (Array.isArray(error)) {
		for (let i = 0; i < error.length; i++) {
			const e = error[i]; msg += (i > 1 ? '\n' : ' ') + `${e}`;
		}
	}
	else { msg += ` ${error}`; }
	console.log(msg); loonNotifyArray(error); showLog = sl;
}
function getSaveObject(key) { const string = $persistentStore.read(key); return !string || string.length === 0 ? {} : JSON.parse(string); }
function isEmptyObject(obj) { return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false; }
function cookieToString(cookieObject) { let string = ''; for (const [key, value] of Object.entries(cookieObject)) { string += `${key}=${value};` } return string; }
async function delay(seconds) { console.log(`\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
function GetDataConfig(item = -1, method = 'POST', url = '', title = '', content = '') {
	if (item === -1) {
		return {
			'item': item, 'method': method, 'url': url, 'title': title, 'content': content, 'memo': ''
			, 'dataRequest': { url: '', headers: config.shopeeHeaders, body: null }, 'func': ud[6],
		};
	}
	let ud = UrlData[item];
	let dc = {
		'item': item, 'method': ud[0], 'title': ud[1], 'content': ud[2], 'url': ud[3], 'memo': '',
		'dataRequest': { url: '', headers: null, body: null }, 'func': ud[6],
	};
	let params = null;
	params = ud[5];
	if (dc.method === 'POST') { dc.dataRequest.body = DataPostBodyList[dc.item]; }
	dc.dataRequest.headers = config.shopeeHeaders;
	if (params && params.length > 0) {
		for (let i = 0; i < params.length; i++) {
			const p = params[i];
			dc.url = dc.url.replace(`\{${p}\}`, config[p]);
		}
	}
	dc.dataRequest.url = dc.url;
	return dc;
}
Date.prototype.format = function (format = '1') {
	if (format === '0') { format = 'yyyy/MM/dd HH:mm:ss.S'; }
	else if (format === '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
	else if (format === '2') { format = 'yyyy/MM/dd'; }
	else if (format === '3') { format = 'HH:mm:ss'; }
	else if (format === '4') { format = 'MM/dd'; }
	else if (format === '5') { format = 'HH:mm'; }
	let o = {
		"M+": this.getMonth() + 1, //month 月
		"d+": this.getDate(),    //day 日
		"h+": this.getHours(),   //hour 時
		"H+": this.getHours(),   //hour 時
		"m+": this.getMinutes(), //minute 分 
		"s+": this.getSeconds(), //second 秒
		"q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
		"S": this.getMilliseconds().toString().padEnd(3, '0') //millisecond  
	}
	let re = new RegExp(/(y+)/);
	if (re.test(format)) { format = format.replace(re, (this.getFullYear() + "").substr(4 - format.match(re)[1].length)); }
	for (let k in o) {
		let r = RegExp("(" + k + ")");
		if (r.test(format)) {
			let fr = format.match(r)[1];
			format = format.replace(fr, fr.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

async function dataGet(dc, item = -1) {
	return new Promise((resolve, reject) => {
		try {
			let msg = `\t🌐 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
			$httpClient.get(dc.dataRequest, function (error, response, data) {
				if (error) {
					return reject([`執行失敗 ‼️`, '連線錯誤']);
				} else {
					if (response.status === 200) {
						return resolve(data);
					} else {
						return reject([`執行失敗 ‼️`, response.status, data]);
					}
				}
			});
		} catch (error) {
			return reject([`執行失敗 ‼️`, error]);
		}
	});
}
async function dataPost(dc, item = -1) {
	return new Promise((resolve, reject) => {
		try {
			let msg = `\t🌐 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
			$httpClient.post(dc.dataRequest, function (error, response, data) {
				if (error) {
					return reject([`${content}失敗 ‼️`, '連線錯誤']);
				} else {
					if (response.status === 200) {
						return resolve(data);
					} else {
						return reject([`執行失敗 ‼️`, response.status, data]);
					}
				}
			});

		} catch (error) {
			return reject([`執行失敗 ‼️`, error]);
		}
	});
}
async function preCheck() {
	return new Promise((resolve, reject) => {
		const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
		if (isEmptyObject(shopeeInfo)) {
			return reject(['檢查失敗 ‼️', '沒有 蝦皮 Token']);
		}
		const shopeeHeaders = {
			'Cookie': `${cookieToString(shopeeInfo.token)}`,
			'Content-Type': 'application/json',
		}

		config = {
			shopeeInfo: shopeeInfo,
			shopeeHeaders: shopeeHeaders,
		}
		console.log('✅ 檢查成功\n');
		return resolve();
	});
}

async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		// console.log(`⭕️ 執行成功 💯`);
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code == 0) {

			let crop = obj.data.crops[0];
			let cropName = crop.meta.name;
			config.cropName = cropName;
			let rewards = null;
			if ('rewards' in obj.data) { rewards = obj.data.rewards; }
			let msg = '';
			config.cropId = crop.id;
			console.log(`目前作物: ${crop.meta.name}`); // (${config.cropId})

			DataPostBodyList[4].cropId = config.cropId;
			DataPostBodyList[5].cropId = config.cropId;
			
			if (crop.lifeStatus == 1) {
				// console.log('作物已死亡');
				msg = '作物已死亡。';
			}
			else if (crop.state < 100) {
				if (rewards && rewards.length > 0) {
					console.log('作物更新狀態');
					rewards.forEach(x => {
						config.rewards.push({ ids: x.id, flag: true });
					});
					msg += ' 作物種植中';
				}
				config.canWater = true;
				config.resourceId = obj.data.resources[0].id;
				DataPostBodyList[4].resourceId = config.resourceId;
				// console.log(DataPostBodyList[4]);

				let NeedWater = '種植中';
				found = true;
				let mc = crop.meta.config;
				let totalExp = mc.totalExp;
				let needExp = totalExp;
				for (let i = 1; i <= 3; i++) {
					let mclc = mc.levelConfig[i];
					if (crop.state > i) { needExp -= mclc.exp; }
					else if (crop.state == i) {
						needExp -= crop.exp;
					}
				}
				config.needExp = needExp;
				// console.log(`還需要水量: ${needExp}`);
				NeedWater += `，需要水量 ${needExp}`;
				msg = NeedWater;
				// console.log(obj.data.prop);
				if (obj.data.resources && obj.data.resources.length > 0) {
					obj.data.resources.forEach(r => {
						if (r.hasOwnProperty('meta') && r.meta.hasOwnProperty('name') && r.meta.name == 'water') {
							//console.log(r);

							let nf_water = null;
							try {
								nf_water = JSON.parse($persistentStore.read('ShopeeWaterNotify') || '{"datatime":0,"count":0}');
								// console.log(JSON.parse('{"datatime":0,"count":0}'));
							} catch (error) {
								console.log(`error: ${error}`);
							}
							if (nf_water == null) { nf_water = { "datatime": 0, "count": 0 }; console.log('T1'); }
							if (nf_water === null) { nf_water = { "datatime": 0, "count": 0 }; console.log('T2'); }

							try {
								NeedWater += `，\n可澆水量 ${r.number}/${r.meta.config.maxNumber}`;
								NeedWater += `，\n滿水時間 ${new Date(new Date().getTime() + (r.resumeLeftSeconds * 1000)).format('3')}`;
							} catch (error) {
								console.log(`error: ${error}`);
							}
							// console.log(`可澆水量: ${r.number}`);
							let prop = null;
							let propItemId = 0;
							if ('prop' in obj.data) {
								prop = obj.data.prop;
								propItemId = prop.itemId;
								console.log(`${prop.itemId}\t${prop.itemName} ${prop.parameter}`);

								NeedWater += `\t\n${prop.itemId}\t${prop.itemName} ${prop.parameter}`;
								//console.log(prop);
							}
							// 3 特大號水壺
							if (propItemId == 4 || propItemId == 5) {  // 5 澆水好朋友 24
								NeedWater += `，\n自動澆水 (${new Date(prop.beginUseTime + (prop.parameter * 60 * 60 * 1000)).format('3')})`;
								$persistentStore.write(null, 'ShopeeWaterNotify');
							}
							else {
								// if (r.meta.name == 'water') {
								try {

									let 每次加水滴所需秒 = r.meta.config.resumeSecond / r.meta.config.maxNumber;  // 滿水所需秒/滿水水滴
									let 目前水滴經過秒 = 每次加水滴所需秒 * r.number;  // 每次加水滴所需秒 * 目前水滴
									let 滿水前總經過秒 = r.meta.config.resumeSecond - r.resumeLeftSeconds; // 滿水所需秒 - 下次滿水所需秒
									let 下次加水滴秒 = 每次加水滴所需秒 - (滿水前總經過秒 - 目前水滴經過秒);
									if (下次加水滴秒 < 60) { config.WaterWaitSecond = 下次加水滴秒 + 1; } // 如果剛好遇到 小餘 60 秒加水，就等待後，再澆水
									if (r.meta.config.maxNumber - 15 <= r.number || r.resumeLeftSeconds <= 1200 || needExp <= r.number) {
										// 水量達 x - 15  自動澆水
										// 滿水總時間少於 20 分鐘 自動澆水
										// 目前水量大於等於需要水量
										config.doWater = true;
									}
									// }
								} catch (error) {
									console.log(`error: ${error}`);
								}
								if (r.meta.config.maxNumber - 10 <= r.number || r.resumeLeftSeconds <= 900) {
									nf_water.count++;
									nf_water.datatime = Date.now();
									$persistentStore.write(JSON.stringify(nf_water), 'ShopeeWaterNotify');
									if (config.ntWater && nf_water.count <= 1) {
										let mmm = '';
										if (nf_water.count > 1) { mmm = `第${nf_water.count}次通知。`; }
										shopeeNotify(`${obj.data.user.name} ${cropName}`, `${NeedWater.replace(/\n/g,'')}。${mmm}`);
									}
									// console.log('準備澆水了。');
								}
								else {
									$persistentStore.write(null, 'ShopeeWaterNotify');
								}
							}
							//console.log(r);
						}
						else {
							console.log('Not Meta Name');
							console.log(r);
						}

					});
					msg = NeedWater;

				}


			}
			else if (crop.state == 100) {
				// console.log('作物可以收成了');
				msg = '作物可以收成了。';
				//DataPostBodyList[5].cropId = config.cropId;
				found = true;
				config.canHarvest = true;
			}
			else if (crop.state >= 101) {
				// console.log('作物已收成');
				msg = '作物已收成。';
			}
			console.log(`\n${msg.replace(/\n/g,'')}`);

			try {
				let dataName = 'ShopeeGamePlayed';
				let tsn = 'farm' + 's';
				let tsid = 'FW';
				let tsid2 = 'FC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {}, s2 = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (ts.hasOwnProperty(tsid2)) { s2 = ts[tsid2]; } else { s2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }

				if (crop.state < 100 || crop.state >= 100 && s.r.includes('種植中')) {
					s2.r = cropName;
					s2.f = true;
					s2.c = 1;
					s.r = `${msg.replace(/\n/g,'\n ')} (${new Date().format('5')})`;
					s.f = true;
					s.c = 1;
				}
				ts[tsid2] = s2;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


		} else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code == 0) {
			found = true;

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'farm' + 's';
				let tsid = 'E';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = obj.data.userWater.totalHelpFriendCount - obj.data.userWater.remainingHelpFriendCount;
				s.s = obj.data.userWater.remainingHelpFriendCount;
				if (s.c > 0 || s.s > 0) { s.f = s.s == 0; }
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'farm' + 's';
				let tsid = 'F';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = obj.data.userWater.totalHelpedCount - obj.data.userWater.remainingHelpedCount;
				s.s = obj.data.userWater.remainingHelpedCount;
				if (s.c > 0 || s.s > 0) { s.f = s.s == 0; }
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData3(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let GetC = 0;
		let obj = JSON.parse(data);
		if (obj.code == 0) {
			let ms = obj.data.messages;
			for (let i = 0; i < ms.length; i++) {
				let m = ms[i];
				let dtn = new Date(new Date().format("2")).getTime();

				if (m.type === 2 && m.CreateTime >= dtn) {
					found = true;
					try {
						let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
						let tsn = 'farms';
						let tsid = 'D';
						let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
						let tasks = JSON.parse(rs);
						let ts = {}, s = {};
						if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
						if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
						if (!s.f && s.s === 0 && s.c === 0) { s.s = 5; }
						if (m.data.Count > 0 && m.data.Exp === 10) {
							if (m.data.Count > s.c) { s.c = m.data.Count; s.s = 5 - s.c; }
						}
						GetC = s.c;
						s.f = s.c >= 5;
						ts[tsid] = s;
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					} catch (e) { console.log(e); }
					//}
				}
			}
			if (!found) {
				console.log(`今日未收到站外澆水`)
				found = true;
			}
			else {
				console.log(`收到站外澆水 ${GetC} 次`)

			}
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code == 0) {
			found = true;
			let cropName = config.cropName;
			let luckyDrawAwardName = cropName;
			if ('reward' in obj.data && 'rewardItems' in obj.data.reward
				&& obj.data.reward.rewardItems.length > 0
				&& 'itemExtraData' in obj.data.reward.rewardItems[0]
				&& 'luckyDrawAwardName' in obj.data.reward.rewardItems[0].itemExtraData) {
				luckyDrawAwardName = obj.data.reward.rewardItems[0].itemExtraData.luckyDrawAwardName;
			}

			try {
				let dataName = 'ShopeeGamePlayed';
				let tsn = 'farm' + 's';
				let tsid = 'A2';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				s.f = true;
				s.d.push(`🌱${config.cropName}\t🌳${luckyDrawAwardName} : ${(new Date()).format('5')}`);
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


			try {
				let dataName = 'ShopeeGamePlayed';
				let tsn = 'farm' + 's';
				let tsid = 'FW';
				let tsid2 = 'FC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {}, s2 = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (ts.hasOwnProperty(tsid2)) { s2 = ts[tsid2]; } else { s2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }

				s2.r = cropName;
				s2.f = true;
				s2.c = 1;
				s.r = `作物已收成。 (${new Date().format('5')})`;
				s.f = true;
				s.c = 1;

				ts[tsid2] = s2;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			nt_title = '收成';
			shopeeNotify(`獲得 ${cropName} 🌳\n${luckyDrawAwardName}`);
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData5(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code == 0) {
			found = true;

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'farm' + 's';
				let tsid = 'FU';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				s.f = true;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData6(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code == 0) {
			found = true;
			// console.log(obj);
			// try {
			// 	let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			// 	let tsn = 'farm' + 's';
			// 	let tsid = 'FU';
			// 	let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			// 	let tasks = JSON.parse(rs);
			// 	let ts = {}, s = {};
			// 	if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			// 	if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			// 	s.c++;
			// 	s.f = true;
			// 	ts[tsid] = s;
			// 	tasks[tsn] = ts;
			// 	$persistentStore.write(JSON.stringify(tasks), dataName);
			// } catch (e) { console.log(e); }


			if (obj.msg === 'success') {
				let useNumber = obj.data.useNumber;
				let state = obj.data.crop.state;
				let exp = obj.data.crop.exp;
				let levelExp = obj.data.crop.meta.config.levelConfig[state.toString()].exp;
				let remain = levelExp - exp;
				if (remain === 0) {
					config.canHarvest = true;
					console.log('作物可以收成啦');
				}
				else {
					console.log('本次澆了：' + useNumber + ' 滴水 💧');
				}
			}
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得作物資訊', '1', 'https://games.shopee.tw/farm/api/orchard/context/get?skipGuidance=0', '', , ProcData1],
['GET', '取得好友澆水資訊', '2', 'https://games.shopee.tw/farm/api/friend/v2/list?source=&offset=&need_recommend=true&device_id={device_id}&is_ban_contact=false', '', ['device_id'], ProcData2],
['GET', '取得果園訊息(站外澆水)', '3', 'https://games.shopee.tw/farm/api/message/get?page=1&pageSize=50', '', , ProcData3],
['POST', '作物澆水', '4', 'https://games.shopee.tw/farm/api/orchard/crop/water', '', , ProcData6],
['POST', '作物收成', '5', 'https://games.shopee.tw/farm/api/orchard/crop/harvest', '', , ProcData4],
['POST', '更新作物狀態', '6', 'https://games.shopee.tw/farm/api/reward/claim', '', , ProcData5],
];
// https://games.shopee.tw/farm/api/orchard/resource/get
let DataPostBodyList = [, , , ,
	{
		"iframe_s": "",
		"resourceId": 0,
		"cropId": 0
	},
	{ "deviceId": '', "cropId": 0 },
	{ "ids": [], "rewardType": 1 }, ,];
function preInit() {
	config.SPC_U = config.shopeeInfo.token.SPC_U;
	config.device_id = config.shopeeInfo.token.SPC_F;
	config.rewards = [];
	config.canHarvest = false;
	DataPostBodyList[5].deviceId = config.device_id;
	config.canWater = false;
	config.doWater = false;
	config.WaterWaitSecond = 0.0;
	let autoWater = $persistentStore.read('蝦蝦果園通知澆水') || '';
	$persistentStore.write(null, '蝦皮果園自動澆水');
	$persistentStore.write(null, '自動澆水');
	config.ntWater =  autoWater == '是';
	config.autoWater = autoWater == '自動';
}




const forMaxCount = 10;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	try {
		await preCheck();
		preInit();
		let flag = true;
		let runCount = 0;
		let item = -1;

		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			runCount++;
			item = -1;
			// console.log(i);
			if (i == 4) {
				// console.log(config);

				if (config.canWater && config.doWater && config.autoWater) {
					//console.log(蝦蝦果園KEY);
					if (蝦蝦果園KEY != '') {
						if (config.WaterWaitSecond > 0) { await delay(config.WaterWaitSecond * 1.0); }
						DataPostBodyList[i].iframe_s = EncryptCBC("".concat(Date.now(), "-").concat(config.SPC_U));
						// console.log(DataPostBodyList[i]);
						//console.log
						// i++;
					}
					else {
						console.log('沒有「蝦蝦果園KEY」，無法澆水。');
						i++;
					}

				} else { i++; }
			}
			if (i == 5) {
				if (config.canHarvest) {

				} else { i++; }
			}
			if (i == 6) {
				if (config.rewards.some(r => {
					if (r.flag) {
						DataPostBodyList[i].ids = [];
						DataPostBodyList[i].ids.push(r.ids);
						r.flag = false;
						return true;
					}
				})) {
				}
				else { flag = false; }
			}
			// console.log(i);

			let dc = !flag ? null : GetDataConfig(i);
			// console.log(`🌐 ${dc.method} URL : ${dc.url}`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			//if (flag && i >= 4) { i = 2; }
			if (runCount >= forMaxCount) { break; }
			if (runCount > 10) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
		}
		console.log('');
		let msg = '✅ 處理已完成';
		console.log(msg);
		// loonNotify(msg);
	} catch (error) {
		handleError(error);
	}
	$done({});
})();
