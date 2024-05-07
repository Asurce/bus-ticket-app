import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersCollection = 'users'

  constructor(private firestore: AngularFirestore) {
  }

  create(user: User) {
    return this.firestore.collection<User>(this.usersCollection).add(user);
  }

  getUserById(id: string) {
    return this.firestore.collection<User>(this.usersCollection, ref => {
      return ref.where('id', '==', id).limit(1)
    }).valueChanges()
  }

  update(user: User) {
    const query = this.firestore.collection<User>(this.usersCollection, ref => {
      return ref.where('id', '==', user.id).limit(1)
    }).get();

    return query.forEach(snapshot => {
      snapshot.docs.forEach(doc => {
        const userDocRef = this.firestore.collection('users').doc(doc.id);
        return userDocRef.update(user);
      });
    });
  }

  delete(id: string) {
    const query = this.firestore.collection<User>(this.usersCollection, ref => {
      return ref.where('id', '==', id).limit(1)
    }).get();

    return query.forEach(snapshot => {
      snapshot.docs.forEach(doc => {
        const userDocRef = this.firestore.collection('users').doc(doc.id);
        return userDocRef.delete();
      });
    });
  }

}
