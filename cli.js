#!/usr/bin/env node

const fs = require('fs');
const execSync = require('child_process').execSync;

try {
  const result = execSync(
    'git log --name-only  --pretty=format: | sort | uniq -c | sort -nr',
  ).toString();

  const commitsPerFile = getCommitsPerFile(result);

  const weightedPathes = getPathesWithWeight(commitsPerFile);

  writeToFile(weightedPathes);
} catch (e) {
  console.error(`Could not execute/find git.`, e);
}

/****/

function writeToFile(pathes) {
  fs.writeFileSync('hot-spots.json', JSON.stringify(pathes), err => {
    console.error('Could not write file!', err);
  });
}

function getPathesWithWeight(files) {
  const pathes = {};

  files.forEach(file => {
    const { commitCount, filePath } = file;
    if (filePath) {
      const chunkedPath = filePath.split('/');
      if (chunkedPath.length > 0) {
        const fileName = chunkedPath.pop();
        pathes[filePath] = {
          id: filePath,
          name: fileName,
          parent: chunkedPath.length > 0 ? chunkedPath.join('/') : undefined,
          commitCount,
        };

        chunkedPath.forEach((path, i) => {
          const id = chunkedPath.slice(0, i).join('/') || path;
          if (pathes.hasOwnProperty(id)) {
            pathes[id].commitCount += commitCount;
          } else {
            const parent =
              i === 0 ? undefined : chunkedPath.slice(i - 1).join('/');
            pathes[id] = {
              id,
              name: path,
              parent,
              commitCount,
            };
          }
        });
      }
    }
  });

  return sortByCommitCount(pathes);
}

function sortByCommitCount(pathes) {
  return Object.values(pathes).sort(
    (prevPath, path) => path.commitCount - prevPath.commitCount,
  );
}

function getCommitsPerFile(stdout) {
  const lines = stdout.split('\n');

  return lines.map(line => {
    const cleanLine = line.trim();
    const [commitCount, path] = cleanLine.split(' ');
    return { commitCount: parseInt(commitCount, 10), filePath: path };
  });
}
