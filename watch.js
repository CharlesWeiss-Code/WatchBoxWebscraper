export class Watch {
    refNum = ""
    link = ""
    lowPriceAge = ""
    lowPrice = ""
    highPrice = ""
    highPriceAge = ""
    lowPriceBoxPapers= ""
    highPriceBoxPapers = ""
    constructor(refNum, link, lowPrice, lowPiceAge, highPrice, highPriceAge, lowPriceBoxPapers, highPriceBoxPapers) {
        this.refNum = refNum
        this.link = link
        this.lowPriceAge = lowPiceAge
        this.lowPrice = lowPrice
        this.highPrice = highPrice
        this.highPriceAge = highPriceAge
    }
}