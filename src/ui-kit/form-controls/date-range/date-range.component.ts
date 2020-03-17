import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
    ValidatorFn
} from '@angular/forms';
import * as moment from 'moment/moment';
import { SamFormService } from '../../form-service';

/**
 * The <sam-date> component is a Date entry portion of a form
 */
@Component({
    selector: 'sam-date-range',
    templateUrl: 'date-range.template.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SamDateRangeComponent),
        multi: true
    }]
})
export class SamDateRangeComponent
    implements OnInit, OnChanges, ControlValueAccessor {

        @ViewChild('startControl', {static: true}) public startControl;
        @ViewChild('endControl', {static: true}) public endControl;
        @ViewChild('startDate', {static: false}) public startDateComp;
        @ViewChild('endDate', {static: false}) public endDateComp;
        @ViewChild('wrapper', {static: true}) public wrapper;
    /**
     * From Date label parameter for date range components
     */
    fromDateLabel: string = 'From';
    /**
     * To Date label parameter for date range components
     */
    toDateLabel: string = 'To';

    /**
     * Sets the label text
     */
    @Input() stacked: boolean = false;
    /**
     * Sets the label text
     */
    @Input() label: string = '';
    /**
     * Sets the helpful hint text
     */
    @Input() hint: string = '';
    /**
     * If set to true, a 'required' designation is shown for both start and end
     * date. If default validations are enabled, also enables a validation
     * checking that both start and end date are provided.
     *
     * @see {defaultValidations}
     */
    @Input() required: boolean;
    /**
     * If set to true, a 'required' designation is shown for start date
     * If default validations are enabled, also enables a validation checking
     * that start date is provided
     *
     * @see {defaultValidations}
     */
    @Input() fromRequired: boolean;
    /**
     * If set to true, a 'required' designation is shown for end date
     * If default validations are enabled, also enables a validation checking that
     * end date is provided
     *
     * @see {defaultValidations}
     */
    @Input() toRequired: boolean;
    /**
     * Sets the disabled status of component, defaults to false
     */
    @Input() disabled: boolean = false;
    /**
     * Passes in the Angular FormControl
     */
    @Input() control: FormControl;
    /**
     * Toggles date-time mode
     */
    @Input() type: string = 'date';
    /**
     * Toggles validations to display with SamFormService events
     */
    @Input() useFormService: boolean;
    /**
     * Toggles default component validations
     */
    @Input() defaultValidations: boolean = true;
    /**
     * Id parameter for date range components
     */
    @Input() id: string = '';
    /**
     * (deprecated) Event emitted when value changes
     */
    @Output() valueChange = new EventEmitter<any>();

    public INPUT_FORMAT: string = 'Y-M-D';
    public OUTPUT_FORMAT: string = 'YYYY-MM-DD';
    public DT_INPUT_FORMAT: string = 'Y-M-DTH:m';
    public T_OUTPUT_FORMAT: string = 'HH:mm';
    public hasFocus: boolean = false;
    public startModel: any = {
        month: undefined,
        day: undefined,
        year: undefined
    };
    public endModel: any = {
        month: undefined,
        day: undefined,
        year: undefined
    };
    private startDateValue;
    private endDateValue;

    public static dateRangeValidation(c: AbstractControl) {
        const error = {
            dateRangeError: {
                message: ''
            }
        };

        if (c.value && c.value.startDate && c.value.endDate) {
            return SamDateRangeComponent.validateStartAndEnd(c);
        }
        if (c.value && c.value.startDate) {
            return SamDateRangeComponent.validateStart(c);
        }
        if (c.value && c.value.endDate) {
            return SamDateRangeComponent.validateEnd(c);
        }
        return undefined;
    }

    public static dateRangeRequired(instance: SamDateRangeComponent) {
        // return the proper validator based on the instance's required inputs
        const fromRequired = instance.fromRequired || instance.required;
        const toRequired = instance.toRequired || instance.required;

        return (c: AbstractControl) => {
            if (fromRequired && toRequired) {
                const valid = !((c.value && c.value.startDate === 'Invalid date') || (c.value && c.value.endDate === 'Invalid date'));
                if (!instance.hasFocus && !valid) {
                    return {
                        dateRangeError: {
                            message: 'This field is required'
                        }
                    };
                }
            }
            return undefined;
        };
    }

    private static validateStartAndEnd(c) {
        const error = this.newError();

        if (c.value && c.value.startDate && c.value.endDate) {
            const startDateM = moment(c.value.startDate);
            const endDateM = moment(c.value.endDate);
            if (endDateM.diff(startDateM) < 0) {
                error.dateRangeError.message = 'Invalid date range';
                return error;
            }
        }
    }

    private static validateStart(c) {
        const error = this.newError();
        if (c.value && !(c.value.startDate && c.value.startDate === 'Invalid date')) {
            const startDateM = moment(c.value.startDate);
            if (!startDateM.isValid()) {
                error.dateRangeError.message = 'Invalid From Date';
                return error;
            }
        }
    }
    private static validateEnd(c) {
        const error = this.newError();

        if (c.value && !(c.value.endDate && c.value.endDate === 'Invalid date')) {
            const endDateM = moment(c.value.endDate);
            if (!endDateM.isValid()) {
                error.dateRangeError.message = 'Invalid To Date';
                return error;
            }
        }
    }

    private static newError() {
        return {
            dateRangeError: {
                message: ''
            }
        };
    }

    constructor(private samFormService: SamFormService) { }

    public onChange: any = () => undefined;
    public onTouched: any = () => undefined;

    ngOnInit() {

        this.id = this.id.replace(new RegExp("-", 'g'), "_");
        if (!this.control) {
            return;
        }
        const validators: ValidatorFn[] = [];
        if (this.control.validator) {
            validators.push(this.control.validator);
        }
        if (this.defaultValidations) {
            if (this.required) {
                validators.push(SamDateRangeComponent.dateRangeRequired(this));
            }
            validators.push(SamDateRangeComponent.dateRangeValidation);
        }
        this.control.setValidators(validators);
        if (!this.useFormService) {
            this.control.statusChanges.subscribe(() => {
                this.wrapper.formatErrors(this.control);
            });
            this.wrapper.formatErrors(this.control);
        } else {
            this.samFormService.formEventsUpdated$.subscribe((evt: any) => {
                if ((!evt.root || evt.root === this.control.root)
                    && evt.eventType && evt.eventType === 'submit') {
                    this.wrapper.formatErrors(this.control);
                } else if ((!evt.root || evt.root === this.control.root)
                    && evt.eventType && evt.eventType === 'reset') {
                    this.wrapper.clearError();
                }
            });
        }
    }

    ngOnChanges() {
        this.parseValueString();
    }

    focusHandler() {
        this.onTouched();
        this.hasFocus = true;
    }

    focusEndHandler() {
        this.onTouched();
        this.hasFocus = true;
    }
    parseValueString() {
        const format = this.type !== 'date-time'
            ? this.INPUT_FORMAT
            : this.DT_INPUT_FORMAT;
        if (this.startDateValue) {
            // use the forgiving format (that doesn't need 0 padding) for inputs
            const m = moment(this.startDateValue, format);
            this.startModel.month = m.month() + 1;
            this.startModel.day = m.date();
            this.startModel.year = m.year();
            if (this.type === 'date-time') {
                this.startModel.time = m.format(this.T_OUTPUT_FORMAT);
            }
        } else {
            this.startModel.month = '';
            this.startModel.day = '';
            this.startModel.year = '';
        }
        if (this.endDateValue) {
            // use the forgiving format (that doesn't need 0 padding) for inputs
            const m = moment(this.endDateValue, format);
            this.endModel.month = m.month() + 1;
            this.endModel.day = m.date();
            this.endModel.year = m.year();
            if (this.type === 'date-time') {
                this.endModel.time = m.format(this.T_OUTPUT_FORMAT);
            }
        } else {
            this.endModel.month = '';
            this.endModel.day = '';
            this.endModel.year = '';
        }
    }

    getDate(model) {
        return moment([model.year, model.month - 1, model.day]);
    }

    startDateChange(evt) {
        this.startDateValue = evt;
        this.parseValueString();
        this.dateChange();
    }

    endDateChange(evt) {
        this.endDateValue = evt;
        this.parseValueString();
        this.dateChange();
    }

    dateChange() {
        let startDateString = '';
        let endDateString = '';
        if (!this.isEmptyField(this.startModel)) {
            startDateString =
                this.getDate(this.startModel).format(this.OUTPUT_FORMAT);
        }
        if (!this.isEmptyField(this.endModel)) {
            endDateString = this.getDate(this.endModel).format(this.OUTPUT_FORMAT);
        }
        const output: any = {
            startDate: startDateString,
            endDate: endDateString
        };
        if (this.type === 'date-time') {
            const startTimeString = this.startModel.time;
            const endTimeString = this.endModel.time;
            output.startTime = startTimeString;
            output.endTime = endTimeString;
        }
        this.onChange(output);
        this.valueChange.emit(output);
    }

    isEmptyField(model) {
        return (model.day === '' || model.day === undefined) &&
            (model.month === '' || model.month === undefined) &&
            (model.year === '' || model.year === undefined);
    }

    dateBlur(evt) {
        if (this.type === 'date' && evt === 'year entered') {
            this.endDateComp.month.nativeElement.focus();
        }
        this.hasFocus = false;
        this.dateChange();
    }

    endDateBlur() {
        this.hasFocus = false;
        this.dateChange();
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    setDisabledState(disabled) {
        this.disabled = disabled;
    }

    writeValue(value: any) {
        if (value && typeof value === 'object'
            && (value.startDate || value.endDate)) {
            if (this.type === 'date-time') {
                this.startDateValue = value.startDate + ' ' + value.startTime;
                this.endDateValue = value.endDate + ' ' + value.endTime;
            } else {
                this.startDateValue = value.startDate;
                this.endDateValue = value.endDate;
            }
            this.parseValueString();

        } else {
            this.startDateValue = '';
            this.endDateValue = '';
            this.parseValueString();
        }
    }
}
