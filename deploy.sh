#!/bin/bash

echo "Creating RBAC resources..."
kubectl apply -f k8s/rbac.yaml

echo "Creating init container script..."
kubectl apply -f k8s/init-container-script.yaml

echo "Creating ConfigMap and Secrets..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

echo "Setting up MongoDB..."
kubectl apply -f k8s/mongodb-pv-pvc.yaml
kubectl apply -f k8s/mongodb.yaml

echo "Deploying backend..."
kubectl apply -f k8s/backend.yaml

echo "Deploying frontend..."
kubectl apply -f k8s/frontend.yaml

echo "Waiting for pods to start..."
sleep 10

echo "Current pods:"
kubectl get pods

echo "Current services:"
kubectl get svc
