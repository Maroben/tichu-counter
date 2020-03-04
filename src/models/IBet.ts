// Add zero index so you can multiply with 100
// to get 100 points for small and 200 for big.
export enum BetType {
    none,
    small,
    big
}

export default interface IBet {
    bet: BetType
    success: boolean
}
