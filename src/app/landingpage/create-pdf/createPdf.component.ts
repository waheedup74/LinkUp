import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'create-pdf',
  templateUrl: './createPdf.component.html',
  styleUrls: ['./createPdf.component.css'],
})
export class CreatePdfComponent implements OnInit {
  public pdfPages: Array<any> = [];
  public pdfSettings: any = {};
  public currentDate = '';

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('assets/config.json').subscribe({
      next: (response: any) => {
        if (response) {
          console.log(response)
          this.pdfPages = response.pdf_settings.pages;
          this.pdfSettings = {
            'firstPage': response.pdf_settings.first_page_image,
            'logo': response.pdf_settings.logo,
            'footer': response.pdf_settings.page_footer_image,
            'titleColor': response.pdf_settings.page_title_color,
          };
          this.calculateTimeStamp();
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  public exportToPDF() {
    this.calculateTimeStamp();

    let pdf = new jsPDF('l', 'px', 'a4', true);
    let width = pdf.internal.pageSize.getWidth();
    let height = pdf.internal.pageSize.getHeight();

    let totalPages = this.pdfPages.length;

    for (let page = 0; page < this.pdfPages.length; page++) {
      const htmlToConvert: HTMLElement = document.getElementById(('segment' + page)) as HTMLElement;

      if (htmlToConvert) {
        html2canvas(htmlToConvert)
          .then((canvas) => {
            canvas.getContext('2d');
            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            for (let i = 0; i < totalPages; i++) {
              pdf.addImage(
                imgData,
                'png',
                0,
                0,
                width,
                height
              );
            }

            if (page < this.pdfPages.length - 1) pdf.addPage();
          })
          .finally(() => {
            if (page === this.pdfPages.length - 1) pdf.save('test.pdf');
          });
      }
    }
  }


  private calculateTimeStamp() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    let convertedDay = '';
    let convertedMonth = '';

    if (dd < 10) convertedDay = '0' + dd;
    else convertedDay = dd.toString();

    if (mm < 10) convertedMonth = '0' + mm;
    else convertedMonth = mm.toString();

    this.currentDate = convertedDay + '-' + convertedMonth + '-' + yyyy;
  }
}