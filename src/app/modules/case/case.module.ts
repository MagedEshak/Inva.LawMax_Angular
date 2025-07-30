import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseRoutingModule } from './case-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CaseRoutingModule, NgxDatatableModule],
})
export class CaseModule {}
