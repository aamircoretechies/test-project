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
  selector: "app-otp-verification",
  templateUrl: "./otp-verification.component.html",
  styleUrls: ["./otp-verification.component.css"]
})
export class OtpVerificationComponent implements OnInit {
  //Variable declration
  otpForm: FormGroup;
  isPasswordMatch = false;
  otp = localStorage.getItem("otp");

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
      /*width: "60px",
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
    if (!localStorage.getItem("registerUserId")) {
      this.router.navigate(["/"]);
    }

    //Form Model Declaration with form validation for the fields
    this.otpForm = this.fb.group({
      /*otp1: ["", [Validators.required]],
      otp2: ["", [Validators.required]],
      otp3: ["", [Validators.required]],
      otp4: ["", [Validators.required]]*/
    });
  }

  //OTP methods start
  onOtpChange(otp) {
    this.inputOtp = otp;
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
    //console.log("INput OPT:" + this.ngOtpInput.length);
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

    //this.otp1.value + this.otp2.value + this.otp3.value + this.otp4.value;
    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("user_id", localStorage.getItem("registerUserId"));

    this.myapp.spinner.show();
    this.api.callAPI(formData, "verifyRegisterOtp").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        localStorage.clear(); //Clear the variables of local storage
        this.router.navigate(["/login"]);
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  //resent OTP function
  resendRegisterOtp() {
    this.myapp.hideToastMsg();
    this.otpError = false;
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("registerUserId"));

    this.api.callAPI(formData, "resendRegisterOtp").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        this.otp = res.data.emailOtp;
        //this.showBtn = true;
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
        //this.showBtn = true;
      }
    });
    return false;
  }
}
