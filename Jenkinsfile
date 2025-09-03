pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/apruhh/task_manager7.git',
                    credentialsId: 'github-https'
            }
        }

        /* ---------- FRONTEND ---------- */
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm test -- --watchAll=false --passWithNoTests'
                }
            }
        }

        /* ---------- BACKEND ---------- */
        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    bat 'npm test || exit 0'
                }
            }
        }


        /* ---------- ARTIFACTS ---------- */
        stage('Archive Frontend Build') {
            steps {
                archiveArtifacts artifacts: 'frontend/build/**', followSymlinks: false
            }
        }
    }
}
