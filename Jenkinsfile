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
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to Tomcat on port ${params.TOMCAT_PORT}..."
                // Assuming Tomcat is running locally for demonstration purposes
                // Real deployment might use Ansible or SSH via Publish Over SSH plugin
                sh "cp target/${APP_NAME}-*.jar /opt/tomcat/webapps/${APP_NAME}.jar"
                
                // Example showing parameter usage in deployment script
                echo "Deployment to ${params.DEPLOY_ENV} completed successfully."
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            echo 'Archived build artifacts.'
        }
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'Pipeline failed. Please check logs.'
        }
    }
}
