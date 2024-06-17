# VPin Backup

A small node app that automates backing up important VPin config files.

## Prerequisites

This is a node.js app, so you will need to have node installed. _Assuming_ you want to run the app on your vpin (which runs windows) you can follow [this MS.com doc](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows) on how to install node.js on windows. It is really a single install of `nvm` and then using nvm to install versions of node.js. The artical walks you through everything you need to do.

If you are feeling more adventurous you can use [WSL on Windows](https://learn.microsoft.com/en-us/windows/wsl/install) and [install nvm](https://github.com/nvm-sh/nvm) in Linux.

After getting nvm and node installed, you will then want to [clone this repo](https://github.com/git-guides/git-clone) or [download the zip](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives#downloading-source-code-archives-from-the-repository-view) and extract so you can run the app.

## How to use it

Copy the `config-example.json` file to `config.json` and edit it with the paths for the files you wish to backup. The paths can use globbing to match folders and files and backup all files within the folders or all files that match the glob. This makes it realtively simple to backup entire folders of configs.

Once you have the paths for everything setup, you will simply run:

```
npm run start
```

## Customizing the backups

You can easily alter the paths in the `config.json` and this should cover all the most important files (this also assumes the use of PinballY as the front end). However, if you wanted to you could alter what files from what paths are archived, add new folders, and even backup your tables or pretty much anything. Just know that the amount and size of the files will impact the speed of the backup.

For me, I already keep all my tables in a separate drive from my vpin, so I really only need all the config. The backup app takes less than 30 seconds and I have the safety of mu configs if something were to happen to my vpin drive.

## Automation

If you wanted to, you could set this up to run whenever you start up your vpin. That way you would get automated backups without having to think about it. By default, the zip file is named with the datestamp that the process runs, so you could run this periodically and have a backup history.

## Issues? Questions?

If you have any problems or need any help, please create an issue and I'll get to you as soon as I can. Thanks...