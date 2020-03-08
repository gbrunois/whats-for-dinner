import * as functions from 'firebase-functions'

interface IGmailConfig {
  user: string
  password: string
}

interface IAppConfig {
  name: string
  url: string
}

class Config {
  private _config: functions.config.Config

  constructor(c: functions.config.Config) {
    this._config = c
  }

  get gmailConfig(): IGmailConfig {
    return this._config.gmailconfig
  }

  get app(): IAppConfig {
    return this._config.app
  }
}

export const config = new Config(functions.config())
