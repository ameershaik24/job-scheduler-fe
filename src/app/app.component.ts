import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { JobsService } from './jobs.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title = 'mainapplication-fe';

    jobsList: any[];
    currentJobId: string;

    modalRef: BsModalRef;
    addJobForm: FormGroup;

    active = 1;

    constructor(private modalService:BsModalService, private jobsService:JobsService, public fb: FormBuilder, private toastr:ToastrService) {
        this.addJobForm = this.fb.group({
            name: "",
            notifications: this.fb.group({
                phones: "",
                emails: "user1@example.com"
            }),
            request_details: this.fb.group({
                url: "",
                method: "GET"
            }),
            request_interval_seconds: "60 seconds",
            tolerated_failures:"alertPreference1"
        })
    }

    ngOnInit() {
        this.getJobsList();
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-xl'});
    }

    getJobsList():void {
        this.jobsService.getJobsList()
        .then((response) => {
            this.jobsList = response;
        });
    }

    pauseJob(jobId, isPaused): void {
        this.currentJobId = jobId;

        this.jobsService.pauseJob(jobId, isPaused)
        .then((response) => {
            this.toastr.info(response.msg, "Success");
            this.getJobsList();
        })
        .catch((err) => {
            this.toastr.error(err, 'Error Occured');
        });
    }

    duplicateJob(jobId): void {
        this.currentJobId = jobId;
    }

    deleteJob(jobId): void {
        this.jobsService.deleteJob(jobId)
        .then((response) => {
            this.toastr.info(JSON.parse(response).msg, "Success");
            this.getJobsList();
        })
        .catch((err) => {
            this.toastr.error(JSON.parse(err.error).msg, 'Error Occured');
        });
    }

    addJob() : void {
        var formData: any = new FormData();

        formData.append("name", this.addJobForm.get('name').value);

        var notifications_values = {
            "phones":(<FormGroup>this.addJobForm.controls['notifications']).controls['phones'].value,
            "emails":(<FormGroup>this.addJobForm.controls['notifications']).controls['emails'].value
        };
        formData.append("notifications", JSON.stringify(notifications_values));

        var request_details_values = {
            "url":(<FormGroup>this.addJobForm.controls['request_details']).controls['url'].value,
            "method":(<FormGroup>this.addJobForm.controls['request_details']).controls['method'].value
        };
        formData.append("request_details", JSON.stringify(request_details_values));

        formData.append("request_interval_seconds", this.addJobForm.get('request_interval_seconds').value);
        formData.append("tolerated_failures", this.addJobForm.get('tolerated_failures').value);

        this.jobsService.addJob(formData)
        .then((response) => {
            this.toastr.success(response, "Success");
            this.modalRef.hide();
            this.getJobsList();
        })
        .catch((err) => {
            this.toastr.error(JSON.parse(err.error).msg, 'Error Occured');
            });
    }

    filterRows() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}
