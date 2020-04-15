# daily-node

![Lint & Test](https://github.com/sharkyze/daily-node/workflows/Lint%20&%20Test/badge.svg)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/sharkyze/daily-node.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sharkyze/daily-node/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/sharkyze/daily-node.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sharkyze/daily-node/alerts/)

Node.js client library wrapper for the [daily.co platform API](https://docs.daily.co/reference).

## Installation

```bash
npm install daily-node
or
yarn add daily-node
```

## Getting Started

```typescript
// Create a daily.co client
const daily = new Daily("<your daily.co API Key>");

// Create a room
const room = await daily.createRoom({ privacy: "public" });

// Get info about a room
console.log(await daily.room(room.name));
```
