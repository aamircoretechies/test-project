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
import { count } from "rxjs/operators";

@Component({
  selector: "app-pickup-dropoff",
  templateUrl: "./pickup-dropoff.component.html",
  styleUrls: ["./pickup-dropoff.component.css"]
})
export class PickupDropoffComponent implements OnInit {
  showPickupAddressForm = false;
  //showDropoffAddressForm = false;
  public addFormPickup: FormGroup;
  public addFormDropoff: FormGroup;
  public orderForm: FormGroup;
  user_id: any = 0;
  customer_id: any = 0;
  pickupAddress: any = [];
  dropoffAddress: any = [];

  tax_rate: any = 0;
  cartItems: any = [];
  cartTotalAmt: any = 0;
  totalTaxAmt: any = 0;
  grandTotalAmt: any = 0;
  orderItems: any = [];
  package_id: any = 0;
  packageAppliedItems: any = [];
  packageAppliedAmount: any = 0;
  showErrorModal = false;
  errorImage = "";
  errorMessage = "";

  todayDate = this.api.todayDate();
  //pickUpMaxDate = this.api.getDaysAfterDate(30);
  today = new Date();
  minDate = new Date(this.today);

  pickupDays: any = [];
  dropoffDays: any = [];
  holidays: any = [];
  pickupTiming: any = [
    {
      shift: "morning",
      time: "Morning 09:00-13:00"
    },
    {
      shift: "afternoon",
      time: "Afternoon 17:00-21:00"
    }
  ];
  dropoffTiming: any = [
    {
      shift: "morning",
      time: "Morning 09:00-13:00"
    },
    {
      shift: "afternoon",
      time: "Afternoon 17:00-21:00"
    }
  ];
  editOrderNumber: any = "";
  /*blockedDays = [
    new Date("2020-11-30T00:00:00+05:30"),
    new Date("2020-11-28T00:00:00+05:30"),
    new Date("2020-11-25T00:00:00+05:30"),
    new Date("2020-11-23T00:00:00+05:30")
  ];*/

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

    //Add tomorrow date for min date
    this.minDate.setDate(this.minDate.getDate() + 1);

    //Redirect to order screen if cart is empty
    if (!localStorage.getItem("cartItems")) {
      this.router.navigate(["../order-start"]);
    }

    //Access the Paramter from URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.editOrderNumber = params.get("order_number");
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
    this.getOrderPricing();
    this.loadCustomerAddresses(this.customer_id);
    //console.log("Items", this.orderItems);

    //Access the Paramter from URL
    /*this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      if (id) {
        this.customer_id = id;
        this.loadCustomerAddresses(id);
        this.getOrderPricing();
      }
    });*/

    //Form Model Declaration with form validation for the fields
    this.addFormPickup = this.fb.group({
      address_id: [""],
      customer_id: [this.customer_id],
      contact_person_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]*$/)
        ]
      ],
      mobile_number: [
        "",
        [
          Validators.required
          //alidators.minLength(8),
          //Validators.maxLength(10),
          //Validators.pattern("^[0-9()]+$")
        ]
      ],
      complete_address: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500)
        ]
      ],
      postal_code: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
      ],
      address_type: ["both", [Validators.required]]
    });

    /*this.addFormDropoff = this.fb.group({
      address_id_d: [""],
      customer_id_d: [this.customer_id],
      contact_person_name_d: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]*$/)
        ]
      ],
      mobile_number_d: [
        "",
        [
          Validators.required,
          //Validators.minLength(8),
          //Validators.maxLength(10),
          Validators.pattern("^[0-9()]+$")
        ]
      ],
      complete_address_d: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500)
        ]
      ],
      postal_code_d: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
      ],
      address_type_d: ["dropoff"]
    });*/

    this.orderForm = this.fb.group({
      customer_id: [this.customer_id],
      pickup_date: ["", [Validators.required]],
      pickup_time: ["", [Validators.required]],
      pickup_address_id: ["", [Validators.required]],
      dropoff_date: ["", [Validators.required]],
      dropoff_time: ["", [Validators.required]],
      dropoff_address_id: ["", [Validators.required]],
      //payment_mode: ["", [Validators.required]],
      customer_note: ["", [Validators.minLength(3), Validators.maxLength(500)]]
    });
  }

  loadCustomerAddresses(id) {
    const formData = new FormData();
    formData.append("customer_id", id);
    this.api.callAPI(formData, "getAllAddresses").subscribe(res => {
      if (res.status === true) {
        this.pickupAddress = res.data.pickup_address;
        this.dropoffAddress = res.data.dropoff_address;
        //console.log("Address", res.data);

        //Patch Addresses
        /*if (this.pickupAddress.length) {
          this.orderForm.patchValue({
            pickup_address_id: this.pickupAddress[0]["address_id"]
          });
        }
        if (this.dropoffAddress) {
          this.orderForm.patchValue({
            dropoff_address_id: this.dropoffAddress[0]["address_id"]
          });
        }*/
      }

      //To show Pickup/Dropoff Form directly
      /*if (!this.pickupAddress.length) {
        this.showPickupAddressForm = true;
      }
      if (!this.dropoffAddress.length) {
        this.showDropoffAddressForm = true;
      }*/
    });
  }

  //Function to get order item pricing
  getOrderPricing() {
    const formData = new FormData();
    formData.append("customer_id", this.customer_id);
    formData.append("order_items", JSON.stringify(this.orderItems));
    this.api.callAPI(formData, "getOrderItemsPrice").subscribe(res => {
      if (res.status === true) {
        //console.log("Data: ", res.data);
        this.tax_rate = res.data.tax_rate;
        this.grandTotalAmt = parseFloat(res.data.grandTotalAmt);
        this.cartTotalAmt = parseFloat(res.data.total_amount);
        this.totalTaxAmt = parseFloat(res.data.tax_amount);
      }
    });
  }

  loadCartOtherData(id) {
    const formData = new FormData();
    formData.append("customer_id", id);

    //In case of edit order, pass the order number to get its data
    if (this.editOrderNumber) {
      formData.append("editOrderNumber", this.editOrderNumber);
    }

    this.myapp.spinner.show();
    this.api.callAPI(formData, "getCartOtherData").subscribe(res => {
      if (res.status === true) {
        this.myapp.spinner.hide();
        if (res.data.other_data) {
          let od = res.data.other_data;
          //console.log("pickup_days", res.data.pickup_days);
          this.orderForm.patchValue({
            pickup_date: od.pickup_date_o,
            pickup_time: od.pickup_time_o,
            pickup_address_id: od.pickup_address_id,
            dropoff_date: od.dropoff_date_o,
            dropoff_time: od.dropoff_time_o,
            dropoff_address_id: od.dropoff_address_id,
            customer_note: od.customer_note
          });

          this.getTiming("", "pickup");
          this.getTiming("", "dropoff");
        }

        this.pickupDays = res.data.pickup_days;
        this.dropoffDays = res.data.dropoff_days;
        let leaves = res.data.holidays;
        for (let i = 0; i < leaves.length; i++) {
          this.holidays.push(new Date(leaves[i] + "T00:00:00+05:30"));
        }
        //console.log("pickupDays:", this.pickupDays);
      } else this.myapp.spinner.hide();

      //this.loadCustomerAddresses(this.customer_id);
    });
  }

  showPickupForm() {
    this.showPickupAddressForm = true;
  }

  hidePickupForm() {
    this.showPickupAddressForm = false;
    this.resetFormPickup();
  }

  hideErrorModal() {
    this.showErrorModal = false;
  }

  /*showDropoffForm() {
    this.showDropoffAddressForm = true;
  }*/

  /*hideDropoffForm() {
    this.showDropoffAddressForm = false;
    this.resetFormDropoff();
  }*/

  onAddressFormSubmitPickup() {
    this.myapp.hideToastMsg();
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("address_id", this.address_id.value);
    formData.append("contact_person_name", this.contact_person_name.value);
    formData.append("mobile_number", this.mobile_number.value);
    formData.append("postal_code", this.postal_code.value);
    formData.append("complete_address", this.complete_address.value);
    formData.append("address_type", this.address_type.value);
    formData.append("customer_id", this.customer_id);

    this.api.callAPI(formData, "addEditAddress").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        this.resetFormPickup();
        this.showPickupAddressForm = false;
        this.loadCustomerAddresses(this.customer_id);
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  /*onAddressFormSubmitDropoff() {
    this.myapp.hideToastMsg();
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("address_id", this.address_id_d.value);
    formData.append("customer_id", this.customer_id);
    formData.append("contact_person_name", this.contact_person_name_d.value);
    formData.append("mobile_number", this.mobile_number_d.value);
    formData.append("postal_code", this.postal_code_d.value);
    formData.append("address_type", this.address_type_d.value);
    formData.append("complete_address", this.complete_address_d.value);

    this.api.callAPI(formData, "addEditAddress").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        //this.resetFormDropoff();
        this.showDropoffAddressForm = false;
        this.loadCustomerAddresses(this.customer_id);
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }*/

  onOrderSubmit() {
    this.myapp.hideToastMsg();
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("customer_id", this.customer_id);
    /*formData.append(
      "pickup_date",
      new Date(this.pickup_date.value).toUTCString()
    );*/
    formData.append(
      "pickup_date",
      this.api.stringToDate(this.pickup_date.value)
    );
    formData.append("pickup_time", this.pickup_time.value);
    formData.append("pickup_address_id", this.pickup_address_id.value);
    /*formData.append(
      "dropoff_date",
      new Date(this.dropoff_date.value).toUTCString()
    );*/
    formData.append(
      "dropoff_date",
      this.api.stringToDate(this.dropoff_date.value)
    );
    formData.append("dropoff_time", this.dropoff_time.value);
    formData.append("dropoff_address_id", this.dropoff_address_id.value);
    formData.append("customer_note", this.customer_note.value);

    this.api.callAPI(formData, "addToCartOtherData").subscribe(res => {
      if (res.status === true) {
        this.myapp.spinner.hide();
        if (this.editOrderNumber)
          this.router.navigate(["../review-order/" + this.editOrderNumber]);
        else this.router.navigate(["../review-order"]);
      } else if (res.status == "backdate") {
        this.myapp.spinner.hide();
        this.showErrorModal = true;
        let lang = this.myapp.activeLang; //localStorage.getItem("lang");
        this.errorImage = "backday-error-" + lang + ".png";
        this.errorMessage = res.message;
      } else if (res.status == "minday") {
        this.myapp.spinner.hide();
        this.showErrorModal = true;
        let lang = this.myapp.activeLang; //localStorage.getItem("lang");
        this.errorImage = "minday-error-" + lang + ".png";
        this.errorMessage = res.message;
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  //Reset the Form via Cancel Button
  resetFormPickup() {
    this.addFormPickup.reset();
    this.addFormPickup.patchValue({
      address_id: "",
      customer_id: this.customer_id,
      contact_person_name: "",
      mobile_number: "",
      postal_code: "",
      complete_address: "",
      address_type: "both"
    });
  }

  //Reset the Form via Cancel Button
  /*resetFormDropoff() {
    this.addFormDropoff.reset();
    this.addFormDropoff.patchValue({
      address_id: "",
      customer_id: this.customer_id,
      contact_person_name: "",
      mobile_number: "",
      postal_code: "",
      complete_address: "",
      address_type: "dropoff"
    });
  }*/

  /*checkPickupAddress(index, id) {
    console.log("Pickup ID:" + this.pickup_address_id.value);
    if (this.pickup_address_id.value == id) return true;
    else if (index == 0) return true;
    else return false;
  }*/

  //https://stackblitz.com/edit/angular-datepicker-filter-so?file=app%2Fdatepicker-filter-example.ts
  //Function to disable the dates
  dropoffDateFilter = d => {
    const day = d.getDay();
    let result = true;
    for (let c = 0; c < this.dropoffDays.length; c++) {
      let val = this.dropoffDays[c];
      if (day == val) {
        result = false;
      }
    }

    //Disable holidays also
    const blockedDates = this.holidays.map(d => d.valueOf());
    if (blockedDates.includes(d.valueOf())) result = false;
    return result;
  };

  /*holidayFilter = d => {
    const blockedDates = this.holidays.map(d => d.valueOf());
    return !blockedDates.includes(d.valueOf());
  };*/

  pickupDateFilter = d => {
    //day = 0 means sunday and so on...
    const day = d.getDay();
    let result = true;
    for (let c = 0; c < this.pickupDays.length; c++) {
      let val = this.pickupDays[c];
      if (day == val) result = false;
    }
    //Disable holidays also
    const blockedDates = this.holidays.map(d => d.valueOf());
    if (blockedDates.includes(d.valueOf())) result = false;
    return result;
  };

  //Funciton to get timing of the day
  getTiming(event, type: any) {
    let date = "";
    if (type == "pickup") date = this.pickup_date.value;
    else date = this.dropoff_date.value;

    date = this.api.stringToDate(date); //new Date(date).toUTCString();
    const formData = new FormData();
    formData.append("date", date);
    this.myapp.spinner.show();
    this.api.callAPI(formData, "getDayTiming").subscribe(res => {
      if (res.status === true) {
        this.myapp.spinner.hide();
        if (type === "pickup") {
          this.pickupTiming = [];
          this.pickupTiming = res.data;
        } else {
          this.dropoffTiming = [];
          this.dropoffTiming = res.data;
        }
      } else this.myapp.spinner.hide();
    });
  }

  //Getor - To access the fields directly in the form in HTML
  get address_id() {
    return this.addFormPickup.get("address_id");
  }
  get customer_user_id() {
    return this.addFormPickup.get("customer_user_id");
  }
  get contact_person_name() {
    return this.addFormPickup.get("contact_person_name");
  }
  get mobile_number() {
    return this.addFormPickup.get("mobile_number");
  }
  get postal_code() {
    return this.addFormPickup.get("postal_code");
  }
  get complete_address() {
    return this.addFormPickup.get("complete_address");
  }
  get address_type() {
    return this.addFormPickup.get("address_type");
  }

  /*get address_id_d() {
    return this.addFormDropoff.get("address_id_d");
  }
  get customer_id_d() {
    return this.addFormDropoff.get("customer_id_d");
  }*/
  /*get contact_person_name_d() {
    return this.addFormDropoff.get("contact_person_name_d");
  }
  get mobile_number_d() {
    return this.addFormDropoff.get("mobile_number_d");
  }
  get postal_code_d() {
    return this.addFormDropoff.get("postal_code_d");
  }
  get complete_address_d() {
    return this.addFormDropoff.get("complete_address_d");
  }
  get address_type_d() {
    return this.addFormDropoff.get("address_type_d");
  }*/

  get pickup_date() {
    return this.orderForm.get("pickup_date");
  }
  get pickup_time() {
    return this.orderForm.get("pickup_time");
  }
  get pickup_address_id() {
    return this.orderForm.get("pickup_address_id");
  }
  get dropoff_date() {
    return this.orderForm.get("dropoff_date");
  }
  get dropoff_time() {
    return this.orderForm.get("dropoff_time");
  }
  get dropoff_address_id() {
    return this.orderForm.get("dropoff_address_id");
  }
  /*get payment_mode() {
    return this.orderForm.get("payment_mode");
  }*/
  get customer_note() {
    return this.orderForm.get("customer_note");
  }
}
