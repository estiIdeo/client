import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormMapComponent } from '../form-map/form-map.component';
import { IconPipe } from '../../../@ideo/infrastructure/pipes/icon.pipe';
import { MapService } from '../../../@shared/services/map.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormControl } from '../../@core/interfaces/dynamic-form-control';
import { FormAddressComponent } from '../form-address/form-address.component';
import { FormAddressData } from '../form-address/form-address-data';
import { take, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'prx-form-map-address',
  templateUrl: './form-map-address.component.html',
  styleUrls: ['./form-map-address.component.scss']
})
export class FormMapAddressComponent extends FormMapComponent {

  constructor(cd: ChangeDetectorRef,
    iconPipe: IconPipe,
    private fb: FormBuilder,
    mapService: MapService,) {
    super(cd, iconPipe, mapService)
    this.addressForm = this.fb.group({})
  }

  public addressForm: FormGroup
  public addressField: DynamicFormControl = {
    type: FormAddressComponent,
    config: {
      type: 'text',
      label: 'Portal.Common.Address',
      name: 'address',
      data: {
        preventDrewOnMap: true,
        onPlaceChange: (val, c) => {
          const { lat, lng } = val?.geometry?.location
          c?.valueChanges?.pipe(takeWhile(x => this.isActive), take(1))?.subscribe(() => this.mySubscribe())
          this.setValue({ lat: lat(), lng: lng() })
        },
      } as FormAddressData
    }
  }

}
