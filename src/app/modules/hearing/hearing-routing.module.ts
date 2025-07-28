import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListHearingComponent } from './list-hearing/list-hearing.component';
import { AddHearingComponent } from './add-hearing/add-hearing.component';
import { HearingDetailsComponent } from './hearing-details/hearing-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListHearingComponent,
  },
  {
    path: 'add',
    pathMatch: 'full',
    component: AddHearingComponent,
  },
  {
    path: 'details',
    pathMatch: 'full',
    component: HearingDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HearingRoutingModule {}
