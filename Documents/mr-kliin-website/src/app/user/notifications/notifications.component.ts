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
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {
  isUserLogin = false;
  notifications: any = [];
  user_id: any = 0;
  customer_id: any = 0;

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
    this.getUserNotifications(this.user_id, this.customer_id);
  }

  getUserNotifications(user_id, customer_id) {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("customer_id", customer_id);
    this.api.callAPI(formData, "getNotifications").subscribe(res => {
      if (res.status === true) {
        this.notifications = res.data;
        console.log("noti", this.notifications);
      }
    });
  }
}
