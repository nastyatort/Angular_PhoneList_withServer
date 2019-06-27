import { Component} from '@angular/core';
import { NgModel} from '@angular/forms';
import { HttpService} from '../services/http.service';
import { UserService} from '../services/user.service';
// import * as angular from 'angular'; 

import { ModalComponent} from '../modal-page/modal.component';

import {PhoneComponent} from '../phone-page/phone.component';
import {NavComponent} from '../nav-page/nav.component'
import { identifierModuleUrl } from '@angular/compiler';
  
@Component({
    selector: 'main-page',
    styleUrls: ['./main.component.css', '../style.css'],
    templateUrl: './main.component.html',
    providers: [HttpService]
})

export class MainComponent  { 
     
    constructor(
        private httpService: HttpService,
        private userService: UserService,
        ){}
 
    phone: PhoneComponent = new PhoneComponent("");
    phones: PhoneComponent[] = [];
    userId: any = this.userService.getUserId();
    modalIsOpen: boolean = false;
    phoneId: string;
    shouldDeletePhone: boolean = false;

    idForModal: string;
    idForAction: string;

    currentValue: string;

    ngOnInit(){    
        this.httpService.getData({}).subscribe(
            (data: any) => 
            {
                for(let i = 0; i < data.items.length; i++){
                if(data.items[i].userId == this.userId){
                    this.phones.push(data.items[i])
                }
                }
            });
    }

    addPhone(title:NgModel){
        if(title.model != ''){
        this.httpService.addData(
        {title: this.phone.title,
        userId: this.userId
        })
        .subscribe((res: any) => {
            const contact = {
                title: this.phone.title,
                _id: res.newItem._id,
                userId: this.userId
            };
            this.phones.push(contact);
        });
    }
    }

    editPhone(id: string){
        ((document.getElementById(id) as HTMLInputElement).disabled) = false;
        this.currentValue = (document.getElementById(id) as HTMLInputElement).value;
        this.idForAction = id;  
    }

      savePhone(id: string){
        let newText = ((document.getElementById(id) as HTMLInputElement).value);

        this.httpService.editData({
            title: newText,
            _id: id,
            userId: this.userId
        }).subscribe(res => {
            let editElement = this.phones.findIndex(x => x._id === id);
            this.phones.splice(editElement, 1, {title: newText, _id: id, userId: this.userId})
        })
        this.idForAction = '';
      }

      cancelPhone(id: string){
        ((document.getElementById(id) as HTMLInputElement).disabled) = true;
        (document.getElementById(id) as HTMLInputElement).value = this.currentValue;
        this.idForAction = '';
      }

    deletePhone(id: string){
        if(this.shouldDeletePhone == true){
        this.httpService.deleteData(id).subscribe(res => {
        let delElement = this.phones.findIndex(x => x._id == id);
        this.phones.splice(delElement, 1);
            }
        )
        }
    }

    showModal(id: string){
        this.idForModal = id;
        console.log('idForModal = ' + this.idForModal);
        console.log('id = ' + id);
        this.modalIsOpen = true;
        this.phoneId = id;
    }
}
