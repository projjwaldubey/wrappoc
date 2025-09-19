# WrapPoc ArgoCD Setup

This repository contains the necessary YAML manifests to set up ArgoCD project and namespace for the WrapPoc application.

## Structure

```
├── argocd-manifests/
│   ├── namespace.yaml     # Creates namespaces for the app and ArgoCD
│   ├── appproject.yaml    # Defines ArgoCD AppProject with RBAC
│   └── application.yaml   # ArgoCD Application configuration
└── k8s-manifests/
    └── deployment.yaml    # Sample application deployment and service
```

## Setup Instructions

### Prerequisites
- ArgoCD installed in your Kubernetes cluster
- Access to the Kubernetes cluster
- GitLab repository set up

### Step 1: Update Repository URL
Before applying the manifests, update the `repoURL` in `argocd-manifests/application.yaml` to point to your actual GitLab repository:

```yaml
source:
  repoURL: https://gitlab.com/your-username/wrappoc.git  # Update this
```

### Step 2: Apply ArgoCD Manifests
Apply the ArgoCD manifests to your cluster:

```bash
kubectl apply -f argocd-manifests/
```

This will create:
- **Namespaces**: `wrappoc-app` and `argocd` 
- **AppProject**: `wrappoc-project` with proper RBAC policies
- **Application**: `wrappoc-app` configured for GitOps deployment

### Step 3: Verify Setup
Check that the ArgoCD application is created and syncing:

```bash
kubectl get applications -n argocd
kubectl get appprojects -n argocd
```

## ArgoCD Configuration Details

- **Project**: `wrappoc-project`
- **Application**: `wrappoc-app`
- **Target Namespace**: `wrappoc-app`
- **Source Path**: `k8s-manifests/`
- **Sync Policy**: Automated with self-heal and prune enabled

## Customization

To customize for your specific application:

1. Update the application name and labels in all manifests
2. Modify the source repository URL and path
3. Adjust resource permissions in the AppProject
4. Update the deployment configuration in `k8s-manifests/`

## Troubleshooting

- Ensure ArgoCD has access to your GitLab repository
- Check that the repository URL is correct and accessible
- Verify that the path `k8s-manifests/` exists in your repository
- Review ArgoCD application logs for sync issues