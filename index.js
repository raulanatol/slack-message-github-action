const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const FAILURE_COLOR = '#d73949';
const DEFAULT_COLOR = '#3185FC';
const SUCCESS_COLOR = '#41a744';

function post(slackMessage) {
    fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(slackMessage),
        headers: { 'Content-Type': 'application/json' },
    }).catch(console.error);
}

function getColor(status) {
    if (status.toLowerCase() === 'success') {
        return SUCCESS_COLOR;
    }

    if (status.toLowerCase() === 'failure') {
        return FAILURE_COLOR;
    }

    return DEFAULT_COLOR;
}

function generateSlackMessage(text) {
    const actor = github.context.actor;
    const status = process.env.STATUS || '';
    const commitURL = github.context.payload.head_commit.url;
    return {
        channel: process.env.SLACK_CHANNEL,
        username: process.env.BOT_USERNAME,
        attachments: [
            {
                fallback: text,
                color: getColor(status),
                author_name: actor,
                author_link: `http://github.com/${actor}`,
                author_icon: `http://github.com/${actor}.png?size=32`,
                title: `CI/CD: ${status}`,
                title_link: `${commitURL}/checks`,
                text: `${github.context.payload.head_commit.message}\n\n`,
                "fields": [
                    {
                        "title": "Ref",
                        "value": github.context.ref,
                        "short": true
                    },
                    {
                        "title": "Commit URL",
                        "value": `<${commitURL}|${commitURL.split('/').pop()}>`,
                        "short": true
                    }
                ]
            }
        ]
    };
}

try {
    post(generateSlackMessage(process.env.MESSAGE));
} catch (e) {
    core.setFailed(e.message);
}

