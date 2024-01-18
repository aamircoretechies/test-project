import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ParamMap, ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.component.html",
  styleUrls: ["./order-detail.component.css"]
})
export class OrderDetailComponent implements OnInit {
  isUserLogin = false;
  orderData: any = [];
  user_id: any = 0;
  customer_id: any = 0;
  order_number: any = "";
  confirmOrder = false;
  editOrder = false;
  orderNumber: any = "";

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
    this.user_id = localStorage.getItem("webUserId");
    this.customer_id = localStorage.getItem("webCustomerId");

    //Access the Paramter from URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.order_number = params.get("order_number");
      let noti_id = params.get("noti_id");
      if (this.order_number) {
        this.getOrderDetail(this.user_id, this.order_number, noti_id);
      }
    });
  }

  getOrderDetail(user_id, order_number, noti_id) {
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("customer_id", this.customer_id);
    formData.append("order_number", order_number);
    formData.append("noti_id", noti_id);
    this.api.callAPI(formData, "getOrderDetail").subscribe(res => {
      if (res.status === true) {
        //console.log("Data: ", res.data);
        this.myapp.spinner.hide();
        this.orderData = res.data;

        //Update the notificaiton count
        window.localStorage.setItem(
          "userNotificationCount",
          res.data.notification_count
        );
        this.myapp.userNotificationCount = res.data.notification_count;
      } else {
        this.myapp.spinner.hide();
        this.orderData = [];
      }
    });
  }

  updateOrderStatus(order_id, status) {
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("customer_id", this.customer_id);
    formData.append("user_id", this.user_id);
    formData.append("order_id", order_id);
    formData.append("status", status);
    this.api.callAPI(formData, "updateOrderStatus").subscribe(res => {
      if (res.status === true) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        this.confirmOrder = false;
        this.ngOnInit();
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  showCancelConfirm() {
    this.confirmOrder = true;
  }

  hideModal() {
    this.confirmOrder = false;
    this.editOrder = false;
  }

  showEditConfirm(order_number) {
    this.editOrder = true;
    this.orderNumber = order_number;
  }
  /*editOrder(order_number) {
    this.router.navigate(["../order-start/" + order_number]);
  }*/
}
