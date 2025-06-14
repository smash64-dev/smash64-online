#!/usr/bin/env bash
# shellcheck disable=SC2034
set -e

SUPERVISORD_ARGS=("$@")
if [[ "${#SUPERVISORD_ARGS[@]}" -eq 0 ]]; then
	SUPERVISORD_ARGS=("-c" "/etc/supervisord.conf")
fi

export CONTAINER_WORKSPACE_FOLDER="${CONTAINER_WORKSPACE_FOLDER:-"$CWR"}"
export PYTHONWARNINGS="ignore::UserWarning"

{
	base_dir="/tmp/supervisord"
	mkdir -p "$base_dir"
	chmod 777 "$base_dir"

	cd "$base_dir"
	supervisord "${SUPERVISORD_ARGS[@]}"
}
