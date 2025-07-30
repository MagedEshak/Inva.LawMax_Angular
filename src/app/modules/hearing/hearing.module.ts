import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HearingRoutingModule } from './hearing-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, HearingRoutingModule, NgxDatatableModule],
})
export class HearingModule {}
