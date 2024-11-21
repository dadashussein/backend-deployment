pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'registry.digitalocean.com/dadas'
        SERVICE_NAME = 'email-service'
        KUBECONFIG = credentials('k3s-kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/dadashussein/backend-deployment.git'
            }
        }
        
        stage('Navigate to Project Directory') {
            steps {
                dir('email-service-app') {
                    sh 'pwd'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                dir('email-service-app') {
                    script {
                        docker.build("${DOCKER_REGISTRY}/${SERVICE_NAME}:${env.BUILD_NUMBER}")
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                dir('email-service-app') {
                    script {
                        docker.withRegistry('https://registry.digitalocean.com', 'digitalocean-registry-credentials') {
                            docker.image("${DOCKER_REGISTRY}/${SERVICE_NAME}:${env.BUILD_NUMBER}").push()
                            docker.image("${DOCKER_REGISTRY}/${SERVICE_NAME}:${env.BUILD_NUMBER}").push('latest')
                        }
                    }
                }
            }
        }
        
        stage('Deploy to K3s') {
            steps {
                dir('helm-chart') {
                    script {
                        sh """
                            helm upgrade --install ${SERVICE_NAME} . \
                            --set image.repository=${DOCKER_REGISTRY}/${SERVICE_NAME} \
                            --set image.tag=${env.BUILD_NUMBER} \
                            --namespace default
                        """
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    sh '''
                        kubectl get pods -n default
                        kubectl get services -n default
                        kubectl rollout status deployment/${SERVICE_NAME} -n default
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful! 🚀'
        }
        failure {
            echo 'Deployment failed! 🚨'
        }
        always {
            // Clean up Docker images
            sh 'docker system prune -f'
        }
    }
}