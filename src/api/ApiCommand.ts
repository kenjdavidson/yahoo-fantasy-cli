import { Command } from '@commander-js/extra-typings';
import { error, loading } from '../utils.js';
import YahooFantasyWrapper from './YahooFantasyApi.js';
import jp from 'jsonpath';
import inquirer from 'inquirer';

const afterHelp = `
Interactive mode allows you to run repeated jsonpath queries against the data.  For more information look at the guide https://developer.yahoo.com/fantasysports/guide/.

Examples:

$.fantasy_content
  is the root for all Yahoo! Fantasy api responses
  
$.fantasy_content.users["0"].user[1].games[*].game
  filters out the array of games from a users games collection
  
`;

const interactive = (def?: string) => [
  {
    type: 'input',
    name: 'jsonpath',
    message: 'JsonPath (q to exist)',
  },
];

const displayJsonPath = (data: any, jsonpath: string) => {
  try {
    console.log(JSON.stringify(jp.query(data, jsonpath), undefined, 2));
  } catch (err) {
    error(`Unable to process jsonpath ${jsonpath}`, err);
  }
};

const ApiCommand = new Command('api')
  .description('send custom requests to the Yahoo! Fantasy API.')
  .addHelpText('after', afterHelp)
  .option('-m, --method <string>', 'http method used for request', 'GET')
  .option('-p, --jsonpath <string>', 'jsonpath to run on output')
  .option('-i, --interactive', 'interactive input of jsonpath queries')
  .argument(
    '<uri>',
    'the API uri. Example: /fantasy/v2/users;use_login=1/games',
  )
  .action(async (arg, options) => {
    try {
      const api = await YahooFantasyWrapper.load();
      const data = await loading(
        `Loading data for '${arg}'`,
        //@ts-ignore
        api.api(options.method.toUpperCase(), arg),
      );

      //@ts-ignore
      displayJsonPath(data, options.jsonpath || '$');

      //@ts-ignore
      if (options.interactive) {
        let lastPath: string = '';
        do {
          const inputs = await inquirer.prompt(interactive(lastPath));
          lastPath = inputs.jsonpath;

          if (['Q', 'q'].includes(lastPath)) break;
          displayJsonPath(data, lastPath);
        } while (true);
      }
    } catch (err: any) {
      console.log(err);
      error(
        `Error while attempting api request ${arg}`,
        err.description || err,
      );
    }
  });

export default ApiCommand;

/*
Some sample requests for this

$> yfs api -p "$.fantasy_content.users["0"].user[1].games" "/fantasy/v2/users;use_login=1/games"
*/
