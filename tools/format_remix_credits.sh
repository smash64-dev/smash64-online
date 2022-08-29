#!/bin/bash
# format_remix_credits.sh

# temporary/lazy script to format the remix credits.txt
clean_name() { echo "$1" | sed -E 's/(["*])/\\\1/g'; }
contributor() { echo -e "- $(clean_name "${1}")"; }
header() { echo -e "\n### ${1}: { #hidden data-toc-label='' }"; }
team_member() { echo -e "- ${1}: $(clean_name "${2}")"; }

CREDITS="$1"
HEADERS=(
    'Credits'   # becomes Remix Team
    'Modelers'
    'Artists'
    'Animators'
    'Musicians'
    'Stage Designers'
    'Voice Artists'
    'Modders'
    'Video Design Team'
    'Consultants'
    'Playtesters'
    'Original Sequencing Musical Credits'
)

last_header=""
while read -r line; do
    if [[ -z "$line" ]]; then continue; fi

    # shellcheck disable=SC2076
    if [[ " ${HEADERS[*]} " =~ " ${line} " ]]; then
        if [[ "$line" == "Credits" ]]; then line="Remix Team"; fi

        last_header="$line"
        header "$line"
    else
        if [[ "$last_header" == "Remix Team" ]]; then
            parts="$(echo "$line" | sed -E 's/(.*) [–-] (.*)/\1:\2/g')"
            team_member "${parts%:*}" "${parts#*:}"
        else
            name="$(echo "$line" | sed -E 's/^[• \t]+(.*)/\1/g')"
            contributor "$name"
        fi
    fi
done < "$CREDITS"
