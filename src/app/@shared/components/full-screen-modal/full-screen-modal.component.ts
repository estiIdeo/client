import { Component, SecurityContext, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, of } from 'rxjs';
import { FileService } from '../../../@ideo/infrastructure/services/file.service';

@Component({
  selector: 'prx-full-screen-modal',
  templateUrl: './full-screen-modal.component.html',
  styleUrls: ['./full-screen-modal.component.scss'],
})
export class FullScreenModalComponent {
  constructor(private bsModalRef: BsModalRef, private fileService: FileService) { }

  ngOnInit(): void { }

  public saveHtmlType: SecurityContext = SecurityContext.RESOURCE_URL

  public onClose: Subject<boolean> = new Subject<boolean>();
  public _mediaItem: { mediaId: number };
  public set mediaItem(val: { mediaId: number }) {
    this._mediaItem = val
    this.maybePdf = false
    this.getMedia()
  }
  public get mediaItem(): { mediaId: number } {
    return this._mediaItem
  }
  public title: string = null;

  public maybePdf: boolean

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  private getMedia() {
    !!this._mediaItem?.mediaId && this.fileService.getMedia(this._mediaItem?.mediaId)?.toPromise()?.then((res) =>
      this.maybePdf = res?.type === "application/pdf"
    )?.catch((res) =>
      this.maybePdf = true
    )
  }

}
