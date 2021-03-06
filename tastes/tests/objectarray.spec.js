import ObjectArray from 'index';
var beforeEach = window.beforeEach;
// var aftereach = window.afterEach;

/**
*  @test {ObjectArray#data}
*/
describe('Data getter and setter', function () {
  it('should get and set data', function () {
    let i = new ObjectArray();

    i.data = {test: 'fixture'};
    i.data.test.should.equal('fixture');
  });
});

/**
*  @test {ObjectArray#throwing}
*/
describe('Global throwing behaviour override', function () {
  it('should always throw an exception', function () {
    let i = new ObjectArray();

    i.throwing(true);
    expect(i.pull.bind(i, 'key')).to.throw(TypeError);
    expect(i.dataset.bind(i, 'key', undefined, false)).to.throw(TypeError);
  });

  it('should never throw an exception', function () {
    let i = new ObjectArray();

    i.throwing(false);
    expect(i.pull('key')).to.be.undefined;
    expect(i.dataset('key', undefined, false)).to.be.undefined;
  });
});

/**
*  @test {ObjectArray#pKey}
*/
describe('Parent key memorizer', function () {

  it('should use memorizer when using data read/write methods', function () {
    let i = new ObjectArray();

    i.pKey('test1');
    i.push('test11', 'fixture');
    i.pull('test11').should.equal('fixture');
    i._data.should.eql({test1: { test11: 'fixture'}});
  });

});

/**
*  @test {ObjectArray#_key}
*/
describe('Key constructor', function () {

  it('should return dotted key', function () {
    let i = new ObjectArray();

    i.push('test1.test21', 'fixture');
    i._key('test1').should.equal('test1');
    i._key('test21', 'test1').should.equal('test1.test21');
  });

  it('should return undefined', function () {
    let i = new ObjectArray();

    i.push('test1.test21', 'fixture');
    expect(i._key('test2', undefined, false)).to.be.undefined;
    expect(i._key('test22', 'test1', false)).to.be.undefined;
  });

  it('should throw exception', function () {
    let i = new ObjectArray();

    i.push('test1.test21', 'fixture');
    expect(i._key.bind(i, 'test2', undefined, true)).to.throw(TypeError);
    expect(i._key.bind(i, 'test22', 'test2', true)).to.throw(TypeError);
  });
});

/**
*  @test {ObjectArray#clone}
*  @test {ObjectArray#flatten}
*/
describe('Cloning ObjectArray', function () {

  it('should return a clone with empty data', function () {
    let i = new ObjectArray();

    i.clone().should.not.equal(i);
    i.clone().data.should.eql(i.data);
  });

  it('should return a clone with nested data', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        testx: { test2x: 0 },
        testy: {
          test2y1: true,
          test2y2: 'fix'
        }
      }
    });

    i.clone().should.not.equal(i);
    i.clone().data.should.eql(i.data);
  });

  it('should restore data in clone after flattening original', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        testx: { test2x: 0 },
        testy: {
          test2y1: true,
          test2y2: 'fix'
        }
      }
    });

    i.flatten().clone().should.not.equal(i);
    i.clone().data.should.eql(i.data);
  });

  it('should restore data in clone after dotted flattening original', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        test21: 0,
        test22: true
      }
    });

    i.flatten(true).clone(false).should.not.equal(i);
    i.clone(false).data.should.eql({
      test1: 'fixture',
      test2: {
        test21: 0,
        test22: true
      }
    });
  });
});

/**
*  @test {ObjectArray#empty}
*/
describe('Empty ObjectArray or remove subset', function () {
  let i;

  let data = {
    test1: 'fixture',
    test2: {
      test21: 0,
      test22: true
    }
  };

  beforeEach(function () {
    i = new ObjectArray(data);
  });

  it('should empty all data', function () {
    i.empty();
    i._data.should.eql({});
  });

  it('should empty subset', function () {
    i.empty('test2');
    i._data.should.eql({test1: 'fixture'});
  });

  it('should throw an exception if key missing', function () {
    expect(i.empty.bind(i, 'test3')).to.throw(TypeError);
  });

  it('should do nothing if key missing', function () {
    i.empty('test3', undefined, false);
    i._data.should.eql(data);
  });
});

/**
*  @test {ObjectArray#length}
*/
describe('Length', function () {
  let i = new ObjectArray();

  it('should returns length', function () {
    i.length().should.equal(0);
    i.push('test', 'fixture');
    i.length().should.equal(1);
    i.push('test2', 'fixture2');
    i.length().should.equal(2);
  });

  it('should throw an exception if key missing', function () {
    expect(i.length.bind(i, 'dat.wrong.path')).to.throw(TypeError);
  });

  it('should return undefined if key missing', function () {
    expect(i.length('dat.wrong.path', undefined, false)).to.be.undefined;
  });
});

describe('ObjectArray keys and values', function () {

  it('should returns keys', function () {
    let i = new ObjectArray();

    i.keys().should.eql([]);
    i.push('test', 'fixture');
    i.keys().should.eql(['test']);
    i.push('test2', 'fixture2');
    i.keys().should.eql(['test', 'test2']);
    expect(i.keys.bind(i, 'dat.wrong.path')).to.throw(TypeError);
  });

  it('should returns values', function () {
    let i = new ObjectArray();

    i.values().should.eql([]);
    i.push('test', 'fixture');
    i.values().should.eql(['fixture']);
    i.push('test2', 'fixture2');
    i.values().should.eql(['fixture', 'fixture2']);
    expect(i.values.bind(i, 'dat.wrong.path')).to.throw(TypeError);
    expect(i.values('dat.wrong.path', undefined, false)).to.eql([]);
  });
  it('should returns right keys and values for dotted object', function () {
    var i = new ObjectArray({
      dat: {
        long: {
          path: 'fixture1',
          dream: 'fixture2'
        }
      }
    });

    i.keys().should.eql(['dat']);
    i.values().should.eql([{long: {path: 'fixture1', dream: 'fixture2'}}]);
    i.keys('dat.long').should.eql(['path', 'dream']);
    i.values('dat.long').should.eql(['fixture1', 'fixture2']);
    expect(i.keys.bind(i, 'dat.short')).to.throw(TypeError);
    expect(i.values.bind(i, 'dat.short')).to.throw(TypeError);
  });
});

describe('Has key, data fetch and parent data fetch', function () {
  it('should find key', function () {
    let i = new ObjectArray({
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    });

    i.has('test').should.equal(true);
    i.has('test2').should.equal(true);
    i.has('test2.test21').should.equal(true);
    i.has('test2.test22').should.equal(true);
    i.has('test3').should.equal(false);
    i.has('test2.test23').should.equal(false);
  });

  it('should find data', function () {
    let i = new ObjectArray({
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    });

    i.dataset('test').should.equal('fixture');
    i.dataset('test2').should.eql({
      test21: 'fixture21',
      test22: 'fixture22'
    });
    i.dataset('test2.test21').should.equal('fixture21');
    i.dataset('test21', 'test2').should.equal('fixture21');
    expect(i.dataset(i, 'test3')).to.be.undefined;
    expect(i.dataset('test23', 'test2')).to.be.undefined;
    expect(i.dataset.bind(i, 'test3', undefined, true)).to.throw(TypeError);
    expect(i.dataset.bind(i, 'test23', 'test2', true)).to.throw(TypeError);
    i.throwing(false);
    expect(i.dataset('test3')).to.be.undefined;
    expect(i.dataset('test23', 'test2')).to.be.undefined;
    expect(i.dataset('test3', undefined, true)).to.be.undefined;
    expect(i.dataset('test23', 'test2', true)).to.be.undefined;
    i.throwing(true);
    expect(i.dataset.bind(i, 'test3')).to.throw(TypeError);
    expect(i.dataset.bind(i, 'test23', 'test2')).to.throw(TypeError);
    expect(i.dataset.bind(i, 'test3', undefined, false)).to.throw(TypeError);
    expect(i.dataset.bind(i, 'test23', 'test2', false)).to.throw(TypeError);
  });

  it('should find parent key', function () {
    let i = new ObjectArray({
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    });

    expect(i.parentKey('test')).to.equal(undefined);
    i.parentKey('test2.test21').should.equal('test2');
  });
});

describe('Check key/value', function () {
  it('Strict equality', function () {
    let i = new ObjectArray({
      test: 'fixture',
      test2: {
        test21: 0,
        test22: '0'
      }
    });

    i.check('test2.test21', 0).should.be.true;
    i.check('test2.test21', '0').should.be.false;
    i.check('test2.test21', 'fixture').should.be.false;
    i.check('test22', '0', 'test2').should.be.true;
    i.check('test22', 0, 'test2').should.be.false;
  });

  it('Loose equality', function () {
    let i = new ObjectArray({
      test: 'fixture',
      test2: {
        test21: 0,
        test22: '0'
      }
    });

    i.check('test2.test21', 0, '', false).should.be.true;
    i.check('test2.test21', '0', '', false).should.be.true;
    i.check('test22', '0', 'test2', false).should.be.true;
    i.check('test22', 0, 'test2', false).should.be.true;
    i.check('test2.test21', 'fixture', '', false).should.be.false;
  });
});

describe('Flatten ObjectArray', function () {
  it('should change nothing if data empty', function () {
    let i = new ObjectArray();

    i.flatten().should.eql(i);
    i.data.should.eql({});
  });

  it('should change nothing if data already flattened', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: 0
    });

    i.flatten().should.eql(i);
    i.data.should.eql({test1: 'fixture', test2: 0});
  });

  it('should flatten dataset', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        test21: 0,
        test22: true
      }
    });

    i.flatten().should.eql(i);
    i.data.should.eql({test1: 'fixture', test21: 0, test22: true});
  });

  it('should flatten dataset and replace', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        test1: 0,
        test2: true
      }
    });

    i.flatten().should.eql(i);
    i.data.should.eql({test1: 0, test2: true});
  });

  it('should flatten dataset and dot keys', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        test1: 0,
        test2: true
      }
    });

    i.flatten(true).should.eql(i);
    i.data.should.eql({test1: 'fixture', 'test2.test1': 0, 'test2.test2': true});
  });

  it('should flatten subdataset and no change', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        test21: 0,
        test22: true
      }
    });

    i.flatten(false, 'test2').should.eql(i);
    i.data.should.eql({test1: 'fixture', test2: {test21: 0, test22: true}});
  });

  it('should throw an exception if key does not exist', function () {
    let i = new ObjectArray();

    expect(i.flatten.bind(i, true, 'test3')).to.throw(TypeError);
  });

  it('should flatten subdataset', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        testx: { test2x: 0 },
        testy: {
          test2y1: true,
          test2y2: 'fix'
        }
      }
    });

    i.flatten(false, 'test2').should.eql(i);
    i.data.should.eql({test1: 'fixture', test2: {test2x: 0, test2y1: true, test2y2: 'fix'}});
  });

  it('should flatten subdataset and dot keys', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        testx: { test2x: 0 },
        testy: {
          test2y1: true,
          test2y2: 'fix'
        }
      }
    });

    i.flatten(true, 'test2').should.eql(i);
    i.data.should.eql({test1: 'fixture', test2: {'testx.test2x': 0, 'testy.test2y1': true, 'testy.test2y2': 'fix'}});
  });

});

describe('Data manipulation', function () {

  it('should create all needed keys', function () {
    let i = new ObjectArray();

    i.push('dat.really.long.path', 'fixture');
    i.data.should.eql({
      dat: {
        really: {
          long: {
            path: 'fixture'
          }
        }
      }
    });
  });

  it('should push or import ObjectArray without losing data', function () {
    let o = new ObjectArray({
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    });

    let i = new ObjectArray().push('itest', o);

    i.data.should.eql({itest: {
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    }});

    i = new ObjectArray().push('itest', o, 'dat.path');

    i.data.should.eql({dat: {path: {itest: {
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    }}}});

    i = new ObjectArray().import(o);

    i.data.should.eql({
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    });

    i = new ObjectArray().import(o, 'dat.path');

    i.data.should.eql({dat: {path: {
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    }}});
  });

  it('should use pull as an alias to dataset', function () {
    let o = new ObjectArray({
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    });

    o.pull().should.eql({
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    });

    o.pull('test2.test22').should.equal('fixture22');
  });

  it('should use pull as an alias to dataset with parent key', function () {
    let o = new ObjectArray({
      test: 'fixture',
      test2: {
        test21: 'fixture21',
        test22: 'fixture22'
      }
    });

    o.pull('test21', 'test2').should.equal('fixture21');
  });

  it('should create all needed keys', function () {
    let i = new ObjectArray();

    i.import({
      'dat.really.long.path': 'fixture1',
      'dat.really.long.dream': 'fixture2',
      'dat.shorter.path': 'fixture3'
    });
    i.data.should.eql({
      dat: {
        really: {
          long: {
            path: 'fixture1',
            dream: 'fixture2'
          }
        },
        shorter: {
          path: 'fixture3'
        }
      }
    });
  });
  it('should create all needed keys', function () {
    let i = new ObjectArray();

    i.push('dat.really.long.path', 'fixture1');
    i.push('dream', 'fixture2', 'dat.really.long');
    i.import({
      'shorter.path': 'fixture3'
    }, 'dat');
    i.data.should.eql({
      dat: {
        really: {
          long: {
            path: 'fixture1',
            dream: 'fixture2'
          }
        },
        shorter: {
          path: 'fixture3'
        }
      }
    });
  });
  it('should push simple data', function () {
    let i = new ObjectArray();

    i.push('test', 'fixture');
    i._data.should.eql({test: 'fixture'});
  });
  it('should remove simple data', function () {
    let i = new ObjectArray();

    i.push('test', 'fixture');
    i.remove('test');
    i._data.should.eql({});
  });

  it('should push dotted data', function () {
    let i = new ObjectArray();

    i.push('test.dot', 'fixture')
      .push('test.dot2', 'fixture2');
    i._data.should.eql({test: {dot: 'fixture', dot2: 'fixture2'}});
  });

  it('should remove dotted data', function () {
    let i = new ObjectArray();

    i.push('test.dot', 'fixture')
      .push('test.dot2', 'fixture2')
      .empty('test.dot2')
      ._data.should.eql({test: {dot: 'fixture'}});
  });

  it('should throw an exception if key not a string', function () {
    let i = new ObjectArray();

    expect(i.push.bind(i, new ObjectArray())).to.throw(TypeError);
  });

  it('should throw an exception if parent key is not a string', function () {
    let i = new ObjectArray();

    expect(i.push.bind(i, 'a', 0, new ObjectArray())).to.throw(TypeError);
  });
});

describe('Fetch and getset', function () {
  it('should getset data and throw an exception if inexistent key', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        testx: { test2x: 0 },
        testy: {
          test2y1: true,
          test2y2: 'fix'
        }
      }
    });

    // getters
    i.getset('test1')['get'].should.equal('fixture');
    i.getset('test2.testx.test2x')['get'].should.equal(0);
    i.getset('test2x', undefined, 'test2.testx')['get'].should.equal(0);
    i.getset(undefined, undefined, 'test2.testx')['get'].should.eql({test2x: 0});
    expect(i.getset.bind(i, 'test3')).to.throw(TypeError);
    expect(i.getset.bind(i, 'testx', undefined, 'test3')).to.throw(TypeError);

    // setters
    i.getset('test1', 'fixture2')['set'].should.be.true;
    i.pull('test1').should.equal('fixture2');
    i.getset('test2.testx', 'test1')['set'].should.be.true;
    i.pull('test2.testx').should.equal('test1');
    i.getset('testx', 'test2', 'test2')['set'].should.be.true;
    i.pull('testx', 'test2').should.equal('test2');
    i.getset({test3: 'test3'})['set'].should.be.true;
    i.pull('test3').should.equal('test3');
  });

  it('should pull data and returns undefined if inexistent key', function () {
    let i = new ObjectArray({
      test1: 'fixture',
      test2: {
        testx: { test2x: 0 },
        testy: {
          test2y1: true,
          test2y2: 'fix'
        }
      }
    });

    expect(i.pull('test3', null, false)).to.be.undefined;
    expect(i.getset('test3', undefined, '', false)['get']).to.be.undefined;
  });
});

/**
*  @test {ObjectArray#forEach}
*  @test {ObjectArray#reduce}
*/
describe('ObjectArray iterations', function () {
  it('should iterate a callback with forEach', function () {
    let i = new ObjectArray();

    let ret = {};

    let indexes = [];

    i.import({
      test: 'fixture',
      test2: 'fixture2'
    });

    i.forEach(function (value, key, index) {
      ret[key] = value;
      indexes.push(index);
    });

    ret.should.eql({
      test: 'fixture',
      test2: 'fixture2'
    });

    indexes.should.eql([0, 1]);
  });

  it('should iterate a callback with forEach on a dotted key', function () {
    let i = new ObjectArray();

    let ret = {};

    let indexes = [];

    i.import({
      test: {
        test: 'fixture',
        test2: 'fixture2'
      }
    });

    i.forEach(function (value, key, index) {
      ret[key] = value;
      indexes.push(index);
    }, 'test');

    ret.should.eql({
      test: 'fixture',
      test2: 'fixture2'
    });

    indexes.should.eql([0, 1]);
  });

  it('should throw an exception with forEach', function () {
    var i = new ObjectArray({
      test: {
        test: 'fixture',
        test2: 'fixture2'
      }
    });

    expect(i.forEach.bind(i, (v, k) => { i.remove(k); }, 'test3')).to.throw(TypeError);
  });

  it('should do nothing with forEach and bad key', function () {
    var i = new ObjectArray({
      test: {
        test: 'fixture',
        test2: 'fixture2'
      }
    });

    i.forEach((v, k) => { i.remove(k); }, 'test3', undefined, false);
    i._data.should.eql({
      test: {
        test: 'fixture',
        test2: 'fixture2'
      }
    });
  });

  it('should reduce the data', function () {
    let i = new ObjectArray({
      position: 'absolute',
      display: 'flex'
    });

    let ret = i.reduce(function (str, value, key) {
      str += key + ':' + value + ';';
      return str;
    }, '');

    ret.should.equal('position:absolute;display:flex;');
  });

  it('should reduce the data of a subset', function () {
    let i = new ObjectArray({
      style: {
        position: 'absolute',
        display: 'flex'
      }
    });

    let ret = i.reduce(function (str, value, key) {
      str += key + ':' + value + ';';
      return str;
    }, '', 'style');

    ret.should.equal('position:absolute;display:flex;');
  });
});

describe('Serializers', function () {
  it('should return a style type string', function () {
    let i = new ObjectArray({
      position: 'absolute',
      display: 'flex',
      paddingLeft: '1em'
    });

    i.stylesToString().should.equal('position:absolute;display:flex;padding-left:1em');
  });

  it('should return a style type string from subset or undefined', function () {
    let i = new ObjectArray({
      css: {
        position: 'absolute',
        display: 'flex',
        paddingLeft: '1em'
      }
    });

    i.stylesToString('css').should.equal('position:absolute;display:flex;padding-left:1em');
    expect(i.stylesToString('wrongcss', 'dat', false)).to.be.undefined;
  });

  it('should import a style type string', function () {
    let i = new ObjectArray();

    i.stringToStyles(undefined).data.should.eql({});
    i.stringToStyles(null).data.should.eql({});

    i.stringToStyles('position:absolute;display:flex;padding-left:1em')
      .data.should.eql({
        position: 'absolute',
        display: 'flex',
        paddingLeft: '1em'
      });

    i.empty();

    i.stringToStyles('position:absolute;display:flex;padding-left:1em', 'dat.path.to.subkey')
      .dataset('dat.path.to.subkey').should.eql({
        position: 'absolute',
        display: 'flex',
        paddingLeft: '1em'
      });

    i.stringToStyles('position:absolute;display:flex;padding-left:1em;', 'dat.path.to.subkey')
      .dataset('dat.path.to.subkey').should.eql({
        position: 'absolute',
        display: 'flex',
        paddingLeft: '1em'
      });
  });

  it('should throw an exception if bad string provided', function () {
    let i = new ObjectArray();

    expect(i.stringToStyles.bind(i, 'databadword')).to.throw('Malformed string for stringToStyles');
    expect(i.stringToStyles.bind(i, ':databadword;peanuts')).to.throw('Malformed string for stringToStyles');
  });

  it('should return a url encoded string', function () {
    let i = new ObjectArray({
      input: 'test',
      glob: '**/*',
      alias: 'test fixture'
    });

    let ret = i.urlEncode();

    ret.should.equal('input=test&glob=**%2F*&alias=test%20fixture');
  });

  it('should return a form url encoded string', function () {
    let i = new ObjectArray({
      input: 'test',
      glob: '**/*',
      alias: 'test fixture'
    });

    let ret = i.formUrlEncode();

    ret.should.equal('input=test&glob=**%2F*&alias=test+fixture');
  });

  it('should return undefined as form url encoded string with unknown key', function () {
    let i = new ObjectArray({
      input: 'test',
      glob: '**/*',
      alias: 'test fixture'
    });

    let ret = i.formUrlEncode('dat.bad.key', undefined, false);

    expect(ret).to.be.undefined;
  });
});

describe('Import JSON and change keys', function () {
  it('should import JSON and change keys', function () {
    var jstring = '{"dat": {"long": {"path": "foo", "dream": "baz"}}}';
    var doa = new ObjectArray(JSON.parse(jstring));

    doa.push('short', doa.dataset('dat.long')).remove('dat');
    JSON.stringify(doa.data).should.equal('{"short":{"path":"foo","dream":"baz"}}');
  });
});

/**
* @test {ObjectArray#camelize}
* @test {ObjectArray#dashize}
*/
describe('Camel and dash', function () {
  it('should camelize space and dashed strings', function () {
    let e = new ObjectArray();

    e.camelize('a long string').should.equal('aLongString');
    e.camelize('a LonG string').should.equal('aLonGString');
    e.camelize('a-long-string').should.equal('aLongString');
    e.camelize('a long-string').should.equal('aLongString');
    e.camelize('background-color').should.equal('backgroundColor');
    e.camelize('padding-left').should.equal('paddingLeft');
  });

  it('should dashize space and uppercase letter', function () {
    let e = new ObjectArray();

    e.dashize('a long string').should.equal('a-long-string');
    e.dashize('aLongString').should.equal('a-long-string');
    e.dashize('a LongString').should.equal('a-long-string');
    e.dashize('a longString').should.equal('a-long-string');
    e.dashize('backgroundColor').should.equal('background-color');
    e.dashize('paddingLeft').should.equal('padding-left');
    e.dashize('PaddingLeft').should.equal('padding-left');
  });
});

/**
 * @test #{ObjectArray#has}
 * @test #{ObjectArray#_key}
 * @test #{ObjectArray#pull}
 * @see https://github.com/liqueurdetoile/DotObjectArray/issues/1
 */
describe('Check subkey existence evaluation on various data types', function () {
  it('should return undefined if key does not exist under an empty object', function () {
    let e = new ObjectArray({object: {foo: {}}});

    e.has('object.foo.bar').should.be.false;
    expect(e._key('object.foo.bar')).to.be.undefined;
    expect(e.pull('object.foo.bar')).to.be.undefined;
  });

  it('should return undefined if key does not exist under a boolean value', function () {
    let e = new ObjectArray({object: {foo: true}});

    e.has('object.foo.bar').should.be.false;
    expect(e._key('object.foo.bar')).to.be.undefined;
    expect(e.pull('object.foo.bar')).to.be.undefined;
  });

  it('should return undefined if key does not exist under a null value', function () {
    let e = new ObjectArray({object: {foo: null}});

    e.has('object.foo.bar').should.be.false;
    expect(e._key('object.foo.bar')).to.be.undefined;
    expect(e.pull('object.foo.bar')).to.be.undefined;
  });

  it('should return undefined if key does not exist under a string value', function () {
    let e = new ObjectArray({object: {foo: 'test'}});

    e.has('object.foo.bar').should.be.false;
    expect(e._key('object.foo.bar')).to.be.undefined;
    expect(e.pull('object.foo.bar')).to.be.undefined;
  });
});
