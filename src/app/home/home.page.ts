import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { ConexaoService, Produto } from '../service/conexao/conexao.service';
import { ToastController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpServicePage } from '../service/http-service/http-service.page';


declare var navigator: any;
declare var Connection: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {


  nome_usuario: string;
  produtos: any[] = [];
  onlyInactives: boolean = false;
  searchText: string = null;
  id_usuario: string;
  constructor(
    public storage: Storage,
    private authservice: AuthService,
    private router: Router,
    private conexao: ConexaoService,
    private toast: ToastController,
    public alertController: AlertController,
    public platform: Platform,
    public loadingController: LoadingController,
    public http: HttpServicePage,
  ) { }

  ionViewWillEnter() {
    this.storage.get('usuario')
      .then((user) => {
        //console.log("Usuario Storage:", user);
        this.nome_usuario = user.nome;
        this.id_usuario = user.id_usuario
      });
  }



  ionViewDidEnter() {
    this.PegarTodosProdutos();
  }
  editarProduto(id) {
    this.router.navigate(['/ProdutoPage', id]);
  }

  adcionarProduto() {
    this.router.navigate(['ProdutoPage']);
  }

  async removeProduto(produto) {
    await this.conexao.removeProdutoBD(produto.id)
      .then(() => {
        // Removendo do array de produtos
        var index = this.produtos.indexOf(produto);
        this.produtos.splice(index, 1);
        this.toast.create({ message: 'Produto removido.', duration: 3000 }).then(res => res.present());
      })
  }

  PegarTodosProdutos() {
    this.storage.get('usuario')
      .then((r) => {
        this.conexao.getAll(r.id_usuario, this.searchText, this.onlyInactives)
          .then((result: any[]) => {
            this.produtos = result;
          });
      })
  }



  enviar() {
    this.platform.ready().then(() => {
      var networkState = navigator.connection.type;
      var states = {};
      states[Connection.UNKNOWN] = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI] = 'WiFi connection';
      states[Connection.CELL_2G] = 'Cell 2G connection';
      states[Connection.CELL_3G] = 'Cell 3G connection';
      states[Connection.CELL_4G] = 'Cell 4G connection';
      states[Connection.CELL] = 'Cell generic connection';
      states[Connection.NONE] = 'No network connection';
      console.log(states[networkState]);

      if (states[networkState] != 'No network connection') {

        this.conexao.getAll(this.id_usuario, this.searchText, false)
          .then((resultado: any[]) => {
            //this.consultor = result;

            //Carrega load
            this.loadingController.create({
              message: "Enviando dados para seu Dash..."
            }).then((load) => load.present());
            //
            //Envia todos com contatos que estão com status enviados como 0,
            // para banco de dados via api REST
            this.http.save('customers/enviar', resultado)
              .subscribe(data => {
                this.toast.create({
                  message: data.msg,
                  duration: 3000
                }).then((load) => load.present());
              });

            //Atualiza todos os contatos enviados para 1
            for (let ativo of resultado) {
              console.log(ativo.id);
              this.conexao.update_enviar(ativo.id);
            }
          });

      } else {
        let toast = this.toast.create({
          message: "Por favor conecte a internet para atualizar o sistema!!",
          duration: 3000
        }).then((load) => load.present());
      }
    });


  }


  logout() {
    this.authservice.logout();
    this.router.navigate(['LoginPage']);
  }
  async removeProdutoAlerta(produto: Produto) {
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: 'Você realmente quer apagar esse cliente: <strong>' + produto.cliente + '</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirmar: blah');
          }
        }, {
          text: 'Sim',
          handler: () => {
            this.removeProduto(produto);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


}
