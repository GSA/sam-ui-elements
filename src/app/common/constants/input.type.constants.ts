import { Injectable } from '@angular/core';
declare var label: any;
declare var alert: any;
declare var footer: any;
declare var header: any;
declare var button: any;
declare var select: any;
declare var accordions: any;

@Injectable()
export class InputTypeConstants {
	getConstants(){
		return {label,alert,footer,header,button,select,accordions};
	}
}
