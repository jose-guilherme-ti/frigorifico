import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
export interface ProdutoFB {
  id?:any;
  peso_inicial: string;
  peso_final: string;
  quantidade: number;
  tipo_corte:string;
  valor:string;
  cliente:string;
  rota:string;
  usuario_id:string;
}
 
@Injectable({
  providedIn: 'root'
})
export class ProdutosServiceFB {
  private produtosCollection: AngularFirestoreCollection<ProdutoFB>;
 
  private produtosFB: Observable<ProdutoFB[]>;
 
  constructor(db: AngularFirestore) {
    this.produtosCollection = db.collection<ProdutoFB>('produto');
 
    this.produtosFB = this.produtosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getProdutos() {
    return this.produtosFB;
  }
 
  getProduto(id) {
    return this.produtosCollection.doc<ProdutoFB>(id).valueChanges();
  }
 
  updateProduto(produto: ProdutoFB, id: any) {
    return this.produtosCollection.doc(id).update(produto);
  }
 
  addProduto(produto: ProdutoFB) {
    return this.produtosCollection.add(produto);
  }
 
  removeProduto(id) {
    return this.produtosCollection.doc(id).delete();
  }
}