lowTable = "Listing code	CG57Y8 Dealer product code	SE116610LN Movement	Automatic Case material	Steel Bracelet material	Steel Year of production	2022 Condition	New (Brand new, without any signs of wear) Scope of delivery	 Original box, original papers Location	Hong Kong, KWUN TONG Gender	Men's watch/Unisex"

brandLow = ""

index1BrandLow = lowTable.indexOf("Brand") + 5;
if ((index1BrandLow != 4) && (index1BrandLow != lowTable.indexOf("Brand new") +5)) {
  index2BrandLow = lowTable.indexOf("Model");
  if (index2BrandLow === -1) {
    index2BrandLow = lowTable.indexOf("Reference number");
  }
  brandLow = lowTable.substring(index1BrandLow, index2BrandLow).trim();
}

console.log(brandLow)
