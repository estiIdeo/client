import { FormGroup } from '@angular/forms';

export class FormFile {
  constructor(obj: FormFile = null) {
    if (!!obj) {
      Object.keys(obj).forEach((key) => (this[key] = obj[key]));
    }
  }
  public autoUpload: boolean = false;
  public getTemplateUrl?: (form: FormGroup) => string;
  public newStyle: boolean = false;
  public title: string = "Portal.Forms.Core.image.ClickHere";
  public subTitle: string = `default`;
  public category: FileCategory = FileCategory.Image;
  public multiple: boolean = false;
  public textByValue: boolean = false;
  public acceptedTypes: FileType[] = ['*'];
}

export type FileType = "*" | "audio/*" | "image/*" | "video/*" | ".jpg" | ".jpeg" | ".png" | '.gif' | "application/pdf";

export enum FileCategory{
  Image,
  Document
}
