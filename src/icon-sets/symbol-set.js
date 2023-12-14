export class SymbolSet {
  constructor(id, name, symbols) {
    this.id = id;
    this.name = name;
    this.symbols = symbols;
  }

  getSymbol(luminance, threshold) {
    return this.symbols
      .map((symbol) => {
        // If the luminance is less than the threshold, it will be rendered
        // as light icon on a dark background. Therefore, the luminance of
        // the symbol needs to be inverted.
        const styledLuminance =
          luminance < threshold ? 255 - symbol.luminance : symbol.luminance;
        symbol.delta = Math.abs(styledLuminance - luminance);
        return symbol;
      })
      .sort((a, b) => a.delta - b.delta)[0];
  }
}
