import { Command } from '@commander-js/extra-typings';
import YahooFantasy from 'yahoo-fantasy';
import YahooFantasyWrapper from '../api/YahooFantasyApi.js';
import api from '../api/YahooFantasyApi.js';
import { loading } from '../utils.js';

const description = 'Yahoo! Fantasy Leagues';

const displayUserLeagues = async (api: YahooFantasyWrapper) => {
  const leagues = await loading(
    `Loading ${api.token?.userDetails?.name}'s leagues...`,
    api.api('GET', '/fantasy/v2/users;use_login=1/games;out=leagues'),
  );
};

const LeaguesCommand = new Command('leagues')
  .description(description)
  .option(
    '-u, --user <string>',
    'TODO - only current user is enabled at this point',
  )
  .action(async ({ user }) => {
    const api = await YahooFantasyWrapper.load();
    const leagues = await displayUserLeagues(api);

    console.log(leagues);
  });

export default LeaguesCommand;
