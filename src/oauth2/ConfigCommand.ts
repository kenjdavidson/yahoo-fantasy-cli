import { Command } from '@commander-js/extra-typings';
import inquirer, { Answers, QuestionCollection } from 'inquirer';
import { trim, error } from '../utils.js';
import OAuth2Config, { printConfig, writeConfig } from './OAuth2Config.js';

const description = `Configure Yahoo! Fantasy CLI App`;
const helpAfter =
  trim(`Yahoo! OAuth2 applications can be created with the Yahoo! developer portal: https://developer.yahoo.com/apps/).  Once created
you will need to configure the CLI with the: client id, client secret and redirect uri (although in this case it's most likely
Out of Bound/Band).`);

const options: QuestionCollection<Answers> = [
  {
    type: 'input',
    name: 'clientId',
    message: 'Client Id',
  },
  {
    type: 'input',
    name: 'clientSecret',
    message: 'Client Secret',
  },
  {
    type: 'input',
    name: 'redirectUri',
    message: 'Redirect Uri',
    default: 'oob',
  },
];

const showConfig = async () => {
  try {
    console.log('Current Yahoo! OAuth2 configuration');
    const config = await OAuth2Config.load();
    printConfig(config);
  } catch (err) {
    error('Could not read configuration file.', err);
  }
};

const saveConfig = async () => {
  const answers = await inquirer.prompt(options);
  const config = new OAuth2Config(
    answers.clientId,
    answers.clientSecret,
    answers.redirectUri,
  );
  try {
    console.log('Writing Yahoo! OAuth2 configuration');
    await writeConfig(config);
  } catch (err) {
    error('Could not write configuration file.', err);
  }
};

const configure = new Command('config')
  .description(description)
  .option('-i, --info', 'Display current app configuration')
  .option('-s, --save', 'Save new app configuration')
  .addHelpText('after', helpAfter)
  .action(async ({ info, save }) => {
    if (save) {
      saveConfig();
    }
    if (info) {
      showConfig();
    }
  });

export default configure;