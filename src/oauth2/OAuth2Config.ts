import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { stringify } from 'querystring';
import { getConfigPath, read, write } from '../utils.js';

class OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  appId?: string;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string = 'oob',
    appId?: string,
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.appId = appId;
  }

  /**
   * Essentially a copy/bipass of yahoo-fantasy auth method.  Since we aren't dealing with
   * redirects we just need to get the URL to send the user.
   *
   * @param state oauth2 state parameter
   */
  loginUri(state?: string) {
    const authData: Record<string, string> = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
    };

    if (state) {
      authData.state = state;
    }

    const options = {
      hostname: 'api.login.yahoo.com',
      port: 443,
      path: `/oauth2/request_auth?${stringify(authData)}`,
      method: 'GET',
    };

    return `https://${options.hostname}/oauth2/request_auth?${stringify(
      authData,
    )}`;
  }

  static fromJson(conent: any): OAuth2Config {
    return new OAuth2Config(
      conent.clientId,
      conent.clientSecret,
      conent.redirectUri,
      conent.appId,
    );
  }

  static async load(): Promise<OAuth2Config> {
    return await read<OAuth2Config>('config', OAuth2Config.fromJson);
  }

  async save() {
    await write('config', this);
  }
}

export async function writeConfig(config: OAuth2Config) {
  const path = await getConfigPath();
  await writeFile(`${path}/config`, JSON.stringify(config, null, 2), {
    flag: 'w',
    encoding: 'utf-8',
  });
}

export function printConfig(config: OAuth2Config) {
  config.appId && console.log(`App Id: ${config.appId}`);
  console.log(`Client Id: ${config.clientId}`);
  console.log(`Client Secret: ${config.clientSecret}`);
  console.log(`RedirectUri: ${config.redirectUri}`);
}

export default OAuth2Config;
