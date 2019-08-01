import * as Botium from 'botium-core'

export class BotDriverService {
  private static _instance: BotDriverService = new BotDriverService()

  private driver: any
  private driverFluent: any

  private constructor() {
    this.driver = new Botium.BotDriver()
    this.driverFluent = this.driver.BuildFluent()
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new BotDriverService()
    }
    return this._instance
  }

  public start(): Promise<any> {
    this.driverFluent.Start()
    return this.exec()
  }

  public stop(): Promise<any> {
    this.driverFluent.Stop()
    return this.exec()
  }

  public clean(): Promise<any> {
    return this.driverFluent.Clean()
  }

  public userSaysText(message: string): Promise<any> {
    this.driverFluent.UserSaysText(message)
    return this.exec()
  }

  public waitBotSaysText(action: (message: string) => void): Promise<any> {
    this.driverFluent.WaitBotSaysText(action)
    return this.exec()
  }

  public exec = () => this.driverFluent.Exec().then(() => (this.driverFluent.tasks = []))
}
