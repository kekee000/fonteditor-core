/**
 * @file lang
 * @author mengke01(kekee000@gmail.com)
 */
import assert from 'assert';
import * as lang from 'fonteditor-core/common/lang';


describe('test overwrite', function () {

    it('test normal object', function () {
        let result = lang.overwrite(
            {
                x: 1
            },
            {
                x: 2
            }
        );
        assert.equal(result.x, 2);
    });

    it('test null object', function () {
        let result = lang.overwrite(
            {
                x: 1
            },
            null
        );
        assert.equal(result.x, 1);

        result = lang.overwrite(
            {
                x: 1
            },
            undefined
        );
        assert.equal(result.x, 1);

        result = lang.overwrite(
            {
                x: 1
            },
            false
        );
        assert.equal(result.x, 1);
    });

    it('test fields', function () {
        let result = lang.overwrite(
            {
                x: 1
            },
            {
                x: 2
            },
            ['x']
        );
        assert.equal(result.x, 2);

        result = lang.overwrite(
            {
                x: 1
            },
            {
                x: 2
            },
            ['y']
        );
        assert.equal(result.x, 1);

    });

    it('test deep overwrite', function () {
        let result = lang.overwrite(
            {
                level1: {
                    x: 1
                }
            },
            {
                level1: {
                    y: 3
                }
            }
        );
        assert.equal(result.level1.y, 3);

        result = lang.overwrite(
            {
                level1: {
                    x: 1
                }
            },
            {
                level1: {
                    x: 2
                }
            }
        );
        assert.equal(result.level1.x, 2);

    });


    it('test null overwrite', function () {
        let result = lang.overwrite(
            {
                level1: {
                    x: 1
                }
            },
            {
                level1: {
                    x: null
                }
            }
        );
        assert.equal(result.level1.x, null);
    });

    it('test string overwrite', function () {
        assert.throws(function () {
            lang.overwrite(
                'abcde',
                {
                    0: 'f'
                }
            );
        });
    });
});



describe('test equals', function () {

    it('test normal object', function () {
        let result = lang.equals(
            {
                x: 1
            },
            {
                x: 2
            }
        );
        assert.equal(result, false);


        result = lang.equals(
            {
                x: null
            },
            {
                x: undefined
            }
        );
        assert.equal(result, false);

        result = lang.equals(
            {
                x: 1
            },
            {
                x: '1'
            }
        );
        assert.equal(result, false);

    });

    it('test basic type', function () {
        let result = lang.equals(
            null,
            undefined
        );
        assert.equal(result, true);

        result = lang.equals(
            1,
            2
        );
        assert.equal(result, false);

        result = lang.equals(
            1,
            '1'
        );
        assert.equal(result, false);

    });

    it('test deep equals', function () {
        let result = lang.equals(
            {
                level1: {
                    x: 1
                }
            },
            {
                level1: {
                    y: 1
                }
            }
        );
        assert.equal(result, false);

        result = lang.equals(
            {
                level1: {
                    x: 1
                }
            },
            {
                level1: {
                    x: 1
                }
            }
        );
        assert.equal(result, true);
    });
});
