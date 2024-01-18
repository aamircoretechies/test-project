import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "./service/api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  activeLang = "en";
  contactEmail: any = "";
  contactPhone: any = "";
  services: any = [];
  postalCodes: any = [];
  playStoreLink: any = "https://play.google.com/store";
  appleStoreLink: any = "https://www.apple.com/uk/shop";
  facebookLink: any = "https://www.facebook.com";
  twitterLink: any = "https://twitter.com";
  linkedinLink: any = "https://www.linkedin.com";
  userMenu = false;
  showDropDownMenu = false;
  loginUserImage: any = "";
  loginUserName: any = "";
  userNotificationCount: any = 0;
  cartCount: any = 0;
  showMenuToSMUser = true;
  errorMsg: any = "";
  successMsg: any = "";
  showErrorMsg = false;
  showSuccessMsg = false;
  showMobileNav = false;
  orderPages = false;
  routeName = "";

  constructor(
    public router: Router,
    private api: ApiService,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    location: Location
  ) {
    translate.addLangs(["en", "es"]);
    translate.setDefaultLang("en");

    router.events.subscribe(val => {
      if (location.path() != "") {
        this.routeName = location.path();
      } else {
        this.routeName = "Home";
      }
      //console.log("RouteName:", this.routeName);

      if (
        this.routeName.includes("order-start") ||
        this.routeName.includes("pickup-dropoff") ||
        this.routeName.includes("review-order") ||
        this.routeName.includes("thankyou")
      ) {
        this.orderPages = true;
      } else this.orderPages = false;
    });
  }

  ngOnInit() {
    if (window.localStorage.getItem("lang")) {
      let lang = window.localStorage.getItem("lang");
      this.translate.use(lang);
      this.activeLang = lang;
    } else {
      this.translate.use("en");
      window.localStorage.setItem("lang", "en");
      this.activeLang = window.localStorage.getItem("lang");
    }

    //Hide toast message after 10 seconds
    /*setInterval(() => {
      this.hideToastMsg();
    }, 10000);*/

    //if user is logged in, the Login/REgister menu should be hidden
    if (window.localStorage.getItem("webUserLogin")) {
      this.userMenu = true;
      this.showDropDownMenu = false;
      this.loginUserImage = window.localStorage.getItem("loginUserImage");
      this.loginUserName = window.localStorage.getItem("loginUserName");
      this.userNotificationCount = window.localStorage.getItem(
        "userNotificationCount"
      );
    }

    //if cart is set then set the count
    if (window.localStorage.getItem("cartCount")) {
      this.cartCount = window.localStorage.getItem("cartCount");
    }

    //Hide the menus for social media users
    /*if (window.localStorage.getItem("loginPlatform")) {
      this.showMenuToSMUser = false;
    }*/
  }

  ngAfterViewInit() {
    this.loadCommonData();
  }

  loadCommonData() {
    this.api.callAPI(null, "getCommonData").subscribe(res => {
      if (res.status === true) {
        this.contactEmail = res.data.settings.contact_email;
        this.contactPhone = res.data.settings.contact_phone;
        this.postalCodes = res.data.postal_codes;
      }
    });
  }

  switchLang(lang: string) {
    //console.log("Change lang to: " + lang);
    //console.log("Last lang:" + this.translate.currentLang);
    //console.log("current lang:" + this.translate.currentLang);
    this.translate.use(lang);
    this.activeLang = lang;
    window.localStorage.setItem("lang", lang);
    return false;
  }

  //Toast Messages
  showSuccess(msg) {
    //this.toastr.success(msg, "Success!");
    this.successMsg = msg;
    this.showSuccessMsg = true;
  }
  showError(msg) {
    //this.toastr.error(msg, "Oops!");
    this.errorMsg = msg;
    this.showErrorMsg = true;
  }
  showWarning(msg) {
    //this.toastr.warning(msg, "Sorry!");
  }

  hideToastMsg() {
    this.showSuccessMsg = false;
    this.showErrorMsg = false;
    this.errorMsg = "";
    this.successMsg = "";
    return false;
  }

  hideOpenMenus() {
    this.showDropDownMenu = false;
    this.showMobileNav = false;
  }

  /*loadCommonData() {
    this.api.callAPI(null, "getCommonData").subscribe((res) => {
      if (res.status === true) {
        //console.log("Data: ", res.data);
        this.contactEmail = settings.contact_email;
        this.contactPhone = settings.contact_phone;
        this.services = res.data.services;
      }
    });
  }*/

  // TODO: Cross browsing
  /*gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }*/
}
