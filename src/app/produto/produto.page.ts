import { ConexaoService, Produto } from './../service/conexao/conexao.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ProdutosServiceFB, ProdutoFB } from '../service/conexaoFB/conexao-fb.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {
  model: Produto;
  id_produto: number;
  botao: string = "Registrar";
  produto_peso_final = false;
  usuario_id: any;



  //produtoFB = {};
  constructor(

    private authservice: AuthService,
    private router: Router,
    private conexao: ConexaoService,
    private toast: ToastController,
    public storage: Storage,
    public route: ActivatedRoute,
    //private produtoService: ProdutosServiceFB,
  ) {
    this.model = new Produto();

    /*if (this.navParams.data.id) {
      this.conexao.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
    }*/
    this.storage.get('usuario')
      .then((r) => {
        this.model.usuario_id = r.id_usuario;
        this.usuario_id = r.id_usuario;
        console.log("Usuario id= ", this.model.usuario_id);
      });


    this.route.params.subscribe(params => {
      this.id_produto = params['id'];
      if (this.id_produto) {
        console.log("Id do produto a editar: ", this.id_produto);
        this.conexao.get(this.id_produto)
          .then((result: any) => {
            this.model = result;

            //console.log("Retorno dos dados: ", this.model);
            this.botao = "Atualizar";
            this.produto_peso_final = true;
          })
      }
    });
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
     /* console.log("Produto vai ser atualizado: ", this.produtoFB);
      this.produtoFB.peso_final = this.model.peso_final;
      this.produtoService.updateProduto(this.produtoFB, this.id_produto)*/


      return this.conexao.atualizarProdutoBD(this.model);
    } else {
      
      /*this.produtoFB.cliente = this.model.cliente;
      this.produtoFB.peso_final = "";
      this.produtoFB.peso_inicial = this.model.peso_inicial;
      this.produtoFB.quantidade = this.model.quantidade;
      this.produtoFB.rota = this.model.rota;
      this.produtoFB.tipo_corte = this.model.tipo_corte;
      this.produtoFB.usuario_id = this.model.usuario_id;
      this.produtoFB.valor = this.model.valor;
      this.produtoService.addProduto(this.produtoFB).then(resp => {
        console.log(resp);
      }).catch(error => {
        console.log(error);
      });
      */
      return this.conexao.cadastrarProdutoBD(this.model)

    }
  }


}
