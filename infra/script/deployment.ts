import { exec as child_process_exec } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(child_process_exec);

//deployment();

async function deployment() {
  const token = process.env.VERCEL_TOKEN;

  console.log('> Pull changes from Vercel');
  await exec(`vercel pull --yes --token=${token}`);
  console.log('> Pull changes from Vercel: Done');

  console.log('> Building on Vercel');
  await exec(`vercel build --token=${token}`);
  console.log('> Building on Vercel: Done');

  console.log('> Deploying on Vercel');
  const { stdout: productionDeployUrl } = await exec(
    `vercel deploy --prod --token=${token}`,
  );
  await exec(`vercel promote ${productionDeployUrl} --token=${token}`);
  console.log('> Deploying on Vercel: Done');

  console.log('> Creating pull request comment');
  await createPullRequestComment(
    `Deployed on [Vercel](${productionDeployUrl})`,
  );
  console.log('> Creating pull request comment: Done');
}

async function createPullRequestComment(comment: string) {
  const pullRequestNumber = await getPullRequestNumber();
  if (!pullRequestNumber) {
    return;
  }

  const token = process.env.VERCEL_TOKEN;

  try {
    const res = await fetch(
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

    console.log(await res.json());
  } catch {
    console.log('Error creating pull request comment');
  }
}

async function getPullRequestNumber() {
  try {
    const response = await fetch(
      'https://api.github.com/repos/souzagabriel26/student-identification/pulls?state=all&direction=desc',
      {
        method: 'GET',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    const pullRequests = await response.json();
    console.log(pullRequests[0].number);
    return pullRequests[0].number as number;
  } catch {
    console.log('Error getting pull request number');
    return null;
  }
}
