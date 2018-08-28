import {
  Directive,
  ElementRef,
  HostListener,
  EventEmitter,
  Output,
  Input } from '@angular/core';

export enum DragState {
  NotDragging,
  DraggingInTarget,
  DraggingOutsideTarget,
}

@Directive({
  selector: '[sam-drag-drop]',
})
export class SamDragDropDirective {
  /**
   * Disables the effect
   */
  @Input() public disabled: boolean = false;
  /**
   * Sets the current drag state ('NotDragging',
   * 'DraggingInTarget', 'DraggingOutsideTarget')
   */
  @Input() public dragState: DragState = DragState.NotDragging;
  /**
   * Event emitter for drag state changes
   */
  @Output() public dragStateChange = new EventEmitter<DragState>();
  /**
   * Emitter for drop events
   */
  @Output() public dropEvent = new EventEmitter<File[]>();

  constructor(private _elementRef: ElementRef) { }

  _eventIsInTarget(event) {
    return this._elementRef.nativeElement.contains(event.target);
  }

  _eventHasFiles(event) {
    return event.dataTransfer
      && event.dataTransfer.files
      && event.dataTransfer.files.length > 0;
  }

  _eventIsInTargetWithFiles(event: DragEvent) {
    return this._eventHasFiles(event)
      && this._eventIsInTarget(event);
  }

  _updateDragState(dragState: DragState) {
    this.dragState = dragState;
    this.dragStateChange.emit(dragState);
  }

  @HostListener('drop', ['$event'])
  public onElementDrop(event) {
    // Prevent file from loading in the browser tab
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    this._processFileEvent(event);
    this._updateDragState(DragState.NotDragging);
  }

  @HostListener('dragover', ['$event'])
  public onElementDragOver(event) {
    // Prevent file from loading in the browser tab
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }

    this._processDragEvent(event);
  }

  @HostListener('dragleave', ['$event'])
  public onElementDragend(event) {
    this._updateDragState(DragState.NotDragging);
  }

  @HostListener('window:dragover', ['$event'])
  public onWindowDragover(event) {
    // Prevent file from loading in the browser tab
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('window:drop', ['$event'])
  public onWindowDrop(event) {
    // Prevent file from loading in the browser tab
    event.preventDefault();
    event.stopPropagation();
  }

  private _processFileEvent (event): void {
    const dropIsValid =
      this._eventIsInTargetWithFiles(event);

    if (dropIsValid) {
      const files = event.dataTransfer.files;
      this.dropEvent.emit(files);
    }
  }

  private _processDragEvent (event): void {
    const dropIsValid = this._eventIsInTarget(event);
    if (dropIsValid) {
      this._updateDragState(DragState.DraggingInTarget);
      event.dataTransfer.dropEffect = 'copy';
    } else {
      this._updateDragState(DragState.DraggingOutsideTarget);
      event.dataTransfer.dropEffect = 'none';
    }
  }
}

