import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';

import {
  CartService
} from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})

export class ProductDetails implements OnInit {

  product: any = null;
  isLoading: boolean = true;
  currentImgIndex: number = 0;
  activeTab: string = 'description';
  fillPercent = 60;
  showPopup = false;
  popupMessage = '';

  // Standard collection options to mirror mapCategory engine logic
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

  // API URL matching product source definitions
  apiUrl = 'https://script.google.com/macros/s/AKfycby6laCz5rL2JJ5nQU_sI8sB0jtamthvKtOZdL0sTcB0f2LksmUsOLhrpLKKvTW-BipvdQ/exec';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  // =====================================
  // INIT
  // =====================================
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.loadProduct(id);
    });
  }

  // =====================================
  // CATEGORY MAPPING ENGINE (Ported from list view)
  // =====================================
  mapCategory(apiGroup: any, apiName: any): string {
  const group = (apiGroup || '').toString().trim();
  const name = (apiName || '').toString().toLowerCase();
  const lowerGroup = group.toLowerCase();

  // =====================================
  // 1. COOKIES, BISCUITS & CRACKERS (Must be at the absolute top!)
  // =====================================
  if (
    lowerGroup.includes('cookie') ||
    lowerGroup.includes('cookies') ||
    lowerGroup.includes('biscuit') ||
    lowerGroup.includes('cracker') ||
    name.includes('cookie') ||
    name.includes('biscuit') ||
    name.includes('cracker')
  ) {
    return 'Cookies';
  }

  // =====================================
  // 2. OILS
  // =====================================
  if (lowerGroup.includes('oil') || name.includes('oil')) {
    return 'Wooden Cold Pressed Oils';
  }

  // =====================================
  // 3. DRYFRUITS, NUTS & SEEDS
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
  // 4. FLOURS & POWDER
  // =====================================
  if (
    lowerGroup.includes('flour') ||
    lowerGroup.includes('powder') ||
    name.includes('atta') ||
    name.includes('flour')
  ) {
    return 'Flours & Powder';
  }

  // =====================================
  // 5. MILLETS
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
  // 6. SALT
  // =====================================
  if (lowerGroup.includes('salt') || name.includes('salt')) {
    return 'Salt';
  }

  // =====================================
  // 7. SWEETENERS
  // =====================================
  if (
    lowerGroup.includes('sweet') ||
    name.includes('honey') ||
    name.includes('jaggery') ||
    name.includes('sugar') ||
    name.includes('candy')
  ) {
    return 'Sweetners';
  }

  // =====================================
  // 8. FALLBACK MATCHES
  // =====================================
  const matchedCategory = this.categories?.find(cat => lowerGroup === cat.toLowerCase());
  if (matchedCategory) {
    return matchedCategory;
  }

  return group.length > 0 ? group : 'Others';
}

  // =====================================
  // LOAD PRODUCT
  // =====================================
  loadProduct(id: string | null) {
    if (!id) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        let productsArray = Array.isArray(res) ? res : Object.values(res);

        const mappedProducts = productsArray.map((p: any) => {
          // Process mapped category explicitly using properties matching sheet outputs
          const computedCategory = this.mapCategory(
            p['Group Name'] || p.Group || p.Category || p.category || p.groupName,
            p.Name || p.name
          );

          return {
            ...p,
            id: Number(p.ID || p.id),
            Name: p.Name || p.name,          
            MRP: Number(p.MRP) || 0,         
            Discount: Number(p.Discount) || 0, 
            Images: this.getImages(p),       
            category: computedCategory // ✅ Exact match mapping
          };
        });

        this.product = mappedProducts.find(p => String(p.id) === String(id));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Fetch Error:', err);
        this.isLoading = false; 
      }
    });
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
  // CLEAN PRODUCT NAME
  // =====================================
  getCleanProductName(name: string): string {
    if (!name) {
      return '';
    }
    return name
      .replace(/\(.*?\)/g, '')
      .replace(/\d+\s?(gm|g|kg|ltr|litre|ml)/gi, '')
      .replace(/-/g, '')
      .trim();
  }

  // =====================================
  // EXTRACT WEIGHT
  // =====================================
  extractWeight(name: string): string {
    if (!name) {
      return '500 gm';
    }
    const match = name.match(/(\d+\s?(gm|g|kg|ltr|litre|ml))/i);
    return match ? match[0] : '500 gm';
  }

  // =====================================
  // PRODUCT INFO
  // =====================================
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

 getProductInfo() {

  const fullText = this.product?.Description || '';

  const sections = {
    description: 'Information not available.',
    uniqueness: 'Information not available.',
    benefits: 'Information not available.'
  };

  // DESCRIPTION
  if (fullText.includes('Description :')) {

    const descPart = fullText.split('Description :')[1];

    // UNIQUENESS
    if (descPart.includes('Uniqueness :')) {

      const uniqueSplit = descPart.split('Uniqueness :');

      sections.description = uniqueSplit[0].trim();

      // BENEFITS
      if (uniqueSplit[1].includes('Health Benefits :')) {

        const benefitSplit = uniqueSplit[1].split('Health Benefits :');

        sections.uniqueness = benefitSplit[0].trim();
        sections.benefits = benefitSplit[1].trim();

      } else {

        sections.uniqueness = uniqueSplit[1].trim();
      }

    } else {

      sections.description = descPart.trim();
    }
  }

  return sections;
}
  // =====================================
  // IMAGE NAVIGATION
  // =====================================
  nextImg() {
    if (this.product?.Images?.length > 1) {
      this.currentImgIndex = (this.currentImgIndex + 1) % this.product.Images.length;
    }
  }

  prevImg() {
    if (this.product?.Images?.length > 1) {
      this.currentImgIndex = (this.currentImgIndex - 1 + this.product.Images.length) % this.product.Images.length;
    }
  }

  setMainImage(i: number) {
    this.currentImgIndex = i;
  }

  // =====================================
  // GET IMAGES
  // =====================================
  getImages(p: any): string[] {
    if (Array.isArray(p.Images)) return p.Images;
    if (Array.isArray(p.images)) return p.images;
    
    const rawImages = p.Images || p.images || p.Image || p.image;
    
    if (typeof rawImages === 'string' && rawImages.length > 0) {
      return rawImages.split(',').map((s: any) => s.trim());
    }
    return [rawImages || 'https://via.placeholder.com/500'];
  }

  // =====================================
  // FORMAT PRICE
  // =====================================
  formatPrice(val: number) {
    return val ? val.toLocaleString('en-IN') : '0';
  }

  // =====================================
  // DISCOUNT %
  // =====================================
  getDiscountPercentage(mrp: number, price: number): number {
    if (!mrp || !price || mrp <= price) {
      return 0;
    }
    return Math.round(((mrp - price) / mrp) * 100);
  }

  // =====================================
  // ADD TO CART
  // =====================================
  addToCart(product: any) {
    const mrp = Number(product.MRP || 0);
    const discountPrice = Number(product.Discount || mrp);

    const cartItem = {
      ...product,
      id: product.id,
      name: product.Name,
      mrp: mrp,
      discountPrice: discountPrice,
      discount: discountPrice,
      price: mrp,
      image: (product.Images && product.Images.length > 0) ? product.Images[0] : 'assets/img/placeholder.png'
    };

    this.cartService.addToCart({
      ...cartItem,
      qty: 1
    });

    this.showSuccessPopup(
      '🛒 ' + (this.getCleanProductName(cartItem.name) || cartItem.name) + ' added successfully'
    );
    this.cdr.detectChanges();
  }

  // =====================================
  // SHARE PRODUCT
  // =====================================
  shareProduct(product: any) {
    const shareData = {
      title: product.Name || product.name,
      text: `Check out ${product.Name || product.name} on Trunutriz!`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: Copy to clipboard
      const dummy = document.createElement('input');
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      
      this.showSuccessPopup('Link copied to clipboard!');
    }
  }

  showSuccessPopup(message: string) {
    this.popupMessage = message;
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
      this.cdr.detectChanges();
    }, 2200);
  }

  // =====================================
  // CHECK OIL PRODUCT
  // =====================================
  isOilProduct(): boolean {
    if (!this.product?.Name) {
      return false;
    }
    const name = this.product.Name.toLowerCase();
    return (
      name.includes('oil') ||
      name.includes('mustard') ||
      name.includes('olive') ||
      name.includes('sunflower') ||
      name.includes('coconut')
    );
  }
}