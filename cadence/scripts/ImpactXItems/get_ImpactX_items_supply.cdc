import ImpactXItems from "../../contracts/ImpactXItems.cdc"

// This scripts returns the number of ImpactXItems currently in existence.

pub fun main(): UInt64 {    
    return ImpactXItems.totalSupply
}
