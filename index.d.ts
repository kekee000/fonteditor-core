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

    type FontInput = ArrayBuffer | Buffer | string;
    type FontOutput = FontInput;

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
         * keep hinting or not, default false
         */
        hinting?: boolean;

        /**
         * tranfrom compound glyph to simple, default true
         */
        compound2simple?: boolean;

        /**
         * inflate function for woff
         *
         * @see pako.inflate https://github.com/nodeca/pako
         */
        inflate?: (deflatedData: UInt8[]) => UInt8[];

        /**
         * combine svg paths to one glyph in one svg file. default true
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
         * svg output meta data
         */
        metadata?: string;

        /**
         * deflate function for woff
         *
         * @see pako.deflate https://github.com/nodeca/pako
         */
        deflate?: (rawData: UInt8[]) => UInt8[];
    }

    type FindCondition = {
        unicode?: TTF.CodePoint[];
        name?: string;
        filter?: (glyph: TTF.Glyph) => boolean;
    };

    type MergeOptions = ({

        /**
         * scale glyphs to fit fonts. default true
         */
        scale: boolean;
    }) | ({

        /**
         * auto adjuct glyphs to the first font em box. default true
         */
        adjustGlyf: boolean;
    });

    class Font {

        /**
         * create font object with font data
         *
         * @param buffer font data, support format: ArrayBuffer, Buffer, string
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
         * create empty ttf object
         */
        readEmpty(): Font;

        /**
         * read font data
         *
         * @param buffer font data, support format: ArrayBuffer, Buffer, string
         * @param options font read options
         */
        read(buffer: FontInput, options: FontReadOptions): Font;

        /**
         * write font data
         * @param options write options
         */
        write(options: FontWriteOptions): FontOutput;

        write(options: {type: 'svg'} & FontWriteOptions): string;

        write(options: {toBuffer: true} & FontWriteOptions): Buffer;

        toBase64(options: FontWriteOptions, buffer: FontInput): string;

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
         * @param outRef optimize results
         */
        optimize(outRef: {result: any}): Font;

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
        isInited: boolean;

        /**
         * init woff2 wasm module
         *
         * @param wasmUrl wasm file url or wasm file buffer
         */
        init(wasmUrl: string | ArrayBuffer): Promise<Woff2>;

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
        Font: typeof Font;
        woff2: Woff2;
        TTF: any;
        TTFReader: any;
        TTFWriter: any;
        Reader: any;
        Writer: any;
        OTFReader: any;
        otf2ttfobject: (otfBuffer: any, options: any) => any;
        ttf2eot: (ttfBuffer: ArrayBuffer, options?: any) => ArrayBuffer;
        eot2ttf: (eotBuffer: ArrayBuffer, options?: any) => ArrayBuffer;
        ttf2woff: (ttfBuffer: ArrayBuffer, options?: {
            metadata: any;
            deflate?: (rawData: UInt8[]) => UInt8[];
        }) => ArrayBuffer;
        woff2ttf: (woffBuffer: ArrayBuffer, options?: {
            inflate?: (deflatedData: UInt8[]) => UInt8[];
        }) => ArrayBuffer;
        ttf2svg: (ttfBuffer: ArrayBuffer | TTF.TTFObject, options?: {
            metadata: string;
        }) => string;
        svg2ttfobject: (svg: string, options?: any) => TTF.TTFObject;
        ttf2base64: (arrayBuffer: ArrayBuffer) => string;
        ttf2icon: (ttfBuffer: ArrayBuffer | TTF.TTFObject, options?: {
            metadata: any;
        }) => any;
        ttftowoff2: (ttfBuffer: ArrayBuffer, options?: any) => Uint8Array;
        woff2tottf: (woff2Buffer: ArrayBuffer, options?: any) => Uint8Array;
    }

    /**
     * core exports
     */
    const core: Core;
}

export const Font: typeof FontEditor.Font;
export const woff2: FontEditor.Woff2;
export default FontEditor.core;
