import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { FormAddressData } from './form-address-data';
import { Field } from '../../@core/interfaces/field';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldConfig } from '../../@core/interfaces/field-config';
import { MapService } from '../../../@shared/services/map.service';
import { untilDestroyed } from '../../../@core/until-destroyed';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'prx-form-address',
  templateUrl: './form-address.component.html',
  styleUrls: ['./form-address.component.scss']
})
export class FormAddressComponent extends BaseFieldDirective<FormControl> implements Field<FormAddressData>, OnInit {
  public config: FieldConfig<FormAddressData>;
  public group: FormGroup;
  public id: string;

  constructor(private cd: ChangeDetectorRef, protected mapService: MapService) {
    super();
  }

  public get disabled(): boolean {
    return this.config?.disabled || this.control?.disabled || null
  }

  public get data(): FormAddressData {
    return this.config?.data
  }

  place: google.maps.places.PlaceResult


  public marker: google.maps.Marker
  // public eventListener: google.maps.MapsEventListener

  @ViewChild('search')
  public searchElementRef: ElementRef;

  ngOnInit(): void {
    if (this.config.disabled) {
      this.control.disable();
    }
    this.control.registerOnDisabledChange(this.cd.markForCheck)
    this.control?.valueChanges?.pipe(untilDestroyed(this), distinctUntilChanged(), debounceTime(100))?.subscribe((val) => this.config?.onChange && this.config?.onChange(val, this.control))
    setTimeout(() => {
      this.setSearchInput()
    }, 1000)
  }

  private setSearchInput() {
    this.mapService.searchInput(this.searchElementRef, this.onPlaceChange)
  }

  public onBlur() {
    if (!!this.data?.onlyAutoCompleteValue) {
      setTimeout(() => {
        if (this.place?.formatted_address !== this.control?.value) {
          this.control?.setValue(!!this.data?.parseValue ? null : '')
        }
      }, 100 * 5)
    }
  }

  public onPlaceChange = (val: google.maps.places.PlaceResult) => {
    this.place = val
    if (!!this.data?.onPlaceChange) {
      this.data?.onPlaceChange(val, this.control);
    }
    if (!this.data?.preventDrewOnMap && !!this.mapService.map) {
      this.mapService?.removeMarker(this.marker)
      const { lat, lng } = val.geometry.location
      const { marker } = this.mapService.drawAddress({
        title: 'Portal.Agencies.Sidebar.Zones.Form.Address',
        draggable: false,
        position: {
          lat: lat(),
          lng: lng()
        },
        label: 'Portal.Agencies.Sidebar.Zones.Form.Address',
      })
      this.marker = marker
    }
    if (!!this.data?.parseValue) {
      this.data?.parseValue(val, this.control);
    } else {
      this.control.setValue(val?.formatted_address)
    }
  }
}
