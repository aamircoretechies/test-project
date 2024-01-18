import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  userMenu = false;
  constructor(
    public myapp: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {}

  /*switchLang(lang: string) {
    this.translate.use(lang);
  }*/

  showHideUserMenu() {
    if (this.userMenu) this.userMenu = false;
    else this.userMenu = true;
  }

  showHideUserDropDown() {
    this.myapp.showMobileNav = false;
    if (this.myapp.showDropDownMenu) this.myapp.showDropDownMenu = false;
    else this.myapp.showDropDownMenu = true;
  }

  openMobileMenu() {
    this.myapp.showDropDownMenu = false;
    if (this.myapp.showMobileNav) this.myapp.showMobileNav = false;
    else this.myapp.showMobileNav = true;
  }

  // Function to logout user
  logout() {
    //First clear cart other data from DB
    const formData = new FormData();
    formData.append("customer_id", localStorage.getItem("webCustomerId"));
    this.api.callAPI(formData, "clearCartData").subscribe(res => {
      if (res.status === true) {
      }
    });

    //Destory the local storage
    localStorage.clear();
    this.myapp.userMenu = false;
    this.myapp.showDropDownMenu = false;
    this.myapp.showMenuToSMUser = true;
    this.myapp.cartCount = 0;
    this.router.navigate(["/"]);

    window.localStorage.setItem("lang", this.myapp.activeLang);
    return false;
  }
}
