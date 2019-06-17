import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../service/auth/auth.service';
import { ConexaoService, Login } from '../service/conexao/conexao.service';
import { Router } from '@angular/router';
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
  loginForm : Login = {
    email: '',
    senha: ''
  };

  


  registroForm = {
    email: '',
    senha: '',
    nome: ''
  }


  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private authservice: AuthService,
    private conexao:ConexaoService,
    private router: Router
  ) { }

  ngOnInit() {
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
      .then((res :any[]) => {
        console.log('Usuario logado: ', res);
        res.forEach((d) =>{
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