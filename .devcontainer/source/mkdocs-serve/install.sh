#!/usr/bin/env bash
set -e

# usage: fatal <exit_code> <message>
fatal() {
	printf "ERROR: %s\n" "$2"
	exit "$1"
}

# usage: format_requirement <package> [extras] [version]
format_requirement() {
	local package="$1"
	local extras="$2"
	local version="$3"
	local extras_array extras_string

	IFS=',' read -r -a extras_array <<< "$extras"
	for extra in "${extras_array[@]}"; do
		extras_string+="$(trim "${extra},")"
	done

	extras="${extras_string%,}"
	if [[ -n "$extras" ]]; then
		extras="[$extras]"
	fi

	case "$version" in
		latest)		version="" ;;
		[0-9].*)	version="==$version" ;;
	esac

	# package[extras]==version / etc
	printf "%s%s%s" "$package" "$extras" "$version"
}

# usage: get_pip_package_info <package> <field> <cmd_as>
get_pip_package_info() {
	local package="$1"
	local field="${2,,}"
	local cmd_as="${3:-}"
	local results

	results="$(run_as "$cmd_as" "$(get_python)" -m pip show "$package")"
	results="$(printf "%s" "$results" | grep -i "^$field:" | cut -d':' -f2-)"

	printf "%s" "$(trim "$results")"
}

# usage: get_python
get_python() {
	if [[ -n "$_PYTHON_INTERPRETER" ]]; then
		printf "%s" "$_PYTHON_INTERPRETER" && return 0
	fi

	local interpreters=(
		"$PYTHON"
		"/usr/local/bin/python"
		"/usr/local/bin/python3"
		"python3"
		"python"
	)
	for interpreter in "${interpreters[@]}"; do
		if [[ -z "$interpreter" ]]; then
			continue
		fi

		if command -v "$interpreter" >/dev/null 2>&1; then
			_PYTHON_INTERPRETER="$interpreter"
			printf "%s" "$interpreter" && return 0
		fi
	done

	fatal 1 "No valid python interpreter found"
}

# usage: install_entrypoint <entrypoint> <install_dir>
install_entrypoint() {
	local entrypoint="$1"
	local install_dir="$2"
	local name="mkdocs-serve-entrypoint.sh"

	cp -f "$entrypoint" "$install_dir/$name"
	chmod 755 "$install_dir/$name"
}

# usage: install_pip_package <package> <install_as> [python]
install_pip_package() {
	local package="$1"
	local install_as="$2"

	local pip_args=(
		--break-system-packages
		--no-cache-dir
		--no-warn-script-location
		--upgrade
		--force-reinstall
	)
	if [[ "$EUID" -eq 0 && "$install_as" != "root" ]]; then
		pip_args+=(--user)
	fi

	run_as "$install_as" "$(get_python)" -m pip install "${pip_args[@]}" "$package"
}

# usage: run_as <user> <cmd>
run_as() {
	local user="${1:-}"; shift
	local cmd=("$@")

	if [[ "$EUID" -eq 0 && "$user" != "root" ]]; then
		su - "$user" -c "${cmd[*]}"
	else
		"${cmd[@]}"
	fi
}

# usage: supervisord_config <autostart> <manage_user> <python_path> <loglevel>
# shellcheck disable=SC2034
supervisord_config() {
	export AUTOSTART="$1"
	export MANAGE_USER="$2"
	export PYTHON_PATH="$3"
	export LOGLEVEL="$4"

	PYTHON_BIN="$(get_python)"
	export PYTHON_BIN

	local config_dir="/etc"
	local config_file="supervisord.conf"

	envsubst < "$config_file.template" > "$config_dir/$config_file"
	chmod 644 "$config_dir/$config_file"
}

# usage: trim <string>
trim() {
	: "${1#"${1%%[![:space:]]*}"}"
	: "${_%"${_##*[![:space:]]}"}"
	printf '%s\n' "$_"
}

main() {
	local package="${PACKAGE:-}"
	local version="${VERSION:-}"
	local extras="${EXTRAS:-}"
	local plugins="${PLUGINS:-}"
	local install_user="${INSTALLUSER:-}"
	local auto_serve="${AUTOSERVE:-}"
	local mkdocs_requirement plugins_array python_path

	if [[ -z "$package" ]]; then
		fatal 1 "'$package' variable is required"
	fi

	mkdocs_requirement="$(format_requirement "$package" "$extras" "$version")"
	install_pip_package "$mkdocs_requirement" "$install_user"

	if [[ -n "$plugins" ]]; then
		IFS=' ' read -r -a plugins_array <<< "$plugins"
		for plugin in "${plugins_array[@]}"; do
			install_pip_package "$(trim "$plugin")" "$install_user"
		done
	fi

	python_path="$(get_pip_package_info "$package" "Location" "$install_user")"
	install_pip_package "supervisor" "root"
	supervisord_config "$auto_serve" "$install_user" "$python_path" "info"

	install_entrypoint "entrypoint.sh" "/usr/local/share"
}

main "$@"
