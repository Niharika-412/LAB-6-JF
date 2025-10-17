 pipeline {
 agent any
 tools {
 maven 'MAVEN' // This matches the name in Manage Jenkins → Tools
 }
 stages {
 // ===== FRONTEND BUILD =====
 stage('Build Frontend') {
 steps {
 dir('BOOKAPI-REACT') {
 bat 'npm install'
 bat 'npm run build'
 }
 }
 }
 // ===== FRONTEND DEPLOY =====
 stage('Deploy Frontend to Tomcat') {
 steps {
 bat '''
 if exist "C:\\Program Files\\Apache Software Foundation
 \\Tomcat 10.1\\webapps\\bookreactapi" (
 rmdir /S /Q "C:\\Program Files\\Apache Software Foundation
 \\Tomcat 10.1\\webapps\\bookreactapi"
 )
 mkdir "C:\\Program Files\\Apache Software Foundation\\Tomcat 
10.1\\webapps\\bookreactapi"
 xcopy /E /I /Y BOOKAPI-REACT\\dist\\* "C:\\Program Files
 \\Apache Software Foundation\\Tomcat 10.1\\webapps\\bookreactapi"
 '''
 }
 }
 
 stage('Build Backend') {
 New Section 1 Page 4   
stage('Build Backend') {
 steps {
 dir('BOOKIAPI-SPRINGBOOT') {
 bat 'mvn clean package'
 }
 }
 }

 stage('Deploy Backend to Tomcat') {
 steps {
 bat '''
 if exist "C:\\Program Files\\Apache Software Foundation
 \\Tomcat 10.1\\webapps\\bookapi.war" (
 del /Q "C:\\Program Files\\Apache Software Foundation
 \\Tomcat 10.1\\webapps\\bookapi.war"
 )
 if exist "C:\\Program Files\\Apache Software Foundation
 \\Tomcat 10.1\\webapps\\bookapi" (
 rmdir /S /Q "C:\\Program Files\\Apache Software Foundation
 \\Tomcat 10.1\\webapps\\bookapi"
 )
 copy "BOOKAPI-SPRINGBOOT\\target\\*.war" "C:\\Program Files
 \\Apache Software Foundation\\Tomcat 10.1\\webapps\\"
 '''
 }
 }
 } // end stages
 post {
 success {
 echo 'Deployment Successful!'
 }
 failure {
 echo 'Pipeline Failed.'
 }
 }
 }