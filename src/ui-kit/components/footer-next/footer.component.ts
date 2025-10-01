import { Component, Input } from '@angular/core';

@Component({
  selector: 'sam-footer-next',
  standalone: false,
  templateUrl: 'footer.template.html'
})
export class SamFooterNextComponent {
  @Input() agency: string;
  @Input() agencyLink: string;
  @Input() logoPath: string;
  constructor() {}
}
