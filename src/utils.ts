import chalk from 'chalk';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import ora from 'ora';
import os from 'os';

const configPath = `${os.homedir()}/.yahoo`;

/**
 * Ensures the configuration path exists on the filesystem.
 *
 * @returns configuration path
 */
export const getConfigPath = async (): Promise<string | undefined> => {
  if (!existsSync(configPath)) {
    console.log(`${configPath} doesn't exist. Creating...`);
    await mkdir(configPath, { recursive: true });
  }

  return configPath;
};

export const trim = (desc: string): string => desc.replace(/\n+/g, ' ').trim();

/**
 * Read a generic object from it's saved version in ~/.yahoo/ folder.
 *
 * @param file name to read
 * @param builder builder used to convert JSON to Object
 * @returns
 */
export const read = async <T>(
  file: string,
  builder: (json: any) => T,
): Promise<T> => {
  let path = await getConfigPath();
  let parsed: T;

  try {
    let json = JSON.parse(readFileSync(`${path}/${file}`, 'utf-8'));
    parsed = builder(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('ENOENT')) {
      return builder({});
    } else {
      throw err;
    }
  }

  return parsed;
};

/**
 * Saved a generic object as JSON within the ~/.yahoo/ folder.
 *
 * @param file name to be saved
 * @param toSave object to be saved
 */
export const write = async <T>(file: string, toSave: T) => {
  const path = await getConfigPath();
  await writeFile(`${path}/${file}`, JSON.stringify(toSave, null, 2), {
    flag: 'w',
    encoding: 'utf-8',
  });
};

/**
 * Standardize the error output throughout CLI.
 *
 * @param err
 */
export const error = (message: string, err?: any) => {
  console.error(chalk.red(message));
  console.error(chalk.red(err.message || err));
};

/**
 * Wrap a promise with a basic spinner.
 *
 * @param message to be displayed on the spinner
 * @param request the promise to be wrapped
 */
export const loading = async <T>(message: string, request: Promise<T>) => {
  const spinner = ora(message).start();
  const value = await request;
  spinner.stop();
  return value;
};
