import { Renderer2 } from '@angular/core';

export class ScreenReaderPusher {

  constructor(private _renderer: Renderer2, private _uListElement: HTMLUListElement) {
  }

  public pushMessage(message: string): string {
    if (!this._uListElement) return;
    this._renderer.appendChild(this._uListElement, this._generateLI(message));
    return message;
  }

  public clearMessages(): void {
    if (!this._uListElement) return;
    this._renderer.setProperty(this._uListElement, 'innerHTML', '');
  }

  private _generateLI(message: string) {
    let li: HTMLLIElement = this._renderer.createElement('li');
    li.innerText = message;
    return li;
  }

}