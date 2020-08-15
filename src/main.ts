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
    const url = core.getInput('target-url', {required: false}) || defaultUrl
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
      log_url: defaultUrl,
      target_url: url,
      description,
      environment_url: environmentUrl
    }
    core.warning(JSON.stringify(params))
    const res = await client.repos.createDeploymentStatus(params)
    core.warning(JSON.stringify(res.data))
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
