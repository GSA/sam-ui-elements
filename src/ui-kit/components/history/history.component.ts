import { Component, Input, OnInit } from "@angular/core";
import { HistoryNodeType } from "../../types";
@Component({
  selector: 'sam-history',
  templateUrl:'history.template.html'
})
export class SamHistoryComponent implements OnInit {
  /**
  * sets the model for generating nodes
  */
  @Input() data: HistoryNodeType[];
  /**
  * Sets the 'current' node on the id value defined in data
  */
  @Input() currentId: string;

  ngOnInit(): void {}
}
