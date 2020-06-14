import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Student } from './student';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private studentsCollection: AngularFirestoreCollection<Student>;
  constructor(private firestore: AngularFirestore) {
    this.studentsCollection = firestore.collection<Student>('StudentsData');
  }
  addstudent(data){
    console.log(data);


      this.firestore
        .collection('StudentsData')
        .add(data)
                .then(res => {
                  console.log(res)
         }, err =>
         console.log(err)
         );
  }

  studentattendance(data){
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('StudentAttendance').doc(data.payload.doc.id)
        .set(data,{merge: true})
                .then(res => {
                  console.log(res)
         }, err =>
         console.log(err)
         );
    });
  }

  addphotofile(){

  }

  getStudent() {
    return this.firestore.collection('StudentsData').snapshotChanges();
  }

  getAttendance(){


    return this.firestore.collection('StudentAttendance').snapshotChanges();
  }
  getCurrentAttendance(data){
    return this.firestore.collection('StudentAttendance').doc(data).collection('attendance',ref => ref.orderBy('datecreated', 'desc'));
  }

  deleteStudentsData(data) {
    return this.firestore
      .collection('StudentsData')
      .doc(data)
      .delete().then(res => {
        alert('Student Has been deleted')
      }, err =>
          alert(err)
      );
  }
}
