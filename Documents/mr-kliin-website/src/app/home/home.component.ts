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

/*import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation
} from "ngx-gallery";*/

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  contactForm: FormGroup;
  services: any = [];
  bags: any = [];
  otherServices: any = [];
  panelOpenState = true;

  item1 = false;
  item1Errow = "arrow-down";

  item2 = false;
  item2Errow = "arrow-down";

  item3 = false;
  item3Errow = "arrow-down";

  //galleryOptions: NgxGalleryOptions[];
  //galleryImages: NgxGalleryImage[];

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

    this.loadServices();

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

  loadServices() {
    this.api.callAPI(null, "getAllServices").subscribe(res => {
      if (res.status === true) {
        //console.log("Services: ", res.data);
        this.services = res.data;
        if (this.services[0].items) this.bags = this.services[0].items;
        if (this.services[1]) this.otherServices = this.services[1];

        /*for (let i = 0; i < this.services.length; i++) {
          if (this.services[i].service_type != "box") {
            this.otherServices.push(this.services[i]);
          }
        }*/
        //console.log("Bags", this.bags);
        //console.log("otherServices", this.otherServices);
      }
    });

    /*this.galleryOptions = [
      {
        width: "600px",
        height: "400px",
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: "100%",
        height: "600px",
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = [
      {
        small: "assets/1-small.jpg",
        medium: "assets/1-medium.jpg",
        big: "assets/1-big.jpg"
      },
      {
        small: "assets/2-small.jpg",
        medium: "assets/2-medium.jpg",
        big: "assets/2-big.jpg"
      },
      {
        small: "assets/3-small.jpg",
        medium: "assets/3-medium.jpg",
        big: "assets/3-big.jpg"
      }
    ];*/
  }

  showHideItem1() {
    if (this.item1) {
      this.item1Errow = "arrow-down";
      this.item1 = false;
    } else {
      this.item1Errow = "arrow-up";
      this.item1 = true;
    }
  }

  showHideItem2() {
    if (this.item2) {
      this.item2Errow = "arrow-down";
      this.item2 = false;
    } else {
      this.item2Errow = "arrow-up";
      this.item2 = true;
    }
  }

  showHideItem3() {
    if (this.item3) {
      this.item3Errow = "arrow-down";
      this.item3 = false;
    } else {
      this.item3Errow = "arrow-up";
      this.item3 = true;
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
