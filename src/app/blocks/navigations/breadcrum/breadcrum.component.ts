import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { translateType } from '@app/@shared/types/translate.type';
import { faHome, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { IntelligenceKeys } from '../../../@shared/types/IntelligenceKeys.type';

export interface BreadcrumType {
  label: IntelligenceKeys<translateType>;
  url?: string | string[];
}

@Component({
  selector: 'prx-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.scss'],
})
export class BreadcrumComponent implements OnInit {
  home = faHome;

  @Input()
  items: BreadcrumType[];

  @Input()
  separator: IconDefinition | string;

  @Input()
  styleCss: string;

  constructor() { }

  ngOnInit() { }
}
