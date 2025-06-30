ARG TEMPLATE_VERSION=1
ARG PYTHON_VERSION=3.12
ARG DEBIAN_VERSION=bookworm

FROM mcr.microsoft.com/devcontainers/python:${TEMPLATE_VERSION}-${PYTHON_VERSION}-${DEBIAN_VERSION}

ARG REPO_HOST="https://github.com"
ARG REPO_OWNER="smash64-dev"
ARG REPO_NAME="smash64-online"
ARG REPO_URL="${REPO_HOST}/${REPO_OWNER}/${REPO_NAME}"

ARG TEMPLATE_VERSION
ARG PYTHON_VERSION
ARG DEBIAN_VERSION
ARG DOCKER_TAG=${TEMPLATE_VERSION}-${PYTHON_VERSION}-${DEBIAN_VERSION}

# https://github.com/opencontainers/image-spec/blob/main/annotations.md
LABEL org.opencontainers.image.base.name="mcr.microsoft.com/devcontainers/python:${DOCKER_TAG}" \
      org.opencontainers.image.description="A devcontainer image for ${REPO_NAME}" \
      org.opencontainers.image.documentation="${REPO_URL}/tree/main/README.md" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="${REPO_URL}" \
      org.opencontainers.image.title="${REPO_NAME}" \
      org.opencontainers.image.url="${REPO_URL}/pkgs/container/${REPO_NAME}%2fdevcontainer" \
      org.opencontainers.image.vendor="${REPO_OWNER}"
