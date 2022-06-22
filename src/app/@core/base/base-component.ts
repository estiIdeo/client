import { HostBinding, Input, Directive, OnDestroy, EventEmitter } from '@angular/core';
import { uniqueId, lowerCase } from 'lodash';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  private _defaultCssClasses: string[];
  public isLoading = true;
  protected isAlive: boolean = true;
  protected destroyed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  dark: boolean = false;

  @Input()
  class: string='';

  @HostBinding('class')
  get hostClass(): string {
    return (
      [this.class, ...this.hostClasses()]
        // Join all css classes
        .join(' ')
        // Trimming
        .replace(/^\s+|\s+$/g, '')
    );
  }

  constructor(defaultCssClass?: string | string[]) {
    this._defaultCssClasses = defaultCssClass
      ? typeof defaultCssClass === 'string'
        ? [defaultCssClass]
        : [...defaultCssClass]
      : [];
  }
  ngOnDestroy(): void {
    this.destroyed.emit(true);
    this.isAlive = false;
  }

  /**
   * Return the default host classes the component should have.
   * When overriding make sure you call super.hostClasses()
   * and return the value along your custom ones
   * in oder to get the default value passed in the constructor.
   */
  protected hostClasses(): string[] {
    return [...this._defaultCssClasses, this.dark ? 'dark' : ''];
  }

  protected getId(id: number | string = uniqueId()): string {
    return `_${lowerCase(this.constructor.name).replace(/\s/g, '-')}_c${id}`;
  }
}
