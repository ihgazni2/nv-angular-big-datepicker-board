import { NgModule, ModuleWithProviders } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from "@angular/common";
import { SmallGridTableModule } from "small-grid-table";

import { BigDatepickerBoardComponent } from "./big-datepicker-board.component";


@NgModule({
  imports: [CommonModule, SmallGridTableModule, MatCardModule,MatDatepickerModule,MatNativeDateModule ],
  declarations: [BigDatepickerBoardComponent],
  exports: [BigDatepickerBoardComponent],
})
export class BigDatepickerBoardModule {
  public static forRoot(): ModuleWithProviders<BigDatepickerBoardModule> {
    return {
      ngModule: BigDatepickerBoardModule,
      providers: []
    };
  }

  public static forChild(): ModuleWithProviders<BigDatepickerBoardModule> {
    return {
      ngModule: BigDatepickerBoardModule,
      providers: []
    };
  }
}

