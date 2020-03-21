### 关于node require缓存的一些思考



众所周知 node在require文件的时候会生成缓存来进行加速，也会判断是否为内置模块。如果在代码中打印`require.cache`可以看到如下. 记录了一个绝对路径做key，module基本信息做value的对象结构。

```js
{
  '/Users/chen/chen/porject/requireCache/a.js':
   Module {
     id: '/Users/chen/chen/porject/requireCache/a.js',
     exports: { a: 'a', child: [Object] },
     parent:
      Module {
        id: '.',
        exports: {},
        parent: null,
        filename: '/Users/chen/chen/porject/requireCache/index.js',
        loaded: false,
        children: [Array],
        paths: [Array] },
     filename: '/Users/chen/chen/porject/requireCache/a.js',
     loaded: true,
     children: [],
     paths:
      [ '/Users/chen/chen/porject/requireCache/node_modules',
        '/Users/chen/chen/porject/node_modules',
        '/Users/chen/chen/node_modules',
        '/Users/chen/node_modules',
        '/Users/node_modules',
        '/node_modules' ] } }
```

当我在代码里尝试删除require.cache,  希冀于会出发重新去请求。却发现和预期的行为不一致。上代码：

```js
const a = require('./a') // a.js就是简单的module.exports一个对象出来
console.log('a', a )  // { a: 'a', child: { name: 'a' } } 

delete require.cache // true 成功了
const b = require('./a')
console.log('b',b) // b { a: 'a', child: { name: 'a' } }
console.log('111', require.cache) // undefined
```

在已经成功删除了require的cache的情况下，b仍然可以拿到正确的值，并且缓存没有再挂上去。就好像这个缓存没有用一样，为了验证缓存行为写了如下做测试。

```js
const a = require('./a')
console.log('a', a )  // { a: 'a', child: { name: 'a' } } 

require.cache['/Users/chen/chen/porject/requireCache/a.js'].exports.a ='b' // 强行改变缓存数据
const b = require('./a') 
console.log('b',b) // { a: 'b', child: { name: 'a' } }  被修改了
```

由上面两个案例猜测出，require上挂的缓存，应该为某个对象的引用。即在源码层面做过赋值，类似```require.cache = cache ```。而源码层面应该是使用cache[path]的形式做了判断，所以造成了只删除require.cache无效，修改值却有效的行为。

为了验证猜想，翻看源码如下

```js
// lib/modules/cjs/helpers.js
function makeRequireFunction(mod) {
	// ...
    resolve.paths = paths;

  require.main = process.mainModule; // 运行时require.main 会被设为它的 module

  // Enable support to add extra extension types.
  require.extensions = Module._extensions;

  require.cache = Module._cache;  实际上是Module._cache的引用

  return require;
}

// lib/modules/cjs/loader.js

Module._load = function(request, parent, isMain) {
// ...
  var cachedModule = Module._cache[filename]; // 这里是用Module._cache判断的
  if (cachedModule) {
    updateChildren(parent, cachedModule, true);
    return cachedModule.exports;
  }

  if (NativeModule.nonInternalExists(filename)) {
    debug('load native module %s', request);
    return NativeModule.require(filename);
  }

  // Don't call updateChildren(), Module constructor already does.
  var module = new Module(filename, parent);

  if (isMain) {
    process.mainModule = module;
    module.id = '.';
  }

  Module._cache[filename] = module;

  tryModuleLoad(module, filename);

  return module.exports;
};

```

