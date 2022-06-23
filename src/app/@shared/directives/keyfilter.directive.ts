import { Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DefaultMasks =  'phone' | 'pint' | 'int' | 'pnum' | 'money' | 'num' | 'hex' | 'email' | 'alpha' | 'alphanum';

const DEFAULT_MASKS = {
    pint: /[\d]/,
    'int': /[\d\-]/,
    pnum: /[\d\.]/,
    money: /[\d\.\s,]/,
    num: /[\d\-\.]/,
    hex: /[0-9a-f]/i,
    email: /[a-z0-9_\.\-@]/i,
    alpha: /[a-z_]/i,
    alphanum: /[a-z0-9_]/i,
    phone: /[0-9_\.\-+]/i
};

const KEYS = {
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    BACKSPACE: 8,
    DELETE: 46
};


@Directive({
    selector: '[prxKeyfilter]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => KeyfilterDirective),
        multi: true
    }]
})
export class KeyfilterDirective implements Validator {

    @Input() pValidateOnly: boolean;

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

    regex: RegExp;

    _pattern: any;

    lastValue: any;

    isAndroid: boolean;

    constructor(public el: ElementRef) {
        this.isAndroid = /(android)/i.test(navigator.userAgent);
    }

    get pattern(): any {
        return this._pattern;
    }

    @Input('prxKeyfilter') set pattern(_pattern: any) {
        this._pattern = _pattern;
        this.regex = DEFAULT_MASKS[this._pattern] || this._pattern;
    }

    isNavKeyPress(e: KeyboardEvent) {
        let k = e.keyCode;

        return (k >= 33 && k <= 40) || k == KEYS.RETURN || k == KEYS.TAB || k == KEYS.ESC;
    };

    isSpecialKey(e: KeyboardEvent) {
        let k = e.keyCode || e.charCode;

        return k == 9 || k == 13 || k == 27 || k == 16 || k == 17 || (k >= 18 && k <= 20);
    }


    getKey(e: KeyboardEvent) {
        let k = e.keyCode || e.charCode;
        return k;
    }

    getCharCode(e: KeyboardEvent) {
        return e.charCode || e.keyCode || e.which;
    }

    findDelta(value: string, prevValue: string) {
        let delta = '';

        for (let i = 0; i < value.length; i++) {
            let str = value.substr(0, i) + value.substr(i + value.length - prevValue.length);

            if (str === prevValue)
                delta = value.substr(i, value.length - prevValue.length);
        }

        return delta;
    }

    isValidChar(c: string) {
        return this.regex.test(c);
    }

    isValidString(str: string) {
        for (let i = 0; i < str.length; i++) {
            if (!this.isValidChar(str.substr(i, 1))) {
                return false;
            }
        }

        return true;
    }

    @HostListener('input', ['$event'])
    onInput(e: KeyboardEvent) {
        if (!this.regex) {
            return;
        }
        if (this.isAndroid && !this.pValidateOnly) {
            let val = this.el.nativeElement.value;
            let lastVal = this.lastValue || '';

            let inserted = this.findDelta(val, lastVal);
            let removed = this.findDelta(lastVal, val);
            let pasted = inserted.length > 1 || (!inserted && !removed);

            if (pasted) {
                if (!this.isValidString(val)) {
                    this.el.nativeElement.value = lastVal;
                    this.ngModelChange.emit(lastVal);
                }
            }
            else if (!removed) {
                if (!this.isValidChar(inserted)) {
                    this.el.nativeElement.value = lastVal;
                    this.ngModelChange.emit(lastVal);
                }
            }

            val = this.el.nativeElement.value;
            if (this.isValidString(val)) {
                this.lastValue = val;
            }
        }
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(e: KeyboardEvent) {
        if (!this.regex || this.isAndroid || this.pValidateOnly) {
            return;
        }

        let k = this.getKey(e);

        if (k == 17 || k == 18) {
            return;
        }

        let c = this.getCharCode(e);
        let cc = String.fromCharCode(c);
        let ok = true;

        if (this.isSpecialKey(e) || !cc) {
            return;
        }

        ok = this.regex.test(cc);

        if (!ok) {
            e.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(e: any) {
        if (!this.regex) {
            return;
        }
        const clipboardData = e.clipboardData || (<any>window).clipboardData.getData('text');
        if (clipboardData) {
            const pastedText = clipboardData.getData('text');
            for (let char of pastedText.toString()) {
                if (!this.regex.test(char)) {
                    e.preventDefault();
                    return;
                }
            }
        }
    }

    validate(c: AbstractControl): { [key: string]: any } | null {
        if (this.pValidateOnly) {
            let value = this.el.nativeElement.value;
            if (value && !this.regex.test(value)) {
                return {
                    validatePattern: false
                }
            }
        }
    }

}

@NgModule({
    declarations: [KeyfilterDirective],
    exports: [KeyfilterDirective],
    imports: [
        CommonModule
    ]
})
export class IdeoKeyFilterModule { }