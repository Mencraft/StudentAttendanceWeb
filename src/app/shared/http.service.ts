import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
   instance = axios.create({
    baseURL: "https://us-central1-tunesbid-a0909.cloudfunctions.net/",
    withCredentials: false,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin' : "*",
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Content-Type': 'application/json',
      }
  });
  constructor() { }

  detectFace(data){
    console.log(this.instance);

    this.instance.post('/detectface', data)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
