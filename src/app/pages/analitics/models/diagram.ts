export interface IDiagram {
  count: number
  data: Array<{
    date: string
    workAndincome: {
      workload: number
      income: number
    }
  }
  >
}
