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
                sh '''
                    echo "checking if index.html exist in the build directory..."
                    if test -f dist/learn-jenkins-angular/browser/index.html;then 
                    echo "index.html file exist." 
                    npm test
                    else 
                    echo "index.html does not exist" 
                    exit 1
                    fi
                '''
            }
        }
    }
}