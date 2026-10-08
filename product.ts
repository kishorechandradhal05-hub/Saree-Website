import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  category: string;
  image: string;
  description: string;
  rating?: number;
  size?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://script.google.com/macros/s/AKfycby6laCz5rL2JJ5nQU_sI8sB0jtamthvKtOZdL0sTcB0f2LksmUsOLhrpLKKvTW-BipvdQ/exec';
  
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ================= CATEGORY MAPPING LOGIC =================
  mapCategory(apiGroup: any, apiName: any): string {
    const group = (apiGroup || '').toString().trim();
    const name = (apiName || '').toString().toLowerCase();

    // 1. OIL PRIORITY
    if (name.includes('oil')) {
      return 'Wooden Cold Pressed Oils';
    }

    // 2. DRYFRUITS, NUTS & SEEDS (Stronger Check)
    if (
      group.includes('Dryfruits') || 
      group.includes('Nuts') || 
      group.includes('Seeds') ||
      name.includes('almond') || 
      name.includes('cashew') || 
      name.includes('dates') || 
      name.includes('raisin') ||
      name.includes('walnut') ||
      name.includes('chia') ||
      name.includes('makhana')
    ) {
      return 'Dryfruits, Nuts & Seeds';
    }

    // 3. FLOURS & POWDER
    if (
      group.includes('Flours') || 
      group.includes('Powder') || 
      name.includes('atta') || 
      name.includes('flour')
    ) {
      return 'Flours & Powder';
    }

    // 4. MILLETS
    if (
      group.includes('Millets') || 
      name.includes('millet') || 
      name.includes('ragi') || 
      name.includes('jowar') || 
      name.includes('bajra') ||
      name.includes('kodo')
    ) {
      return 'Millets';
    }

    // 5. SALT
    if (group === 'Salt' || name.includes('salt')) {
      return 'Salt';
    }

    // 6. SWEETNERS
    if (
      group === 'Sweetners' || 
      name.includes('honey') || 
      name.includes('jaggery') || 
      name.includes('sugar') || 
      name.includes('candy')
    ) {
      return 'Sweetners';
    }

    // 7. COOKIES
    if (group === 'Cookies' || name.includes('cookie') || name.includes('biscuit')) {
      return 'Cookies';
    }
    
    return 'Others';
  }

  // ================= FETCH PRODUCTS =================
  fetchProducts(): Observable<Product[]> {
    return new Observable<Product[]>((observer) => {
      this.http.get<any[]>(this.apiUrl).subscribe({
        next: (data) => {
          const products: Product[] = data.map(item => ({
            id: item.ID || item.id, 
            name: item.Name || 'Unknown Product',
            price: Number(item.MRP) || 0,
            discount: Number(item.Discount) || 0,
            description: item.Description || '',
            image: item.Images?.[0] || item.Image || 'assets/placeholder.png',
            rating: Number(item.Rating || item.rating || item.RatingValue || item.ratingValue) || 4.5,
            size: item.Size || item.size || '250 g',
            category: this.mapCategory(
              item['Group Name'] || item.Group || item.Category || item.groupName, 
              item.Name
            )
          }));

          this.productsSubject.next(products);
          observer.next(products);
          observer.complete();
        },
        error: (err) => {
          console.error('Fetch Error:', err);
          observer.error(err);
        }
      });
    });
  }

  // ================= GET BEST PRODUCTS =================
  // Returns top products based on rating and category diversity
  getBestProducts(count: number = 8): Product[] {
    const products = this.productsSubject.getValue();
    if (products.length === 0) return [];

    // Sort by rating (highest first), then by category diversity
    const sorted = [...products].sort((a, b) => {
      // First priority: rating
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      // Second priority: prefer products with discounts
      const discountA = a.price > (a.discount || 0) ? a.price - (a.discount || 0) : 0;
      const discountB = b.price > (b.discount || 0) ? b.price - (b.discount || 0) : 0;
      return discountB - discountA;
    });

    // Ensure category diversity - pick top from each category
    const categories = new Set<string>();
    const bestProducts: Product[] = [];
    
    // First pass: get one from each category (highest rated)
    for (const product of sorted) {
      if (!categories.has(product.category)) {
        categories.add(product.category);
        bestProducts.push(product);
        if (bestProducts.length >= count) break;
      }
    }

    // Second pass: fill remaining slots with highest rated
    if (bestProducts.length < count) {
      for (const product of sorted) {
        if (!bestProducts.find(p => p.id === product.id)) {
          bestProducts.push(product);
          if (bestProducts.length >= count) break;
        }
      }
    }

    return bestProducts.slice(0, count);
  }

  getAllProducts(): Product[] {
    return this.productsSubject.getValue();
  }

  getProductById(id: number): Product | undefined {
    return this.productsSubject.getValue().find(p => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.productsSubject.getValue().filter(p => p.category === category);
  }
}