#!/usr/bin/env node

const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);

(async () => {
  const { stdout, stderr } = await exec(
    'git log --name-only  --pretty=format: | sort | uniq -c | sort -nr',
  );

  if (stderr) {
    console.error(`Could not execute/find git.`);
  }

  const commitsPerFile = getCommitsPerFile(stdout);

  getPathesWithWeight(commitsPerFile);
})();

/****/

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
          value: commitCount,
        };

        chunkedPath.forEach((path, i) => {
          const id = chunkedPath.slice(0, i).join('/') || path;
          if (pathes.hasOwnProperty(id)) {
            pathes[id].value += commitCount;
          } else {
            const parent =
              i === 0 ? undefined : chunkedPath.slice(i - 1).join('/');
            pathes[id] = {
              id,
              name: path,
              parent,
              value: commitCount,
            };
          }
        });
      }
    }
  });

  fs.writeFileSync('file-treemap.json', JSON.stringify(pathes), err => {
    console.error('Could not write file!');
  });

  return pathes;
}

function getCommitsPerFile(stdout) {
  const lines = stdout.split('\n');

  return lines.map(line => {
    const cleanLine = line.trim();
    const [commitCount, path] = cleanLine.split(' ');
    return { commitCount: parseInt(commitCount, 10), filePath: path };
  });
}
