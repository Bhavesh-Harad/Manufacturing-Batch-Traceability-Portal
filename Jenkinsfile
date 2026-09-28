pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Select the environment to deploy')
        string(name: 'TOMCAT_PORT', defaultValue: '8080', description: 'Port for Tomcat server')
    }

    tools {
        maven 'Maven 3.x'
        jdk 'JDK 17'
    }

    environment {
        APP_NAME = 'traceability-portal'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build & Package') {
            steps {
                echo "Building application for ${params.DEPLOY_ENV} environment..."
                // Build without running tests to package it first, or just compile
                sh 'mvn clean compile'
            }
        }

        stage('Test (Selenium)') {
            steps {
                echo 'Running Selenium UI Test Suite...'
                // Run Maven test phase
                sh 'mvn test'
            }
            post {
                always {
                    // Publish test reports to Jenkins UI
                    junit 'target/surefire-reports/*.xml'
                    // Archive screenshots if any failures occurred
                    archiveArtifacts artifacts: 'target/screenshots/*.png', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy') {
            steps {
                // This stage will NOT run if the 'Test' stage fails
                echo "Tests passed! Deploying to Tomcat on port ${params.TOMCAT_PORT}..."
                sh 'mvn package -DskipTests'
                sh "cp target/${APP_NAME}-*.jar /opt/tomcat/webapps/${APP_NAME}.jar"
                echo "Deployment to ${params.DEPLOY_ENV} completed successfully."
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true, allowEmptyArchive: true
            echo 'Archived build artifacts.'
        }
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'Pipeline failed due to test errors. Deployment stopped.'
        }
    }
}
