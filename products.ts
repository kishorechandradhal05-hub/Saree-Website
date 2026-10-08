import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClientModule,
  HttpClient
} from '@angular/common/http';

import {
  Router,
  RouterModule,
  ActivatedRoute
} from '@angular/router';

import { CartService } from '../../services/cart.service';

interface Product {

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

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})

export class Products implements OnInit {

  // =====================================
  // PRODUCTS
  // =====================================

  products: Product[] = [];

  filteredProducts: Product[] = [];

  // =====================================
  // POPUP
  // =====================================

  showPopup = false;

  popupMessage = '';

  // =====================================
  // LOADING
  // =====================================

  isLoading = true;

  fillPercent = 60;

  // =====================================
  // CATEGORY LIST
  // =====================================

  categories = [

    'Cookies',

    'Dryfruits, Nuts & Seeds',

    'Flours & Powder',

    'Millets',

    'Wooden Cold Pressed Oils',

    'Salt',

    'Sweetners',

    'Others'

  ];

  // =====================================
  // DEFAULT CATEGORY
  // =====================================

  activeMenu = 'Dryfruits, Nuts & Seeds';

  // =====================================
  // API URL
  // =====================================

  apiUrl =
    'https://script.google.com/macros/s/AKfycby6laCz5rL2JJ5nQU_sI8sB0jtamthvKtOZdL0sTcB0f2LksmUsOLhrpLKKvTW-BipvdQ/exec';

  constructor(

    private http: HttpClient,

    public cartService: CartService,

    private cdr: ChangeDetectorRef,

    private router: Router,

    private route: ActivatedRoute

  ) {}

  // =====================================
  // INIT
  // =====================================

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      if (params['category']) {

        this.activeMenu = params['category'];

      }

      this.fetchProducts();

    });

  }

  // =====================================
  // SUCCESS POPUP
  // =====================================

  showSuccessPopup(message: string) {

    this.popupMessage = message;

    this.showPopup = true;

    setTimeout(() => {

      this.showPopup = false;

      this.cdr.detectChanges();

    }, 2200);

  }

  // =====================================
  // CATEGORY MAPPING
  // =====================================

 mapCategory(apiGroup: any, apiName: any): string {

  const group = (apiGroup || '')
    .toString()
    .trim();

  const name = (apiName || '')
    .toString()
    .toLowerCase();

  const lowerGroup = group.toLowerCase();

  // =====================================
  // COOKIES & CRACKERS (Moved to the top to prevent misclassification)
  // =====================================

  if (
    lowerGroup.includes('cookie') ||
    lowerGroup.includes('cookies') ||
    name.includes('cookie') ||
    name.includes('biscuit') ||
    name.includes('cracker')
  ) {
    return 'Cookies';
  }

  // =====================================
  // OILS
  // =====================================

  if (
    lowerGroup.includes('oil') ||
    name.includes('oil')
  ) {
    return 'Wooden Cold Pressed Oils';
  }

  // =====================================
  // DRY FRUITS
  // =====================================

  if (
    lowerGroup.includes('dryfruit') ||
    lowerGroup.includes('nuts') ||
    lowerGroup.includes('seeds') ||
    name.includes('almond') ||
    name.includes('cashew') ||
    name.includes('dates') ||
    name.includes('raisin') ||
    name.includes('walnut') ||
    name.includes('chia') ||
    name.includes('makhana') ||
    name.includes('super') ||
    name.includes('seed') ||
    name.includes('peanuts') ||
    name.includes('pistachio') ||
    name.includes('anjeer') ||
    name.includes('dried cranberries')
  ) {
    return 'Dryfruits, Nuts & Seeds';
  }

  // =====================================
  // FLOURS
  // =====================================

 if (
    lowerGroup.includes('flour') ||
    lowerGroup.includes('powder') ||
    name.includes('atta') ||
    name.includes('flour') ||
    name.includes('mix') ||
    name.includes('sattu')
  ) {
    return 'Flours & Powder';
  }

  // =====================================
  // MILLETS
  // =====================================

  if (
    lowerGroup.includes('millet') ||
    name.includes('millet') ||
    name.includes('ragi') ||
    name.includes('jowar') ||
    name.includes('bajra') ||
    name.includes('kodo') ||
    name.includes('grains')
  ) {
    return 'Millets';
  }

  // =====================================
  // SALT
  // =====================================

  if (
    lowerGroup.includes('salt') ||
    name.includes('salt')
  ) {
    return 'Salt';
  }

  // =====================================
  // SWEETNERS
  // =====================================

  if (
    lowerGroup.includes('sweet') ||
    name.includes('jaggery') ||
    name.includes('sugar') ||
    name.includes('candy') ||
    name.includes('honey')
  ) {
    return 'Sweetners';
  }

  // =====================================
  // MATCH EXISTING CATEGORY
  // =====================================

  const matchedCategory = this.categories.find(cat =>
    lowerGroup === cat.toLowerCase()
  );

  if (matchedCategory) {
    return matchedCategory;
  }

  // =====================================
  // CREATE NEW CATEGORY
  // =====================================

  if (
    group.length > 0 &&
    !this.categories.includes(group)
  ) {
    // INSERT BEFORE OTHERS
    this.categories.splice(
      this.categories.length - 1,
      0,
      group
    );
    return group;
  }

  // =====================================
  // FINAL FALLBACK
  // =====================================

  return 'Others';

}

  // Function to get product name (removes last word)
  getProductName(value: string): string {
    if (!value) return '';

    const words = value.trim().split(' ');

    // Remove last word
    words.pop();

    return words.join(' ').trim();
  }

  // Function to get weight (returns last word)
  getWeight(value: string): string {
    if (!value) return '';

    const words = value.trim().split(' ');

    return words[words.length - 1];
  }

  // =====================================
  // SHORT PRODUCT NAME
  // =====================================


  getCleanProductName(name: string): string {

    if (!name) {

      return '';

    }

    let cleanName = name

      .replace(/\(.*?\)/g, '')

      .replace(/\d+\s?(gm|g|kg|ltr|litre|ml)/gi, '')

      .replace(/-/g, '')

      .replace(/\s+/g, ' ')

      .trim();

    const words = cleanName.split(' ');

    if (words.length > 3) {

      return words
        .slice(0, 3)
        .join(' ');

    }

    return cleanName;

  }

  // =====================================
  // EXTRACT WEIGHT
  // =====================================

  extractWeight(name: string): string {

    if (!name) {

      return '500 gm';

    }

    const match = name.match(

      /(\d+\s?(gm|g|kg|ltr|litre|ml))/i

    );

    return match ? match[0] : '500 gm';

  }

  // =====================================
  // FETCH PRODUCTS
  // =====================================

  fetchProducts() {

    this.isLoading = true;

    this.http.get<any[]>(this.apiUrl).subscribe({

      next: (data) => {

        this.products = data.map(item => {

          const category = this.mapCategory(

            item['Group Name'] ||

            item.Group ||

            item.Category ||

            item.groupName,

            item.Name

          );

          return {

            id: Number(item.ID || item.id),

            name: item.Name || 'Unknown Product',

            price: Number(item.MRP) || 0,

            discount: Number(item.Discount) || 0,

            description: item.Description || '',

            image: this.extractImage(item),

            rating: Number(

              item.Rating ||

              item.rating ||

              item.RatingValue ||

              item.ratingValue

            ) || 4.5,

            category: category

          };

        });

        // =====================================
        // FILTER PRODUCTS
        // =====================================

        this.filteredProducts = this.products.filter(

          p => p.category === this.activeMenu

        );

        this.isLoading = false;

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error('Fetch Error:', err);

        this.isLoading = false;

      }

    });

  }

  // =====================================
  // IMAGE EXTRACTION
  // =====================================

  extractImage(item: any): string {

    if (Array.isArray(item.Images)) {

      return item.Images[0];

    }

    if (typeof item.Images === 'string') {

      return item.Images.split(',')[0];

    }

    return (

      item.Image ||

      'https://via.placeholder.com/400'

    );

  }

  // =====================================
  // CATEGORY SWITCH
  // =====================================

  showMenu(menu: string) {

    this.isLoading = true;

    this.activeMenu = menu;

    setTimeout(() => {

      this.filteredProducts = this.products.filter(

        p => p.category === menu

      );

      this.isLoading = false;

      this.cdr.detectChanges();

    }, 180);

  }

  // =====================================
  // GO TO DETAILS
  // =====================================

  goToDetails(productId: any) {

    if (productId) {

      this.router.navigate([

        '/product-details',

        productId

      ]);

    }

  }

  // =====================================
  // SHARE PRODUCT
  // =====================================

  shareProduct(event: Event, product: Product) {

    event.stopPropagation();

    const productUrl = `${window.location.origin}/product-details/${product.id}`;

    const shareData = {

      title: product.name,

      text: `Check out ${product.name} on Trunutriz!`,

      url: productUrl

    };

    if (navigator.share) {

      navigator.share(shareData)

        .then(() => console.log('Successful share'))

        .catch((error) => console.log('Error sharing', error));

    } else {

      // Fallback: Copy to clipboard

      const dummy = document.createElement('input');

      document.body.appendChild(dummy);

      dummy.value = productUrl;

      dummy.select();

      document.execCommand('copy');

      document.body.removeChild(dummy);

      this.showSuccessPopup('Link copied to clipboard!');

    }

  }

  // =====================================
  // CHECK CART
  // =====================================

  isInCart(product: Product): boolean {

    return !!this.cartService
      .getItems()
      .find(i => i.id === product.id);

  }

  // =====================================
  // GET QTY
  // =====================================

  getQty(product: Product): number {

    const item = this.cartService
      .getItems()
      .find(i => i.id === product.id);

    return item ? item.qty : 0;

  }

  // =====================================
  // ADD TO CART
  // =====================================

  addToCart(product: Product) {

    this.cartService.addToCart({

      ...product,

      qty: 1

    });

    this.showSuccessPopup(

      '🛒 ' +

      product.name +

      ' added successfully'

    );

    this.cdr.detectChanges();

  }

  // =====================================
  // INCREASE QTY
  // =====================================

  increaseQty(product: Product) {

    const item = this.cartService
      .getItems()
      .find(i => i.id === product.id);

    if (item) {

      this.cartService.increaseQty(item);

      this.cdr.detectChanges();

    }

  }

  // =====================================
  // DECREASE QTY
  // =====================================

  decreaseQty(product: Product) {

    const item = this.cartService
      .getItems()
      .find(i => i.id === product.id);

    if (item) {

      this.cartService.decreaseQty(item);

      this.cdr.detectChanges();

    }

  }

  // =====================================
  // DISCOUNT %
  // =====================================

  getDiscountPercentage(

    mrp: number,

    discount: number

  ): number {

    if (

      !mrp ||

      !discount ||

      mrp <= discount

    ) {

      return 0;

    }

    return Math.round(

      ((mrp - discount) / mrp) * 100

    );

  }

  // =====================================
  // CART COUNT
  // =====================================

  getCount() {

    return this.cartService.getCartCount();

  }

  

}