/* modified version of Rom Patcher JS v20220319 */
/* ZIP module for Rom Patcher JS v20220319 - Marc Robledo 2016-2022 - http://www.marcrobledo.com/license */

const ZIP_MAGIC = '\x50\x4b\x03\x04';

var ZIPManager = (function () {
  const FILTER_PATCHES = /\.(xdelta|vcdiff)$/i;
  const FILTER_NON_ROMS = /(\.(txt|diz|rtf|docx?|xlsx?|html?|pdf|jpe?g|gif|png|bmp|webp|zip|rar|7z))$/i;

  var _unzipEntry = function (zippedEntry, dest, dest2, parse) {
    if (dest === romFile) {
      setMessage('status', 'Unzipping file...', 'loading');
      [Elements.Info, Elements.Message].forEach((group) => setElementGroup(group, '', [], false));
      setTabApplyEnabled(false);
    } else if (dest === patchFile) {
      setMessage('status', 'Unzipping patch...', 'loading');
    }

    zippedEntry.getData(new zip.BlobWriter(), function (blob) {
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(blob);

      fileReader.onload = function () {
        var unzippedFile = new MarcFile(this.result);
        unzippedFile.fileName = zippedEntry.filename;

        if (dest.patches) {
          dest.patches[dest2].fetchedFile = unzippedFile;
          if (parse) {
            parseCustomPatch(dest.patches[dest2]);
          }
        } if (dest === romFile) {
          // display the zip dropdown, if it's not already showing
          if (Elements.Zip.Dialog.querySelector('select').options.length > 1) {
            Elements.Zip.Dialog.style.display = 'block';
          }
          romFile = unzippedFile;
          _parseROM();
        } else if (dest === patchFile) {
          patchFile = unzippedFile;
          _readPatchFile();
        }
      };
    });
  };

  return {
    parseFile: function (sourceFile, compressedFileIndex) {
      if (sourceFile === romFile) {
        setMessage('status', 'Loading ROMs from zip...', 'loading');
      } else if (sourceFile === patchFile) {
        setMessage('status', 'Loading patches from zip...', 'loading');
      }

      var arrayBuffer = sourceFile._u8array.buffer;
      zip.createReader(
        new zip.BlobReader(new Blob([arrayBuffer])),
        // success
        function (zipReader) {
          zipReader.getEntries(function (zipEntries) {
            var filteredEntries = [];
            for (var i = 0; i < zipEntries.length; i++) {
              if ((
                  (sourceFile === romFile && !FILTER_NON_ROMS.test(zipEntries[i].filename) && !FILTER_PATCHES.test(zipEntries[i].filename))
                  || (sourceFile !== romFile && FILTER_PATCHES.test(zipEntries[i].filename))
                ) && !zipEntries[i].directory
              ) {
                filteredEntries.push(zipEntries[i]);
              }
            }

            var customPatch = false;
            if (isCustomPatcherEnabled()) {
              for (var i = 0; i < CUSTOM_PATCHER.length && !customPatch; i++) {
                if (CUSTOM_PATCHER[i].fetchedFile === sourceFile) {
                  customPatch = CUSTOM_PATCHER[i];
                }
              }
            }

            if (customPatch) {
              if (customPatch.patches) {
                for (var i = 0; i < customPatch.patches.length; i++) {
                  for (var j = 0; j < filteredEntries.length; j++) {
                    if (customPatch.patches[i].file === filteredEntries[j].filename) {
                      _unzipEntry(filteredEntries[j], customPatch, i, i === compressedFileIndex);
                      break;
                    }
                  }
                }
              } else {
                // this shouldn't happen
                alert('Unable to load custom patch data');
                setTabApplyEnabled(false);
              }
            } else {
              if (filteredEntries.length === 1) {
                _unzipEntry(filteredEntries[0], sourceFile);
              } else if (filteredEntries.length > 1) {
                var zipList = Elements.Zip.List;
                zipList.innerHTML = '';

                for (var i = 0; i < filteredEntries.length; i++) {
                  var li = document.createElement('option');
                  li.zipEntry = filteredEntries[i];
                  li.sourceFile = sourceFile;
                  li.innerHTML = filteredEntries[i].filename;
                  zipList.appendChild(li);
                }

                // begin checking the first entry
                _unzipEntry(filteredEntries[0], sourceFile);
              } else {
                if (sourceFile === romFile) {
                  setMessage('status', 'No valid ROMs found in zip', 'error');
                  romFile = null;
                } else if (sourceFile === patchFile) {
                  setMessage('status', 'No valid patches found in zip', 'error');
                  patchFile = null;
                }

                setTabApplyEnabled(false);
              }
            }
          });
        },
        // failed
        function (zipReader) {
          setMessage('status', 'Could not open zip file', 'error');
          setTabApplyEnabled(false);
        }
      );
    },
    unzipEntry: function (zippedEntry, dest, dest2, parse) {
      _unzipEntry(zippedEntry, dest, dest2, parse);
    },
  }
})();
