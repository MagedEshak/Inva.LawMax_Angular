import { NgModule } from '@angular/core';
import { PageModule } from '@abp/ng.components/page';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  declarations: [],
  imports: [SharedModule, HomeRoutingModule, PageModule],
})
export class HomeModule {}
