import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { Rule } from '../../policy/decorators/rule.decorator'
import { AuthService } from '../../auth/auth.service'

import { Request } from 'express'
import { CrudService } from '../services/crud.service'
import { BaseEntity } from '@repo/types'
import { IsSingleGuard } from '../guards/is-single.guard'
import { PolicyGuard } from '../../policy/policy.guard'
import { HookInterceptor } from '../../hook/hook.interceptor'
import { SINGLES_PATH } from '../../constants'
import { MiddlewareInterceptor } from '../../middleware/middleware.interceptor'

@UseGuards(PolicyGuard, IsSingleGuard)
@UseInterceptors(HookInterceptor, MiddlewareInterceptor)
@Controller(SINGLES_PATH)
export class SingleController {
  constructor(
    private readonly authService: AuthService,
    private readonly crudService: CrudService
  ) {}

  /**
   * Get a single item of a specific single type entity.
   * If the item does not exist, it will create a new one.
   *
   * @param entitySlug The slug of the entity.
   * @param req The request object.
   *
   * @returns The single item of the entity.
   */
  @Get(':entitySlug')
  @Rule('read')
  async findOne(
    @Param('entitySlug') entitySlug: string,
    @Req() req: Request
  ): Promise<BaseEntity> {
    const isAdmin: boolean = await this.authService.isReqUserAdmin(req)

    let singleItem: BaseEntity
    const slug = req['entityTenant'] || entitySlug

    try {
      singleItem = await this.crudService.findOne({
        entitySlug: slug,
        fullVersion: isAdmin
      })
    } catch (e) {
      if (e instanceof NotFoundException) {
        singleItem = await this.crudService.storeEmpty(entitySlug)
      }
    }

    return singleItem
  }

  @Put(':entitySlug')
  @Rule('update')
  put(
    @Param('entitySlug') entitySlug: string,
    @Body() itemDto: Partial<BaseEntity>,
    @Req() req: Request
  ): Promise<BaseEntity> {
    return this.crudService.update({
      entitySlug: req['entityTenant'] || entitySlug,
      itemDto
    })
  }

  @Patch(':entitySlug')
  @Rule('update')
  patch(
    @Param('entitySlug') entitySlug: string,
    @Body() itemDto: Partial<BaseEntity>,
    @Req() req: Request
  ): Promise<BaseEntity> {
    return this.crudService.update({
      entitySlug: req['entityTenant'] || entitySlug,
      itemDto,
      partialReplacement: true
    })
  }
}
