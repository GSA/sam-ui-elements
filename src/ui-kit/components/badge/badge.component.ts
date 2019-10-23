import { Component, Input } from '@angular/core';

import { BadgeConfig } from './types';

@Component({
  selector: 'sam-badge',
  template: `
    <div class="sam-ui label small" [ngClass]="[attached]">
        <ng-content></ng-content>
    </div>
  `
})
export class SamBadgeComponent {
  private _options: BadgeConfig = {};

  get options(): BadgeConfig {
    return this.options;
  }

  /**
   * Sets options for badge
   */
  @Input() set options(config: BadgeConfig) {
    this._options = config;
  }

  get attached(): string {
    const classes = [],
        options = this._options;

    if (options.attached) {
      classes.push(
        options.attached.replace(/-/g, ' '),
        'attached'
      );
    }

    return classes.join(' ');
  }
}
