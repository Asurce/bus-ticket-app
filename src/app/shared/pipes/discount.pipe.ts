import {Pipe, PipeTransform} from '@angular/core';
import {Discount} from "../models/Discount";

@Pipe({
  name: 'discount',
  standalone: true
})
export class DiscountPipe implements PipeTransform {

  transform(value: Discount, ...args: unknown[]): string {
    switch (value) {
      case Discount.NONE:
        return "normál jegy";
      case Discount.STUDENT:
        return "50%-os jegy";
      case Discount.WORKER:
        return "90%-os jegy";
    }
  }

}
