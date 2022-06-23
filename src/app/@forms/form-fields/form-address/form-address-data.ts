import { FormControl } from '@angular/forms';
export interface FormAddressData {
    onPlaceChange?: (val: google.maps.places.PlaceResult, control: FormControl) => void;
    onlyAutoCompleteValue?: boolean;
    parseValue: (val: google.maps.places.PlaceResult | string, control: FormControl) => string;
    map: google.maps.Map;
    preventDrewOnMap: boolean;
}
