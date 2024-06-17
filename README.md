# VPin Backup

A small node app that automates backing up important VPin config files.

## Prerequisites

This is a node.js app, so you will need to have node installed. _Assuming_ you want to run the app on your vpin (which runs windows) you can follow [this MS.com doc](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows) on how to install node.js on windows. It is really a single install of `nvm` and then using nvm to install versions of node.js. The artical walks you through everything you need to do.

If you are feeling more adventurous you can use [WSL on Windows](https://learn.microsoft.com/en-us/windows/wsl/install) and [install nvm](https://github.com/nvm-sh/nvm) in Linux.

After getting nvm and node installed, you will then want to [clone this repo](https://github.com/git-guides/git-clone) or [download the zip](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives#downloading-source-code-archives-from-the-repository-view) and extract so you can run the app.

## How to use it

Edit the `config.json` file with the paths for the files you wish to backup. The paths can use globbing to match folders and files and backup all files within the folders or all files that match the glob. This makes it realtively simple to backup entire folders of configs.

Once you have the paths for everything setup, you will simply run:

```
npm run start
```