import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { HomeComponent } from "./home/home.component";
import { HowItWorksComponent } from "./how-it-works/how-it-works.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PickupLocationsComponent } from "./pickup-locations/pickup-locations.component";
import { FaqComponent } from "./faq/faq.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { AboutMrKliinComponent } from "./about-mr-kliin/about-mr-kliin.component";
import { TermsComponent } from "./terms/terms.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { LoginComponent } from "./user/login/login.component";
import { SignupComponent } from "./user/signup/signup.component";
import { OtpVerificationComponent } from "./user/otp-verification/otp-verification.component";
import { MyProfileComponent } from "./user/my-profile/my-profile.component";
import { ResetPasswordComponent } from "./user/reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./user/forgot-password/forgot-password.component";
import { OrderStartComponent } from "./order/order-start/order-start.component";
import { PickupDropoffComponent } from "./order/pickup-dropoff/pickup-dropoff.component";
import { ReviewOrderComponent } from "./order/review-order/review-order.component";
import { ThankyouComponent } from "./order/thankyou/thankyou.component";
import { ChangePasswordComponent } from "./user/change-password/change-password.component";
import { NotificationsComponent } from "./user/notifications/notifications.component";
import { MyOrdersComponent } from "./user/my-orders/my-orders.component";
import { OrderDetailComponent } from "./user/order-detail/order-detail.component";
import { ManageAddressesComponent } from "./user/manage-addresses/manage-addresses.component";
import { PriceListComponent } from "./price-list/price-list.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: { title: "Welcome to MrKliin" }
  },
  {
    path: "about-mr-kliin",
    component: AboutMrKliinComponent,
    data: { title: "About Mr Kliin | MrKliin" }
  },
  {
    path: "how-it-works",
    component: HowItWorksComponent,
    data: { title: "How it Works | MrKliin" }
  },
  {
    path: "pricing",
    component: PricingComponent,
    data: { title: "Pricing | MrKliin" }
  },
  {
    path: "pickup-locations",
    component: PickupLocationsComponent,
    data: { title: "Pickup Locations | MrKliin" }
  },
  {
    path: "pickup-locations/:type",
    component: PickupLocationsComponent,
    data: { title: "Pickup Locations | MrKliin" }
  },
  {
    path: "faq",
    component: FaqComponent,
    data: { title: "FAQ | MrKliin" }
  },
  {
    path: "contact-us",
    component: ContactUsComponent,
    data: { title: "Contact Us | MrKliin" }
  },
  {
    path: "terms",
    component: TermsComponent,
    data: { title: "Terms and Conditions | MrKliin" }
  },
  {
    path: "terms/:type",
    component: TermsComponent,
    data: { title: "Terms and Conditions | MrKliin" }
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
    data: { title: "Privacy Policy | MrKliin" }
  },
  {
    path: "login",
    component: LoginComponent,
    data: { title: "Login | MrKliin" }
  },
  {
    path: "signup",
    component: SignupComponent,
    data: { title: "Signup | MrKliin" }
  },
  {
    path: "otp-verification",
    component: OtpVerificationComponent,
    data: { title: "OTP Verification | MrKliin" }
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    data: { title: "Forgot Password | MrKliin" }
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    data: { title: "Reset Password | MrKliin" }
  },
  {
    path: "my-profile",
    component: MyProfileComponent,
    data: { title: "My Profile | MrKliin" }
  },
  {
    path: "manage-addresses",
    component: ManageAddressesComponent,
    data: { title: "Manage Addresses | MrKliin" }
  },
  {
    path: "my-orders",
    component: MyOrdersComponent,
    data: { title: "My Orders | MrKliin" }
  },
  {
    path: "order-detail/:order_number",
    component: OrderDetailComponent,
    data: { title: "Order Detail | Fluff n Fold" }
  },
  {
    path: "order-detail/:order_number/:noti_id",
    component: OrderDetailComponent,
    data: { title: "Order Detail | Fluff n Fold" }
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    data: { title: "Change Password | MrKliin" }
  },
  {
    path: "notifications",
    component: NotificationsComponent,
    data: { title: "Notifications | MrKliin" }
  },
  {
    path: "order-start",
    component: OrderStartComponent,
    data: { title: "Order | MrKliin" }
  },
  {
    path: "order-start/:order_number",
    component: OrderStartComponent,
    data: { title: "Order | MrKliin" }
  },
  {
    path: "pickup-dropoff",
    component: PickupDropoffComponent,
    data: { title: "Schedule your order | MrKliin" }
  },
  {
    path: "pickup-dropoff/:order_number",
    component: PickupDropoffComponent,
    data: { title: "Schedule your order | MrKliin" }
  },
  {
    path: "review-order",
    component: ReviewOrderComponent,
    data: { title: "Review your order | MrKliin" }
  },
  {
    path: "review-order/:order_number",
    component: ReviewOrderComponent,
    data: { title: "Review your order | MrKliin" }
  },
  {
    path: "thankyou",
    component: ThankyouComponent,
    data: { title: "Thankyou | MrKliin" }
  },
  {
    path: "price-list",
    component: PriceListComponent,
    data: { title: "Price List | MrKliin" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
