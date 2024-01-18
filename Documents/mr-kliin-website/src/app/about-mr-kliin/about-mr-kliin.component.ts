import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-about-mr-kliin",
  templateUrl: "./about-mr-kliin.component.html",
  styleUrls: ["./about-mr-kliin.component.css"]
})
export class AboutMrKliinComponent implements OnInit {
  constructor(public myapp: AppComponent) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;
  }
}
