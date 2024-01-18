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
  selector: "app-order-start",
  templateUrl: "./order-start.component.html",
  styleUrls: ["./order-start.component.css"]
})
export class OrderStartComponent implements OnInit {
  isUserLogin = false;
  services: any = [];
  bags: any = [];
  otherServices: any = [];
  user_id: any = 0;
  customer_id: any = 0;
  active_tab: any = 0;
  cartItems: any = new Array();
  cartTotalAmt: number = 0;
  activeTabIndex = null;
  validOrderAmt = true;
  showSummary = false;
  order_number: any = ""; //used in case of edit

  showWashFold = true;
  washFoldArrow = "arrow-down";
  routeName = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public myapp: AppComponent,
    public route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    //localStorage.removeItem("cartItems");
    //localStorage.removeItem("cartCount");
    //localStorage.clear();
    window.scrollTo(0, 0);
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;

    //Login Access Validation
    this.isUserLogin = this.api.isUserLogin();
    this.user_id = localStorage.getItem("webUserId");
    this.customer_id = localStorage.getItem("webCustomerId");

    this.loadServices();

    //Access the Paramter from URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.order_number = params.get("order_number");
      if (this.order_number) {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartCount");
        this.myapp.cartCount = 0;
        this.getOrderDetail(this.user_id, this.order_number);
      }
    });
  }

  loadServices() {
    this.api.callAPI(null, "getAllServices").subscribe(res => {
      if (res.status === true) {
        this.services = res.data;
        //console.log("Services", this.services);
        if (this.services[0].items) {
          this.bags = this.services[0].items;
        }

        for (let i = 0; i < this.services.length; i++) {
          if (this.services[i].service_type != "box") {
            this.otherServices.push(this.services[i]);
          }
        }

        if (!localStorage.getItem("cartItems")) {
          for (let i = 0; i < this.services.length; i++) {
            let obj = {
              serviceName: this.services[i].service_name,
              serviceNameSpanish: this.services[i].service_name_spanish,
              items: []
            };
            this.cartItems.push(obj);
          }
        }
      }
    });

    //Assign session cart data into variable
    if (localStorage.getItem("cartItems")) {
      this.cartItems = [];
      let items = JSON.parse(localStorage.getItem("cartItems"));
      this.cartItems = items;
      this.calculateCartTotal();
    }
  }

  //Load order detail in case of edit
  getOrderDetail(user_id, order_number) {
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("customer_id", this.customer_id);
    formData.append("order_number", order_number);
    this.api.callAPI(formData, "getOrderDetail").subscribe(res => {
      if (res.status === true) {
        this.myapp.spinner.hide();
        this.cartItems = JSON.parse(res.data.cart_json_data);
        this.calculateCartTotal();

        /*let od = res.data;
        for (let i = 0; i < od.order_items.length; i++) {
          let cartData = {
            itemId: od.order_items[i].service_item_id,
            itemName: od.order_items[i].service_item_name,
            itemNameSpanish: od.order_items[i].service_item_name_spanish,
            price: od.order_items[i].unit_price,
            qty: 1
          };
        }*/
      } else {
        this.myapp.spinner.hide();
      }
    });
  }

  //Function to Increase qty of Item in Cart
  increaseQty(si: any, ii: any) {
    let serviceName = this.services[si].service_name;
    let serviceNameSpanish = this.services[si].service_name_spanish;
    let serviceId = this.services[si].service_id;
    let itemId = this.services[si].items[ii].item_id;
    let itemName = this.services[si].items[ii].item_name;
    let itemNameSpanish = this.services[si].items[ii].item_name_spanish;
    let price = this.services[si].items[ii].price;

    let cartData = {
      itemId: itemId,
      itemName: itemName,
      itemNameSpanish: itemNameSpanish,
      price: price,
      qty: 1
    };

    let index = -1;
    //First search itemId is exit or not in the CART
    for (var i = 0; i < this.cartItems.length; i++) {
      for (var j = 0; j < this.cartItems[i].items.length; j++) {
        if (this.cartItems[i]["items"][j].itemId === itemId) {
          index = j;
          break;
        }
      }
    }

    if (index < 0) {
      this.cartItems[si]["items"].push(cartData); //Insert the Items in Cart
    } else {
      //Update the Items in Cart
      this.cartItems[si]["items"][index].qty++;
      this.cartItems[si]["items"][index].price =
        price * this.cartItems[si]["items"][index].qty;
    }
    this.calculateCartTotal();
    //console.log("Cart items", this.cartItems);
  }

  //Function to Decrease qty of Item in Cart
  decreaseQty(si: any, ii: any) {
    //let serviceName = this.services[si].service_name;
    //let serviceId = this.services[si].service_id;
    let itemId = this.services[si].items[ii].item_id;
    //let itemName = this.services[si].items[ii].item_name;
    let price = this.services[si].items[ii].price;

    let index = -1;
    //First search itemId is exit or not in the CART
    for (var i = 0; i < this.cartItems.length; i++) {
      for (var j = 0; j < this.cartItems[i].items.length; j++) {
        if (this.cartItems[i]["items"][j].itemId === itemId) {
          index = j;
          break;
        }
      }
    }

    if (index >= 0) {
      //Update the Items in Cart
      this.cartItems[si]["items"][index].qty--;
      this.cartItems[si]["items"][index].price =
        price * this.cartItems[si]["items"][index].qty;

      //If qty reaches to 0, then remove the item from cart
      if (this.cartItems[si]["items"][index].qty == 0)
        this.cartItems[si]["items"].splice(index, 1);
    }
    this.calculateCartTotal();
  }

  //Function to display value in qty textbox
  getQuantity(si: any, ii: any, item_id: any) {
    let qty = "0";
    //First search itemId is exit or not in the CART
    for (var i = 0; i < this.cartItems.length; i++) {
      for (var j = 0; j < this.cartItems[i].items.length; j++) {
        if (this.cartItems[i]["items"][j].itemId === item_id) {
          qty = this.cartItems[si]["items"][j].qty;
          break;
        }
      }
    }

    return qty;
  }

  //Function to check items in exist or not in the service in Cart
  checkServiceItemExist(i) {
    //First search itemId is exit or not in the CART
    if (this.cartItems[i].items.length) return true;
    else return false;
  }

  //Function to calculate cart total
  calculateCartTotal() {
    let totalAmt: any = 0;
    let totalCartItems: any = 0;
    //First search itemId is exit or not in the CART
    for (var i = 0; i < this.cartItems.length; i++) {
      for (var j = 0; j < this.cartItems[i].items.length; j++) {
        let total = parseFloat(this.cartItems[i]["items"][j].price);
        totalAmt = totalAmt + total;

        totalCartItems = totalCartItems + this.cartItems[i]["items"][j].qty;
      }
    }
    this.cartTotalAmt = totalAmt; //toFixed(2);

    //store the cart items in session
    window.localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
    window.localStorage.setItem("cartCount", totalCartItems);
    this.myapp.cartCount = totalCartItems;
  }

  //Function to redirect next page
  redirectToNextPage() {
    if (this.cartTotalAmt < 30) {
      this.validOrderAmt = false;
      return false;
    } else {
      this.validOrderAmt = true;
      //If order is editing, then pass order number with param
      if (this.order_number)
        this.router.navigate(["../pickup-dropoff/" + this.order_number]);
      else this.router.navigate(["../pickup-dropoff"]);

      return false;
    }
  }

  showHideWashFold() {
    if (this.showWashFold) {
      this.washFoldArrow = "arrow-down";
      this.showWashFold = false;
    } else {
      this.washFoldArrow = "arrow-up";
      this.showWashFold = true;
    }
    this.activeTabIndex = null; //hide the item boxes
  }

  showHideItems(index) {
    if (this.activeTabIndex == index) {
      this.activeTabIndex = null;
    } else {
      this.activeTabIndex = index;
    }

    //hide the wash & fold box
    this.washFoldArrow = "arrow-down";
    this.showWashFold = false;
  }

  showHideSummary() {
    if (this.showSummary) {
      this.showSummary = false;
    } else {
      this.showSummary = true;
    }
  }
  removeItemFromCart(ci, ii) {
    this.cartItems[ci]["items"].splice(ii, 1);
    this.calculateCartTotal();
  }

  clearCart() {
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartCount");
    this.services = [];
    this.bags = [];
    this.otherServices = [];
    this.active_tab = 0;
    this.cartItems = [];
    this.cartTotalAmt = 0;
    this.validOrderAmt = true;
    this.myapp.cartCount = 0;

    this.ngOnInit();
    return false;
  }

  cancelEdit() {
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartCount");
    this.myapp.cartCount = 0;
    this.router.navigate(["../order-detail/" + this.order_number]);
  }
}
