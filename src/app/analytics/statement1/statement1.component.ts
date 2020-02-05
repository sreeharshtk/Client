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
  placementOn =false;
  offers:any[] = [];

  constructor(private analyticsService: AnalyticsService, private authService: AuthService) { }

  ngOnInit() {
    this.user_info = this.authService.getUserInfo()
    console.log("user",this.user_info)
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
    if (!this.placementOn){
      this.getPlacementrDetails()
    }
    this.showSpinner = true;
    this.analyticsService.get_attendance_details(this.user_info['usn'], this.selectedyear, this.terms).subscribe(res => {
      this.attendance_details = res['attendance_percent']
      this.attendace_data(this.attendance_details)
    })
    
  }
  getPlacementrDetails(){
    this.placementOn = true;
    this.analyticsService.get_offer_by_usn(this.selectedyear,this.user_info['usn']).subscribe(res =>{
      let re = res["offers"];
        for(let r of re)
        {
          this.offers.push([r['companyName'],r['salary']])
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
       data[i]['attendance_per'],"Attendance % : " + data[i]['attendance_per']])
    }

    if (dataTable.length > 1) {
      this.chart_visibility = true
      this.error_flag = false
      this.graph_data(dataTable)
    }
    else {
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
          },

          height: 800,
          hAxis: {
            title: "Courses",
            titleTextStyle: {
            }
          },
          chartArea: {
            left: 80,
            right: 100,
            top: 100,
          },
          legend: {
            position: "top",
            alignment: "end"
          },
          seriesType: "bars",
          colors: [ "#789d96"],
          fontName: "Times New Roman",
          fontSize: 13,

        }

      }
  }
  second_level(event: ChartSelectEvent) {
    console.log("Chart Event", event)
  }


}
