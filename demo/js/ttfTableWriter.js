/**
 * @file ttfTableWriter.js
 * @author mengke01
 * @date
 * @description
 * 测试ttf表写
 */

/* eslint-disable JS029 */

import Reader from 'fonteditor-core/ttf/reader';
import Writer from 'fonteditor-core/ttf/writer';
import supportTables from 'fonteditor-core/ttf/table/support';


// 支持写的表, 注意表顺序
const tableList = [
    'OS/2',
    'cmap',
    'glyf',
    'head',
    'hhea',
    'hmtx',
    'loca',
    'maxp',
    'name',
    'post'
];


function resolve(ttf) {
    ttf.numTables = tableList.length;
    ttf.entrySelector = Math.floor(Math.log(tableList.length) / Math.LN2);
    ttf.searchRange = Math.pow(2, ttf.entrySelector) * 16;
    ttf.rangeShift = tableList.length * 16 - ttf.searchRange;

    // 将glyf的代码点按小到大排序
    ttf.glyf.forEach(function (glyf) {
        if (glyf.unicode) {
            glyf.unicode = glyf.unicode.sort();
        }
    });

    return ttf;
}


function write(ttf) {

    // 用来做写入缓存的对象，用完后删掉
    ttf.support = {};


    let OS2Tbl = new supportTables['OS/2']();
    let size = OS2Tbl.size(ttf);

    // 写入maxp
    let maxpTbl = new supportTables['maxp']();
    size = maxpTbl.size(ttf);

    let maxpWriter = new Writer(new ArrayBuffer(size));
    maxpTbl.write(maxpWriter, ttf);

    // 写入glyf
    let glyfTbl = new supportTables['glyf']();
    size = glyfTbl.size(ttf);

    let glyfWriter = new Writer(new ArrayBuffer(size));
    glyfTbl.write(glyfWriter, ttf);

    // 写入loca
    let locaTbl = new supportTables['loca']();
    let locaWriter = new Writer(new ArrayBuffer(locaTbl.size(ttf)));
    locaTbl.write(locaWriter, ttf);


    // 写入cmap
    let cmapTbl = new supportTables['cmap']();
    let cmapWriter = new Writer(new ArrayBuffer(cmapTbl.size(ttf)));
    cmapTbl.write(cmapWriter, ttf);

    // 写入hmtx
    let hmtxTbl = new supportTables['hmtx']();
    let hmtxWriter = new Writer(new ArrayBuffer(hmtxTbl.size(ttf)));
    hmtxTbl.write(hmtxWriter, ttf);

    // 写入name
    let nameTbl = new supportTables['name']();
    let nameWriter = new Writer(new ArrayBuffer(nameTbl.size(ttf)));
    nameTbl.write(nameWriter, ttf);


    // 写入post
    let postTbl = new supportTables['post']();
    let postWriter = new Writer(new ArrayBuffer(postTbl.size(ttf)));
    postTbl.write(postWriter, ttf);


    // 写入OS2
    OS2Tbl = new supportTables['OS/2']();
    let OS2Writer = new Writer(new ArrayBuffer(OS2Tbl.size(ttf)));
    OS2Tbl.write(OS2Writer, ttf);


    // 写入hhea
    let hheaTbl = new supportTables['hhea']();
    let hheaWriter = new Writer(new ArrayBuffer(hheaTbl.size(ttf)));
    hheaTbl.write(hheaWriter, ttf);


    // 读取测试

    let maxpReader = new Reader(maxpWriter.getBuffer());
    maxpTbl.offset = 0;
    ttf.maxp = maxpTbl.read(maxpReader, ttf);

    let locaReader = new Reader(locaWriter.getBuffer());
    locaTbl.offset = 0;
    ttf.loca = locaTbl.read(locaReader, ttf);
    console.log('loca readed');
    console.log(ttf.loca);

    let glyfReader = new Reader(glyfWriter.getBuffer());
    glyfTbl.offset = 0;
    ttf.tables = {
        glyf: {
            length: 1
        }
    };
    ttf.readOptions = {};
    let glyf = glyfTbl.read(glyfReader, ttf);
    console.log('glyf readed');
    console.log(glyf);

    let cmapReader = new Reader(cmapWriter.getBuffer());
    cmapTbl.offset = 0;
    let cmap = cmapTbl.read(cmapReader, ttf);
    console.log('cmap readed');
    console.log(cmap);


    let hmtxReader = new Reader(hmtxWriter.getBuffer());
    hmtxTbl.offset = 0;
    let hmtx = hmtxTbl.read(hmtxReader, ttf);
    console.log('hmtx readed');
    console.log(hmtx);


    let nameReader = new Reader(nameWriter.getBuffer());
    nameTbl.offset = 0;
    let name = nameTbl.read(nameReader, ttf);
    console.log('name readed');
    console.log(name);


    let postReader = new Reader(postWriter.getBuffer());
    postTbl.offset = 0;
    ttf.tables = ttf.tables || {};
    ttf.tables.post = {
        length: postWriter.offset
    };
    let post = postTbl.read(postReader, ttf);
    console.log('post readed');
    console.log(post);


    let OS2Reader = new Reader(OS2Writer.getBuffer());
    OS2Tbl.offset = 0;
    let OS2 = OS2Tbl.read(OS2Reader, ttf);
    console.log('OS2 readed');
    console.log(OS2);

    let hheaReader = new Reader(hheaWriter.getBuffer());
    hheaTbl.offset = 0;
    let hhea = hheaTbl.read(hheaReader, ttf);
    console.log('hhea readed');
    console.log(hhea);

    delete ttf.support;
}



let entry = {

    init() {
        $.getJSON('./data/baiduHealth.json', function (ttf) {
            resolve(ttf);
            write(ttf);
        });

    }
};

entry.init();
