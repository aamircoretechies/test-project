import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-pickup-locations",
  templateUrl: "./pickup-locations.component.html",
  styleUrls: ["./pickup-locations.component.css"]
})
export class PickupLocationsComponent implements OnInit {
  //Variable declration
  contactForm: FormGroup;
  timing: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public myapp: AppComponent,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;

    //Access the Paramter from URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      let type = params.get("type");
      if (type) {
        console.log("type:", type);
        this.scroll(type);
      } else {
        window.scrollTo(0, 0);
      }
    });

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

    this.getPickupDropoffTiming();
  }

  scroll(type: string) {
    var elmnt = document.getElementById("pricing");
    elmnt.scrollIntoView();
  }

  getPickupDropoffTiming() {
    this.api.callAPI(null, "getPickupDropoffTiming").subscribe(res => {
      if (res.status) {
        this.timing = res.data;
      } else {
        this.timing = [];
      }
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
