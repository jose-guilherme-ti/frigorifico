import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from '../service/auth/auth.service';
import { Router} from '@angular/router';
import { ConexaoService, Produto } from '../service/conexao/conexao.service';
import { ToastController, AlertController } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  constructor(
    public storage: Storage,
    private authservice: AuthService,
    private router: Router,
    private conexao: ConexaoService,
    private toast: ToastController,
    public alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.storage.get('usuario')
      .then((user) => {
        //console.log("Usuario Storage:", user);
        this.nome_usuario = user.nome;
      });
  }



  ionViewDidEnter() {
    this.PegarTodosProdutos();
  }
  editarProduto(id){
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
        this.toast.create({ message: 'Produto removido.', duration: 3000}).then(res => res.present());
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


  logout() {
    this.authservice.logout();
    this.router.navigate(['LoginPage']);
  }
  async removeProdutoAlerta(produto: Produto) {
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: 'Você realmente quer apagar esse cliente: <strong>'+ produto.cliente +'</strong>!!!',
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
