export default interface UserInfo {
    access_token: string;
    department?: any;
    expires_in?: number;
    loginTime?: string;
    permissions: Array<any>;
    refresh_token: string;
    roles: Array<any>;
    scope?: string;
    token_type?: string;
    user: any;
    xToken: string;
}
