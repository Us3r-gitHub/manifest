import { HttpException, Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import * as path from 'path'
import * as fs from 'fs'
import { ConfigService } from '@nestjs/config'
import { BackendSDK } from '../sdk/backend-sdk'

@Injectable()
export class HandlerService {
  constructor(
    private configService: ConfigService,
    private readonly sdk: BackendSDK
  ) {}

  /**
   * Trigger the handler function and return the response.
   *
   * @param path Handler path
   * @param req Request object
   * @param res Response object
   *
   * @returns Handler response
   */
  async trigger({
    path,
    req,
    res
  }: {
    path: string
    req: Request
    res: Response
  }): Promise<unknown> {
    // TODO-Next: Handle case multi-tenant or not
    const { tenantId } = req.params
    const handlerFn = await this.importHandler(path, tenantId)

    return handlerFn(req, res, this.sdk)
  }

  /**
   * Import handler function to trigger the handler.
   *
   * @param handler Handler path
   */
  async importHandler(handler: string, tenantId: string) {
    // Construct the handler file path.
    const handlerPath = path.resolve(
      this.configService.get('paths').manifestFolder,
      tenantId,
      'handlers',
      `${handler}.js`
    )

    if (!fs.existsSync(handlerPath)) {
      throw new HttpException('Handler not found', 500)
    }

    // Import the handler.
    const module = await this.dynamicImport(handlerPath)

    if (typeof module.default !== 'function') {
      throw new HttpException('Handler is invalid', 500)
    }

    return module.default
  }

  /**
   * Dynamically import a module.
   *
   * @param path Module path
   *
   * @returns Imported module
   */
  async dynamicImport(path: string): Promise<any> {
    return import(path)
  }
}
