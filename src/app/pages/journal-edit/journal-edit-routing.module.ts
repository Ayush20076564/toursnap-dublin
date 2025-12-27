import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JournalEditPage } from './journal-edit.page';

const routes: Routes = [
  {
    path: '',
    component: JournalEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JournalEditPageRoutingModule {}
