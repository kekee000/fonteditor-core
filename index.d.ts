/**
 * @file index.d.ts
 * @author mengke01(kekee000@gmail.com)
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
        'OS/2': OS2;
    };
}

export namespace FontEditor {

    type FontType = 'ttf' | 'otf' | 'eot' | 'woff' | 'woff2' | 'svg';

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
        support?:  {
            /**
             * overwrite head
             */
            head?: {
                xMin?: number;
                yMin?: number;
                xMax?: number;
                yMax?: number;
            },
            /**
             * overwrite hhea
             */
            hhea?: {
                advanceWidthMax?: number;
                xMaxExtent?: number;
                minLeftSideBearing?: number;
                minRightSideBearing?: number;
            }
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

    type MergeOptions = ({

        /**
         * scale glyphs to fit fonts. default true
         */
        scale: number;
    }) | ({

        /**
         * auto adjuct glyphs to the first font em box. default true
         */
        adjustGlyf: boolean;
    });

    type OptimizeResult = {
        /**
         * result
         *
         * - true optimize success
         * - {repeat} repeat glyf codepoints
         */
        result: true | {
            /**
             * repeat glyf codepoints
             */
            repeat: number[];
        };

    };

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
         * write font to svg string
         * @param options font write options
         */
        write(options: {type: 'svg'} & FontWriteOptions): string;

        /**
         * write font to Buffer
         * @param options font write options
         */
        write(options: {toBuffer: true} & FontWriteOptions): Buffer;

        /**
         * write font data
         * @param options write options
         */
        write(options: FontWriteOptions): FontOutput;

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

    interface Core {
        /**
         * Font class
         */
        Font: typeof Font;
        /**
         * woff2 module
         */
        woff2: Woff2;
        /**
         * TTF class
         */
        TTF: any;
        /**
         * TTFReader class
         */
        TTFReader: any;
        /**
         * TTFWriter class
         */
        TTFWriter: any;
        /**
         * Reader Table base class
         */
        Reader: any;
        /**
         * Writer Table base class
         */
        Writer: any;
        /**
         * OTFReader class
         */
        OTFReader: any;
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
        ttf2woff: (arrayBuffer: ArrayBuffer, options?: {
            metadata: any;
            deflate?: (rawData: UInt8[]) => UInt8[];
        }) => ArrayBuffer;
        /**
         * convert woff font buffer to ttf
         * @param arrayBuffer font data
         * @param options
         * @returns
         */
        woff2ttf: (buffer: ArrayBuffer, options?: {
            inflate?: (deflatedData: UInt8[]) => UInt8[];
        }) => ArrayBuffer;
        /**
         * convert ttf font buffer to svg font
         * @param arrayBuffer font data
         * @param options
         * @returns
         */
        ttf2svg: (arrayBuffer: ArrayBuffer | TTF.TTFObject, options?: {
            metadata: string;
        }) => string;
        /**
         * convert svg font to ttf object
         * @param svg svg text
         * @param options
         * @param options.combinePath if true, combine path to one glyph, default is false
         * @returns
         */
        svg2ttfobject: (svg: string | Document, options?: {combinePath: boolean}) => TTF.TTFObject;
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
        ttf2icon: (arrayBuffer: ArrayBuffer | TTF.TTFObject, options?: {
            metadata: any;
            iconPrefix?: string;
        }) => any;
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

export const Font: typeof FontEditor.Font;
export const woff2: FontEditor.Woff2;
export default FontEditor.core;
