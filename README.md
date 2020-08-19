# Rota Alerts

Sends a Slack Notification to team members before they are due to start an out
of hours rotation.

## Prerequisites

- Node.js 14.x.x

## Setup

Run `script/setup`. You'll be prompted for values to populate the `.env` file
with (currently just a Slack Token for a bot user).

## Running

Run `npm start`. This queries the
[On Call Rota](https://github.com/dxw/patterdale) for any rotations that are
starting in one week's time. If this is the case, it sends a Slack message to
both on call users.

## Tests

Tests are written with [Jest](https://jest.io), linting is done using
[eslint](https://eslint.org/), and format checking is done using
[Prettier](https://prettier.io/). To run the tests, linter and format checking
run `script/test`.
