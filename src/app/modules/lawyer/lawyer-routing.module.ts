import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLawyersComponent } from './list-lawyers/list-lawyers.component';
import { AddLawyerComponent } from './add-lawyer/add-lawyer.component';
import { LawyerDetailsComponent } from './lawyer-details/lawyer-details.component';
import { authGuard } from '@abp/ng.core';
import { EditLawyerComponent } from './edit-lawyer/edit-lawyer.component';
import { LawyerCalenderComponent } from './lawyer-calender/lawyer-calender.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListLawyersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add',
    pathMatch: 'full',
    component: AddLawyerComponent,
    canActivate: [authGuard],
  },
  {
    path: 'details/:id',
    pathMatch: 'full',
    component: LawyerDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit/:id',
    pathMatch: 'full',
    component: EditLawyerComponent,
    canActivate: [authGuard],
  },
  {
    path: 'lawyerCalender/:id',
    pathMatch: 'full',
    component: LawyerCalenderComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LawyerRoutingModule {}
