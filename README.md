# Assignment 3 – GitHub Actions CI/CD Pipeline

**Course:** DSO101 – Continuous Integration and Continuous Deployment  
**Student:** Kuenzang Dolkar  
**Student ID:** 02250357  

---

## GitHub Repository

[https://github.com/K-dolkar/KuenzangDolkar_02250357_DSO101_A2](https://github.com/K-dolkar/KuenzangDolkar_02250357_DSO101_A2)

---

## Live Deployment

[https://todo-app-xxxx.onrender.com](https://todo-app-xxxx.onrender.com)  
*(Replace with your actual Render URL after deployment)*

---

## Overview

This project extends the To-Do List application from Assignment 1 with a fully automated CI/CD pipeline using **GitHub Actions**. On every push to `main`, the workflow:

1. Checks out the source code
2. Installs Node.js dependencies and runs Jest tests
3. Builds a Docker image and pushes it to DockerHub
4. Triggers a redeployment on Render.com via a deploy hook webhook

---

## Repository Structure

```
todo-app/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD workflow
├── __tests__/
│   └── server.test.js        # Jest test suite (13 tests)
├── server.js                 # Express REST API for todo list
├── package.json
├── Dockerfile
└── README.md
```

---

## Steps Taken

### 1. Application (server.js)

A simple Express REST API was written with full CRUD endpoints for a todo list:

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/todos` | List all todos |
| GET | `/todos/:id` | Get a single todo |
| POST | `/todos` | Create a todo |
| PUT | `/todos/:id` | Update title or completed status |
| DELETE | `/todos/:id` | Delete a todo |
| GET | `/health` | Health check for Render |

### 2. Tests (__tests__/server.test.js)

13 Jest tests were written using `supertest` to cover all endpoints, including happy paths and error cases (400 / 404 responses). Tests run before the Docker build in the pipeline so broken builds are never pushed.

### 3. Dockerfile

The existing Dockerfile uses `node:20-alpine` as the base image. It copies `package*.json`, runs `npm install --production`, copies the source, exposes port 3000, and starts with `node server.js`.

### 4. GitHub Actions Workflow (.github/workflows/deploy.yml)

The workflow is triggered on every push to `main` and performs five steps:

1. **Checkout** – checks out the repository
2. **Node.js setup + test** – installs dependencies and runs `npm test`
3. **DockerHub login** – authenticates using `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets
4. **Build & push image** – builds `<username>/todo-app:latest` and pushes to DockerHub
5. **Render deploy hook** – calls `curl -X POST $RENDER_DEPLOY_HOOK_URL` to trigger redeployment

### 5. GitHub Secrets

The following secrets were added under **Repo Settings → Secrets and Variables → Actions**:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | DockerHub account username |
| `DOCKERHUB_TOKEN` | DockerHub access token (generated under Account Settings → Security) |
| `RENDER_DEPLOY_HOOK_URL` | Render deploy hook URL (from Service Settings → Deploy Hook) |

No credentials are hardcoded anywhere in the codebase.

### 6. DockerHub

A public repository named `todo-app` was created on DockerHub. Using a public repo avoids the need for Render to authenticate when pulling the image.

### 7. Render.com Deployment

A new Web Service was created on Render using **"Deploy an existing image"**. The image `<DOCKERHUB_USERNAME>/todo-app:latest` was entered as the source. After the initial manual deploy, the deploy hook URL was copied from **Service Settings → Deploy Hook** and saved as the `RENDER_DEPLOY_HOOK_URL` GitHub secret.

---

## Screenshots

### GitHub Actions – Successful Workflow Run
*(Add screenshot here)*

### DockerHub – Image Pushed
*(Add screenshot here)*

### Render.com – Deployment Live
*(Add screenshot here)*

---

## Challenges Faced

1. **Render does not auto-pull new DockerHub images.** Render only redeploys when explicitly triggered. This was solved by adding a `curl -X POST` step in the workflow that calls the Render deploy hook URL immediately after the image push.

2. **DockerHub token vs password.** The `docker/login-action` requires a DockerHub Access Token, not the account password. The token is generated under DockerHub → Account Settings → Security → New Access Token.

3. **Tests blocking the pipeline.** The Jest test step runs before the Docker build step, so any failing test stops the pipeline early. This is intentional — it prevents broken images from being pushed to DockerHub or deployed to Render.

4. **Node.js v22 compatibility.** A transitive dependency (`ipaddr.js`) ships without its `lib/` directory in some npm registry versions, causing `require('express')` to fail at test time. Pinning `ipaddr.js` as a direct dependency resolves this.

---

## Learning Outcomes

- How to write a multi-step GitHub Actions workflow that chains testing, container building, and deployment.
- The difference between DockerHub access tokens and passwords, and why tokens are required for CI pipelines.
- How Render deploy hooks work and why a webhook call is needed to trigger redeployment after a new image is pushed.
- The importance of running tests before building images to prevent broken deployments.
- How to use GitHub Secrets to keep credentials out of source code.
