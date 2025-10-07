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

  @Post(':entity/login')
  public async getToken(
    @Param('tenantId') tenantId: string,
    @Param('entity') entity: string,
    @Body() signupUserDto: SignupAuthenticableEntityDto,
    @Req() req: Request
  ): Promise<{
    token: string
  }> {
    return this.authService.createToken(
      req['entityTenant'] || entity,
      signupUserDto
    )
  }

  @UseGuards(IsDbEmptyGuard)
  @Post('admins/signup')
  public async signupAdmin(
    @Param('tenantId') tenantId: string,
    @Body() signupUserDto: SignupAuthenticableEntityDto
  ): Promise<{
    token: string
  }> {
    return this.authService.signup('admins', signupUserDto, true)
  }

  @Rule('signup')
  @Post(':entity/signup')
  public async signup(
    @Param('entity') entity: string,
    @Body() signupUserDto: SignupAuthenticableEntityDto,
    @Req() req: Request
  ): Promise<{
    token: string
  }> {
    return this.authService.signup(req['entityTenant'] || entity, signupUserDto)
  }

  @Get(':entity/me')
  public async getCurrentUser(
    @Param('entity') _entity: string,
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
