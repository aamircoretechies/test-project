import { Component, OnInit } from "@angular/core";
import { ApiService } from "../service/api.service";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-pricing",
  templateUrl: "./pricing.component.html",
  styleUrls: ["./pricing.component.css"]
})
export class PricingComponent implements OnInit {
  services: any = [];
  bags: any = [];
  otherServices: any = [];
  item1 = false;
  item1Errow = "arrow-down";

  item2 = false;
  item2Errow = "arrow-down";

  item3 = 0;
  item3Errow = "arrow-down";

  constructor(private api: ApiService, public myapp: AppComponent) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;
    this.loadServices();
  }

  loadServices() {
    this.api.callAPI(null, "getAllServices").subscribe(res => {
      if (res.status === true) {
        //console.log("Services: ", res.data);
        this.services = res.data;
        if (this.services[0].items) this.bags = this.services[0].items;

        for (let i = 0; i < this.services.length; i++) {
          if (this.services[i].service_type != "box") {
            this.otherServices.push(this.services[i]);
          }
        }
        //console.log("Bags", this.bags);
        //console.log("otherServices", this.otherServices);
      }
    });
  }

  showHideItem1() {
    if (this.item1) {
      this.item1Errow = "arrow-down";
      this.item1 = false;
    } else {
      this.item1Errow = "arrow-up";
      this.item1 = true;
    }
  }

  showHideItem2() {
    if (this.item2) {
      this.item2Errow = "arrow-down";
      this.item2 = false;
    } else {
      this.item2Errow = "arrow-up";
      this.item2 = true;
    }
  }

  showHideItem3(service_id) {
    if (service_id == this.item3) {
      this.item3 = 0;
    } else {
      this.item3 = service_id;
    }

    /*if (this.item3) {
      this.item3Errow = "arrow-down";
      this.item3 = false;
    } else {
      this.item3Errow = "arrow-up";
      this.item3 = true;
    }*/
  }
}
