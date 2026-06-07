pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    environment {
        DOCKER_IMAGE = 'kuenzangdolkar/todo-app'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        GITHUB_CREDENTIALS_ID = 'github-pat'
    }

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/yourusername/assignment1-node-app.git',
                    branch: 'main',
                    credentialsId: "${GITHUB_CREDENTIALS_ID}"
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            environment {
                JEST_JUNIT_OUTPUT_DIR = 'test-results'
                JEST_JUNIT_OUTPUT_NAME = 'results.xml'
            }
            steps {
                sh 'mkdir -p test-results'
                sh 'npm test'
            }
            post {
                always {
                    junit 'test-results/results.xml'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', "${DOCKER_CREDENTIALS_ID}") {
                        def image = docker.build("${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the logs above for details.'
        }
        always {
            cleanWs()
        }
    }
}
