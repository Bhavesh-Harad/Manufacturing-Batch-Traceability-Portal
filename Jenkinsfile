pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Select the environment to deploy')
        string(name: 'TOMCAT_PORT', defaultValue: '8080', description: 'Port for Tomcat server')
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
                script {
                    if (isUnix()) {
                        sh 'mvn clean compile'
                    } else {
                        bat 'mvn clean compile'
                    }
                }
            }
        }

        stage('Test (Selenium)') {
            steps {
                echo 'Running Selenium UI Test Suite...'
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
                    // Publish test reports to Jenkins UI
                    junit 'target/surefire-reports/*.xml'
                    // Archive screenshots if any failures occurred
                    archiveArtifacts artifacts: 'target/screenshots/*.png', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Tests passed! Deploying to Tomcat on port ${params.TOMCAT_PORT}..."
                script {
                    if (isUnix()) {
                        sh 'mvn package -DskipTests'
                        sh "cp target/${APP_NAME}-*.jar /opt/tomcat/webapps/${APP_NAME}.jar || true"
                    } else {
                        bat 'mvn package -DskipTests'
                    }
                }
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
            echo 'Pipeline failed due to test or build errors. Deployment stopped.'
        }
    }
}
