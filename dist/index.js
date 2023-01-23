(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/peerjs-js-binarypack/lib/bufferbuilder.js
  var require_bufferbuilder = __commonJS({
    "node_modules/peerjs-js-binarypack/lib/bufferbuilder.js"(exports, module) {
      var binaryFeatures = {};
      binaryFeatures.useBlobBuilder = function() {
        try {
          new Blob([]);
          return false;
        } catch (e) {
          return true;
        }
      }();
      binaryFeatures.useArrayBufferView = !binaryFeatures.useBlobBuilder && function() {
        try {
          return new Blob([new Uint8Array([])]).size === 0;
        } catch (e) {
          return true;
        }
      }();
      module.exports.binaryFeatures = binaryFeatures;
      var BlobBuilder = module.exports.BlobBuilder;
      if (typeof window !== "undefined") {
        BlobBuilder = module.exports.BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder || window.BlobBuilder;
      }
      function BufferBuilder() {
        this._pieces = [];
        this._parts = [];
      }
      BufferBuilder.prototype.append = function(data) {
        if (typeof data === "number") {
          this._pieces.push(data);
        } else {
          this.flush();
          this._parts.push(data);
        }
      };
      BufferBuilder.prototype.flush = function() {
        if (this._pieces.length > 0) {
          var buf = new Uint8Array(this._pieces);
          if (!binaryFeatures.useArrayBufferView) {
            buf = buf.buffer;
          }
          this._parts.push(buf);
          this._pieces = [];
        }
      };
      BufferBuilder.prototype.getBuffer = function() {
        this.flush();
        if (binaryFeatures.useBlobBuilder) {
          var builder = new BlobBuilder();
          for (var i = 0, ii = this._parts.length; i < ii; i++) {
            builder.append(this._parts[i]);
          }
          return builder.getBlob();
        } else {
          return new Blob(this._parts);
        }
      };
      module.exports.BufferBuilder = BufferBuilder;
    }
  });

  // node_modules/peerjs-js-binarypack/lib/binarypack.js
  var require_binarypack = __commonJS({
    "node_modules/peerjs-js-binarypack/lib/binarypack.js"(exports, module) {
      var BufferBuilder = require_bufferbuilder().BufferBuilder;
      var binaryFeatures = require_bufferbuilder().binaryFeatures;
      var BinaryPack = {
        unpack: function(data) {
          var unpacker = new Unpacker(data);
          return unpacker.unpack();
        },
        pack: function(data) {
          var packer = new Packer();
          packer.pack(data);
          var buffer = packer.getBuffer();
          return buffer;
        }
      };
      module.exports = BinaryPack;
      function Unpacker(data) {
        this.index = 0;
        this.dataBuffer = data;
        this.dataView = new Uint8Array(this.dataBuffer);
        this.length = this.dataBuffer.byteLength;
      }
      Unpacker.prototype.unpack = function() {
        var type3 = this.unpack_uint8();
        if (type3 < 128) {
          return type3;
        } else if ((type3 ^ 224) < 32) {
          return (type3 ^ 224) - 32;
        }
        var size;
        if ((size = type3 ^ 160) <= 15) {
          return this.unpack_raw(size);
        } else if ((size = type3 ^ 176) <= 15) {
          return this.unpack_string(size);
        } else if ((size = type3 ^ 144) <= 15) {
          return this.unpack_array(size);
        } else if ((size = type3 ^ 128) <= 15) {
          return this.unpack_map(size);
        }
        switch (type3) {
          case 192:
            return null;
          case 193:
            return void 0;
          case 194:
            return false;
          case 195:
            return true;
          case 202:
            return this.unpack_float();
          case 203:
            return this.unpack_double();
          case 204:
            return this.unpack_uint8();
          case 205:
            return this.unpack_uint16();
          case 206:
            return this.unpack_uint32();
          case 207:
            return this.unpack_uint64();
          case 208:
            return this.unpack_int8();
          case 209:
            return this.unpack_int16();
          case 210:
            return this.unpack_int32();
          case 211:
            return this.unpack_int64();
          case 212:
            return void 0;
          case 213:
            return void 0;
          case 214:
            return void 0;
          case 215:
            return void 0;
          case 216:
            size = this.unpack_uint16();
            return this.unpack_string(size);
          case 217:
            size = this.unpack_uint32();
            return this.unpack_string(size);
          case 218:
            size = this.unpack_uint16();
            return this.unpack_raw(size);
          case 219:
            size = this.unpack_uint32();
            return this.unpack_raw(size);
          case 220:
            size = this.unpack_uint16();
            return this.unpack_array(size);
          case 221:
            size = this.unpack_uint32();
            return this.unpack_array(size);
          case 222:
            size = this.unpack_uint16();
            return this.unpack_map(size);
          case 223:
            size = this.unpack_uint32();
            return this.unpack_map(size);
        }
      };
      Unpacker.prototype.unpack_uint8 = function() {
        var byte = this.dataView[this.index] & 255;
        this.index++;
        return byte;
      };
      Unpacker.prototype.unpack_uint16 = function() {
        var bytes = this.read(2);
        var uint16 = (bytes[0] & 255) * 256 + (bytes[1] & 255);
        this.index += 2;
        return uint16;
      };
      Unpacker.prototype.unpack_uint32 = function() {
        var bytes = this.read(4);
        var uint32 = ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3];
        this.index += 4;
        return uint32;
      };
      Unpacker.prototype.unpack_uint64 = function() {
        var bytes = this.read(8);
        var uint64 = ((((((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]) * 256 + bytes[4]) * 256 + bytes[5]) * 256 + bytes[6]) * 256 + bytes[7];
        this.index += 8;
        return uint64;
      };
      Unpacker.prototype.unpack_int8 = function() {
        var uint8 = this.unpack_uint8();
        return uint8 < 128 ? uint8 : uint8 - (1 << 8);
      };
      Unpacker.prototype.unpack_int16 = function() {
        var uint16 = this.unpack_uint16();
        return uint16 < 32768 ? uint16 : uint16 - (1 << 16);
      };
      Unpacker.prototype.unpack_int32 = function() {
        var uint32 = this.unpack_uint32();
        return uint32 < Math.pow(2, 31) ? uint32 : uint32 - Math.pow(2, 32);
      };
      Unpacker.prototype.unpack_int64 = function() {
        var uint64 = this.unpack_uint64();
        return uint64 < Math.pow(2, 63) ? uint64 : uint64 - Math.pow(2, 64);
      };
      Unpacker.prototype.unpack_raw = function(size) {
        if (this.length < this.index + size) {
          throw new Error("BinaryPackFailure: index is out of range " + this.index + " " + size + " " + this.length);
        }
        var buf = this.dataBuffer.slice(this.index, this.index + size);
        this.index += size;
        return buf;
      };
      Unpacker.prototype.unpack_string = function(size) {
        var bytes = this.read(size);
        var i = 0;
        var str = "";
        var c;
        var code;
        while (i < size) {
          c = bytes[i];
          if (c < 128) {
            str += String.fromCharCode(c);
            i++;
          } else if ((c ^ 192) < 32) {
            code = (c ^ 192) << 6 | bytes[i + 1] & 63;
            str += String.fromCharCode(code);
            i += 2;
          } else {
            code = (c & 15) << 12 | (bytes[i + 1] & 63) << 6 | bytes[i + 2] & 63;
            str += String.fromCharCode(code);
            i += 3;
          }
        }
        this.index += size;
        return str;
      };
      Unpacker.prototype.unpack_array = function(size) {
        var objects = new Array(size);
        for (var i = 0; i < size; i++) {
          objects[i] = this.unpack();
        }
        return objects;
      };
      Unpacker.prototype.unpack_map = function(size) {
        var map3 = {};
        for (var i = 0; i < size; i++) {
          var key = this.unpack();
          var value = this.unpack();
          map3[key] = value;
        }
        return map3;
      };
      Unpacker.prototype.unpack_float = function() {
        var uint32 = this.unpack_uint32();
        var sign = uint32 >> 31;
        var exp = (uint32 >> 23 & 255) - 127;
        var fraction = uint32 & 8388607 | 8388608;
        return (sign === 0 ? 1 : -1) * fraction * Math.pow(2, exp - 23);
      };
      Unpacker.prototype.unpack_double = function() {
        var h32 = this.unpack_uint32();
        var l32 = this.unpack_uint32();
        var sign = h32 >> 31;
        var exp = (h32 >> 20 & 2047) - 1023;
        var hfrac = h32 & 1048575 | 1048576;
        var frac = hfrac * Math.pow(2, exp - 20) + l32 * Math.pow(2, exp - 52);
        return (sign === 0 ? 1 : -1) * frac;
      };
      Unpacker.prototype.read = function(length) {
        var j = this.index;
        if (j + length <= this.length) {
          return this.dataView.subarray(j, j + length);
        } else {
          throw new Error("BinaryPackFailure: read index out of range");
        }
      };
      function Packer() {
        this.bufferBuilder = new BufferBuilder();
      }
      Packer.prototype.getBuffer = function() {
        return this.bufferBuilder.getBuffer();
      };
      Packer.prototype.pack = function(value) {
        var type3 = typeof value;
        if (type3 === "string") {
          this.pack_string(value);
        } else if (type3 === "number") {
          if (Math.floor(value) === value) {
            this.pack_integer(value);
          } else {
            this.pack_double(value);
          }
        } else if (type3 === "boolean") {
          if (value === true) {
            this.bufferBuilder.append(195);
          } else if (value === false) {
            this.bufferBuilder.append(194);
          }
        } else if (type3 === "undefined") {
          this.bufferBuilder.append(192);
        } else if (type3 === "object") {
          if (value === null) {
            this.bufferBuilder.append(192);
          } else {
            var constructor = value.constructor;
            if (constructor == Array) {
              this.pack_array(value);
            } else if (constructor == Blob || constructor == File || value instanceof Blob || value instanceof File) {
              this.pack_bin(value);
            } else if (constructor == ArrayBuffer) {
              if (binaryFeatures.useArrayBufferView) {
                this.pack_bin(new Uint8Array(value));
              } else {
                this.pack_bin(value);
              }
            } else if ("BYTES_PER_ELEMENT" in value) {
              if (binaryFeatures.useArrayBufferView) {
                this.pack_bin(new Uint8Array(value.buffer));
              } else {
                this.pack_bin(value.buffer);
              }
            } else if (constructor == Object || constructor.toString().startsWith("class")) {
              this.pack_object(value);
            } else if (constructor == Date) {
              this.pack_string(value.toString());
            } else if (typeof value.toBinaryPack === "function") {
              this.bufferBuilder.append(value.toBinaryPack());
            } else {
              throw new Error('Type "' + constructor.toString() + '" not yet supported');
            }
          }
        } else {
          throw new Error('Type "' + type3 + '" not yet supported');
        }
        this.bufferBuilder.flush();
      };
      Packer.prototype.pack_bin = function(blob) {
        var length = blob.length || blob.byteLength || blob.size;
        if (length <= 15) {
          this.pack_uint8(160 + length);
        } else if (length <= 65535) {
          this.bufferBuilder.append(218);
          this.pack_uint16(length);
        } else if (length <= 4294967295) {
          this.bufferBuilder.append(219);
          this.pack_uint32(length);
        } else {
          throw new Error("Invalid length");
        }
        this.bufferBuilder.append(blob);
      };
      Packer.prototype.pack_string = function(str) {
        var length = utf8Length(str);
        if (length <= 15) {
          this.pack_uint8(176 + length);
        } else if (length <= 65535) {
          this.bufferBuilder.append(216);
          this.pack_uint16(length);
        } else if (length <= 4294967295) {
          this.bufferBuilder.append(217);
          this.pack_uint32(length);
        } else {
          throw new Error("Invalid length");
        }
        this.bufferBuilder.append(str);
      };
      Packer.prototype.pack_array = function(ary) {
        var length = ary.length;
        if (length <= 15) {
          this.pack_uint8(144 + length);
        } else if (length <= 65535) {
          this.bufferBuilder.append(220);
          this.pack_uint16(length);
        } else if (length <= 4294967295) {
          this.bufferBuilder.append(221);
          this.pack_uint32(length);
        } else {
          throw new Error("Invalid length");
        }
        for (var i = 0; i < length; i++) {
          this.pack(ary[i]);
        }
      };
      Packer.prototype.pack_integer = function(num) {
        if (num >= -32 && num <= 127) {
          this.bufferBuilder.append(num & 255);
        } else if (num >= 0 && num <= 255) {
          this.bufferBuilder.append(204);
          this.pack_uint8(num);
        } else if (num >= -128 && num <= 127) {
          this.bufferBuilder.append(208);
          this.pack_int8(num);
        } else if (num >= 0 && num <= 65535) {
          this.bufferBuilder.append(205);
          this.pack_uint16(num);
        } else if (num >= -32768 && num <= 32767) {
          this.bufferBuilder.append(209);
          this.pack_int16(num);
        } else if (num >= 0 && num <= 4294967295) {
          this.bufferBuilder.append(206);
          this.pack_uint32(num);
        } else if (num >= -2147483648 && num <= 2147483647) {
          this.bufferBuilder.append(210);
          this.pack_int32(num);
        } else if (num >= -9223372036854776e3 && num <= 9223372036854776e3) {
          this.bufferBuilder.append(211);
          this.pack_int64(num);
        } else if (num >= 0 && num <= 18446744073709552e3) {
          this.bufferBuilder.append(207);
          this.pack_uint64(num);
        } else {
          throw new Error("Invalid integer");
        }
      };
      Packer.prototype.pack_double = function(num) {
        var sign = 0;
        if (num < 0) {
          sign = 1;
          num = -num;
        }
        var exp = Math.floor(Math.log(num) / Math.LN2);
        var frac0 = num / Math.pow(2, exp) - 1;
        var frac1 = Math.floor(frac0 * Math.pow(2, 52));
        var b32 = Math.pow(2, 32);
        var h32 = sign << 31 | exp + 1023 << 20 | frac1 / b32 & 1048575;
        var l32 = frac1 % b32;
        this.bufferBuilder.append(203);
        this.pack_int32(h32);
        this.pack_int32(l32);
      };
      Packer.prototype.pack_object = function(obj) {
        var keys4 = Object.keys(obj);
        var length = keys4.length;
        if (length <= 15) {
          this.pack_uint8(128 + length);
        } else if (length <= 65535) {
          this.bufferBuilder.append(222);
          this.pack_uint16(length);
        } else if (length <= 4294967295) {
          this.bufferBuilder.append(223);
          this.pack_uint32(length);
        } else {
          throw new Error("Invalid length");
        }
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            this.pack(prop);
            this.pack(obj[prop]);
          }
        }
      };
      Packer.prototype.pack_uint8 = function(num) {
        this.bufferBuilder.append(num);
      };
      Packer.prototype.pack_uint16 = function(num) {
        this.bufferBuilder.append(num >> 8);
        this.bufferBuilder.append(num & 255);
      };
      Packer.prototype.pack_uint32 = function(num) {
        var n = num & 4294967295;
        this.bufferBuilder.append((n & 4278190080) >>> 24);
        this.bufferBuilder.append((n & 16711680) >>> 16);
        this.bufferBuilder.append((n & 65280) >>> 8);
        this.bufferBuilder.append(n & 255);
      };
      Packer.prototype.pack_uint64 = function(num) {
        var high = num / Math.pow(2, 32);
        var low = num % Math.pow(2, 32);
        this.bufferBuilder.append((high & 4278190080) >>> 24);
        this.bufferBuilder.append((high & 16711680) >>> 16);
        this.bufferBuilder.append((high & 65280) >>> 8);
        this.bufferBuilder.append(high & 255);
        this.bufferBuilder.append((low & 4278190080) >>> 24);
        this.bufferBuilder.append((low & 16711680) >>> 16);
        this.bufferBuilder.append((low & 65280) >>> 8);
        this.bufferBuilder.append(low & 255);
      };
      Packer.prototype.pack_int8 = function(num) {
        this.bufferBuilder.append(num & 255);
      };
      Packer.prototype.pack_int16 = function(num) {
        this.bufferBuilder.append((num & 65280) >> 8);
        this.bufferBuilder.append(num & 255);
      };
      Packer.prototype.pack_int32 = function(num) {
        this.bufferBuilder.append(num >>> 24 & 255);
        this.bufferBuilder.append((num & 16711680) >>> 16);
        this.bufferBuilder.append((num & 65280) >>> 8);
        this.bufferBuilder.append(num & 255);
      };
      Packer.prototype.pack_int64 = function(num) {
        var high = Math.floor(num / Math.pow(2, 32));
        var low = num % Math.pow(2, 32);
        this.bufferBuilder.append((high & 4278190080) >>> 24);
        this.bufferBuilder.append((high & 16711680) >>> 16);
        this.bufferBuilder.append((high & 65280) >>> 8);
        this.bufferBuilder.append(high & 255);
        this.bufferBuilder.append((low & 4278190080) >>> 24);
        this.bufferBuilder.append((low & 16711680) >>> 16);
        this.bufferBuilder.append((low & 65280) >>> 8);
        this.bufferBuilder.append(low & 255);
      };
      function _utf8Replace(m) {
        var code = m.charCodeAt(0);
        if (code <= 2047)
          return "00";
        if (code <= 65535)
          return "000";
        if (code <= 2097151)
          return "0000";
        if (code <= 67108863)
          return "00000";
        return "000000";
      }
      function utf8Length(str) {
        if (str.length > 600) {
          return new Blob([str]).size;
        } else {
          return str.replace(/[^\u0000-\u007F]/g, _utf8Replace).length;
        }
      }
    }
  });

  // node_modules/sdp/sdp.js
  var require_sdp = __commonJS({
    "node_modules/sdp/sdp.js"(exports, module) {
      "use strict";
      var SDPUtils2 = {};
      SDPUtils2.generateIdentifier = function() {
        return Math.random().toString(36).substr(2, 10);
      };
      SDPUtils2.localCName = SDPUtils2.generateIdentifier();
      SDPUtils2.splitLines = function(blob) {
        return blob.trim().split("\n").map(function(line) {
          return line.trim();
        });
      };
      SDPUtils2.splitSections = function(blob) {
        var parts = blob.split("\nm=");
        return parts.map(function(part, index) {
          return (index > 0 ? "m=" + part : part).trim() + "\r\n";
        });
      };
      SDPUtils2.getDescription = function(blob) {
        var sections = SDPUtils2.splitSections(blob);
        return sections && sections[0];
      };
      SDPUtils2.getMediaSections = function(blob) {
        var sections = SDPUtils2.splitSections(blob);
        sections.shift();
        return sections;
      };
      SDPUtils2.matchPrefix = function(blob, prefix) {
        return SDPUtils2.splitLines(blob).filter(function(line) {
          return line.indexOf(prefix) === 0;
        });
      };
      SDPUtils2.parseCandidate = function(line) {
        var parts;
        if (line.indexOf("a=candidate:") === 0) {
          parts = line.substring(12).split(" ");
        } else {
          parts = line.substring(10).split(" ");
        }
        var candidate = {
          foundation: parts[0],
          component: parseInt(parts[1], 10),
          protocol: parts[2].toLowerCase(),
          priority: parseInt(parts[3], 10),
          ip: parts[4],
          address: parts[4],
          port: parseInt(parts[5], 10),
          type: parts[7]
        };
        for (var i = 8; i < parts.length; i += 2) {
          switch (parts[i]) {
            case "raddr":
              candidate.relatedAddress = parts[i + 1];
              break;
            case "rport":
              candidate.relatedPort = parseInt(parts[i + 1], 10);
              break;
            case "tcptype":
              candidate.tcpType = parts[i + 1];
              break;
            case "ufrag":
              candidate.ufrag = parts[i + 1];
              candidate.usernameFragment = parts[i + 1];
              break;
            default:
              candidate[parts[i]] = parts[i + 1];
              break;
          }
        }
        return candidate;
      };
      SDPUtils2.writeCandidate = function(candidate) {
        var sdp = [];
        sdp.push(candidate.foundation);
        sdp.push(candidate.component);
        sdp.push(candidate.protocol.toUpperCase());
        sdp.push(candidate.priority);
        sdp.push(candidate.address || candidate.ip);
        sdp.push(candidate.port);
        var type3 = candidate.type;
        sdp.push("typ");
        sdp.push(type3);
        if (type3 !== "host" && candidate.relatedAddress && candidate.relatedPort) {
          sdp.push("raddr");
          sdp.push(candidate.relatedAddress);
          sdp.push("rport");
          sdp.push(candidate.relatedPort);
        }
        if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
          sdp.push("tcptype");
          sdp.push(candidate.tcpType);
        }
        if (candidate.usernameFragment || candidate.ufrag) {
          sdp.push("ufrag");
          sdp.push(candidate.usernameFragment || candidate.ufrag);
        }
        return "candidate:" + sdp.join(" ");
      };
      SDPUtils2.parseIceOptions = function(line) {
        return line.substr(14).split(" ");
      };
      SDPUtils2.parseRtpMap = function(line) {
        var parts = line.substr(9).split(" ");
        var parsed = {
          payloadType: parseInt(parts.shift(), 10)
        };
        parts = parts[0].split("/");
        parsed.name = parts[0];
        parsed.clockRate = parseInt(parts[1], 10);
        parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
        parsed.numChannels = parsed.channels;
        return parsed;
      };
      SDPUtils2.writeRtpMap = function(codec) {
        var pt = codec.payloadType;
        if (codec.preferredPayloadType !== void 0) {
          pt = codec.preferredPayloadType;
        }
        var channels = codec.channels || codec.numChannels || 1;
        return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (channels !== 1 ? "/" + channels : "") + "\r\n";
      };
      SDPUtils2.parseExtmap = function(line) {
        var parts = line.substr(9).split(" ");
        return {
          id: parseInt(parts[0], 10),
          direction: parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv",
          uri: parts[1]
        };
      };
      SDPUtils2.writeExtmap = function(headerExtension) {
        return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== "sendrecv" ? "/" + headerExtension.direction : "") + " " + headerExtension.uri + "\r\n";
      };
      SDPUtils2.parseFmtp = function(line) {
        var parsed = {};
        var kv;
        var parts = line.substr(line.indexOf(" ") + 1).split(";");
        for (var j = 0; j < parts.length; j++) {
          kv = parts[j].trim().split("=");
          parsed[kv[0].trim()] = kv[1];
        }
        return parsed;
      };
      SDPUtils2.writeFmtp = function(codec) {
        var line = "";
        var pt = codec.payloadType;
        if (codec.preferredPayloadType !== void 0) {
          pt = codec.preferredPayloadType;
        }
        if (codec.parameters && Object.keys(codec.parameters).length) {
          var params2 = [];
          Object.keys(codec.parameters).forEach(function(param) {
            if (codec.parameters[param]) {
              params2.push(param + "=" + codec.parameters[param]);
            } else {
              params2.push(param);
            }
          });
          line += "a=fmtp:" + pt + " " + params2.join(";") + "\r\n";
        }
        return line;
      };
      SDPUtils2.parseRtcpFb = function(line) {
        var parts = line.substr(line.indexOf(" ") + 1).split(" ");
        return {
          type: parts.shift(),
          parameter: parts.join(" ")
        };
      };
      SDPUtils2.writeRtcpFb = function(codec) {
        var lines = "";
        var pt = codec.payloadType;
        if (codec.preferredPayloadType !== void 0) {
          pt = codec.preferredPayloadType;
        }
        if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
          codec.rtcpFeedback.forEach(function(fb) {
            lines += "a=rtcp-fb:" + pt + " " + fb.type + (fb.parameter && fb.parameter.length ? " " + fb.parameter : "") + "\r\n";
          });
        }
        return lines;
      };
      SDPUtils2.parseSsrcMedia = function(line) {
        var sp = line.indexOf(" ");
        var parts = {
          ssrc: parseInt(line.substr(7, sp - 7), 10)
        };
        var colon = line.indexOf(":", sp);
        if (colon > -1) {
          parts.attribute = line.substr(sp + 1, colon - sp - 1);
          parts.value = line.substr(colon + 1);
        } else {
          parts.attribute = line.substr(sp + 1);
        }
        return parts;
      };
      SDPUtils2.parseSsrcGroup = function(line) {
        var parts = line.substr(13).split(" ");
        return {
          semantics: parts.shift(),
          ssrcs: parts.map(function(ssrc) {
            return parseInt(ssrc, 10);
          })
        };
      };
      SDPUtils2.getMid = function(mediaSection) {
        var mid = SDPUtils2.matchPrefix(mediaSection, "a=mid:")[0];
        if (mid) {
          return mid.substr(6);
        }
      };
      SDPUtils2.parseFingerprint = function(line) {
        var parts = line.substr(14).split(" ");
        return {
          algorithm: parts[0].toLowerCase(),
          value: parts[1]
        };
      };
      SDPUtils2.getDtlsParameters = function(mediaSection, sessionpart) {
        var lines = SDPUtils2.matchPrefix(
          mediaSection + sessionpart,
          "a=fingerprint:"
        );
        return {
          role: "auto",
          fingerprints: lines.map(SDPUtils2.parseFingerprint)
        };
      };
      SDPUtils2.writeDtlsParameters = function(params2, setupType) {
        var sdp = "a=setup:" + setupType + "\r\n";
        params2.fingerprints.forEach(function(fp) {
          sdp += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
        });
        return sdp;
      };
      SDPUtils2.parseCryptoLine = function(line) {
        var parts = line.substr(9).split(" ");
        return {
          tag: parseInt(parts[0], 10),
          cryptoSuite: parts[1],
          keyParams: parts[2],
          sessionParams: parts.slice(3)
        };
      };
      SDPUtils2.writeCryptoLine = function(parameters) {
        return "a=crypto:" + parameters.tag + " " + parameters.cryptoSuite + " " + (typeof parameters.keyParams === "object" ? SDPUtils2.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? " " + parameters.sessionParams.join(" ") : "") + "\r\n";
      };
      SDPUtils2.parseCryptoKeyParams = function(keyParams) {
        if (keyParams.indexOf("inline:") !== 0) {
          return null;
        }
        var parts = keyParams.substr(7).split("|");
        return {
          keyMethod: "inline",
          keySalt: parts[0],
          lifeTime: parts[1],
          mkiValue: parts[2] ? parts[2].split(":")[0] : void 0,
          mkiLength: parts[2] ? parts[2].split(":")[1] : void 0
        };
      };
      SDPUtils2.writeCryptoKeyParams = function(keyParams) {
        return keyParams.keyMethod + ":" + keyParams.keySalt + (keyParams.lifeTime ? "|" + keyParams.lifeTime : "") + (keyParams.mkiValue && keyParams.mkiLength ? "|" + keyParams.mkiValue + ":" + keyParams.mkiLength : "");
      };
      SDPUtils2.getCryptoParameters = function(mediaSection, sessionpart) {
        var lines = SDPUtils2.matchPrefix(
          mediaSection + sessionpart,
          "a=crypto:"
        );
        return lines.map(SDPUtils2.parseCryptoLine);
      };
      SDPUtils2.getIceParameters = function(mediaSection, sessionpart) {
        var ufrag = SDPUtils2.matchPrefix(
          mediaSection + sessionpart,
          "a=ice-ufrag:"
        )[0];
        var pwd = SDPUtils2.matchPrefix(
          mediaSection + sessionpart,
          "a=ice-pwd:"
        )[0];
        if (!(ufrag && pwd)) {
          return null;
        }
        return {
          usernameFragment: ufrag.substr(12),
          password: pwd.substr(10)
        };
      };
      SDPUtils2.writeIceParameters = function(params2) {
        return "a=ice-ufrag:" + params2.usernameFragment + "\r\na=ice-pwd:" + params2.password + "\r\n";
      };
      SDPUtils2.parseRtpParameters = function(mediaSection) {
        var description = {
          codecs: [],
          headerExtensions: [],
          fecMechanisms: [],
          rtcp: []
        };
        var lines = SDPUtils2.splitLines(mediaSection);
        var mline = lines[0].split(" ");
        for (var i = 3; i < mline.length; i++) {
          var pt = mline[i];
          var rtpmapline = SDPUtils2.matchPrefix(
            mediaSection,
            "a=rtpmap:" + pt + " "
          )[0];
          if (rtpmapline) {
            var codec = SDPUtils2.parseRtpMap(rtpmapline);
            var fmtps = SDPUtils2.matchPrefix(
              mediaSection,
              "a=fmtp:" + pt + " "
            );
            codec.parameters = fmtps.length ? SDPUtils2.parseFmtp(fmtps[0]) : {};
            codec.rtcpFeedback = SDPUtils2.matchPrefix(
              mediaSection,
              "a=rtcp-fb:" + pt + " "
            ).map(SDPUtils2.parseRtcpFb);
            description.codecs.push(codec);
            switch (codec.name.toUpperCase()) {
              case "RED":
              case "ULPFEC":
                description.fecMechanisms.push(codec.name.toUpperCase());
                break;
              default:
                break;
            }
          }
        }
        SDPUtils2.matchPrefix(mediaSection, "a=extmap:").forEach(function(line) {
          description.headerExtensions.push(SDPUtils2.parseExtmap(line));
        });
        return description;
      };
      SDPUtils2.writeRtpDescription = function(kind, caps) {
        var sdp = "";
        sdp += "m=" + kind + " ";
        sdp += caps.codecs.length > 0 ? "9" : "0";
        sdp += " UDP/TLS/RTP/SAVPF ";
        sdp += caps.codecs.map(function(codec) {
          if (codec.preferredPayloadType !== void 0) {
            return codec.preferredPayloadType;
          }
          return codec.payloadType;
        }).join(" ") + "\r\n";
        sdp += "c=IN IP4 0.0.0.0\r\n";
        sdp += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
        caps.codecs.forEach(function(codec) {
          sdp += SDPUtils2.writeRtpMap(codec);
          sdp += SDPUtils2.writeFmtp(codec);
          sdp += SDPUtils2.writeRtcpFb(codec);
        });
        var maxptime = 0;
        caps.codecs.forEach(function(codec) {
          if (codec.maxptime > maxptime) {
            maxptime = codec.maxptime;
          }
        });
        if (maxptime > 0) {
          sdp += "a=maxptime:" + maxptime + "\r\n";
        }
        sdp += "a=rtcp-mux\r\n";
        if (caps.headerExtensions) {
          caps.headerExtensions.forEach(function(extension) {
            sdp += SDPUtils2.writeExtmap(extension);
          });
        }
        return sdp;
      };
      SDPUtils2.parseRtpEncodingParameters = function(mediaSection) {
        var encodingParameters = [];
        var description = SDPUtils2.parseRtpParameters(mediaSection);
        var hasRed = description.fecMechanisms.indexOf("RED") !== -1;
        var hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
        var ssrcs = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
          return SDPUtils2.parseSsrcMedia(line);
        }).filter(function(parts) {
          return parts.attribute === "cname";
        });
        var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
        var secondarySsrc;
        var flows = SDPUtils2.matchPrefix(mediaSection, "a=ssrc-group:FID").map(function(line) {
          var parts = line.substr(17).split(" ");
          return parts.map(function(part) {
            return parseInt(part, 10);
          });
        });
        if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
          secondarySsrc = flows[0][1];
        }
        description.codecs.forEach(function(codec) {
          if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
            var encParam = {
              ssrc: primarySsrc,
              codecPayloadType: parseInt(codec.parameters.apt, 10)
            };
            if (primarySsrc && secondarySsrc) {
              encParam.rtx = { ssrc: secondarySsrc };
            }
            encodingParameters.push(encParam);
            if (hasRed) {
              encParam = JSON.parse(JSON.stringify(encParam));
              encParam.fec = {
                ssrc: primarySsrc,
                mechanism: hasUlpfec ? "red+ulpfec" : "red"
              };
              encodingParameters.push(encParam);
            }
          }
        });
        if (encodingParameters.length === 0 && primarySsrc) {
          encodingParameters.push({
            ssrc: primarySsrc
          });
        }
        var bandwidth = SDPUtils2.matchPrefix(mediaSection, "b=");
        if (bandwidth.length) {
          if (bandwidth[0].indexOf("b=TIAS:") === 0) {
            bandwidth = parseInt(bandwidth[0].substr(7), 10);
          } else if (bandwidth[0].indexOf("b=AS:") === 0) {
            bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1e3 * 0.95 - 50 * 40 * 8;
          } else {
            bandwidth = void 0;
          }
          encodingParameters.forEach(function(params2) {
            params2.maxBitrate = bandwidth;
          });
        }
        return encodingParameters;
      };
      SDPUtils2.parseRtcpParameters = function(mediaSection) {
        var rtcpParameters = {};
        var remoteSsrc = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
          return SDPUtils2.parseSsrcMedia(line);
        }).filter(function(obj) {
          return obj.attribute === "cname";
        })[0];
        if (remoteSsrc) {
          rtcpParameters.cname = remoteSsrc.value;
          rtcpParameters.ssrc = remoteSsrc.ssrc;
        }
        var rsize = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-rsize");
        rtcpParameters.reducedSize = rsize.length > 0;
        rtcpParameters.compound = rsize.length === 0;
        var mux = SDPUtils2.matchPrefix(mediaSection, "a=rtcp-mux");
        rtcpParameters.mux = mux.length > 0;
        return rtcpParameters;
      };
      SDPUtils2.parseMsid = function(mediaSection) {
        var parts;
        var spec = SDPUtils2.matchPrefix(mediaSection, "a=msid:");
        if (spec.length === 1) {
          parts = spec[0].substr(7).split(" ");
          return { stream: parts[0], track: parts[1] };
        }
        var planB = SDPUtils2.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
          return SDPUtils2.parseSsrcMedia(line);
        }).filter(function(msidParts) {
          return msidParts.attribute === "msid";
        });
        if (planB.length > 0) {
          parts = planB[0].value.split(" ");
          return { stream: parts[0], track: parts[1] };
        }
      };
      SDPUtils2.parseSctpDescription = function(mediaSection) {
        var mline = SDPUtils2.parseMLine(mediaSection);
        var maxSizeLine = SDPUtils2.matchPrefix(mediaSection, "a=max-message-size:");
        var maxMessageSize;
        if (maxSizeLine.length > 0) {
          maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
        }
        if (isNaN(maxMessageSize)) {
          maxMessageSize = 65536;
        }
        var sctpPort = SDPUtils2.matchPrefix(mediaSection, "a=sctp-port:");
        if (sctpPort.length > 0) {
          return {
            port: parseInt(sctpPort[0].substr(12), 10),
            protocol: mline.fmt,
            maxMessageSize
          };
        }
        var sctpMapLines = SDPUtils2.matchPrefix(mediaSection, "a=sctpmap:");
        if (sctpMapLines.length > 0) {
          var parts = SDPUtils2.matchPrefix(mediaSection, "a=sctpmap:")[0].substr(10).split(" ");
          return {
            port: parseInt(parts[0], 10),
            protocol: parts[1],
            maxMessageSize
          };
        }
      };
      SDPUtils2.writeSctpDescription = function(media, sctp) {
        var output = [];
        if (media.protocol !== "DTLS/SCTP") {
          output = [
            "m=" + media.kind + " 9 " + media.protocol + " " + sctp.protocol + "\r\n",
            "c=IN IP4 0.0.0.0\r\n",
            "a=sctp-port:" + sctp.port + "\r\n"
          ];
        } else {
          output = [
            "m=" + media.kind + " 9 " + media.protocol + " " + sctp.port + "\r\n",
            "c=IN IP4 0.0.0.0\r\n",
            "a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"
          ];
        }
        if (sctp.maxMessageSize !== void 0) {
          output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
        }
        return output.join("");
      };
      SDPUtils2.generateSessionId = function() {
        return Math.random().toString().substr(2, 21);
      };
      SDPUtils2.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
        var sessionId;
        var version = sessVer !== void 0 ? sessVer : 2;
        if (sessId) {
          sessionId = sessId;
        } else {
          sessionId = SDPUtils2.generateSessionId();
        }
        var user = sessUser || "thisisadapterortc";
        return "v=0\r\no=" + user + " " + sessionId + " " + version + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
      };
      SDPUtils2.writeMediaSection = function(transceiver, caps, type3, stream) {
        var sdp = SDPUtils2.writeRtpDescription(transceiver.kind, caps);
        sdp += SDPUtils2.writeIceParameters(
          transceiver.iceGatherer.getLocalParameters()
        );
        sdp += SDPUtils2.writeDtlsParameters(
          transceiver.dtlsTransport.getLocalParameters(),
          type3 === "offer" ? "actpass" : "active"
        );
        sdp += "a=mid:" + transceiver.mid + "\r\n";
        if (transceiver.direction) {
          sdp += "a=" + transceiver.direction + "\r\n";
        } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
          sdp += "a=sendrecv\r\n";
        } else if (transceiver.rtpSender) {
          sdp += "a=sendonly\r\n";
        } else if (transceiver.rtpReceiver) {
          sdp += "a=recvonly\r\n";
        } else {
          sdp += "a=inactive\r\n";
        }
        if (transceiver.rtpSender) {
          var msid = "msid:" + stream.id + " " + transceiver.rtpSender.track.id + "\r\n";
          sdp += "a=" + msid;
          sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " " + msid;
          if (transceiver.sendEncodingParameters[0].rtx) {
            sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].rtx.ssrc + " " + msid;
            sdp += "a=ssrc-group:FID " + transceiver.sendEncodingParameters[0].ssrc + " " + transceiver.sendEncodingParameters[0].rtx.ssrc + "\r\n";
          }
        }
        sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " cname:" + SDPUtils2.localCName + "\r\n";
        if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
          sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].rtx.ssrc + " cname:" + SDPUtils2.localCName + "\r\n";
        }
        return sdp;
      };
      SDPUtils2.getDirection = function(mediaSection, sessionpart) {
        var lines = SDPUtils2.splitLines(mediaSection);
        for (var i = 0; i < lines.length; i++) {
          switch (lines[i]) {
            case "a=sendrecv":
            case "a=sendonly":
            case "a=recvonly":
            case "a=inactive":
              return lines[i].substr(2);
            default:
          }
        }
        if (sessionpart) {
          return SDPUtils2.getDirection(sessionpart);
        }
        return "sendrecv";
      };
      SDPUtils2.getKind = function(mediaSection) {
        var lines = SDPUtils2.splitLines(mediaSection);
        var mline = lines[0].split(" ");
        return mline[0].substr(2);
      };
      SDPUtils2.isRejected = function(mediaSection) {
        return mediaSection.split(" ", 2)[1] === "0";
      };
      SDPUtils2.parseMLine = function(mediaSection) {
        var lines = SDPUtils2.splitLines(mediaSection);
        var parts = lines[0].substr(2).split(" ");
        return {
          kind: parts[0],
          port: parseInt(parts[1], 10),
          protocol: parts[2],
          fmt: parts.slice(3).join(" ")
        };
      };
      SDPUtils2.parseOLine = function(mediaSection) {
        var line = SDPUtils2.matchPrefix(mediaSection, "o=")[0];
        var parts = line.substr(2).split(" ");
        return {
          username: parts[0],
          sessionId: parts[1],
          sessionVersion: parseInt(parts[2], 10),
          netType: parts[3],
          addressType: parts[4],
          address: parts[5]
        };
      };
      SDPUtils2.isValidSDP = function(blob) {
        if (typeof blob !== "string" || blob.length === 0) {
          return false;
        }
        var lines = SDPUtils2.splitLines(blob);
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].length < 2 || lines[i].charAt(1) !== "=") {
            return false;
          }
        }
        return true;
      };
      if (typeof module === "object") {
        module.exports = SDPUtils2;
      }
    }
  });

  // node_modules/rtcpeerconnection-shim/rtcpeerconnection.js
  var require_rtcpeerconnection = __commonJS({
    "node_modules/rtcpeerconnection-shim/rtcpeerconnection.js"(exports, module) {
      "use strict";
      var SDPUtils2 = require_sdp();
      function fixStatsType(stat) {
        return {
          inboundrtp: "inbound-rtp",
          outboundrtp: "outbound-rtp",
          candidatepair: "candidate-pair",
          localcandidate: "local-candidate",
          remotecandidate: "remote-candidate"
        }[stat.type] || stat.type;
      }
      function writeMediaSection(transceiver, caps, type3, stream, dtlsRole) {
        var sdp = SDPUtils2.writeRtpDescription(transceiver.kind, caps);
        sdp += SDPUtils2.writeIceParameters(
          transceiver.iceGatherer.getLocalParameters()
        );
        sdp += SDPUtils2.writeDtlsParameters(
          transceiver.dtlsTransport.getLocalParameters(),
          type3 === "offer" ? "actpass" : dtlsRole || "active"
        );
        sdp += "a=mid:" + transceiver.mid + "\r\n";
        if (transceiver.rtpSender && transceiver.rtpReceiver) {
          sdp += "a=sendrecv\r\n";
        } else if (transceiver.rtpSender) {
          sdp += "a=sendonly\r\n";
        } else if (transceiver.rtpReceiver) {
          sdp += "a=recvonly\r\n";
        } else {
          sdp += "a=inactive\r\n";
        }
        if (transceiver.rtpSender) {
          var trackId = transceiver.rtpSender._initialTrackId || transceiver.rtpSender.track.id;
          transceiver.rtpSender._initialTrackId = trackId;
          var msid = "msid:" + (stream ? stream.id : "-") + " " + trackId + "\r\n";
          sdp += "a=" + msid;
          sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " " + msid;
          if (transceiver.sendEncodingParameters[0].rtx) {
            sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].rtx.ssrc + " " + msid;
            sdp += "a=ssrc-group:FID " + transceiver.sendEncodingParameters[0].ssrc + " " + transceiver.sendEncodingParameters[0].rtx.ssrc + "\r\n";
          }
        }
        sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " cname:" + SDPUtils2.localCName + "\r\n";
        if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
          sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].rtx.ssrc + " cname:" + SDPUtils2.localCName + "\r\n";
        }
        return sdp;
      }
      function filterIceServers2(iceServers, edgeVersion) {
        var hasTurn = false;
        iceServers = JSON.parse(JSON.stringify(iceServers));
        return iceServers.filter(function(server) {
          if (server && (server.urls || server.url)) {
            var urls = server.urls || server.url;
            if (server.url && !server.urls) {
              console.warn("RTCIceServer.url is deprecated! Use urls instead.");
            }
            var isString = typeof urls === "string";
            if (isString) {
              urls = [urls];
            }
            urls = urls.filter(function(url) {
              var validTurn = url.indexOf("turn:") === 0 && url.indexOf("transport=udp") !== -1 && url.indexOf("turn:[") === -1 && !hasTurn;
              if (validTurn) {
                hasTurn = true;
                return true;
              }
              return url.indexOf("stun:") === 0 && edgeVersion >= 14393 && url.indexOf("?transport=udp") === -1;
            });
            delete server.url;
            server.urls = isString ? urls[0] : urls;
            return !!urls.length;
          }
        });
      }
      function getCommonCapabilities(localCapabilities, remoteCapabilities) {
        var commonCapabilities = {
          codecs: [],
          headerExtensions: [],
          fecMechanisms: []
        };
        var findCodecByPayloadType = function(pt, codecs) {
          pt = parseInt(pt, 10);
          for (var i = 0; i < codecs.length; i++) {
            if (codecs[i].payloadType === pt || codecs[i].preferredPayloadType === pt) {
              return codecs[i];
            }
          }
        };
        var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
          var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
          var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
          return lCodec && rCodec && lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
        };
        localCapabilities.codecs.forEach(function(lCodec) {
          for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
            var rCodec = remoteCapabilities.codecs[i];
            if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate) {
              if (lCodec.name.toLowerCase() === "rtx" && lCodec.parameters && rCodec.parameters.apt) {
                if (!rtxCapabilityMatches(
                  lCodec,
                  rCodec,
                  localCapabilities.codecs,
                  remoteCapabilities.codecs
                )) {
                  continue;
                }
              }
              rCodec = JSON.parse(JSON.stringify(rCodec));
              rCodec.numChannels = Math.min(
                lCodec.numChannels,
                rCodec.numChannels
              );
              commonCapabilities.codecs.push(rCodec);
              rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
                for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                  if (lCodec.rtcpFeedback[j].type === fb.type && lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                    return true;
                  }
                }
                return false;
              });
              break;
            }
          }
        });
        localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
          for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
            var rHeaderExtension = remoteCapabilities.headerExtensions[i];
            if (lHeaderExtension.uri === rHeaderExtension.uri) {
              commonCapabilities.headerExtensions.push(rHeaderExtension);
              break;
            }
          }
        });
        return commonCapabilities;
      }
      function isActionAllowedInSignalingState(action, type3, signalingState) {
        return {
          offer: {
            setLocalDescription: ["stable", "have-local-offer"],
            setRemoteDescription: ["stable", "have-remote-offer"]
          },
          answer: {
            setLocalDescription: ["have-remote-offer", "have-local-pranswer"],
            setRemoteDescription: ["have-local-offer", "have-remote-pranswer"]
          }
        }[type3][action].indexOf(signalingState) !== -1;
      }
      function maybeAddCandidate(iceTransport, candidate) {
        var alreadyAdded = iceTransport.getRemoteCandidates().find(function(remoteCandidate) {
          return candidate.foundation === remoteCandidate.foundation && candidate.ip === remoteCandidate.ip && candidate.port === remoteCandidate.port && candidate.priority === remoteCandidate.priority && candidate.protocol === remoteCandidate.protocol && candidate.type === remoteCandidate.type;
        });
        if (!alreadyAdded) {
          iceTransport.addRemoteCandidate(candidate);
        }
        return !alreadyAdded;
      }
      function makeError(name, description) {
        var e = new Error(description);
        e.name = name;
        e.code = {
          NotSupportedError: 9,
          InvalidStateError: 11,
          InvalidAccessError: 15,
          TypeError: void 0,
          OperationError: void 0
        }[name];
        return e;
      }
      module.exports = function(window2, edgeVersion) {
        function addTrackToStreamAndFireEvent(track, stream) {
          stream.addTrack(track);
          stream.dispatchEvent(new window2.MediaStreamTrackEvent(
            "addtrack",
            { track }
          ));
        }
        function removeTrackFromStreamAndFireEvent(track, stream) {
          stream.removeTrack(track);
          stream.dispatchEvent(new window2.MediaStreamTrackEvent(
            "removetrack",
            { track }
          ));
        }
        function fireAddTrack(pc, track, receiver, streams) {
          var trackEvent = new Event("track");
          trackEvent.track = track;
          trackEvent.receiver = receiver;
          trackEvent.transceiver = { receiver };
          trackEvent.streams = streams;
          window2.setTimeout(function() {
            pc._dispatchEvent("track", trackEvent);
          });
        }
        var RTCPeerConnection2 = function(config) {
          var pc = this;
          var _eventTarget = document.createDocumentFragment();
          ["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function(method) {
            pc[method] = _eventTarget[method].bind(_eventTarget);
          });
          this.canTrickleIceCandidates = null;
          this.needNegotiation = false;
          this.localStreams = [];
          this.remoteStreams = [];
          this._localDescription = null;
          this._remoteDescription = null;
          this.signalingState = "stable";
          this.iceConnectionState = "new";
          this.connectionState = "new";
          this.iceGatheringState = "new";
          config = JSON.parse(JSON.stringify(config || {}));
          this.usingBundle = config.bundlePolicy === "max-bundle";
          if (config.rtcpMuxPolicy === "negotiate") {
            throw makeError(
              "NotSupportedError",
              "rtcpMuxPolicy 'negotiate' is not supported"
            );
          } else if (!config.rtcpMuxPolicy) {
            config.rtcpMuxPolicy = "require";
          }
          switch (config.iceTransportPolicy) {
            case "all":
            case "relay":
              break;
            default:
              config.iceTransportPolicy = "all";
              break;
          }
          switch (config.bundlePolicy) {
            case "balanced":
            case "max-compat":
            case "max-bundle":
              break;
            default:
              config.bundlePolicy = "balanced";
              break;
          }
          config.iceServers = filterIceServers2(config.iceServers || [], edgeVersion);
          this._iceGatherers = [];
          if (config.iceCandidatePoolSize) {
            for (var i = config.iceCandidatePoolSize; i > 0; i--) {
              this._iceGatherers.push(new window2.RTCIceGatherer({
                iceServers: config.iceServers,
                gatherPolicy: config.iceTransportPolicy
              }));
            }
          } else {
            config.iceCandidatePoolSize = 0;
          }
          this._config = config;
          this.transceivers = [];
          this._sdpSessionId = SDPUtils2.generateSessionId();
          this._sdpSessionVersion = 0;
          this._dtlsRole = void 0;
          this._isClosed = false;
        };
        Object.defineProperty(RTCPeerConnection2.prototype, "localDescription", {
          configurable: true,
          get: function() {
            return this._localDescription;
          }
        });
        Object.defineProperty(RTCPeerConnection2.prototype, "remoteDescription", {
          configurable: true,
          get: function() {
            return this._remoteDescription;
          }
        });
        RTCPeerConnection2.prototype.onicecandidate = null;
        RTCPeerConnection2.prototype.onaddstream = null;
        RTCPeerConnection2.prototype.ontrack = null;
        RTCPeerConnection2.prototype.onremovestream = null;
        RTCPeerConnection2.prototype.onsignalingstatechange = null;
        RTCPeerConnection2.prototype.oniceconnectionstatechange = null;
        RTCPeerConnection2.prototype.onconnectionstatechange = null;
        RTCPeerConnection2.prototype.onicegatheringstatechange = null;
        RTCPeerConnection2.prototype.onnegotiationneeded = null;
        RTCPeerConnection2.prototype.ondatachannel = null;
        RTCPeerConnection2.prototype._dispatchEvent = function(name, event) {
          if (this._isClosed) {
            return;
          }
          this.dispatchEvent(event);
          if (typeof this["on" + name] === "function") {
            this["on" + name](event);
          }
        };
        RTCPeerConnection2.prototype._emitGatheringStateChange = function() {
          var event = new Event("icegatheringstatechange");
          this._dispatchEvent("icegatheringstatechange", event);
        };
        RTCPeerConnection2.prototype.getConfiguration = function() {
          return this._config;
        };
        RTCPeerConnection2.prototype.getLocalStreams = function() {
          return this.localStreams;
        };
        RTCPeerConnection2.prototype.getRemoteStreams = function() {
          return this.remoteStreams;
        };
        RTCPeerConnection2.prototype._createTransceiver = function(kind, doNotAdd) {
          var hasBundleTransport = this.transceivers.length > 0;
          var transceiver = {
            track: null,
            iceGatherer: null,
            iceTransport: null,
            dtlsTransport: null,
            localCapabilities: null,
            remoteCapabilities: null,
            rtpSender: null,
            rtpReceiver: null,
            kind,
            mid: null,
            sendEncodingParameters: null,
            recvEncodingParameters: null,
            stream: null,
            associatedRemoteMediaStreams: [],
            wantReceive: true
          };
          if (this.usingBundle && hasBundleTransport) {
            transceiver.iceTransport = this.transceivers[0].iceTransport;
            transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
          } else {
            var transports = this._createIceAndDtlsTransports();
            transceiver.iceTransport = transports.iceTransport;
            transceiver.dtlsTransport = transports.dtlsTransport;
          }
          if (!doNotAdd) {
            this.transceivers.push(transceiver);
          }
          return transceiver;
        };
        RTCPeerConnection2.prototype.addTrack = function(track, stream) {
          if (this._isClosed) {
            throw makeError(
              "InvalidStateError",
              "Attempted to call addTrack on a closed peerconnection."
            );
          }
          var alreadyExists = this.transceivers.find(function(s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw makeError("InvalidAccessError", "Track already exists.");
          }
          var transceiver;
          for (var i = 0; i < this.transceivers.length; i++) {
            if (!this.transceivers[i].track && this.transceivers[i].kind === track.kind) {
              transceiver = this.transceivers[i];
            }
          }
          if (!transceiver) {
            transceiver = this._createTransceiver(track.kind);
          }
          this._maybeFireNegotiationNeeded();
          if (this.localStreams.indexOf(stream) === -1) {
            this.localStreams.push(stream);
          }
          transceiver.track = track;
          transceiver.stream = stream;
          transceiver.rtpSender = new window2.RTCRtpSender(
            track,
            transceiver.dtlsTransport
          );
          return transceiver.rtpSender;
        };
        RTCPeerConnection2.prototype.addStream = function(stream) {
          var pc = this;
          if (edgeVersion >= 15025) {
            stream.getTracks().forEach(function(track) {
              pc.addTrack(track, stream);
            });
          } else {
            var clonedStream = stream.clone();
            stream.getTracks().forEach(function(track, idx) {
              var clonedTrack = clonedStream.getTracks()[idx];
              track.addEventListener("enabled", function(event) {
                clonedTrack.enabled = event.enabled;
              });
            });
            clonedStream.getTracks().forEach(function(track) {
              pc.addTrack(track, clonedStream);
            });
          }
        };
        RTCPeerConnection2.prototype.removeTrack = function(sender) {
          if (this._isClosed) {
            throw makeError(
              "InvalidStateError",
              "Attempted to call removeTrack on a closed peerconnection."
            );
          }
          if (!(sender instanceof window2.RTCRtpSender)) {
            throw new TypeError("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.");
          }
          var transceiver = this.transceivers.find(function(t) {
            return t.rtpSender === sender;
          });
          if (!transceiver) {
            throw makeError(
              "InvalidAccessError",
              "Sender was not created by this connection."
            );
          }
          var stream = transceiver.stream;
          transceiver.rtpSender.stop();
          transceiver.rtpSender = null;
          transceiver.track = null;
          transceiver.stream = null;
          var localStreams = this.transceivers.map(function(t) {
            return t.stream;
          });
          if (localStreams.indexOf(stream) === -1 && this.localStreams.indexOf(stream) > -1) {
            this.localStreams.splice(this.localStreams.indexOf(stream), 1);
          }
          this._maybeFireNegotiationNeeded();
        };
        RTCPeerConnection2.prototype.removeStream = function(stream) {
          var pc = this;
          stream.getTracks().forEach(function(track) {
            var sender = pc.getSenders().find(function(s) {
              return s.track === track;
            });
            if (sender) {
              pc.removeTrack(sender);
            }
          });
        };
        RTCPeerConnection2.prototype.getSenders = function() {
          return this.transceivers.filter(function(transceiver) {
            return !!transceiver.rtpSender;
          }).map(function(transceiver) {
            return transceiver.rtpSender;
          });
        };
        RTCPeerConnection2.prototype.getReceivers = function() {
          return this.transceivers.filter(function(transceiver) {
            return !!transceiver.rtpReceiver;
          }).map(function(transceiver) {
            return transceiver.rtpReceiver;
          });
        };
        RTCPeerConnection2.prototype._createIceGatherer = function(sdpMLineIndex, usingBundle) {
          var pc = this;
          if (usingBundle && sdpMLineIndex > 0) {
            return this.transceivers[0].iceGatherer;
          } else if (this._iceGatherers.length) {
            return this._iceGatherers.shift();
          }
          var iceGatherer = new window2.RTCIceGatherer({
            iceServers: this._config.iceServers,
            gatherPolicy: this._config.iceTransportPolicy
          });
          Object.defineProperty(
            iceGatherer,
            "state",
            { value: "new", writable: true }
          );
          this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
          this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
            var end = !event.candidate || Object.keys(event.candidate).length === 0;
            iceGatherer.state = end ? "completed" : "gathering";
            if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
              pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
            }
          };
          iceGatherer.addEventListener(
            "localcandidate",
            this.transceivers[sdpMLineIndex].bufferCandidates
          );
          return iceGatherer;
        };
        RTCPeerConnection2.prototype._gather = function(mid, sdpMLineIndex) {
          var pc = this;
          var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
          if (iceGatherer.onlocalcandidate) {
            return;
          }
          var bufferedCandidateEvents = this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
          this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
          iceGatherer.removeEventListener(
            "localcandidate",
            this.transceivers[sdpMLineIndex].bufferCandidates
          );
          iceGatherer.onlocalcandidate = function(evt) {
            if (pc.usingBundle && sdpMLineIndex > 0) {
              return;
            }
            var event = new Event("icecandidate");
            event.candidate = { sdpMid: mid, sdpMLineIndex };
            var cand = evt.candidate;
            var end = !cand || Object.keys(cand).length === 0;
            if (end) {
              if (iceGatherer.state === "new" || iceGatherer.state === "gathering") {
                iceGatherer.state = "completed";
              }
            } else {
              if (iceGatherer.state === "new") {
                iceGatherer.state = "gathering";
              }
              cand.component = 1;
              cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;
              var serializedCandidate = SDPUtils2.writeCandidate(cand);
              event.candidate = Object.assign(
                event.candidate,
                SDPUtils2.parseCandidate(serializedCandidate)
              );
              event.candidate.candidate = serializedCandidate;
              event.candidate.toJSON = function() {
                return {
                  candidate: event.candidate.candidate,
                  sdpMid: event.candidate.sdpMid,
                  sdpMLineIndex: event.candidate.sdpMLineIndex,
                  usernameFragment: event.candidate.usernameFragment
                };
              };
            }
            var sections = SDPUtils2.getMediaSections(pc._localDescription.sdp);
            if (!end) {
              sections[event.candidate.sdpMLineIndex] += "a=" + event.candidate.candidate + "\r\n";
            } else {
              sections[event.candidate.sdpMLineIndex] += "a=end-of-candidates\r\n";
            }
            pc._localDescription.sdp = SDPUtils2.getDescription(pc._localDescription.sdp) + sections.join("");
            var complete = pc.transceivers.every(function(transceiver) {
              return transceiver.iceGatherer && transceiver.iceGatherer.state === "completed";
            });
            if (pc.iceGatheringState !== "gathering") {
              pc.iceGatheringState = "gathering";
              pc._emitGatheringStateChange();
            }
            if (!end) {
              pc._dispatchEvent("icecandidate", event);
            }
            if (complete) {
              pc._dispatchEvent("icecandidate", new Event("icecandidate"));
              pc.iceGatheringState = "complete";
              pc._emitGatheringStateChange();
            }
          };
          window2.setTimeout(function() {
            bufferedCandidateEvents.forEach(function(e) {
              iceGatherer.onlocalcandidate(e);
            });
          }, 0);
        };
        RTCPeerConnection2.prototype._createIceAndDtlsTransports = function() {
          var pc = this;
          var iceTransport = new window2.RTCIceTransport(null);
          iceTransport.onicestatechange = function() {
            pc._updateIceConnectionState();
            pc._updateConnectionState();
          };
          var dtlsTransport = new window2.RTCDtlsTransport(iceTransport);
          dtlsTransport.ondtlsstatechange = function() {
            pc._updateConnectionState();
          };
          dtlsTransport.onerror = function() {
            Object.defineProperty(
              dtlsTransport,
              "state",
              { value: "failed", writable: true }
            );
            pc._updateConnectionState();
          };
          return {
            iceTransport,
            dtlsTransport
          };
        };
        RTCPeerConnection2.prototype._disposeIceAndDtlsTransports = function(sdpMLineIndex) {
          var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
          if (iceGatherer) {
            delete iceGatherer.onlocalcandidate;
            delete this.transceivers[sdpMLineIndex].iceGatherer;
          }
          var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
          if (iceTransport) {
            delete iceTransport.onicestatechange;
            delete this.transceivers[sdpMLineIndex].iceTransport;
          }
          var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
          if (dtlsTransport) {
            delete dtlsTransport.ondtlsstatechange;
            delete dtlsTransport.onerror;
            delete this.transceivers[sdpMLineIndex].dtlsTransport;
          }
        };
        RTCPeerConnection2.prototype._transceive = function(transceiver, send, recv) {
          var params2 = getCommonCapabilities(
            transceiver.localCapabilities,
            transceiver.remoteCapabilities
          );
          if (send && transceiver.rtpSender) {
            params2.encodings = transceiver.sendEncodingParameters;
            params2.rtcp = {
              cname: SDPUtils2.localCName,
              compound: transceiver.rtcpParameters.compound
            };
            if (transceiver.recvEncodingParameters.length) {
              params2.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
            }
            transceiver.rtpSender.send(params2);
          }
          if (recv && transceiver.rtpReceiver && params2.codecs.length > 0) {
            if (transceiver.kind === "video" && transceiver.recvEncodingParameters && edgeVersion < 15019) {
              transceiver.recvEncodingParameters.forEach(function(p) {
                delete p.rtx;
              });
            }
            if (transceiver.recvEncodingParameters.length) {
              params2.encodings = transceiver.recvEncodingParameters;
            } else {
              params2.encodings = [{}];
            }
            params2.rtcp = {
              compound: transceiver.rtcpParameters.compound
            };
            if (transceiver.rtcpParameters.cname) {
              params2.rtcp.cname = transceiver.rtcpParameters.cname;
            }
            if (transceiver.sendEncodingParameters.length) {
              params2.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
            }
            transceiver.rtpReceiver.receive(params2);
          }
        };
        RTCPeerConnection2.prototype.setLocalDescription = function(description) {
          var pc = this;
          if (["offer", "answer"].indexOf(description.type) === -1) {
            return Promise.reject(makeError(
              "TypeError",
              'Unsupported type "' + description.type + '"'
            ));
          }
          if (!isActionAllowedInSignalingState(
            "setLocalDescription",
            description.type,
            pc.signalingState
          ) || pc._isClosed) {
            return Promise.reject(makeError(
              "InvalidStateError",
              "Can not set local " + description.type + " in state " + pc.signalingState
            ));
          }
          var sections;
          var sessionpart;
          if (description.type === "offer") {
            sections = SDPUtils2.splitSections(description.sdp);
            sessionpart = sections.shift();
            sections.forEach(function(mediaSection, sdpMLineIndex) {
              var caps = SDPUtils2.parseRtpParameters(mediaSection);
              pc.transceivers[sdpMLineIndex].localCapabilities = caps;
            });
            pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
              pc._gather(transceiver.mid, sdpMLineIndex);
            });
          } else if (description.type === "answer") {
            sections = SDPUtils2.splitSections(pc._remoteDescription.sdp);
            sessionpart = sections.shift();
            var isIceLite = SDPUtils2.matchPrefix(
              sessionpart,
              "a=ice-lite"
            ).length > 0;
            sections.forEach(function(mediaSection, sdpMLineIndex) {
              var transceiver = pc.transceivers[sdpMLineIndex];
              var iceGatherer = transceiver.iceGatherer;
              var iceTransport = transceiver.iceTransport;
              var dtlsTransport = transceiver.dtlsTransport;
              var localCapabilities = transceiver.localCapabilities;
              var remoteCapabilities = transceiver.remoteCapabilities;
              var rejected = SDPUtils2.isRejected(mediaSection) && SDPUtils2.matchPrefix(mediaSection, "a=bundle-only").length === 0;
              if (!rejected && !transceiver.rejected) {
                var remoteIceParameters = SDPUtils2.getIceParameters(
                  mediaSection,
                  sessionpart
                );
                var remoteDtlsParameters = SDPUtils2.getDtlsParameters(
                  mediaSection,
                  sessionpart
                );
                if (isIceLite) {
                  remoteDtlsParameters.role = "server";
                }
                if (!pc.usingBundle || sdpMLineIndex === 0) {
                  pc._gather(transceiver.mid, sdpMLineIndex);
                  if (iceTransport.state === "new") {
                    iceTransport.start(
                      iceGatherer,
                      remoteIceParameters,
                      isIceLite ? "controlling" : "controlled"
                    );
                  }
                  if (dtlsTransport.state === "new") {
                    dtlsTransport.start(remoteDtlsParameters);
                  }
                }
                var params2 = getCommonCapabilities(
                  localCapabilities,
                  remoteCapabilities
                );
                pc._transceive(
                  transceiver,
                  params2.codecs.length > 0,
                  false
                );
              }
            });
          }
          pc._localDescription = {
            type: description.type,
            sdp: description.sdp
          };
          if (description.type === "offer") {
            pc._updateSignalingState("have-local-offer");
          } else {
            pc._updateSignalingState("stable");
          }
          return Promise.resolve();
        };
        RTCPeerConnection2.prototype.setRemoteDescription = function(description) {
          var pc = this;
          if (["offer", "answer"].indexOf(description.type) === -1) {
            return Promise.reject(makeError(
              "TypeError",
              'Unsupported type "' + description.type + '"'
            ));
          }
          if (!isActionAllowedInSignalingState(
            "setRemoteDescription",
            description.type,
            pc.signalingState
          ) || pc._isClosed) {
            return Promise.reject(makeError(
              "InvalidStateError",
              "Can not set remote " + description.type + " in state " + pc.signalingState
            ));
          }
          var streams = {};
          pc.remoteStreams.forEach(function(stream) {
            streams[stream.id] = stream;
          });
          var receiverList = [];
          var sections = SDPUtils2.splitSections(description.sdp);
          var sessionpart = sections.shift();
          var isIceLite = SDPUtils2.matchPrefix(
            sessionpart,
            "a=ice-lite"
          ).length > 0;
          var usingBundle = SDPUtils2.matchPrefix(
            sessionpart,
            "a=group:BUNDLE "
          ).length > 0;
          pc.usingBundle = usingBundle;
          var iceOptions = SDPUtils2.matchPrefix(
            sessionpart,
            "a=ice-options:"
          )[0];
          if (iceOptions) {
            pc.canTrickleIceCandidates = iceOptions.substr(14).split(" ").indexOf("trickle") >= 0;
          } else {
            pc.canTrickleIceCandidates = false;
          }
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var lines = SDPUtils2.splitLines(mediaSection);
            var kind = SDPUtils2.getKind(mediaSection);
            var rejected = SDPUtils2.isRejected(mediaSection) && SDPUtils2.matchPrefix(mediaSection, "a=bundle-only").length === 0;
            var protocol = lines[0].substr(2).split(" ")[2];
            var direction = SDPUtils2.getDirection(mediaSection, sessionpart);
            var remoteMsid = SDPUtils2.parseMsid(mediaSection);
            var mid = SDPUtils2.getMid(mediaSection) || SDPUtils2.generateIdentifier();
            if (rejected || kind === "application" && (protocol === "DTLS/SCTP" || protocol === "UDP/DTLS/SCTP")) {
              pc.transceivers[sdpMLineIndex] = {
                mid,
                kind,
                protocol,
                rejected: true
              };
              return;
            }
            if (!rejected && pc.transceivers[sdpMLineIndex] && pc.transceivers[sdpMLineIndex].rejected) {
              pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
            }
            var transceiver;
            var iceGatherer;
            var iceTransport;
            var dtlsTransport;
            var rtpReceiver;
            var sendEncodingParameters;
            var recvEncodingParameters;
            var localCapabilities;
            var track;
            var remoteCapabilities = SDPUtils2.parseRtpParameters(mediaSection);
            var remoteIceParameters;
            var remoteDtlsParameters;
            if (!rejected) {
              remoteIceParameters = SDPUtils2.getIceParameters(
                mediaSection,
                sessionpart
              );
              remoteDtlsParameters = SDPUtils2.getDtlsParameters(
                mediaSection,
                sessionpart
              );
              remoteDtlsParameters.role = "client";
            }
            recvEncodingParameters = SDPUtils2.parseRtpEncodingParameters(mediaSection);
            var rtcpParameters = SDPUtils2.parseRtcpParameters(mediaSection);
            var isComplete = SDPUtils2.matchPrefix(
              mediaSection,
              "a=end-of-candidates",
              sessionpart
            ).length > 0;
            var cands = SDPUtils2.matchPrefix(mediaSection, "a=candidate:").map(function(cand) {
              return SDPUtils2.parseCandidate(cand);
            }).filter(function(cand) {
              return cand.component === 1;
            });
            if ((description.type === "offer" || description.type === "answer") && !rejected && usingBundle && sdpMLineIndex > 0 && pc.transceivers[sdpMLineIndex]) {
              pc._disposeIceAndDtlsTransports(sdpMLineIndex);
              pc.transceivers[sdpMLineIndex].iceGatherer = pc.transceivers[0].iceGatherer;
              pc.transceivers[sdpMLineIndex].iceTransport = pc.transceivers[0].iceTransport;
              pc.transceivers[sdpMLineIndex].dtlsTransport = pc.transceivers[0].dtlsTransport;
              if (pc.transceivers[sdpMLineIndex].rtpSender) {
                pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
                  pc.transceivers[0].dtlsTransport
                );
              }
              if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
                pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
                  pc.transceivers[0].dtlsTransport
                );
              }
            }
            if (description.type === "offer" && !rejected) {
              transceiver = pc.transceivers[sdpMLineIndex] || pc._createTransceiver(kind);
              transceiver.mid = mid;
              if (!transceiver.iceGatherer) {
                transceiver.iceGatherer = pc._createIceGatherer(
                  sdpMLineIndex,
                  usingBundle
                );
              }
              if (cands.length && transceiver.iceTransport.state === "new") {
                if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
                  transceiver.iceTransport.setRemoteCandidates(cands);
                } else {
                  cands.forEach(function(candidate) {
                    maybeAddCandidate(transceiver.iceTransport, candidate);
                  });
                }
              }
              localCapabilities = window2.RTCRtpReceiver.getCapabilities(kind);
              if (edgeVersion < 15019) {
                localCapabilities.codecs = localCapabilities.codecs.filter(
                  function(codec) {
                    return codec.name !== "rtx";
                  }
                );
              }
              sendEncodingParameters = transceiver.sendEncodingParameters || [{
                ssrc: (2 * sdpMLineIndex + 2) * 1001
              }];
              var isNewTrack = false;
              if (direction === "sendrecv" || direction === "sendonly") {
                isNewTrack = !transceiver.rtpReceiver;
                rtpReceiver = transceiver.rtpReceiver || new window2.RTCRtpReceiver(transceiver.dtlsTransport, kind);
                if (isNewTrack) {
                  var stream;
                  track = rtpReceiver.track;
                  if (remoteMsid && remoteMsid.stream === "-") {
                  } else if (remoteMsid) {
                    if (!streams[remoteMsid.stream]) {
                      streams[remoteMsid.stream] = new window2.MediaStream();
                      Object.defineProperty(streams[remoteMsid.stream], "id", {
                        get: function() {
                          return remoteMsid.stream;
                        }
                      });
                    }
                    Object.defineProperty(track, "id", {
                      get: function() {
                        return remoteMsid.track;
                      }
                    });
                    stream = streams[remoteMsid.stream];
                  } else {
                    if (!streams.default) {
                      streams.default = new window2.MediaStream();
                    }
                    stream = streams.default;
                  }
                  if (stream) {
                    addTrackToStreamAndFireEvent(track, stream);
                    transceiver.associatedRemoteMediaStreams.push(stream);
                  }
                  receiverList.push([track, rtpReceiver, stream]);
                }
              } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
                transceiver.associatedRemoteMediaStreams.forEach(function(s) {
                  var nativeTrack = s.getTracks().find(function(t) {
                    return t.id === transceiver.rtpReceiver.track.id;
                  });
                  if (nativeTrack) {
                    removeTrackFromStreamAndFireEvent(nativeTrack, s);
                  }
                });
                transceiver.associatedRemoteMediaStreams = [];
              }
              transceiver.localCapabilities = localCapabilities;
              transceiver.remoteCapabilities = remoteCapabilities;
              transceiver.rtpReceiver = rtpReceiver;
              transceiver.rtcpParameters = rtcpParameters;
              transceiver.sendEncodingParameters = sendEncodingParameters;
              transceiver.recvEncodingParameters = recvEncodingParameters;
              pc._transceive(
                pc.transceivers[sdpMLineIndex],
                false,
                isNewTrack
              );
            } else if (description.type === "answer" && !rejected) {
              transceiver = pc.transceivers[sdpMLineIndex];
              iceGatherer = transceiver.iceGatherer;
              iceTransport = transceiver.iceTransport;
              dtlsTransport = transceiver.dtlsTransport;
              rtpReceiver = transceiver.rtpReceiver;
              sendEncodingParameters = transceiver.sendEncodingParameters;
              localCapabilities = transceiver.localCapabilities;
              pc.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
              pc.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
              pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;
              if (cands.length && iceTransport.state === "new") {
                if ((isIceLite || isComplete) && (!usingBundle || sdpMLineIndex === 0)) {
                  iceTransport.setRemoteCandidates(cands);
                } else {
                  cands.forEach(function(candidate) {
                    maybeAddCandidate(transceiver.iceTransport, candidate);
                  });
                }
              }
              if (!usingBundle || sdpMLineIndex === 0) {
                if (iceTransport.state === "new") {
                  iceTransport.start(
                    iceGatherer,
                    remoteIceParameters,
                    "controlling"
                  );
                }
                if (dtlsTransport.state === "new") {
                  dtlsTransport.start(remoteDtlsParameters);
                }
              }
              var commonCapabilities = getCommonCapabilities(
                transceiver.localCapabilities,
                transceiver.remoteCapabilities
              );
              var hasRtx = commonCapabilities.codecs.filter(function(c) {
                return c.name.toLowerCase() === "rtx";
              }).length;
              if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
                delete transceiver.sendEncodingParameters[0].rtx;
              }
              pc._transceive(
                transceiver,
                direction === "sendrecv" || direction === "recvonly",
                direction === "sendrecv" || direction === "sendonly"
              );
              if (rtpReceiver && (direction === "sendrecv" || direction === "sendonly")) {
                track = rtpReceiver.track;
                if (remoteMsid) {
                  if (!streams[remoteMsid.stream]) {
                    streams[remoteMsid.stream] = new window2.MediaStream();
                  }
                  addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
                  receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
                } else {
                  if (!streams.default) {
                    streams.default = new window2.MediaStream();
                  }
                  addTrackToStreamAndFireEvent(track, streams.default);
                  receiverList.push([track, rtpReceiver, streams.default]);
                }
              } else {
                delete transceiver.rtpReceiver;
              }
            }
          });
          if (pc._dtlsRole === void 0) {
            pc._dtlsRole = description.type === "offer" ? "active" : "passive";
          }
          pc._remoteDescription = {
            type: description.type,
            sdp: description.sdp
          };
          if (description.type === "offer") {
            pc._updateSignalingState("have-remote-offer");
          } else {
            pc._updateSignalingState("stable");
          }
          Object.keys(streams).forEach(function(sid) {
            var stream = streams[sid];
            if (stream.getTracks().length) {
              if (pc.remoteStreams.indexOf(stream) === -1) {
                pc.remoteStreams.push(stream);
                var event = new Event("addstream");
                event.stream = stream;
                window2.setTimeout(function() {
                  pc._dispatchEvent("addstream", event);
                });
              }
              receiverList.forEach(function(item) {
                var track = item[0];
                var receiver = item[1];
                if (stream.id !== item[2].id) {
                  return;
                }
                fireAddTrack(pc, track, receiver, [stream]);
              });
            }
          });
          receiverList.forEach(function(item) {
            if (item[2]) {
              return;
            }
            fireAddTrack(pc, item[0], item[1], []);
          });
          window2.setTimeout(function() {
            if (!(pc && pc.transceivers)) {
              return;
            }
            pc.transceivers.forEach(function(transceiver) {
              if (transceiver.iceTransport && transceiver.iceTransport.state === "new" && transceiver.iceTransport.getRemoteCandidates().length > 0) {
                console.warn("Timeout for addRemoteCandidate. Consider sending an end-of-candidates notification");
                transceiver.iceTransport.addRemoteCandidate({});
              }
            });
          }, 4e3);
          return Promise.resolve();
        };
        RTCPeerConnection2.prototype.close = function() {
          this.transceivers.forEach(function(transceiver) {
            if (transceiver.iceTransport) {
              transceiver.iceTransport.stop();
            }
            if (transceiver.dtlsTransport) {
              transceiver.dtlsTransport.stop();
            }
            if (transceiver.rtpSender) {
              transceiver.rtpSender.stop();
            }
            if (transceiver.rtpReceiver) {
              transceiver.rtpReceiver.stop();
            }
          });
          this._isClosed = true;
          this._updateSignalingState("closed");
        };
        RTCPeerConnection2.prototype._updateSignalingState = function(newState) {
          this.signalingState = newState;
          var event = new Event("signalingstatechange");
          this._dispatchEvent("signalingstatechange", event);
        };
        RTCPeerConnection2.prototype._maybeFireNegotiationNeeded = function() {
          var pc = this;
          if (this.signalingState !== "stable" || this.needNegotiation === true) {
            return;
          }
          this.needNegotiation = true;
          window2.setTimeout(function() {
            if (pc.needNegotiation) {
              pc.needNegotiation = false;
              var event = new Event("negotiationneeded");
              pc._dispatchEvent("negotiationneeded", event);
            }
          }, 0);
        };
        RTCPeerConnection2.prototype._updateIceConnectionState = function() {
          var newState;
          var states = {
            "new": 0,
            closed: 0,
            checking: 0,
            connected: 0,
            completed: 0,
            disconnected: 0,
            failed: 0
          };
          this.transceivers.forEach(function(transceiver) {
            if (transceiver.iceTransport && !transceiver.rejected) {
              states[transceiver.iceTransport.state]++;
            }
          });
          newState = "new";
          if (states.failed > 0) {
            newState = "failed";
          } else if (states.checking > 0) {
            newState = "checking";
          } else if (states.disconnected > 0) {
            newState = "disconnected";
          } else if (states.new > 0) {
            newState = "new";
          } else if (states.connected > 0) {
            newState = "connected";
          } else if (states.completed > 0) {
            newState = "completed";
          }
          if (newState !== this.iceConnectionState) {
            this.iceConnectionState = newState;
            var event = new Event("iceconnectionstatechange");
            this._dispatchEvent("iceconnectionstatechange", event);
          }
        };
        RTCPeerConnection2.prototype._updateConnectionState = function() {
          var newState;
          var states = {
            "new": 0,
            closed: 0,
            connecting: 0,
            connected: 0,
            completed: 0,
            disconnected: 0,
            failed: 0
          };
          this.transceivers.forEach(function(transceiver) {
            if (transceiver.iceTransport && transceiver.dtlsTransport && !transceiver.rejected) {
              states[transceiver.iceTransport.state]++;
              states[transceiver.dtlsTransport.state]++;
            }
          });
          states.connected += states.completed;
          newState = "new";
          if (states.failed > 0) {
            newState = "failed";
          } else if (states.connecting > 0) {
            newState = "connecting";
          } else if (states.disconnected > 0) {
            newState = "disconnected";
          } else if (states.new > 0) {
            newState = "new";
          } else if (states.connected > 0) {
            newState = "connected";
          }
          if (newState !== this.connectionState) {
            this.connectionState = newState;
            var event = new Event("connectionstatechange");
            this._dispatchEvent("connectionstatechange", event);
          }
        };
        RTCPeerConnection2.prototype.createOffer = function() {
          var pc = this;
          if (pc._isClosed) {
            return Promise.reject(makeError(
              "InvalidStateError",
              "Can not call createOffer after close"
            ));
          }
          var numAudioTracks = pc.transceivers.filter(function(t) {
            return t.kind === "audio";
          }).length;
          var numVideoTracks = pc.transceivers.filter(function(t) {
            return t.kind === "video";
          }).length;
          var offerOptions = arguments[0];
          if (offerOptions) {
            if (offerOptions.mandatory || offerOptions.optional) {
              throw new TypeError(
                "Legacy mandatory/optional constraints not supported."
              );
            }
            if (offerOptions.offerToReceiveAudio !== void 0) {
              if (offerOptions.offerToReceiveAudio === true) {
                numAudioTracks = 1;
              } else if (offerOptions.offerToReceiveAudio === false) {
                numAudioTracks = 0;
              } else {
                numAudioTracks = offerOptions.offerToReceiveAudio;
              }
            }
            if (offerOptions.offerToReceiveVideo !== void 0) {
              if (offerOptions.offerToReceiveVideo === true) {
                numVideoTracks = 1;
              } else if (offerOptions.offerToReceiveVideo === false) {
                numVideoTracks = 0;
              } else {
                numVideoTracks = offerOptions.offerToReceiveVideo;
              }
            }
          }
          pc.transceivers.forEach(function(transceiver) {
            if (transceiver.kind === "audio") {
              numAudioTracks--;
              if (numAudioTracks < 0) {
                transceiver.wantReceive = false;
              }
            } else if (transceiver.kind === "video") {
              numVideoTracks--;
              if (numVideoTracks < 0) {
                transceiver.wantReceive = false;
              }
            }
          });
          while (numAudioTracks > 0 || numVideoTracks > 0) {
            if (numAudioTracks > 0) {
              pc._createTransceiver("audio");
              numAudioTracks--;
            }
            if (numVideoTracks > 0) {
              pc._createTransceiver("video");
              numVideoTracks--;
            }
          }
          var sdp = SDPUtils2.writeSessionBoilerplate(
            pc._sdpSessionId,
            pc._sdpSessionVersion++
          );
          pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
            var track = transceiver.track;
            var kind = transceiver.kind;
            var mid = transceiver.mid || SDPUtils2.generateIdentifier();
            transceiver.mid = mid;
            if (!transceiver.iceGatherer) {
              transceiver.iceGatherer = pc._createIceGatherer(
                sdpMLineIndex,
                pc.usingBundle
              );
            }
            var localCapabilities = window2.RTCRtpSender.getCapabilities(kind);
            if (edgeVersion < 15019) {
              localCapabilities.codecs = localCapabilities.codecs.filter(
                function(codec) {
                  return codec.name !== "rtx";
                }
              );
            }
            localCapabilities.codecs.forEach(function(codec) {
              if (codec.name === "H264" && codec.parameters["level-asymmetry-allowed"] === void 0) {
                codec.parameters["level-asymmetry-allowed"] = "1";
              }
              if (transceiver.remoteCapabilities && transceiver.remoteCapabilities.codecs) {
                transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
                  if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() && codec.clockRate === remoteCodec.clockRate) {
                    codec.preferredPayloadType = remoteCodec.payloadType;
                  }
                });
              }
            });
            localCapabilities.headerExtensions.forEach(function(hdrExt) {
              var remoteExtensions = transceiver.remoteCapabilities && transceiver.remoteCapabilities.headerExtensions || [];
              remoteExtensions.forEach(function(rHdrExt) {
                if (hdrExt.uri === rHdrExt.uri) {
                  hdrExt.id = rHdrExt.id;
                }
              });
            });
            var sendEncodingParameters = transceiver.sendEncodingParameters || [{
              ssrc: (2 * sdpMLineIndex + 1) * 1001
            }];
            if (track) {
              if (edgeVersion >= 15019 && kind === "video" && !sendEncodingParameters[0].rtx) {
                sendEncodingParameters[0].rtx = {
                  ssrc: sendEncodingParameters[0].ssrc + 1
                };
              }
            }
            if (transceiver.wantReceive) {
              transceiver.rtpReceiver = new window2.RTCRtpReceiver(
                transceiver.dtlsTransport,
                kind
              );
            }
            transceiver.localCapabilities = localCapabilities;
            transceiver.sendEncodingParameters = sendEncodingParameters;
          });
          if (pc._config.bundlePolicy !== "max-compat") {
            sdp += "a=group:BUNDLE " + pc.transceivers.map(function(t) {
              return t.mid;
            }).join(" ") + "\r\n";
          }
          sdp += "a=ice-options:trickle\r\n";
          pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
            sdp += writeMediaSection(
              transceiver,
              transceiver.localCapabilities,
              "offer",
              transceiver.stream,
              pc._dtlsRole
            );
            sdp += "a=rtcp-rsize\r\n";
            if (transceiver.iceGatherer && pc.iceGatheringState !== "new" && (sdpMLineIndex === 0 || !pc.usingBundle)) {
              transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
                cand.component = 1;
                sdp += "a=" + SDPUtils2.writeCandidate(cand) + "\r\n";
              });
              if (transceiver.iceGatherer.state === "completed") {
                sdp += "a=end-of-candidates\r\n";
              }
            }
          });
          var desc = new window2.RTCSessionDescription({
            type: "offer",
            sdp
          });
          return Promise.resolve(desc);
        };
        RTCPeerConnection2.prototype.createAnswer = function() {
          var pc = this;
          if (pc._isClosed) {
            return Promise.reject(makeError(
              "InvalidStateError",
              "Can not call createAnswer after close"
            ));
          }
          if (!(pc.signalingState === "have-remote-offer" || pc.signalingState === "have-local-pranswer")) {
            return Promise.reject(makeError(
              "InvalidStateError",
              "Can not call createAnswer in signalingState " + pc.signalingState
            ));
          }
          var sdp = SDPUtils2.writeSessionBoilerplate(
            pc._sdpSessionId,
            pc._sdpSessionVersion++
          );
          if (pc.usingBundle) {
            sdp += "a=group:BUNDLE " + pc.transceivers.map(function(t) {
              return t.mid;
            }).join(" ") + "\r\n";
          }
          sdp += "a=ice-options:trickle\r\n";
          var mediaSectionsInOffer = SDPUtils2.getMediaSections(
            pc._remoteDescription.sdp
          ).length;
          pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
            if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
              return;
            }
            if (transceiver.rejected) {
              if (transceiver.kind === "application") {
                if (transceiver.protocol === "DTLS/SCTP") {
                  sdp += "m=application 0 DTLS/SCTP 5000\r\n";
                } else {
                  sdp += "m=application 0 " + transceiver.protocol + " webrtc-datachannel\r\n";
                }
              } else if (transceiver.kind === "audio") {
                sdp += "m=audio 0 UDP/TLS/RTP/SAVPF 0\r\na=rtpmap:0 PCMU/8000\r\n";
              } else if (transceiver.kind === "video") {
                sdp += "m=video 0 UDP/TLS/RTP/SAVPF 120\r\na=rtpmap:120 VP8/90000\r\n";
              }
              sdp += "c=IN IP4 0.0.0.0\r\na=inactive\r\na=mid:" + transceiver.mid + "\r\n";
              return;
            }
            if (transceiver.stream) {
              var localTrack;
              if (transceiver.kind === "audio") {
                localTrack = transceiver.stream.getAudioTracks()[0];
              } else if (transceiver.kind === "video") {
                localTrack = transceiver.stream.getVideoTracks()[0];
              }
              if (localTrack) {
                if (edgeVersion >= 15019 && transceiver.kind === "video" && !transceiver.sendEncodingParameters[0].rtx) {
                  transceiver.sendEncodingParameters[0].rtx = {
                    ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
                  };
                }
              }
            }
            var commonCapabilities = getCommonCapabilities(
              transceiver.localCapabilities,
              transceiver.remoteCapabilities
            );
            var hasRtx = commonCapabilities.codecs.filter(function(c) {
              return c.name.toLowerCase() === "rtx";
            }).length;
            if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
              delete transceiver.sendEncodingParameters[0].rtx;
            }
            sdp += writeMediaSection(
              transceiver,
              commonCapabilities,
              "answer",
              transceiver.stream,
              pc._dtlsRole
            );
            if (transceiver.rtcpParameters && transceiver.rtcpParameters.reducedSize) {
              sdp += "a=rtcp-rsize\r\n";
            }
          });
          var desc = new window2.RTCSessionDescription({
            type: "answer",
            sdp
          });
          return Promise.resolve(desc);
        };
        RTCPeerConnection2.prototype.addIceCandidate = function(candidate) {
          var pc = this;
          var sections;
          if (candidate && !(candidate.sdpMLineIndex !== void 0 || candidate.sdpMid)) {
            return Promise.reject(new TypeError("sdpMLineIndex or sdpMid required"));
          }
          return new Promise(function(resolve, reject) {
            if (!pc._remoteDescription) {
              return reject(makeError(
                "InvalidStateError",
                "Can not add ICE candidate without a remote description"
              ));
            } else if (!candidate || candidate.candidate === "") {
              for (var j = 0; j < pc.transceivers.length; j++) {
                if (pc.transceivers[j].rejected) {
                  continue;
                }
                pc.transceivers[j].iceTransport.addRemoteCandidate({});
                sections = SDPUtils2.getMediaSections(pc._remoteDescription.sdp);
                sections[j] += "a=end-of-candidates\r\n";
                pc._remoteDescription.sdp = SDPUtils2.getDescription(pc._remoteDescription.sdp) + sections.join("");
                if (pc.usingBundle) {
                  break;
                }
              }
            } else {
              var sdpMLineIndex = candidate.sdpMLineIndex;
              if (candidate.sdpMid) {
                for (var i = 0; i < pc.transceivers.length; i++) {
                  if (pc.transceivers[i].mid === candidate.sdpMid) {
                    sdpMLineIndex = i;
                    break;
                  }
                }
              }
              var transceiver = pc.transceivers[sdpMLineIndex];
              if (transceiver) {
                if (transceiver.rejected) {
                  return resolve();
                }
                var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils2.parseCandidate(candidate.candidate) : {};
                if (cand.protocol === "tcp" && (cand.port === 0 || cand.port === 9)) {
                  return resolve();
                }
                if (cand.component && cand.component !== 1) {
                  return resolve();
                }
                if (sdpMLineIndex === 0 || sdpMLineIndex > 0 && transceiver.iceTransport !== pc.transceivers[0].iceTransport) {
                  if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
                    return reject(makeError(
                      "OperationError",
                      "Can not add ICE candidate"
                    ));
                  }
                }
                var candidateString = candidate.candidate.trim();
                if (candidateString.indexOf("a=") === 0) {
                  candidateString = candidateString.substr(2);
                }
                sections = SDPUtils2.getMediaSections(pc._remoteDescription.sdp);
                sections[sdpMLineIndex] += "a=" + (cand.type ? candidateString : "end-of-candidates") + "\r\n";
                pc._remoteDescription.sdp = SDPUtils2.getDescription(pc._remoteDescription.sdp) + sections.join("");
              } else {
                return reject(makeError(
                  "OperationError",
                  "Can not add ICE candidate"
                ));
              }
            }
            resolve();
          });
        };
        RTCPeerConnection2.prototype.getStats = function(selector) {
          if (selector && selector instanceof window2.MediaStreamTrack) {
            var senderOrReceiver = null;
            this.transceivers.forEach(function(transceiver) {
              if (transceiver.rtpSender && transceiver.rtpSender.track === selector) {
                senderOrReceiver = transceiver.rtpSender;
              } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track === selector) {
                senderOrReceiver = transceiver.rtpReceiver;
              }
            });
            if (!senderOrReceiver) {
              throw makeError("InvalidAccessError", "Invalid selector.");
            }
            return senderOrReceiver.getStats();
          }
          var promises = [];
          this.transceivers.forEach(function(transceiver) {
            [
              "rtpSender",
              "rtpReceiver",
              "iceGatherer",
              "iceTransport",
              "dtlsTransport"
            ].forEach(function(method) {
              if (transceiver[method]) {
                promises.push(transceiver[method].getStats());
              }
            });
          });
          return Promise.all(promises).then(function(allStats) {
            var results = /* @__PURE__ */ new Map();
            allStats.forEach(function(stats) {
              stats.forEach(function(stat) {
                results.set(stat.id, stat);
              });
            });
            return results;
          });
        };
        var ortcObjects = [
          "RTCRtpSender",
          "RTCRtpReceiver",
          "RTCIceGatherer",
          "RTCIceTransport",
          "RTCDtlsTransport"
        ];
        ortcObjects.forEach(function(ortcObjectName) {
          var obj = window2[ortcObjectName];
          if (obj && obj.prototype && obj.prototype.getStats) {
            var nativeGetstats = obj.prototype.getStats;
            obj.prototype.getStats = function() {
              return nativeGetstats.apply(this).then(function(nativeStats) {
                var mapStats = /* @__PURE__ */ new Map();
                Object.keys(nativeStats).forEach(function(id) {
                  nativeStats[id].type = fixStatsType(nativeStats[id]);
                  mapStats.set(id, nativeStats[id]);
                });
                return mapStats;
              });
            };
          }
        });
        var methods = ["createOffer", "createAnswer"];
        methods.forEach(function(method) {
          var nativeMethod = RTCPeerConnection2.prototype[method];
          RTCPeerConnection2.prototype[method] = function() {
            var args = arguments;
            if (typeof args[0] === "function" || typeof args[1] === "function") {
              return nativeMethod.apply(this, [arguments[2]]).then(function(description) {
                if (typeof args[0] === "function") {
                  args[0].apply(null, [description]);
                }
              }, function(error) {
                if (typeof args[1] === "function") {
                  args[1].apply(null, [error]);
                }
              });
            }
            return nativeMethod.apply(this, arguments);
          };
        });
        methods = ["setLocalDescription", "setRemoteDescription", "addIceCandidate"];
        methods.forEach(function(method) {
          var nativeMethod = RTCPeerConnection2.prototype[method];
          RTCPeerConnection2.prototype[method] = function() {
            var args = arguments;
            if (typeof args[1] === "function" || typeof args[2] === "function") {
              return nativeMethod.apply(this, arguments).then(function() {
                if (typeof args[1] === "function") {
                  args[1].apply(null);
                }
              }, function(error) {
                if (typeof args[2] === "function") {
                  args[2].apply(null, [error]);
                }
              });
            }
            return nativeMethod.apply(this, arguments);
          };
        });
        ["getStats"].forEach(function(method) {
          var nativeMethod = RTCPeerConnection2.prototype[method];
          RTCPeerConnection2.prototype[method] = function() {
            var args = arguments;
            if (typeof args[1] === "function") {
              return nativeMethod.apply(this, arguments).then(function() {
                if (typeof args[1] === "function") {
                  args[1].apply(null);
                }
              });
            }
            return nativeMethod.apply(this, arguments);
          };
        });
        return RTCPeerConnection2;
      };
    }
  });

  // node_modules/ramda/es/internal/_isPlaceholder.js
  function _isPlaceholder(a) {
    return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
  }

  // node_modules/ramda/es/internal/_curry1.js
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  // node_modules/ramda/es/internal/_curry2.js
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
            return fn(a, _b);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
            return fn(_a, b);
          }) : _isPlaceholder(b) ? _curry1(function(_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }

  // node_modules/ramda/es/add.js
  var add = /* @__PURE__ */ _curry2(function add2(a, b) {
    return Number(a) + Number(b);
  });
  var add_default = add;

  // node_modules/ramda/es/internal/_arity.js
  function _arity(n, fn) {
    switch (n) {
      case 0:
        return function() {
          return fn.apply(this, arguments);
        };
      case 1:
        return function(a0) {
          return fn.apply(this, arguments);
        };
      case 2:
        return function(a0, a1) {
          return fn.apply(this, arguments);
        };
      case 3:
        return function(a0, a1, a2) {
          return fn.apply(this, arguments);
        };
      case 4:
        return function(a0, a1, a2, a3) {
          return fn.apply(this, arguments);
        };
      case 5:
        return function(a0, a1, a2, a3, a4) {
          return fn.apply(this, arguments);
        };
      case 6:
        return function(a0, a1, a2, a3, a4, a5) {
          return fn.apply(this, arguments);
        };
      case 7:
        return function(a0, a1, a2, a3, a4, a5, a6) {
          return fn.apply(this, arguments);
        };
      case 8:
        return function(a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.apply(this, arguments);
        };
      case 9:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.apply(this, arguments);
        };
      case 10:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.apply(this, arguments);
        };
      default:
        throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
    }
  }

  // node_modules/ramda/es/internal/_curryN.js
  function _curryN(length, received, fn) {
    return function() {
      var combined = [];
      var argsIdx = 0;
      var left = length;
      var combinedIdx = 0;
      while (combinedIdx < received.length || argsIdx < arguments.length) {
        var result;
        if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments[argsIdx];
          argsIdx += 1;
        }
        combined[combinedIdx] = result;
        if (!_isPlaceholder(result)) {
          left -= 1;
        }
        combinedIdx += 1;
      }
      return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
    };
  }

  // node_modules/ramda/es/curryN.js
  var curryN = /* @__PURE__ */ _curry2(function curryN2(length, fn) {
    if (length === 1) {
      return _curry1(fn);
    }
    return _arity(length, _curryN(length, [], fn));
  });
  var curryN_default = curryN;

  // node_modules/ramda/es/internal/_curry3.js
  function _curry3(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;
        case 1:
          return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          });
        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1(function(_c) {
            return fn(a, b, _c);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder(a) ? _curry1(function(_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder(b) ? _curry1(function(_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder(c) ? _curry1(function(_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }

  // node_modules/ramda/es/internal/_isArray.js
  var isArray_default = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
  };

  // node_modules/ramda/es/internal/_isTransformer.js
  function _isTransformer(obj) {
    return obj != null && typeof obj["@@transducer/step"] === "function";
  }

  // node_modules/ramda/es/internal/_dispatchable.js
  function _dispatchable(methodNames, transducerCreator, fn) {
    return function() {
      if (arguments.length === 0) {
        return fn();
      }
      var obj = arguments[arguments.length - 1];
      if (!isArray_default(obj)) {
        var idx = 0;
        while (idx < methodNames.length) {
          if (typeof obj[methodNames[idx]] === "function") {
            return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
          }
          idx += 1;
        }
        if (_isTransformer(obj)) {
          var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
          return transducer(obj);
        }
      }
      return fn.apply(this, arguments);
    };
  }

  // node_modules/ramda/es/internal/_reduced.js
  function _reduced(x) {
    return x && x["@@transducer/reduced"] ? x : {
      "@@transducer/value": x,
      "@@transducer/reduced": true
    };
  }

  // node_modules/ramda/es/internal/_xfBase.js
  var xfBase_default = {
    init: function() {
      return this.xf["@@transducer/init"]();
    },
    result: function(result) {
      return this.xf["@@transducer/result"](result);
    }
  };

  // node_modules/ramda/es/internal/_map.js
  function _map(fn, functor) {
    var idx = 0;
    var len = functor.length;
    var result = Array(len);
    while (idx < len) {
      result[idx] = fn(functor[idx]);
      idx += 1;
    }
    return result;
  }

  // node_modules/ramda/es/internal/_isString.js
  function _isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
  }

  // node_modules/ramda/es/internal/_isArrayLike.js
  var _isArrayLike = /* @__PURE__ */ _curry1(function isArrayLike(x) {
    if (isArray_default(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if (typeof x !== "object") {
      return false;
    }
    if (_isString(x)) {
      return false;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
  });
  var isArrayLike_default = _isArrayLike;

  // node_modules/ramda/es/internal/_xwrap.js
  var XWrap = /* @__PURE__ */ function() {
    function XWrap2(fn) {
      this.f = fn;
    }
    XWrap2.prototype["@@transducer/init"] = function() {
      throw new Error("init not implemented on XWrap");
    };
    XWrap2.prototype["@@transducer/result"] = function(acc) {
      return acc;
    };
    XWrap2.prototype["@@transducer/step"] = function(acc, x) {
      return this.f(acc, x);
    };
    return XWrap2;
  }();
  function _xwrap(fn) {
    return new XWrap(fn);
  }

  // node_modules/ramda/es/bind.js
  var bind = /* @__PURE__ */ _curry2(function bind2(fn, thisObj) {
    return _arity(fn.length, function() {
      return fn.apply(thisObj, arguments);
    });
  });
  var bind_default = bind;

  // node_modules/ramda/es/internal/_reduce.js
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf["@@transducer/step"](acc, list[idx]);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      idx += 1;
    }
    return xf["@@transducer/result"](acc);
  }
  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf["@@transducer/step"](acc, step.value);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      step = iter.next();
    }
    return xf["@@transducer/result"](acc);
  }
  function _methodReduce(xf, acc, obj, methodName) {
    return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
  }
  var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
  function _reduce(fn, acc, list) {
    if (typeof fn === "function") {
      fn = _xwrap(fn);
    }
    if (isArrayLike_default(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list["fantasy-land/reduce"] === "function") {
      return _methodReduce(fn, acc, list, "fantasy-land/reduce");
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === "function") {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === "function") {
      return _methodReduce(fn, acc, list, "reduce");
    }
    throw new TypeError("reduce: list must be array or iterable");
  }

  // node_modules/ramda/es/internal/_xmap.js
  var XMap = /* @__PURE__ */ function() {
    function XMap2(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XMap2.prototype["@@transducer/init"] = xfBase_default.init;
    XMap2.prototype["@@transducer/result"] = xfBase_default.result;
    XMap2.prototype["@@transducer/step"] = function(result, input) {
      return this.xf["@@transducer/step"](result, this.f(input));
    };
    return XMap2;
  }();
  var _xmap = /* @__PURE__ */ _curry2(function _xmap2(f, xf) {
    return new XMap(f, xf);
  });
  var xmap_default = _xmap;

  // node_modules/ramda/es/internal/_has.js
  function _has(prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  // node_modules/ramda/es/internal/_isArguments.js
  var toString = Object.prototype.toString;
  var _isArguments = /* @__PURE__ */ function() {
    return toString.call(arguments) === "[object Arguments]" ? function _isArguments2(x) {
      return toString.call(x) === "[object Arguments]";
    } : function _isArguments2(x) {
      return _has("callee", x);
    };
  }();
  var isArguments_default = _isArguments;

  // node_modules/ramda/es/keys.js
  var hasEnumBug = !/* @__PURE__ */ {
    toString: null
  }.propertyIsEnumerable("toString");
  var nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
  var hasArgsEnumBug = /* @__PURE__ */ function() {
    "use strict";
    return arguments.propertyIsEnumerable("length");
  }();
  var contains = function contains2(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };
  var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? /* @__PURE__ */ _curry1(function keys2(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) : /* @__PURE__ */ _curry1(function keys3(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    var prop, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && isArguments_default(obj);
    for (prop in obj) {
      if (_has(prop, obj) && (!checkArgsLength || prop !== "length")) {
        ks[ks.length] = prop;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;
      while (nIdx >= 0) {
        prop = nonEnumerableProps[nIdx];
        if (_has(prop, obj) && !contains(ks, prop)) {
          ks[ks.length] = prop;
        }
        nIdx -= 1;
      }
    }
    return ks;
  });
  var keys_default = keys;

  // node_modules/ramda/es/map.js
  var map = /* @__PURE__ */ _curry2(
    /* @__PURE__ */ _dispatchable(["fantasy-land/map", "map"], xmap_default, function map2(fn, functor) {
      switch (Object.prototype.toString.call(functor)) {
        case "[object Function]":
          return curryN_default(functor.length, function() {
            return fn.call(this, functor.apply(this, arguments));
          });
        case "[object Object]":
          return _reduce(function(acc, key) {
            acc[key] = fn(functor[key]);
            return acc;
          }, {}, keys_default(functor));
        default:
          return _map(fn, functor);
      }
    })
  );
  var map_default = map;

  // node_modules/ramda/es/internal/_isInteger.js
  var isInteger_default = Number.isInteger || function _isInteger(n) {
    return n << 0 === n;
  };

  // node_modules/ramda/es/reduce.js
  var reduce = /* @__PURE__ */ _curry3(_reduce);
  var reduce_default = reduce;

  // node_modules/ramda/es/values.js
  var values = /* @__PURE__ */ _curry1(function values2(obj) {
    var props = keys_default(obj);
    var len = props.length;
    var vals = [];
    var idx = 0;
    while (idx < len) {
      vals[idx] = obj[props[idx]];
      idx += 1;
    }
    return vals;
  });
  var values_default = values;

  // node_modules/ramda/es/internal/_assoc.js
  function _assoc(prop, val, obj) {
    if (isInteger_default(prop) && isArray_default(obj)) {
      var arr = [].concat(obj);
      arr[prop] = val;
      return arr;
    }
    var result = {};
    for (var p in obj) {
      result[p] = obj[p];
    }
    result[prop] = val;
    return result;
  }

  // node_modules/ramda/es/isNil.js
  var isNil = /* @__PURE__ */ _curry1(function isNil2(x) {
    return x == null;
  });
  var isNil_default = isNil;

  // node_modules/ramda/es/assocPath.js
  var assocPath = /* @__PURE__ */ _curry3(function assocPath2(path, val, obj) {
    if (path.length === 0) {
      return val;
    }
    var idx = path[0];
    if (path.length > 1) {
      var nextObj = !isNil_default(obj) && _has(idx, obj) ? obj[idx] : isInteger_default(path[1]) ? [] : {};
      val = assocPath2(Array.prototype.slice.call(path, 1), val, nextObj);
    }
    return _assoc(idx, val, obj);
  });
  var assocPath_default = assocPath;

  // node_modules/ramda/es/assoc.js
  var assoc = /* @__PURE__ */ _curry3(function assoc2(prop, val, obj) {
    return assocPath_default([prop], val, obj);
  });
  var assoc_default = assoc;

  // node_modules/ramda/es/internal/_cloneRegExp.js
  function _cloneRegExp(pattern) {
    return new RegExp(pattern.source, (pattern.global ? "g" : "") + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : "") + (pattern.sticky ? "y" : "") + (pattern.unicode ? "u" : ""));
  }

  // node_modules/ramda/es/type.js
  var type = /* @__PURE__ */ _curry1(function type2(val) {
    return val === null ? "Null" : val === void 0 ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
  });
  var type_default = type;

  // node_modules/ramda/es/internal/_clone.js
  function _clone(value, refFrom, refTo, deep) {
    var copy = function copy2(copiedValue) {
      var len = refFrom.length;
      var idx = 0;
      while (idx < len) {
        if (value === refFrom[idx]) {
          return refTo[idx];
        }
        idx += 1;
      }
      refFrom[idx] = value;
      refTo[idx] = copiedValue;
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
        }
      }
      return copiedValue;
    };
    switch (type_default(value)) {
      case "Object":
        return copy(Object.create(Object.getPrototypeOf(value)));
      case "Array":
        return copy([]);
      case "Date":
        return new Date(value.valueOf());
      case "RegExp":
        return _cloneRegExp(value);
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array":
        return value.slice();
      default:
        return value;
    }
  }

  // node_modules/ramda/es/internal/_checkForMethod.js
  function _checkForMethod(methodname, fn) {
    return function() {
      var length = arguments.length;
      if (length === 0) {
        return fn();
      }
      var obj = arguments[length - 1];
      return isArray_default(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
    };
  }

  // node_modules/ramda/es/internal/_toISOString.js
  var pad = function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  };
  var _toISOString = typeof Date.prototype.toISOString === "function" ? function _toISOString2(d) {
    return d.toISOString();
  } : function _toISOString3(d) {
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "." + (d.getUTCMilliseconds() / 1e3).toFixed(3).slice(2, 5) + "Z";
  };

  // node_modules/ramda/es/internal/_xreduceBy.js
  var XReduceBy = /* @__PURE__ */ function() {
    function XReduceBy2(valueFn, valueAcc, keyFn, xf) {
      this.valueFn = valueFn;
      this.valueAcc = valueAcc;
      this.keyFn = keyFn;
      this.xf = xf;
      this.inputs = {};
    }
    XReduceBy2.prototype["@@transducer/init"] = xfBase_default.init;
    XReduceBy2.prototype["@@transducer/result"] = function(result) {
      var key;
      for (key in this.inputs) {
        if (_has(key, this.inputs)) {
          result = this.xf["@@transducer/step"](result, this.inputs[key]);
          if (result["@@transducer/reduced"]) {
            result = result["@@transducer/value"];
            break;
          }
        }
      }
      this.inputs = null;
      return this.xf["@@transducer/result"](result);
    };
    XReduceBy2.prototype["@@transducer/step"] = function(result, input) {
      var key = this.keyFn(input);
      this.inputs[key] = this.inputs[key] || [key, this.valueAcc];
      this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
      return result;
    };
    return XReduceBy2;
  }();
  var _xreduceBy = /* @__PURE__ */ _curryN(4, [], function _xreduceBy2(valueFn, valueAcc, keyFn, xf) {
    return new XReduceBy(valueFn, valueAcc, keyFn, xf);
  });
  var xreduceBy_default = _xreduceBy;

  // node_modules/ramda/es/reduceBy.js
  var reduceBy = /* @__PURE__ */ _curryN(
    4,
    [],
    /* @__PURE__ */ _dispatchable([], xreduceBy_default, function reduceBy2(valueFn, valueAcc, keyFn, list) {
      return _reduce(function(acc, elt) {
        var key = keyFn(elt);
        var value = valueFn(_has(key, acc) ? acc[key] : _clone(valueAcc, [], [], false), elt);
        if (value && value["@@transducer/reduced"]) {
          return _reduced(acc);
        }
        acc[key] = value;
        return acc;
      }, {}, list);
    })
  );
  var reduceBy_default = reduceBy;

  // node_modules/ramda/es/remove.js
  var remove = /* @__PURE__ */ _curry3(function remove2(start, count, list) {
    var result = Array.prototype.slice.call(list, 0);
    result.splice(start, count);
    return result;
  });
  var remove_default = remove;

  // node_modules/ramda/es/internal/_dissoc.js
  function _dissoc(prop, obj) {
    if (obj == null) {
      return obj;
    }
    if (isInteger_default(prop) && isArray_default(obj)) {
      return remove_default(prop, 1, obj);
    }
    var result = {};
    for (var p in obj) {
      result[p] = obj[p];
    }
    delete result[prop];
    return result;
  }

  // node_modules/ramda/es/dissocPath.js
  function _shallowCloneObject(prop, obj) {
    if (isInteger_default(prop) && isArray_default(obj)) {
      return [].concat(obj);
    }
    var result = {};
    for (var p in obj) {
      result[p] = obj[p];
    }
    return result;
  }
  var dissocPath = /* @__PURE__ */ _curry2(function dissocPath2(path, obj) {
    if (obj == null) {
      return obj;
    }
    switch (path.length) {
      case 0:
        return obj;
      case 1:
        return _dissoc(path[0], obj);
      default:
        var head = path[0];
        var tail = Array.prototype.slice.call(path, 1);
        if (obj[head] == null) {
          return _shallowCloneObject(head, obj);
        } else {
          return assoc_default(head, dissocPath2(tail, obj[head]), obj);
        }
    }
  });
  var dissocPath_default = dissocPath;

  // node_modules/ramda/es/dissoc.js
  var dissoc = /* @__PURE__ */ _curry2(function dissoc2(prop, obj) {
    return dissocPath_default([prop], obj);
  });
  var dissoc_default = dissoc;

  // node_modules/ramda/es/forEach.js
  var forEach = /* @__PURE__ */ _curry2(
    /* @__PURE__ */ _checkForMethod("forEach", function forEach2(fn, list) {
      var len = list.length;
      var idx = 0;
      while (idx < len) {
        fn(list[idx]);
        idx += 1;
      }
      return list;
    })
  );
  var forEach_default = forEach;

  // node_modules/ramda/es/groupBy.js
  var groupBy = /* @__PURE__ */ _curry2(
    /* @__PURE__ */ _checkForMethod(
      "groupBy",
      /* @__PURE__ */ reduceBy_default(function(acc, item) {
        acc.push(item);
        return acc;
      }, [])
    )
  );
  var groupBy_default = groupBy;

  // node_modules/ramda/es/mapAccum.js
  var mapAccum = /* @__PURE__ */ _curry3(function mapAccum2(fn, acc, list) {
    var idx = 0;
    var len = list.length;
    var result = [];
    var tuple = [acc];
    while (idx < len) {
      tuple = fn(tuple[0], list[idx]);
      result[idx] = tuple[1];
      idx += 1;
    }
    return [tuple[0], result];
  });
  var mapAccum_default = mapAccum;

  // node_modules/ramda/es/mapObjIndexed.js
  var mapObjIndexed = /* @__PURE__ */ _curry2(function mapObjIndexed2(fn, obj) {
    return _reduce(function(acc, key) {
      acc[key] = fn(obj[key], key, obj);
      return acc;
    }, {}, keys_default(obj));
  });
  var mapObjIndexed_default = mapObjIndexed;

  // node_modules/ramda/es/sum.js
  var sum = /* @__PURE__ */ reduce_default(add_default, 0);
  var sum_default = sum;

  // node_modules/ramda/es/omit.js
  var omit = /* @__PURE__ */ _curry2(function omit2(names, obj) {
    var result = {};
    var index = {};
    var idx = 0;
    var len = names.length;
    while (idx < len) {
      index[names[idx]] = 1;
      idx += 1;
    }
    for (var prop in obj) {
      if (!index.hasOwnProperty(prop)) {
        result[prop] = obj[prop];
      }
    }
    return result;
  });
  var omit_default = omit;

  // node_modules/ramda/es/trim.js
  var hasProtoTrim = typeof String.prototype.trim === "function";

  // node_modules/peerjs/dist/bundler.mjs
  var import_peerjs_js_binarypack = __toESM(require_binarypack(), 1);

  // node_modules/webrtc-adapter/src/js/utils.js
  var logDisabled_ = true;
  var deprecationWarnings_ = true;
  function extractVersion(uastring, expr, pos) {
    const match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  }
  function wrapPeerConnectionEvent(window2, eventNameToWrap, wrapper) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    const proto = window2.RTCPeerConnection.prototype;
    const nativeAddEventListener = proto.addEventListener;
    proto.addEventListener = function(nativeEventName, cb) {
      if (nativeEventName !== eventNameToWrap) {
        return nativeAddEventListener.apply(this, arguments);
      }
      const wrappedCallback = (e) => {
        const modifiedEvent = wrapper(e);
        if (modifiedEvent) {
          if (cb.handleEvent) {
            cb.handleEvent(modifiedEvent);
          } else {
            cb(modifiedEvent);
          }
        }
      };
      this._eventMap = this._eventMap || {};
      if (!this._eventMap[eventNameToWrap]) {
        this._eventMap[eventNameToWrap] = /* @__PURE__ */ new Map();
      }
      this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
      return nativeAddEventListener.apply(this, [
        nativeEventName,
        wrappedCallback
      ]);
    };
    const nativeRemoveEventListener = proto.removeEventListener;
    proto.removeEventListener = function(nativeEventName, cb) {
      if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      if (!this._eventMap[eventNameToWrap].has(cb)) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
      this._eventMap[eventNameToWrap].delete(cb);
      if (this._eventMap[eventNameToWrap].size === 0) {
        delete this._eventMap[eventNameToWrap];
      }
      if (Object.keys(this._eventMap).length === 0) {
        delete this._eventMap;
      }
      return nativeRemoveEventListener.apply(this, [
        nativeEventName,
        unwrappedCb
      ]);
    };
    Object.defineProperty(proto, "on" + eventNameToWrap, {
      get() {
        return this["_on" + eventNameToWrap];
      },
      set(cb) {
        if (this["_on" + eventNameToWrap]) {
          this.removeEventListener(
            eventNameToWrap,
            this["_on" + eventNameToWrap]
          );
          delete this["_on" + eventNameToWrap];
        }
        if (cb) {
          this.addEventListener(
            eventNameToWrap,
            this["_on" + eventNameToWrap] = cb
          );
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  function disableLog(bool) {
    if (typeof bool !== "boolean") {
      return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
    }
    logDisabled_ = bool;
    return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
  }
  function disableWarnings(bool) {
    if (typeof bool !== "boolean") {
      return new Error("Argument type: " + typeof bool + ". Please use a boolean.");
    }
    deprecationWarnings_ = !bool;
    return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
  }
  function log() {
    if (typeof window === "object") {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== "undefined" && typeof console.log === "function") {
        console.log.apply(console, arguments);
      }
    }
  }
  function deprecated(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
  }
  function detectBrowser(window2) {
    const result = { browser: null, version: null };
    if (typeof window2 === "undefined" || !window2.navigator) {
      result.browser = "Not a browser.";
      return result;
    }
    const { navigator: navigator2 } = window2;
    if (navigator2.mozGetUserMedia) {
      result.browser = "firefox";
      result.version = extractVersion(
        navigator2.userAgent,
        /Firefox\/(\d+)\./,
        1
      );
    } else if (navigator2.webkitGetUserMedia || window2.isSecureContext === false && window2.webkitRTCPeerConnection && !window2.RTCIceGatherer) {
      result.browser = "chrome";
      result.version = extractVersion(
        navigator2.userAgent,
        /Chrom(e|ium)\/(\d+)\./,
        2
      );
    } else if (navigator2.mediaDevices && navigator2.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
      result.browser = "edge";
      result.version = extractVersion(
        navigator2.userAgent,
        /Edge\/(\d+).(\d+)$/,
        2
      );
    } else if (window2.RTCPeerConnection && navigator2.userAgent.match(/AppleWebKit\/(\d+)\./)) {
      result.browser = "safari";
      result.version = extractVersion(
        navigator2.userAgent,
        /AppleWebKit\/(\d+)\./,
        1
      );
      result.supportsUnifiedPlan = window2.RTCRtpTransceiver && "currentDirection" in window2.RTCRtpTransceiver.prototype;
    } else {
      result.browser = "Not a supported browser.";
      return result;
    }
    return result;
  }
  function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
  }
  function compactObject(data) {
    if (!isObject(data)) {
      return data;
    }
    return Object.keys(data).reduce(function(accumulator, key) {
      const isObj = isObject(data[key]);
      const value = isObj ? compactObject(data[key]) : data[key];
      const isEmptyObject = isObj && !Object.keys(value).length;
      if (value === void 0 || isEmptyObject) {
        return accumulator;
      }
      return Object.assign(accumulator, { [key]: value });
    }, {});
  }
  function walkStats(stats, base, resultSet) {
    if (!base || resultSet.has(base.id)) {
      return;
    }
    resultSet.set(base.id, base);
    Object.keys(base).forEach((name) => {
      if (name.endsWith("Id")) {
        walkStats(stats, stats.get(base[name]), resultSet);
      } else if (name.endsWith("Ids")) {
        base[name].forEach((id) => {
          walkStats(stats, stats.get(id), resultSet);
        });
      }
    });
  }
  function filterStats(result, track, outbound) {
    const streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
    const filteredResult = /* @__PURE__ */ new Map();
    if (track === null) {
      return filteredResult;
    }
    const trackStats = [];
    result.forEach((value) => {
      if (value.type === "track" && value.trackIdentifier === track.id) {
        trackStats.push(value);
      }
    });
    trackStats.forEach((trackStat) => {
      result.forEach((stats) => {
        if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
          walkStats(result, stats, filteredResult);
        }
      });
    });
    return filteredResult;
  }

  // node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
  var chrome_shim_exports = {};
  __export(chrome_shim_exports, {
    fixNegotiationNeeded: () => fixNegotiationNeeded,
    shimAddTrackRemoveTrack: () => shimAddTrackRemoveTrack,
    shimAddTrackRemoveTrackWithNative: () => shimAddTrackRemoveTrackWithNative,
    shimGetDisplayMedia: () => shimGetDisplayMedia,
    shimGetSendersWithDtmf: () => shimGetSendersWithDtmf,
    shimGetStats: () => shimGetStats,
    shimGetUserMedia: () => shimGetUserMedia,
    shimMediaStream: () => shimMediaStream,
    shimOnTrack: () => shimOnTrack,
    shimPeerConnection: () => shimPeerConnection,
    shimSenderReceiverGetStats: () => shimSenderReceiverGetStats
  });

  // node_modules/webrtc-adapter/src/js/chrome/getusermedia.js
  var logging = log;
  function shimGetUserMedia(window2, browserDetails) {
    const navigator2 = window2 && window2.navigator;
    if (!navigator2.mediaDevices) {
      return;
    }
    const constraintsToChrome_ = function(c) {
      if (typeof c !== "object" || c.mandatory || c.optional) {
        return c;
      }
      const cc = {};
      Object.keys(c).forEach((key) => {
        if (key === "require" || key === "advanced" || key === "mediaSource") {
          return;
        }
        const r = typeof c[key] === "object" ? c[key] : { ideal: c[key] };
        if (r.exact !== void 0 && typeof r.exact === "number") {
          r.min = r.max = r.exact;
        }
        const oldname_ = function(prefix, name) {
          if (prefix) {
            return prefix + name.charAt(0).toUpperCase() + name.slice(1);
          }
          return name === "deviceId" ? "sourceId" : name;
        };
        if (r.ideal !== void 0) {
          cc.optional = cc.optional || [];
          let oc = {};
          if (typeof r.ideal === "number") {
            oc[oldname_("min", key)] = r.ideal;
            cc.optional.push(oc);
            oc = {};
            oc[oldname_("max", key)] = r.ideal;
            cc.optional.push(oc);
          } else {
            oc[oldname_("", key)] = r.ideal;
            cc.optional.push(oc);
          }
        }
        if (r.exact !== void 0 && typeof r.exact !== "number") {
          cc.mandatory = cc.mandatory || {};
          cc.mandatory[oldname_("", key)] = r.exact;
        } else {
          ["min", "max"].forEach((mix) => {
            if (r[mix] !== void 0) {
              cc.mandatory = cc.mandatory || {};
              cc.mandatory[oldname_(mix, key)] = r[mix];
            }
          });
        }
      });
      if (c.advanced) {
        cc.optional = (cc.optional || []).concat(c.advanced);
      }
      return cc;
    };
    const shimConstraints_ = function(constraints, func) {
      if (browserDetails.version >= 61) {
        return func(constraints);
      }
      constraints = JSON.parse(JSON.stringify(constraints));
      if (constraints && typeof constraints.audio === "object") {
        const remap = function(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };
        constraints = JSON.parse(JSON.stringify(constraints));
        remap(constraints.audio, "autoGainControl", "googAutoGainControl");
        remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
        constraints.audio = constraintsToChrome_(constraints.audio);
      }
      if (constraints && typeof constraints.video === "object") {
        let face = constraints.video.facingMode;
        face = face && (typeof face === "object" ? face : { ideal: face });
        const getSupportedFacingModeLies = browserDetails.version < 66;
        if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator2.mediaDevices.getSupportedConstraints && navigator2.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
          delete constraints.video.facingMode;
          let matches;
          if (face.exact === "environment" || face.ideal === "environment") {
            matches = ["back", "rear"];
          } else if (face.exact === "user" || face.ideal === "user") {
            matches = ["front"];
          }
          if (matches) {
            return navigator2.mediaDevices.enumerateDevices().then((devices) => {
              devices = devices.filter((d) => d.kind === "videoinput");
              let dev = devices.find((d) => matches.some((match) => d.label.toLowerCase().includes(match)));
              if (!dev && devices.length && matches.includes("back")) {
                dev = devices[devices.length - 1];
              }
              if (dev) {
                constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
              }
              constraints.video = constraintsToChrome_(constraints.video);
              logging("chrome: " + JSON.stringify(constraints));
              return func(constraints);
            });
          }
        }
        constraints.video = constraintsToChrome_(constraints.video);
      }
      logging("chrome: " + JSON.stringify(constraints));
      return func(constraints);
    };
    const shimError_ = function(e) {
      if (browserDetails.version >= 64) {
        return e;
      }
      return {
        name: {
          PermissionDeniedError: "NotAllowedError",
          PermissionDismissedError: "NotAllowedError",
          InvalidStateError: "NotAllowedError",
          DevicesNotFoundError: "NotFoundError",
          ConstraintNotSatisfiedError: "OverconstrainedError",
          TrackStartError: "NotReadableError",
          MediaDeviceFailedDueToShutdown: "NotAllowedError",
          MediaDeviceKillSwitchOn: "NotAllowedError",
          TabCaptureError: "AbortError",
          ScreenCaptureError: "AbortError",
          DeviceCaptureError: "AbortError"
        }[e.name] || e.name,
        message: e.message,
        constraint: e.constraint || e.constraintName,
        toString() {
          return this.name + (this.message && ": ") + this.message;
        }
      };
    };
    const getUserMedia_ = function(constraints, onSuccess, onError) {
      shimConstraints_(constraints, (c) => {
        navigator2.webkitGetUserMedia(c, onSuccess, (e) => {
          if (onError) {
            onError(shimError_(e));
          }
        });
      });
    };
    navigator2.getUserMedia = getUserMedia_.bind(navigator2);
    if (navigator2.mediaDevices.getUserMedia) {
      const origGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
      navigator2.mediaDevices.getUserMedia = function(cs) {
        return shimConstraints_(cs, (c) => origGetUserMedia(c).then((stream) => {
          if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach((track) => {
              track.stop();
            });
            throw new DOMException("", "NotFoundError");
          }
          return stream;
        }, (e) => Promise.reject(shimError_(e))));
      };
    }
  }

  // node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js
  function shimGetDisplayMedia(window2, getSourceId) {
    if (window2.navigator.mediaDevices && "getDisplayMedia" in window2.navigator.mediaDevices) {
      return;
    }
    if (!window2.navigator.mediaDevices) {
      return;
    }
    if (typeof getSourceId !== "function") {
      console.error("shimGetDisplayMedia: getSourceId argument is not a function");
      return;
    }
    window2.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
      return getSourceId(constraints).then((sourceId) => {
        const widthSpecified = constraints.video && constraints.video.width;
        const heightSpecified = constraints.video && constraints.video.height;
        const frameRateSpecified = constraints.video && constraints.video.frameRate;
        constraints.video = {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,
            maxFrameRate: frameRateSpecified || 3
          }
        };
        if (widthSpecified) {
          constraints.video.mandatory.maxWidth = widthSpecified;
        }
        if (heightSpecified) {
          constraints.video.mandatory.maxHeight = heightSpecified;
        }
        return window2.navigator.mediaDevices.getUserMedia(constraints);
      });
    };
  }

  // node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
  function shimMediaStream(window2) {
    window2.MediaStream = window2.MediaStream || window2.webkitMediaStream;
  }
  function shimOnTrack(window2) {
    if (typeof window2 === "object" && window2.RTCPeerConnection && !("ontrack" in window2.RTCPeerConnection.prototype)) {
      Object.defineProperty(window2.RTCPeerConnection.prototype, "ontrack", {
        get() {
          return this._ontrack;
        },
        set(f) {
          if (this._ontrack) {
            this.removeEventListener("track", this._ontrack);
          }
          this.addEventListener("track", this._ontrack = f);
        },
        enumerable: true,
        configurable: true
      });
      const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
      window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        if (!this._ontrackpoly) {
          this._ontrackpoly = (e) => {
            e.stream.addEventListener("addtrack", (te) => {
              let receiver;
              if (window2.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers().find((r) => r.track && r.track.id === te.track.id);
              } else {
                receiver = { track: te.track };
              }
              const event = new Event("track");
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = { receiver };
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
            e.stream.getTracks().forEach((track) => {
              let receiver;
              if (window2.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers().find((r) => r.track && r.track.id === track.id);
              } else {
                receiver = { track };
              }
              const event = new Event("track");
              event.track = track;
              event.receiver = receiver;
              event.transceiver = { receiver };
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
          };
          this.addEventListener("addstream", this._ontrackpoly);
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
    } else {
      wrapPeerConnectionEvent(window2, "track", (e) => {
        if (!e.transceiver) {
          Object.defineProperty(
            e,
            "transceiver",
            { value: { receiver: e.receiver } }
          );
        }
        return e;
      });
    }
  }
  function shimGetSendersWithDtmf(window2) {
    if (typeof window2 === "object" && window2.RTCPeerConnection && !("getSenders" in window2.RTCPeerConnection.prototype) && "createDTMFSender" in window2.RTCPeerConnection.prototype) {
      const shimSenderWithDtmf = function(pc, track) {
        return {
          track,
          get dtmf() {
            if (this._dtmf === void 0) {
              if (track.kind === "audio") {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          },
          _pc: pc
        };
      };
      if (!window2.RTCPeerConnection.prototype.getSenders) {
        window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
          this._senders = this._senders || [];
          return this._senders.slice();
        };
        const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
        window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
          let sender = origAddTrack.apply(this, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(this, track);
            this._senders.push(sender);
          }
          return sender;
        };
        const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
        window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
          origRemoveTrack.apply(this, arguments);
          const idx = this._senders.indexOf(sender);
          if (idx !== -1) {
            this._senders.splice(idx, 1);
          }
        };
      }
      const origAddStream = window2.RTCPeerConnection.prototype.addStream;
      window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._senders = this._senders || [];
        origAddStream.apply(this, [stream]);
        stream.getTracks().forEach((track) => {
          this._senders.push(shimSenderWithDtmf(this, track));
        });
      };
      const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
      window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._senders = this._senders || [];
        origRemoveStream.apply(this, [stream]);
        stream.getTracks().forEach((track) => {
          const sender = this._senders.find((s) => s.track === track);
          if (sender) {
            this._senders.splice(this._senders.indexOf(sender), 1);
          }
        });
      };
    } else if (typeof window2 === "object" && window2.RTCPeerConnection && "getSenders" in window2.RTCPeerConnection.prototype && "createDTMFSender" in window2.RTCPeerConnection.prototype && window2.RTCRtpSender && !("dtmf" in window2.RTCRtpSender.prototype)) {
      const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach((sender) => sender._pc = this);
        return senders;
      };
      Object.defineProperty(window2.RTCRtpSender.prototype, "dtmf", {
        get() {
          if (this._dtmf === void 0) {
            if (this.track.kind === "audio") {
              this._dtmf = this._pc.createDTMFSender(this.track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
  }
  function shimGetStats(window2) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    const origGetStats = window2.RTCPeerConnection.prototype.getStats;
    window2.RTCPeerConnection.prototype.getStats = function getStats() {
      const [selector, onSucc, onErr] = arguments;
      if (arguments.length > 0 && typeof selector === "function") {
        return origGetStats.apply(this, arguments);
      }
      if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== "function")) {
        return origGetStats.apply(this, []);
      }
      const fixChromeStats_ = function(response) {
        const standardReport = {};
        const reports = response.result();
        reports.forEach((report) => {
          const standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: {
              localcandidate: "local-candidate",
              remotecandidate: "remote-candidate"
            }[report.type] || report.type
          };
          report.names().forEach((name) => {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });
        return standardReport;
      };
      const makeMapStats = function(stats) {
        return new Map(Object.keys(stats).map((key) => [key, stats[key]]));
      };
      if (arguments.length >= 2) {
        const successCallbackWrapper_ = function(response) {
          onSucc(makeMapStats(fixChromeStats_(response)));
        };
        return origGetStats.apply(this, [
          successCallbackWrapper_,
          selector
        ]);
      }
      return new Promise((resolve, reject) => {
        origGetStats.apply(this, [
          function(response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          },
          reject
        ]);
      }).then(onSucc, onErr);
    };
  }
  function shimSenderReceiverGetStats(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender && window2.RTCRtpReceiver)) {
      return;
    }
    if (!("getStats" in window2.RTCRtpSender.prototype)) {
      const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
          const senders = origGetSenders.apply(this, []);
          senders.forEach((sender) => sender._pc = this);
          return senders;
        };
      }
      const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
          const sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window2.RTCRtpSender.prototype.getStats = function getStats() {
        const sender = this;
        return this._pc.getStats().then((result) => filterStats(result, sender.track, true));
      };
    }
    if (!("getStats" in window2.RTCRtpReceiver.prototype)) {
      const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach((receiver) => receiver._pc = this);
          return receivers;
        };
      }
      wrapPeerConnectionEvent(window2, "track", (e) => {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window2.RTCRtpReceiver.prototype.getStats = function getStats() {
        const receiver = this;
        return this._pc.getStats().then((result) => filterStats(result, receiver.track, false));
      };
    }
    if (!("getStats" in window2.RTCRtpSender.prototype && "getStats" in window2.RTCRtpReceiver.prototype)) {
      return;
    }
    const origGetStats = window2.RTCPeerConnection.prototype.getStats;
    window2.RTCPeerConnection.prototype.getStats = function getStats() {
      if (arguments.length > 0 && arguments[0] instanceof window2.MediaStreamTrack) {
        const track = arguments[0];
        let sender;
        let receiver;
        let err;
        this.getSenders().forEach((s) => {
          if (s.track === track) {
            if (sender) {
              err = true;
            } else {
              sender = s;
            }
          }
        });
        this.getReceivers().forEach((r) => {
          if (r.track === track) {
            if (receiver) {
              err = true;
            } else {
              receiver = r;
            }
          }
          return r.track === track;
        });
        if (err || sender && receiver) {
          return Promise.reject(new DOMException(
            "There are more than one sender or receiver for the track.",
            "InvalidAccessError"
          ));
        } else if (sender) {
          return sender.getStats();
        } else if (receiver) {
          return receiver.getStats();
        }
        return Promise.reject(new DOMException(
          "There is no sender or receiver for the track.",
          "InvalidAccessError"
        ));
      }
      return origGetStats.apply(this, arguments);
    };
  }
  function shimAddTrackRemoveTrackWithNative(window2) {
    window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams).map((streamId) => this._shimmedLocalStreams[streamId][0]);
    };
    const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
    window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      const sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };
    const origAddStream = window2.RTCPeerConnection.prototype.addStream;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      stream.getTracks().forEach((track) => {
        const alreadyExists = this.getSenders().find((s) => s.track === track);
        if (alreadyExists) {
          throw new DOMException(
            "Track already exists.",
            "InvalidAccessError"
          );
        }
      });
      const existingSenders = this.getSenders();
      origAddStream.apply(this, arguments);
      const newSenders = this.getSenders().filter((newSender) => existingSenders.indexOf(newSender) === -1);
      this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
    };
    const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };
    const origRemoveTrack = window2.RTCPeerConnection.prototype.removeTrack;
    window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach((streamId) => {
          const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            this._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (this._shimmedLocalStreams[streamId].length === 1) {
            delete this._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
  }
  function shimAddTrackRemoveTrack(window2, browserDetails) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    if (window2.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
      return shimAddTrackRemoveTrackWithNative(window2);
    }
    const origGetLocalStreams = window2.RTCPeerConnection.prototype.getLocalStreams;
    window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      const nativeStreams = origGetLocalStreams.apply(this);
      this._reverseStreams = this._reverseStreams || {};
      return nativeStreams.map((stream) => this._reverseStreams[stream.id]);
    };
    const origAddStream = window2.RTCPeerConnection.prototype.addStream;
    window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      stream.getTracks().forEach((track) => {
        const alreadyExists = this.getSenders().find((s) => s.track === track);
        if (alreadyExists) {
          throw new DOMException(
            "Track already exists.",
            "InvalidAccessError"
          );
        }
      });
      if (!this._reverseStreams[stream.id]) {
        const newStream = new window2.MediaStream(stream.getTracks());
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        stream = newStream;
      }
      origAddStream.apply(this, [stream]);
    };
    const origRemoveStream = window2.RTCPeerConnection.prototype.removeStream;
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
      delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
      delete this._streams[stream.id];
    };
    window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
      if (this.signalingState === "closed") {
        throw new DOMException(
          "The RTCPeerConnection's signalingState is 'closed'.",
          "InvalidStateError"
        );
      }
      const streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 || !streams[0].getTracks().find((t) => t === track)) {
        throw new DOMException(
          "The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.",
          "NotSupportedError"
        );
      }
      const alreadyExists = this.getSenders().find((s) => s.track === track);
      if (alreadyExists) {
        throw new DOMException(
          "Track already exists.",
          "InvalidAccessError"
        );
      }
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      const oldStream = this._streams[stream.id];
      if (oldStream) {
        oldStream.addTrack(track);
        Promise.resolve().then(() => {
          this.dispatchEvent(new Event("negotiationneeded"));
        });
      } else {
        const newStream = new window2.MediaStream([track]);
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        this.addStream(newStream);
      }
      return this.getSenders().find((s) => s.track === track);
    };
    function replaceInternalStreamId(pc, description) {
      let sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach((internalId) => {
        const externalStream = pc._reverseStreams[internalId];
        const internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(
          new RegExp(internalStream.id, "g"),
          externalStream.id
        );
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp
      });
    }
    function replaceExternalStreamId(pc, description) {
      let sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach((internalId) => {
        const externalStream = pc._reverseStreams[internalId];
        const internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(
          new RegExp(externalStream.id, "g"),
          internalStream.id
        );
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp
      });
    }
    ["createOffer", "createAnswer"].forEach(function(method) {
      const nativeMethod = window2.RTCPeerConnection.prototype[method];
      const methodObj = { [method]() {
        const args = arguments;
        const isLegacyCall = arguments.length && typeof arguments[0] === "function";
        if (isLegacyCall) {
          return nativeMethod.apply(this, [
            (description) => {
              const desc = replaceInternalStreamId(this, description);
              args[0].apply(null, [desc]);
            },
            (err) => {
              if (args[1]) {
                args[1].apply(null, err);
              }
            },
            arguments[2]
          ]);
        }
        return nativeMethod.apply(this, arguments).then((description) => replaceInternalStreamId(this, description));
      } };
      window2.RTCPeerConnection.prototype[method] = methodObj[method];
    });
    const origSetLocalDescription = window2.RTCPeerConnection.prototype.setLocalDescription;
    window2.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(this, arguments);
      }
      arguments[0] = replaceExternalStreamId(this, arguments[0]);
      return origSetLocalDescription.apply(this, arguments);
    };
    const origLocalDescription = Object.getOwnPropertyDescriptor(
      window2.RTCPeerConnection.prototype,
      "localDescription"
    );
    Object.defineProperty(
      window2.RTCPeerConnection.prototype,
      "localDescription",
      {
        get() {
          const description = origLocalDescription.get.apply(this);
          if (description.type === "") {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      }
    );
    window2.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
      if (this.signalingState === "closed") {
        throw new DOMException(
          "The RTCPeerConnection's signalingState is 'closed'.",
          "InvalidStateError"
        );
      }
      if (!sender._pc) {
        throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
      }
      const isLocal = sender._pc === this;
      if (!isLocal) {
        throw new DOMException(
          "Sender was not created by this connection.",
          "InvalidAccessError"
        );
      }
      this._streams = this._streams || {};
      let stream;
      Object.keys(this._streams).forEach((streamid) => {
        const hasTrack = this._streams[streamid].getTracks().find((track) => sender.track === track);
        if (hasTrack) {
          stream = this._streams[streamid];
        }
      });
      if (stream) {
        if (stream.getTracks().length === 1) {
          this.removeStream(this._reverseStreams[stream.id]);
        } else {
          stream.removeTrack(sender.track);
        }
        this.dispatchEvent(new Event("negotiationneeded"));
      }
    };
  }
  function shimPeerConnection(window2, browserDetails) {
    if (!window2.RTCPeerConnection && window2.webkitRTCPeerConnection) {
      window2.RTCPeerConnection = window2.webkitRTCPeerConnection;
    }
    if (!window2.RTCPeerConnection) {
      return;
    }
    if (browserDetails.version < 53) {
      ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
        const nativeMethod = window2.RTCPeerConnection.prototype[method];
        const methodObj = { [method]() {
          arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        } };
        window2.RTCPeerConnection.prototype[method] = methodObj[method];
      });
    }
  }
  function fixNegotiationNeeded(window2, browserDetails) {
    wrapPeerConnectionEvent(window2, "negotiationneeded", (e) => {
      const pc = e.target;
      if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === "plan-b") {
        if (pc.signalingState !== "stable") {
          return;
        }
      }
      return e;
    });
  }

  // node_modules/webrtc-adapter/src/js/edge/edge_shim.js
  var edge_shim_exports = {};
  __export(edge_shim_exports, {
    shimGetDisplayMedia: () => shimGetDisplayMedia2,
    shimGetUserMedia: () => shimGetUserMedia2,
    shimPeerConnection: () => shimPeerConnection2,
    shimReplaceTrack: () => shimReplaceTrack
  });

  // node_modules/webrtc-adapter/src/js/edge/filtericeservers.js
  function filterIceServers(iceServers, edgeVersion) {
    let hasTurn = false;
    iceServers = JSON.parse(JSON.stringify(iceServers));
    return iceServers.filter((server) => {
      if (server && (server.urls || server.url)) {
        let urls = server.urls || server.url;
        if (server.url && !server.urls) {
          deprecated("RTCIceServer.url", "RTCIceServer.urls");
        }
        const isString = typeof urls === "string";
        if (isString) {
          urls = [urls];
        }
        urls = urls.filter((url) => {
          if (url.indexOf("stun:") === 0) {
            return false;
          }
          const validTurn = url.startsWith("turn") && !url.startsWith("turn:[") && url.includes("transport=udp");
          if (validTurn && !hasTurn) {
            hasTurn = true;
            return true;
          }
          return validTurn && !hasTurn;
        });
        delete server.url;
        server.urls = isString ? urls[0] : urls;
        return !!urls.length;
      }
    });
  }

  // node_modules/webrtc-adapter/src/js/edge/edge_shim.js
  var import_rtcpeerconnection_shim = __toESM(require_rtcpeerconnection());

  // node_modules/webrtc-adapter/src/js/edge/getusermedia.js
  function shimGetUserMedia2(window2) {
    const navigator2 = window2 && window2.navigator;
    const shimError_ = function(e) {
      return {
        name: { PermissionDeniedError: "NotAllowedError" }[e.name] || e.name,
        message: e.message,
        constraint: e.constraint,
        toString() {
          return this.name;
        }
      };
    };
    const origGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
    navigator2.mediaDevices.getUserMedia = function(c) {
      return origGetUserMedia(c).catch((e) => Promise.reject(shimError_(e)));
    };
  }

  // node_modules/webrtc-adapter/src/js/edge/getdisplaymedia.js
  function shimGetDisplayMedia2(window2) {
    if (!("getDisplayMedia" in window2.navigator)) {
      return;
    }
    if (!window2.navigator.mediaDevices) {
      return;
    }
    if (window2.navigator.mediaDevices && "getDisplayMedia" in window2.navigator.mediaDevices) {
      return;
    }
    window2.navigator.mediaDevices.getDisplayMedia = window2.navigator.getDisplayMedia.bind(window2.navigator);
  }

  // node_modules/webrtc-adapter/src/js/edge/edge_shim.js
  function shimPeerConnection2(window2, browserDetails) {
    if (window2.RTCIceGatherer) {
      if (!window2.RTCIceCandidate) {
        window2.RTCIceCandidate = function RTCIceCandidate2(args) {
          return args;
        };
      }
      if (!window2.RTCSessionDescription) {
        window2.RTCSessionDescription = function RTCSessionDescription2(args) {
          return args;
        };
      }
      if (browserDetails.version < 15025) {
        const origMSTEnabled = Object.getOwnPropertyDescriptor(
          window2.MediaStreamTrack.prototype,
          "enabled"
        );
        Object.defineProperty(window2.MediaStreamTrack.prototype, "enabled", {
          set(value) {
            origMSTEnabled.set.call(this, value);
            const ev = new Event("enabled");
            ev.enabled = value;
            this.dispatchEvent(ev);
          }
        });
      }
    }
    if (window2.RTCRtpSender && !("dtmf" in window2.RTCRtpSender.prototype)) {
      Object.defineProperty(window2.RTCRtpSender.prototype, "dtmf", {
        get() {
          if (this._dtmf === void 0) {
            if (this.track.kind === "audio") {
              this._dtmf = new window2.RTCDtmfSender(this);
            } else if (this.track.kind === "video") {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
    if (window2.RTCDtmfSender && !window2.RTCDTMFSender) {
      window2.RTCDTMFSender = window2.RTCDtmfSender;
    }
    const RTCPeerConnectionShim = (0, import_rtcpeerconnection_shim.default)(
      window2,
      browserDetails.version
    );
    window2.RTCPeerConnection = function RTCPeerConnection2(config) {
      if (config && config.iceServers) {
        config.iceServers = filterIceServers(
          config.iceServers,
          browserDetails.version
        );
        log("ICE servers after filtering:", config.iceServers);
      }
      return new RTCPeerConnectionShim(config);
    };
    window2.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
  }
  function shimReplaceTrack(window2) {
    if (window2.RTCRtpSender && !("replaceTrack" in window2.RTCRtpSender.prototype)) {
      window2.RTCRtpSender.prototype.replaceTrack = window2.RTCRtpSender.prototype.setTrack;
    }
  }

  // node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
  var firefox_shim_exports = {};
  __export(firefox_shim_exports, {
    shimAddTransceiver: () => shimAddTransceiver,
    shimCreateAnswer: () => shimCreateAnswer,
    shimCreateOffer: () => shimCreateOffer,
    shimGetDisplayMedia: () => shimGetDisplayMedia3,
    shimGetParameters: () => shimGetParameters,
    shimGetUserMedia: () => shimGetUserMedia3,
    shimOnTrack: () => shimOnTrack2,
    shimPeerConnection: () => shimPeerConnection3,
    shimRTCDataChannel: () => shimRTCDataChannel,
    shimReceiverGetStats: () => shimReceiverGetStats,
    shimRemoveStream: () => shimRemoveStream,
    shimSenderGetStats: () => shimSenderGetStats
  });

  // node_modules/webrtc-adapter/src/js/firefox/getusermedia.js
  function shimGetUserMedia3(window2, browserDetails) {
    const navigator2 = window2 && window2.navigator;
    const MediaStreamTrack = window2 && window2.MediaStreamTrack;
    navigator2.getUserMedia = function(constraints, onSuccess, onError) {
      deprecated(
        "navigator.getUserMedia",
        "navigator.mediaDevices.getUserMedia"
      );
      navigator2.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    };
    if (!(browserDetails.version > 55 && "autoGainControl" in navigator2.mediaDevices.getSupportedConstraints())) {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      const nativeGetUserMedia = navigator2.mediaDevices.getUserMedia.bind(navigator2.mediaDevices);
      navigator2.mediaDevices.getUserMedia = function(c) {
        if (typeof c === "object" && typeof c.audio === "object") {
          c = JSON.parse(JSON.stringify(c));
          remap(c.audio, "autoGainControl", "mozAutoGainControl");
          remap(c.audio, "noiseSuppression", "mozNoiseSuppression");
        }
        return nativeGetUserMedia(c);
      };
      if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
        const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
        MediaStreamTrack.prototype.getSettings = function() {
          const obj = nativeGetSettings.apply(this, arguments);
          remap(obj, "mozAutoGainControl", "autoGainControl");
          remap(obj, "mozNoiseSuppression", "noiseSuppression");
          return obj;
        };
      }
      if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
        const nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
        MediaStreamTrack.prototype.applyConstraints = function(c) {
          if (this.kind === "audio" && typeof c === "object") {
            c = JSON.parse(JSON.stringify(c));
            remap(c, "autoGainControl", "mozAutoGainControl");
            remap(c, "noiseSuppression", "mozNoiseSuppression");
          }
          return nativeApplyConstraints.apply(this, [c]);
        };
      }
    }
  }

  // node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js
  function shimGetDisplayMedia3(window2, preferredMediaSource) {
    if (window2.navigator.mediaDevices && "getDisplayMedia" in window2.navigator.mediaDevices) {
      return;
    }
    if (!window2.navigator.mediaDevices) {
      return;
    }
    window2.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
      if (!(constraints && constraints.video)) {
        const err = new DOMException("getDisplayMedia without video constraints is undefined");
        err.name = "NotFoundError";
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = { mediaSource: preferredMediaSource };
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window2.navigator.mediaDevices.getUserMedia(constraints);
    };
  }

  // node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
  function shimOnTrack2(window2) {
    if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
      Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
        get() {
          return { receiver: this.receiver };
        }
      });
    }
  }
  function shimPeerConnection3(window2, browserDetails) {
    if (typeof window2 !== "object" || !(window2.RTCPeerConnection || window2.mozRTCPeerConnection)) {
      return;
    }
    if (!window2.RTCPeerConnection && window2.mozRTCPeerConnection) {
      window2.RTCPeerConnection = window2.mozRTCPeerConnection;
    }
    if (browserDetails.version < 53) {
      ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
        const nativeMethod = window2.RTCPeerConnection.prototype[method];
        const methodObj = { [method]() {
          arguments[0] = new (method === "addIceCandidate" ? window2.RTCIceCandidate : window2.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        } };
        window2.RTCPeerConnection.prototype[method] = methodObj[method];
      });
    }
    const modernStatsTypes = {
      inboundrtp: "inbound-rtp",
      outboundrtp: "outbound-rtp",
      candidatepair: "candidate-pair",
      localcandidate: "local-candidate",
      remotecandidate: "remote-candidate"
    };
    const nativeGetStats = window2.RTCPeerConnection.prototype.getStats;
    window2.RTCPeerConnection.prototype.getStats = function getStats() {
      const [selector, onSucc, onErr] = arguments;
      return nativeGetStats.apply(this, [selector || null]).then((stats) => {
        if (browserDetails.version < 53 && !onSucc) {
          try {
            stats.forEach((stat) => {
              stat.type = modernStatsTypes[stat.type] || stat.type;
            });
          } catch (e) {
            if (e.name !== "TypeError") {
              throw e;
            }
            stats.forEach((stat, i) => {
              stats.set(i, Object.assign({}, stat, {
                type: modernStatsTypes[stat.type] || stat.type
              }));
            });
          }
        }
        return stats;
      }).then(onSucc, onErr);
    };
  }
  function shimSenderGetStats(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
      return;
    }
    if (window2.RTCRtpSender && "getStats" in window2.RTCRtpSender.prototype) {
      return;
    }
    const origGetSenders = window2.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window2.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach((sender) => sender._pc = this);
        return senders;
      };
    }
    const origAddTrack = window2.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window2.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window2.RTCRtpSender.prototype.getStats = function getStats() {
      return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
    };
  }
  function shimReceiverGetStats(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection && window2.RTCRtpSender)) {
      return;
    }
    if (window2.RTCRtpSender && "getStats" in window2.RTCRtpReceiver.prototype) {
      return;
    }
    const origGetReceivers = window2.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window2.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        const receivers = origGetReceivers.apply(this, []);
        receivers.forEach((receiver) => receiver._pc = this);
        return receivers;
      };
    }
    wrapPeerConnectionEvent(window2, "track", (e) => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window2.RTCRtpReceiver.prototype.getStats = function getStats() {
      return this._pc.getStats(this.track);
    };
  }
  function shimRemoveStream(window2) {
    if (!window2.RTCPeerConnection || "removeStream" in window2.RTCPeerConnection.prototype) {
      return;
    }
    window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      deprecated("removeStream", "removeTrack");
      this.getSenders().forEach((sender) => {
        if (sender.track && stream.getTracks().includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
  }
  function shimRTCDataChannel(window2) {
    if (window2.DataChannel && !window2.RTCDataChannel) {
      window2.RTCDataChannel = window2.DataChannel;
    }
  }
  function shimAddTransceiver(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
      return;
    }
    const origAddTransceiver = window2.RTCPeerConnection.prototype.addTransceiver;
    if (origAddTransceiver) {
      window2.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
        this.setParametersPromises = [];
        const initParameters = arguments[1];
        const shouldPerformCheck = initParameters && "sendEncodings" in initParameters;
        if (shouldPerformCheck) {
          initParameters.sendEncodings.forEach((encodingParam) => {
            if ("rid" in encodingParam) {
              const ridRegex = /^[a-z0-9]{0,16}$/i;
              if (!ridRegex.test(encodingParam.rid)) {
                throw new TypeError("Invalid RID value provided.");
              }
            }
            if ("scaleResolutionDownBy" in encodingParam) {
              if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1)) {
                throw new RangeError("scale_resolution_down_by must be >= 1.0");
              }
            }
            if ("maxFramerate" in encodingParam) {
              if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                throw new RangeError("max_framerate must be >= 0.0");
              }
            }
          });
        }
        const transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
          const { sender } = transceiver;
          const params2 = sender.getParameters();
          if (!("encodings" in params2) || params2.encodings.length === 1 && Object.keys(params2.encodings[0]).length === 0) {
            params2.encodings = initParameters.sendEncodings;
            sender.sendEncodings = initParameters.sendEncodings;
            this.setParametersPromises.push(
              sender.setParameters(params2).then(() => {
                delete sender.sendEncodings;
              }).catch(() => {
                delete sender.sendEncodings;
              })
            );
          }
        }
        return transceiver;
      };
    }
  }
  function shimGetParameters(window2) {
    if (!(typeof window2 === "object" && window2.RTCRtpSender)) {
      return;
    }
    const origGetParameters = window2.RTCRtpSender.prototype.getParameters;
    if (origGetParameters) {
      window2.RTCRtpSender.prototype.getParameters = function getParameters() {
        const params2 = origGetParameters.apply(this, arguments);
        if (!("encodings" in params2)) {
          params2.encodings = [].concat(this.sendEncodings || [{}]);
        }
        return params2;
      };
    }
  }
  function shimCreateOffer(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
      return;
    }
    const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
    window2.RTCPeerConnection.prototype.createOffer = function createOffer() {
      if (this.setParametersPromises && this.setParametersPromises.length) {
        return Promise.all(this.setParametersPromises).then(() => {
          return origCreateOffer.apply(this, arguments);
        }).finally(() => {
          this.setParametersPromises = [];
        });
      }
      return origCreateOffer.apply(this, arguments);
    };
  }
  function shimCreateAnswer(window2) {
    if (!(typeof window2 === "object" && window2.RTCPeerConnection)) {
      return;
    }
    const origCreateAnswer = window2.RTCPeerConnection.prototype.createAnswer;
    window2.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
      if (this.setParametersPromises && this.setParametersPromises.length) {
        return Promise.all(this.setParametersPromises).then(() => {
          return origCreateAnswer.apply(this, arguments);
        }).finally(() => {
          this.setParametersPromises = [];
        });
      }
      return origCreateAnswer.apply(this, arguments);
    };
  }

  // node_modules/webrtc-adapter/src/js/safari/safari_shim.js
  var safari_shim_exports = {};
  __export(safari_shim_exports, {
    shimAudioContext: () => shimAudioContext,
    shimCallbacksAPI: () => shimCallbacksAPI,
    shimConstraints: () => shimConstraints,
    shimCreateOfferLegacy: () => shimCreateOfferLegacy,
    shimGetUserMedia: () => shimGetUserMedia4,
    shimLocalStreamsAPI: () => shimLocalStreamsAPI,
    shimRTCIceServerUrls: () => shimRTCIceServerUrls,
    shimRemoteStreamsAPI: () => shimRemoteStreamsAPI,
    shimTrackEventTransceiver: () => shimTrackEventTransceiver
  });
  function shimLocalStreamsAPI(window2) {
    if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
      return;
    }
    if (!("getLocalStreams" in window2.RTCPeerConnection.prototype)) {
      window2.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
    }
    if (!("addStream" in window2.RTCPeerConnection.prototype)) {
      const _addTrack = window2.RTCPeerConnection.prototype.addTrack;
      window2.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        if (!this._localStreams.includes(stream)) {
          this._localStreams.push(stream);
        }
        stream.getAudioTracks().forEach((track) => _addTrack.call(
          this,
          track,
          stream
        ));
        stream.getVideoTracks().forEach((track) => _addTrack.call(
          this,
          track,
          stream
        ));
      };
      window2.RTCPeerConnection.prototype.addTrack = function addTrack(track, ...streams) {
        if (streams) {
          streams.forEach((stream) => {
            if (!this._localStreams) {
              this._localStreams = [stream];
            } else if (!this._localStreams.includes(stream)) {
              this._localStreams.push(stream);
            }
          });
        }
        return _addTrack.apply(this, arguments);
      };
    }
    if (!("removeStream" in window2.RTCPeerConnection.prototype)) {
      window2.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        const index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        const tracks = stream.getTracks();
        this.getSenders().forEach((sender) => {
          if (tracks.includes(sender.track)) {
            this.removeTrack(sender);
          }
        });
      };
    }
  }
  function shimRemoteStreamsAPI(window2) {
    if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
      return;
    }
    if (!("getRemoteStreams" in window2.RTCPeerConnection.prototype)) {
      window2.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
    }
    if (!("onaddstream" in window2.RTCPeerConnection.prototype)) {
      Object.defineProperty(window2.RTCPeerConnection.prototype, "onaddstream", {
        get() {
          return this._onaddstream;
        },
        set(f) {
          if (this._onaddstream) {
            this.removeEventListener("addstream", this._onaddstream);
            this.removeEventListener("track", this._onaddstreampoly);
          }
          this.addEventListener("addstream", this._onaddstream = f);
          this.addEventListener("track", this._onaddstreampoly = (e) => {
            e.streams.forEach((stream) => {
              if (!this._remoteStreams) {
                this._remoteStreams = [];
              }
              if (this._remoteStreams.includes(stream)) {
                return;
              }
              this._remoteStreams.push(stream);
              const event = new Event("addstream");
              event.stream = stream;
              this.dispatchEvent(event);
            });
          });
        }
      });
      const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
      window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        const pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener("track", this._onaddstreampoly = function(e) {
            e.streams.forEach((stream) => {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              const event = new Event("addstream");
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
    }
  }
  function shimCallbacksAPI(window2) {
    if (typeof window2 !== "object" || !window2.RTCPeerConnection) {
      return;
    }
    const prototype = window2.RTCPeerConnection.prototype;
    const origCreateOffer = prototype.createOffer;
    const origCreateAnswer = prototype.createAnswer;
    const setLocalDescription = prototype.setLocalDescription;
    const setRemoteDescription = prototype.setRemoteDescription;
    const addIceCandidate = prototype.addIceCandidate;
    prototype.createOffer = function createOffer(successCallback, failureCallback) {
      const options = arguments.length >= 2 ? arguments[2] : arguments[0];
      const promise = origCreateOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
      const options = arguments.length >= 2 ? arguments[2] : arguments[0];
      const promise = origCreateAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    let withCallback = function(description, successCallback, failureCallback) {
      const promise = setLocalDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;
    withCallback = function(description, successCallback, failureCallback) {
      const promise = setRemoteDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;
    withCallback = function(candidate, successCallback, failureCallback) {
      const promise = addIceCandidate.apply(this, [candidate]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
  }
  function shimGetUserMedia4(window2) {
    const navigator2 = window2 && window2.navigator;
    if (navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
      const mediaDevices = navigator2.mediaDevices;
      const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
      navigator2.mediaDevices.getUserMedia = (constraints) => {
        return _getUserMedia(shimConstraints(constraints));
      };
    }
    if (!navigator2.getUserMedia && navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
      navigator2.getUserMedia = function getUserMedia(constraints, cb, errcb) {
        navigator2.mediaDevices.getUserMedia(constraints).then(cb, errcb);
      }.bind(navigator2);
    }
  }
  function shimConstraints(constraints) {
    if (constraints && constraints.video !== void 0) {
      return Object.assign(
        {},
        constraints,
        { video: compactObject(constraints.video) }
      );
    }
    return constraints;
  }
  function shimRTCIceServerUrls(window2) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    const OrigPeerConnection = window2.RTCPeerConnection;
    window2.RTCPeerConnection = function RTCPeerConnection2(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        const newIceServers = [];
        for (let i = 0; i < pcConfig.iceServers.length; i++) {
          let server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty("urls") && server.hasOwnProperty("url")) {
            deprecated("RTCIceServer.url", "RTCIceServer.urls");
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window2.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    if ("generateCertificate" in OrigPeerConnection) {
      Object.defineProperty(window2.RTCPeerConnection, "generateCertificate", {
        get() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }
  }
  function shimTrackEventTransceiver(window2) {
    if (typeof window2 === "object" && window2.RTCTrackEvent && "receiver" in window2.RTCTrackEvent.prototype && !("transceiver" in window2.RTCTrackEvent.prototype)) {
      Object.defineProperty(window2.RTCTrackEvent.prototype, "transceiver", {
        get() {
          return { receiver: this.receiver };
        }
      });
    }
  }
  function shimCreateOfferLegacy(window2) {
    const origCreateOffer = window2.RTCPeerConnection.prototype.createOffer;
    window2.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== "undefined") {
          offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
        }
        const audioTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "audio");
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === "sendrecv") {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection("sendonly");
            } else {
              audioTransceiver.direction = "sendonly";
            }
          } else if (audioTransceiver.direction === "recvonly") {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection("inactive");
            } else {
              audioTransceiver.direction = "inactive";
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
          this.addTransceiver("audio");
        }
        if (typeof offerOptions.offerToReceiveVideo !== "undefined") {
          offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
        }
        const videoTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "video");
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === "sendrecv") {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection("sendonly");
            } else {
              videoTransceiver.direction = "sendonly";
            }
          } else if (videoTransceiver.direction === "recvonly") {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection("inactive");
            } else {
              videoTransceiver.direction = "inactive";
            }
          }
        } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
          this.addTransceiver("video");
        }
      }
      return origCreateOffer.apply(this, arguments);
    };
  }
  function shimAudioContext(window2) {
    if (typeof window2 !== "object" || window2.AudioContext) {
      return;
    }
    window2.AudioContext = window2.webkitAudioContext;
  }

  // node_modules/webrtc-adapter/src/js/common_shim.js
  var common_shim_exports = {};
  __export(common_shim_exports, {
    removeExtmapAllowMixed: () => removeExtmapAllowMixed,
    shimAddIceCandidateNullOrEmpty: () => shimAddIceCandidateNullOrEmpty,
    shimConnectionState: () => shimConnectionState,
    shimMaxMessageSize: () => shimMaxMessageSize,
    shimRTCIceCandidate: () => shimRTCIceCandidate,
    shimSendThrowTypeError: () => shimSendThrowTypeError
  });
  var import_sdp = __toESM(require_sdp());
  function shimRTCIceCandidate(window2) {
    if (!window2.RTCIceCandidate || window2.RTCIceCandidate && "foundation" in window2.RTCIceCandidate.prototype) {
      return;
    }
    const NativeRTCIceCandidate = window2.RTCIceCandidate;
    window2.RTCIceCandidate = function RTCIceCandidate2(args) {
      if (typeof args === "object" && args.candidate && args.candidate.indexOf("a=") === 0) {
        args = JSON.parse(JSON.stringify(args));
        args.candidate = args.candidate.substr(2);
      }
      if (args.candidate && args.candidate.length) {
        const nativeCandidate = new NativeRTCIceCandidate(args);
        const parsedCandidate = import_sdp.default.parseCandidate(args.candidate);
        const augmentedCandidate = Object.assign(
          nativeCandidate,
          parsedCandidate
        );
        augmentedCandidate.toJSON = function toJSON() {
          return {
            candidate: augmentedCandidate.candidate,
            sdpMid: augmentedCandidate.sdpMid,
            sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
            usernameFragment: augmentedCandidate.usernameFragment
          };
        };
        return augmentedCandidate;
      }
      return new NativeRTCIceCandidate(args);
    };
    window2.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
    wrapPeerConnectionEvent(window2, "icecandidate", (e) => {
      if (e.candidate) {
        Object.defineProperty(e, "candidate", {
          value: new window2.RTCIceCandidate(e.candidate),
          writable: "false"
        });
      }
      return e;
    });
  }
  function shimMaxMessageSize(window2, browserDetails) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    if (!("sctp" in window2.RTCPeerConnection.prototype)) {
      Object.defineProperty(window2.RTCPeerConnection.prototype, "sctp", {
        get() {
          return typeof this._sctp === "undefined" ? null : this._sctp;
        }
      });
    }
    const sctpInDescription = function(description) {
      if (!description || !description.sdp) {
        return false;
      }
      const sections = import_sdp.default.splitSections(description.sdp);
      sections.shift();
      return sections.some((mediaSection) => {
        const mLine = import_sdp.default.parseMLine(mediaSection);
        return mLine && mLine.kind === "application" && mLine.protocol.indexOf("SCTP") !== -1;
      });
    };
    const getRemoteFirefoxVersion = function(description) {
      const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
      if (match === null || match.length < 2) {
        return -1;
      }
      const version = parseInt(match[1], 10);
      return version !== version ? -1 : version;
    };
    const getCanSendMaxMessageSize = function(remoteIsFirefox) {
      let canSendMaxMessageSize = 65536;
      if (browserDetails.browser === "firefox") {
        if (browserDetails.version < 57) {
          if (remoteIsFirefox === -1) {
            canSendMaxMessageSize = 16384;
          } else {
            canSendMaxMessageSize = 2147483637;
          }
        } else if (browserDetails.version < 60) {
          canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
        } else {
          canSendMaxMessageSize = 2147483637;
        }
      }
      return canSendMaxMessageSize;
    };
    const getMaxMessageSize = function(description, remoteIsFirefox) {
      let maxMessageSize = 65536;
      if (browserDetails.browser === "firefox" && browserDetails.version === 57) {
        maxMessageSize = 65535;
      }
      const match = import_sdp.default.matchPrefix(
        description.sdp,
        "a=max-message-size:"
      );
      if (match.length > 0) {
        maxMessageSize = parseInt(match[0].substr(19), 10);
      } else if (browserDetails.browser === "firefox" && remoteIsFirefox !== -1) {
        maxMessageSize = 2147483637;
      }
      return maxMessageSize;
    };
    const origSetRemoteDescription = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      this._sctp = null;
      if (browserDetails.browser === "chrome" && browserDetails.version >= 76) {
        const { sdpSemantics } = this.getConfiguration();
        if (sdpSemantics === "plan-b") {
          Object.defineProperty(this, "sctp", {
            get() {
              return typeof this._sctp === "undefined" ? null : this._sctp;
            },
            enumerable: true,
            configurable: true
          });
        }
      }
      if (sctpInDescription(arguments[0])) {
        const isFirefox = getRemoteFirefoxVersion(arguments[0]);
        const canSendMMS = getCanSendMaxMessageSize(isFirefox);
        const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
        let maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }
        const sctp = {};
        Object.defineProperty(sctp, "maxMessageSize", {
          get() {
            return maxMessageSize;
          }
        });
        this._sctp = sctp;
      }
      return origSetRemoteDescription.apply(this, arguments);
    };
  }
  function shimSendThrowTypeError(window2) {
    if (!(window2.RTCPeerConnection && "createDataChannel" in window2.RTCPeerConnection.prototype)) {
      return;
    }
    function wrapDcSend(dc, pc) {
      const origDataChannelSend = dc.send;
      dc.send = function send() {
        const data = arguments[0];
        const length = data.length || data.size || data.byteLength;
        if (dc.readyState === "open" && pc.sctp && length > pc.sctp.maxMessageSize) {
          throw new TypeError("Message too large (can send a maximum of " + pc.sctp.maxMessageSize + " bytes)");
        }
        return origDataChannelSend.apply(dc, arguments);
      };
    }
    const origCreateDataChannel = window2.RTCPeerConnection.prototype.createDataChannel;
    window2.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
      const dataChannel = origCreateDataChannel.apply(this, arguments);
      wrapDcSend(dataChannel, this);
      return dataChannel;
    };
    wrapPeerConnectionEvent(window2, "datachannel", (e) => {
      wrapDcSend(e.channel, e.target);
      return e;
    });
  }
  function shimConnectionState(window2) {
    if (!window2.RTCPeerConnection || "connectionState" in window2.RTCPeerConnection.prototype) {
      return;
    }
    const proto = window2.RTCPeerConnection.prototype;
    Object.defineProperty(proto, "connectionState", {
      get() {
        return {
          completed: "connected",
          checking: "connecting"
        }[this.iceConnectionState] || this.iceConnectionState;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(proto, "onconnectionstatechange", {
      get() {
        return this._onconnectionstatechange || null;
      },
      set(cb) {
        if (this._onconnectionstatechange) {
          this.removeEventListener(
            "connectionstatechange",
            this._onconnectionstatechange
          );
          delete this._onconnectionstatechange;
        }
        if (cb) {
          this.addEventListener(
            "connectionstatechange",
            this._onconnectionstatechange = cb
          );
        }
      },
      enumerable: true,
      configurable: true
    });
    ["setLocalDescription", "setRemoteDescription"].forEach((method) => {
      const origMethod = proto[method];
      proto[method] = function() {
        if (!this._connectionstatechangepoly) {
          this._connectionstatechangepoly = (e) => {
            const pc = e.target;
            if (pc._lastConnectionState !== pc.connectionState) {
              pc._lastConnectionState = pc.connectionState;
              const newEvent = new Event("connectionstatechange", e);
              pc.dispatchEvent(newEvent);
            }
            return e;
          };
          this.addEventListener(
            "iceconnectionstatechange",
            this._connectionstatechangepoly
          );
        }
        return origMethod.apply(this, arguments);
      };
    });
  }
  function removeExtmapAllowMixed(window2, browserDetails) {
    if (!window2.RTCPeerConnection) {
      return;
    }
    if (browserDetails.browser === "chrome" && browserDetails.version >= 71) {
      return;
    }
    if (browserDetails.browser === "safari" && browserDetails.version >= 605) {
      return;
    }
    const nativeSRD = window2.RTCPeerConnection.prototype.setRemoteDescription;
    window2.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
      if (desc && desc.sdp && desc.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
        const sdp = desc.sdp.split("\n").filter((line) => {
          return line.trim() !== "a=extmap-allow-mixed";
        }).join("\n");
        if (window2.RTCSessionDescription && desc instanceof window2.RTCSessionDescription) {
          arguments[0] = new window2.RTCSessionDescription({
            type: desc.type,
            sdp
          });
        } else {
          desc.sdp = sdp;
        }
      }
      return nativeSRD.apply(this, arguments);
    };
  }
  function shimAddIceCandidateNullOrEmpty(window2, browserDetails) {
    if (!(window2.RTCPeerConnection && window2.RTCPeerConnection.prototype)) {
      return;
    }
    const nativeAddIceCandidate = window2.RTCPeerConnection.prototype.addIceCandidate;
    if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
      return;
    }
    window2.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      if ((browserDetails.browser === "chrome" && browserDetails.version < 78 || browserDetails.browser === "firefox" && browserDetails.version < 68 || browserDetails.browser === "safari") && arguments[0] && arguments[0].candidate === "") {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }

  // node_modules/webrtc-adapter/src/js/adapter_factory.js
  function adapterFactory({ window: window2 } = {}, options = {
    shimChrome: true,
    shimFirefox: true,
    shimEdge: true,
    shimSafari: true
  }) {
    const logging2 = log;
    const browserDetails = detectBrowser(window2);
    const adapter2 = {
      browserDetails,
      commonShim: common_shim_exports,
      extractVersion,
      disableLog,
      disableWarnings
    };
    switch (browserDetails.browser) {
      case "chrome":
        if (!chrome_shim_exports || !shimPeerConnection || !options.shimChrome) {
          logging2("Chrome shim is not included in this adapter release.");
          return adapter2;
        }
        if (browserDetails.version === null) {
          logging2("Chrome shim can not determine version, not shimming.");
          return adapter2;
        }
        logging2("adapter.js shimming chrome.");
        adapter2.browserShim = chrome_shim_exports;
        shimAddIceCandidateNullOrEmpty(window2, browserDetails);
        shimGetUserMedia(window2, browserDetails);
        shimMediaStream(window2, browserDetails);
        shimPeerConnection(window2, browserDetails);
        shimOnTrack(window2, browserDetails);
        shimAddTrackRemoveTrack(window2, browserDetails);
        shimGetSendersWithDtmf(window2, browserDetails);
        shimGetStats(window2, browserDetails);
        shimSenderReceiverGetStats(window2, browserDetails);
        fixNegotiationNeeded(window2, browserDetails);
        shimRTCIceCandidate(window2, browserDetails);
        shimConnectionState(window2, browserDetails);
        shimMaxMessageSize(window2, browserDetails);
        shimSendThrowTypeError(window2, browserDetails);
        removeExtmapAllowMixed(window2, browserDetails);
        break;
      case "firefox":
        if (!firefox_shim_exports || !shimPeerConnection3 || !options.shimFirefox) {
          logging2("Firefox shim is not included in this adapter release.");
          return adapter2;
        }
        logging2("adapter.js shimming firefox.");
        adapter2.browserShim = firefox_shim_exports;
        shimAddIceCandidateNullOrEmpty(window2, browserDetails);
        shimGetUserMedia3(window2, browserDetails);
        shimPeerConnection3(window2, browserDetails);
        shimOnTrack2(window2, browserDetails);
        shimRemoveStream(window2, browserDetails);
        shimSenderGetStats(window2, browserDetails);
        shimReceiverGetStats(window2, browserDetails);
        shimRTCDataChannel(window2, browserDetails);
        shimAddTransceiver(window2, browserDetails);
        shimGetParameters(window2, browserDetails);
        shimCreateOffer(window2, browserDetails);
        shimCreateAnswer(window2, browserDetails);
        shimRTCIceCandidate(window2, browserDetails);
        shimConnectionState(window2, browserDetails);
        shimMaxMessageSize(window2, browserDetails);
        shimSendThrowTypeError(window2, browserDetails);
        break;
      case "edge":
        if (!edge_shim_exports || !shimPeerConnection2 || !options.shimEdge) {
          logging2("MS edge shim is not included in this adapter release.");
          return adapter2;
        }
        logging2("adapter.js shimming edge.");
        adapter2.browserShim = edge_shim_exports;
        shimGetUserMedia2(window2, browserDetails);
        shimGetDisplayMedia2(window2, browserDetails);
        shimPeerConnection2(window2, browserDetails);
        shimReplaceTrack(window2, browserDetails);
        shimMaxMessageSize(window2, browserDetails);
        shimSendThrowTypeError(window2, browserDetails);
        break;
      case "safari":
        if (!safari_shim_exports || !options.shimSafari) {
          logging2("Safari shim is not included in this adapter release.");
          return adapter2;
        }
        logging2("adapter.js shimming safari.");
        adapter2.browserShim = safari_shim_exports;
        shimAddIceCandidateNullOrEmpty(window2, browserDetails);
        shimRTCIceServerUrls(window2, browserDetails);
        shimCreateOfferLegacy(window2, browserDetails);
        shimCallbacksAPI(window2, browserDetails);
        shimLocalStreamsAPI(window2, browserDetails);
        shimRemoteStreamsAPI(window2, browserDetails);
        shimTrackEventTransceiver(window2, browserDetails);
        shimGetUserMedia4(window2, browserDetails);
        shimAudioContext(window2, browserDetails);
        shimRTCIceCandidate(window2, browserDetails);
        shimMaxMessageSize(window2, browserDetails);
        shimSendThrowTypeError(window2, browserDetails);
        removeExtmapAllowMixed(window2, browserDetails);
        break;
      default:
        logging2("Unsupported browser!");
        break;
    }
    return adapter2;
  }

  // node_modules/webrtc-adapter/src/js/adapter_core.js
  var adapter = adapterFactory({ window: typeof window === "undefined" ? void 0 : window });
  var adapter_core_default = adapter;

  // node_modules/peerjs/dist/bundler.mjs
  function $parcel$export(e, n, v, s) {
    Object.defineProperty(e, n, { get: v, set: s, enumerable: true, configurable: true });
  }
  var $af8cf1f663f490f4$var$webRTCAdapter = adapter_core_default.default || adapter_core_default;
  var $af8cf1f663f490f4$export$25be9502477c137d = new (function() {
    function class_1() {
      this.isIOS = [
        "iPad",
        "iPhone",
        "iPod"
      ].includes(navigator.platform);
      this.supportedBrowsers = [
        "firefox",
        "chrome",
        "safari"
      ];
      this.minFirefoxVersion = 59;
      this.minChromeVersion = 72;
      this.minSafariVersion = 605;
    }
    class_1.prototype.isWebRTCSupported = function() {
      return typeof RTCPeerConnection !== "undefined";
    };
    class_1.prototype.isBrowserSupported = function() {
      var browser = this.getBrowser();
      var version = this.getVersion();
      var validBrowser = this.supportedBrowsers.includes(browser);
      if (!validBrowser)
        return false;
      if (browser === "chrome")
        return version >= this.minChromeVersion;
      if (browser === "firefox")
        return version >= this.minFirefoxVersion;
      if (browser === "safari")
        return !this.isIOS && version >= this.minSafariVersion;
      return false;
    };
    class_1.prototype.getBrowser = function() {
      return $af8cf1f663f490f4$var$webRTCAdapter.browserDetails.browser;
    };
    class_1.prototype.getVersion = function() {
      return $af8cf1f663f490f4$var$webRTCAdapter.browserDetails.version || 0;
    };
    class_1.prototype.isUnifiedPlanSupported = function() {
      var browser = this.getBrowser();
      var version = $af8cf1f663f490f4$var$webRTCAdapter.browserDetails.version || 0;
      if (browser === "chrome" && version < this.minChromeVersion)
        return false;
      if (browser === "firefox" && version >= this.minFirefoxVersion)
        return true;
      if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype))
        return false;
      var tempPc;
      var supported = false;
      try {
        tempPc = new RTCPeerConnection();
        tempPc.addTransceiver("audio");
        supported = true;
      } catch (e) {
      } finally {
        if (tempPc)
          tempPc.close();
      }
      return supported;
    };
    class_1.prototype.toString = function() {
      return "Supports:\n    browser:".concat(this.getBrowser(), "\n    version:").concat(this.getVersion(), "\n    isIOS:").concat(this.isIOS, "\n    isWebRTCSupported:").concat(this.isWebRTCSupported(), "\n    isBrowserSupported:").concat(this.isBrowserSupported(), "\n    isUnifiedPlanSupported:").concat(this.isUnifiedPlanSupported());
    };
    return class_1;
  }())();
  var $06cb531ed7840f78$var$DEFAULT_CONFIG = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      },
      {
        urls: [
          "turn:eu-0.turn.peerjs.com:3478",
          "turn:us-0.turn.peerjs.com:3478"
        ],
        username: "peerjs",
        credential: "peerjsp"
      }
    ],
    sdpSemantics: "unified-plan"
  };
  var $06cb531ed7840f78$var$Util = function() {
    function Util() {
      this.CLOUD_HOST = "0.peerjs.com";
      this.CLOUD_PORT = 443;
      this.chunkedBrowsers = {
        Chrome: 1,
        chrome: 1
      };
      this.chunkedMTU = 16300;
      this.defaultConfig = $06cb531ed7840f78$var$DEFAULT_CONFIG;
      this.browser = $af8cf1f663f490f4$export$25be9502477c137d.getBrowser();
      this.browserVersion = $af8cf1f663f490f4$export$25be9502477c137d.getVersion();
      this.supports = function() {
        var supported = {
          browser: $af8cf1f663f490f4$export$25be9502477c137d.isBrowserSupported(),
          webRTC: $af8cf1f663f490f4$export$25be9502477c137d.isWebRTCSupported(),
          audioVideo: false,
          data: false,
          binaryBlob: false,
          reliable: false
        };
        if (!supported.webRTC)
          return supported;
        var pc;
        try {
          pc = new RTCPeerConnection($06cb531ed7840f78$var$DEFAULT_CONFIG);
          supported.audioVideo = true;
          var dc = void 0;
          try {
            dc = pc.createDataChannel("_PEERJSTEST", {
              ordered: true
            });
            supported.data = true;
            supported.reliable = !!dc.ordered;
            try {
              dc.binaryType = "blob";
              supported.binaryBlob = !$af8cf1f663f490f4$export$25be9502477c137d.isIOS;
            } catch (e) {
            }
          } catch (e) {
          } finally {
            if (dc)
              dc.close();
          }
        } catch (e) {
        } finally {
          if (pc)
            pc.close();
        }
        return supported;
      }();
      this.pack = import_peerjs_js_binarypack.default.pack;
      this.unpack = import_peerjs_js_binarypack.default.unpack;
      this._dataCount = 1;
    }
    Util.prototype.noop = function() {
    };
    Util.prototype.validateId = function(id) {
      return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
    };
    Util.prototype.chunk = function(blob) {
      var chunks = [];
      var size = blob.size;
      var total = Math.ceil(size / $06cb531ed7840f78$export$7debb50ef11d5e0b.chunkedMTU);
      var index = 0;
      var start = 0;
      while (start < size) {
        var end = Math.min(size, start + $06cb531ed7840f78$export$7debb50ef11d5e0b.chunkedMTU);
        var b = blob.slice(start, end);
        var chunk = {
          __peerData: this._dataCount,
          n: index,
          data: b,
          total
        };
        chunks.push(chunk);
        start = end;
        index++;
      }
      this._dataCount++;
      return chunks;
    };
    Util.prototype.blobToArrayBuffer = function(blob, cb) {
      var fr = new FileReader();
      fr.onload = function(evt) {
        if (evt.target)
          cb(evt.target.result);
      };
      fr.readAsArrayBuffer(blob);
      return fr;
    };
    Util.prototype.binaryStringToArrayBuffer = function(binary) {
      var byteArray = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++)
        byteArray[i] = binary.charCodeAt(i) & 255;
      return byteArray.buffer;
    };
    Util.prototype.randomToken = function() {
      return Math.random().toString(36).slice(2);
    };
    Util.prototype.isSecure = function() {
      return location.protocol === "https:";
    };
    return Util;
  }();
  var $06cb531ed7840f78$export$7debb50ef11d5e0b = new $06cb531ed7840f78$var$Util();
  var $26088d7da5b03f69$exports = {};
  $parcel$export($26088d7da5b03f69$exports, "Peer", () => $26088d7da5b03f69$export$ecd1fc136c422448, (v) => $26088d7da5b03f69$export$ecd1fc136c422448 = v);
  var $ac9b757d51178e15$exports = {};
  var $ac9b757d51178e15$var$has = Object.prototype.hasOwnProperty;
  var $ac9b757d51178e15$var$prefix = "~";
  function $ac9b757d51178e15$var$Events() {
  }
  if (Object.create) {
    $ac9b757d51178e15$var$Events.prototype = /* @__PURE__ */ Object.create(null);
    if (!new $ac9b757d51178e15$var$Events().__proto__)
      $ac9b757d51178e15$var$prefix = false;
  }
  function $ac9b757d51178e15$var$EE(fn, context, once2) {
    this.fn = fn;
    this.context = context;
    this.once = once2 || false;
  }
  function $ac9b757d51178e15$var$addListener(emitter, event, fn, context, once2) {
    if (typeof fn !== "function")
      throw new TypeError("The listener must be a function");
    var listener = new $ac9b757d51178e15$var$EE(fn, context || emitter, once2), evt = $ac9b757d51178e15$var$prefix ? $ac9b757d51178e15$var$prefix + event : event;
    if (!emitter._events[evt])
      emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
      emitter._events[evt].push(listener);
    else
      emitter._events[evt] = [
        emitter._events[evt],
        listener
      ];
    return emitter;
  }
  function $ac9b757d51178e15$var$clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0)
      emitter._events = new $ac9b757d51178e15$var$Events();
    else
      delete emitter._events[evt];
  }
  function $ac9b757d51178e15$var$EventEmitter() {
    this._events = new $ac9b757d51178e15$var$Events();
    this._eventsCount = 0;
  }
  $ac9b757d51178e15$var$EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
      return names;
    for (name in events = this._events)
      if ($ac9b757d51178e15$var$has.call(events, name))
        names.push($ac9b757d51178e15$var$prefix ? name.slice(1) : name);
    if (Object.getOwnPropertySymbols)
      return names.concat(Object.getOwnPropertySymbols(events));
    return names;
  };
  $ac9b757d51178e15$var$EventEmitter.prototype.listeners = function listeners(event) {
    var evt = $ac9b757d51178e15$var$prefix ? $ac9b757d51178e15$var$prefix + event : event, handlers = this._events[evt];
    if (!handlers)
      return [];
    if (handlers.fn)
      return [
        handlers.fn
      ];
    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++)
      ee[i] = handlers[i].fn;
    return ee;
  };
  $ac9b757d51178e15$var$EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = $ac9b757d51178e15$var$prefix ? $ac9b757d51178e15$var$prefix + event : event, listeners2 = this._events[evt];
    if (!listeners2)
      return 0;
    if (listeners2.fn)
      return 1;
    return listeners2.length;
  };
  $ac9b757d51178e15$var$EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = $ac9b757d51178e15$var$prefix ? $ac9b757d51178e15$var$prefix + event : event;
    if (!this._events[evt])
      return false;
    var listeners2 = this._events[evt], len = arguments.length, args, i;
    if (listeners2.fn) {
      if (listeners2.once)
        this.removeListener(event, listeners2.fn, void 0, true);
      switch (len) {
        case 1:
          return listeners2.fn.call(listeners2.context), true;
        case 2:
          return listeners2.fn.call(listeners2.context, a1), true;
        case 3:
          return listeners2.fn.call(listeners2.context, a1, a2), true;
        case 4:
          return listeners2.fn.call(listeners2.context, a1, a2, a3), true;
        case 5:
          return listeners2.fn.call(listeners2.context, a1, a2, a3, a4), true;
        case 6:
          return listeners2.fn.call(listeners2.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1); i < len; i++)
        args[i - 1] = arguments[i];
      listeners2.fn.apply(listeners2.context, args);
    } else {
      var length = listeners2.length, j;
      for (i = 0; i < length; i++) {
        if (listeners2[i].once)
          this.removeListener(event, listeners2[i].fn, void 0, true);
        switch (len) {
          case 1:
            listeners2[i].fn.call(listeners2[i].context);
            break;
          case 2:
            listeners2[i].fn.call(listeners2[i].context, a1);
            break;
          case 3:
            listeners2[i].fn.call(listeners2[i].context, a1, a2);
            break;
          case 4:
            listeners2[i].fn.call(listeners2[i].context, a1, a2, a3);
            break;
          default:
            if (!args)
              for (j = 1, args = new Array(len - 1); j < len; j++)
                args[j - 1] = arguments[j];
            listeners2[i].fn.apply(listeners2[i].context, args);
        }
      }
    }
    return true;
  };
  $ac9b757d51178e15$var$EventEmitter.prototype.on = function on(event, fn, context) {
    return $ac9b757d51178e15$var$addListener(this, event, fn, context, false);
  };
  $ac9b757d51178e15$var$EventEmitter.prototype.once = function once(event, fn, context) {
    return $ac9b757d51178e15$var$addListener(this, event, fn, context, true);
  };
  $ac9b757d51178e15$var$EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once2) {
    var evt = $ac9b757d51178e15$var$prefix ? $ac9b757d51178e15$var$prefix + event : event;
    if (!this._events[evt])
      return this;
    if (!fn) {
      $ac9b757d51178e15$var$clearEvent(this, evt);
      return this;
    }
    var listeners2 = this._events[evt];
    if (listeners2.fn) {
      if (listeners2.fn === fn && (!once2 || listeners2.once) && (!context || listeners2.context === context))
        $ac9b757d51178e15$var$clearEvent(this, evt);
    } else {
      for (var i = 0, events = [], length = listeners2.length; i < length; i++)
        if (listeners2[i].fn !== fn || once2 && !listeners2[i].once || context && listeners2[i].context !== context)
          events.push(listeners2[i]);
      if (events.length)
        this._events[evt] = events.length === 1 ? events[0] : events;
      else
        $ac9b757d51178e15$var$clearEvent(this, evt);
    }
    return this;
  };
  $ac9b757d51178e15$var$EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = $ac9b757d51178e15$var$prefix ? $ac9b757d51178e15$var$prefix + event : event;
      if (this._events[evt])
        $ac9b757d51178e15$var$clearEvent(this, evt);
    } else {
      this._events = new $ac9b757d51178e15$var$Events();
      this._eventsCount = 0;
    }
    return this;
  };
  $ac9b757d51178e15$var$EventEmitter.prototype.off = $ac9b757d51178e15$var$EventEmitter.prototype.removeListener;
  $ac9b757d51178e15$var$EventEmitter.prototype.addListener = $ac9b757d51178e15$var$EventEmitter.prototype.on;
  $ac9b757d51178e15$var$EventEmitter.prefixed = $ac9b757d51178e15$var$prefix;
  $ac9b757d51178e15$var$EventEmitter.EventEmitter = $ac9b757d51178e15$var$EventEmitter;
  $ac9b757d51178e15$exports = $ac9b757d51178e15$var$EventEmitter;
  var $1615705ecc6adca3$exports = {};
  $parcel$export($1615705ecc6adca3$exports, "LogLevel", () => $1615705ecc6adca3$export$243e62d78d3b544d, (v) => $1615705ecc6adca3$export$243e62d78d3b544d = v);
  $parcel$export($1615705ecc6adca3$exports, "default", () => $1615705ecc6adca3$export$2e2bcd8739ae039, (v) => $1615705ecc6adca3$export$2e2bcd8739ae039 = v);
  var $1615705ecc6adca3$var$__read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = {
        error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var $1615705ecc6adca3$var$__spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++)
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var $1615705ecc6adca3$var$LOG_PREFIX = "PeerJS: ";
  var $1615705ecc6adca3$export$243e62d78d3b544d;
  (function($1615705ecc6adca3$export$243e62d78d3b544d2) {
    $1615705ecc6adca3$export$243e62d78d3b544d2[$1615705ecc6adca3$export$243e62d78d3b544d2["Disabled"] = 0] = "Disabled";
    $1615705ecc6adca3$export$243e62d78d3b544d2[$1615705ecc6adca3$export$243e62d78d3b544d2["Errors"] = 1] = "Errors";
    $1615705ecc6adca3$export$243e62d78d3b544d2[$1615705ecc6adca3$export$243e62d78d3b544d2["Warnings"] = 2] = "Warnings";
    $1615705ecc6adca3$export$243e62d78d3b544d2[$1615705ecc6adca3$export$243e62d78d3b544d2["All"] = 3] = "All";
  })($1615705ecc6adca3$export$243e62d78d3b544d || ($1615705ecc6adca3$export$243e62d78d3b544d = {}));
  var $1615705ecc6adca3$var$Logger = function() {
    function Logger() {
      this._logLevel = $1615705ecc6adca3$export$243e62d78d3b544d.Disabled;
    }
    Object.defineProperty(Logger.prototype, "logLevel", {
      get: function() {
        return this._logLevel;
      },
      set: function(logLevel) {
        this._logLevel = logLevel;
      },
      enumerable: false,
      configurable: true
    });
    Logger.prototype.log = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++)
        args[_i] = arguments[_i];
      if (this._logLevel >= $1615705ecc6adca3$export$243e62d78d3b544d.All)
        this._print.apply(this, $1615705ecc6adca3$var$__spreadArray([
          $1615705ecc6adca3$export$243e62d78d3b544d.All
        ], $1615705ecc6adca3$var$__read(args), false));
    };
    Logger.prototype.warn = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++)
        args[_i] = arguments[_i];
      if (this._logLevel >= $1615705ecc6adca3$export$243e62d78d3b544d.Warnings)
        this._print.apply(this, $1615705ecc6adca3$var$__spreadArray([
          $1615705ecc6adca3$export$243e62d78d3b544d.Warnings
        ], $1615705ecc6adca3$var$__read(args), false));
    };
    Logger.prototype.error = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++)
        args[_i] = arguments[_i];
      if (this._logLevel >= $1615705ecc6adca3$export$243e62d78d3b544d.Errors)
        this._print.apply(this, $1615705ecc6adca3$var$__spreadArray([
          $1615705ecc6adca3$export$243e62d78d3b544d.Errors
        ], $1615705ecc6adca3$var$__read(args), false));
    };
    Logger.prototype.setLogFunction = function(fn) {
      this._print = fn;
    };
    Logger.prototype._print = function(logLevel) {
      var rest = [];
      for (var _i = 1; _i < arguments.length; _i++)
        rest[_i - 1] = arguments[_i];
      var copy = $1615705ecc6adca3$var$__spreadArray([
        $1615705ecc6adca3$var$LOG_PREFIX
      ], $1615705ecc6adca3$var$__read(rest), false);
      for (var i in copy)
        if (copy[i] instanceof Error)
          copy[i] = "(" + copy[i].name + ") " + copy[i].message;
      if (logLevel >= $1615705ecc6adca3$export$243e62d78d3b544d.All)
        console.log.apply(console, $1615705ecc6adca3$var$__spreadArray([], $1615705ecc6adca3$var$__read(copy), false));
      else if (logLevel >= $1615705ecc6adca3$export$243e62d78d3b544d.Warnings)
        console.warn.apply(console, $1615705ecc6adca3$var$__spreadArray([
          "WARNING"
        ], $1615705ecc6adca3$var$__read(copy), false));
      else if (logLevel >= $1615705ecc6adca3$export$243e62d78d3b544d.Errors)
        console.error.apply(console, $1615705ecc6adca3$var$__spreadArray([
          "ERROR"
        ], $1615705ecc6adca3$var$__read(copy), false));
    };
    return Logger;
  }();
  var $1615705ecc6adca3$export$2e2bcd8739ae039 = new $1615705ecc6adca3$var$Logger();
  var $31d11a8d122cb4b7$exports = {};
  $parcel$export($31d11a8d122cb4b7$exports, "Socket", () => $31d11a8d122cb4b7$export$4798917dbf149b79, (v) => $31d11a8d122cb4b7$export$4798917dbf149b79 = v);
  var $60fadef21a2daafc$export$3157d57b4135e3bc;
  (function($60fadef21a2daafc$export$3157d57b4135e3bc2) {
    $60fadef21a2daafc$export$3157d57b4135e3bc2["Data"] = "data";
    $60fadef21a2daafc$export$3157d57b4135e3bc2["Media"] = "media";
  })($60fadef21a2daafc$export$3157d57b4135e3bc || ($60fadef21a2daafc$export$3157d57b4135e3bc = {}));
  var $60fadef21a2daafc$export$9547aaa2e39030ff;
  (function($60fadef21a2daafc$export$9547aaa2e39030ff2) {
    $60fadef21a2daafc$export$9547aaa2e39030ff2["BrowserIncompatible"] = "browser-incompatible";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["Disconnected"] = "disconnected";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["InvalidID"] = "invalid-id";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["InvalidKey"] = "invalid-key";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["Network"] = "network";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["PeerUnavailable"] = "peer-unavailable";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["SslUnavailable"] = "ssl-unavailable";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["ServerError"] = "server-error";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["SocketError"] = "socket-error";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["SocketClosed"] = "socket-closed";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["UnavailableID"] = "unavailable-id";
    $60fadef21a2daafc$export$9547aaa2e39030ff2["WebRTC"] = "webrtc";
  })($60fadef21a2daafc$export$9547aaa2e39030ff || ($60fadef21a2daafc$export$9547aaa2e39030ff = {}));
  var $60fadef21a2daafc$export$89f507cf986a947;
  (function($60fadef21a2daafc$export$89f507cf986a9472) {
    $60fadef21a2daafc$export$89f507cf986a9472["Binary"] = "binary";
    $60fadef21a2daafc$export$89f507cf986a9472["BinaryUTF8"] = "binary-utf8";
    $60fadef21a2daafc$export$89f507cf986a9472["JSON"] = "json";
  })($60fadef21a2daafc$export$89f507cf986a947 || ($60fadef21a2daafc$export$89f507cf986a947 = {}));
  var $60fadef21a2daafc$export$3b5c4a4b6354f023;
  (function($60fadef21a2daafc$export$3b5c4a4b6354f0232) {
    $60fadef21a2daafc$export$3b5c4a4b6354f0232["Message"] = "message";
    $60fadef21a2daafc$export$3b5c4a4b6354f0232["Disconnected"] = "disconnected";
    $60fadef21a2daafc$export$3b5c4a4b6354f0232["Error"] = "error";
    $60fadef21a2daafc$export$3b5c4a4b6354f0232["Close"] = "close";
  })($60fadef21a2daafc$export$3b5c4a4b6354f023 || ($60fadef21a2daafc$export$3b5c4a4b6354f023 = {}));
  var $60fadef21a2daafc$export$adb4a1754da6f10d;
  (function($60fadef21a2daafc$export$adb4a1754da6f10d2) {
    $60fadef21a2daafc$export$adb4a1754da6f10d2["Heartbeat"] = "HEARTBEAT";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["Candidate"] = "CANDIDATE";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["Offer"] = "OFFER";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["Answer"] = "ANSWER";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["Open"] = "OPEN";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["Error"] = "ERROR";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["IdTaken"] = "ID-TAKEN";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["InvalidKey"] = "INVALID-KEY";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["Leave"] = "LEAVE";
    $60fadef21a2daafc$export$adb4a1754da6f10d2["Expire"] = "EXPIRE";
  })($60fadef21a2daafc$export$adb4a1754da6f10d || ($60fadef21a2daafc$export$adb4a1754da6f10d = {}));
  var $0d1ed891c5cb27c0$exports = {};
  $0d1ed891c5cb27c0$exports = JSON.parse('{"name":"peerjs","version":"1.4.7","keywords":["peerjs","webrtc","p2p","rtc"],"description":"PeerJS client","homepage":"https://peerjs.com","bugs":{"url":"https://github.com/peers/peerjs/issues"},"repository":{"type":"git","url":"https://github.com/peers/peerjs"},"license":"MIT","contributors":["Michelle Bu <michelle@michellebu.com>","afrokick <devbyru@gmail.com>","ericz <really.ez@gmail.com>","Jairo <kidandcat@gmail.com>","Jonas Gloning <34194370+jonasgloning@users.noreply.github.com>","Jairo Caro-Accino Viciana <jairo@galax.be>","Carlos Caballero <carlos.caballero.gonzalez@gmail.com>","hc <hheennrryy@gmail.com>","Muhammad Asif <capripio@gmail.com>","PrashoonB <prashoonbhattacharjee@gmail.com>","Harsh Bardhan Mishra <47351025+HarshCasper@users.noreply.github.com>","akotynski <aleksanderkotbury@gmail.com>","lmb <i@lmb.io>","Jairooo <jairocaro@msn.com>","Moritz St\xFCckler <moritz.stueckler@gmail.com>","Simon <crydotsnakegithub@gmail.com>","Denis Lukov <denismassters@gmail.com>","Philipp Hancke <fippo@andyet.net>","Hans Oksendahl <hansoksendahl@gmail.com>","Jess <jessachandler@gmail.com>","khankuan <khankuan@gmail.com>","DUODVK <kurmanov.work@gmail.com>","XiZhao <kwang1imsa@gmail.com>","Matthias Lohr <matthias@lohr.me>","=frank tree <=frnktrb@googlemail.com>","Andre Eckardt <aeckardt@outlook.com>","Chris Cowan <agentme49@gmail.com>","Alex Chuev <alex@chuev.com>","alxnull <alxnull@e.mail.de>","Yemel Jardi <angel.jardi@gmail.com>","Ben Parnell <benjaminparnell.94@gmail.com>","Benny Lichtner <bennlich@gmail.com>","fresheneesz <bitetrudpublic@gmail.com>","bob.barstead@exaptive.com <bob.barstead@exaptive.com>","chandika <chandika@gmail.com>","emersion <contact@emersion.fr>","Christopher Van <cvan@users.noreply.github.com>","eddieherm <edhermoso@gmail.com>","Eduardo Pinho <enet4mikeenet@gmail.com>","Evandro Zanatta <ezanatta@tray.net.br>","Gardner Bickford <gardner@users.noreply.github.com>","Gian Luca <gianluca.cecchi@cynny.com>","PatrickJS <github@gdi2290.com>","jonnyf <github@jonathanfoss.co.uk>","Hizkia Felix <hizkifw@gmail.com>","Hristo Oskov <hristo.oskov@gmail.com>","Isaac Madwed <i.madwed@gmail.com>","Ilya Konanykhin <ilya.konanykhin@gmail.com>","jasonbarry <jasbarry@me.com>","Jonathan Burke <jonathan.burke.1311@googlemail.com>","Josh Hamit <josh.hamit@gmail.com>","Jordan Austin <jrax86@gmail.com>","Joel Wetzell <jwetzell@yahoo.com>","xizhao <kevin.wang@cloudera.com>","Alberto Torres <kungfoobar@gmail.com>","Jonathan Mayol <mayoljonathan@gmail.com>","Jefferson Felix <me@jsfelix.dev>","Rolf Erik Lekang <me@rolflekang.com>","Kevin Mai-Husan Chia <mhchia@users.noreply.github.com>","Pepijn de Vos <pepijndevos@gmail.com>","JooYoung <qkdlql@naver.com>","Tobias Speicher <rootcommander@gmail.com>","Steve Blaurock <sblaurock@gmail.com>","Kyrylo Shegeda <shegeda@ualberta.ca>","Diwank Singh Tomer <singh@diwank.name>","So\u0308ren Balko <Soeren.Balko@gmail.com>","Arpit Solanki <solankiarpit1997@gmail.com>","Yuki Ito <yuki@gnnk.net>","Artur Zayats <zag2art@gmail.com>"],"funding":{"type":"opencollective","url":"https://opencollective.com/peer"},"collective":{"type":"opencollective","url":"https://opencollective.com/peer"},"files":["dist/*"],"sideEffects":["lib/global.ts","lib/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/peerjs.min.js","browser-unminified":"dist/peerjs.js","types":"dist/types.d.ts","engines":{"node":">= 10"},"targets":{"types":{"source":"lib/exports.ts"},"main":{"source":"lib/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"lib/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"cover 99%, not dead"},"source":"lib/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"cover 99%, not dead"},"source":"lib/global.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit","watch":"parcel watch","build":"rm -rf dist && parcel build","prepublishOnly":"npm run build","test":"mocha -r ts-node/register -r jsdom-global/register test/**/*.ts","format":"prettier --write .","semantic-release":"semantic-release"},"devDependencies":{"@parcel/config-default":"^2.5.0","@parcel/packager-ts":"^2.5.0","@parcel/transformer-typescript-tsc":"^2.5.0","@parcel/transformer-typescript-types":"^2.5.0","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@types/chai":"^4.3.0","@types/mocha":"^9.1.0","@types/node":"^17.0.18","chai":"^4.3.6","git-authors-cli":"^1.0.40","jsdom":"^19.0.0","jsdom-global":"^3.0.2","mocha":"^9.2.0","mock-socket":"8.0.5","parcel":"^2.5.0","parcel-transformer-tsc-sourcemaps":"^1.0.2","prettier":"^2.6.2","semantic-release":"^19.0.2","standard":"^16.0.4","ts-node":"^10.5.0","typescript":"^4.5.5"},"dependencies":{"@swc/helpers":"^0.3.13","eventemitter3":"^4.0.7","peerjs-js-binarypack":"1.0.1","webrtc-adapter":"^7.7.1"}}');
  var $31d11a8d122cb4b7$var$__extends = function() {
    var extendStatics = function(d1, b1) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      return extendStatics(d1, b1);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var $31d11a8d122cb4b7$var$__read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = {
        error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var $31d11a8d122cb4b7$var$__spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++)
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var $31d11a8d122cb4b7$var$__values = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var $31d11a8d122cb4b7$export$4798917dbf149b79 = function(_super) {
    $31d11a8d122cb4b7$var$__extends($31d11a8d122cb4b7$export$4798917dbf149b792, _super);
    function $31d11a8d122cb4b7$export$4798917dbf149b792(secure, host, port, path, key, pingInterval) {
      if (pingInterval === void 0)
        pingInterval = 5e3;
      var _this = _super.call(this) || this;
      _this.pingInterval = pingInterval;
      _this._disconnected = true;
      _this._messagesQueue = [];
      var wsProtocol = secure ? "wss://" : "ws://";
      _this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
      return _this;
    }
    $31d11a8d122cb4b7$export$4798917dbf149b792.prototype.start = function(id, token) {
      var _this = this;
      this._id = id;
      var wsUrl = "".concat(this._baseUrl, "&id=").concat(id, "&token=").concat(token);
      if (!!this._socket || !this._disconnected)
        return;
      this._socket = new WebSocket(wsUrl + "&version=" + $0d1ed891c5cb27c0$exports.version);
      this._disconnected = false;
      this._socket.onmessage = function(event) {
        var data;
        try {
          data = JSON.parse(event.data);
          $1615705ecc6adca3$exports.default.log("Server message received:", data);
        } catch (e) {
          $1615705ecc6adca3$exports.default.log("Invalid server message", event.data);
          return;
        }
        _this.emit($60fadef21a2daafc$export$3b5c4a4b6354f023.Message, data);
      };
      this._socket.onclose = function(event) {
        if (_this._disconnected)
          return;
        $1615705ecc6adca3$exports.default.log("Socket closed.", event);
        _this._cleanup();
        _this._disconnected = true;
        _this.emit($60fadef21a2daafc$export$3b5c4a4b6354f023.Disconnected);
      };
      this._socket.onopen = function() {
        if (_this._disconnected)
          return;
        _this._sendQueuedMessages();
        $1615705ecc6adca3$exports.default.log("Socket open");
        _this._scheduleHeartbeat();
      };
    };
    $31d11a8d122cb4b7$export$4798917dbf149b792.prototype._scheduleHeartbeat = function() {
      var _this = this;
      this._wsPingTimer = setTimeout(function() {
        _this._sendHeartbeat();
      }, this.pingInterval);
    };
    $31d11a8d122cb4b7$export$4798917dbf149b792.prototype._sendHeartbeat = function() {
      if (!this._wsOpen()) {
        $1615705ecc6adca3$exports.default.log("Cannot send heartbeat, because socket closed");
        return;
      }
      var message = JSON.stringify({
        type: $60fadef21a2daafc$export$adb4a1754da6f10d.Heartbeat
      });
      this._socket.send(message);
      this._scheduleHeartbeat();
    };
    $31d11a8d122cb4b7$export$4798917dbf149b792.prototype._wsOpen = function() {
      return !!this._socket && this._socket.readyState === 1;
    };
    $31d11a8d122cb4b7$export$4798917dbf149b792.prototype._sendQueuedMessages = function() {
      var e_1, _a;
      var copiedQueue = $31d11a8d122cb4b7$var$__spreadArray([], $31d11a8d122cb4b7$var$__read(this._messagesQueue), false);
      this._messagesQueue = [];
      try {
        for (var copiedQueue_1 = $31d11a8d122cb4b7$var$__values(copiedQueue), copiedQueue_1_1 = copiedQueue_1.next(); !copiedQueue_1_1.done; copiedQueue_1_1 = copiedQueue_1.next()) {
          var message = copiedQueue_1_1.value;
          this.send(message);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (copiedQueue_1_1 && !copiedQueue_1_1.done && (_a = copiedQueue_1.return))
            _a.call(copiedQueue_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
    };
    $31d11a8d122cb4b7$export$4798917dbf149b792.prototype.send = function(data) {
      if (this._disconnected)
        return;
      if (!this._id) {
        this._messagesQueue.push(data);
        return;
      }
      if (!data.type) {
        this.emit($60fadef21a2daafc$export$3b5c4a4b6354f023.Error, "Invalid message");
        return;
      }
      if (!this._wsOpen())
        return;
      var message = JSON.stringify(data);
      this._socket.send(message);
    };
    $31d11a8d122cb4b7$export$4798917dbf149b792.prototype.close = function() {
      if (this._disconnected)
        return;
      this._cleanup();
      this._disconnected = true;
    };
    $31d11a8d122cb4b7$export$4798917dbf149b792.prototype._cleanup = function() {
      if (this._socket) {
        this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
        this._socket.close();
        this._socket = void 0;
      }
      clearTimeout(this._wsPingTimer);
    };
    return $31d11a8d122cb4b7$export$4798917dbf149b792;
  }($ac9b757d51178e15$exports.EventEmitter);
  var $353dee38f9ab557b$exports = {};
  $parcel$export($353dee38f9ab557b$exports, "MediaConnection", () => $353dee38f9ab557b$export$4a84e95a2324ac29, (v) => $353dee38f9ab557b$export$4a84e95a2324ac29 = v);
  var $77f14d3e81888156$exports = {};
  $parcel$export($77f14d3e81888156$exports, "Negotiator", () => $77f14d3e81888156$export$89e6bb5ad64bf4a, (v) => $77f14d3e81888156$export$89e6bb5ad64bf4a = v);
  var $77f14d3e81888156$var$__assign = function() {
    $77f14d3e81888156$var$__assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return $77f14d3e81888156$var$__assign.apply(this, arguments);
  };
  var $77f14d3e81888156$var$__awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var $77f14d3e81888156$var$__generator = function(thisArg, body) {
    var _ = {
      label: 0,
      sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    }, f, y, t, g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([
          n,
          v
        ]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [
              op[0] & 2,
              t.value
            ];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [
                0
              ];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [
            6,
            e
          ];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  };
  var $77f14d3e81888156$export$89e6bb5ad64bf4a = function() {
    function $77f14d3e81888156$export$89e6bb5ad64bf4a2(connection) {
      this.connection = connection;
    }
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype.startConnection = function(options) {
      var peerConnection = this._startPeerConnection();
      this.connection.peerConnection = peerConnection;
      if (this.connection.type === $60fadef21a2daafc$export$3157d57b4135e3bc.Media && options._stream)
        this._addTracksToConnection(options._stream, peerConnection);
      if (options.originator) {
        if (this.connection.type === $60fadef21a2daafc$export$3157d57b4135e3bc.Data) {
          var dataConnection = this.connection;
          var config = {
            ordered: !!options.reliable
          };
          var dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
          dataConnection.initialize(dataChannel);
        }
        this._makeOffer();
      } else
        this.handleSDP("OFFER", options.sdp);
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype._startPeerConnection = function() {
      $1615705ecc6adca3$exports.default.log("Creating RTCPeerConnection.");
      var peerConnection = new RTCPeerConnection(this.connection.provider.options.config);
      this._setupListeners(peerConnection);
      return peerConnection;
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype._setupListeners = function(peerConnection) {
      var _this = this;
      var peerId = this.connection.peer;
      var connectionId = this.connection.connectionId;
      var connectionType = this.connection.type;
      var provider = this.connection.provider;
      $1615705ecc6adca3$exports.default.log("Listening for ICE candidates.");
      peerConnection.onicecandidate = function(evt) {
        if (!evt.candidate || !evt.candidate.candidate)
          return;
        $1615705ecc6adca3$exports.default.log("Received ICE candidates for ".concat(peerId, ":"), evt.candidate);
        provider.socket.send({
          type: $60fadef21a2daafc$export$adb4a1754da6f10d.Candidate,
          payload: {
            candidate: evt.candidate,
            type: connectionType,
            connectionId
          },
          dst: peerId
        });
      };
      peerConnection.oniceconnectionstatechange = function() {
        switch (peerConnection.iceConnectionState) {
          case "failed":
            $1615705ecc6adca3$exports.default.log("iceConnectionState is failed, closing connections to " + peerId);
            _this.connection.emit("error", new Error("Negotiation of connection to " + peerId + " failed."));
            _this.connection.close();
            break;
          case "closed":
            $1615705ecc6adca3$exports.default.log("iceConnectionState is closed, closing connections to " + peerId);
            _this.connection.emit("error", new Error("Connection to " + peerId + " closed."));
            _this.connection.close();
            break;
          case "disconnected":
            $1615705ecc6adca3$exports.default.log("iceConnectionState changed to disconnected on the connection with " + peerId);
            break;
          case "completed":
            peerConnection.onicecandidate = $06cb531ed7840f78$export$7debb50ef11d5e0b.noop;
            break;
        }
        _this.connection.emit("iceStateChanged", peerConnection.iceConnectionState);
      };
      $1615705ecc6adca3$exports.default.log("Listening for data channel");
      peerConnection.ondatachannel = function(evt) {
        $1615705ecc6adca3$exports.default.log("Received data channel");
        var dataChannel = evt.channel;
        var connection = provider.getConnection(peerId, connectionId);
        connection.initialize(dataChannel);
      };
      $1615705ecc6adca3$exports.default.log("Listening for remote stream");
      peerConnection.ontrack = function(evt) {
        $1615705ecc6adca3$exports.default.log("Received remote stream");
        var stream = evt.streams[0];
        var connection = provider.getConnection(peerId, connectionId);
        if (connection.type === $60fadef21a2daafc$export$3157d57b4135e3bc.Media) {
          var mediaConnection = connection;
          _this._addStreamToMediaConnection(stream, mediaConnection);
        }
      };
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype.cleanup = function() {
      $1615705ecc6adca3$exports.default.log("Cleaning up PeerConnection to " + this.connection.peer);
      var peerConnection = this.connection.peerConnection;
      if (!peerConnection)
        return;
      this.connection.peerConnection = null;
      peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = function() {
      };
      var peerConnectionNotClosed = peerConnection.signalingState !== "closed";
      var dataChannelNotClosed = false;
      if (this.connection.type === $60fadef21a2daafc$export$3157d57b4135e3bc.Data) {
        var dataConnection = this.connection;
        var dataChannel = dataConnection.dataChannel;
        if (dataChannel)
          dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
      }
      if (peerConnectionNotClosed || dataChannelNotClosed)
        peerConnection.close();
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype._makeOffer = function() {
      return $77f14d3e81888156$var$__awaiter(this, void 0, Promise, function() {
        var peerConnection, provider, offer, payload, dataConnection, err_2, err_1_1;
        return $77f14d3e81888156$var$__generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              peerConnection = this.connection.peerConnection;
              provider = this.connection.provider;
              _a.label = 1;
            case 1:
              _a.trys.push([
                1,
                7,
                ,
                8
              ]);
              return [
                4,
                peerConnection.createOffer(this.connection.options.constraints)
              ];
            case 2:
              offer = _a.sent();
              $1615705ecc6adca3$exports.default.log("Created offer.");
              if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function")
                offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
              _a.label = 3;
            case 3:
              _a.trys.push([
                3,
                5,
                ,
                6
              ]);
              return [
                4,
                peerConnection.setLocalDescription(offer)
              ];
            case 4:
              _a.sent();
              $1615705ecc6adca3$exports.default.log("Set localDescription:", offer, "for:".concat(this.connection.peer));
              payload = {
                sdp: offer,
                type: this.connection.type,
                connectionId: this.connection.connectionId,
                metadata: this.connection.metadata,
                browser: $06cb531ed7840f78$export$7debb50ef11d5e0b.browser
              };
              if (this.connection.type === $60fadef21a2daafc$export$3157d57b4135e3bc.Data) {
                dataConnection = this.connection;
                payload = $77f14d3e81888156$var$__assign($77f14d3e81888156$var$__assign({}, payload), {
                  label: dataConnection.label,
                  reliable: dataConnection.reliable,
                  serialization: dataConnection.serialization
                });
              }
              provider.socket.send({
                type: $60fadef21a2daafc$export$adb4a1754da6f10d.Offer,
                payload,
                dst: this.connection.peer
              });
              return [
                3,
                6
              ];
            case 5:
              err_2 = _a.sent();
              if (err_2 != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
                provider.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.WebRTC, err_2);
                $1615705ecc6adca3$exports.default.log("Failed to setLocalDescription, ", err_2);
              }
              return [
                3,
                6
              ];
            case 6:
              return [
                3,
                8
              ];
            case 7:
              err_1_1 = _a.sent();
              provider.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.WebRTC, err_1_1);
              $1615705ecc6adca3$exports.default.log("Failed to createOffer, ", err_1_1);
              return [
                3,
                8
              ];
            case 8:
              return [
                2
              ];
          }
        });
      });
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype._makeAnswer = function() {
      return $77f14d3e81888156$var$__awaiter(this, void 0, Promise, function() {
        var peerConnection, provider, answer, err_3, err_1_2;
        return $77f14d3e81888156$var$__generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              peerConnection = this.connection.peerConnection;
              provider = this.connection.provider;
              _a.label = 1;
            case 1:
              _a.trys.push([
                1,
                7,
                ,
                8
              ]);
              return [
                4,
                peerConnection.createAnswer()
              ];
            case 2:
              answer = _a.sent();
              $1615705ecc6adca3$exports.default.log("Created answer.");
              if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function")
                answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
              _a.label = 3;
            case 3:
              _a.trys.push([
                3,
                5,
                ,
                6
              ]);
              return [
                4,
                peerConnection.setLocalDescription(answer)
              ];
            case 4:
              _a.sent();
              $1615705ecc6adca3$exports.default.log("Set localDescription:", answer, "for:".concat(this.connection.peer));
              provider.socket.send({
                type: $60fadef21a2daafc$export$adb4a1754da6f10d.Answer,
                payload: {
                  sdp: answer,
                  type: this.connection.type,
                  connectionId: this.connection.connectionId,
                  browser: $06cb531ed7840f78$export$7debb50ef11d5e0b.browser
                },
                dst: this.connection.peer
              });
              return [
                3,
                6
              ];
            case 5:
              err_3 = _a.sent();
              provider.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.WebRTC, err_3);
              $1615705ecc6adca3$exports.default.log("Failed to setLocalDescription, ", err_3);
              return [
                3,
                6
              ];
            case 6:
              return [
                3,
                8
              ];
            case 7:
              err_1_2 = _a.sent();
              provider.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.WebRTC, err_1_2);
              $1615705ecc6adca3$exports.default.log("Failed to create answer, ", err_1_2);
              return [
                3,
                8
              ];
            case 8:
              return [
                2
              ];
          }
        });
      });
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype.handleSDP = function(type3, sdp) {
      return $77f14d3e81888156$var$__awaiter(this, void 0, Promise, function() {
        var peerConnection, provider, self, err_4;
        return $77f14d3e81888156$var$__generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              sdp = new RTCSessionDescription(sdp);
              peerConnection = this.connection.peerConnection;
              provider = this.connection.provider;
              $1615705ecc6adca3$exports.default.log("Setting remote description", sdp);
              self = this;
              _a.label = 1;
            case 1:
              _a.trys.push([
                1,
                5,
                ,
                6
              ]);
              return [
                4,
                peerConnection.setRemoteDescription(sdp)
              ];
            case 2:
              _a.sent();
              $1615705ecc6adca3$exports.default.log("Set remoteDescription:".concat(type3, " for:").concat(this.connection.peer));
              if (!(type3 === "OFFER"))
                return [
                  3,
                  4
                ];
              return [
                4,
                self._makeAnswer()
              ];
            case 3:
              _a.sent();
              _a.label = 4;
            case 4:
              return [
                3,
                6
              ];
            case 5:
              err_4 = _a.sent();
              provider.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.WebRTC, err_4);
              $1615705ecc6adca3$exports.default.log("Failed to setRemoteDescription, ", err_4);
              return [
                3,
                6
              ];
            case 6:
              return [
                2
              ];
          }
        });
      });
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype.handleCandidate = function(ice) {
      return $77f14d3e81888156$var$__awaiter(this, void 0, Promise, function() {
        var candidate, sdpMLineIndex, sdpMid, peerConnection, provider, err_5;
        return $77f14d3e81888156$var$__generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              $1615705ecc6adca3$exports.default.log("handleCandidate:", ice);
              candidate = ice.candidate;
              sdpMLineIndex = ice.sdpMLineIndex;
              sdpMid = ice.sdpMid;
              peerConnection = this.connection.peerConnection;
              provider = this.connection.provider;
              _a.label = 1;
            case 1:
              _a.trys.push([
                1,
                3,
                ,
                4
              ]);
              return [
                4,
                peerConnection.addIceCandidate(new RTCIceCandidate({
                  sdpMid,
                  sdpMLineIndex,
                  candidate
                }))
              ];
            case 2:
              _a.sent();
              $1615705ecc6adca3$exports.default.log("Added ICE candidate for:".concat(this.connection.peer));
              return [
                3,
                4
              ];
            case 3:
              err_5 = _a.sent();
              provider.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.WebRTC, err_5);
              $1615705ecc6adca3$exports.default.log("Failed to handleCandidate, ", err_5);
              return [
                3,
                4
              ];
            case 4:
              return [
                2
              ];
          }
        });
      });
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype._addTracksToConnection = function(stream, peerConnection) {
      $1615705ecc6adca3$exports.default.log("add tracks from stream ".concat(stream.id, " to peer connection"));
      if (!peerConnection.addTrack)
        return $1615705ecc6adca3$exports.default.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");
      stream.getTracks().forEach(function(track) {
        peerConnection.addTrack(track, stream);
      });
    };
    $77f14d3e81888156$export$89e6bb5ad64bf4a2.prototype._addStreamToMediaConnection = function(stream, mediaConnection) {
      $1615705ecc6adca3$exports.default.log("add stream ".concat(stream.id, " to media connection ").concat(mediaConnection.connectionId));
      mediaConnection.addStream(stream);
    };
    return $77f14d3e81888156$export$89e6bb5ad64bf4a2;
  }();
  var $0b3b332fd86c5202$exports = {};
  $parcel$export($0b3b332fd86c5202$exports, "BaseConnection", () => $0b3b332fd86c5202$export$23a2a68283c24d80, (v) => $0b3b332fd86c5202$export$23a2a68283c24d80 = v);
  var $0b3b332fd86c5202$var$__extends = function() {
    var extendStatics = function(d1, b1) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      return extendStatics(d1, b1);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var $0b3b332fd86c5202$export$23a2a68283c24d80 = function(_super) {
    $0b3b332fd86c5202$var$__extends($0b3b332fd86c5202$export$23a2a68283c24d802, _super);
    function $0b3b332fd86c5202$export$23a2a68283c24d802(peer2, provider, options) {
      var _this = _super.call(this) || this;
      _this.peer = peer2;
      _this.provider = provider;
      _this.options = options;
      _this._open = false;
      _this.metadata = options.metadata;
      return _this;
    }
    Object.defineProperty($0b3b332fd86c5202$export$23a2a68283c24d802.prototype, "open", {
      get: function() {
        return this._open;
      },
      enumerable: false,
      configurable: true
    });
    return $0b3b332fd86c5202$export$23a2a68283c24d802;
  }($ac9b757d51178e15$exports.EventEmitter);
  var $353dee38f9ab557b$var$__extends = function() {
    var extendStatics = function(d1, b1) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      return extendStatics(d1, b1);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var $353dee38f9ab557b$var$__assign = function() {
    $353dee38f9ab557b$var$__assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return $353dee38f9ab557b$var$__assign.apply(this, arguments);
  };
  var $353dee38f9ab557b$var$__values = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var $353dee38f9ab557b$export$4a84e95a2324ac29 = function(_super) {
    $353dee38f9ab557b$var$__extends($353dee38f9ab557b$export$4a84e95a2324ac292, _super);
    function $353dee38f9ab557b$export$4a84e95a2324ac292(peerId, provider, options) {
      var _this = _super.call(this, peerId, provider, options) || this;
      _this._localStream = _this.options._stream;
      _this.connectionId = _this.options.connectionId || $353dee38f9ab557b$export$4a84e95a2324ac292.ID_PREFIX + $06cb531ed7840f78$export$7debb50ef11d5e0b.randomToken();
      _this._negotiator = new $77f14d3e81888156$exports.Negotiator(_this);
      if (_this._localStream)
        _this._negotiator.startConnection({
          _stream: _this._localStream,
          originator: true
        });
      return _this;
    }
    Object.defineProperty($353dee38f9ab557b$export$4a84e95a2324ac292.prototype, "type", {
      get: function() {
        return $60fadef21a2daafc$export$3157d57b4135e3bc.Media;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($353dee38f9ab557b$export$4a84e95a2324ac292.prototype, "localStream", {
      get: function() {
        return this._localStream;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($353dee38f9ab557b$export$4a84e95a2324ac292.prototype, "remoteStream", {
      get: function() {
        return this._remoteStream;
      },
      enumerable: false,
      configurable: true
    });
    $353dee38f9ab557b$export$4a84e95a2324ac292.prototype.addStream = function(remoteStream) {
      $1615705ecc6adca3$exports.default.log("Receiving stream", remoteStream);
      this._remoteStream = remoteStream;
      _super.prototype.emit.call(this, "stream", remoteStream);
    };
    $353dee38f9ab557b$export$4a84e95a2324ac292.prototype.handleMessage = function(message) {
      var type3 = message.type;
      var payload = message.payload;
      switch (message.type) {
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Answer:
          this._negotiator.handleSDP(type3, payload.sdp);
          this._open = true;
          break;
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Candidate:
          this._negotiator.handleCandidate(payload.candidate);
          break;
        default:
          $1615705ecc6adca3$exports.default.warn("Unrecognized message type:".concat(type3, " from peer:").concat(this.peer));
          break;
      }
    };
    $353dee38f9ab557b$export$4a84e95a2324ac292.prototype.answer = function(stream, options) {
      var e_1, _a;
      if (options === void 0)
        options = {};
      if (this._localStream) {
        $1615705ecc6adca3$exports.default.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
        return;
      }
      this._localStream = stream;
      if (options && options.sdpTransform)
        this.options.sdpTransform = options.sdpTransform;
      this._negotiator.startConnection($353dee38f9ab557b$var$__assign($353dee38f9ab557b$var$__assign({}, this.options._payload), {
        _stream: stream
      }));
      var messages = this.provider._getMessages(this.connectionId);
      try {
        for (var messages_1 = $353dee38f9ab557b$var$__values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
          var message = messages_1_1.value;
          this.handleMessage(message);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return))
            _a.call(messages_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      this._open = true;
    };
    $353dee38f9ab557b$export$4a84e95a2324ac292.prototype.close = function() {
      if (this._negotiator) {
        this._negotiator.cleanup();
        this._negotiator = null;
      }
      this._localStream = null;
      this._remoteStream = null;
      if (this.provider) {
        this.provider._removeConnection(this);
        this.provider = null;
      }
      if (this.options && this.options._stream)
        this.options._stream = null;
      if (!this.open)
        return;
      this._open = false;
      _super.prototype.emit.call(this, "close");
    };
    $353dee38f9ab557b$export$4a84e95a2324ac292.ID_PREFIX = "mc_";
    return $353dee38f9ab557b$export$4a84e95a2324ac292;
  }($0b3b332fd86c5202$exports.BaseConnection);
  var $3356170d7bce7f20$exports = {};
  $parcel$export($3356170d7bce7f20$exports, "DataConnection", () => $3356170d7bce7f20$export$d365f7ad9d7df9c9, (v) => $3356170d7bce7f20$export$d365f7ad9d7df9c9 = v);
  var $3014d862dcc9946b$exports = {};
  $parcel$export($3014d862dcc9946b$exports, "EncodingQueue", () => $3014d862dcc9946b$export$c6913ae0ed687038, (v) => $3014d862dcc9946b$export$c6913ae0ed687038 = v);
  var $3014d862dcc9946b$var$__extends = function() {
    var extendStatics = function(d1, b1) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      return extendStatics(d1, b1);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var $3014d862dcc9946b$export$c6913ae0ed687038 = function(_super) {
    $3014d862dcc9946b$var$__extends($3014d862dcc9946b$export$c6913ae0ed6870382, _super);
    function $3014d862dcc9946b$export$c6913ae0ed6870382() {
      var _this = _super.call(this) || this;
      _this.fileReader = new FileReader();
      _this._queue = [];
      _this._processing = false;
      _this.fileReader.onload = function(evt) {
        _this._processing = false;
        if (evt.target)
          _this.emit("done", evt.target.result);
        _this.doNextTask();
      };
      _this.fileReader.onerror = function(evt) {
        $1615705ecc6adca3$exports.default.error("EncodingQueue error:", evt);
        _this._processing = false;
        _this.destroy();
        _this.emit("error", evt);
      };
      return _this;
    }
    Object.defineProperty($3014d862dcc9946b$export$c6913ae0ed6870382.prototype, "queue", {
      get: function() {
        return this._queue;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($3014d862dcc9946b$export$c6913ae0ed6870382.prototype, "size", {
      get: function() {
        return this.queue.length;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($3014d862dcc9946b$export$c6913ae0ed6870382.prototype, "processing", {
      get: function() {
        return this._processing;
      },
      enumerable: false,
      configurable: true
    });
    $3014d862dcc9946b$export$c6913ae0ed6870382.prototype.enque = function(blob) {
      this.queue.push(blob);
      if (this.processing)
        return;
      this.doNextTask();
    };
    $3014d862dcc9946b$export$c6913ae0ed6870382.prototype.destroy = function() {
      this.fileReader.abort();
      this._queue = [];
    };
    $3014d862dcc9946b$export$c6913ae0ed6870382.prototype.doNextTask = function() {
      if (this.size === 0)
        return;
      if (this.processing)
        return;
      this._processing = true;
      this.fileReader.readAsArrayBuffer(this.queue.shift());
    };
    return $3014d862dcc9946b$export$c6913ae0ed6870382;
  }($ac9b757d51178e15$exports.EventEmitter);
  var $3356170d7bce7f20$var$__extends = function() {
    var extendStatics = function(d1, b1) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      return extendStatics(d1, b1);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var $3356170d7bce7f20$var$__values = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var $3356170d7bce7f20$export$d365f7ad9d7df9c9 = function(_super) {
    $3356170d7bce7f20$var$__extends($3356170d7bce7f20$export$d365f7ad9d7df9c92, _super);
    function $3356170d7bce7f20$export$d365f7ad9d7df9c92(peerId, provider, options) {
      var _this = _super.call(this, peerId, provider, options) || this;
      _this.stringify = JSON.stringify;
      _this.parse = JSON.parse;
      _this._buffer = [];
      _this._bufferSize = 0;
      _this._buffering = false;
      _this._chunkedData = {};
      _this._encodingQueue = new $3014d862dcc9946b$exports.EncodingQueue();
      _this.connectionId = _this.options.connectionId || $3356170d7bce7f20$export$d365f7ad9d7df9c92.ID_PREFIX + $06cb531ed7840f78$export$7debb50ef11d5e0b.randomToken();
      _this.label = _this.options.label || _this.connectionId;
      _this.serialization = _this.options.serialization || $60fadef21a2daafc$export$89f507cf986a947.Binary;
      _this.reliable = !!_this.options.reliable;
      _this._encodingQueue.on("done", function(ab) {
        _this._bufferedSend(ab);
      });
      _this._encodingQueue.on("error", function() {
        $1615705ecc6adca3$exports.default.error("DC#".concat(_this.connectionId, ": Error occured in encoding from blob to arraybuffer, close DC"));
        _this.close();
      });
      _this._negotiator = new $77f14d3e81888156$exports.Negotiator(_this);
      _this._negotiator.startConnection(_this.options._payload || {
        originator: true
      });
      return _this;
    }
    Object.defineProperty($3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype, "type", {
      get: function() {
        return $60fadef21a2daafc$export$3157d57b4135e3bc.Data;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype, "dataChannel", {
      get: function() {
        return this._dc;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype, "bufferSize", {
      get: function() {
        return this._bufferSize;
      },
      enumerable: false,
      configurable: true
    });
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype.initialize = function(dc) {
      this._dc = dc;
      this._configureDataChannel();
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype._configureDataChannel = function() {
      var _this = this;
      if (!$06cb531ed7840f78$export$7debb50ef11d5e0b.supports.binaryBlob || $06cb531ed7840f78$export$7debb50ef11d5e0b.supports.reliable)
        this.dataChannel.binaryType = "arraybuffer";
      this.dataChannel.onopen = function() {
        $1615705ecc6adca3$exports.default.log("DC#".concat(_this.connectionId, " dc connection success"));
        _this._open = true;
        _this.emit("open");
      };
      this.dataChannel.onmessage = function(e) {
        $1615705ecc6adca3$exports.default.log("DC#".concat(_this.connectionId, " dc onmessage:"), e.data);
        _this._handleDataMessage(e);
      };
      this.dataChannel.onclose = function() {
        $1615705ecc6adca3$exports.default.log("DC#".concat(_this.connectionId, " dc closed for:"), _this.peer);
        _this.close();
      };
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype._handleDataMessage = function(_a) {
      var _this = this;
      var data = _a.data;
      var datatype = data.constructor;
      var isBinarySerialization = this.serialization === $60fadef21a2daafc$export$89f507cf986a947.Binary || this.serialization === $60fadef21a2daafc$export$89f507cf986a947.BinaryUTF8;
      var deserializedData = data;
      if (isBinarySerialization) {
        if (datatype === Blob) {
          $06cb531ed7840f78$export$7debb50ef11d5e0b.blobToArrayBuffer(data, function(ab) {
            var unpackedData = $06cb531ed7840f78$export$7debb50ef11d5e0b.unpack(ab);
            _this.emit("data", unpackedData);
          });
          return;
        } else if (datatype === ArrayBuffer)
          deserializedData = $06cb531ed7840f78$export$7debb50ef11d5e0b.unpack(data);
        else if (datatype === String) {
          var ab1 = $06cb531ed7840f78$export$7debb50ef11d5e0b.binaryStringToArrayBuffer(data);
          deserializedData = $06cb531ed7840f78$export$7debb50ef11d5e0b.unpack(ab1);
        }
      } else if (this.serialization === $60fadef21a2daafc$export$89f507cf986a947.JSON)
        deserializedData = this.parse(data);
      if (deserializedData.__peerData) {
        this._handleChunk(deserializedData);
        return;
      }
      _super.prototype.emit.call(this, "data", deserializedData);
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype._handleChunk = function(data) {
      var id = data.__peerData;
      var chunkInfo = this._chunkedData[id] || {
        data: [],
        count: 0,
        total: data.total
      };
      chunkInfo.data[data.n] = data.data;
      chunkInfo.count++;
      this._chunkedData[id] = chunkInfo;
      if (chunkInfo.total === chunkInfo.count) {
        delete this._chunkedData[id];
        var data_1 = new Blob(chunkInfo.data);
        this._handleDataMessage({
          data: data_1
        });
      }
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype.close = function() {
      this._buffer = [];
      this._bufferSize = 0;
      this._chunkedData = {};
      if (this._negotiator) {
        this._negotiator.cleanup();
        this._negotiator = null;
      }
      if (this.provider) {
        this.provider._removeConnection(this);
        this.provider = null;
      }
      if (this.dataChannel) {
        this.dataChannel.onopen = null;
        this.dataChannel.onmessage = null;
        this.dataChannel.onclose = null;
        this._dc = null;
      }
      if (this._encodingQueue) {
        this._encodingQueue.destroy();
        this._encodingQueue.removeAllListeners();
        this._encodingQueue = null;
      }
      if (!this.open)
        return;
      this._open = false;
      _super.prototype.emit.call(this, "close");
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype.send = function(data, chunked) {
      if (!this.open) {
        _super.prototype.emit.call(this, "error", new Error("Connection is not open. You should listen for the `open` event before sending messages."));
        return;
      }
      if (this.serialization === $60fadef21a2daafc$export$89f507cf986a947.JSON)
        this._bufferedSend(this.stringify(data));
      else if (this.serialization === $60fadef21a2daafc$export$89f507cf986a947.Binary || this.serialization === $60fadef21a2daafc$export$89f507cf986a947.BinaryUTF8) {
        var blob = $06cb531ed7840f78$export$7debb50ef11d5e0b.pack(data);
        if (!chunked && blob.size > $06cb531ed7840f78$export$7debb50ef11d5e0b.chunkedMTU) {
          this._sendChunks(blob);
          return;
        }
        if (!$06cb531ed7840f78$export$7debb50ef11d5e0b.supports.binaryBlob)
          this._encodingQueue.enque(blob);
        else
          this._bufferedSend(blob);
      } else
        this._bufferedSend(data);
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype._bufferedSend = function(msg) {
      if (this._buffering || !this._trySend(msg)) {
        this._buffer.push(msg);
        this._bufferSize = this._buffer.length;
      }
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype._trySend = function(msg) {
      var _this = this;
      if (!this.open)
        return false;
      if (this.dataChannel.bufferedAmount > $3356170d7bce7f20$export$d365f7ad9d7df9c92.MAX_BUFFERED_AMOUNT) {
        this._buffering = true;
        setTimeout(function() {
          _this._buffering = false;
          _this._tryBuffer();
        }, 50);
        return false;
      }
      try {
        this.dataChannel.send(msg);
      } catch (e) {
        $1615705ecc6adca3$exports.default.error("DC#:".concat(this.connectionId, " Error when sending:"), e);
        this._buffering = true;
        this.close();
        return false;
      }
      return true;
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype._tryBuffer = function() {
      if (!this.open)
        return;
      if (this._buffer.length === 0)
        return;
      var msg = this._buffer[0];
      if (this._trySend(msg)) {
        this._buffer.shift();
        this._bufferSize = this._buffer.length;
        this._tryBuffer();
      }
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype._sendChunks = function(blob) {
      var e_1, _a;
      var blobs = $06cb531ed7840f78$export$7debb50ef11d5e0b.chunk(blob);
      $1615705ecc6adca3$exports.default.log("DC#".concat(this.connectionId, " Try to send ").concat(blobs.length, " chunks..."));
      try {
        for (var blobs_1 = $3356170d7bce7f20$var$__values(blobs), blobs_1_1 = blobs_1.next(); !blobs_1_1.done; blobs_1_1 = blobs_1.next()) {
          var blob_1 = blobs_1_1.value;
          this.send(blob_1, true);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (blobs_1_1 && !blobs_1_1.done && (_a = blobs_1.return))
            _a.call(blobs_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.prototype.handleMessage = function(message) {
      var payload = message.payload;
      switch (message.type) {
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Answer:
          this._negotiator.handleSDP(message.type, payload.sdp);
          break;
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Candidate:
          this._negotiator.handleCandidate(payload.candidate);
          break;
        default:
          $1615705ecc6adca3$exports.default.warn("Unrecognized message type:", message.type, "from peer:", this.peer);
          break;
      }
    };
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.ID_PREFIX = "dc_";
    $3356170d7bce7f20$export$d365f7ad9d7df9c92.MAX_BUFFERED_AMOUNT = 8388608;
    return $3356170d7bce7f20$export$d365f7ad9d7df9c92;
  }($0b3b332fd86c5202$exports.BaseConnection);
  var $9e85b3e1327369e6$exports = {};
  $parcel$export($9e85b3e1327369e6$exports, "API", () => $9e85b3e1327369e6$export$2c4e825dc9120f87, (v) => $9e85b3e1327369e6$export$2c4e825dc9120f87 = v);
  var $9e85b3e1327369e6$var$__awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var $9e85b3e1327369e6$var$__generator = function(thisArg, body) {
    var _ = {
      label: 0,
      sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    }, f, y, t, g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([
          n,
          v
        ]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [
              op[0] & 2,
              t.value
            ];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [
                0
              ];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [
            6,
            e
          ];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  };
  var $9e85b3e1327369e6$export$2c4e825dc9120f87 = function() {
    function $9e85b3e1327369e6$export$2c4e825dc9120f872(_options) {
      this._options = _options;
    }
    $9e85b3e1327369e6$export$2c4e825dc9120f872.prototype._buildRequest = function(method) {
      var protocol = this._options.secure ? "https" : "http";
      var _a = this._options, host = _a.host, port = _a.port, path = _a.path, key = _a.key;
      var url = new URL("".concat(protocol, "://").concat(host, ":").concat(port).concat(path).concat(key, "/").concat(method));
      url.searchParams.set("ts", "".concat(Date.now()).concat(Math.random()));
      url.searchParams.set("version", $0d1ed891c5cb27c0$exports.version);
      return fetch(url.href, {
        referrerPolicy: this._options.referrerPolicy
      });
    };
    $9e85b3e1327369e6$export$2c4e825dc9120f872.prototype.retrieveId = function() {
      return $9e85b3e1327369e6$var$__awaiter(this, void 0, Promise, function() {
        var response, error_1, pathError;
        return $9e85b3e1327369e6$var$__generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([
                0,
                2,
                ,
                3
              ]);
              return [
                4,
                this._buildRequest("id")
              ];
            case 1:
              response = _a.sent();
              if (response.status !== 200)
                throw new Error("Error. Status:".concat(response.status));
              return [
                2,
                response.text()
              ];
            case 2:
              error_1 = _a.sent();
              $1615705ecc6adca3$exports.default.error("Error retrieving ID", error_1);
              pathError = "";
              if (this._options.path === "/" && this._options.host !== $06cb531ed7840f78$export$7debb50ef11d5e0b.CLOUD_HOST)
                pathError = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer.";
              throw new Error("Could not get an ID from the server." + pathError);
            case 3:
              return [
                2
              ];
          }
        });
      });
    };
    $9e85b3e1327369e6$export$2c4e825dc9120f872.prototype.listAllPeers = function() {
      return $9e85b3e1327369e6$var$__awaiter(this, void 0, Promise, function() {
        var response, helpfulError, error_2;
        return $9e85b3e1327369e6$var$__generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([
                0,
                2,
                ,
                3
              ]);
              return [
                4,
                this._buildRequest("peers")
              ];
            case 1:
              response = _a.sent();
              if (response.status !== 200) {
                if (response.status === 401) {
                  helpfulError = "";
                  if (this._options.host === $06cb531ed7840f78$export$7debb50ef11d5e0b.CLOUD_HOST)
                    helpfulError = "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.";
                  else
                    helpfulError = "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.";
                  throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
                }
                throw new Error("Error. Status:".concat(response.status));
              }
              return [
                2,
                response.json()
              ];
            case 2:
              error_2 = _a.sent();
              $1615705ecc6adca3$exports.default.error("Error retrieving list peers", error_2);
              throw new Error("Could not get list peers from the server." + error_2);
            case 3:
              return [
                2
              ];
          }
        });
      });
    };
    return $9e85b3e1327369e6$export$2c4e825dc9120f872;
  }();
  var $26088d7da5b03f69$var$__extends = function() {
    var extendStatics = function(d1, b1) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      return extendStatics(d1, b1);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var $26088d7da5b03f69$var$__assign = function() {
    $26088d7da5b03f69$var$__assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return $26088d7da5b03f69$var$__assign.apply(this, arguments);
  };
  var $26088d7da5b03f69$var$__values = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var $26088d7da5b03f69$var$__read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = {
        error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var $26088d7da5b03f69$var$PeerOptions = function() {
    function PeerOptions() {
    }
    return PeerOptions;
  }();
  var $26088d7da5b03f69$export$ecd1fc136c422448 = function(_super) {
    $26088d7da5b03f69$var$__extends($26088d7da5b03f69$export$ecd1fc136c4224482, _super);
    function $26088d7da5b03f69$export$ecd1fc136c4224482(id1, options) {
      var _this = _super.call(this) || this;
      _this._id = null;
      _this._lastServerId = null;
      _this._destroyed = false;
      _this._disconnected = false;
      _this._open = false;
      _this._connections = /* @__PURE__ */ new Map();
      _this._lostMessages = /* @__PURE__ */ new Map();
      var userId;
      if (id1 && id1.constructor == Object)
        options = id1;
      else if (id1)
        userId = id1.toString();
      options = $26088d7da5b03f69$var$__assign({
        debug: 0,
        host: $06cb531ed7840f78$export$7debb50ef11d5e0b.CLOUD_HOST,
        port: $06cb531ed7840f78$export$7debb50ef11d5e0b.CLOUD_PORT,
        path: "/",
        key: $26088d7da5b03f69$export$ecd1fc136c4224482.DEFAULT_KEY,
        token: $06cb531ed7840f78$export$7debb50ef11d5e0b.randomToken(),
        config: $06cb531ed7840f78$export$7debb50ef11d5e0b.defaultConfig,
        referrerPolicy: "strict-origin-when-cross-origin"
      }, options);
      _this._options = options;
      if (_this._options.host === "/")
        _this._options.host = window.location.hostname;
      if (_this._options.path) {
        if (_this._options.path[0] !== "/")
          _this._options.path = "/" + _this._options.path;
        if (_this._options.path[_this._options.path.length - 1] !== "/")
          _this._options.path += "/";
      }
      if (_this._options.secure === void 0 && _this._options.host !== $06cb531ed7840f78$export$7debb50ef11d5e0b.CLOUD_HOST)
        _this._options.secure = $06cb531ed7840f78$export$7debb50ef11d5e0b.isSecure();
      else if (_this._options.host == $06cb531ed7840f78$export$7debb50ef11d5e0b.CLOUD_HOST)
        _this._options.secure = true;
      if (_this._options.logFunction)
        $1615705ecc6adca3$exports.default.setLogFunction(_this._options.logFunction);
      $1615705ecc6adca3$exports.default.logLevel = _this._options.debug || 0;
      _this._api = new $9e85b3e1327369e6$exports.API(options);
      _this._socket = _this._createServerConnection();
      if (!$06cb531ed7840f78$export$7debb50ef11d5e0b.supports.audioVideo && !$06cb531ed7840f78$export$7debb50ef11d5e0b.supports.data) {
        _this._delayedAbort($60fadef21a2daafc$export$9547aaa2e39030ff.BrowserIncompatible, "The current browser does not support WebRTC");
        return _this;
      }
      if (!!userId && !$06cb531ed7840f78$export$7debb50ef11d5e0b.validateId(userId)) {
        _this._delayedAbort($60fadef21a2daafc$export$9547aaa2e39030ff.InvalidID, 'ID "'.concat(userId, '" is invalid'));
        return _this;
      }
      if (userId)
        _this._initialize(userId);
      else
        _this._api.retrieveId().then(function(id) {
          return _this._initialize(id);
        }).catch(function(error) {
          return _this._abort($60fadef21a2daafc$export$9547aaa2e39030ff.ServerError, error);
        });
      return _this;
    }
    Object.defineProperty($26088d7da5b03f69$export$ecd1fc136c4224482.prototype, "id", {
      get: function() {
        return this._id;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($26088d7da5b03f69$export$ecd1fc136c4224482.prototype, "options", {
      get: function() {
        return this._options;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($26088d7da5b03f69$export$ecd1fc136c4224482.prototype, "open", {
      get: function() {
        return this._open;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($26088d7da5b03f69$export$ecd1fc136c4224482.prototype, "socket", {
      get: function() {
        return this._socket;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($26088d7da5b03f69$export$ecd1fc136c4224482.prototype, "connections", {
      get: function() {
        var e_1, _a;
        var plainConnections = /* @__PURE__ */ Object.create(null);
        try {
          for (var _b = $26088d7da5b03f69$var$__values(this._connections), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = $26088d7da5b03f69$var$__read(_c.value, 2), k = _d[0], v = _d[1];
            plainConnections[k] = v;
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return plainConnections;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($26088d7da5b03f69$export$ecd1fc136c4224482.prototype, "destroyed", {
      get: function() {
        return this._destroyed;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty($26088d7da5b03f69$export$ecd1fc136c4224482.prototype, "disconnected", {
      get: function() {
        return this._disconnected;
      },
      enumerable: false,
      configurable: true
    });
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._createServerConnection = function() {
      var _this = this;
      var socket = new $31d11a8d122cb4b7$exports.Socket(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
      socket.on($60fadef21a2daafc$export$3b5c4a4b6354f023.Message, function(data) {
        _this._handleMessage(data);
      });
      socket.on($60fadef21a2daafc$export$3b5c4a4b6354f023.Error, function(error) {
        _this._abort($60fadef21a2daafc$export$9547aaa2e39030ff.SocketError, error);
      });
      socket.on($60fadef21a2daafc$export$3b5c4a4b6354f023.Disconnected, function() {
        if (_this.disconnected)
          return;
        _this.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.Network, "Lost connection to server.");
        _this.disconnect();
      });
      socket.on($60fadef21a2daafc$export$3b5c4a4b6354f023.Close, function() {
        if (_this.disconnected)
          return;
        _this._abort($60fadef21a2daafc$export$9547aaa2e39030ff.SocketClosed, "Underlying socket is already closed.");
      });
      return socket;
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._initialize = function(id) {
      this._id = id;
      this.socket.start(id, this._options.token);
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._handleMessage = function(message) {
      var e_2, _a;
      var type3 = message.type;
      var payload = message.payload;
      var peerId = message.src;
      switch (type3) {
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Open:
          this._lastServerId = this.id;
          this._open = true;
          this.emit("open", this.id);
          break;
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Error:
          this._abort($60fadef21a2daafc$export$9547aaa2e39030ff.ServerError, payload.msg);
          break;
        case $60fadef21a2daafc$export$adb4a1754da6f10d.IdTaken:
          this._abort($60fadef21a2daafc$export$9547aaa2e39030ff.UnavailableID, 'ID "'.concat(this.id, '" is taken'));
          break;
        case $60fadef21a2daafc$export$adb4a1754da6f10d.InvalidKey:
          this._abort($60fadef21a2daafc$export$9547aaa2e39030ff.InvalidKey, 'API KEY "'.concat(this._options.key, '" is invalid'));
          break;
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Leave:
          $1615705ecc6adca3$exports.default.log("Received leave message from ".concat(peerId));
          this._cleanupPeer(peerId);
          this._connections.delete(peerId);
          break;
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Expire:
          this.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.PeerUnavailable, "Could not connect to peer ".concat(peerId));
          break;
        case $60fadef21a2daafc$export$adb4a1754da6f10d.Offer:
          var connectionId = payload.connectionId;
          var connection = this.getConnection(peerId, connectionId);
          if (connection) {
            connection.close();
            $1615705ecc6adca3$exports.default.warn("Offer received for existing Connection ID:".concat(connectionId));
          }
          if (payload.type === $60fadef21a2daafc$export$3157d57b4135e3bc.Media) {
            var mediaConnection = new $353dee38f9ab557b$exports.MediaConnection(peerId, this, {
              connectionId,
              _payload: payload,
              metadata: payload.metadata
            });
            connection = mediaConnection;
            this._addConnection(peerId, connection);
            this.emit("call", mediaConnection);
          } else if (payload.type === $60fadef21a2daafc$export$3157d57b4135e3bc.Data) {
            var dataConnection = new $3356170d7bce7f20$exports.DataConnection(peerId, this, {
              connectionId,
              _payload: payload,
              metadata: payload.metadata,
              label: payload.label,
              serialization: payload.serialization,
              reliable: payload.reliable
            });
            connection = dataConnection;
            this._addConnection(peerId, connection);
            this.emit("connection", dataConnection);
          } else {
            $1615705ecc6adca3$exports.default.warn("Received malformed connection type:".concat(payload.type));
            return;
          }
          var messages = this._getMessages(connectionId);
          try {
            for (var messages_1 = $26088d7da5b03f69$var$__values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
              var message_1 = messages_1_1.value;
              connection.handleMessage(message_1);
            }
          } catch (e_2_1) {
            e_2 = {
              error: e_2_1
            };
          } finally {
            try {
              if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return))
                _a.call(messages_1);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
          break;
        default:
          if (!payload) {
            $1615705ecc6adca3$exports.default.warn("You received a malformed message from ".concat(peerId, " of type ").concat(type3));
            return;
          }
          var connectionId = payload.connectionId;
          var connection = this.getConnection(peerId, connectionId);
          if (connection && connection.peerConnection)
            connection.handleMessage(message);
          else if (connectionId)
            this._storeMessage(connectionId, message);
          else
            $1615705ecc6adca3$exports.default.warn("You received an unrecognized message:", message);
          break;
      }
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._storeMessage = function(connectionId, message) {
      if (!this._lostMessages.has(connectionId))
        this._lostMessages.set(connectionId, []);
      this._lostMessages.get(connectionId).push(message);
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._getMessages = function(connectionId) {
      var messages = this._lostMessages.get(connectionId);
      if (messages) {
        this._lostMessages.delete(connectionId);
        return messages;
      }
      return [];
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype.connect = function(peer2, options) {
      if (options === void 0)
        options = {};
      if (this.disconnected) {
        $1615705ecc6adca3$exports.default.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.");
        this.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
        return;
      }
      var dataConnection = new $3356170d7bce7f20$exports.DataConnection(peer2, this, options);
      this._addConnection(peer2, dataConnection);
      return dataConnection;
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype.call = function(peer2, stream, options) {
      if (options === void 0)
        options = {};
      if (this.disconnected) {
        $1615705ecc6adca3$exports.default.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.");
        this.emitError($60fadef21a2daafc$export$9547aaa2e39030ff.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
        return;
      }
      if (!stream) {
        $1615705ecc6adca3$exports.default.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
        return;
      }
      var mediaConnection = new $353dee38f9ab557b$exports.MediaConnection(peer2, this, $26088d7da5b03f69$var$__assign($26088d7da5b03f69$var$__assign({}, options), {
        _stream: stream
      }));
      this._addConnection(peer2, mediaConnection);
      return mediaConnection;
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._addConnection = function(peerId, connection) {
      $1615705ecc6adca3$exports.default.log("add connection ".concat(connection.type, ":").concat(connection.connectionId, " to peerId:").concat(peerId));
      if (!this._connections.has(peerId))
        this._connections.set(peerId, []);
      this._connections.get(peerId).push(connection);
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._removeConnection = function(connection) {
      var connections = this._connections.get(connection.peer);
      if (connections) {
        var index = connections.indexOf(connection);
        if (index !== -1)
          connections.splice(index, 1);
      }
      this._lostMessages.delete(connection.connectionId);
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype.getConnection = function(peerId, connectionId) {
      var e_3, _a;
      var connections = this._connections.get(peerId);
      if (!connections)
        return null;
      try {
        for (var connections_1 = $26088d7da5b03f69$var$__values(connections), connections_1_1 = connections_1.next(); !connections_1_1.done; connections_1_1 = connections_1.next()) {
          var connection = connections_1_1.value;
          if (connection.connectionId === connectionId)
            return connection;
        }
      } catch (e_3_1) {
        e_3 = {
          error: e_3_1
        };
      } finally {
        try {
          if (connections_1_1 && !connections_1_1.done && (_a = connections_1.return))
            _a.call(connections_1);
        } finally {
          if (e_3)
            throw e_3.error;
        }
      }
      return null;
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._delayedAbort = function(type3, message) {
      var _this = this;
      setTimeout(function() {
        _this._abort(type3, message);
      }, 0);
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._abort = function(type3, message) {
      $1615705ecc6adca3$exports.default.error("Aborting!");
      this.emitError(type3, message);
      if (!this._lastServerId)
        this.destroy();
      else
        this.disconnect();
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype.emitError = function(type3, err) {
      $1615705ecc6adca3$exports.default.error("Error:", err);
      var error;
      if (typeof err === "string")
        error = new Error(err);
      else
        error = err;
      error.type = type3;
      this.emit("error", error);
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype.destroy = function() {
      if (this.destroyed)
        return;
      $1615705ecc6adca3$exports.default.log("Destroy peer with ID:".concat(this.id));
      this.disconnect();
      this._cleanup();
      this._destroyed = true;
      this.emit("close");
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._cleanup = function() {
      var e_4, _a;
      try {
        for (var _b = $26088d7da5b03f69$var$__values(this._connections.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var peerId = _c.value;
          this._cleanupPeer(peerId);
          this._connections.delete(peerId);
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return))
            _a.call(_b);
        } finally {
          if (e_4)
            throw e_4.error;
        }
      }
      this.socket.removeAllListeners();
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype._cleanupPeer = function(peerId) {
      var e_5, _a;
      var connections = this._connections.get(peerId);
      if (!connections)
        return;
      try {
        for (var connections_2 = $26088d7da5b03f69$var$__values(connections), connections_2_1 = connections_2.next(); !connections_2_1.done; connections_2_1 = connections_2.next()) {
          var connection = connections_2_1.value;
          connection.close();
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (connections_2_1 && !connections_2_1.done && (_a = connections_2.return))
            _a.call(connections_2);
        } finally {
          if (e_5)
            throw e_5.error;
        }
      }
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype.disconnect = function() {
      if (this.disconnected)
        return;
      var currentId = this.id;
      $1615705ecc6adca3$exports.default.log("Disconnect peer with ID:".concat(currentId));
      this._disconnected = true;
      this._open = false;
      this.socket.close();
      this._lastServerId = currentId;
      this._id = null;
      this.emit("disconnected", currentId);
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype.reconnect = function() {
      if (this.disconnected && !this.destroyed) {
        $1615705ecc6adca3$exports.default.log("Attempting reconnection to server with ID ".concat(this._lastServerId));
        this._disconnected = false;
        this._initialize(this._lastServerId);
      } else if (this.destroyed)
        throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
      else if (!this.disconnected && !this.open)
        $1615705ecc6adca3$exports.default.error("In a hurry? We're still trying to make the initial connection!");
      else
        throw new Error("Peer ".concat(this.id, " cannot reconnect because it is not disconnected from the server!"));
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.prototype.listAllPeers = function(cb) {
      var _this = this;
      if (cb === void 0)
        cb = function(_) {
        };
      this._api.listAllPeers().then(function(peers) {
        return cb(peers);
      }).catch(function(error) {
        return _this._abort($60fadef21a2daafc$export$9547aaa2e39030ff.ServerError, error);
      });
    };
    $26088d7da5b03f69$export$ecd1fc136c4224482.DEFAULT_KEY = "peerjs";
    return $26088d7da5b03f69$export$ecd1fc136c4224482;
  }($ac9b757d51178e15$exports.EventEmitter);
  var $70d766613f57b014$export$2e2bcd8739ae039 = $26088d7da5b03f69$exports.Peer;

  // src/index.ts
  var params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  });
  var peer = new $26088d7da5b03f69$export$ecd1fc136c422448();
  var userDialog = document.getElementById("user-info-dialog");
  var hostDialog = document.getElementById("host-info-dialog");
  var userList = document.getElementById("users");
  var state = {
    host: {
      conn: null
    },
    me: {},
    el: {
      main: document.getElementById("content")
    },
    connections: {},
    users: {},
    game: {
      type: "story-pointing"
    },
    matches: []
  };
  window.state = state;
  window.main = state.el.main;
  state.el.main.addEventListener("click", (event) => {
    const el = event.target;
    if (el.type !== "button") {
      return;
    }
    if (el.name === "restart") {
      console.debug("restart game");
      el.classList.toggle("hidden");
      state.el.main.children[state.game.type].children["reveal"].classList.toggle("hidden");
      state.el.main.children[state.game.type].children["results"].innerHTML = "";
      state.users = map_default((user) => {
        return omit_default(["voted", "vote"], user);
      }, state.users);
      state.me = omit_default(["voted", "vote"], state.me);
      listUsers();
      forEach_default((conn) => {
        console.debug("time to reveal all votes");
        conn.send({ action: "restart_game", payload: true });
        conn.send({ action: "refresh_users", payload: state.users });
      }, values_default(state.connections));
      return;
    }
    if (el.name === "reveal") {
      console.debug("reveal something");
      state.users[state.me.name].vote = state.me.vote;
      el.classList.toggle("hidden");
      state.el.main.children[state.game.type].children["restart"].classList.toggle("hidden");
      forEach_default((conn) => {
        console.debug("time to reveal all votes");
        conn.send({ action: "reveal_vote", payload: true });
      }, values_default(state.connections));
      return;
    }
    state.me.voted = true;
    state.me.vote = el.value;
    console.debug("state.me", state.me);
    if (state.me.category !== "host") {
      state.host.conn.send({ action: "user_voted", payload: { name: state.me.name } });
    } else {
      state.users[state.me.name].voted = true;
      listUsers();
      forEach_default((conn) => {
        console.debug("send user list to all players");
        console.debug("conn", conn);
        conn.send({ action: "refresh_users", payload: state.users });
      }, values_default(state.connections));
    }
  });
  var showResults = (votes, average) => {
    const main = state.el.main;
    const game = main.children[state.game.type];
    const results = game.children.results;
    results.append(`average: ${average}`);
    results.append(`  votes: ${votes}`);
  };
  var revealVotes = () => {
    const votes = map_default((user) => {
      return user.vote;
    }, values_default(state.users));
    const average = sum_default(votes) / votes.length;
    showResults(votes, average);
    forEach_default((conn) => {
      console.debug("send user list to all players");
      console.debug("conn", conn);
      conn.send({ action: "show_results", payload: {
        votes,
        average
      } });
    }, values_default(state.connections));
  };
  var initalizeGame = () => {
    const main = state.el.main;
    forEach_default((el) => {
      el.classList.add("hidden");
    }, main.children);
    const game = main.children[state.game.type];
    game.classList.toggle("hidden");
    if (state.me.category === "host") {
      game.children["reveal"].classList.toggle("hidden");
    }
  };
  var listUsers = () => {
    userList.innerHTML = "";
    console.debug("state", state);
    console.debug("values(state.users)", values_default(state.users));
    const usersByCategory = groupBy_default((user) => {
      return user.details.category;
    }, values_default(state.users));
    const userLists = mapObjIndexed_default((users, category) => {
      const figure = document.createElement("figure");
      const figCaption = document.createElement("figcaption");
      figCaption.innerText = category;
      figure.appendChild(figCaption);
      const ul = document.createElement("ul");
      const listItems = map_default((user) => {
        const li = document.createElement("li");
        li.innerText = `${user.details.name}${user.voted ? " \u{1F5F9}" : " \u2610"}`;
        return li;
      }, users);
      ul.append(...listItems);
      figure.appendChild(ul);
      return figure;
    }, usersByCategory);
    console.debug("userLists", userLists);
    userList.append("Players", ...values_default(userLists));
  };
  peer.on("open", (id) => {
    const hostId = params.hostId;
    const main = state.el.main;
    console.debug(`My peer ID is ${id}`);
    const shareButton = document.getElementById("share-copy");
    shareButton.addEventListener("click", (event) => {
      navigator.clipboard.writeText(`${location.origin}?hostId=${id}`);
    });
    if (hostId) {
    } else {
      const user = JSON.parse(localStorage.getItem("host"));
      if (user) {
        state.users[user.name] = { voted: false, details: user };
        state.me = user;
        listUsers();
        console.debug("main", main);
        main.children["host-loading"].classList.toggle("hidden");
      } else {
        if (typeof hostDialog.showModal === "function") {
          hostDialog.showModal();
          hostDialog.addEventListener("close", (e) => {
            console.debug("e", e);
            console.debug("userDialog.returnValue", hostDialog.returnValue);
            const hostForm = e.target.firstElementChild;
            const hostInfo = new FormData(hostForm);
            const user2 = {};
            hostInfo.forEach((value, key) => user2[key] = value);
            console.debug("hostInfo", hostInfo);
            localStorage.setItem("host", JSON.stringify(user2));
            state.users[user2.name] = { voted: false, details: user2 };
            state.me = user2;
            main.children["host-loading"].classList.toggle("hidden");
            listUsers();
          });
        }
      }
    }
    peer.on("connection", (conn) => {
      conn.on("open", () => {
        conn.on("data", (data) => {
          const payload = data.payload;
          console.debug("data", data);
          switch (data.action) {
            case "ping":
              console.debug("connection started...", payload);
              break;
            case "remove_user":
              console.debug("User informs host they're leaving", payload);
              state.users = dissoc_default(payload.name, state.users);
              state.connections = dissoc_default(payload.name, state.connections);
              console.debug("state", state);
              forEach_default((conn2) => {
                console.debug("send user list to all players");
                console.debug("conn", conn2);
                conn2.send({ action: "refresh_users", payload: state.users });
              }, values_default(state.connections));
              listUsers();
              break;
            case "reveal_vote":
              console.debug("Counting votes");
              state.users[payload.name].vote = payload.vote;
              const voteCountExpected = mapAccum_default((acc, user) => {
                const voted = user.voted ? 1 : 0;
                return [acc + voted, voted];
              }, 0, values_default(state.users));
              console.debug("voteCountExpected", voteCountExpected);
              const voteCountActual = mapAccum_default((acc, user) => {
                const vote = user.vote ? 1 : 0;
                return [acc + vote, vote];
              }, 0, values_default(state.users));
              if (voteCountActual[0] === voteCountExpected[0]) {
                revealVotes();
              }
              break;
            case "user_voted":
              console.debug("new user added to host!", payload);
              state.users[payload.name].voted = true;
              forEach_default((conn2) => {
                console.debug("send user list to all players");
                console.debug("conn", conn2);
                conn2.send({ action: "refresh_users", payload: state.users });
              }, values_default(state.connections));
              listUsers();
              break;
            case "add_user":
              console.debug("new user added to host!", payload);
              state.users[payload.name] = { voted: false, details: payload };
              state.connections[payload.name] = conn;
              forEach_default((conn2) => {
                console.debug("send user list to all players");
                console.debug("conn", conn2);
                conn2.send({ action: "refresh_users", payload: state.users });
              }, values_default(state.connections));
              conn.send({ action: "initalize_game", payload: state.game });
              if (values_default(state.users).length > 1) {
                initalizeGame();
              }
              listUsers();
              break;
            default:
              console.log("default");
              break;
          }
        });
        conn.send({ action: "ping", payload: "Welcome!" });
      });
    });
    if (hostId) {
      const conn = peer.connect(hostId);
      state.host.conn = conn;
      console.debug("conn", conn);
      console.debug("hostId", hostId);
      conn.on("open", () => {
        if (typeof userDialog.showModal === "function") {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            conn.send({ action: "add_user", payload: user });
            state.me = user;
          } else {
            userDialog.showModal();
            userDialog.addEventListener("close", (e) => {
              console.debug("e", e);
              console.debug("userDialog.returnValue", userDialog.returnValue);
              const userForm = e.target.firstElementChild;
              const userInfo = new FormData(userForm);
              const user2 = {};
              userInfo.forEach((value, key) => user2[key] = value);
              localStorage.setItem("user", JSON.stringify(user2));
              console.debug("userInfo", userInfo);
              state.me = user2;
              conn.send({ action: "add_user", payload: user2 });
              listUsers();
            });
          }
        }
        window.addEventListener("beforeunload", (event) => {
          event.returnValue = "";
          conn.send({ action: "remove_user", payload: state.me });
          return null;
        });
        conn.on("data", (data) => {
          console.debug("From Host", data);
          const payload = data.payload;
          console.debug("data", data);
          switch (data.action) {
            case "ping":
              console.debug("Host says hello", payload);
              break;
            case "refresh_users":
              console.debug("new users!", payload);
              state.users = payload;
              listUsers();
              break;
            case "show_results":
              showResults(payload.votes, payload.average);
              break;
            case "restart_game":
              state.me = omit_default(["votes", "vote"], state.me);
              state.el.main.children[state.game.type].children["results"].innerHTML = "";
              break;
            case "reveal_vote":
              conn.send({ action: "reveal_vote", payload: {
                name: state.me.name,
                vote: state.me.vote
              } });
              break;
            case "add_user":
              console.debug("new user!", payload);
              state.users[payload.name] = { voted: false, details: payload };
              listUsers();
              break;
            case "initalize_game":
              state.game.type = payload.type;
              initalizeGame();
              break;
            default:
              console.log("default");
              break;
          }
        });
        conn.send({ action: "ping", payload: "I've arrived!" });
      });
    }
    if (typeof hostDialog.showModal !== "function") {
      hostDialog.hidden = true;
    }
    if (typeof userDialog.showModal !== "function") {
      userDialog.hidden = true;
    }
  });
})();