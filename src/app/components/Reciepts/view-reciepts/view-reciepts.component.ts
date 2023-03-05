import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Login } from 'src/app/models/login';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-reciepts',
  templateUrl: './view-reciepts.component.html',
  styleUrls: ['./view-reciepts.component.css'],
})
export class ViewRecieptsComponent implements OnInit {
  @Input() id: number;
  @Input() title: string;
  @Input() name: string;
  currentUser: Login = new Login();
  show: boolean = false;
  url: string;
  report: string;
  isSuccessful = false;
  API_URL = 'http://localhost:4000/api/fmdc/reciepts/';
  constructor(
    public userService: UserService,
    private storageService: StorageService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    @Inject(Injector) private readonly injector: Injector
  ) {}
  private get toasterService() {
    return this.injector.get(ToastrService);
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.LoadReport();
    } else {
      this.router.navigate(['/login']);
    }
  }

  LoadReport(): void {
    if (this.id > 0) {
      this.url = this.API_URL + 'GenerateReciept/' + this.id;
      this.show = true;
    }
  }
}
