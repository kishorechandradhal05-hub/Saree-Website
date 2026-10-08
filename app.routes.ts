import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { CartComponent } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';
import { Account } from './pages/account/account';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Contact } from './pages/contact/contact';
import { Payment } from './pages/payment/payment';
import { About } from './pages/about/about';
import { Profile } from './pages/profile/profile';
import { Address } from './pages/address/address';
import { Cancellation } from './pages/cancellation/cancellation';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { Terms } from './pages/terms/terms';
import { Faq } from './pages/faq/faq';
import { ProductDetails } from './pages/product-details/product-details';
import { OrderHistory } from './pages/order-history/order-history';
import { ProfileInformation } from './pages/profile-information/profile-information';
import { ForgotPassword } from './pages/forgot-password/forgot-password'; // ✅ added

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'product-details/:id', component: ProductDetails },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: Orders },
  { path: 'payment', component: Payment },
  { path: 'account', component: Account },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // ✅ NEW ROUTE
  { path: 'forgot-password', component: ForgotPassword },

  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: 'profile', component: Profile },
  { path: 'profile-information', component: ProfileInformation },
  { path: 'address', component: Address },
  { path: 'cancellation', component: Cancellation },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'terms', component: Terms },
  { path: 'faq', component: Faq },
  { path: 'order-history', component: OrderHistory },
  { path: '**', redirectTo: '' }
];