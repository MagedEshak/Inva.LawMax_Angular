import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListHearingComponent } from './list-hearing/list-hearing.component';
import { AddHearingComponent } from './add-hearing/add-hearing.component';
import { HearingDetailsComponent } from './hearing-details/hearing-details.component';
import { EditHearingComponent } from './edit-hearing/edit-hearing.component';
import { authGuard } from '@abp/ng.core';

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
    canActivate: [authGuard],
  },
  {
    path: 'edit/:id',
    pathMatch: 'full',
    component: EditHearingComponent,
    canActivate: [authGuard],
  },
  {
    path: 'calender',
    pathMatch: 'full',
    component: HearingDetailsComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HearingRoutingModule {}
