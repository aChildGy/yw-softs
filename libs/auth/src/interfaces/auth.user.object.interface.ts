export interface IAuthUserObject {
  id?: number | string;
  username: string;
  password: string;
}

export type BaseUserDTOFields = Omit<IAuthUserObject, 'password'>;

export interface IJWTUserObject extends BaseUserDTOFields {
  sub: number | string;
}
