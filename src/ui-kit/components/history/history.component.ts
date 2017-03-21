import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'sam-history',
  templateUrl:'history.template.html'
})
export class SamHistoryComponent implements OnInit {
  @Input() data: any;
  @Input() currentId: any;

  ngOnInit(): void {}
}
