import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AppComponent } from "src/app/app.component";
@Component({
  selector: "app-terms",
  templateUrl: "./terms.component.html",
  styleUrls: ["./terms.component.css"]
})
export class TermsComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public myapp: AppComponent
  ) {}

  ngOnInit() {
    //window.scrollTo(0, 0);
    this.myapp.showDropDownMenu = false;
    this.myapp.showMobileNav = false;

    //Access the Paramter from URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      let type = params.get("type");
      if (type) {
        console.log("Param:", type);
        this.scroll(type);
      } else window.scrollTo(0, 0);
    });
  }

  scroll(type: string) {
    //console.log("param type:" + type);
    if (type == "services") {
      if (this.myapp.activeLang == "en")
        var elmnt = document.getElementById("services");
      else var elmnt = document.getElementById("services-es");
    } else if (type == "cancellation") {
      if (this.myapp.activeLang == "en")
        var elmnt = document.getElementById("cancellation");
      else var elmnt = document.getElementById("cancellation-es");
    }

    elmnt.scrollIntoView();
  }
}
