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
  @Get('/:entity')
  async findAll(
    @Param('entity') entitySlug: string,
    @Query() queryParams: { [key: string]: string | string[] },
    @Req() req: Request
  ): Promise<Paginator<BaseEntity>> {
    const isAdmin: boolean = await this.authService.isReqUserAdmin(req)

    return this.crudService.findAll({
      entitySlug,
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
  @Get(':entity/select-options')
  findSelectOptions(
    @Param('entity') entitySlug: string,
    @Query() queryParams: { [key: string]: string | string[] }
  ): Promise<SelectOption[]> {
    return this.crudService.findSelectOptions({
      entitySlug,
      queryParams
    })
  }

  @Rule('read')
  @Get(':entity/:id')
  async findOne(
    @Param('entity') entitySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParams: { [key: string]: string | string[] },
    @Req() req: Request
  ): Promise<BaseEntity> {
    const isAdmin: boolean = await this.authService.isReqUserAdmin(req)

    return this.crudService.findOne({
      entitySlug,
      id,
      queryParams,
      fullVersion: isAdmin
    })
  }

  @Rule('create')
  @Post(':entity')
  store(
    @Param('entity') entity: string,
    @Body() entityDto: Partial<BaseEntity>
  ): Promise<BaseEntity> {
    return this.crudService.store(entity, entityDto)
  }

  @Rule('update')
  @Put(':entity/:id')
  put(
    @Param('entity') entitySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() itemDto: Partial<BaseEntity>
  ): Promise<BaseEntity> {
    return this.crudService.update({ entitySlug, id, itemDto })
  }

  @Rule('update')
  @Patch(':entity/:id')
  patch(
    @Param('entity') entitySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() itemDto: Partial<BaseEntity>
  ): Promise<BaseEntity> {
    return this.crudService.update({
      entitySlug,
      id,
      itemDto,
      partialReplacement: true
    })
  }

  @Rule('delete')
  @Delete(':entity/:id')
  delete(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<BaseEntity> {
    return this.crudService.delete(entity, id)
  }
}
