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
  selector: "app-how-it-works",
  templateUrl: "./how-it-works.component.html",
  styleUrls: ["./how-it-works.component.css"]
})
export class HowItWorksComponent implements OnInit {
  //Variable declration
  contactForm: FormGroup;

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
