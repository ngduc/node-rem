### Build System

yarn dev
- For now, `yarn dev` includes "yarn postinstall" to create symlinks for `yarn docker:dev`. Otherwise, it will fail to see the symlinks in docker. 10/03/2018

yarn build
- using "tsc", output directory is "built"