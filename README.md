# Slack Messages

This action provide a way to sent messages to Slack.

## Inputs

| Key | Description | Required | |
| --- | ----------- | -------- | -- |
| `WEBHOOK_URL` | The Slack webhook URL | **TRUE** | |
| `SLACK_CHANNEL` | The channel that receives the message | **TRUE** | |
| `MESSAGE` | Message of the notification | **TRUE** | |
| `STATUS` | Used to draw the color of the message status | **FALSE** | Use `${{job.status}}` |

## Example usage

Create the file `workflow.yml` in `.github/workflows` folder.

```
name: Slack Message after build
on [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: raulanatol/slack-message-github-action@v1.3.0
        env:
          WEBHOOK_URL: ${{secrets.SLACK_WEBHOOK_URL}}
          SLACK_CHANNEL: ${{secrets.SLACK_NOTIFICATION_CHANNEL}}
          MESSAGE: Compilation ends
          STATUS: ${{job.status}}
```

## Send Slack message only when jobs failed

```
name: Slack Message after job fail
on [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: raulanatol/slack-message-github-action@v1.3.0
        env:
          WEBHOOK_URL: ${{secrets.SLACK_WEBHOOK_URL}}
          SLACK_CHANNEL: ${{secrets.SLACK_NOTIFICATION_CHANNEL}}
          MESSAGE: Compilation ends
          STATUS: ${{job.status}}
        if: failure()
```
