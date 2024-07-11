import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './component/book/book.component';
import { AddBookComponent } from './component/add-book/add-book.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'book',
    component: BookComponent,
    pathMatch: 'full',
  },
  {
    path: 'add-book',
    component: AddBookComponent,
    pathMatch: 'full',
  },
  { path: '**', component: BookComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
