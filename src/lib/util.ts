import { sjsnoz } from "jsnoz";

export interface CALENDAR_CELL_DATA {
  id: string;
  selected?: Date;
  minDate?: Date;
  maxDate?: Date;
  [k: string]: any;
}

export type CALENDAR_DTB = Array<Array<any>>;

export const DTB: CALENDAR_DTB = [
  [
    { data: { id: "id1" } },
    { data: { id: "id2" } },
    { data: { id: "id3" } },
    { data: { id: "id4" } }
  ],
  [
    { data: { id: "id5" } },
    { data: { id: "id6" } },
    { data: { id: "id7" } },
    { data: { id: "id8" } }
  ],
  [
    { data: { id: "id9" } },
    { data: { id: "id10" } },
    { data: { id: "id11" } },
    { data: { id: "id12" } }
  ]
];

export function dcp(o: any) {
  return JSON.parse(JSON.stringify(o));
}

export function put_to_next_macro(f, ...params) {
  setTimeout(() => {
    f(...params);
  }, 0);
}

export function fill_mat_with_year(instance: any, is_init?: boolean) {
  let y = instance._year;
  let l = instance._flat_dtb;
  l.forEach((r, i) => {
    //此处采用utc即可,无须转换成local
    r.data.minDate = new Date(y, i, 1);
    r.data.maxDate = new Date(
      y,
      i,
      sjsnoz.get_days_num_of_month(y, i + 1),
      23,
      59,
      59
    );
    is_init ? undefined : instance.cdr.detectChanges();
  });
}

export function init_disable(instance: any) {
  if (instance.disable === undefined) {
    instance.disable = false;
  } else {
  }
}

export function init_slcted(instance: any) {
  if (instance._slcted === undefined) {
    instance._slcted = [];
  } else {
  }
}

export function init_lang(instance: any) {
  if (instance._lang === undefined) {
    instance._lang = "zh";
  } else {
  }
  let lang = instance._lang;
  if (instance._lang === "zh") {
    lang = "en";
  }
  instance._adapter.setLocale(lang);
}

export function _change_lang(instance: any, lang: string) {
  instance._lang = lang;
  let mlang = instance._lang;
  if (instance._lang === "zh") {
    mlang = "en";
  }
  instance._adapter.setLocale(mlang);
  if(instance.pickers){
      instance.pickers.forEach(r => {
          r._goToDateInView(r.minDate, "month");
      });
  }
}

export function init_year(instance: any) {
  if (instance._year === undefined) {
    instance._year = sjsnoz.dt2local_dict(new Date()).y;
  } else {
  }
}

export function init_calendar_width(instance: any) {
  if (instance.calendar_width === undefined) {
    instance.calendar_width = "800";
  } else {
    let width: any = instance.calendar_width;
    instance.calendar_width = width.toString();
  }
}

export function _on_init(instance: any) {
  instance._dtb = dcp(DTB);
  instance._flat_dtb = instance._dtb.flat();
  init_slcted(instance);
  init_year(instance);
  init_disable(instance);
  init_calendar_width(instance);
  fill_mat_with_year(instance, true);
  instance._date_cls = _date_cls_factory(instance);
  init_lang(instance);
  instance._obj_diff = instance.kvdiff.find(instance._slcted).create();
}

export function _update_ui(instance: any, id: string) {
  let index;
  instance.picker_refs.forEach((r, i) => {
    let cond = r.nativeElement.getAttribute("id") === id;
    if (cond) {
      index = i;
    }
  });
  let ele = instance.pickers.filter((r, i) => i === index)[0];
  ele.updateTodaysDate();
}

export function _on_user_slct(instance: any, event: any, cell: any) {
  if (!instance.disable) {
    instance.lst_changed_cell = cell;
    let dt = event.value;
    let d = sjsnoz.dt2local_dict(dt);
    let s = sjsnoz.dt2local_str(dt);
    d.local_str = s;
    let index = instance._slcted.findIndex(r => r.mts === d.mts);
    let cond = index >= 0;
    if (cond) {
      instance._slcted.splice(index, 1);
    } else {
      instance._slcted.push(d);
    }
    _update_ui(instance, cell.data.id);
  }
}

export function _date_cls_factory(
  instance: any
): (dt: Date, view: string) => string {
  let date_cls = function(dt: Date, view: string) {
    let cond;
    let d = sjsnoz.dt2local_dict(dt);
    if (view === "month") {
      cond = instance._slcted.filter(r => r.mts === d.mts).length > 0;
    } else {
      cond = (instance._year === d.y);
    }
    if (cond) {
      return "slcted";
    } else {
      return "unslcted";
    }
  };
  return date_cls;
}

export function diff_check(instance: any) {
  if (instance.picker_refs !== undefined) {
    let diff = instance._obj_diff.diff(instance._slcted);
    if (diff) {
      diff.forEachAddedItem(r => {
        let id = "id" + r.currentValue.m;
        _update_ui(instance, id);
      });
      diff.forEachRemovedItem(r => {
        let id = "id" + r.previousValue.m;
        _update_ui(instance, id);
      });
    }
  }
}


export function _do_check(instance: any) {
  if (instance.disable) {diff_check(instance);}
}


export function _change_year(instance: any, y:number) {
  //选择了年份
  instance._year = y;
  if(instance.pickers){
     //刷新当前年份日历
      fill_mat_with_year(instance, false);
      //CALENDAR_CELL 自动跳转
      instance.pickers.forEach(r => {
          r._goToDateInView(r.minDate, "month");
      });
  }
}

export function _change_slcted(instance: any, arr:Array<any>) {
  //先比较一次，手动选择的会变化
  diff_check(instance);
  instance._slcted = arr;
  //更换后再比较
  diff_check(instance);
}
