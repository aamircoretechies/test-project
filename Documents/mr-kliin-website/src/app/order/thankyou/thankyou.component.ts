import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-thankyou",
  templateUrl: "./thankyou.component.html",
  styleUrls: ["./thankyou.component.css"]
})
export class ThankyouComponent implements OnInit {
  isUserLogin = false;
  pickupMsg: any = localStorage.getItem("lastOrderPickupTime");
  constructor(public myapp: AppComponent, private api: ApiService) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;
    //Login Access Validation
    this.isUserLogin = this.api.isUserLogin();
  }
}
