import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SignupAuthenticableEntityDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string

  @IsString()
  @IsNotEmpty()
  public password: string

  @IsString()
  @IsOptional()
  public tenantId?: string
}
