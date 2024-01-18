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
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  //Variable declration
  signupForm: FormGroup;
  isPasswordMatch = false;
  inputType = "password";
  eyeIcon = "eyeon.png";

  inputType2 = "password";
  eyeIcon2 = "eyeon.png";

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
    //Form Model Declaration with form validation for the fields
    this.signupForm = this.fb.group({
      country_code: ["+34"],
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]*$/)
        ]
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8)
          //Validators.maxLength(20)
          //Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$")
        ]
      ],
      conf_pass: ["", [Validators.required]],
      postal_code: ["", [Validators.required]],
      privacy: ["", [Validators.required]]
    });
  }

  //form submit function
  onFormSubmit() {
    this.myapp.hideToastMsg();
    //console.log("Service Image:" + this.service_image.value);
    if (this.password.value != this.conf_pass.value) {
      this.isPasswordMatch = true;
      return false;
    }
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("name", this.name.value);
    formData.append("email", this.email.value);
    formData.append("password", this.password.value);
    formData.append("conf_pass", this.conf_pass.value);
    formData.append("country_code", this.country_code.value);
    formData.append("postal_code", this.postal_code.value);

    this.api.callAPI(formData, "signup").subscribe(res => {
      if (res.status) {
        this.myapp.showSuccess(res.message);
        //Store the OTP in local storage
        //window.localStorage.setItem("otp", res.otp);
        this.myapp.spinner.hide();
        window.localStorage.setItem("emailOtp", res.emailOtp);
        window.localStorage.setItem("registerUserId", res.user_id);

        this.router.navigate(["../otp-verification"]);
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  //Reset the Form via Cancel Button
  resetForm() {
    this.signupForm.reset();
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

  showHidePassword2() {
    if (this.inputType2 == "password") {
      this.inputType2 = "text";
      this.eyeIcon2 = "eyeoff.png";
    } else {
      this.inputType2 = "password";
      this.eyeIcon2 = "eyeon.png";
    }
  }

  //Getor - To access the fields directly in the form in HTML
  get country_code() {
    return this.signupForm.get("country_code");
  }
  get name() {
    return this.signupForm.get("name");
  }
  get email() {
    return this.signupForm.get("email");
  }
  get password() {
    return this.signupForm.get("password");
  }
  get conf_pass() {
    return this.signupForm.get("conf_pass");
  }
  get postal_code() {
    return this.signupForm.get("postal_code");
  }
  get privacy() {
    return this.signupForm.get("privacy");
  }
}
