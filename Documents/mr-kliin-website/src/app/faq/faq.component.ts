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
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"]
})
export class FaqComponent implements OnInit {
  //Variable declration
  contactForm: FormGroup;

  faq1 = false;
  faq1Errow = "arrow-down";

  faq2 = false;
  faq2Errow = "arrow-down";

  faq3 = false;
  faq3Errow = "arrow-down";

  faq4 = false;
  faq4Errow = "arrow-down";

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
    this.contactForm = this.fb.group({
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
      message: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500)
        ]
      ]
    });
  }

  showHideFaq1() {
    if (this.faq1) {
      this.faq1Errow = "arrow-down";
      this.faq1 = false;
    } else {
      this.faq1Errow = "arrow-up";
      this.faq1 = true;
    }
  }

  showHideFaq2() {
    if (this.faq2) {
      this.faq2Errow = "arrow-down";
      this.faq2 = false;
    } else {
      this.faq2Errow = "arrow-up";
      this.faq2 = true;
    }
  }

  showHideFaq3() {
    if (this.faq3) {
      this.faq3Errow = "arrow-down";
      this.faq3 = false;
    } else {
      this.faq3Errow = "arrow-up";
      this.faq3 = true;
    }
  }

  showHideFaq4() {
    if (this.faq4) {
      this.faq4Errow = "arrow-down";
      this.faq4 = false;
    } else {
      this.faq4Errow = "arrow-up";
      this.faq4 = true;
    }
  }

  //form submit function
  onContactSubmit() {
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("name", this.name.value);
    formData.append("email", this.email.value);
    formData.append("message", this.message.value);

    this.api.callAPI(formData, "submitContactEnquiry").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        this.resetForm();
      } else {
        this.myapp.showError(res.message);
      }
    });
  }

  //Reset the Form via Cancel Button
  resetForm() {
    this.contactForm.reset();
  }

  //Getor - To access the fields directly in the form in HTML
  get name() {
    return this.contactForm.get("name");
  }
  get email() {
    return this.contactForm.get("email");
  }
  get message() {
    return this.contactForm.get("message");
  }
}
