import { Component, Input, ElementRef, TemplateRef, Renderer2, ViewChild, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: "sam-title",
  template: `
    <ng-template #titleTemplate>
      <ng-content></ng-content>
    </ng-template>

    <ng-container [ngTemplateOutlet]="titleTpl">
    </ng-container>
  `
})
export class SamTitleComponent implements AfterViewInit, OnInit {

  @Input() public importance: string;
  @Input() public aligned: string;
  @Input() public weight: string;

  @ViewChild('titleTemplate')
  private titleTpl: TemplateRef<any>
  
  css_classes: string = 'sam title';

  constructor(private renderer: Renderer2){}

  ngOnInit(){
    this.css_classes += this.aligned ? ` ${this.aligned} aligned` : '';
    this.css_classes += this.weight ? ` ${this.weight}` : '';
  }

  ngAfterViewInit() {
    let template = this.titleTpl.elementRef.nativeElement;
    let parent = template.parentNode;
    let parentContent = parent.innerHTML;
    parent.innerHTML = "";
    let tag = this.renderer.createElement(this.getTitleTag(this.importance));
    this.renderer.setAttribute(tag, 'class', this.css_classes);
    this.renderer.setProperty(tag, 'innerHTML', parentContent);
    this.renderer.appendChild(parent, tag);
  }

  getTitleTag(importance):string{
    switch(importance){
      case "highest":{
        return "h1";
      }
      case "high":{
        return "h2";
      }
      case "normal":{
        return "h3";
      }
      case "low":{
        return "h4";
      }
    }
  }

}