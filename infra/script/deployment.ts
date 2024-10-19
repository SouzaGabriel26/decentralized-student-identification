import { exec as child_process_exec } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(child_process_exec);

deployment();

async function deployment() {
  const token = process.env.VERCEL_TOKEN;

  console.log('> Pull changes from Vercel');
  await exec(`vercel pull --yes --token=${token}`);
  console.log('> Pull changes from Vercel: Done');

  console.log('> Building on Vercel');
  await exec(`vercel build --token=${token}`);
  console.log('> Building on Vercel: Done');

  console.log('> Deploying on Vercel');
  const { stdout: previewUrl } = await exec(
    `vercel deploy --prod --token=${token}`,
  );
  console.log('> Deploying on Vercel: Done');

  console.log('> Creating pull request comment');
  await createPullRequestComment(`Deployed on [Vercel](${previewUrl})`);
  console.log('> Creating pull request comment: Done');
}

async function createPullRequestComment(comment: string) {
  const pullRequestNumber = process.env.STD_IDENTIFICATION_PULL_REQUEST_NUMBER;
  const token = process.env.VERCEL_TOKEN;

  await fetch(
    `https://api.github.com/repos/souzagabriel26/student-identification/issues/${pullRequestNumber}/comments`,
    {
      method: 'POST',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        body: comment,
      }),
    },
  );
}
