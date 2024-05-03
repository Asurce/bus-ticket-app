import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {City} from "../models/City";
import {Discount, discountValues} from "../models/Discount";
import {Journey} from "../models/Journey";

@Injectable({
  providedIn: 'root'
})
export class JourneyService {

  citiesCollection = 'cities'

  journeyList: Journey[] | null = null;

  constructor(private firestore: AngularFirestore) {
  }

  getCities() {
    return this.firestore.collection<City>(this.citiesCollection).valueChanges();
  }

  generateJourneys(originCity: City, destCity: City, dateTime: Date, isDepartDate: boolean, discount: Discount) {

    // DISTANCE
    let distance: number;
    if (originCity.id === 0) {
      distance = destCity.distance;
    } else if (originCity.id === destCity.id) {
      distance = Math.abs(originCity.distance - destCity.distance)
    } else {
      distance = originCity.distance + destCity.distance
    }

    // TRAVEL TIME
    let travelTime = distance / 2;

    // DEPART FREQUENCY
    let departFrequency = 60 / (originCity.id === 0 ? destCity.id : originCity.id)

    // DEPART MINUTES
    let departMinutes = Math.floor(Math.abs(Math.sin(distance) * 59));

    // PRICE
    let price = Math.ceil(Math.log(distance) * 500 * discountValues[discount] / 10) * 10;

    // CALCULATE TIMES
    let referenceDate: Date = new Date(dateTime.getTime());
    let variableDate: Date = new Date(dateTime.getTime());

    if (isDepartDate) {
      referenceDate.setHours(23);
      referenceDate.setMinutes(59);

      variableDate.setHours(dateTime.getHours() + (dateTime.getMinutes() < departMinutes ? 0 : 1));
      variableDate.setMinutes(departMinutes);
    } else {
      variableDate.setHours(2);
      variableDate.setMinutes(departMinutes);
    }

    // GENERATE JOURNEYS
    let journeyList: Journey[] = []
    while ((variableDate.getTime() + (travelTime * 60000)) < referenceDate.getTime()) {
      journeyList.push({
        originCity: originCity,
        destCity: destCity,
        departTime: new Date(variableDate.getTime()),
        arriveTime: new Date(variableDate.getTime() + (travelTime * 60000)),
        travelTime: travelTime,
        discount: discount,
        distance: distance,
        price: price
      });
      variableDate.setTime(variableDate.getTime() + (departFrequency * 60000));
    }

    this.journeyList = journeyList;
  }
}
