import MyWorldContract from "../contracts/MyWorldContract.cdc"

pub fun main(): UInt64 {
  let totalArts = MyWorldContract.totalArts
  return totalArts
}