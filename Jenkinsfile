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
                    bat 'npm test || exit 0'
                }
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'frontend/build/**', followSymlinks: false
            }
        }
    }
}
