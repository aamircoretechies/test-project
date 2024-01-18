import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import { AppComponent } from "src/app/app.component";
import {
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-manage-addresses",
  templateUrl: "./manage-addresses.component.html",
  styleUrls: ["./manage-addresses.component.css"]
})
export class ManageAddressesComponent implements OnInit {
  public addForm: FormGroup;
  addAddress = false;
  user_id: any = 0;
  customer_id: any = 0;
  address: any = [];
  popupHeading = "Add new address";
  addEdit = true;

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

    this.user_id = localStorage.getItem("webUserId");
    this.customer_id = localStorage.getItem("webCustomerId");
    this.getUserAddress();

    //Form Model Declaration with form validation for the fields
    this.addForm = this.fb.group({
      address_id: [""],
      customer_id: [this.customer_id],
      contact_person_name: [
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
      complete_address: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500)
        ]
      ],
      postal_code: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
      ],
      address_type: ["both", [Validators.required]]
    });
  }

  //Get user address from DB
  getUserAddress() {
    const formData = new FormData();
    formData.append("user_id", this.user_id);
    formData.append("customer_id", this.customer_id);
    this.api.callAPI(formData, "getAllAddresses").subscribe(res => {
      if (res.status === true) {
        //console.log("Address: ", res.data.all_address);
        this.address = res.data.all_address;
      } else {
        this.address = [];
      }
    });
  }

  onAddressFormSubmit() {
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("address_id", this.address_id.value);
    formData.append("contact_person_name", this.contact_person_name.value);
    formData.append("mobile_number", this.mobile_number.value);
    formData.append("postal_code", this.postal_code.value);
    formData.append("complete_address", this.complete_address.value);
    formData.append("address_type", this.address_type.value);
    formData.append("customer_id", this.customer_id);

    this.api.callAPI(formData, "addEditAddress").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        this.resetForm();
        this.addAddress = false;
        this.getUserAddress();
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.messag);
      }
    });
  }

  //Reset the Form via Cancel Button
  resetForm() {
    this.addForm.reset();
    this.addForm.patchValue({
      address_id: "",
      customer_id: this.customer_id,
      contact_person_name: "",
      mobile_number: "",
      postal_code: "",
      complete_address: "",
      address_type: "both"
    });
  }

  editAddress(index) {
    this.popupHeading = "Edit Address";
    this.addEdit = false;
    this.addForm.patchValue({
      address_id: this.address[index].address_id,
      customer_id: this.customer_id,
      contact_person_name: this.address[index].contact_person_name,
      mobile_number: this.address[index].mobile_number,
      postal_code: this.address[index].pin_code,
      complete_address: this.address[index].complete_address,
      address_type: this.address[index].address_type
    });
    this.addAddress = true;
  }

  deleteAddress(address_id, index) {
    let conf = confirm("Do you want to delete this address?");
    if (conf) {
      this.myapp.spinner.show();
      const formData = new FormData();
      formData.append("address_id", address_id);
      this.api.callAPI(formData, "deleteAddress").subscribe(res => {
        if (res.status) {
          this.myapp.spinner.hide();
          this.myapp.showSuccess(res.message);
          this.address.splice(index, 1);
        } else {
          this.myapp.spinner.hide();
          this.myapp.showError(res.message);
        }
      });
    }
  }

  showHideAddressForm() {
    this.popupHeading = "Add new address";
    this.addEdit = true;
    if (this.addAddress) {
      this.addAddress = false;
      this.resetForm();
    } else this.addAddress = true;
  }

  onFormSubmit() {
    this.myapp.spinner.show();
    const formData = new FormData();
    formData.append("address_id", this.address_id.value);
    formData.append("contact_person_name", this.contact_person_name.value);
    formData.append("mobile_number", this.mobile_number.value);
    formData.append("postal_code", this.postal_code.value);
    formData.append("complete_address", this.complete_address.value);
    formData.append("address_type", this.address_type.value);
    formData.append("customer_id", this.customer_id);

    this.api.callAPI(formData, "addEditAddress").subscribe(res => {
      if (res.status) {
        this.myapp.spinner.hide();
        this.myapp.showSuccess(res.message);
        this.resetForm();
        this.addAddress = false;
        this.getUserAddress();
      } else {
        this.myapp.spinner.hide();
        this.myapp.showError(res.message);
      }
    });
  }

  //Getor - To access the fields directly in the form in HTML
  get address_id() {
    return this.addForm.get("address_id");
  }
  get contact_person_name() {
    return this.addForm.get("contact_person_name");
  }
  get mobile_number() {
    return this.addForm.get("mobile_number");
  }
  get postal_code() {
    return this.addForm.get("postal_code");
  }
  get complete_address() {
    return this.addForm.get("complete_address");
  }
  get address_type() {
    return this.addForm.get("address_type");
  }
}
