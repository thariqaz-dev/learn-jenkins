pipeline {
    agent {
        docker {
            image 'node:20-bookworm'
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
                    npx playwright install-deps
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
                        sh 'npm run test:unit'
                    }
                    post {
                        always {
                            junit 'jest-results/junit.xml'
                        }
                    }
                }
                stage('E2E Test') {
                    // agent {
                    //     docker {
                    //         image 'mcr.microsoft.com/playwright:v1.52.0-noble'
                    //         reuseNode true
                    //     }
                    // }

                    steps {
                        sh '''
                            npm install serve
                            node_modules/.bin/serve -s dist/learn-jenkins-angular/browser &
                            sleep 10
                            npx playwright test  --reporter=html
                        '''
                    }

                    post {
                        always {
                            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Local E2E', reportTitles: '', useWrapperFileDirectly: true])
                        }
                    }
                    // steps {
                    //     echo "To be implement"
                    // }
                }
                
                //stage('E2E Test') {
                    // agent {
                    //     docker {
                    //         image 'mcr.microsoft.com/playwright:v1.52.0-noble'
                    //         reuseNode true
                    //     }
                    // }

                //     steps {
                //         sh '''
                //             npm install serve
                //             node_modules/.bin/serve -s build &
                //             sleep 10
                //             npx playwright test  --reporter=html
                //         '''
                //     }

                //     post {
                //         always {
                //             publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Local E2E', reportTitles: '', useWrapperFileDirectly: true])
                //         }
                //     }
                // }
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