export interface IDiagram {
  stationList: Array<string>
  dates: Array<string>
  values: Array<Array<number>>
  maxEl: number
  dailyIncomes: Array<Array<number>>
  maxIncome: number
}
