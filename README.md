Developers should work in the `main` branch. We're not using `develop` or `master` since this repo is meant to be a submodule and doesn't need to be deployed with the pipeline.

# Contributing
Create a feature branch from the latest `main` branch code. After development is finished, submit a PR with `main` as the target.

# Publishing
Make sure you have access to publish to the artifactory. Run the following (make sure to apply the correct tag):

```
npm login --registry https://artifactory.helix.gsa.gov/artifactory/api/npm/ART-001-GP-SFE-npm/
npm publish --registry https://artifactory.helix.gsa.gov/artifactory/api/npm/ART-001-GP-SFE-npm/ --tag r13.3
```