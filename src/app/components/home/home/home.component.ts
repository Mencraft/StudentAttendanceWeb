import { Component, OnInit,Inject  } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import {HttpService} from './../../../shared/http.service';
import {DataService} from './../../../shared/data.service';
import {Student,Attendance} from './../../../shared/student';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public popoverTitle = 'Delete Student Confirmation';
  public popoverMessage = 'Are you sure you want to delete Student?';
  public confirmClicked = false;
  public cancelClicked = false;
  public downloadURL1;
  angForm: FormGroup;
  public facetoken;
  public feedList;
  public attend;
  SERVER_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
  students: Student[];
  attendance: Attendance[];
  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    maxSize: "1",
    uploadAPI: {
      url:"https://api-us.faceplusplus.com/facepp/v3/detect",
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'POST',
      },
      method:"POST",
      params: {
        'api_key': 'm73Fv6ikNDXkfOtjvDAc_x2HZ2JduWzt',
        'api_secret': 'OckzeZqcX5piOrxUycN97QtI8IEy9zdz'
      },
      responseType: 'blob',
    }
};
  constructor(public authService: AuthService,@Inject(DOCUMENT) document, private http: HttpClient,private fb: FormBuilder,private axi:HttpService,private dats:DataService,public storage: AngularFireStorage) {
    this.createForm();

  }

  ngOnInit(): void {
    this.getStudents();
    this.getAttendanceXX();
  }
  DocUpload(event){
    console.log(event);

  }
  createForm() {
    this.angForm = this.fb.group({
      studentname: ['', Validators.required ],
      studentDepartment: ['', Validators.required ],
      studentEmail: ['', Validators.required ],
      studentPhotoupload:  ['' ],
      PhotoURl: [{value: this.downloadURL1, disabled: true} ]
     // face_token: ['', Validators.required]
    });
  }

  onSubmit(customerData) {
    // Process checkout data here
    // this.items = this.cartService.clearCart();
    // this.checkoutForm.reset();  const formData = new FormData();
//formData.append('file', this.uploadForm.get('profile').value);
    // var body = new FormData();
    // body.append('studentname', this.angForm.get('studentname').value);
    // body.append('studentDepartment', this.angForm.get('studentDepartment').value);
    // body.append('studentEmail', this.angForm.get('studentEmail').value);
    // body.append('studentPhotoupload', this.angForm.get('studentPhotoupload').value);
    // body.append('PhotoURl', this.angForm.get('PhotoURl').value);

    // console.warn('Your order has been submitted', body);
    const data = {
      studentname: customerData.studentname,
      studentDepartment: customerData.studentDepartment,
      studentEmail: customerData.studentEmail,
      studentPhotoupload: this.downloadURL1,
      face_token:this.facetoken
    }

    this.dats.addstudent(data);



  }

  onChange(event){
    console.log('File details are ', event.target.files[0]);

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.angForm.get('studentPhotoupload').setValue(file);
    }

    const formData = new FormData();
    formData.append('api_key', 'm73Fv6ikNDXkfOtjvDAc_x2HZ2JduWzt');
    formData.append('api_secret', 'OckzeZqcX5piOrxUycN97QtI8IEy9zdz');
    formData.append('image_file', this.angForm.get('studentPhotoupload').value);
    // let formdata = {
    //   api_key:'m73Fv6ikNDXkfOtjvDAc_x2HZ2JduWzt',
    //   api_secret:'OckzeZqcX5piOrxUycN97QtI8IEy9zdz',
    //   image_file: event.target.files[0]
    // }
    console.log(this.angForm.get('studentPhotoupload').value);
    // this.httpClient.post<any>(this.SERVER_URL, body).subscribe(
    //   (res) => console.log(res),
    //   (err) => console.log(err)
    // );
   this.axi.detectFace(formData);
  }

  getStudents = () =>
  this.dats.getStudent()
    .subscribe(res => (this.students = res.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Student
        }
      })
    ))
    setdata(e){
      let datwe = e.target.value
      let res = datwe.split("-");
      let tut = res[1]+''+ res[2]+''+res[0]
      console.log(tut);
        console.log(e.target.value);
        this.getcurrentatt(tut);

    }
    getAttendanceXX = () =>
    this.dats.getAttendance()
      .subscribe(res => (this.attendance = res.map(e => {
        console.log(e);

          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as Attendance
          }
        })
      ))

      getcurrentatt(id){
        this.feedList = this.dats.getCurrentAttendance(id).valueChanges();
        console.log(this.feedList);
        this.feedList.subscribe(res =>{

            this.attend = res
        //   this.result = res.find( ({ id }) => id ===  this.todoId );
          console.log(res);

        })
      }

      deletestud(id){
          console.log(id);
this.dats.deleteStudentsData(id);
      }


    async uploadFile(event) {

      const filename = event.target.files[0].name;
      const file = event.target.files[0];
      console.log(event.target.id);
      const inputid = event.target.id;

      const filePath = `studentsinfo/${new Date().getTime()}_${filename}`;
      const fileRef = await this.storage.ref(filePath);
      // this.percentage = this.task.percentageChanges();
      // console.log(this.percentage);
      await this.storage.upload(filePath, file).then(async () => {
        const url = await fileRef.getDownloadURL().subscribe(async urll => {
          const URL = await urll;
          console.log('URL ' + URL);
          switch (inputid) {
            case 'photoupload':
              console.log('wwwwwwwwwow its img1');
              this.downloadURL1 = URL;
              this.DetectFace(this.downloadURL1);
              break;
            default:
              break;
          }
          // this.downloadURL = URL;
        });
        console.log('url ' + url);
      }).catch((e) => {
        console.log(e);
      });
    }

    DetectFace(url){
      // const data = {
      //   image_file: url
      // }
      // this.axi.detectFace(data);
      // return url


// Transform the data here if you'd like.
var formData: any = new FormData();
formData.append("api_key", 'm73Fv6ikNDXkfOtjvDAc_x2HZ2JduWzt');
formData.append("api_secret", 'OckzeZqcX5piOrxUycN97QtI8IEy9zdz');
formData.append("image_url", url);

this.http.post(this.SERVER_URL, formData).subscribe(
  (response) => this.savetofaceset(response),
  (error) => console.log(error)
)
    }

    savetofaceset(data){
      console.log(data);

      let fac = data.faces
      if(data.face_num === 0 || data.face_num > 1){
        console.log('no faces or more than one face in image');
        alert('no faces or more than one face in image');
      }else{
        let numbers2 = fac.map(this.myFunction);
         this.facetoken = numbers2[0].toString();
         console.log(this.facetoken);

         var formData: any = new FormData();
          formData.append("api_key", 'm73Fv6ikNDXkfOtjvDAc_x2HZ2JduWzt');
          formData.append("api_secret", 'OckzeZqcX5piOrxUycN97QtI8IEy9zdz');
          formData.append("faceset_token", '27ba1cdab4bacb9e076fec3c1aca558c');
          formData.append("face_tokens", this.facetoken);

          this.http.post('https://api-us.faceplusplus.com/facepp/v3/faceset/addface', formData).subscribe(
            (response) => console.log(response),
            (error) => console.log(error)
          )
      }

    }

     myFunction(value) {
      return value.face_token;
    }
}
