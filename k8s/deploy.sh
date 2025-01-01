#!/bin/bash

echo "Creating RBAC resources..."
kubectl apply -f rbac.yaml

echo "Creating init container script..."
kubectl apply -f init-container-script.yaml

echo "Creating ConfigMap and Secrets..."
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

echo "Setting up MongoDB..."
kubectl apply -f mongodb-pv-pvc.yaml
kubectl apply -f mongodb.yaml

echo "Deploying backend..."
kubectl apply -f backend.yaml

echo "Deploying frontend..."
kubectl apply -f frontend.yaml

echo "Waiting for pods to start..."
sleep 10

echo "Current pods:"
kubectl get pods

echo "Current services:"
kubectl get svc
