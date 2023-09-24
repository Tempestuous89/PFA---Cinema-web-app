import { Component,OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit{

  public villes : any;
  public cinemas : any;
  public currentVille : any;
  public currentCinema : any;
  public salles : any;
  public currentProjection : any;
  public selectedTickets: any;
  constructor(public cinemaService : CinemaService) {

  }
  ngOnInit() {
    this.cinemaService.getVilles().subscribe(data=>{
      this.villes=data;
    },error =>{
      console.log(error);
    })
  }

  onGetCinema(v: any) {
    this.currentVille=v;
    this.salles=undefined;
      this.cinemaService.getCinema(v).subscribe(data=>{
        this.cinemas=data;
      },error =>{
        console.log(error);
      })
  }

  onGetSalles(c: any) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c).subscribe(data=>{
      this.salles=data;
      // @ts-ignore
      this.salles._embedded.salles.forEach(salle=>{
        this.cinemaService.getProjection(salle).subscribe(data=>{
          salle.projections=data;
        },error =>{
          console.log(error);
        })
      })
    },error =>{
      console.log(error);
    })
  }

  onGetTicketsPlaces(p: any) {
    this.currentProjection=p;
    this.cinemaService.getTicketsPlaces(p).subscribe(data=>{
      this.currentProjection.tickets=data;
      this.selectedTickets =[];
    },error =>{
      console.log(error);
    })
  }


  onSelectTicket(t: any) {
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
    }
    else{
      t.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(t: any) {
    let str ="btn tickett ";
    if(t.reserve==true){
      str +="btn-danger";
    }
    else if(t.selected){
      str+="btn-warning";
    }
    else{
      str+="btn-success";
    }
    return str;
  }

  onPayerTickets(dataForm: any) {
    let tickets: any[]=[];
    // @ts-ignore
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm).subscribe(data=>{
      alert("Tickets reservés!");
      this.onGetTicketsPlaces(this.currentProjection);
    },error =>{
      console.log(error);
    })
  }
}
