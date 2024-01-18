import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatExpansionModule
} from "@angular/material";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";

import { NgOtpInputModule } from "ng-otp-input";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { ImageCropperModule } from "ngx-image-cropper";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgImageSliderModule } from "ng-image-slider";

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
import { CustomDatePicker } from "./custom-date-picker";
import { PriceListComponent } from "./price-list/price-list.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HowItWorksComponent,
    PricingComponent,
    PickupLocationsComponent,
    FaqComponent,
    ContactUsComponent,
    AboutMrKliinComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    LoginComponent,
    SignupComponent,
    OtpVerificationComponent,
    MyProfileComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    OrderStartComponent,
    PickupDropoffComponent,
    ReviewOrderComponent,
    ThankyouComponent,
    ChangePasswordComponent,
    NotificationsComponent,
    MyOrdersComponent,
    OrderDetailComponent,
    ManageAddressesComponent,
    PriceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatExpansionModule,
    HttpClientModule,
    NgxSpinnerModule,
    ImageCropperModule,
    ToastrModule.forRoot(),
    NgOtpInputModule,
    NgImageSliderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  //providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
  providers: [
    { provide: DateAdapter, useClass: CustomDatePicker } //useValue: "es-ES"
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale("en-en");
  }
}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
