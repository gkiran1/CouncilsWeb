
import {Directive,ElementRef,Output,EventEmitter} from '@angular/core';

@Directive({
  selector: '[test1]',
  host:{
    '(change)':'getValue()'
  }
})

export class Test {
  name:string;
  @Output() userUpdated = new EventEmitter();
  constructor(private eref:ElementRef) {
    this.name = 'Angular2';
  }
  getValue(){
    this.userUpdated.emit(this.eref.nativeElement.value);
  }
}