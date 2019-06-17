import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  nome_usuario:string;

  constructor(
    public storage: Storage,
    private authservice: AuthService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.storage.get('usuario')
    .then((user) => {
      console.log("Usuario Storage:", user);
      this.nome_usuario = user.nome;
    });
  }


  adcionarProduto() {
    this.router.navigate(['ProdutoPage']); 
  }


  logout() {
    this.authservice.logout();
    this.router.navigate(['LoginPage']); 
  }


}
