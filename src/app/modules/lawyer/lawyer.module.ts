import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LawyerRoutingModule } from './lawyer-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ListLawyersComponent } from './list-lawyers/list-lawyers.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, LawyerRoutingModule, NgxDatatableModule, ListLawyersComponent],
})
export class LawyerModule {}
