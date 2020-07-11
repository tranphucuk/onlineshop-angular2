export class LoggedinUser {
    constructor(access_token: string, username: string, fullName: string, email: string, avatar: string) {
        this.access_token = access_token;
    }

    public id: string;
    public access_token: string;
    public username: string;
    public fullName: string;
    public email: string;
    public avatar: string;
}