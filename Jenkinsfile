pipeline {
    agent {
        docker {
            image 'node:20-alpine'
        }
    } 
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Build') {
            steps {
                sh '''
                    echo "Build Processing"
                    npm run build 
                '''
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Test Stage"'
            }
        }
    }
}