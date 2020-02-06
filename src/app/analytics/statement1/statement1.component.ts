import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { AuthService } from 'src/app/auth/auth.service';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartSelectEvent } from 'ng2-google-charts';


@Component({
  selector: 'app-statement1',
  templateUrl: './statement1.component.html',
  styleUrls: ['./statement1.component.css']
})
export class Statement1Component implements OnInit {
  academicYears: string[] = [];
  termnumbers: [] = [];
  attendance_details = [];
  public firstLevelChart: GoogleChartInterface;
  title: string;
  error_message: string
  error_flag = false
  chart_visibility = false;
  terms;
  selectedyear;
  user_info;
  showSpinner = false;
  placementOn = false;
  offers: any[] = [];
  termbool: boolean = false;
  cname: any = "";
  toattend: any = "";
  toclass: any = "";
  userRoles: string[] = [];
  faculty_names: any[] = [];
  dept_name:any = "";
  constructor(private analyticsService: AnalyticsService, private authService: AuthService) { }

  ngOnInit() {
    let u_info = localStorage.getItem('user');
    let u = JSON.parse(u_info);
    this.userRoles = u['roles'];
    console.log("Roles", this.userRoles);
    this.user_info = this.authService.getUserInfo()
    console.log("user", this.user_info)
    this.get_academic_years()
    this.get_term_numbers()
  }
  get_academic_years() {
    this.analyticsService.get_academic_years().subscribe(res => {
      this.academicYears = res['acdemicYear']
    })
  }

  get_term_numbers() {
    this.analyticsService.get_term_details().subscribe(res => {
      this.termnumbers = res['term_numbers']
    }
    )

  }



  searchbutton() {
    if (!this.placementOn) {
      this.getPlacementrDetails()
    }

    this.showSpinner = true;
    this.termbool = true;
    this.analyticsService.get_attendance_details(this.user_info['usn'], this.selectedyear, this.terms).subscribe(res => {
      this.attendance_details = res['attendance_percent']
      this.attendace_data(this.attendance_details)
    })

  }
  getPlacementrDetails() {
    this.placementOn = true;
    this.analyticsService.get_offer_by_usn(this.selectedyear, this.user_info['usn']).subscribe(res => {
      let re = res["offers"];
      for (let r of re) {
        this.offers.push([r['companyName'], r['salary']])
      }
    })
  }

  attendace_data(data) {
    let dataTable = []
    dataTable.push([
      "CourseCode",
      "Attendance %", { type: 'string', role: 'tooltip' }
    ]);

    for (let i = 0; i < data.length; i += 1) {
      dataTable.push([data[i]['courseCode'],
      data[i]['attendance_per'], "Attendance % : " + data[i]['attendance_per']])
    }

    if (dataTable.length > 1) {
      this.chart_visibility = true
      this.error_flag = false
      this.graph_data(dataTable)
    }
    else {
      this.showSpinner = false;
      this.error_flag = true
      this.error_message = "Data doesnot exist for the entered criteria"
    }
  }


  back_() {
    this.chart_visibility = false
  }


  graph_data(data) {
    this.showSpinner = false
    this.title = 'Course-wise Attendance %',
      this.firstLevelChart = {
        chartType: "ColumnChart",
        dataTable: data,
        options: {
          bar: { groupWidth: "20%" },
          vAxis: {
            title: "Percentage",
            viewWindow: {
              max:100,
              min:0
          }
          },
          height: 800,
          hAxis: {
            title: "Courses",
            titleTextStyle: {
            }
          },
          focusTarget: 'datum',
          chartArea: {
            left: 100,
            right: 100,
            top: 100,
          },
          legend: {
            position: "top",
            alignment: "end"
          },
          seriesType: "bars",
          colors: ["#789d96"],
          fontName: "Times New Roman",
          fontSize: 13,

        }

      }
  }
  second_level(event: ChartSelectEvent) {
    let subcode = event.selectedRowFormattedValues[0];
    this.analyticsService.get_attendence_by_course(subcode, this.user_info['usn']).subscribe(res => {
      let re = res["res"];
      this.cname = re[0]['courseName'];
      this.toattend = re[0]['presentCount'];
      this.toclass = re[0]['totalNumberOfClasses'];
    })
  }


  // HOD

  searchbutton1() {
    this.get_faculty_details();
  }
  get_faculty_details() {
    let us = localStorage.getItem('user');
    let u = JSON.parse(us);
    let arr = u['employeeGivenId'];
    let patt = new RegExp("[a-zA-z]*");
    let res = patt.exec(arr);
    this.dept_name =res[0];
    this.analyticsService.get_faculty_names(this.dept_name).subscribe(res => {
      let na = res['faculty'];
      for (let n of na) {
        this.faculty_names.push([n['name']])
      }
    })
  }
}


