import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListingComponent } from './components/event-listing/event-listing.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventCreationComponent } from './components/event-creation/event-creation.component';

const routes: Routes = [
  { path:"", component:EventListingComponent},
  { path:'event/:id', component: EventDetailsComponent},
  { path: 'createEvent', component: EventCreationComponent },
  { path: 'edit/:id', component: EventCreationComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
