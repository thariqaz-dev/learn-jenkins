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
                sh 'npm ci'
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
                        sh 'npx ng test --watch=false --browsers=ChromeHeadless'
                    }
                }
                stage('E2E Test') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.52.0-jammy'
                            reuseNode true
                        }
                    }
                    steps {
                        script {
                            def serverPid = sh(script: 'npx http-server dist/learn-jenkins-angular/browser -p 4201 & echo $!', returnStdout: true).trim()

                            sh '''
                                npx playwright test 
                            '''

                            sh 'kill ${serverPid}'
                        } 
                    }
                }
            }
        }
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