pipeline {
    agent {
        docker {
            image 'node:20-bullseye'
        }
    } 
    stages {
        stage('Install') {
            steps {
                sh '''
                    npm ci 
                    npx playwright install --with-deps
                '''
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
                    else 
                    echo "index.html does not exist" 
                    exit 1
                    fi
                '''
            }
        }
        stage('E2E Test') {
            steps {
                sh '''
                npx http-server dist/learn-jenkins-angular/browser -p 4200 &
                sleep 5
                npx playwright test
                '''
            }
        }
    }
}