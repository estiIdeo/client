import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FileCategory, FormFile } from './form-file';
import { FormGroup } from '@angular/forms';
import { FilesService } from '../../@core/services/files.service';
import { environment } from '@env/environment';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faExpand } from '@fortawesome/free-solid-svg-icons';
import { distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { range } from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig } from '@app/@forms/@core/interfaces';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { untilDestroyed } from '@core/until-destroyed';

@Component({
  selector: 'ideo-form-file',
  templateUrl: './form-file.component.html',
  styleUrls: ['./form-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFileComponent extends BaseFieldDirective implements Field<FormFile>, OnInit {
  public config: FieldConfig<FormFile>;
  public group: FormGroup;
  public id: string;
  public uploadImageId: any[] | any;
  public buttons: ButtonItem[] = [
    {
      label: 'Portal.Common.Delete',
      icon: faTrash,
      click: (id) => {
        if (this.config.data.multiple) {
          this.uploadImageId = this.uploadImageId?.filter((i: number) => i !== id);
        } else {
          this.uploadImageId = null;
        }
        this.control.setValue(this.uploadImageId)
        this.cd.markForCheck()
      },
    },
    {
      label: 'Portal.Common.Fullscreen',
      click: (id: number) => this.openInFullscreen(id),
      icon: faExpand,
    },
  ];

  public get isEmptyForm(): boolean {
    if (this.config.data.multiple) {
      return !this.uploadImageId || (this.uploadImageId?.length === 0)
    }
    else { return !this.uploadImageId }
  }

  private _acceptedTypes : string;
  public get acceptedTypes() : string {
    return this._acceptedTypes;
  }
  public set acceptedTypes(v : string) {
    this._acceptedTypes = v;
  }

  
  private _subTitle : string;
  public get subTitle() : string {
    return this._subTitle;
  }
  public set subTitle(v : string) {
    this._subTitle = v;
  }
  

  public get subTile():string{
    if(this.config?.data?.subTitle !== 'default'){
      return this.config?.data?.subTitle;
    }
    return `Portal.Forms.Core.image.${this.config?.data?.category === FileCategory.Image ? "ToUploadAnImage" : "ToUploadADocument"}`;
  }

  

  


  public openInFullscreen(id: number) {
    // this.modalService.show(FullScreenModalComponent, {
    //   initialState: { mediaItem: { mediaId: id }, title: this.config?.label },
    //   class: 'modal-xl modal-dialog-centered',
    // });
  }

  public pushImage(item: any) {
    if (!item) return
    if (!!this.config.data.multiple && (!this.uploadImageId || !!this.uploadImageId && !this.uploadImageId?.length)) {
      this.uploadImageId = []
    }
    if (Array.isArray(item)) {
      this.uploadImageId.push(...item)
    } else {
      this.uploadImageId.push(item)
    }
    this.cd.markForCheck()
  }

  public get items(): any | any[] {
    if (this.config.data.multiple) return this.uploadImageId;
    else if (this.uploadImageId) return [this.uploadImageId];
  }

  public get label(): string {
    let fileName = 'Choose file';
    if (!!this.control.value && !!this.control.value.length) {
      if (this.control.value instanceof FileList) {
        fileName = this.control.value.item ? this.control.value.item(0)?.name : fileName;
      } else {
        fileName = this.control.value?.[0].url;
      }
    }
    return fileName;
  }

  constructor(private fileService: FilesService, private cd: ChangeDetectorRef,
    private modalService: BsModalService,
  ) {
    super();
  }


  fixGetRawValue() {
    class KeepThis extends FormGroup {
      constructor(obj: any) {
        super({}, null);
        const keys: string[] = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          this[key] = obj[key];
        }
      }
    }

    const keepThis: KeepThis = new KeepThis(this.group);
    this.group.getRawValue = () => {
      const { label, ...getRawValue } = keepThis.getRawValue();
      return getRawValue
    }
  }

  handelNewVal(val: any): void {
    if (!!val) {
      let id: number
      switch (typeof val) {
        case 'number':
          id = val;
          break;
        case 'object': {
          id = (!!val?.length ? val : [val])?.map((i: any) => i?.id || i?.mediaId || i)
        }
        default:
          break;
      }

      if (this.config.data.multiple) {
        this.pushImage(id)
      } else {
        id = id?.[0] || id
        if (val !== id) { this.control.setValue(id); return }
        this.uploadImageId = id?.[0] || id;
      }
      if (this.config.onChange) {
        this.config.onChange(this.control.value, this.control);
      }
    }
    else {
      // FIXME maybe will cues problem if so remove and handle first validation
      this.control.setValue(null)
    }
    this.cd.markForCheck()
  }

  ngOnInit(): void {
    !!this.config.data.textByValue && this.fixGetRawValue()
    this.control.valueChanges.pipe(
      takeWhile((r) => this.isActive),
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe((val) => {
      if (!!val && this.isEmptyForm) { this.handelNewVal(val) }
      if (this.config.onChange) {
        this.config.onChange(this.control.value, this.control);
      }
    });
    this.handelNewVal(this.control.value);

    this.acceptedTypes = (this.config?.data ||  new FormFile())?.acceptedTypes?.join(', ');
    if(this.config?.data?.subTitle !== 'default'){
      this.subTitle = this.config?.data?.subTitle;
    }else{
      this.subTitle = `Portal.Forms.Core.image.${this.config?.data?.category === FileCategory.Image ? "ToUploadAnImage" : "ToUploadADocument"}`;
    }
  }

  public autoUpload(i: number, files: FileList) {
    this.fileService
      .uploadFile(files.item(i), 'Media', 'Portal.Common.Media', { 422: 'true', 200: 'false', 400: 'Portal.Common.ErrorMessages.UploadMedia' })
      .toPromise()
      .then((res) => {
        if (!!res && res.id) {
          if (this.config.data.multiple) {
            this.pushImage(res.id)
          } else {
            this.uploadImageId = res.id;
          }
          this.control.setValue(this.uploadImageId)
          this.cd.markForCheck()
        }
      });
  }

  public fileUploaded(files: FileList) {
    if (!!files) {
      let multiple = this.config.data.multiple;
      if (!!this.config?.data?.autoUpload) {
        range(0, multiple ? files?.length : 1).forEach((i) => {
          this.autoUpload(i, files);
        });
      }
    }
  }

  public downloadTemplate() {
    let templateUrl = this.config.data.getTemplateUrl(this.group);
    if (!!templateUrl) {
      this.fileService.downloadFile(templateUrl, 'Template');
    }
  }

  // public imageIdPipe(imageId: number | string, thumbnail: boolean = true) {
  //   if (!isNaN(+imageId)) {
  //     return `${environment.serverUrl}/api/Media/${!!thumbnail ? 'GetThumbnail/' : ''}${imageId}`;
  //   }
  // }

  public removeFile(index?: number) {
    this.uploadImageId = null;
    this.control.setValue(null);
    this.cd.markForCheck();
  }

  public iconClass(icon: IconDefinition | string | false): string | false {
    if (!icon) return '';
    if (typeof icon !== 'string') {
      let res = icon.prefix + ' fa-' + icon.iconName;
      return res;
    }
    return icon;
  }
}
