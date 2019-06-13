import { Component } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { BancoService } from '../app/service/banco/banco.service';
import { ConexaoService } from '../app/service/conexao/conexao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private statusBar: StatusBar,
    public events: Events,
    public dbBanco: BancoService,
    public conexao: ConexaoService,
    public network: Network,
    private router:Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //Criando o banco de dados
      this.dbBanco.createDatabase()
        .then(() => {
          // fechando a SplashScreen somente quando o banco for criado
          this.openHomePage(this.splashScreen);
        })
        .catch(() => {
          // ou se houver erro na criação do banco
          this.openHomePage(this.splashScreen);
        });


      this.conexao.initializeNetworkEvents();

      // Offline event
      this.events.subscribe('network:offline', () => {
        alert('network:offline ==> ' + this.network.type);
      });

      // Online event
      this.events.subscribe('network:online', () => {
        alert('network:online ==> ' + this.network.type);
      });




    });
  }
 private openHomePage(splashScreen: SplashScreen) {
    splashScreen.hide();
    this.storage.get('codigo')
      .then((user) => {
        if (user) {
         
          this.router.navigate(['HomePage'])
          console.log("Estou logado");
        } else {
          this.router.navigate(['LoginPage'])
          console.log("Estou não estou logado");
        }
      });
  }

}
