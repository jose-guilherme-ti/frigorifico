import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../service/auth/auth.service';
import { ConexaoService, Login } from '../service/conexao/conexao.service';
import { Router } from '@angular/router';
import { ProdutoFB, ProdutosServiceFB } from '../service/conexaoFB/conexao-fb.service';
import { NotificacaoService } from '../service/notificacao/notificacao.service';


@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  animations: [
    trigger(
      'login', [
        transition(':enter', [
          style({
            opacity: 0
          }),
          animate("1s ease-in-out", style({
            opacity: 1
          }))
        ]),
        transition(':leave', [
          style({
            opacity: 0
          })
        ])
      ],
    ),
    trigger(
      'registro', [
        transition(':enter', [
          style({
            opacity: 0
          }),
          animate("1s ease-in-out", style({
            opacity: 1
          }))
        ]),
        transition(':leave', [
          style({
            opacity: 0
          })
        ])
      ],
    ),
  ]
})
export class LoginPage implements OnInit {

  login = true;
  register = false;
  loginForm: Login = {
    email: '',
    senha: ''
  };




  registroForm = {
    email: '',
    senha: '',
    nome: ''
  }
  produtosFB: ProdutoFB[];
  public notifications: any;
  public isSubscribed: boolean;
  private TOPIC_NAME = 'homeTopic';

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private authservice: AuthService,
    private conexao: ConexaoService,
    private router: Router,
    private produtoService: ProdutosServiceFB,
    private notificationsService: NotificacaoService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.produtoService.getProdutos().subscribe(res => {
      this.produtosFB = res;
      console.log(this.produtosFB);
    });
  }


  ionViewDidEnter() {
    this.notifications = this.notificationsService.onNotifications().subscribe(
      (msg) => {
        this.presentToast(msg.body);
      });
  }

  ionViewDidLeave() {
    this.notifications.unsubscribe();
  }

  public handleSubscription(subscribed) {
    if (subscribed) {
      this.notificationsService.topicSubscription(this.TOPIC_NAME);
    } else {
      this.notificationsService.topicUnsubscription(this.TOPIC_NAME);
    }
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }






  //Exibir form de registro
  exibirRegistrar() {
    this.login = false;
    this.register = true;
  }

  //Exibir form de login
  exibirLogin() {
    this.login = true;
    this.register = false;
  }



  //Login
  fazerLogin() {

    let data;
    this.conexao.loginLocal(this.loginForm)
      .then((res: any[]) => {
        console.log('Usuario logado: ', res);
        res.forEach((d) => {
          data = {
            nome: d.nome,
            email: d.email,
            id_usuario: d.id
          };
        })
        this.storage.set('usuario', data)
          .then(() => {
            // presentLoading();
            this.router.navigate(['HomePage'])
          })

      })
      .catch((err) => {

      })
  }

  //Registro
  criarNovaConta() {

    this.authservice.registrar(this.registroForm)
      .then((res) => {
        //Organizar dados
        /*let data = {
          nome: this.registroForm.nome,
          email: this.registroForm.email
        };
        this.storage.set('usuario', data)
          .then(() => {
            //presentLoading();
            this.router.navigate(['HomePage'])
          })*/
        this.exibirLogin();
      })
      .catch((err) => {
      })

  }


}
async function presentLoading() {
  const loadingController = document.querySelector('ion-loading-controller');
  await loadingController.componentOnReady();

  const loadingElement = await loadingController.create({
    message: 'Carregando por favor aguarde...',
    spinner: 'crescent',
    duration: 3000
  });
  return await loadingElement.present();
}