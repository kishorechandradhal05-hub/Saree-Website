import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: any[] = [];

  // =========================
  // 🔥 GLOBAL POPUP EVENT
  // =========================
  private cartEvent = new Subject<string>();
  cartEvent$ = this.cartEvent.asObservable();

  constructor() {
    this.loadCart();
  }

  // ================= LOAD =================
  private loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  }

  // ================= SAVE =================
  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  // ================= ADD TO CART =================
  addToCart(product: any) {

    const existing = this.items.find(i => i.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({
        ...product,
        qty: 1
      });
    }

    this.saveCart();

    // 🔥 TRIGGER POPUP
    this.cartEvent.next(`${product.name} added to cart`);
  }

  // ================= GET ITEMS =================
  getItems() {
    return this.items;
  }

  // ================= INCREASE =================
  increaseQty(item: any) {
    const found = this.items.find(i => i.id === item.id);
    if (found) {
      found.qty++;
      this.saveCart();
    }
  }

  // ================= DECREASE =================
  decreaseQty(item: any) {
    const found = this.items.find(i => i.id === item.id);

    if (found) {
      if (found.qty > 1) {
        found.qty--;
      } else {
        this.removeItem(item);
      }
      this.saveCart();
    }
  }

  // ================= REMOVE =================
  removeItem(item: any) {
    this.items = this.items.filter(i => i.id !== item.id);
    this.saveCart();
  }

  // ================= CLEAR =================
  clearCart() {
    this.items = [];
    localStorage.removeItem('cart');
  }

  // ================= TOTAL =================
  getTotal() {
    return this.items.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.qty));
    }, 0);
  }

  // ================= COUNT =================
  getCartCount() {
    return this.items.reduce((count, item) => count + item.qty, 0);
  }
}