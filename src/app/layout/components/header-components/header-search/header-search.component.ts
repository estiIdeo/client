import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/@core/base/base-component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'prx-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
})
export class HeaderSearchComponent extends BaseComponent implements OnInit {
  search = faSearch;

  constructor() {
    super('search-form');
  }

  ngOnInit() {}
}
