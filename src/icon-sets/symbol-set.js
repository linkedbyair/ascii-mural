export class SymbolSet {
  constructor(id, name, symbols) {
    this.id = id;
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
