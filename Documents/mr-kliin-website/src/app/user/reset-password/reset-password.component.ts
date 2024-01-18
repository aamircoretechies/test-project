import { Component, OnInit, ViewChild } from "@angular/core";
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
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  otpForm: FormGroup;
  showBtn = true;
  isPasswordMatch = false;

  inputType = "password";
  eyeIcon = "eyeon.png";

  inputType2 = "password";
  eyeIcon2 = "eyeon.png";

  otpError = false;
  inputOtp: any = "";
  showOtpComponent = true;
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  otpConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      /*width: "84px",
      height: "40px"*/
    }
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public myapp: AppComponent,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    //If user tries to access without register
    if (!localStorage.getItem("resetUserId")) {
      this.router.navigate(["../forgot-password"]);
    }

    //Form Model Declaration with form validation for the fields
    this.otpForm = this.fb.group({
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8)
          //Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$")
        ]
      ],
      conf_pass: ["", [Validators.required]]
    });
  }

  //OTP methods start
  onOtpChange(otp) {
    this.inputOtp = otp;
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.inputOtp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }
  //OTP methods end

  //form submit function
  onFormSubmit() {
    this.myapp.hideToastMsg();
    this.otpError = false;
    let otp = this.inputOtp;
    if (otp.length != 4) {
      this.otpError = true;
      return false;
    }

    if (this.password.value != this.conf_pass.value) {
      this.isPasswordMatch = true;
      return false;
    }

    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("user_id", localStorage.getItem("resetUserId"));
    formData.append("new_pass", this.password.value);

    this.api.callAPI(formData, "resetPassword").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        localStorage.clear();
        this.router.navigate(["../login"]);
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
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
  get password() {
    return this.otpForm.get("password");
  }
  get conf_pass() {
    return this.otpForm.get("conf_pass");
  }
}
