 export interface StatisticalDto {
     Statistical : {
         orderCount : number
         productCount : number
         categoryCount : number
         producerCount : number
         UserCount : number
     }
 }

  export interface StatisticalToday {
    totalMoney: number;
    orderCount: number;
    orderCountPending: number;
    orderCountByCustomer: number;
    totalMoneyByCustomer: number;
  }