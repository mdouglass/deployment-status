# deployment-status

A GitHub action to update the status of [Deployments](https://developer.github.com/v3/repos/deployments/) as part of your GitHub CI workflows.

Works great with my other action to create Deployments, [mdouglass/deployment-action](https://github.com/mdouglass/deployment-action).

## Action inputs

| name              | description                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `state`           | The state to set the deployment to. Must be one of the below: "error" "failure" "inactive" "in_progress" "queued" "pending" "success" |
| `token`           | GitHub token                                                                                                                          |
| `log-url`      | (Optional) The log URL. This should be the URL of the deployment status event                                                            |
| `description`     | (Optional) Descriptive message about the deployment                                                                                   |
| `environment-url` | (Optional) Sets the URL for accessing your environment                                                                                |
| `deployment-id`   | The ID of the deployment to update                                                                                                    |

## Usage example

The below example includes `mdouglass/deployment-action` and `mdouglass/deployment-status` to create and update a deployment within a workflow.

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: mdouglass/deployment-action@releases/v1
        name: Create GitHub deployment
        id: deployment
        with:
          token: "${{ github.token }}"
          environment-url: http://my-app-url.com
          environment: production

      - name: Deploy my app
        run: |
          # add your deployment code here

      - name: Update deployment status (success)
        if: success()
        uses: mdouglass/deployment-status@releases/v1
        with:
          token: "${{ github.token }}"
          environment-url: http://my-app-url.com
          state: "success"
          deployment-id: ${{ steps.deployment.outputs.deployment-id }}

      - name: Update deployment status (failure)
        if: failure()
        uses: mdouglass/deployment-status@releases/v1
        with:
          token: "${{ github.token }}"
          environment-url: http://my-app-url.com
          state: "failure"
          deployment-id: ${{ steps.deployment.outputs.deployment-id }}
```

## Development

Install dependencies with `npm install`.

## Building

Build everything with `npm run all`.

## Testing

There is a validation workflow in `.github/workflows/validate.yml` which performs a basic smoke test against the action to check that it runs.
