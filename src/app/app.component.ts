import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  bmi;
  result;
  powerBase$: Observable<any>;
  powNumber$: Observable<any>;

  showResult = false;
  @ViewChild('weightRef') weightRef: ElementRef;
  @ViewChild('heightRef') heightRef: ElementRef;
  @ViewChild('powBaseRef') powBaseRef: ElementRef;
  @ViewChild('powNumberRef') powNumberRef: ElementRef;
  constructor() {
  }

  bmiMath() {
    const weight$ = Observable
      .fromEvent(this.weightRef.nativeElement, 'input')
      .pluck('target', 'value');

    const height$ = Observable
      .fromEvent(this.heightRef.nativeElement, 'input')
      .pluck('target', 'value');

    const bmi$ = Observable
      .combineLatest(weight$, height$, (w: string, h: string) => {
        const wN = parseFloat(w);
        const hN = parseFloat(h);
        const result = wN * 100 * 100 / (hN * hN);
        return Math.round(result * 100) / 100;
      })
      .subscribe(bmi => {
        this.bmi = bmi;
        this.showResult = true;
      });
  }

  basicInput() {
    this.powerBase$ = Observable
      .fromEvent(this.powBaseRef.nativeElement, 'input')
      .pluck('target', 'value');

    this.powNumber$ = Observable
      .fromEvent(this.powNumberRef.nativeElement, 'input')
      .pluck('target', 'value');
  }

  zip() {
    // zip操作：绑定的2端有一端发送数据时不触发，2端都有发送数据时按照队列的方式出入以获取结果
    // 如果流1先发送了数据'a','b','c' 流2再发送数据'1'则返回结果为('a', 1)
    // 如果流2再发送数据'2' 则返回结果为('b', 2)
    Observable
      .zip(this.powerBase$, this.powNumber$, (base, number) => {
        return{
          base,
          number
        }
      })
      .subscribe(obj => {
        console.log(`${obj.base}:${obj.number}`);
      })
  }

  merge() {
    // merge 哪个流有值就显示谁
    Observable
      .merge(this.powerBase$, this.powNumber$)
      .subscribe(n => console.log(n));
  }

  concat() {
    const odd$ = Observable.from([1, 3, 5, 7]);
    const even$ = Observable.from([2, 4, 6, 8]);
    // concat 等第一个流终止时才执行第二个流
    odd$.concat(even$)
      .subscribe(r => console.log(r));
  }

  ngOnInit() {
    this.bmiMath();
    this.basicInput();
    // this.zip();
    this.merge();
    this.concat();
  };
}
