import { Component } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, Events, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { BancoService } from '../app/service/banco/banco.service';
import { ConexaoService } from '../app/service/conexao/conexao.service';
import { Router } from '@angular/router';
import { FcmService } from './service/fcm/fcm.service';
import { NotificacaoService } from './service/notificacao/notificacao.service';
import { tap } from 'rxjs/operators';

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
    private router: Router,
    private notificationsService: NotificacaoService,
    private toastController: ToastController,
    public fcm: FcmService
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


      // Get a FCM token
      this.fcm.getToken()

      // Listen to incoming messages
      this.fcm.listenToNotifications().pipe(
        tap(msg => {
          // show a toast
          const toast = this.toastController.create({
            message: msg.body,
            duration: 3000
          }).then((load)=> load.present());
          
        })
      )
        .subscribe()

    });
  }
  private openHomePage(splashScreen: SplashScreen) {
    splashScreen.hide();
    this.storage.get('usuario')
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



  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  private notificationSetup() {
    this.notificationsService.getToken();
    this.notificationsService.onNotifications().subscribe(
      (msg) => {
        this.presentToast(msg.body);
      });
  }


}
