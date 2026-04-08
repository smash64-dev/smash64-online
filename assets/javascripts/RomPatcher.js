/* modified version of Rom Patcher JS v20220319 */
/* Rom Patcher JS v20220319 - Marc Robledo 2016-2022 - http://www.marcrobledo.com/license */


// globals
var CAN_USE_WEB_WORKERS = true;
var romFile, patchFile, patch, headerSize = 0;
var webWorkerApply, webWorkerCrc;
var CUSTOM_PATCHER, CUSTOM_PROXY, Elements, modalId, patchButton;


// helper functions
function addEvent(e, ev, f) { e.addEventListener(ev, f, false); }
function el(e) { return document.getElementById(e); }
function _(str) { return str; } // disable localization for now


// misc functions
function _sha1sum_promise(hash) {
  var bytes = new Uint8Array(hash);
  var hexString = '';
  for (var i = 0; i < bytes.length; i++) {
    hexString += padZeroes(bytes[i], 1);
  }
  Elements.Info.Checksum.SHA1.setAttribute('data-value', hexString);
  validateSource();
}

function sha1sum(marcFile) {
  window.crypto.subtle.digest('SHA-1', marcFile._u8array.buffer)
    .then(_sha1sum_promise)
    .catch(function (error) {
      Elements.Info.Checksum.SHA1.setAttribute('data-value', `Error: ${error}`);
    });
}


// patch functions
function fetchPatch(customPatchIndex, compressedFileIndex) {
  var customPatch = CUSTOM_PATCHER[customPatchIndex];
  var uri = decodeURI(customPatch.file.trim());
  var headers = {};

  if (CUSTOM_PROXY) {
    uri = `${CUSTOM_PROXY['proto']}://${CUSTOM_PROXY['host']}${CUSTOM_PROXY['path']}${uri}`;

    if (CUSTOM_PROXY['auth_header'] && CUSTOM_PROXY['auth_token']) {
      headers[CUSTOM_PROXY['auth_header']] = CUSTOM_PROXY['auth_token'];
    }
  }

  setMessage('status', 'Downloading Patch...', 'info');
  if (typeof window.fetch !== 'function') {
    fetch(uri, { headers: headers })
      .then(result => result.arrayBuffer())
      .then(arrayBuffer => {
        patchFile = CUSTOM_PATCHER[customPatchIndex].fetchedFile = new MarcFile(arrayBuffer);
        patchFile.fileName = customPatch.file.replace(/^.*[\/\\]/g, '');

        if (patchFile.readString(4).startsWith(ZIP_MAGIC)) {
          ZIPManager.parseFile(CUSTOM_PATCHER[customPatchIndex].fetchedFile, compressedFileIndex);
        } else {
          parseCustomPatch(CUSTOM_PATCHER[customPatchIndex]);
        }

        openModal(modalId);
      })
      .catch(function (event) {
        setMessage('status', 'Failed downloading patch', 'error');
        openModal(modalId);
      });
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri, true);
    if (CUSTOM_PROXY['auth_header'] && CUSTOM_PROXY['auth_token']) {
      xhr.setRequestHeader(CUSTOM_PROXY['auth_header'], CUSTOM_PROXY['auth_token']);
    }
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (event) {
      if (this.status === 200) {
        patchFile = CUSTOM_PATCHER[customPatchIndex].fetchedFile = new MarcFile(xhr.response);
        patchFile.fileName = customPatch.file.replace(/^.*[\/\\]/g, '');

        if (patchFile.readString(4).startsWith(ZIP_MAGIC)) {
          ZIPManager.parseFile(CUSTOM_PATCHER[customPatchIndex].fetchedFile, compressedFileIndex);
        } else {
          parseCustomPatch(CUSTOM_PATCHER[customPatchIndex]);
        }
      } else {
        setMessage('status', 'Failed downloading patch', 'error');
      }

      openModal(modalId);
    };

    xhr.onerror = function (event) {
      setMessage('status', 'Failed downloading patch', 'error');
      openModal(modalId);
    };

    xhr.send(null);
  }
}

function parseCustomPatch(customPatch) {
  setMessage('status');
  mismatch = (typeof PATCHER_ERRORS.mismatch === "undefined") ? "ROM does not match" : PATCHER_ERRORS.mismatch

  // set the output name based on patch data
  patchFile = customPatch.fetchedFile;
  patchFile.setOutputName(customPatch.name);
  patchFile.seek(0);
  _readPatchFile();

  // sets the patch validation function
  if (typeof patch.validateSource === 'undefined') {
    if (typeof customPatch.crc === 'number') {
      patch.validateSource = function (romFile, headerSize) {
        return {
          result: customPatch.crc === crc32(romFile, headerSize),
          message: mismatch
        };
      }
    } else if (typeof customPatch.crc === 'object') {
      patch.validateSource = function (romFile, headerSize) {
        for (var i = 0; i < customPatch.crc.length; i++) {
          if (customPatch.crc[i] === crc32(romFile, headerSize)) {
            return {
              result: true,
              message: ''
            };
          }
        }

        return false;
      }
    }

    // single patch file
    if (typeof customPatch.patches === 'object') {
      patch.validateSource = function (romFile, headerSize) {
        return {
          result: customPatch.patches[0].crc === crc32(romFile, headerSize),
          message: mismatch
        };
      }
    }

    validateSource();
  }
}

function _readPatchFile() {
  setMessage('status');
  patchFile.littleEndian = false;

  var header = patchFile.readString(6);
  if (header.startsWith(ZIP_MAGIC)) {
    patch = false;
    ZIPManager.parseFile(patchFile);
  } else {
    if (header.startsWith(IPS_MAGIC)) {
      patch = parseIPSFile(patchFile);
    } else if (header.startsWith(UPS_MAGIC)) {
      patch = parseUPSFile(patchFile);
    } else if (header.startsWith(APS_MAGIC)) {
      patch = parseAPSFile(patchFile);
    } else if (header.startsWith(BPS_MAGIC)) {
      patch = parseBPSFile(patchFile);
    } else if (header.startsWith(RUP_MAGIC)) {
      patch = parseRUPFile(patchFile);
    } else if (header.startsWith(PPF_MAGIC)) {
      patch = parsePPFFile(patchFile);
    } else if (header.startsWith(PMSR_MAGIC)) {
      patch = parseMODFile(patchFile);
    } else if (header.startsWith(VCDIFF_MAGIC)) {
      patch = parseVCDIFF(patchFile);
    } else {
      setMessage('status', 'Unknown patch format', 'error');
      patch = null;
    }
  }
}

// rom functions
function _parseROM() {
  header = romFile.readString(4);
  if (header.startsWith(ZIP_MAGIC)) {
    ZIPManager.parseFile(romFile);
  } else {
    updateChecksums(romFile, 0);
  }
}

function updateChecksums(file, startOffset, force) {
  setMessage('status', 'Verifying ROM...', 'loading');
  setTabApplyEnabled(false);

  var selectedPatch = Elements.File.Patch.selectedIndex;
  var expectedSize = Elements.File.Patch.options[selectedPatch].getAttribute("data-rom-size") || file.fileSize;
  var expectedFormat = Elements.File.Patch.options[selectedPatch].getAttribute("data-rom-format") || 'z64';

  // check the expected file size
  if (file === romFile && file.fileSize != expectedSize && !force) {
    [Elements.Info, Elements.Message].forEach((group) => setElementGroup(group, '', [], false));
    var forceCheckAction = setSpecialAction(
      `Wrong file size. Force check file`,
      `Click to force check the ROM file`,
      `updateChecksums(romFile, ${startOffset} ,true);`
    );
    setMessage(Elements.Info.Header.Format.id, forceCheckAction, 'invalid');
    Elements.Info.Header.Format.setAttribute('data-value', 'invalid');
    setMessage('status');
    return;
  }

  // check the detected rom format
  var romFormat = file.originalRomFormat();
  Elements.Info.Header.Format.innerHTML = romFormat;
  setMessageCopyable(Elements.Info.Header.Format.id, true);

  if (file === romFile && romFormat != expectedFormat) {
    if (romFormat === 'unknown') {
      setMessage(Elements.Message.Header.Format.id, '', 'invalid');
      Elements.Info.Header.Format.setAttribute('data-value', 'invalid');
    } else {
      var convertAction = setSpecialAction(
        `Convert to ${expectedFormat}`,
        `Click to convert and save to ${expectedFormat}`,
        `convertRom(romFile, '${expectedFormat}');`
      );
      setMessage(Elements.Message.Header.Format.id, convertAction, 'warning');
      Elements.Info.Header.Format.setAttribute('data-value', 'convert');
    }
  } else {
    setMessage(Elements.Message.Header.Format.id, '', 'valid');
    Elements.Info.Header.Format.setAttribute('data-value', 'valid');
  }

  if (romFormat !== 'unknown') {
    file.convertFormat(expectedFormat);
    Elements.Info.Header.CRCs.innerHTML = `0x${file.crc1()}, 0x${file.crc2()}`;
    setMessageCopyable(Elements.Info.Header.CRCs.id, true);
  } else {
    Elements.Info.Header.CRCs.innerHTML = 'unknown';
  }

  setElementGroup(Elements.Info.Checksum, 'Calculating...', []);
  setElementGroup(Elements.Message.Checksum, '', []);

  if (CAN_USE_WEB_WORKERS) {
    webWorkerCrc.postMessage({ u8array: file._u8array, startOffset: startOffset }, [file._u8array.buffer]);

    if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
      Elements.Info.Checksum.SHA1.innerHTML = 'Calculating...';
    } else {
      Elements.Info.Checksum.SHA1.innerHTML = 'Not supported by browser';
      Elements.Info.Checksum.SHA1.setAttribute('data-value', Elements.Info.Checksum.SHA1.innerHTML);
    }
  } else {
    window.setTimeout(function () {
      Elements.Info.Checksum.CRC32.setAttribute('data-value', padZeroes(crc32(file, startOffset), 4));
      Elements.Info.Checksum.MD5.setAttribute('data-value', padZeroes(md5(file, startOffset), 16));
      validateSource();
    }, 30);

    if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
      sha1sum(file);
    } else {
      Elements.Info.Checksum.SHA1.innerHTML = 'Not supported by browser';
      Elements.Info.Checksum.SHA1.setAttribute('data-value', Elements.Info.Checksum.SHA1.innerHTML);
    }
  }
}

function validateSource() {
  if (patch && romFile && romFile._u8array && romFile._u8array.length > 0 && typeof patch.validateSource !== 'undefined') {
    validate = patch.validateSource(romFile, false);

    if (validate.result) {
      for (const [obj, element] of Object.entries(Elements.Info.Checksum)) {
        element.innerHTML = element.getAttribute('data-value');
        setMessageCopyable(element.id, true);
      }

      if (Elements.Info.Checksum.CRC32.innerHTML.length !== 0) {
        setMessage(Elements.Message.Checksum.CRC32.id, '', 'valid')
        setMessage('status');
        setTabApplyEnabled(true);
      }
    } else {
      for (const [obj, element] of Object.entries(Elements.Info.Checksum)) {
        element.innerHTML = element.getAttribute('data-value');
        setMessageCopyable(element.id, true);
      }

      if (Elements.Info.Checksum.CRC32.innerHTML.length !== 0) {
        setMessage(Elements.Message.Checksum.CRC32.id, '', 'invalid')
        setMessage('status', validate.message, 'error');
        setTabApplyEnabled(false);
      }
    }
  }
}


// output functions
function applyPatch(p, r, validateChecksums) {
  if (p && r) {
    setMessage('status', 'Patching ROM...', 'loading');
    setTabApplyEnabled(false);

    // FIXME: this fails when patching multiple ROMs without refreshing
    // ArrayBuffer is getting detached
    if (false && CAN_USE_WEB_WORKERS) {
      webWorkerApply.postMessage({
        romFileU8Array: r._u8array,
        patchFileU8Array: patchFile._u8array,
        validateChecksums: validateChecksums
      }, [
        r._u8array.buffer,
        patchFile._u8array.buffer
      ]);
    } else {
      try {
        p.apply(r, validateChecksums);
        preparePatchedRom(r, p.apply(r, validateChecksums), headerSize);
      } catch (e) {
        setMessage('status', 'ROM patching failed', 'error');
      }
    }
  } else {
    setMessage('status', 'No ROM/patch selected', 'error');
  }
}

function convertRom(originalRom, toFormat) {
  var convertedRom = originalRom;
  convertedRom.convertFormat(toFormat);

  // don't assume the filename extension is the correct format
  convertedRom.fileName = convertedRom.fileName.replace(/\.[^/.]+$/, `.${toFormat}`);
  convertedRom.save();
}

function preparePatchedRom(originalRom, patchedRom, headerSize) {
  patchedRom.fileName = `${patchFile.outputName}.${patchedRom.romFormat()}`.replace(/ /g, '_');
  patchedRom.fileType = originalRom.fileType;
  patchedRom.save();

  Elements.Button.Apply.querySelector('span').style.display = 'none';
  MicroModal.close(modalId);
}


// gui functions
function openModal(id) {
  if (Elements.File.Input.value) {
    if (!romFile) {
      romFile = new MarcFile(Elements.File.Input, _parseROM);
    } else {
      _parseROM();
    }
  }

  patchButton.style.display = 'none';
  MicroModal.show(id, { onClose: onCloseModal });
}

function setElementEnabled(element, status) {
  disabledClass = 'md-disabled';
  document.getElementById(element).disabled = !status;

  if (status) {
    document.getElementById(element).classList.remove(disabledClass);
  } else {
    document.getElementById(element).classList.add(disabledClass);
  }
}

function setElementGroup(group, content, classes, copyable = null, data_attr = true) {
  for (const [obj, element] of Object.entries(group)) {
    if (element.id) {
      element.innerHTML = (typeof content === 'string') ? content : element.innerHTML;
      element.classList = classes || element.classList;

      if (data_attr) {
        element.setAttribute('data-value', (typeof content === 'string') ? content : element.innerHTML);
      }

      if (copyable === true || copyable === false) {
        setMessageCopyable(element.id, copyable);
      }
    } else {
      setElementGroup(element, content, classes, copyable, data_attr);
    }
  };
}

function setMessage(tab, key, className) {
  tab = tab == 'apply' ? 'status' : tab;
  tab = tab.startsWith('message-') ? tab : 'message-' + tab;

  var color = '';
  var message = key ? key : '';
  var messageBox = document.getElementById(tab);
  messageBox.setAttribute('data-localize', message);
  messageBox.innerHTML = _(message);

  switch (className) {
    case 'error':
    case 'invalid':
      color = 'red';
      messageBox.className = className;
      break;

    case 'loading':
      messageBox.className = className;
      break;

    case 'valid':
      color = 'green';
      messageBox.className = className;
      break;

    case 'warning':
      color = 'orange';
      messageBox.className = className;
      break;

    default:
      messageBox.className = '';
      break;
  }

  if (color) {
    messageBox.setAttribute('data-md-color-primary', color);
    messageBox.setAttribute('data-md-color-accent', color);
  } else {
    messageBox.removeAttribute('data-md-color-primary');
    messageBox.removeAttribute('data-md-color-accent');
  }
}

function setMessageCopyable(tab, copyable) {
  var item = document.getElementById(tab);
  var copyClass = 'modal-copyable';

  if (copyable) {
    item.classList.add(copyClass);
    item.setAttribute('title', 'Copy to clipboard');
    item.parentElement.setAttribute('data-clipboard-target', `#${tab}`);
  } else {
    item.classList.remove(copyClass);
    item.removeAttribute('title');
    item.parentElement.removeAttribute('data-clipboard-target');
  }
}

function setSpecialAction(text, alt_text, onClick) {
  var specialClass = 'modal-special-action';
  return `<span class=\"${specialClass}\" title=\"${alt_text}\" onclick=\"${onClick}\">${text}</span>`;
}

function setTabApplyEnabled(status) {
  statusClass = 'md-disabled';
  Elements.Button.Apply.disabled = !status;

  if (status) {
    Elements.Button.Apply.classList.remove(statusClass);
  } else {
    Elements.Button.Apply.classList.add(statusClass);
  }
}


// event listeners
function onApplyPatch() {
  setTabApplyEnabled(false);
  Elements.Button.Apply.querySelector('span').style.display = 'inherit';
  applyPatch(patch, romFile, false);
}

function onCloseModal(modal) {
  document.querySelector('.md-dialog').style.zIndex = "";
  Elements.File.Input.removeEventListener('change', onSelectRomFile);
  Elements.File.Patch.removeEventListener('change', onSelectPatchFile);
  Elements.Button.Apply.removeEventListener('click', onApplyPatch);
  Elements.Zip.List.removeEventListener('change', onSelectZipFile);
}

function onSelectPatchFile() {
  var selectedCustomPatchIndex, selectedCustomPatchCompressedIndex, selectedPatch;

  if (/^\d+,\d+$/.test(this.value)) {
    var indexes = this.value.split(',');
    selectedCustomPatchIndex = parseInt(indexes[0]);
    selectedCustomPatchCompressedIndex = parseInt(indexes[1]);
    selectedPatch = CUSTOM_PATCHER[selectedCustomPatchIndex].patches[selectedCustomPatchCompressedIndex];
  } else {
    selectedCustomPatchIndex = parseInt(this.value);
    selectedCustomPatchCompressedIndex = null;
    selectedPatch = CUSTOM_PATCHER[selectedCustomPatchIndex];
  }

  if (selectedPatch.fetchedFile) {
    parseCustomPatch(selectedPatch);
  } else {
    patch = null;
    patchFile = null;
    fetchPatch(selectedCustomPatchIndex, selectedCustomPatchCompressedIndex);
  }
}

function onSelectRomFile() {
  setTabApplyEnabled(false);
  Elements.Zip.Dialog.style.display = 'none';
  [Elements.Info, Elements.Message].forEach((group) => setElementGroup(group, '', [], false));
  try {
    romFile = new MarcFile(this, _parseROM);
  } catch (e) {
    if (e.message === 'Invalid source') {
      setMessage('status', 'Select a ROM file...', 'warning');
    }
  }
}

function onSelectZipFile() {
  [Elements.Info, Elements.Message].forEach((group) => setElementGroup(group, '', [], false));
  var selected = Elements.Zip.List[Elements.Zip.List.selectedIndex];
  romFile = selected.sourceFile;
  ZIPManager.unzipEntry(selected.zipEntry, selected.sourceFile);
}


// app functions
function getModalElements(root) {
  return {
    Button: {
      Apply: root.querySelector('#button-apply'),
      Cancel: root.querySelector('#button-cancel'),
      Status: root.querySelector('#button-status'),
      Message: root.querySelector('#message-status'),
    },
    File: {
      Input: root.querySelector('#input-file-rom'),
      Patch: root.querySelector('#input-file-patch'),
    },
    Info: {
      Header: {
        CRCs: root.querySelector('#crcs'),
        Format: root.querySelector('#format'),
      },
      Checksum: {
        CRC32: root.querySelector('#crc32'),
        MD5: root.querySelector('#md5'),
        SHA1: root.querySelector('#sha1'),
      }
    },
    Message: {
      Header: {
        CRCs: root.querySelector('#message-crcs'),
        Format: root.querySelector('#message-format'),
      },
      Checksum: {
        CRC32: root.querySelector('#message-crc32'),
        MD5: root.querySelector('#message-md5'),
        SHA1: root.querySelector('#message-sha1'),
      }
    },
    Zip: {
      Dialog: root.querySelector('#zip-dropdown'),
      List: root.querySelector('#zip-dropdown-select'),
      Message: root.querySelector('#zip-dialog-message'),
    }
  };
}

function isCustomPatcherEnabled() {
  return typeof CUSTOM_PATCHER !== 'undefined'
    && typeof CUSTOM_PATCHER === 'object'
    && CUSTOM_PATCHER.length;
}

function loadPageData(id, index) {
  try {
    if (index) {
      return JSON.parse(document.querySelectorAll(id)[0].innerHTML)[index];
    } else {
      return JSON.parse(document.querySelectorAll(id)[0].innerHTML);
    }
  } catch (e) {
    return;
  }
}

function loadWorkers(basePath) {
  try {
    // worker_apply.js
    webWorkerApply = new Worker(`${basePath}/worker_apply.js`);

    webWorkerApply.onmessage = event => {
      patchFile._u8array = event.data.patchFileU8Array;
      patchFile._dataView = new DataView(patchFile._u8array.buffer);

      if (event.data.patchedRomU8Array) {
        preparePatchedRom(romFile, new MarcFile(event.data.patchedRomU8Array.buffer), headerSize);
      }

      if (event.data.errorMessage) {
        var message = event.data.errorMessage.replace('Error: ', '');
        setMessage('status', message, 'error');
      } else {
        setMessage('status');
      }
    };

    webWorkerApply.onerror = event => {
      var message = event.message.replace('Error: ', '');
      setMessage('status', message, 'error');
    };

    // worker_crc.js
    webWorkerCrc = new Worker(`${basePath}/worker_crc.js`);

    webWorkerCrc.onmessage = event => {
      Elements.Info.Checksum.CRC32.setAttribute('data-value', padZeroes(event.data.crc32, 4));
      Elements.Info.Checksum.MD5.setAttribute('data-value', padZeroes(event.data.md5, 16));

      romFile._u8array = event.data.u8array;
      romFile._dataView = new DataView(event.data.u8array.buffer);

      if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
        sha1sum(romFile);
      }

      validateSource();
    };

    webWorkerCrc.onerror = event => {
      var message = event.message.replace('Error: ', '');
      setMessage('status', message, 'error');
    };
  } catch (e) {
    CAN_USE_WEB_WORKERS = false;
  }
}

function loadPatcher(patchInfo) {
  CUSTOM_PATCHER = [ loadPageData('#__patcher', patchInfo.getAttribute('data-patch-id')) ];
  CUSTOM_PROXY = loadPageData('#__proxy');
  PATCHER_ERRORS = loadPageData('#__patcher_errors') ?? {};
  document.querySelector('.md-dialog').style.zIndex = 101;

  // fatal
  if (!CUSTOM_PATCHER || !CUSTOM_PROXY) {
    alert('Unable to load custom patcher');
    return;
  }

  // handle external elements
  modalId = patchInfo.getAttribute('data-modal');
  Elements = getModalElements(document.getElementById(modalId));
  patchButton = patchInfo.querySelector('span');
  patchButton.style.display = 'inherit';
  romFile = null;

  // initialize web workers
  var basePath = `${window.location.origin}/assets/javascripts`;
  loadWorkers(basePath);

  // zip-js web worker
  if (CAN_USE_WEB_WORKERS) {
    zip.useWebWorkers = true;
    zip.workerScriptsPath = `${basePath}/zip.js/`
  } else {
    zip.useWebWorkers = false;

    var script = document.createElement('script');
    script.src = `${basePath}/zip.js/inflate.js`
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  // this shouldn't happen
  if (!isCustomPatcherEnabled()) {
    alert('Unable to load custom patcher data');
    return;
  }

  // initialize dialog elements
  setTabApplyEnabled(false);
  Elements.Zip.Dialog.style.display = 'none';
  [Elements.Info, Elements.Message].forEach((group) => setElementGroup(group, '', [], false));

  Elements.File.Patch.value = ''
  for (options in Elements.File.Patch.options) {
    Elements.File.Patch.options.remove(0);
  }

  // dirty fix for mobile Safari https://stackoverflow.com/a/19323498
  if (/Mobile\/\S+ Safari/.test(navigator.userAgent)) {
    Elements.File.Patch.accept = '';
  }

  // build the patch selector
  for (var i = 0; i < CUSTOM_PATCHER.length; i++) {
    CUSTOM_PATCHER[i].fetchedFile = false;

    CUSTOM_PATCHER[i].selectOption = document.createElement('option');
    CUSTOM_PATCHER[i].selectOption.value = i;
    CUSTOM_PATCHER[i].selectOption.innerHTML = CUSTOM_PATCHER[i].name || CUSTOM_PATCHER[i].file;
    Elements.File.Patch.appendChild(CUSTOM_PATCHER[i].selectOption);

    if (typeof CUSTOM_PATCHER[i].patches === 'object') {
      for (var j = 0; j < CUSTOM_PATCHER[i].patches.length; j++) {
        if (j === 0) {
          CUSTOM_PATCHER[i].patches[0].selectOption = CUSTOM_PATCHER[i].selectOption;
          CUSTOM_PATCHER[i].selectOption = null;
        } else {
          CUSTOM_PATCHER[i].patches[j].selectOption = document.createElement('option');
          Elements.File.Patch.appendChild(CUSTOM_PATCHER[i].patches[j].selectOption);
        }

        CUSTOM_PATCHER[i].patches[j].selectOption.value = i + ',' + j;
        CUSTOM_PATCHER[i].patches[j].selectOption.innerHTML = CUSTOM_PATCHER[i].patches[j].name || CUSTOM_PATCHER[i].patches[j].file;

        ['crc', 'format', 'size'].forEach((meta) => {
          var primary = CUSTOM_PATCHER[i][meta] || '';
          var value = CUSTOM_PATCHER[i].patches[j][meta] || primary;
          CUSTOM_PATCHER[i].patches[j].selectOption.setAttribute(`data-rom-${meta}`, value);
        });
      };
    };
  }

  // begin fetching the first patch
  fetchPatch(0, 0);

  // event listeners
  Elements.File.Input.addEventListener('change', onSelectRomFile);
  Elements.File.Patch.addEventListener('change', onSelectPatchFile);
  Elements.Button.Apply.addEventListener('click', onApplyPatch);
  Elements.Zip.List.addEventListener('change', onSelectZipFile);
};
