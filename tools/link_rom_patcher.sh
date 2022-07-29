#!/bin/bash
# link_rom_patcher.sh

if [[ $# -ne 2 || ! -d "$1" ]]; then
    echo "error: $(basename "$0") <from-dir> <to-dir>"
    exit 1
fi

FROM="${1%/}"
TO="${2%/}"

JS_DIR="${FROM}/js/"
EXCLUDE_LIST=("RomPatcher.js$" "formats/zip.js")
EXCLUDE_STR="$(printf '\|%s' "${EXCLUDE_LIST[@]}")"

while IFS= read -r file; do
    # shellcheck disable=SC2001
    part="$(echo "$file" | sed -e "s|.*${JS_DIR}||g")"
    new_path="${TO}/${part}"
    new_dir="$(dirname "$new_path")"

    if [[ ! -d "$new_dir" ]]; then
        echo "info: creating '${new_dir}'"
        mkdir -p "$new_dir"
    fi

    if [[ ! -f "$new_path" ]]; then
        echo "info: linking '${file}' to '${new_path}'"
        ln -srf "$file" "$new_path"
    fi
done < <(find "$JS_DIR" -type f -name "*.js" | grep -v "${EXCLUDE_STR:2}")
