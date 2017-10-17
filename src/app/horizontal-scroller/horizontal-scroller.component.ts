import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter } from '@angular/core';
import { HotkeysService, Hotkey, ExtendedKeyboardEvent } from 'angular2-hotkeys';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cho-horizontal-scroller',
  templateUrl: './horizontal-scroller.component.html',
  styleUrls: ['./horizontal-scroller.component.scss']
})
export class HorizontalScrollerComponent implements OnInit {

  constructor(private _hotkeysService: HotkeysService) { }

  public contentLeftOffset: number = 0;

  @ViewChild('content')
  private _contentElement: ElementRef;
  private _isMouseDown: boolean = false;
  private _resetEmitter: EventEmitter<any>;
  private _resetSubscription: Subscription;
  private _scrollToRightEndEmitter: EventEmitter<any>;
  private _scrollToRightEndSubscription: Subscription;

  public get isContentOverflowing(): boolean {
    return this._contentScrollWidth > this._contentComputedWidth;
  }

  public get isLeftEnabled(): boolean {
    return this.isContentOverflowing && this.contentLeftOffset > 0;
  }

  public get isRightEnabled(): boolean {
    return this.isContentOverflowing && this.contentLeftOffset < this.maxLeftOffset;
  }

  public get maxLeftOffset(): number {
    return this._contentScrollWidth - this._contentComputedWidth;
  }

  public get minLeftOffset(): number {
    return 0;
  }

  public get resetEmitter(): EventEmitter<any> {
    return this._resetEmitter;
  }

  @Input('reset')
  public set resetEmitter(value: EventEmitter<any>) {
    if (this._resetEmitter) {
      this._resetEmitter.complete();
    }
    this._resetEmitter = value;
    this._resetSubscription =
      this._resetEmitter
        .subscribe(e => this.reset());
  }

  public get scrollToRightEndEmitter(): EventEmitter<any> {
    return this._scrollToRightEndEmitter;
  }

  @Input('scroll-to-right-end')
  public set scrollToRightEndEmitter(value: EventEmitter<any>) {
    if (this._scrollToRightEndEmitter) {
      this._scrollToRightEndEmitter.complete();
    }
    this._scrollToRightEndEmitter = value;
    this._scrollToRightEndSubscription =
      this._scrollToRightEndEmitter
        .subscribe(e => this.scrollToRightEnd());
  }

  private get _contentComputedWidth(): number {
    return Number.parseFloat(window.getComputedStyle(this._contentElement.nativeElement).width);
  }

  private get _contentScrollWidth(): number {
    return this._contentElement.nativeElement.scrollWidth;
  }

  ngOnInit() {
    this._hotkeysService.add(new Hotkey('left', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
      if (this.isLeftEnabled) {
        this.scrollLeft();
      }
      event.returnValue = false;
      return event;
    }));
    this._hotkeysService.add(new Hotkey('right', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
      if (this.isRightEnabled) {
        this.scrollRight();
      }
      event.returnValue = false;
      return event;
    }));
  }

  public onMouseDown(callback: () => void, timeoutInterval: number = 10): void {
    this._isMouseDown = true;
    let timeoutFn = () => {
      if (this._isMouseDown) {
        callback();
        setTimeout(timeoutFn, timeoutInterval);
      }
    };
    setTimeout(timeoutFn, 0);
  }

  public onMouseUp(): void {
    this._isMouseDown = false;
  }

  public onScrollLeftMouseDown(): void {
    this.onMouseDown(() => this.scrollLeft(), 50);
  }

  public onScrollRightMouseDown(): void {
    this.onMouseDown(() => this.scrollRight(), 50);
  }

  public reset(): void {
    this.contentLeftOffset = 0;
  }

  public scrollLeft(): void {
    if (this.isLeftEnabled) {
      console.log('horizontal-scroller: scrolling left');
      this.contentLeftOffset -= 10;
      if (this.contentLeftOffset < this.minLeftOffset) {
        this.contentLeftOffset = 0;
      }
    }
  }

  public scrollRight(): void {
    if (this.isRightEnabled) {
      console.log('horizontal-scroller: scrolling right');
      this.contentLeftOffset += 10;
      if (this.contentLeftOffset > this.maxLeftOffset) {
        this.scrollToRightEnd();
      }
    }
  }

  public scrollToRightEnd(): void {
    if (this.isContentOverflowing) {
      console.log('horizontal-scroller: scrolling to right end');
      this.contentLeftOffset = this.maxLeftOffset;
    }
  }
}
