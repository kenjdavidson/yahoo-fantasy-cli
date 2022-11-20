#!/usr/bin/node

import { Command } from '@commander-js/extra-typings';
import LeaguesCommand from './league/LeaguesCommand.js';
import ConfigCommand from './oauth2/ConfigCommand.js';
import LoginCommand from './oauth2/LoginCommand.js';

const cli = new Command('yfs')
  .description('1.0.0')
  .version('Manage Yahoo! Fantasy teams from the command line')
  .addCommand(ConfigCommand)
  .addCommand(LoginCommand)
  .addCommand(LeaguesCommand);
cli.parse();
