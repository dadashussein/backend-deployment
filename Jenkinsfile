pipeline {
    agent any

    environment {
        KUBECONFIG = '/var/lib/jenkins/kubeconfig'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/dadashussein/backend-deployment.git'
            }
        }

        stage('Build') {
            steps {
                sh '''
                echo "Building Docker image"
                docker build -t registry.digitalocean.com/dadas/email-service:latest .
                '''
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                echo "Pushing Docker image to registry"
                docker push registry.digitalocean.com/dadas/email-service:latest
                '''
            }
        }

        stage('Deploy to k3s') {
            steps {
                sh '''
                echo "Deploying to k3s using Helm"
                helm upgrade --install email-app ./helm-chart --namespace default
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl get pods --namespace default
                kubectl get svc --namespace default
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
