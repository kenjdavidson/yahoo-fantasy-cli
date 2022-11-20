# yahoo-fantasy-cli

Command line wrapper for [yahoo-fantasy-sports-api](https://github.com/whatadewitt/yahoo-fantasy-sports-api) allowing local data management of your Fantasy team(s) or league(s).

> This is subject to change; it may be required to move away from the `yahoo-fantasy-sports-api` (for some queries) to make queries a little easier.

## Install

> Not published to npm at this point

## Commands

The following commands are available:

### `config`

Configuration is done by placing your Yahoo! App `clientId`, `clientSecret` and `redirectUri` (which is most likely going to be `oob`) into the configuration file `~/.yahoo/config`.

```
sage: yfs config [options]

Configure Yahoo! Fantasy CLI App

Options:
  -i, --info  Display current app configuration
  -s, --save  Save new app configuration
  -h, --help  display help for command

Yahoo! OAuth2 applications can be created with the Yahoo! developer portal: https://developer.yahoo.com/apps/).
```

### `login`

One the Yahoo! app configuration is setup, you'll need to login. Logging in will store your token information to `~/.yahoo/token`. Tokens can be manually refreshed using the `-r` flag.

```
Usage: yfs login [options]

Login to Yahoo!

Options:
  -r, --refresh
  -s, --state <string>  Arbitrary state for extra validation
  -h, --help            display help for command
```

> Currently there is no logging out, the `~/.yahoo/token` file can be removed manually

### `api`

Allows requesting custom data; then querying this data using `jsonpath`:

```
Usage: yfs api [options] <uri>

Make direct requests against the API

Arguments:
  uri                      the API uri

Options:
  -m, --method <string>    http method used for request (default: "GET")
  -p, --jsonpath <string>  jsonpath to run on output
  -i, --interactive        interactive input of jsonpath queries
  -h, --help               display help for command

Interactive mode allows you to run repeated jsonpath queries against the data.

Examples:

$.fantasy_content
  is the root for all Yahoo! Fantasy api responses

$.fantasy_content.users["0"].user[1].games[*].game
  filters out the array of games from a users games collection
```
