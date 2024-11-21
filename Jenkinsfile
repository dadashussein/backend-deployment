pipeline {
    agent any
    
    stages {
        stage('Debug Information') {
            steps {
                script {
                    // Print out detailed debug information
                    sh '''
                        pwd
                        ls -la
                        whoami
                        env
                        git --version
                        docker --version
                        helm version
                        kubectl version --client
                    '''
                }
            }
        }
        
        stage('List Repository Contents') {
            steps {
                sh '''
                    echo "Repository Contents:"
                    find . -maxdepth 2 -type d
                '''
            }
        }
        
        stage('Check Email Service App') {
            steps {
                dir('email-service-app') {
                    sh '''
                        echo "Contents of email-service-app:"
                        ls -la
                        if [ -f Dockerfile ]; then
                            echo "Dockerfile exists"
                        else
                            echo "Dockerfile NOT FOUND"
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline run completed'
        }
        success {
            echo 'Pipeline succeeded! 🟢'
        }
        failure {
            echo 'Pipeline failed! 🔴'
        }
    }
}