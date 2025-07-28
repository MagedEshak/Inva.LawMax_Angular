import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCaseComponent } from './list-case/list-case.component';
import { AddCaseComponent } from './add-case/add-case.component';
import { CaseDetailsComponent } from './case-details/case-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListCaseComponent,
  },
  {
    path: 'add',
    pathMatch: 'full',
    component: AddCaseComponent,
  },
  {
    path: 'details',
    pathMatch: 'full',
    component: CaseDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseRoutingModule {}
