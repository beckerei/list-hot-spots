# Use

Run `npx beckerei/list-hot-spots` in any git repository.

It generates a `file-treemap.json` file with the all pathes in the project and
the number of commits made in that pace.

## Example output

```json
[
  {
    "id": "cli.js",
    "name": "cli.js",
    "commitCount": 3
  },
  {
    "id": ".gitignore",
    "name": ".gitignore",
    "commitCount": 2
  },
  {
    "id": "package.json",
    "name": "package.json",
    "commitCount": 1
  },
  {
    "id": "README.md",
    "name": "README.md",
    "commitCount": 1
  }
]
```
