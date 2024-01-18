import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-price-list",
  templateUrl: "./price-list.component.html",
  styleUrls: ["./price-list.component.css"]
})
export class PriceListComponent implements OnInit {
  services: any = [];
  otherServices: any = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public myapp: AppComponent,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;
    this.loadServices();
  }

  loadServices() {
    this.api.callAPI(null, "getAllServices").subscribe(res => {
      if (res.status === true) {
        this.services = res.data;

        for (let i = 0; i < this.services.length; i++) {
          if (this.services[i].service_type != "box") {
            this.otherServices.push(this.services[i]);
          }
        }
      }
    });
  }
}
