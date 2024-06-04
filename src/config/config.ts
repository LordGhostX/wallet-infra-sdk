import dotenv from 'dotenv';
import { ConfigKeys, ConfigSchema, IConfig } from './config.interface';

dotenv.config();

class Config {
  private config: IConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private getEnvVariable(key: ConfigKeys): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  }

  private loadConfig(): IConfig {
    return ConfigSchema.parse({
      [ConfigKeys.BASE_URL]: this.getEnvVariable(ConfigKeys.BASE_URL),
    });
  }

  public get(key: ConfigKeys): string {
    return this.config[key];
  }
}

export default Config;
