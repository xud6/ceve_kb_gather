pipeline {
    agent {
        label 'docker'
    }
    environment { 
        registry_image = 'ccr.ccs.tencentyun.com/wszxjc/wszxjc_datacollector_fakedata'
    }
    stages {
        stage('information gather') {
            steps {
                echo 'Print useful information'
                sh 'env'
                sh 'which docker'
            }
        }
        stage('test setup') {
            agent {
                dockerfile {
                    filename 'jenkins-env.Dockerfile'
                    registryUrl 'https://docker-registry.hzky.xyz'
                    label 'docker'
                }
            }
            stages {
                stage('install packages') {
                    steps {
                        sh 'npm install'
                    }
                }
                stage('try build app') {
                    steps {
                        sh 'npm run build'
                    }
                }
                stage('run tests') {
                    steps {
                        sh 'npm run test'
                    }
                }
            }
        }
    }
}
