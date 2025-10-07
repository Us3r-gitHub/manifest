import { AuthenticableEntity, EntityManifest } from '@repo/types'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcryptjs'
import { Request } from 'express'
import * as jwt from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { EntityService } from '../entity/services/entity.service'
import { SignupAuthenticableEntityDto } from './dtos/signup-authenticable-entity.dto'
import { ADMIN_ENTITY_MANIFEST, DEFAULT_ADMIN_CREDENTIALS } from '../constants'
import { EntityManifestService } from '../manifest/services/entity-manifest.service'
import { CrudService } from '../crud/services/crud.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityService: EntityService,
    private readonly entityManifestService: EntityManifestService,
    private readonly crudService: CrudService
  ) {}
  /**
   * Creates a JWT token for a user. This user can be of any entity that extends AuthenticableEntity.
   *
   * @param entitySlug The slug of the entity where the user is going to be searched
   * @param signupUserDto The DTO with the email and password of the user
   * @param email The email of the user
   * @param password The password of the user
   *
   * @returns A JWT token
   */
  async createToken(
    entitySlug: string,
    signupUserDto: SignupAuthenticableEntityDto
  ): Promise<{
    token: string
  }> {
    const shouldPrefixTable = this.configService.get('shouldPrefixTable')

    const isEntityAdmin = entitySlug === ADMIN_ENTITY_MANIFEST.slug

    const entityManifest: EntityManifest =
      this.entityManifestService.getEntityManifest({
        slug: entitySlug
      })

    if (!entityManifest.authenticable) {
      throw new HttpException(
        'Entity is not authenticable',
        HttpStatus.BAD_REQUEST
      )
    }

    const { email, password, tenantId } = signupUserDto

    const user = await this.findUserFromCredentials(
      entitySlug,
      email,
      password,
      shouldPrefixTable && isEntityAdmin ? tenantId : undefined
    )

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED
      )
    }
    return {
      token: jwt.sign(
        {
          email,
          entitySlug,
          tenantId: shouldPrefixTable && isEntityAdmin ? tenantId : undefined
        },
        this.configService.get('tokenSecretKey')
      )
    }
  }

  /**
   *
   * Sign up a user. This user can be of any entity that extends AuthenticableEntity but Admin.
   *
   * @param entitySlug The slug of the AuthenticableEntity where the user is going to be created
   * @param email The email of the user
   * @param password The password of the user
   * @param byPassAdminCheck If true, the method will not check if the entity is an admin
   *
   * @returns A JWT token of the created user
   *
   */
  async signup(
    entitySlug: string,
    signupUserDto: SignupAuthenticableEntityDto,
    byPassAdminCheck?: boolean
  ): Promise<{ token: string }> {
    const isEntityAdmin = entitySlug === ADMIN_ENTITY_MANIFEST.slug

    if (isEntityAdmin && !byPassAdminCheck) {
      throw new HttpException(
        'Admins cannot be created with this method.',
        HttpStatus.BAD_REQUEST
      )
    }

    const entityManifest: EntityManifest =
      this.entityManifestService.getEntityManifest({
        slug: entitySlug
      })

    if (!entityManifest.authenticable) {
      throw new HttpException(
        'Entity is not authenticable',
        HttpStatus.BAD_REQUEST
      )
    }

    const savedUser = (await this.crudService.store(entitySlug, {
      ...signupUserDto,
      tenantId:
        this.configService.get('shouldPrefixTable') && isEntityAdmin
          ? signupUserDto.tenantId
          : undefined
    })) as AuthenticableEntity

    return this.createToken(entitySlug, {
      ...signupUserDto,
      email: savedUser.email
    })
  }

  /**
   * Returns the user from a JWT token. This user can be of any entity that extends AuthenticableEntity.
   *
   * @param token JWT token
   * @param entitySlug Entity slug. If provided, the user will be searched only in this entity. If not provided, the user will be searched in all entities that extend AuthenticableEntity.
   *
   * @returns The user item from the JWT token and the entity slug of the user.
   *
   */
  async getUserFromToken(
    token: string
  ): Promise<{ user: AuthenticableEntity; entitySlug: string }> {
    let decoded: jwt.JwtPayload<{
      email: string
      entitySlug: string
      tenantId?: string
    }>
    try {
      decoded = jwt.verify(
        token?.replace('Bearer ', ''),
        this.configService.get('tokenSecretKey')
      ) as jwt.JwtPayload
    } catch {
      return Promise.resolve({ user: null, entitySlug: null })
    }
    if (!decoded) {
      return Promise.resolve({ user: null, entitySlug: null })
    }

    const { email, entitySlug, tenantId } = decoded

    const entityRepository: Repository<AuthenticableEntity> =
      this.entityService.getEntityRepository({
        entitySlug
      }) as Repository<AuthenticableEntity>

    const whereClause =
      this.configService.get('shouldPrefixTable') && tenantId
        ? { email, tenantId }
        : { email }
    const user = await entityRepository.findOne({
      where: whereClause
    })

    delete user.password // Remove password from the user object for security reasons

    return { user, entitySlug }
  }

  /**
   * Returns the user from a request. This user can be of any entity that extends AuthenticableEntity.
   *
   * @param req Request object
   *
   * @returns The user item from the request
   **/
  getUserFromRequest(
    req: Request
  ): Promise<{ user: AuthenticableEntity; entitySlug: string }> {
    const token = req.headers?.['authorization']

    if (!token) {
      return Promise.resolve({ user: null, entitySlug: null })
    }

    return this.getUserFromToken(token)
  }

  /**
   * Returns whether the user from a request is an admin.
   *
   * @param req Request object
   *
   * @returns A promise that resolves to true if the user is an admin, and false otherwise.
   */
  async isReqUserAdmin(req: Request): Promise<boolean> {
    return this.getUserFromRequest(req).then(
      (res: { user: AuthenticableEntity; entitySlug: string }) =>
        !!res?.user && res?.entitySlug === ADMIN_ENTITY_MANIFEST.slug
    )
  }

  /**
   * Returns whether the default admin exists.
   *
   * @returns A promise that resolves to an object with the key 'exists' that is true if the default admin exists, and false otherwise.
   * */
  async isDefaultAdminExists(tenantId?: string): Promise<{ exists: boolean }> {
    const admin: AuthenticableEntity = await this.findUserFromCredentials(
      ADMIN_ENTITY_MANIFEST.slug,
      DEFAULT_ADMIN_CREDENTIALS.email,
      DEFAULT_ADMIN_CREDENTIALS.password,
      tenantId
    )

    return { exists: !!admin }
  }

  /**
   * Find user from credentials.
   *
   * @param entitySlug The slug of the entity where the user is going to be searched
   * @param email The email of the user
   * @param password The password of the user
   * @param tenantId The tenantId for multi-tenant apps within 1 DB
   *
   * @returns The user found from the credentials, or null if the user is not found.
   */
  async findUserFromCredentials(
    entitySlug: string,
    email: string,
    password: string,
    tenantId?: string
  ): Promise<AuthenticableEntity> {
    const entityRepository: Repository<AuthenticableEntity> =
      this.entityService.getEntityRepository({
        entitySlug
      }) as Repository<AuthenticableEntity>

    const whereClause =
      this.configService.get('shouldPrefixTable') && tenantId
        ? { email, tenantId }
        : { email }
    const user: AuthenticableEntity = await entityRepository.findOne({
      where: whereClause
    })

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null
    }

    return user
  }
}
