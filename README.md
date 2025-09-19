# WrapPoc ArgoCD Setup

This repository contains the necessary YAML manifests to set up ArgoCD project and namespace for the WrapPoc application.

## Structure

```
├── argocd-manifests/
│   ├── namespace.yaml     # Creates namespaces for the app and ArgoCD
│   ├── appproject.yaml    # Defines ArgoCD AppProject with RBAC
│   └── application.yaml   # ArgoCD Application configuration
├── argocd-manifests-json/
│   ├── namespace.json     # JSON version of namespace manifests
│   ├── appproject.json    # JSON version of ArgoCD AppProject
│   └── application.json   # JSON version of ArgoCD Application
├── k8s-manifests/
│   └── deployment.yaml    # Sample application deployment and service
└── k8s-manifests-json/
    └── deployment.json    # JSON version of deployment manifests
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

**Using YAML files:**
```bash
kubectl apply -f argocd-manifests/
```

**Using JSON files (alternative):**
```bash
kubectl apply -f argocd-manifests-json/
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
- **Formats**: Available in both YAML and JSON formats

## YAML to JSON Conversion

This repository includes a JavaScript-based conversion tool to convert YAML manifests to JSON format:

### Using the Conversion Script:
```bash
# Install dependencies
npm install

# Run conversion
npm run convert
# or
node convert-yaml-to-json.js
```

The script uses the `js-yaml` library and automatically:
- Converts all YAML files to JSON format
- Handles multi-document YAML files (creates arrays)
- Preserves proper JSON formatting
- Creates output directories if needed

## Customization

To customize for your specific application:

1. Update the application name and labels in all manifests
2. Modify the source repository URL and path
3. Adjust resource permissions in the AppProject
4. Update the deployment configuration in `k8s-manifests/`
5. Re-run the conversion script if you modify YAML files

## Troubleshooting

- Ensure ArgoCD has access to your GitLab repository
- Check that the repository URL is correct and accessible
- Verify that the path `k8s-manifests/` exists in your repository
- Review ArgoCD application logs for sync issues