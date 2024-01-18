import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-my-orders",
  templateUrl: "./my-orders.component.html",
  styleUrls: ["./my-orders.component.css"]
})
export class MyOrdersComponent implements OnInit {
  filterForm: FormGroup;
  isUserLogin = false;
  orders: any = [];
  user_id: any = 0;
  customer_id: any = 0;
  showLoader = false;
  orderStatus: any = 1;
  months: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public myapp: AppComponent,
    private route: ActivatedRoute,
    public api: ApiService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;

    //Login Access Validation
    this.isUserLogin = this.api.isUserLogin();

    //Define the Filter Form Model
    this.filterForm = this.fb.group({
      order_date: [""],
      month: [""],
      order_status: [""]
    });

    this.user_id = localStorage.getItem("webUserId");
    this.customer_id = localStorage.getItem("webCustomerId");
    this.getMyOrders(this.user_id, this.customer_id);
  }

  getMyOrders(user_id, customer_id) {
    //this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("customer_id", customer_id);
    formData.append("order_status", this.filterForm.get("order_status").value);
    formData.append("month", this.filterForm.get("month").value);
    //formData.append("order_date", this.filterForm.get("order_date").value);
    this.api.callAPI(formData, "getAllOrders").subscribe(res => {
      if (res.status === true) {
        //console.log("months: ", res.months);
        this.myapp.spinner.hide();
        this.orders = res.data;
        this.months = res.months;
      } else {
        this.myapp.spinner.hide();
        this.orders = [];
        this.months = res.months;
      }
    });
  }

  //function to filter orders
  /*loadOrders(order_status) {
    this.orderStatus = order_status;
    this.getMyOrders(this.user_id, this.customer_id, this.orderStatus);
    return false;
  }*/

  //On date filter
  filterOrders() {
    this.getMyOrders(this.user_id, this.customer_id);
  }
}
