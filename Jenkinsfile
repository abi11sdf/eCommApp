pipeline {
  agent any
  environment {
    AWS_ACCOUNT_ID   = "869823016797"
    AWS_REGION       = "us-east-1"
    ECR_REPO         = "ecom-try"            // <- use same as ECR repo created
    IMAGE_TAG        = "latest"
    EKS_CLUSTER_NAME = "TRY-eks"
  }
  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/abi11sdf/eCommApp.git', branch: 'main'
      }
    }
    
    stage('Build & Push Image') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
          sh '''
            echo "=== Building Docker Image ==="
            docker build -t $ECR_REPO:$IMAGE_TAG .
            
            echo "=== Logging in to ECR ==="
            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
            
            echo "=== Tagging Image ==="
            docker tag $ECR_REPO:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
            
            echo "=== Pushing Image to ECR ==="
            docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
          '''
        }
      }
    }
    
    stage('Deploy to EKS') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
          sh '''
            echo "=== Updating kubeconfig for cluster $EKS_CLUSTER_NAME ==="
            aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME
            
            echo "=== Applying Kubernetes Manifests ==="
            kubectl apply -f deployment-frontend.yaml
            kubectl apply -f service-frontend.yaml
            kubectl apply -f frontend-ingress.yaml
            
            echo "=== Updating Image in Deployment ==="
            kubectl set image deployment/frontend-deployment frontend=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
            
            kubectl rollout restart deployment frontend-deployment
            
            echo "=== Checking Deployment Status ==="
            kubectl get deployment frontend-deployment
            kubectl get pods -l app=frontend
            kubectl get svc frontend-service
            kubectl get ingress frontend-ingress
            
            echo "=== Pod Logs (last 50 lines) ==="
            kubectl logs -l app=frontend --tail=50 || echo "No logs available"
            
            echo "=== Pod Description for Debugging ==="
            kubectl describe pods -l app=frontend
          '''
        }
      }
    }
  }
  
  post {
    always {
      sh 'docker image prune -f'
    }
    success {
      echo '✅ Deployment successful!'
    }
    failure {
      echo '❌ Deployment failed!'
    }
  }
}
