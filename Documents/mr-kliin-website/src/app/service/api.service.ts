import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, tap, map, retry } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  /*===API URLs===*/
  /*public baseUrl = "http://localhost/work/CT/mr-kliin-api/api/website/";
  public mediaUrl = "http://localhost/work/CT/mr-kliin-api/uploads/";
  public siteUrl = "http://localhost:4200/";
  public apiUrl = "http://localhost/work/CT/mr-kliin-api/";*/

  /*====Development Server URLs====*/
  /*public baseUrl = "http://ctportfolio.in/mr-kliin-api/api/website/";
  public mediaUrl = "http://ctportfolio.in/mr-kliin-api/uploads/";
  public siteUrl = "http://ctportfolio.in/mrkliin-website/";
  public apiUrl = "http://ctportfolio.in/mr-kliin-api/";*/

  /*====Live Server URLs====*/
  public baseUrl = "https://mrkliin.com/mr-kliin-api/api/website/";
  public mediaUrl = "https://mrkliin.com/mr-kliin-api/uploads/";
  public siteUrl = "https://mrkliin.com/";
  public apiUrl = "https://mrkliin.com/mr-kliin-api/";

  constructor(private router: Router, private http: HttpClient) {}

  //API calling function
  callAPI(data, apiFunction) {
    let url: string = this.baseUrl + apiFunction;
    return this.http.post<any>(url, data).pipe(catchError(this.errorHandler));
  }

  //function to check User is logged in or NOT
  isUserLogin() {
    if (!window.localStorage.getItem("webUserLogin")) {
      this.router.navigate(["../login"]);
      return;
    } else return true;
  }

  // function to Validate User Routes
  isUserRoute() {
    if (window.localStorage.getItem("role_id") != "1") {
      this.router.navigate(["/admin-dashboard"]);
      return;
    }
  }

  //User Profile Pic Path
  userProfilePic() {
    return this.mediaUrl + "customer/";
  }

  //Service Pic Path
  serviceImgPath() {
    return this.mediaUrl + "services/";
  }

  //Banner Pic Path
  bannerImgPath() {
    return this.mediaUrl + "banners/";
  }

  //Package Pic Path
  packageImgPath() {
    return this.mediaUrl + "packages/";
  }

  //Error Handler Method calling from all the services
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  //Convert time from 24 hr to AM-PM
  convertTime(timeString) {
    let H = +timeString.substr(0, 2);
    let h = H % 12 || 12;
    let ampm = H < 12 || H === 24 ? " AM" : " PM";
    return (timeString = h + timeString.substr(2, 3) + ampm);
  }

  //Function to convert API Date in DateTime Formate
  convertToDateTime(data, option) {
    if (data == "" || data == undefined || data == "") {
      return "";
    }
    let dateArray = data.split(" ");
    let dt = dateArray[0].split("-");
    let onlyDate = dt[2] + "-" + dt[1] + "-" + dt[0];
    if (option == "date") {
      return onlyDate;
    } else {
      return onlyDate + ", " + this.convertTime(dateArray[1]);
    }
  }

  stringToDate(str) {
    if (str == "" || str == undefined || str == "") {
      return "";
    }
    let date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  timeWithoutSeconds(str) {
    if (str != null && str != "") {
      let timeArray = str.split(":");
      return (timeArray[0] + ":" + timeArray[1]).toString();
    } else return "";
  }

  timevalidation(str) {
    //var startValue = new Date();
    console.log("str" + str);
    let startValue = str.split(":");
    return (startValue[0] + ":" + startValue[1]).toString();
  }

  todayDate() {
    let date = new Date(),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  getDaysAfterDate(no: any) {
    var date = new Date();
    var newdate = new Date(new Date().getTime() + no * 24 * 60 * 60 * 1000);

    //newdate.setDate(newdate.getDate() + no);

    var dd = "" + newdate.getDate();
    var mm = "" + (newdate.getMonth() + 1);
    var y = newdate.getFullYear();

    if (dd.length < 2) dd = "0" + dd;
    if (mm.length < 2) mm = "0" + mm;

    //console.log("MM" + mm.length);

    var someFormattedDate = y + "-" + mm + "-" + dd; //mm + "/" + dd + "/" + y;
    return someFormattedDate;
  }
}
