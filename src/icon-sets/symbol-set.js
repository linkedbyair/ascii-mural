export class SymbolSet {
  constructor(symbols) {
    this.symbols = symbols;
  }

  getSymbol(lightness) {
    const index = Math.floor((lightness / 255) * (this.symbols.length - 1));
    return {
      text: this.symbols[index],
      index: index,
    };
  }
}
