import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersCollection = 'users'

  constructor(private firestore: AngularFirestore) { }

  create(user: User) {
    return this.firestore.collection<User>(this.usersCollection).add(user);
  }

  getAllUsers() {
    return this.firestore.collection<User>(this.usersCollection).valueChanges();
  }

  getUserById(id: string) {
    return this.firestore.collection<User>(this.usersCollection, ref => {
      return ref.where('id', '==', id).limit(1)
    }).valueChanges()
  }

  update(user: User) {
    return this.firestore.collection<User>(this.usersCollection).doc(user.id).set(user);
  }

  delete(id: string) {
    return this.firestore.collection<User>(this.usersCollection).doc(id).delete();
  }

}
