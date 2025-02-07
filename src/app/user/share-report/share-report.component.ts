import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CopyleaksService,
  ScanSource,
  CompleteResult,
  ScanResult,
} from '@copyleaks/plagiarism-report';
import { environment } from 'src/environments/environment';
import { interval, Subscription, of, Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-share-report',
  templateUrl: './share-report.component.html',
  styleUrls: ['./share-report.component.css']
})
export class ShareReportComponent implements OnInit {
  baseUrl: string = environment.production;
  private pollingSubscription: Subscription | undefined;
  scanDataId:any= ''
  showConfig:any=false
  constructor(
    private reportService: CopyleaksService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap,"this.route.snapshot.paramMap")
    const scanId = this.route.snapshot.paramMap.get('id');
    const userId = this.route.snapshot.paramMap.get('userId')
     this.scanDataId=scanId
    // Initial load and start polling
    this._startPolling(scanId, userId);
  }

  ngOnDestroy(): void {
    // Clean up the subscription on component destruction
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private _startPolling(scanId: any, userId: any) {
    this.pollingSubscription = interval(10000) // Poll every 10 seconds
      .pipe(
        switchMap(() =>
          this._buildCopyleaksReportAsync(scanId, userId).pipe(
            catchError((error) => {
              console.error('Polling error', error);
              return of(null);
            })
          )
        )
      )
      .subscribe(
        (result) => {
          if (result) {
            console.log('Polling result -- ', result);
          }
        },
        (error) => {
          console.error('Polling error', error);
        }
      );
  }

  private _buildCopyleaksReportAsync(scanId: any, userId: any) {
    return new Observable<void>((observer) => {
      (async () => {
        try {
          const source = await this.http
            .get<ScanSource>(
              `${this.baseUrl}/api/scan/getSourceFile/${userId}/${scanId}`
            )
            .toPromise();

          console.log('source -- ', source);

          if (source) {
            this.reportService.pushDownloadedSource(source);
          }

          const complete = await this.http
            .get<CompleteResult>(
              `${this.baseUrl}/api/scan/getCompleteFile/${userId}/${scanId}`
            )
            .toPromise();

          console.log('complete -- ', complete);

          if (complete) {
            this.reportService.pushCompletedResult(complete);

            const allResultsIds = [
              ...complete.results.internet.map((r: any) => r.id),
              ...complete.results.database.map((r: any) => r.id),
              ...complete.results.batch.map((r: any) => r.id),
              ...(complete.results.repositories?.map((r) => r.id) || []),
            ];

            await Promise.all(
              allResultsIds.map(async (id: string) => {
                const result = await this.http
                  .get<ScanResult>(
                    `${this.baseUrl}/api/scan/getResultsFile/${userId}/${scanId}/${id}.json`
                  )
                  .toPromise();
                if (result) {
                  this.reportService.pushScanResult({ id, result });
                }
              })
            );
          }

          observer.next();
          observer.complete();
        } catch (error) {
          console.error(error);
          observer.error(error);
        }
      })();
    });
  }


  onHelpBtnClick(event: any) {
    console.log('help');
  }
  onShareBtnClick(event: any) {
    console.log('share');
  }

}
