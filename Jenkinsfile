pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.52.0-noble'
            reuseNode true
        }
    }

    environment {
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }

    // options {
    //     skipDefaultCheckout true
    // }
    
    stages {

        stage('Setup & Cache') {
            steps {
                script {
                    try {
                        unstash 'node_modules'
                        echo 'node_modules restored from previous stash.'
                    } catch (err) {
                        echo 'No cached node_modules found (probably first build).'
                    }

                    sh 'npm ci'

                    sh 'touch node_modules/.cache_flag'
                    stash name: 'node_modules', includes: 'node_modules/**/*'
                    echo 'node_modules stashed for next build.'
                }
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
                        sh 'npm run test:unit'
                    }
                    post {
                        always {
                            junit 'jest-results/junit.xml'
                        }
                    }
                }
                
                stage('E2E Test (PLAYWRIGHT)') {
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
            steps {
                withCredentials([
                    string(credentialsId: 'netlify-token', variable: 'NETLIFY_AUTH_TOKEN'),
                    string(credentialsId: 'netlify-site-id', variable: 'NETLIFY_SITE_ID')
                ]) {
                    sh """
                        npx netlify --version
                        npx netlify status
                        npx netlify deploy --prod --dir=dist/learn-jenkins-angular/browser --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
                    """
                }
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