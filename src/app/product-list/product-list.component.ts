import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectProductList } from '../products/state/product.selector';
import { ProductService } from '../products/product.service';
import { switchMap } from 'rxjs/operators';
import { updateReceivedProduct, updateCurrency } from '../products/state/product.action';
import { ProductState, Product } from '../products/interface/product.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  productList$: Observable<Product[]>;
  currencyCurrent$: Observable<number>;
  subscription: Subscription;

  constructor(private store :Store<ProductState>, private productService : ProductService) { }

  ngOnInit(): void {
    this.productList$ =  this.store.pipe(select(selectProductList));
    this.getCurrencyRate();
  }

  getCurrencyRate(): void{
    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.productService.getCurrency())
    ).subscribe(res =>{
      this.currencyCurrent$ = res.rates.ILS
      this.store.dispatch(updateCurrency({currency: res.rates.ILS}))
    } );
  }

  handleReceived(id: number): void {
    this.store.dispatch(updateReceivedProduct({id: id}))
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
