
type CodePoint = number;

export interface Point {
  x: number;
  y: number;
  onCurve?: boolean;
}

export type Contour = Point[];

export interface Glyph {
  contours: Contour[];
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  advanceWidth: number;
  leftSideBearing: number;
  name: string;
  unicode?: CodePoint[];
  compound?: boolean;

  glyfs?: Glyph[];
  instructions?: number[];
}

export interface Head {
  [k: string]: number;
  version: number;
  fontRevision: number;
  checkSumAdjustment: number;
  magickNumber: number;
  flags: number;
  unitsPerEm: number;
  created: number;
  modified: number;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  macStyle: number;
  lowestRecPPEM: number;
  fontDirectionHint: number;
  indexToLocFormat: number;
  glyphDataFormat: number;
}

export interface Hhea {
  version: number;
  ascent: number;
  descent: number;
  lineGap: number;
  advanceWidthMax: number;
  minLeftSideBearing: number;
  minRightSideBearing: number;
  xMaxExtent: number;
  caretSlopeRise: number;
  caretSlopeRun: number;
  caretOffset: number;
  reserved0: number;
  reserved1: number;
  reserved2: number;
  reserved3: number;
  metricDataFormat: number;
  numOfLongHorMetrics: number;
}

export interface Post {
  italicAngle: number;
  postoints: number;
  underlinePosition: number;
  underlineThickness: number;
  isFixedPitch: number;
  minMemType42: number;
  maxMemType42: number;
  minMemType1: number;
  maxMemType1: number;
  format: number;
}

export interface Maxp {
  version: number;
  numGlyphs: number;
  maxPoints: number;
  maxContours: number;
  maxCompositePoints: number;
  maxCompositeContours: number;
  maxZones: number;
  maxTwilightPoints: number;
  maxStorage: number;
  maxFunctionDefs: number;
  maxStackElements: number;
  maxSizeOfInstructions: number;
  maxComponentElements: number;
  maxComponentDepth: number;
}

export interface OS2 {
  version: number;
  xAvgCharWidth: number;
  usWeightClass: number;
  usWidthClass: number;
  fsType: number;
  ySubscriptXSize: number;
  ySubscriptYSize: number;
  ySubscriptXOffset: number;
  ySubscriptYOffset: number;
  ySuperscriptXSize: number;
  ySuperscriptYSize: number;
  ySuperscriptXOffset: number;
  ySuperscriptYOffset: number;
  yStrikeoutSize: number;
  yStrikeoutPosition: number;
  sFamilyClass: number;
  bFamilyType: number;
  bSerifStyle: number;
  bWeight: number;
  bProportion: number;
  bContrast: number;
  bStrokeVariation: number;
  bArmStyle: number;
  bLetterform: number;
  bMidline: number;
  bXHeight: number;
  ulUnicodeRange1: number;
  ulUnicodeRange2: number;
  ulUnicodeRange3: number;
  ulUnicodeRange4: number;
  achVendID: string;
  fsSelection: number;
  usFirstCharIndex: number;
  usLastCharIndex: number;
  sTypoAscender: number;
  sTypoDescender: number;
  sTypoLineGap: number;
  usWinAscent: number;
  usWinDescent: number;
  ulCodePageRange1: number;
  ulCodePageRange2: number;
  sxHeight: number;
  sCapHeight: number;
  usDefaultChar: number;
  usBreakChar: number;
  usMaxContext: number;
}

export interface Name {
  [k: string]: string;
  fontFamily: string;
  fontSubFamily: string;
  uniqueSubFamily: string;
  version: string;
}

export interface Metrics {
  /** Ascent value */
  ascent: number;
  /** Descent value */
  descent: number;
  /** Typographic ascender */
  sTypoAscender: number;
  /** Typographic descender */
  sTypoDescender: number;
  /** Windows ascent */
  usWinAscent: number;
  /** Windows descent */
  usWinDescent: number;
  /** x-height measurement */
  sxHeight: number;
  /** Cap height measurement */
  sCapHeight: number;
}


export interface TTFTableDirectory {
  [key: string]: {
    name: string;
    checkSum: number;
    offset: number;
    length: number;
  };
}

export interface TTFReadOptions {
  subset?: number[];
}

export interface TTFWriteOptions {
  writeZeroContoursGlyfData: boolean;
  hinting: boolean;
  kerning: boolean;
  tables: string[];
}

export interface TTFObject {
  readOptions?: TTFReadOptions;
  writeOptions?: TTFWriteOptions;
  subsetMap?: Record<string, boolean>;
  from?: string;

  version: number;
  numTables: number;
  searchRange: number;
  entrySelector: number;
  rangeShift: number;
  head: Head;
  glyf: Glyph[];
  cmap: Record<string, number>;
  name: Name;
  hhea: Hhea;
  post: Post;
  maxp: Maxp;
  'OS/2': OS2;
  tables?: TTFTableDirectory;
  support?: Record<string, any>;

  loca?: number[];
  // keep table as byte array
  fpgm?: number[];
  cvt?: number[];
  gasp?: number[];
  GPOS?: number[];
  kern?: number[];
  kerx?: number[];
  prep?: number[];
}