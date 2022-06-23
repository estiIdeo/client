export class ImageCellModel {
    constructor(obj: ImageCellModel = null) {
        if (!!obj) {
            Object.keys(obj).forEach((key) => (this[key] = obj[key]));
        }
    }
    public width: number = 10
    // public height: number = 25
    public openInFullScreen: boolean = true;
    public useDefaultAcronym: boolean = false
    public acronym?: { name: string, colorHash: string }

}