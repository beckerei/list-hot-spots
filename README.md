# Use

Run `npx beckerei/list-hot-spots` in any git repository.

It generates a `file-treemap.json` file with the all pathes in the project and
the number of commits made in that pace.

## Example output
```json
{
  "cli.js": {
    "id": "cli.js",
    "name": "cli.js",
    "value": 3
  },
  ".gitignore": {
    "id": ".gitignore",
    "name": ".gitignore",
    "value": 2
  },
  "package.json": {
    "id": "package.json",
    "name": "package.json",
    "value": 1
  }
}
```
