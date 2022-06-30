import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { BaseComponent } from '@core';


@Component({
  selector: 'prx-card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
})
export class CardHeaderComponent extends BaseComponent implements OnInit {
  @Input()
  title: string;

  @HostBinding('class.border-bottom-0')
  get removeBorder(): boolean {
    return !this.border;
  }

  @Input()
  border: boolean = true;

  @ViewChild('toolsView', { static: false })
  toolsView: ElementRef;

  @ViewChild('titleView', { static: false })
  titleView: ElementRef;

  toolsHidden: boolean;
  titleHidden: boolean;

  constructor(private cdRef: ChangeDetectorRef) {
    super('card-header');
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.toolsHidden = !this.toolsView.nativeElement?.children?.length;
    this.titleHidden = !this.titleView.nativeElement?.children?.length;

    this.cdRef.detectChanges();
  }
}
