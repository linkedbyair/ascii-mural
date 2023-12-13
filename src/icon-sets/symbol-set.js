export class SymbolSet {
  constructor(name, symbols) {
    this.name = name;
    this.symbols = symbols;
  }

  getSymbol(luminance) {
    return this.symbols
      .map((symbol) => {
        symbol.delta = Math.abs(symbol.luminance - luminance);
        return symbol;
      })
      .sort((a, b) => a.delta - b.delta)[0];
  }
}
