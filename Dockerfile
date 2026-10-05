# syntax=docker/dockerfile:1
#
# Reproducible lint + test environment for this repository.
#
#   docker build --tag polymer-test .
#   docker run --rm polymer-test
#
# The image is pinned to a Node major version and installs dependencies with
# `npm ci` from the committed lockfile, so a fresh container resolves exactly
# the dependency tree the lockfile pins. `--ignore-scripts` keeps dependency
# install scripts from executing arbitrary code at build time.
#
# Docker is not required to run the suite: `npm ci && npm test` on a supported
# Node runtime is equivalent and faster.

FROM node:22-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

# Chromium + xvfb are only needed for the optional web-component-tester suite
# (`docker run --rm -e WCT=1 polymer-test npm run test:browser`).
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      chromium \
      dumb-init \
      tini \
      xvfb; \
    rm -rf /var/lib/apt/lists/*; \
    ln -sf /usr/bin/chromium /usr/local/bin/google-chrome

ENV CHROME_BIN=/usr/bin/chromium

WORKDIR /repo

# Install dependencies first so the layer is cached across source-only edits.
COPY package.json package-lock.json .npmrc ./
# hadolint ignore=DL3016
RUN npm ci --ignore-scripts && npm cache clean --force

COPY . .

# Drop privileges: the official node image ships a non-root `node` user, and
# nothing in the lint/test path needs to write outside /repo.
USER node

CMD ["npm", "test"]
