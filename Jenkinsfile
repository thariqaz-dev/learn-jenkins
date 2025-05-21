pipeline {
    agent {
        docker {
            image 'node:20-bullseye'
            reuseNode true
        }
    } 

    environment {
        NETLIFY_SITE_ID = '6a9d3807-9a19-448b-a060-07893178bd68'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }
    
    stages {
        
        stage('Setup') {
            steps {
                sh '''
                    npm ci 
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npx ng build --configuration=production'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Test') {
                    steps {
                        sh 'npm run test'
                    }
                }
                stage('E2E Test') {
                    // agent {
                    //     docker {
                    //         image 'mcr.microsoft.com/playwright:v1.52.0-jammy' // Includes all dependencies
                    //         reuseNode true
                    //     }
                    // }
                    steps {
                        script {
                            // def serverPid = sh(script: 'npx http-server dist/learn-jenkins-angular/browser -p 4201 & echo $!', returnStdout: true).trim()

                            sh '''
                                npx playwright install 
                                npx playwright test
                            '''

                            //sh 'kill ${serverPid}'
                        } 
                    }
                }
            }
        }

        stage('Approval for Production') {
            steps {
                input message: 'Approve production deployment ?', ok: 'Yes, deploy'
            }
        }

        stage('Deploy to Production') {
            steps {
                sh """
                    node --version
                    npm install netlify-cli
                    node_modules/.bin/netlify --version
                    echo "Deploying to production."
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --prod --dir=dist/learn-jenkins-angular/browser --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline Finished'
        }
        success {
            echo 'Deployment completed successfully.'
        }
        failure {
            echo 'Build or deployment failed!'
        }
    }
}