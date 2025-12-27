import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'places',
    pathMatch: 'full',
  },

  // Places list
  {
    path: 'places',
    loadComponent: () =>
      import('./pages/places/places.page').then((m) => m.PlacesPage),
  },

  // Place detail
  {
    path: 'place/:id',
    loadComponent: () =>
      import('./pages/place-detail/place-detail.page').then((m) => m.PlaceDetailPage),
  },

  // Journal list
  {
    path: 'journal',
    loadComponent: () =>
      import('./pages/journal/journal.page').then((m) => m.JournalPage),
  },

  // Journal create/edit for a place
  {
  path: 'journal-edit/:id',
  loadComponent: () =>
    import('./pages/journal-edit/journal-edit.page').then(m => m.JournalEditPage),
},


  // Safety buddy / SOS page
  {
    path: 'safety',
    loadComponent: () =>
      import('./pages/safety/safety.page').then((m) => m.SafetyPage),
  },

  // Optional: fallback route
  {
    path: '**',
    redirectTo: 'places',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
