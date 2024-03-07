ARG PYTHON_VERSION=3.11
ARG ALPINE_VERSION=3.18

FROM python:${PYTHON_VERSION}-alpine${ALPINE_VERSION} as develop

LABEL org.opencontainers.image.authors="CEnnis91 <cennis91@gmail.com>"
LABEL org.opencontainers.image.source="https://github.com/smash64-dev/smash64-online"

# taken from https://github.com/squidfunk/mkdocs-material/blob/master/Dockerfile
RUN apk add --no-cache \
    cairo \
    freetype-dev \
    git \
    git-fast-import \
    jpeg-dev \
    openssh \
    zlib-dev

COPY requirements* /tmp/

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir \
        mkdocs-material[recommended] \
        mkdocs-material[imaging] \
    && pip install --no-cache-dir -U \
        -r /tmp/requirements.txt \
        -r /tmp/requirements-dev.txt

# hadolint ignore=DL3059
RUN git config --system --add safe.directory /src

WORKDIR /src

ENTRYPOINT [ "sleep", "infinity" ]
