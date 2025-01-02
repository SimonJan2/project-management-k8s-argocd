# Project Management System Architecture

## Complete System Architecture Flow

```mermaid
graph TB
    subgraph "Development"
        GH[GitHub Repository]
        GA[GitHub Actions]
    end

    subgraph "Container Registry"
        DH[Docker Hub]
    end

    subgraph "Kubernetes Cluster"
        subgraph "ArgoCD"
            AC[ArgoCD Controller]
        end

        subgraph "Frontend Pod"
            FE[React Frontend]
            IC[Init Container]
        end

        subgraph "Backend Pod"
            BE[Node.js Backend]
            GQL[GraphQL API]
        end

        subgraph "Services"
            FS[Frontend Service<br>LoadBalancer]
            BS[Backend Service<br>LoadBalancer]
        end

        subgraph "Configuration"
            CM[ConfigMaps]
            SC[Secrets]
        end
    end

    subgraph "External Services"
        DB[(MongoDB Atlas)]
    end

    %% Development Flow
    GH -->|Push Trigger| GA
    GA -->|Build & Push| DH

    %% Deployment Flow
    DH -->|Pull Images| AC
    AC -->|Deploy| FE
    AC -->|Deploy| BE
    
    %% Runtime Flow
    IC -->|Get Backend URL| BS
    FE -->|API Requests| FS
    FS -->|Route| BS
    BS -->|Route| BE
    BE -->|Query/Mutate| GQL
    GQL -->|Data| DB

    %% Configuration
    CM -->|Config| BE
    SC -->|Secrets| BE

    style GH fill:#f9f,stroke:#333,stroke-width:2px
    style GA fill:#bbf,stroke:#333,stroke-width:2px
    style DH fill:#bfb,stroke:#333,stroke-width:2px
    style AC fill:#fbb,stroke:#333,stroke-width:2px
    style FE fill:#ddd,stroke:#333,stroke-width:2px
    style BE fill:#ddd,stroke:#333,stroke-width:2px
    style DB fill:#ff9,stroke:#333,stroke-width:2px
```

## Architecture Components Description

1. **Development Environment**
   - GitHub repository hosts the source code
   - GitHub Actions handles CI/CD pipeline
   - Automated builds and tests on push to main branch

2. **Container Registry**
   - Docker Hub stores container images
   - Separate repositories for frontend and backend images
   - Tagged versions for deployment tracking

3. **Kubernetes Cluster**
   - **ArgoCD**
     - Manages GitOps-based deployments
     - Monitors repository for changes
     - Automatically syncs cluster state

   - **Frontend Deployment**
     - React application container
     - Init container for backend service discovery
     - LoadBalancer service for external access

   - **Backend Deployment**
     - Node.js server with GraphQL
     - Environment configuration via ConfigMaps
     - Secure data via Kubernetes Secrets
     - LoadBalancer service for API access

4. **External Services**
   - MongoDB Atlas for persistent data storage
   - Secure connection via configuration

## Data Flow

1. User requests reach the frontend service
2. Frontend service routes to React application
3. React app makes GraphQL queries to backend service
4. Backend processes requests through GraphQL API
5. Data is persisted in MongoDB Atlas
6. Changes are reflected back to the user interface

## Deployment Flow

1. Code changes pushed to GitHub
2. GitHub Actions builds new container images
3. Images are pushed to Docker Hub
4. ArgoCD detects changes in manifests
5. Kubernetes cluster is updated with new deployments
6. Rolling updates ensure zero-downtime deployments
