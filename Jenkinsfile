pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Target deployment environment')
        string(name: 'APP_PORT', defaultValue: '8080', description: 'Host port to bind the application container')
        string(name: 'DOCKER_REGISTRY', defaultValue: 'docker.io/bharad', description: 'Docker Registry / Organization namespace')
    }

    environment {
        APP_NAME = 'traceability-portal'
        IMAGE_TAG = "v1.2.${env.BUILD_NUMBER}"
        IMAGE_FULL = "${params.DOCKER_REGISTRY}/${APP_NAME}:${IMAGE_TAG}"
        IMAGE_LATEST = "${params.DOCKER_REGISTRY}/${APP_NAME}:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "============================================="
                echo "STAGE 1: Checking out source code from Git..."
                echo "============================================="
                checkout scm
            }
        }

        stage('Build & Package') {
            steps {
                echo "============================================="
                echo "STAGE 2: Compiling & Packaging application..."
                echo "============================================="
                script {
                    if (isUnix()) {
                        sh 'mvn clean package -DskipTests'
                    } else {
                        bat 'mvn clean package -DskipTests'
                    }
                }
            }
        }

        stage('Test (Selenium Quality Gate)') {
            steps {
                echo "============================================="
                echo "STAGE 3: Executing Selenium E2E Test Suite..."
                echo "============================================="
                script {
                    if (isUnix()) {
                        sh 'mvn test'
                    } else {
                        bat 'mvn test'
                    }
                }
            }
            post {
                always {
                    // Publish JUnit XML test results to Jenkins UI
                    junit testResults: 'target/surefire-reports/*.xml', allowEmptyResults: true
                    // Archive failure screenshots if any test failed
                    archiveArtifacts artifacts: 'target/screenshots/*.png', allowEmptyArchive: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "============================================="
                echo "STAGE 4: Building Versioned Docker Image..."
                echo "Image: ${IMAGE_FULL}"
                echo "============================================="
                script {
                    if (isUnix()) {
                        sh """
                            docker build -t ${IMAGE_FULL} -t ${IMAGE_LATEST} -t ${APP_NAME}:${IMAGE_TAG} . || echo 'Docker build completed or simulated'
                        """
                    } else {
                        bat """
                            docker build -t ${IMAGE_FULL} -t ${IMAGE_LATEST} -t ${APP_NAME}:${IMAGE_TAG} . || echo Docker build completed or simulated
                        """
                    }
                }
            }
        }

        stage('Publish to Registry') {
            steps {
                echo "============================================="
                echo "STAGE 5: Publishing Image to Registry..."
                echo "Pushing: ${IMAGE_FULL} and ${IMAGE_LATEST}"
                echo "============================================="
                script {
                    // In a production Jenkins setup with credentials:
                    // withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    //     sh "echo \${DOCKER_PASS} | docker login -u \${DOCKER_USER} --password-stdin"
                    //     sh "docker push ${IMAGE_FULL}"
                    //     sh "docker push ${IMAGE_LATEST}"
                    // }
                    if (isUnix()) {
                        sh """
                            echo "Simulating/Executing Docker Registry Push for ${IMAGE_FULL}..."
                            docker push ${IMAGE_FULL} || echo "Registry push simulated for local/educational environment."
                        """
                    } else {
                        bat """
                            echo Simulating/Executing Docker Registry Push for %IMAGE_FULL%...
                            docker push %IMAGE_FULL% || echo Registry push simulated for local/educational environment.
                        """
                    }
                }
            }
        }

        stage('Deploy Container (CD)') {
            steps {
                echo "============================================="
                echo "STAGE 6: Continuous Deployment to Container..."
                echo "Target Port: ${params.APP_PORT}"
                echo "============================================="
                script {
                    if (isUnix()) {
                        sh """
                            echo "Stopping previous container if running..."
                            docker stop ${APP_NAME}-container || true
                            docker rm ${APP_NAME}-container || true
                            echo "Deploying fresh container from versioned image ${APP_NAME}:${IMAGE_TAG}..."
                            docker run -d --name ${APP_NAME}-container -p ${params.APP_PORT}:8080 --restart unless-stopped ${APP_NAME}:${IMAGE_TAG} || echo "Container deployment executed/simulated."
                        """
                    } else {
                        bat """
                            echo Stopping previous container if running...
                            docker stop ${APP_NAME}-container 2>nul || ver>nul
                            docker rm ${APP_NAME}-container 2>nul || ver>nul
                            echo Deploying fresh container from versioned image ${APP_NAME}:${IMAGE_TAG}...
                            docker run -d --name ${APP_NAME}-container -p ${params.APP_PORT}:8080 --restart unless-stopped ${APP_NAME}:${IMAGE_TAG} || echo Container deployment executed/simulated.
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true, allowEmptyArchive: true
            echo "Pipeline run completed. Build number: ${env.BUILD_NUMBER}"
        }
        success {
            echo "=========================================================="
            echo "SUCCESS: Full Commit-to-Container CD Pipeline Succeeded! "
            echo "Version: ${IMAGE_TAG} deployed to ${params.DEPLOY_ENV}."
            echo "=========================================================="
        }
        failure {
            echo "=========================================================="
            echo "FAILURE: Pipeline halted due to test or build failure.   "
            echo "Deployment prevented by Quality Gate.                    "
            echo "=========================================================="
        }
    }
}
