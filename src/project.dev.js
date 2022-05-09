window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  btnDelete: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "120a1QAsmRMGaD1e/KIWu03", "btnDelete");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {
        _countCheck: 0,
        _evtActiveNode: null,
        _evtIsCheck: null
      },
      onLoad: function onLoad() {
        this._evtActiveNode = this.activeNode.bind(this);
        this._evtIsCheck = this.isCheck.bind(this);
        Emitter.instance.registerEvent(emitterName.activeBtn, this._evtActiveNode);
        Emitter.instance.registerEvent(emitterName.activeValidateForm, this._evtActiveNode);
        Emitter.instance.registerEvent(emitterName.isChecked, this._evtIsCheck);
      },
      isCheck: function isCheck(check) {
        this._countCheck = check ? this._countCheck + 1 : this._countCheck - 1;
        cc.log(this._countCheck);
        if (0 == this._countCheck) {
          this.getComponent(cc.Button).interactable = false;
          return;
        }
        this.getComponent(cc.Button).interactable = true;
      },
      activeNode: function activeNode() {
        var bool = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        this.node.active = bool;
      },
      handleClick: function handleClick() {
        Emitter.instance.emit(emitterName.deleteItem);
        this._countCheck = 0;
      },
      hello: function hello() {
        cc.log(1234);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ],
  btnRegisterAgain: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a65a5x8FNFEbJsCqSq8/p8", "btnRegisterAgain");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {
        _evtActiveNode: null
      },
      onLoad: function onLoad() {
        this._evtActiveNode = this.activeNode.bind(this);
        Emitter.instance.registerEvent(emitterName.activeBtn, this._evtActiveNode);
      },
      activeNode: function activeNode(bool) {
        this.node.active = bool;
      },
      handleClick: function handleClick() {
        this.node.active = false;
        Emitter.instance.emit(emitterName.activeValidateForm);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ],
  btnRegister: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91955zWOphPiYOWa+PW8QKl", "btnRegister");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {
        _evtCheckForm: null
      },
      onLoad: function onLoad() {
        this._evtCheckForm = this.checkForm.bind(this);
        Emitter.instance.registerEvent(emitterName.activeBtnRegister, this._evtCheckForm);
      },
      checkForm: function checkForm(value) {
        this.getComponent(cc.Button).interactable = !!value;
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ],
  controller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d015ff6A5VAVosd4VgEQSh1", "controller");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {
        _evtSendData: null
      },
      onLoad: function onLoad() {
        this._evtSendData = this.sendData;
      },
      start: function start() {
        Emitter.instance.emit(emitterName.activeBtn, false);
      },
      onEnable: function onEnable() {
        Emitter.instance.registerEvent(emitterName.submitForm, this._evtSendData);
      },
      sendData: function sendData(data, loginCom) {
        loginCom.node.active = false;
        Emitter.instance.emit(emitterName.showListUser, data, loginCom);
      }
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ],
  emitterName: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a49716EVaxFy5n1Dv90ROwv", "emitterName");
    "use strict";
    function _defineProperty(obj, key, value) {
      key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      }) : obj[key] = value;
      return obj;
    }
    var emitterName = _defineProperty({
      activeBtn: "activeBtn",
      activeValidateForm: "activeValidateForm",
      activeBtnRegister: "activeBtnRegister",
      changeSize: "changeSize",
      isChecked: "isChecked",
      deleteItem: "deleteItem",
      submitForm: "submitForm",
      showListUser: "showListUser"
    }, "isChecked", "isChecked");
    module.exports = emitterName;
    cc._RF.pop();
  }, {} ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7de4cSBgf1OLparydXRLK6+", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener) {
          this._emiter.on(event, listener);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null == mEmitter.instance ? new mEmitter() : mEmitter.instance;
    module.exports = mEmitter;
    cc._RF.pop();
  }, {
    events: 1
  } ],
  richText: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a7102VrU1CYqvlDlksjY6f", "richText");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {
        slider: cc.Component
      },
      onLoad: function onLoad() {},
      activeNode: function activeNode() {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ],
  showListUser: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c3b3aL6GzBO/qn6yrMeaR9Z", "showListUser");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {
        itemUser: cc.Prefab,
        _loginCom: null,
        _evtGetInfoUser: null
      },
      onEnable: function onEnable() {},
      onLoad: function onLoad() {},
      start: function start() {
        this._evtGetInfoUser = this.getInfoUser.bind(this);
        this.enabled = false;
      },
      onDisable: function onDisable() {
        Emitter.instance.registerEvent(emitterName.showListUser, this._evtGetInfoUser);
      },
      getInfoUser: function getInfoUser(data, loginCom) {
        this._loginCom = loginCom;
        var item = cc.instantiate(this.itemUser);
        item.getChildByName("userName").getComponent(cc.Label).string = data.email;
        item.parent = this.node.getChildByName("NewScrollView").getChildByName("view").getChildByName("content");
        item.x = 22.208;
      }
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ],
  slider: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5a31aK4ySlO3KqIh8JVfIPk", "slider");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onChange: function onChange(vl) {
        Emitter.instance.emit(emitterName.changeSize, vl.progress);
      }
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ],
  user: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d93a93EqAVOF4VzGbtJHwA+", "user");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {
        checkbox: cc.Component,
        _evtDelete: null,
        _evtChangeSize: null
      },
      onLoad: function onLoad() {
        this._evtDelete = this.deleteItem.bind(this);
        this._evtChangeSize = this.changeSize.bind(this);
        Emitter.instance.registerEvent(emitterName.deleteItem, this._evtDelete);
        Emitter.instance.registerEvent(emitterName.changeSize, this._evtChangeSize);
      },
      changeSize: function changeSize(value) {
        this.node.getChildByName("userName").getComponent(cc.Label).fontSize = 8 + .125 * value * 64;
      },
      isCheck: function isCheck() {
        Emitter.instance.emit(emitterName.isChecked, this.checkbox.isChecked);
      },
      deleteItem: function deleteItem() {
        var check = this.checkbox || false;
        if (true == check.isChecked) {
          Emitter.instance.removeEvent(emitterName.deleteItem, this._evtDelete);
          Emitter.instance.removeEvent(emitterName.changeSize, this._evtChangeSize);
          this.node.parent.removeChild(this.node);
          this.node.destroy();
          this.destroy();
          cc.log(this.node);
        }
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ],
  validateForm: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9238YiEbFESrkWPwtSA2RU", "validateForm");
    "use strict";
    var Emitter = require("mEmitter");
    var emitterName = require("emitterName");
    cc.Class({
      extends: cc.Component,
      properties: {
        data: null,
        richText: cc.Component,
        slider: cc.Component,
        _evtActiveForm: null
      },
      onLoad: function onLoad() {
        this.data = {
          email: "",
          password: "",
          numberPhone: ""
        };
        this._evtActiveForm = this.activeForm.bind(this);
        Emitter.instance.registerEvent(emitterName.activeValidateForm, this._evtActiveForm);
      },
      start: function start() {},
      onHello: function onHello(data) {
        cc.log(data);
      },
      checkEmail: function checkEmail(edtEmail) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(edtEmail.string)) {
          cc.log("true");
          Emitter.instance.emit(emitterName.activeBtnRegister, true);
          return true;
        }
        alert("email khong h\u1ee3p l\u1ec7: example@gmail.com");
        Emitter.instance.emit(emitterName.activeBtnRegister, false);
        return false;
      },
      getStringEmail: function getStringEmail(edtEmail) {
        this.data.email = edtEmail.string.trim();
      },
      getStringPassword: function getStringPassword(edtPassword) {
        this.data.password = edtPassword.string.trim();
      },
      getStringNumberPhone: function getStringNumberPhone(edtNumberPhone) {
        this.data.numberPhone = edtNumberPhone.string.trim();
      },
      submitButton: function submitButton() {
        this.loading();
      },
      loading: function loading() {
        var _this = this;
        this.richText.node.active = true;
        this.slider.node.active = true;
        this.slider.getComponent(cc.ProgressBar).progress = 0;
        var interval = setInterval(function() {
          _this.slider.getComponent(cc.ProgressBar).progress += .01;
          if (_this.slider.getComponent(cc.ProgressBar).progress >= 1) {
            _this.slider.getComponent(cc.ProgressBar).progress = 0;
            Emitter.instance.emit(emitterName.submitForm, _this.data, _this);
            Emitter.instance.emit(emitterName.activeBtn, true);
            _this.slider.node.active = false;
            _this.richText.node.active = false;
            clearInterval(interval);
          }
        }, 30);
      },
      activeForm: function activeForm() {
        this.node.active = true;
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {
    emitterName: "emitterName",
    mEmitter: "mEmitter"
  } ]
}, {}, [ "btnDelete", "btnRegister", "btnRegisterAgain", "controller", "emitterName", "mEmitter", "richText", "showListUser", "slider", "user", "validateForm" ]);