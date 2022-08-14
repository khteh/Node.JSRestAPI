export class Error {
    public Code: string;
    public Description: string;
    public constructor(code: string, desc: string) {
        this.Code = code;
        this.Description = desc;
    }
}