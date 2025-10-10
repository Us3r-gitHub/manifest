import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'

import { BaseEntity, Paginator, SelectOption } from '@repo/types'
import { CrudService } from '../services/crud.service'
import { AuthService } from '../../auth/auth.service'
import { Request } from 'express'
import { PolicyGuard } from '../../policy/policy.guard'
import { Rule } from '../../policy/decorators/rule.decorator'
import { IsCollectionGuard } from '../guards/is-collection.guard'
import { HookInterceptor } from '../../hook/hook.interceptor'
import { COLLECTIONS_PATH } from '../../constants'
import { MiddlewareInterceptor } from '../../middleware/middleware.interceptor'
import { IsAdminGuard } from '../../auth/guards/is-admin.guard'

@UseGuards(PolicyGuard, IsCollectionGuard)
@UseInterceptors(HookInterceptor, MiddlewareInterceptor)
@Controller(`:tenantId/${COLLECTIONS_PATH}`)
export class CollectionController {
  constructor(
    private readonly crudService: CrudService,
    private readonly authService: AuthService
  ) {}

  @Rule('read')
  @Get('/:entitySlug')
  async findAll(
    @Param('entitySlug') entitySlug: string,
    @Query() queryParams: { [key: string]: string | string[] },
    @Req() req: Request
  ): Promise<Paginator<BaseEntity>> {
    const isAdmin: boolean = await this.authService.isReqUserAdmin(req)

    return this.crudService.findAll({
      entitySlug: req['entityTenant'] || entitySlug,
      queryParams,
      fullVersion: isAdmin
    })
  }

  /**
   * Get select options for a specific entity. This is used for select inputs in admin panel forms.
   * This is why we use the `IsAdminGuard` here.
   *
   * @param entitySlug The slug of the entity.
   * @param queryParams The query parameters to filter the select options.
   *
   * @returns The select options for the entity.
   */
  @UseGuards(IsAdminGuard)
  @Get(':entitySlug/select-options')
  findSelectOptions(
    @Param('entitySlug') entitySlug: string,
    @Query() queryParams: { [key: string]: string | string[] },
    @Req() req: Request
  ): Promise<SelectOption[]> {
    return this.crudService.findSelectOptions({
      entitySlug: req['entityTenant'] || entitySlug,
      queryParams
    })
  }

  @Rule('read')
  @Get(':entitySlug/:id')
  async findOne(
    @Param('entitySlug') entitySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParams: { [key: string]: string | string[] },
    @Req() req: Request
  ): Promise<BaseEntity> {
    const isAdmin: boolean = await this.authService.isReqUserAdmin(req)

    return this.crudService.findOne({
      entitySlug: req['entityTenant'] || entitySlug,
      id,
      queryParams,
      fullVersion: isAdmin
    })
  }

  @Rule('create')
  @Post(':entitySlug')
  store(
    @Param('entitySlug') entitySlug: string,
    @Body() entityDto: Partial<BaseEntity>,
    @Req() req: Request
  ): Promise<BaseEntity> {
    return this.crudService.store(req['entityTenant'] || entitySlug, entityDto)
  }

  @Rule('update')
  @Put(':entitySlug/:id')
  put(
    @Param('entitySlug') entitySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() itemDto: Partial<BaseEntity>,
    @Req() req: Request
  ): Promise<BaseEntity> {
    return this.crudService.update({
      entitySlug: req['entityTenant'] || entitySlug,
      id,
      itemDto
    })
  }

  @Rule('update')
  @Patch(':entitySlug/:id')
  patch(
    @Param('entitySlug') entitySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() itemDto: Partial<BaseEntity>,
    @Req() req: Request
  ): Promise<BaseEntity> {
    return this.crudService.update({
      entitySlug: req['entityTenant'] || entitySlug,
      id,
      itemDto,
      partialReplacement: true
    })
  }

  @Rule('delete')
  @Delete(':entitySlug/:id')
  delete(
    @Param('entitySlug') entitySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request
  ): Promise<BaseEntity> {
    return this.crudService.delete(req['entityTenant'] || entitySlug, id)
  }
}
