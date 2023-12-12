export class SymbolSet {
  constructor(name, symbols) {
    this.name = name;
    this.symbols = symbols;
  }

  getSymbol(luminance) {
    const symbol = this.symbols.map((symbol) => {
      symbol.delta = Math.abs(symbol.luminance - luminance);
      return symbol;
    }).sort((a, b) => a.delta - b.delta)[0];
    return {
      text: symbol.name,
      index: this.symbols.indexOf(symbol),
    };
  }
  
  // getSymbol(lightness) {
  //   const index = Math.floor((lightness / 255) * (this.symbols.length - 1));
  //   return {
  //     text: this.symbols[index],
  //     index: index,
  //   };
  // }
}
