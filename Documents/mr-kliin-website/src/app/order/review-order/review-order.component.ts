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
  selector: "app-review-order",
  templateUrl: "./review-order.component.html",
  styleUrls: ["./review-order.component.css"]
})
export class ReviewOrderComponent implements OnInit {
  couponForm: FormGroup;
  user_id: any = 0;
  customer_id: any = 0;
  cartData: any = [];

  //other variables
  userAddress: any = [];
  tax_rate: any = 0;
  cartItems: any = [];
  cartTotalAmt: any = 0;
  totalTaxAmt: any = 0;
  serviceChargeAmt: any = 0;
  discountAmount: any = 0;
  grandTotalAmt: any = 0;
  grandTotalAmtOriginal: any = 0;
  couponCode: any = "";
  orderItems: any = [];
  package_id: any = 0;
  packageAppliedItems: any = [];
  packageAppliedAmount: any = 0;
  confirmOrder = false;
  paymentMode = "";
  paymentModeError = false;
  editOrderNumber: any = "";

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

    //Redirect to order screen if cart is empty
    if (!localStorage.getItem("cartItems")) {
      this.router.navigate(["../order-start"]);
    }

    //Access the Paramter from URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.editOrderNumber = params.get("order_number");
    });

    //Form Model Declaration with form validation for the fields
    this.couponForm = this.fb.group({
      coupon_code: [""]
    });

    //Take the items only from the cart items array
    this.cartItems = JSON.parse(localStorage.getItem("cartItems"));
    for (var i = 0; i < this.cartItems.length; i++) {
      for (var j = 0; j < this.cartItems[i].items.length; j++) {
        this.orderItems.push(this.cartItems[i].items[j]);
      }
    }

    this.user_id = localStorage.getItem("webUserId");
    this.customer_id = localStorage.getItem("webCustomerId");
    this.loadCartOtherData(this.customer_id);
  }

  loadCartOtherData(id) {
    const formData = new FormData();
    formData.append("customer_id", id);
    formData.append("order_items", JSON.stringify(this.orderItems));
    this.api.callAPI(formData, "getCartOtherData").subscribe(res => {
      if (res.status === true) {
        this.cartData = res.data.other_data;

        this.tax_rate = res.data.tax_rate;
        this.package_id = 0; //res.data.package_id;
        this.packageAppliedItems = res.data.packageAppliedItems;
        this.packageAppliedAmount = parseFloat(res.data.packageAppliedAmount);
        this.grandTotalAmt = parseFloat(res.data.grandTotalAmt);
        this.grandTotalAmtOriginal = parseFloat(res.data.grandTotalAmt);
        this.cartTotalAmt = parseFloat(res.data.total_amount);
        this.totalTaxAmt = parseFloat(res.data.tax_amount);
        this.serviceChargeAmt = parseFloat(res.data.service_charge_amount);
      }
    });
  }

  //Function to check items in exist or not in the service in Cart
  checkServiceItemExist(i) {
    if (this.cartItems[i].items.length) return true;
    else return false;
  }

  showOrderConfirm() {
    if (this.paymentMode.length == 0) {
      this.paymentModeError = true;
      return false;
    } else {
      this.paymentModeError = false;
      this.confirmOrder = true;
    }
  }

  hideModal() {
    this.confirmOrder = false;
  }

  getPaymentMode(pm) {
    this.paymentMode = pm;
  }

  //Function to place order in DB
  placeOrder() {
    this.myapp.hideToastMsg();
    if (this.paymentMode == "") {
      this.paymentModeError = true;
      return false;
    }

    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("customer_id", this.customer_id);
    formData.append("user_id", this.user_id);
    formData.append("package_id", this.package_id);
    formData.append("items_json", JSON.stringify(this.orderItems));
    formData.append("total_amount", this.cartTotalAmt);
    formData.append("tax_amount", this.totalTaxAmt);
    formData.append("service_charge_amount", this.serviceChargeAmt);
    formData.append("grand_total", this.grandTotalAmt);
    formData.append("package_amount", this.packageAppliedAmount);
    formData.append("payment_mode", this.paymentMode);
    formData.append("pickup_time", this.cartData.pickup_time);
    formData.append("dropoff_time", this.cartData.dropoff_time);
    formData.append("discount_amount", this.discountAmount);
    formData.append("coupon_code", this.couponCode);
    formData.append("cart_items", JSON.stringify(this.cartItems));

    //Pass the order number, in case of edit
    if (this.editOrderNumber)
      formData.append("editOrderNumber", this.editOrderNumber);

    /*formData.append("pickup_date", this.cartData.pickup_date);
    formData.append("pickup_address_id", this.cartData.pickup_address_id);
    formData.append("dropoff_date", this.cartData.dropoff_date);
    formData.append("dropoff_time", this.cartData.dropoff_time);
    formData.append("dropoff_address_id", this.cartData.dropoff_address_id);
    formData.append("customer_note", this.cartData.customer_note);*/
    //formData.append("stripeToken", stripeToken);

    this.api.callAPI(formData, "createOrder").subscribe(res => {
      if (res.status === true) {
        this.myapp.spinner.hide();

        //clear items from session
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartCount");
        this.myapp.cartCount = 0;

        window.localStorage.setItem(
          "lastOrderPickupTime",
          this.cartData.pickup_date + ", " + this.cartData.pickup_time_message
        );
        this.router.navigate(["../thankyou"]);
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  //apply coupon cdoe form
  applyCouponCode() {
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("coupon_code", this.coupon_code.value);
    formData.append("user_id", this.user_id);
    formData.append("customer_id", this.customer_id);
    formData.append("grandTotalAmt", this.grandTotalAmtOriginal);

    this.api.callAPI(formData, "applyCouponCode").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);

        this.grandTotalAmt = res.data.grandTotalAmt;
        this.discountAmount = res.data.discountAmount;
        this.couponCode = this.coupon_code.value;
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  //Getor - To access the fields directly in the form in HTML
  get coupon_code() {
    return this.couponForm.get("coupon_code");
  }
}
