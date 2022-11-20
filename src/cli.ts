#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import ApiCommand from './api/ApiCommand.js';
import LeaguesCommand from './league/LeaguesCommand.js';
import ConfigCommand from './oauth2/ConfigCommand.js';
import LoginCommand from './oauth2/LoginCommand.js';
import { readFileSync } from 'fs';

export const getProjectRoot = () => {
  let result = new URL(import.meta.url);
  let pathname = result.pathname;
  let pathArray = pathname.split('/');
  let filename = pathArray.pop();
  let distpath = pathArray.pop();
  let dirname = pathArray.join('/');

  return { pathname, dirname, distpath, filename };
};

const { dirname } = getProjectRoot();
const pkg: any = JSON.parse(readFileSync(`${dirname}/package.json`, 'utf-8'));

const cli = new Command('yfs')
  .description(pkg.description)
  .version(`v${pkg.version}`)
  .addCommand(ConfigCommand)
  .addCommand(LoginCommand)
  .addCommand(ApiCommand)
  .addCommand(LeaguesCommand);
cli.parse();
