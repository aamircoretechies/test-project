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
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css"]
})
export class MyProfileComponent implements OnInit {
  profileForm: FormGroup;
  isUserLogin = false;
  profile: any = [];
  user_id: any = 0;
  customer_id: any = 0;
  user_login_attempt: any = 0;
  showLoader = false;
  editUser = false;

  imgPreviewPath = null;
  FileErrorMessageLog = false;
  imageChangedEvent: any = "";
  imageSave = false;
  imageHide = false;

  //Slider
  showSlider = true;
  sliderImages: any = [];

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
    this.isUserLogin = this.api.isUserLogin();

    if (this.myapp.activeLang == "en") {
      this.sliderImages = [
        {
          image: "assets/images/popups/11.png",
          thumbImage: "assets/images/popups/11.png"
        },
        {
          image: "assets/images/popups/22.png",
          thumbImage: "assets/images/popups/22.png"
        },
        {
          image: "assets/images/popups/33.png",
          thumbImage: "assets/images/popups/33.png"
        },
        {
          image: "assets/images/popups/44.png",
          thumbImage: "assets/images/popups/44.png"
        },
        {
          image: "assets/images/popups/55.png",
          thumbImage: "assets/images/popups/55.png"
        }
      ];
    } else {
      this.sliderImages = [
        {
          image: "assets/images/popups/11-spanish.png",
          thumbImage: "assets/images/popups/11-spanish.png"
        },
        {
          image: "assets/images/popups/22-spanish.png",
          thumbImage: "assets/images/popups/22-spanish.png"
        },
        {
          image: "assets/images/popups/33-spanish.png",
          thumbImage: "assets/images/popups/33-spanish.png"
        },
        {
          image: "assets/images/popups/44-spanish.png",
          thumbImage: "assets/images/popups/44-spanish.png"
        },
        {
          image: "assets/images/popups/55-spanish.png",
          thumbImage: "assets/images/popups/55-spanish.png"
        }
      ];
    }

    this.user_id = localStorage.getItem("webUserId");
    this.customer_id = localStorage.getItem("webCustomerId");
    this.user_login_attempt = localStorage.getItem("userLoginAttempt");
    this.getUserProfile(this.user_id, this.customer_id);

    //Form Model Declaration with form validation for the fields
    this.profileForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]*$/)
        ]
      ],
      mobile_number: [
        "",
        [
          Validators.required
          //Validators.minLength(8),
          //Validators.maxLength(10),
          //Validators.pattern("^[0-9()]+$")
        ]
      ],

      email: [""],
      gender: ["", [Validators.required]],
      profile_image: [""],
      postal_code: ["", [Validators.required]]
    });
  }

  getUserProfile(user_id, customer_id) {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("customer_id", customer_id);
    this.api.callAPI(formData, "getMyProfile").subscribe(res => {
      if (res.status === true) {
        //console.log("Data: ", res.data);
        this.profile = res.data;
        this.imgPreviewPath = this.profile.profile_image;

        //Patch the Item data in profileForm
        this.profileForm.patchValue({
          name: res.data.first_name,
          email: res.data.email,
          profile_image: res.data.profile_image,
          postal_code: res.data.postal_code,
          gender: res.data.gender,
          country_code: res.data.country_code,
          mobile_number: res.data.phone_number
        });
      }
    });
  }

  showHideEdit(type) {
    if (type == "show") this.editUser = true;
    else this.editUser = false;
  }

  //on File select, put the selected file in Form model variable
  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // console.log("files" + files);
      var fileMimes = file.type.split("/");
      var fileType = fileMimes[0];
      if (fileType === "image") {
        this.imageHide = true;
        this.imageSave = true;

        this.profileForm.get("profile_image").setValue(file);
        this.imageChangedEvent = event;
        this.FileErrorMessageLog = false;
        //Preveiw of the image only on images
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = _event => {
          this.imgPreviewPath = reader.result;
        };
        return;
      } else {
        this.FileErrorMessageLog = true;
      }
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log("Cropping: " + JSON.stringify(event));
    this.imgPreviewPath = event.base64;
    this.profileForm.get("profile_image").setValue(event.base64);
  }

  saveCropImg() {
    this.imageSave = false;
  }

  cancelImageUpload() {
    this.imageSave = false;
  }

  //Function to upload image on mobile layout
  uploadCropImg() {
    this.onFormSubmit();
  }

  //form submit function
  onFormSubmit() {
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("profile_image", this.profile_image.value);
    formData.append("name", this.name.value);
    formData.append("mobile_number", this.mobile_number.value);
    formData.append("postal_code", this.postal_code.value);
    formData.append("gender", this.gender.value);
    formData.append("user_id", this.user_id);
    formData.append("customer_id", this.customer_id);

    this.api.callAPI(formData, "updateMyProfile").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);

        window.localStorage.setItem("loginUserName", this.name.value);
        this.myapp.loginUserName = this.name.value;

        //Replace the new image in storage
        if (res.profile_image) {
          window.localStorage.setItem("loginUserImage", res.profile_image);
          this.myapp.loginUserImage = res.profile_image;
          this.profile.profile_image = res.profile_image;
        }

        this.getUserProfile(this.user_id, this.customer_id);
        this.editUser = false;
        this.imageSave = false;
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  hideSliderPopup() {
    this.showSlider = false;
    window.localStorage.setItem(
      "userLoginAttempt",
      this.profile.user_login_attempt
    );
  }

  //Getor - To access the fields directly in the form in HTML
  get profile_image() {
    return this.profileForm.get("profile_image");
  }
  get email() {
    return this.profileForm.get("email");
  }
  get name() {
    return this.profileForm.get("name");
  }
  get gender() {
    return this.profileForm.get("gender");
  }
  get country_code() {
    return this.profileForm.get("country_code");
  }
  get mobile_number() {
    return this.profileForm.get("mobile_number");
  }
  get postal_code() {
    return this.profileForm.get("postal_code");
  }
}
