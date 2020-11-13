import {
  Component,
  OnInit,
  //OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  //AfterViewInit,
  QueryList,
  ViewChildren,
  Input,
  ElementRef,
  DoCheck,
  KeyValueDiffers
} from "@angular/core";

import { MatCalendar } from "@angular/material/datepicker";
import { DateAdapter, NativeDateAdapter } from "@angular/material/core";

import {
  CALENDAR_DTB,
  _on_init,
  _on_user_slct,
  _do_check,
  _change_lang,
  _change_year,
  _change_slcted
} from "./util";

@Component({
  selector: "big-datepicker-board",
  templateUrl: "./big-datepicker-board.component.html",
  styleUrls: ["./big-datepicker-board.component.css"],
  providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }],
  changeDetection: ChangeDetectionStrategy.Default
})
export class BigDatepickerBoardComponent implements OnInit, DoCheck {
  public _dtb: CALENDAR_DTB;
  private _flat_dtb: Array<any>;
  public _date_cls: (dt: Date, view: string) => string;
  private _obj_diff: any;
  @Input() cell_width: string;
  @Input() disable: boolean;
  private _year: number;
  @Input() set year(y: number) {
    _change_year(this, y);
  }
  private _lang: string;
  @Input() set lang(lang: string) {
    _change_lang(this, lang);
  }
  private _slcted: Array<any>;
  @Input() set slcted(arr: Array<any>) {_change_slcted(this,arr);}
  @ViewChildren(MatCalendar, { read: ElementRef }) picker_refs: QueryList<
    MatCalendar<Date>
  >;
  @ViewChildren(MatCalendar) pickers: QueryList<MatCalendar<Date>>;
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private _adapter: DateAdapter<any>,
    private kvdiff: KeyValueDiffers
  ) {}
  ngOnInit() {
    _on_init(this);
  }
  ngDoCheck() {
    _do_check(this);
  }
  public on_user_slct = (event: any, cell: any) => {
    _on_user_slct(this, event, cell);
  };
}

