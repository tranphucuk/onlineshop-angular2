import { Injectable, EventEmitter } from '@angular/core';
import { systemConstants } from '../services/common/system.constant'
import { AuthenService } from '../services/authen.service'
import { DataService } from '../services/data.service'
declare var $: any

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  // Declare the variables
  private proxy: any;
  private proxyName: any = 'teduShopHub';
  private connection: any;
  // create event Emitter
  public announcementReceived: EventEmitter<any>;
  public connectionEstablished: EventEmitter<boolean>;
  public connectionExist: boolean;

  constructor(private authSer: AuthenService, private dataSer: DataService) {
    // Constructor initialization
    this.connectionEstablished = new EventEmitter<boolean>();
    this.announcementReceived = new EventEmitter<boolean>();
    this.connectionExist = false;

    // create hub connection
    this.connection = $.hubConnection(systemConstants.BASE_API);
    this.connection.qs = { 'access_token': authSer.getLoggedInUser().access_token };
    // create new proxy as name already given in top
    this.proxy = this.connection.createHubProxy(this.proxyName);
    // register on server events
    this.registerOnServerEvents();
    // call the connection start method to start the connection to send and receive events.
    this.startConnection();
  }

  private startConnection(): void {
    this.connection.start().done((data: any) => {
      console.log('Now Connected' + data.transport.name + ', connection ID=' + data.id);
      this.connectionEstablished.emit(true);
      this.connectionExist = true;
    }).fail((err: any) => {
      console.log('Could not connect: ' + this.dataSer.handleError(err));
      this.connectionEstablished.emit(false);
    })
  }

  private registerOnServerEvents(): void {
    this.proxy.on('addAnnouncement', (announcement: any) => {
      this.announcementReceived.emit(announcement);
    })
  }
}
