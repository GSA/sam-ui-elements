import { Component, Input } from "@angular/core";

@Component({
  selector: "sam-card",
  templateUrl: "./card.template.html",
  standalone: false,
})
export class SamCardComponent {
  @Input() raised: boolean;
}
