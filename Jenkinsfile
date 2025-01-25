pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
            	sh 'echo ${imageTag}'
            	sh 'docker build -t localhost:8085/luis-tseytin-transformer:${imageTag} .'
            }
        }
        stage('Push') {
			steps {
				withCredentials([usernamePassword(credentialsId: 'registry-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
					sh 'docker login localhost:8085 -u $USERNAME -p $PASSWORD'
					sh 'docker push localhost:8085/luis-tseytin-transformer${imageTag}'
				}
			}
        }
    }
}