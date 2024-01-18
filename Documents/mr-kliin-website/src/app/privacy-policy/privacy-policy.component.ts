import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.component.html",
  styleUrls: ["./privacy-policy.component.css"]
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(public myapp: AppComponent) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;
  }
}
