import { Pipe, PipeTransform, Type } from '@angular/core';
import { EnumType } from 'typescript';

type myEnumType = Type<EnumType>

@Pipe({
    name: 'enum',
})
export class EnumPipe implements PipeTransform {
    transform(value: any, myEnum?: myEnumType | myEnumType[]): string {
        if (Array.isArray(myEnum)) {
            return myEnum?.find(i => !!i?.[value])?.[value] || value
        }
        return myEnum?.[value] || value
    }
}

