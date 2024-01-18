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
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  //Variable declration
  loginForm: FormGroup;
  showBtn = true;
  emailError = false;
  phoneError = false;
  loginWith: number = 1;
  inputType = "password";
  eyeIcon = "eyeon.png";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public myapp: AppComponent,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myapp.showMobileNav = false;
    this.myapp.showMobileNav = false;

    //REturn to my profile in case of already login
    if (window.localStorage.getItem("webUserLogin")) {
      this.router.navigate(["../my-profile"]);
      return;
    }

    //Form Model Declaration with form validation for the fields
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      password: ["", [Validators.required]]
    });
  }

  //form submit function
  onFormSubmit() {
    this.myapp.hideToastMsg();
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("username", this.email.value);
    formData.append("password", this.password.value);
    this.api.callAPI(formData, "login").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        //this.myapp.showSuccess(res.message);

        //Store the user data in local storage
        window.localStorage.setItem("webUserLogin", "1");
        window.localStorage.setItem("webUserId", res.data.user_id);
        window.localStorage.setItem("token", res.data.token);
        window.localStorage.setItem("webCustomerId", res.data.customer_id);
        window.localStorage.setItem("loginUserImage", res.data.profile_image);
        window.localStorage.setItem("loginUserName", res.data.first_name);
        window.localStorage.setItem(
          "userLoginAttempt",
          res.data.user_login_attempt
        );
        window.localStorage.setItem(
          "userNotificationCount",
          res.data.notification_count
        );
        this.myapp.loginUserImage = res.data.profile_image;
        this.myapp.userNotificationCount = res.data.notification_count;
        this.myapp.loginUserName = res.data.first_name;

        this.myapp.userMenu = true;
        this.myapp.showDropDownMenu = false;

        this.router.navigate(["../my-profile"]);
      } else {
        this.myapp.showError(res.message);
        this.myapp.spinner.hide();
      }
    });
  }

  //Reset the Form via Cancel Button
  resetForm() {
    this.loginForm.reset();
  }

  showHidePassword() {
    if (this.inputType == "password") {
      this.inputType = "text";
      this.eyeIcon = "eyeoff.png";
    } else {
      this.inputType = "password";
      this.eyeIcon = "eyeon.png";
    }
  }

  //Getor - To access the fields directly in the form in HTML
  get email() {
    return this.loginForm.get("email");
  }
  get password() {
    return this.loginForm.get("password");
  }
}
