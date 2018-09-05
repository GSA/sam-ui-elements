import { Component, forwardRef, Input,
    ViewEncapsulation, ChangeDetectorRef,
    ChangeDetectionStrategy, HostListener, OnInit, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SamFormControl } from '../../form-controls/sam-form-control';
import { SamFormService } from '../../form-service';

export const VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamInputMaskComponent),
    multi: true
};

@Component({
    selector: 'sam-input-mask',
    template: `<input
        [disabled]='disabled'
        type='text'
        [attr.id]='name'
        [attr.placeholder]='placeholder'
        [attr.maxlength]='maxlength'
        [ngModel]='value'
        (ngModelChange)='onModelChange($event)'
        (focus)='onFocus()'
        (blur)='onBlur()' />`,
    providers: [ VALUE_ACCESSOR ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamInputMaskComponent extends SamFormControl implements OnInit, OnChanges {
    @Input() template: string;
    @Input() placeholder: string;
    @Input() disableFocusBehavior: boolean = false;
    @Input() maxlength: number;

    previousVal;
    pattern = /([^_\/\)\(-\s])/g;
    defaultValue = '';
    protected _value: any = null;
    public get value (): any {
        return this._value;
    }
    public set value (val: any) {
        this._value = !val ? this.defaultValue : val;
    }

    constructor(public cdr: ChangeDetectorRef, public service: SamFormService) {
        super(service, cdr);
    }

    @HostListener('focus') onHostFocus() {
        this.onTouched();
    }

    onFocus() {
        if (!this.disableFocusBehavior) {
            this.value = this.templateToNumber(this.value);
        }
    }

    onBlur() {
        const newVal = this.numberToTemplate(this.value);
        this.value = newVal;
        if (newVal !== this.previousVal) {
            this.previousVal = this.value;
            this.onChange(this.value);
            this.cdr.detectChanges();
        }
    }

    onModelChange(newVal) {
        this.value = newVal;
        if (this.previousVal && this._value === '') {
            this.onChange(this._value);
            this.cdr.detectChanges();
        } else if (this.maxlength && newVal && newVal.length === this.maxlength) {
            this.onChange(this._value);
            this.cdr.detectChanges();
        }
    }

    ngOnChanges(changes) {
        if (changes['maxlength'] && typeof this.maxlength !== 'number') {
            throw Error('Wrong data type passed in for maxlength. Expected "number", got ' + typeof this.maxlength);
        }
    }

    ngOnInit() {
        if (!this.template) {
            throw Error('No template provided');
        }
    }

    templateToNumber (template: string): string {
        if (!template) {
          return;
        } else {
          return template
            .split('')
            .filter(char => char.match(this.pattern))
            .join('');
        }
      }

    numberToTemplate (numberStr: string): string {
        if (!numberStr) {
            return;
        }

        numberStr = numberStr.replace(/\D/g, '');

        const digits = numberStr
            .split('')
            .filter(digit => digit.match(this.pattern));

        const blanks = this.template
            ? this.template.split('')
            : [];

        return blanks.map(
                blank => {
                    if (blank === '_') {
                        const next = digits.shift();
                        return next ? next : blank;
                    } else {
                        return blank;
                    }
                }
            )
            .join('')
            .concat(digits.join(''));
    }

    writeValue(val) {
        this.value = val;
        this.previousVal = val;
        this.cdr.detectChanges();
    }
}
