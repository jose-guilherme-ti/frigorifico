import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'LoginPage', pathMatch: 'full' },
  { path: 'HomePage', loadChildren: './home/home.module#HomePageModule' },
  { path: 'LoginPage', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'ProdutoPage', loadChildren: './produto/produto.module#ProdutoPageModule' },
  { path: 'ProdutoPage/:id', loadChildren: './produto/produto.module#ProdutoPageModule' },
  { path: 'http-service', loadChildren: './service/http-service/http-service.module#HttpServicePageModule' },

]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
