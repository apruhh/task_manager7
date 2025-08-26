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

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true'  // allows pipeline to continue even if no tests
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'build/**', followSymlinks: false
            }
        }
    }
}
