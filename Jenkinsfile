pipeline {
    agent {
        docker {
            image 'node:20-bookworm'
            reuseNode true
        }
    } 

    environment {
        NETLIFY_SITE_ID = credentials('netlify-site-id')
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }

    // options {
    //     skipDefaultCheckout true
    // }
    
    stages {

        stage('Cache Restore') {
            steps {
                script {
                    if (fileExists('node_modules/.cache_flag')) {
                        echo 'Restoring node_modules from previous build...'
                        unstash 'node_modules'
                    } else {
                        echo 'No cached node_modules found.'
                    }
                }
            }
        }

        stage('Setup') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Cache Save') {
            steps {
                sh 'touch node_modules/.cache_flag'
                stash name: 'node_modules', includes: 'node_modules/**/*'
            }
        }

        stage('Build') {
            steps {
                sh 'npx ng build --configuration=production'
            }
        }
        
        stage('Test') {
            parallel {
                
                stage('Unit Test (JEST)') {
                    steps {
                        sh 'npx ng test:unit'
                    }
                    post {
                        always {
                            junit 'jest-results/junit.xml'
                        }
                    }
                }
                
                stage('E2E Test (PLAYWRIGHT)') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.52.0-noble'
                            reuseNode true
                        }
                    }
                    steps {
                        sh '''
                            npx serve -s dist/learn-jenkins-angular/browser -l 3000 &
                            npx wait-on http://localhost:3000
                            npx playwright test  --reporter=html
                        '''
                    }
                    post {
                        always {
                            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                        }
                    }
                }
            }
        }

        stage('Approval for Production') {
            options {
                timeout(time: 15, unit: 'MINUTES')
            }
            steps {
                input message: 'Approve production deployment ?', ok: 'Yes, deploy'
            }
        }

        stage('Deploy to Production') {
            agent {
                docker {
                    image 'node:20-bookworm'
                    reuseNode true
                }
            } 
            steps {
                sh """
                    npx netlify --version
                    npx netlify status
                    npx netlify deploy --prod --dir=dist/learn-jenkins-angular/browser --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Deployment completed successfully.'
            archiveArtifacts artifacts: 'dist/learn-jenkins-angular/browser/**', fingerprint: true
        }
        failure {
            echo 'Build or deployment failed. Please check the logs for details.'
        }
    }
}