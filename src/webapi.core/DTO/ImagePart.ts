export class ImagePart {
    public Path: string;
    public MimeType: string;
    public constructor(path: string, mimetype: string) {
        this.Path = path;
        this.MimeType = mimetype;
    }
}