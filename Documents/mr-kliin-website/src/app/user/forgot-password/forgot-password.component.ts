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
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  //Variable declration
  loginForm: FormGroup;

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
      ]
    });
  }

  //form submit function
  onFormSubmit() {
    this.myapp.hideToastMsg();
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("username", this.email.value);
    this.api.callAPI(formData, "forgotPassword").subscribe(res => {
      if (res.status) {
        this.myapp.showSuccess(res.message);
        //Store the OTP in local storage
        this.myapp.spinner.hide();
        window.localStorage.setItem("resetOtp", res.data.otp);
        window.localStorage.setItem("resetUserId", res.data.user_id);

        this.router.navigate(["../reset-password"]);
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  //Getor - To access the fields directly in the form in HTML
  get email() {
    return this.loginForm.get("email");
  }
}
