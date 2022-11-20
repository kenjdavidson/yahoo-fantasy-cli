import { Command } from '@commander-js/extra-typings';
import inquirer, { Answers, QuestionCollection } from 'inquirer';
import { trim, error, loading } from '../utils.js';
import YahooFantasy, { Query, UserInfo } from 'yahoo-fantasy';
import OAuth2Token from './OAuth2Token.js';
import { stringify } from 'querystring';
import OAuth2Config from './OAuth2Config.js';
import chalk from 'chalk';
import ora from 'ora';
import axios from 'axios';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  state?: string;
}

const description = `Login to Yahoo!`;
const helpAfter = `\nPlease open the login page provided in a browser.  Once you've completed the login, you'll be provided a custom code.  This code will be used to authorize the CLI with your Yahoo! account.`;

const options: QuestionCollection<Answers> = [
  {
    type: 'input',
    name: 'code',
    message: 'Yahoo! code',
  },
];

const buildQuery = (code: string, state?: string): Query => {
  const query: Query = { code: code };
  if (state) query.state = state;
  return query;
};

const oob = async (
  api: YahooFantasy,
  code: string,
  state?: string,
): Promise<OAuth2Token> => {
  const query = buildQuery(code, state);
  const oobPromise = new Promise<OAuth2Token>((accept, reject) => {
    api.authCallback(
      { query: query },
      (err: Error, response: TokenResponse) => {
        if (err) reject(err);
        const token = OAuth2Token.fromJson(response);
        accept(token);
      },
    );
  });

  return oobPromise;
};

const refreshToken = async (api: YahooFantasy): Promise<OAuth2Token> => {
  const refreshPromise = new Promise<OAuth2Token>((accept, reject) => {
    api.refreshToken((err, json: any) => {
      if (err) reject(err);
      if (json.error) reject(json.error_description);

      const token = OAuth2Token.fromJson(json);
      accept(token);
    });
  });

  return refreshPromise;
};

const getUserInfo = async (token: OAuth2Token): Promise<UserInfo> => {
  const spinner = ora('Getting user info...').start();
  const { data } = await axios.get(
    `https://api.login.yahoo.com/openid/v1/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  spinner.stop();
  return data as UserInfo;
};

const login = new Command('login')
  .description(description)
  .option('-r, --refresh')
  .option('-s, --state <string>', 'Arbitrary state for extra validation')
  .action(async ({ refresh, state }) => {
    const config = await OAuth2Config.load();
    const api = new YahooFantasy(
      config.clientId,
      config.clientSecret,
      undefined,
      config.redirectUri,
    );

    if (refresh) {
      let token = await OAuth2Token.load();
      api.setUserToken(token.accessToken);
      api.setRefreshToken(token.refreshToken);

      try {
        const refreshedToken = await loading(
          'Refreshing user token...',
          refreshToken(api),
        );
        token.refresh(refreshedToken);
        token.save();
        console.log(chalk.green(`Token successfully refreshed!`));
      } catch (err) {
        error('Unable to refresh token :(', err);
      }
    } else {
      try {
        console.log(`Open the following link in a browser to continue login:`);
        console.log(chalk.blue(config.loginUri(state)));
        const answers = await inquirer.prompt(options);
        const token = await loading(
          `Logging in...`,
          oob(api, answers.code, state),
        );
        const userDetails = await loading(
          `Getting user details...`,
          getUserInfo(token),
        );
        token.setUserDetails(userDetails);
        token.save();
        console.log(
          chalk.green(`Successfully logged in ${token.userDetails?.name}!`),
        );
      } catch (err) {
        error('Unable to login :(', err);
      }
    }
  });

export default login;
