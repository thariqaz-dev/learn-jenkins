pipeline {
    agent {
        docker {
            image 'node:20-bullseye'
        }
    } 

    environment {
        NETLIFY_SITE_ID = '6a9d3807-9a19-448b-a060-07893178bd68'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }
    
    stages {
        stage('Install') {
            steps {
                sh '''
                    npm ci 
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
                    npm run test -- --watch=false --browsers=ChromeHeadless
                    else 
                    echo "index.html does not exist" 
                    exit 1
                    fi
                '''
            }
        }
        // stage('E2E Test') {
        //     steps {
        //         sh '''
        //         npx playwright install --with-deps
        //         npx http-server dist/learn-jenkins-angular/browser -p 4200 &
        //         sleep 5
        //         npx playwright test
        //         '''
        //     }
        // }
    }

    post {
        success {
        echo 'Deployment completed successfully.'
        }
        failure {
        echo 'Build or deployment failed!'
        }
  }
}