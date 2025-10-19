# Chat Monorepo (pnpm workspace)

This repository contains a simple Socket.IO + Express TypeScript server, managed as a pnpm workspace.

## Structure
- `server/` — TypeScript Node server (Express + Socket.IO)
- `client/` — Placeholder for client app (currently empty)

## Prerequisites
- Node.js LTS (recommended)
- pnpm installed globally

```bash
npm i -g pnpm
```

## Install
From the repository root:

```bash
pnpm install
```

## Environment
Create a `.env` file in `server/` (an example is provided):

```bash
cp server/.env.example server/.env
```

You can change `PORT` if needed.

## Scripts
From the repository root:

- `pnpm dev` — run the server in TypeScript via ts-node
- `pnpm build` — compile TypeScript to `server/dist`
- `pnpm start` — run compiled JavaScript with Node

Alternatively, you can run within `server/` directly:

- `pnpm -C server dev`
- `pnpm -C server build`
- `pnpm -C server start`

## Run
Development (TypeScript):

```bash
pnpm dev
```

Production (build then run):

```bash
pnpm build
pnpm start
```

## Git
A `.gitignore` and `.gitattributes` are included for a pnpm monorepo. See below for initialization steps.

```bash
git init
git add .
git commit -m "chore: initialize monorepo with server"
```
