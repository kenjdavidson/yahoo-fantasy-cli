import { Command } from '@commander-js/extra-typings';
import YahooFantasy from 'yahoo-fantasy';
import YahooFantasyWrapper from '../api/YahooFantasyApi.js';
import api from '../api/YahooFantasyApi.js';
import { loading } from '../utils.js';

const displayUserLeagues = async (api: YahooFantasyWrapper) => {
  const leagues = await loading(
    `Loading ${api.token?.userDetails?.name}'s leagues...`,
    api.api('GET', '/fantasy/v2/users;use_login=1/games;out=leagues'),
  );
};

const GamesCommand = new Command('leagues')
  .description(`request Yahoo! fantasy sports user resource/collection`)
  .option(
    '-u, --user <string>',
    'TODO - only current user is enabled at this point',
  )
  .option('-g, --games', 'user games')
  .action(async ({ user }) => {
    const api = await YahooFantasyWrapper.load();
    const leagues = await displayUserLeagues(api);

    console.log(leagues);
  });

export default GamesCommand;
