# Assignment 2 – CI/CD Pipeline for Node.js To-Do List API

## Overview

For this assignment, I implemented a CI/CD pipeline for the Node.js To-Do List REST API developed in Assignment 1. The goal was to automate the process of testing, building, and deploying the application whenever changes are pushed to the GitHub repository.

The pipeline uses GitHub Actions for automation, Docker for containerization, DockerHub for image storage, and Render.com for deployment.

---

## Technologies Used

* GitHub
* GitHub Actions
* Node.js & npm
* Jest
* Docker
* DockerHub
* Render.com

---

## Steps Taken

### 1. Repository Setup

I used the To-Do List REST API from Assignment 1 and ensured that the repository was public. The `package.json` file was also checked to confirm that the required scripts (`start`, `build`, `test`, and `test:local`) were available.

### 2. Docker Configuration

A Dockerfile was created using the `node:20-alpine` image. The Docker container:

* Installs project dependencies
* Copies the application source code
* Runs tests during the build process
* Exposes port 3000
* Starts the application using `npm start`

The application was tested locally in Docker before moving on to deployment.

### 3. GitHub Actions Workflow

A workflow file was created inside:

```text
.github/workflows/deploy.yml
```

The workflow runs automatically whenever code is pushed to the `main` branch.

The workflow performs the following tasks:

1. Checks out the source code.
2. Sets up the Node.js environment.
3. Installs dependencies.
4. Runs automated tests using Jest.
5. Logs in to DockerHub.
6. Builds a Docker image.
7. Pushes the image to DockerHub.
8. Triggers deployment on Render.

This ensures that only tested code is deployed.

### 4. GitHub Secrets

To keep credentials secure, the following secrets were added to GitHub:

| Secret                 | Purpose                   |
| ---------------------- | ------------------------- |
| DOCKERHUB_USERNAME     | DockerHub username        |
| DOCKERHUB_TOKEN        | DockerHub access token    |
| RENDER_DEPLOY_HOOK_URL | Render deployment webhook |

No sensitive information was stored directly in the source code.

### 5. Render Deployment

A Web Service was created on Render using the Docker image stored on DockerHub.

The setup included:

* Deploying from an existing image
* Configuring environment variables
* Creating a Deploy Hook URL
* Linking the Deploy Hook to GitHub Actions

Whenever a new image is pushed to DockerHub, Render automatically redeploys the latest version of the application.

---

## Workflow Summary

The deployment process works as follows:

```text
Code Push → GitHub Actions → Run Tests → Build Docker Image → Push to DockerHub → Trigger Render Deployment → Live Application
```

This allows the entire deployment process to run automatically without manual intervention.

---

## Challenges Faced

### Docker Build Issues

Initially, the Docker build failed because some testing dependencies were not available inside the container.

**Solution:** Installed all required dependencies before running tests and verified the Jest configuration.

### DockerHub Authentication

There were issues pushing images to DockerHub during the first workflow runs.

**Solution:** Generated a DockerHub Access Token and stored it in GitHub Secrets instead of using a password.

### Render Redeployment

Render does not automatically redeploy when a DockerHub image is updated.

**Solution:** Used a Render Deploy Hook and triggered it from GitHub Actions after every successful image push.

### Managing Credentials

Keeping credentials secure while still allowing automation was important.

**Solution:** All credentials and deployment URLs were stored in GitHub Secrets.

---

## Testing and Validation

The following checks were completed successfully:

* Repository cloned by GitHub Actions
* Dependencies installed correctly
* Jest tests passed
* Docker image built successfully
* Image pushed to DockerHub
* Render deployment triggered successfully
* Application accessible through the deployment URL

---

## Learning Outcomes

Through this assignment, I gained practical experience with:

* CI/CD concepts and workflow automation
* GitHub Actions configuration
* Docker containerization
* DockerHub image management
* Cloud deployment using Render
* Secure credential management using GitHub Secrets
* End-to-end deployment pipelines used in modern software development

---

## Conclusion

This assignment helped me understand how CI/CD pipelines work in a real-world environment. By combining GitHub Actions, Docker, DockerHub, and Render, I was able to automate the entire build and deployment process. The final pipeline ensures that every code change is tested, packaged, and deployed automatically, making the development process faster and more reliable.
