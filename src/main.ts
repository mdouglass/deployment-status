import * as core from '@actions/core'
import * as github from '@actions/github'

type DeploymentState =
  | 'error'
  | 'failure'
  | 'inactive'
  | 'in_progress'
  | 'queued'
  | 'pending'
  | 'success'

async function run(): Promise<void> {
  try {
    const context = github.context
    const defaultUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`

    const token = core.getInput('token', {required: true})
    const logUrl = core.getInput('log-url', {required: false}) || defaultUrl
    const targetUrl =
      core.getInput('target-url', {required: false}) || defaultUrl
    const description = core.getInput('description', {required: false}) || ''
    const deploymentId = core.getInput('deployment-id')
    const environmentUrl =
      core.getInput('environment-url', {required: false}) || ''
    const state = core.getInput('state') as DeploymentState

    const client = github.getOctokit(token, {previews: ['flash', 'ant-man']})

    const params = {
      ...context.repo,
      deployment_id: parseInt(deploymentId),
      state,
      log_url: logUrl,
      target_url: targetUrl,
      description,
      environment_url: environmentUrl
    }
    await client.repos.createDeploymentStatus(params)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
