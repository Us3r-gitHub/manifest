import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'

import { AuthenticableEntity } from '@repo/types'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { SignupAuthenticableEntityDto } from './dtos/signup-authenticable-entity.dto'
import { Rule } from '../policy/decorators/rule.decorator'
import { PolicyGuard } from '../policy/policy.guard'
import { IsDbEmptyGuard } from './guards/is-db-empty.guard'

@UseGuards(PolicyGuard)
@Controller(':tenantId/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':entitySlug/login')
  public async getToken(
    @Param('tenantId') tenantId: string,
    @Param('entitySlug') entitySlug: string,
    @Body() signupUserDto: SignupAuthenticableEntityDto,
    @Req() req: Request
  ): Promise<{
    token: string
  }> {
    return this.authService.createToken(req['entityTenant'] || entitySlug, {
      ...signupUserDto,
      tenantId
    })
  }

  @UseGuards(IsDbEmptyGuard)
  @Post('admins/signup')
  public async signupAdmin(
    @Param('tenantId') tenantId: string,
    @Body() signupUserDto: SignupAuthenticableEntityDto
  ): Promise<{
    token: string
  }> {
    return this.authService.signup(
      'admins',
      { ...signupUserDto, tenantId },
      true
    )
  }

  @Rule('signup')
  @Post(':entitySlug/signup')
  public async signup(
    @Param('entitySlug') entitySlug: string,
    @Body() signupUserDto: SignupAuthenticableEntityDto,
    @Req() req: Request
  ): Promise<{
    token: string
  }> {
    return this.authService.signup(
      req['entityTenant'] || entitySlug,
      signupUserDto
    )
  }

  @Get(':entitySlug/me')
  public async getCurrentUser(
    @Param('entitySlug') _entity: string,
    @Req() req: Request
  ): Promise<AuthenticableEntity> {
    return (await this.authService.getUserFromRequest(req)).user
  }

  @Get('admins/default-exists')
  public async isDefaultAdminExists(
    @Param('tenantId') tenantId: string
  ): Promise<{
    exists: boolean
  }> {
    return this.authService.isDefaultAdminExists(tenantId)
  }
}
