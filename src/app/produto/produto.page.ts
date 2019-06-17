import { ConexaoService, Produto } from './../service/conexao/conexao.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { NavParams, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {
  model: Produto;
  constructor(

    private authservice: AuthService,
    private router: Router,
    private conexao: ConexaoService,
    private navParams: NavParams,
    private toast: ToastController,
  ) {
    this.model = new Produto();

    if (this.navParams.data.id) {
      this.conexao.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
    }

  }

  ngOnInit() {
  }

  acaoProduto(form) {
    this.acoesProduto().then(() => {
      this.toast.create({ message: 'Produto salvo com sucesso!!', duration: 3000 }).then(res => res.present());
      this.router.navigate(['HomePage']);
    })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar o Produto!!', duration: 3000 }).then(res => res.present());
      });
  }


  private acoesProduto() {
    if (this.model.id) {
      //return this.productProvider.update(this.model);
    } else {
      return this.conexao.cadastrarProdutoBD(this.model)

    }
  }

}
