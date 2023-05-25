export interface ITopClients {
  count: number
  data: Array<{
    client: string
    count : number
    sum: number
  }
  >

}
