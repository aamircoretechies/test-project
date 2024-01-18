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
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  //Variable declration
  cpForm: FormGroup;
  isPasswordMatch = false;

  inputType = "password";
  eyeIcon = "eyeon.png";

  inputType2 = "password";
  eyeIcon2 = "eyeon.png";

  inputType3 = "password";
  eyeIcon3 = "eyeon.png";

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

    //Login Access Validation
    this.api.isUserLogin();

    //this.myapp.spinner.show();
    //Form Model Declaration with form validation for the fields
    this.cpForm = this.fb.group({
      user_id: [localStorage.getItem("webUserId")],
      old_pass: [
        "",
        [
          Validators.required,
          Validators.minLength(8)
          //Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$")
        ]
      ],
      new_pass: [
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

  //form submit function
  onFormSubmit() {
    if (this.new_pass.value != this.conf_pass.value) {
      this.isPasswordMatch = true;
      return false;
    }

    this.myapp.spinner.show();

    const formData = new FormData();
    formData.append("old_pass", this.old_pass.value);
    formData.append("new_pass", this.new_pass.value);
    formData.append("conf_pass", this.conf_pass.value);
    formData.append("user_id", localStorage.getItem("webUserId"));

    this.api.callAPI(formData, "changePassword").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);

        this.cpForm.reset();
        this.cpForm.patchValue({
          user_id: localStorage.getItem("webUserId")
        });
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

  showHidePassword3() {
    if (this.inputType3 == "password") {
      this.inputType3 = "text";
      this.eyeIcon3 = "eyeoff.png";
    } else {
      this.inputType3 = "password";
      this.eyeIcon3 = "eyeon.png";
    }
  }

  //Getor - To access the fields directly in the form in HTML
  get old_pass() {
    return this.cpForm.get("old_pass");
  }
  get new_pass() {
    return this.cpForm.get("new_pass");
  }
  get conf_pass() {
    return this.cpForm.get("conf_pass");
  }
}
