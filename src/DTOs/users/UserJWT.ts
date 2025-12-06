export interface IUserJWT {
    email: string;
    id: string;
    role: string;
    allowed:boolean;
    jti: string;     
    iat: number;
    exp: number;
}