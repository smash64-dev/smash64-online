/* MarcFile.js extensions for N64 ROMs */

MarcFile.prototype.convertFormat = function (toFormat) {
  const fromFormat = this.romFormat();
  if (fromFormat === toFormat) {
    return true;
  } else {
    if (fromFormat === 'z64') { this.swapBytes(); }
    if (fromFormat === 'n64') { this.swapWords(); }

    if (fromFormat === toFormat) {
      return true;
    } else {
      if (toFormat === 'z64') { this.swapBytes(); }
      if (toFormat === 'n64') { this.swapWords(); }
    }
  }

  return this.romFormat === toFormat;
}

MarcFile.prototype.crc1 = function () {
  const last_offset = this.offset;
  this.offset = 0x10;
  const crc1 = this.readHexString(4);
  this.offset = last_offset;
  return crc1;
}

MarcFile.prototype.crc2 = function () {
  const last_offset = this.offset;
  this.offset = 0x14;
  const crc1 = this.readHexString(4);
  this.offset = last_offset;
  return crc1;
}

MarcFile.prototype.internalName = function () {
  const last_offset = this.offset;
  this.offset = 0x20;
  const crc1 = this.readString(20);
  this.offset = last_offset;
  return crc1;
}

MarcFile.prototype.originalRomFormat = function () {
  if (this.originalFormat)
    return this.originalFormat
  else
    return this.romFormat();
}

MarcFile.prototype.readHexString = function (len) {
  this._lastRead = '';
  for (var i = 0; i < len && (this.offset + i) < this.fileSize && this._u8array[this.offset + i] > 0; i++)
    this._lastRead = this._lastRead + this._u8array[this.offset + i].toString(16);

  this.offset += len;
  return this._lastRead
}

MarcFile.prototype.romFormat = function () {
  const last_offset = this.offset;
  this.offset = 0;
  const magic = this.readHexString(4);
  this.offset = last_offset;

  var format = ({
    '80371240': 'z64',
    '37804012': 'v64',
    '40123780': 'n64',
  })[magic] ?? 'unknown';

  if (!this.originalFormat)
    this.originalFormat = format;
  return format;
}

MarcFile.prototype.setOutputName = function (fileName) {
  this.outputName = fileName;
}

MarcFile.prototype.swapBytes = function () {
  for (var i = 0; i < this.fileSize; i += 2) {
    var j = this._u8array[i];

    this._u8array[i] = this._u8array[i + 1];
    this._u8array[i + 1] = j;
  }
}

MarcFile.prototype.swapWords = function () {
  for (var i = 0; i < this.fileSize; i += 4) {
    var j = this._u8array[i];
    var k = this._u8array[i + 1];

    this._u8array[i] = this._u8array[i + 2];
    this._u8array[i + 1] = this._u8array[i + 3];
    this._u8array[i + 2] = j;
    this._u8array[i + 3] = k;
  }
}
