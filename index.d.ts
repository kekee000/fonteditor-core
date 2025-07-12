/**
 * @file index.d.ts
 * @author mengke01(kekee000@gmail.com)
 * @author pumpkinzomb
 */

export namespace TTF {
  type CodePoint = number;

  type Point = {
    x: number;
    y: number;
    onCurve: boolean;
  };

  type Contour = Point[];

  type Glyph = {
    contours: Contour[];
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    advanceWidth: number;
    leftSideBearing: number;
    name: string;
    unicode: CodePoint[];
  };

  type Head = {
    [k: string]: number;
    version: number;
    fontRevision: number;
    checkSumAdjustment: number;
    magickNumber: number;
    flags: number;
    unitsPerE: number;
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
  };

  type Hhea = {
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
  };

  type Post = {
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
  };

  type Maxp = {
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
  };

  type OS2 = {
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
  };

  type Name = {
    [k: string]: string;
    fontFamily: string;
    fontSubFamily: string;
    uniqueSubFamily: string;
    version: string;
  };

  type Metrics = {
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


  type TTFObject = {
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
    "OS/2": OS2;
  };
}

export namespace FontEditor {
  type FontType = "ttf" | "otf" | "eot" | "woff" | "woff2" | "svg";

  type FontInput = ArrayBuffer | Buffer | string | Document;
  type FontOutput = ArrayBuffer | Buffer | string;

  type UInt8 = number;

  interface FontReadOptions {
    /**
     * font type for read
     */
    type: FontType;

    /**
     * subset font file to specified unicode code points;
     */
    subset?: TTF.CodePoint[];

    /**
     * keep hinting table or not, default false
     */
    hinting?: boolean;

    /**
     * keep kerning table or not, default false
     * kerning table adjusting the space between individual letters or characters
     */
    kerning?: boolean;

    /**
     * tranfrom compound glyph to simple,
     * @default true
     */
    compound2simple?: boolean;

    /**
     * inflate function for woff
     *
     * @see pako.inflate https://github.com/nodeca/pako
     */
    inflate?: (deflatedData: UInt8[]) => UInt8[];

    /**
     * combine svg paths to one glyph in one svg file.
     * @default true
     */
    combinePath?: boolean;
  }

  interface FontWriteOptions {
    /**
     * font type for write
     */
    type: FontType;

    /**
     * use Buffer when in Node enviroment, in browser will use ArrayBuffer.
     * default true
     */
    toBuffer?: boolean;

    /**
     * keep hinting or not, default false
     */
    hinting?: boolean;

    /**
     * save font kerning, default false
     * */
    kerning?: boolean,

    /**
     * write glyf data when simple glyph has no contours, default false
     */
    writeZeroContoursGlyfData?: boolean;

    /**
     * svg output meta data
     */
    metadata?: string;

    /**
     * deflate function for woff
     *
     * @see pako.deflate https://github.com/nodeca/pako
     */
    deflate?: (rawData: UInt8[]) => UInt8[];

    /**
     * for user to overwrite head.xMin, head.xMax, head.yMin, head.yMax, hhea etc.
     */
    support?: {
      /**
       * overwrite head
       */
      head?: {
        xMin?: number;
        yMin?: number;
        xMax?: number;
        yMax?: number;
      };
      /**
       * overwrite hhea
       */
      hhea?: {
        advanceWidthMax?: number;
        xMaxExtent?: number;
        minLeftSideBearing?: number;
        minRightSideBearing?: number;
      };
    };
  }

  type FindCondition = {
    /**
     * find glyfs with unicode array
     */
    unicode?: TTF.CodePoint[];
    /**
     * find by glyf name
     */
    name?: string;
    /**
     * use filter function to find glyfs
     * @param glyph glyf object
     * @returns
     */
    filter?: (glyph: TTF.Glyph) => boolean;
  };

  type MergeOptions =
    | {
        /**
         * scale glyphs to fit fonts. default true
         */
        scale: number;
      }
    | {
        /**
         * auto adjuct glyphs to the first font em box. default true
         */
        adjustGlyf: boolean;
      };

  type OptimizeResult = {
    /**
     * result
     *
     * - true optimize success
     * - {repeat} repeat glyf codepoints
     */
    result:
      | true
      | {
          /**
           * repeat glyf codepoints
           */
          repeat: number[];
        };
  };

  /**
   * ttf helper class
   */
  class TTFHelper {
    /**
     * Creates a new TTF instance
     * @param ttf The TTF font data structure
     */
    constructor(ttf: TTF.TTFObject);

    /** Get all character codes in the font */
    codes(): string[];

    /**
     * Get glyph index by character code
     * @param c Character or character code
     */
    getGlyfIndexByCode(c: string | number): number | undefined;

    /**
     * Get glyph by index
     * @param glyfIndex Index of the glyph
     */
    getGlyfByIndex(glyfIndex: number): TTF.Glyph | undefined;

    /**
     * Get glyph by character code
     * @param c Character or character code
     */
    getGlyfByCode(c: string | number): TTF.Glyph | undefined;

    /**
     * Set TTF object
     * @param ttf TTF object to set
     */
    set(ttf: TTF.TTFObject): this;

    /** Get TTF object */
    get(): TTF.TTFObject;

    /**
     * Add a glyph
     * @param glyf Glyph to add
     * @return Added glyph
     */
    addGlyf(glyf: TTF.Glyph): [TTF.Glyph];

    /**
     * Insert a glyph at specified index
     * @param glyf Glyph to insert
     * @param insertIndex Index to insert at
     * @return Inserted glyph
     */
    insertGlyf(glyf: TTF.Glyph, insertIndex?: number): [TTF.Glyph];

    /**
     * Merge glyphs from another font
     * @param imported Font to import from
     * @param options Merge options
     * @return Merged glyphs
     */
    mergeGlyf(imported: TTF.TTFObject, options?: MergeOptions): TTF.Glyph[];

    /**
     * Remove glyphs at specified indices
     * @param indexList Indices of glyphs to remove
     * @return Removed glyphs
     */
    removeGlyf(indexList: number[]): TTF.Glyph[];

    /**
     * Set unicode values for glyphs
     * @param unicode Unicode value
     * @param indexList Indices of glyphs to modify
     * @param isGenerateName Whether to generate names
     * @return Modified glyphs
     */
    setUnicode(unicode: string, indexList?: number[], isGenerateName?: boolean): TTF.Glyph[];

    /**
     * Generate names for glyphs
     * @param indexList Indices of glyphs to modify
     * @return Changed glyphs
     */
    genGlyfName(indexList?: number[]): TTF.Glyph[];

    /**
     * Clear glyph names
     * @param indexList Indices of glyphs to modify
     * @return Changed glyphs
     */
    clearGlyfName(indexList?: number[]): TTF.Glyph[];

    /**
     * Append glyphs with replacement
     * @param glyfList Glyphs to append
     * @param indexList Indices for replacement
     * @return Changed glyphs
     */
    appendGlyf(glyfList: TTF.Glyph[], indexList?: number[]): TTF.Glyph[];

    /**
     * Adjust glyph positions
     * @param indexList Indices of glyphs to modify
     * @param setting Position adjustment settings
     */
    adjustGlyfPos(indexList: number[] | undefined, setting: {
      /** em box left side whitespace */
      leftSideBearing?: number;
      /** em box right side whitespace */
      rightSideBearing?:number;
      /** vertical align */
      verticalAlign?: number
    }): TTF.Glyph[];

    /**
     * Adjust glyphs
     * @param indexList Indices of glyphs to modify
     * @param setting Glyph adjustment settings
     */
    adjustGlyf(indexList: number[] | undefined, setting: {
        /** reverse glyph contours */
        reverse?: boolean,
        /** mirror glyph horizontally */
        mirror?: boolean,
        /** scale glyph */
        scale?: number,
        /** adjust glyph to em box */
        adjustToEmBox?: boolean,
        /** adjust glyph to em with paddings */
        adjustToEmPadding?: number,
    }): TTF.Glyph[];

    /**
     * Get glyphs
     * @param indexList Indices of glyphs to get
     */
    getGlyf(indexList?: number[]): TTF.Glyph[];

    /**
     * Find glyphs by condition
     * @param condition Search condition
     * @return Indices of found glyphs
     */
    findGlyf(condition: FindCondition): number[];

    /**
     * Replace glyph at index
     * @param glyf Glyph to replace with
     * @param index Index to replace at
     * @return Replaced glyph
     */
    replaceGlyf(glyf: TTF.Glyph, index: number): [TTF.Glyph];

    /**
     * Set glyph list
     * @param glyfList New glyph list
     */
    setGlyf(glyfList: TTF.Glyph[]): TTF.Glyph[];

    /**
     * Sort glyphs by unicode
     * - -1 sort failed
     * - -2 sort failed, has compound glyphs
     * - Glyph[] sorted glyphs
     * */
    sortGlyf(): TTF.Glyph[] | -1 | -2;

    /**
     * Set font name information
     * @param name Name data
     */
    setName(name: Partial<TTF.Name>): TTF.Name;

    /**
     * Set font head information
     * @param head Head data
     */
    setHead(head: Partial<TTF.Head>): TTF.Head;

    /**
     * Set horizontal header information
     * @param fields Hhea data
     */
    setHhea(fields: Partial<TTF.Hhea>): TTF.Hhea;

    /**
     * Set OS/2 table information
     * @param fields OS/2 data
     */
    setOS2(fields: Partial<TTF.OS2>): TTF.OS2;

    /**
     * Set post table information
     * @param fields Post data
     */
    setPost(fields: Partial<TTF.Post>): TTF.Post;

    /** Calculate font metrics */
    calcMetrics(): TTF.Metrics;

    /** Optimize font data */
    optimize(): OptimizeResult;

    /**
     * Convert compound glyphs to simple glyphs
     * @param indexList Indices of glyphs to convert
     * @return Converted glyphs
     */
    compound2simple(indexList?: number[]): TTF.Glyph[];
  }

  interface TTFReaderOptions {
    subset?: number[];      // Font subset array, defaults to []
    hinting?: boolean;      // Whether to preserve hinting information, defaults to false
    kerning?: boolean;      // Whether to preserve kerning information, defaults to false
    compound2simple?: boolean;  // Whether to convert compound glyphs to simple glyphs, defaults to false
  }

  class TTFReader {
    /**
     * Creates a new TTFReader instance
     * @param options - Configuration options for the reader
     */
    constructor(options?: TTFReaderOptions);
    /**
     * read font data from buffer
     * @param buffer
     * @return TTFObject
     */
    protected readBuffer(buffer: ArrayBuffer): TTF.TTFObject;
    /**
     * resolve glyf data, calculate advanceWidth, maxp, subset, etc.
     * @param ttf
     */
    protected resolveGlyf(ttf: TTF.TTFObject): void;
    /**
     * clear ttf tables not used in icon font
     * @param ttf
     * @return
     */
    protected cleanTables(ttf: TTF.TTFObject): void;

    /**
     * read font data from buffer, and resolve glyf data, calculate advanceWidth, maxp, subset, etc.
     * @param buffer
     * @return TTFObject
     */
    read(buffer: ArrayBuffer): TTF.TTFObject;

    dispose(): void;
  }


  interface TTFWriterOptions {
    /** Whether to write empty glyf data (default: false) */
    writeZeroContoursGlyfData?: boolean;
    /** Whether to preserve hinting information (default: false) */
    hinting?: boolean;
    /** Whether to preserve kerning and space information (default: false) */
    kerning?: boolean;
    /** Custom export table structure for modifying specific table items */
    support?: Record<string, any>;
  }

  class TTFWriter {
    /**
     * Creates a new TTFWriter instance
     * @param options - Configuration options for the writer
     */
    constructor(options?: TTFWriterOptions);
    /**
     * Processes the TTF structure for writing
     * @param ttf - TTF data structure to process
     */
    protected resolveTTF(ttf: TTF.TTFObject): void;
    /**
     * Writes the TTF file
     * @param ttf - TTF data structure to write
     * @returns ArrayBuffer containing the TTF file data
     */
    protected dump(ttf: TTF.TTFObject): ArrayBuffer;
    /**
     * Evaluates TTF tables and marks tables that need processing
     * @param ttf - TTF object to evaluate
     */
    protected prepareDump(ttf: TTF.TTFObject): void;
    /**
     * Writes the TTF file to a buffer
     * @param ttf - TTF data structure to write
     * @returns Buffer containing the TTF file data
     */
    write(ttf: TTF.TTFObject): ArrayBuffer;
    dispose(): void;
  }


  /**
   * Binary data reader for TTF/OTF font files
   * @class
   */
  class Reader {
    /** Current offset in the buffer */
    private offset: number;

    /** Length of the buffer being read */
    private length: number;

    /** Whether to use little-endian byte order */
    private littleEndian: boolean;

    /** DataView instance for reading binary data */
    private view: DataView;

    /**
     * Creates a new Reader instance
     * @param {ArrayBuffer | ArrayLike<number>} buffer - The buffer to read from
     * @param {number} [offset=0] - Starting offset in the buffer
     * @param {number} [length] - Length of data to read (defaults to buffer length - offset)
     * @param {boolean} [littleEndian=false] - Whether to use little-endian byte order
     */
    constructor(buffer: ArrayBuffer | ArrayLike<number>, offset?: number, length?: number, littleEndian?: boolean);

    /**
     * Reads data of specified type from the buffer
     * @param {string} type - Data type to read (Int8, Int16, Int32, Uint8, Uint16, Uint32, Float32, Float64)
     * @param {number} [offset] - Position to read from (defaults to current offset)
     * @param {boolean} [littleEndian] - Whether to use little-endian byte order (defaults to instance setting)
     * @returns {number} The read value
     */
    read(type: string, offset?: number, littleEndian?: boolean): number;

    /**
     * Reads a sequence of bytes from the buffer
     * @param {number} offset - Starting position to read from, or length if second parameter is omitted
     * @param {number} [length] - Number of bytes to read
     * @returns {number[]} Array of bytes
     */
    readBytes(offset: number, length?: number): number[];

    /**
     * Reads a string from the buffer
     * @param {number} offset - Starting position to read from, or length if second parameter is omitted
     * @param {number} [length] - Number of characters to read
     * @returns {string} The read string
     */
    readString(offset: number, length?: number): string;

    /**
     * Reads a single character from the buffer
     * @param {number} offset - Position to read from
     * @returns {string} The read character
     */
    readChar(offset: number): string;

    /**
     * Reads a 24-bit unsigned integer
     * @param {number} [offset] - Position to read from (defaults to current offset)
     * @returns {number} The read value
     */
    readUint24(offset?: number): number;

    /**
     * Reads a fixed-point number
     * @param {number} [offset] - Position to read from (defaults to current offset)
     * @returns {number} The read value as a floating point number
     */
    readFixed(offset?: number): number;

    /**
     * Reads a long datetime value
     * @param {number} [offset] - Position to read from (defaults to current offset)
     * @returns {Date} The read date
     */
    readLongDateTime(offset?: number): Date;

    /**
     * Moves the current offset to a specified position
     * @param {number} [offset=0] - Position to move to
     * @returns {this} The reader instance
     */
    seek(offset?: number): this;

    /**
     * Releases resources used by the reader
     */
    dispose(): void;

    readInt8(offset?: number, littleEndian?: boolean): number;
    readInt16(offset?: number, littleEndian?: boolean): number;
    readInt32(offset?: number, littleEndian?: boolean): number;
    readUint8(offset?: number, littleEndian?: boolean): number;
    readUint16(offset?: number, littleEndian?: boolean): number;
    readUint32(offset?: number, littleEndian?: boolean): number;
    readFloat32(offset?: number, littleEndian?: boolean): number;
    readFloat64(offset?: number, littleEndian?: boolean): number;
  }

  /**
   * Data writer for binary operations
   */
  class Writer {
    private offset: number;
    private length: number;
    private littleEndian: boolean;
    private view: DataView;
    private _offset: number;

    /**
     * Writer constructor
     * @param buffer - Buffer array
     * @param offset - Starting offset
     * @param length - Array length
     * @param littleEndian - Whether little-endian
     */
    constructor(buffer: ArrayBuffer, offset?: number, length?: number, littleEndian?: boolean);

    /**
     * Write specified data type
     * @param type - Data type
     * @param value - Value to write
     * @param offset - Offset position
     * @param littleEndian - Whether little-endian
     */
    write(type: string, value: number, offset?: number, littleEndian?: boolean): this;

    /**
     * Write specified byte array
     * @param value - Value to write
     * @param length - Array length
     * @param offset - Starting offset
     */
    writeBytes(value: ArrayBuffer | number[], length?: number, offset?: number): this;

    /**
     * Write empty data
     * @param length - Length
     * @param offset - Starting offset
     */
    writeEmpty(length: number, offset?: number): this;

    /**
     * Write a string
     * @param str - String to write
     * @param length - Length
     * @param offset - Offset
     */
    writeString(str?: string, length?: number, offset?: number): this;

    /**
     * Write a character
     * @param value - Character
     * @param offset - Offset
     */
    writeChar(value: string, offset?: number): this;

    /**
     * Write fixed type
     * @param value - Value to write
     * @param offset - Offset
     */
    writeFixed(value: number, offset?: number): this;

    /**
     * Write long datetime
     * @param value - Date object
     * @param offset - Offset
     */
    writeLongDateTime(value: Date | number | string, offset?: number): this;

    /**
     * Jump to specified offset
     * @param offset - Offset
     */
    seek(offset?: number): this;

    /**
     * Jump to write head position
     */
    head(): this;

    /**
     * Get cached byte array
     */
    getBuffer(): ArrayBuffer;

    /**
     * Dispose resources
     */
    dispose(): void;

    // Auto-generated methods for basic data types
    writeInt8(value: number, offset?: number, littleEndian?: boolean): this;
    writeInt16(value: number, offset?: number, littleEndian?: boolean): this;
    writeInt32(value: number, offset?: number, littleEndian?: boolean): this;
    writeUint8(value: number, offset?: number, littleEndian?: boolean): this;
    writeUint16(value: number, offset?: number, littleEndian?: boolean): this;
    writeUint32(value: number, offset?: number, littleEndian?: boolean): this;
    writeFloat32(value: number, offset?: number, littleEndian?: boolean): this;
    writeFloat64(value: number, offset?: number, littleEndian?: boolean): this;
  }

  /**
   * OTF font reader class for parsing OpenType font files
   */
  class OTFReader {
    /**
     * Font object containing parsed data
     */
    private font: TTF.TTFObject;

    /**
     * Reader options
     */
    private options: {
        /**
         * Subset of glyphs to include, empty array means include all
         */
        subset: number[];
    };

    /**
     * OTF reader constructor
     * @param options Reader options
     */
    constructor(options?: { subset?: number[] });

    /**
     * Read and parse the font buffer
     * @param buffer ArrayBuffer containing the font data
     * @returns Parsed font object
     */
    protected readBuffer(buffer: ArrayBuffer): TTF.TTFObject;

    /**
     * Associate glyph-related information with the font object
     * @param ttf Font object to process
     */
    protected resolveGlyf(ttf: TTF.TTFObject): void;

    /**
     * Remove non-essential tables from the font object
     * @param ttf Font object to clean
     */
    protected cleanTables(font: TTF.TTFObject): void;

    /**
     * Read and parse a font file
     * @param buffer ArrayBuffer containing the font data
     * @returns Parsed font object
     */
    read(buffer: ArrayBuffer): TTF.TTFObject;

    /**
     * Dispose of the reader instance and free resources
     */
    dispose(): void;
  }

  class Font {
    /**
     * create empty font object
     */
    static create(): Font;

    /**
     * create font object with font data
     *
     * @param buffer font data, support format
     * - for ttf, otf, woff, woff2, support ArrayBuffer, Buffer
     * - for svg, support string or Document(parsed svg)
     * @param options font read options
     */
    static create(buffer: FontInput, options: FontReadOptions): Font;

    /**
     * convert buffer data to base64 string
     *
     * @param buffer buffer data
     */
    static toBase64(buffer: FontInput): string;

    /**
     * font data
     * @deprecated use font.get() instead
     */
    data: TTF.TTFObject;

    /**
     * read empty ttf object
     */
    readEmpty(): Font;

    /**
     * read font data
     *
     * @param buffer font data, support format: ArrayBuffer, Buffer, string, Document(parsed svg)
     * @param options font read options
     */
    read(buffer: FontInput, options: FontReadOptions): Font;

    /**
     * write font to Buffer
     * @param options font write options
     */
    write(options: { toBuffer: true } & FontWriteOptions): Buffer;

    /**
     * write font data
     * @param options write options
     */
    write<T extends FontType>(options: {type: T} & FontWriteOptions): T extends 'svg' ? string : FontOutput;

    /**
     * write font to base64 uri
     * @param options font write options
     * @param buffer use another font buffer to base64
     */
    toBase64(options: FontWriteOptions, buffer?: FontInput): string;

    /**
     * use ttf object data
     * @param data ttf object
     */
    set(data: TTF.TTFObject): Font;

    /**
     * get ttf object
     */
    get(): TTF.TTFObject;

    /**
     * optimize glyphs
     * @param outRef optimize results, will get result field after optimize
     */
    optimize(outRef?: OptimizeResult): Font;

    /**
     * tranfrom compound glyph to simple, default true
     */
    compound2simple(): Font;

    /**
     * sort glyphs with unicode order
     */
    sort(): Font;

    /**
     * find glyphs with conditions
     *
     * @param condition find conditions
     */
    find(condition: FindCondition): TTF.Glyph[];

    /**
     * merge two font object
     *
     * @param font another font object
     * @param options merge options
     */
    merge(font: Font, options: MergeOptions): Font;

    /**
     * get ttf helper instance
     */
    getHelper(): TTFHelper;
  }

  interface Woff2 {
    /**
     * is woff2 wasm loaded
     */
    isInited: () => boolean;

    /**
     * init woff2 wasm module
     *
     * @param wasmUrl wasm file url or wasm file buffer, in nodejs enviroment wasmUrl can be omited.
     */
    init(wasmUrl?: string | ArrayBuffer): Promise<Woff2>;

    /**
     * convert ttf buffer to woff buffer
     *
     * @param ttfBuffer ttf data buffer
     */
    encode(ttfBuffer: ArrayBuffer | Buffer | UInt8[]): Uint8Array;

    /**
     * convert woff2 buffer to ttf buffer
     *
     * @param woff2Buffer woff2 data buffer
     */
    decode(woff2Buffer: ArrayBuffer | Buffer | UInt8[]): Uint8Array;
  }

  interface IconObject {
    /** Font family name */
    fontFamily: string;
    /** Prefix used for icon classes */
    iconPrefix: string;
    /** List of glyphs in the icon font */
    glyfList: Array<{
      /** HTML entity code for the glyph (e.g. "&#x61;") */
      code: string;
      /** Unicode values as comma-separated string (e.g. "\61,\62") */
      codeName: string;
      /** Name of the glyph */
      name: string;
      /** Unique identifier for the glyph */
      id: string;
    }>;
  }

  interface Core {
    /**
     * Font class
     */
    Font: typeof Font;

    /**
     * create font object with font data
     *
     * @param buffer font data, support format
     * - for ttf, otf, woff, woff2, support ArrayBuffer, Buffer
     * - for svg, support string or Document(parsed svg)
     * @param options font read options
     */
    createFont(buffer: FontInput, options: FontReadOptions): Font;

    /**
     * create empty font object
     */
    createFont(): Font;

    /**
     * woff2 module
     */
    woff2: Woff2;
    /**
     * TTF class
     */
    TTF: typeof TTFHelper;
    /**
     * TTFReader class
     */
    TTFReader: typeof TTFReader;
    /**
     * TTFWriter class
     */
    TTFWriter: typeof TTFWriter;
    /**
     * Reader Table base class
     */
    Reader: typeof Reader;
    /**
     * Writer Table base class
     */
    Writer: typeof Writer;
    /**
     * OTFReader class
     */
    OTFReader: typeof OTFReader;
    /**
     * convert otf font buffer to ttf object
     * @param arrayBuffer font data
     * @param options
     * @returns
     */
    otf2ttfobject: (arrayBuffer: ArrayBuffer, options: any) => TTF.TTFObject;
    /**
     * convert ttf font buffer to eot font
     * @param arrayBuffer font data
     * @param options
     * @returns
     */
    ttf2eot: (arrayBuffer: ArrayBuffer, options?: any) => ArrayBuffer;
    /**
     * convert eot font buffer to ttf
     * @param arrayBuffer font data
     * @param options
     * @returns
     */
    eot2ttf: (arrayBuffer: ArrayBuffer, options?: any) => ArrayBuffer;
    /**
     * convert ttf font buffer to woff
     * @param arrayBuffer font data
     * @param options
     * @returns
     */
    ttf2woff: (
      arrayBuffer: ArrayBuffer,
      options?: {
        metadata: any;
        deflate?: (rawData: UInt8[]) => UInt8[];
      }
    ) => ArrayBuffer;
    /**
     * convert woff font buffer to ttf
     * @param arrayBuffer font data
     * @param options
     * @returns
     */
    woff2ttf: (
      buffer: ArrayBuffer,
      options?: {
        inflate?: (deflatedData: UInt8[]) => UInt8[];
      }
    ) => ArrayBuffer;
    /**
     * convert ttf font buffer to svg font
     * @param arrayBuffer font data
     * @param options
     * @returns
     */
    ttf2svg: (
      arrayBuffer: ArrayBuffer | TTF.TTFObject,
      options?: {
        metadata: string;
      }
    ) => string;
    /**
     * convert svg font to ttf object
     * @param svg svg text
     * @param options
     * @param options.combinePath if true, combine path to one glyph, default is false
     * @returns
     */
    svg2ttfobject: (
      svg: string | Document,
      options?: { combinePath: boolean }
    ) => TTF.TTFObject;
    /**
     * convert ttf font buffer to base64 uri
     * @param arrayBuffer ttf data
     * @returns
     */
    ttf2base64: (arrayBuffer: ArrayBuffer) => string;
    /**
     * convert ttf font to icon array
     * @param arrayBuffer ttf data
     * @param options
     * @returns
     */
    ttf2icon: (
      arrayBuffer: ArrayBuffer | TTF.TTFObject,
      options?: {
        metadata: any;
        iconPrefix?: string;
      }
    ) => IconObject;
    /**
     * convert ttf font buffer to woff2 font
     * @param arrayBuffer ttf data
     * @param options
     * @returns
     */
    ttftowoff2: (arrayBuffer: ArrayBuffer, options?: any) => Uint8Array;
    /**
     * convert woff2 font buffer to ttf font
     * @param arrayBuffer ttf data
     * @param options
     * @returns
     */
    woff2tottf: (arrayBuffer: ArrayBuffer, options?: any) => Uint8Array;
    /**
     * convert Buffer to ArrayBuffer
     * @param buffer
     * @returns
     */
    toArrayBuffer: (buffer: Buffer | UInt8[]) => ArrayBuffer;
    /**
     * convert ArrayBuffer to Buffer
     * @param buffer
     * @returns
     */
    toBuffer: (buffer: ArrayBuffer | UInt8[]) => Buffer;
  }

  /**
   * core exports
   */
  const core: Core;
}

// Named exports
export const Font: typeof FontEditor.Font;
export const woff2: FontEditor.Woff2;
export const createFont: FontEditor.Core["createFont"];

// Default export
declare const fonteditorCore: FontEditor.Core;
export default fonteditorCore;
