/**
 * Created by Thinkpad on 2017/3/19.
 *
 * 实现冒泡~~~
 * 是将放入在构造函数中的event事件，变成公类的原型链上；
 */
//实现冒泡
function ObjWithParent(data){
    this.data = data;
    this.pname = Array.prototype.slice.call(arguments,1)[0] || 'data';
    this.makeObj(data);

}
ObjWithParent.prototype.makeObj = function(obj){
    let child;
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            child = obj[key];
            if(typeof child == 'object'){
                new ObjWithParent(child,this.pname+'.'+key)
            }

        }
        this.getterAndSetter(key,child,this.pname);
    }
}
ObjWithParent.prototype.getterAndSetter =function(target,val,pname){
    let _this= this;
    Object.defineProperty(this.data ,target,{
        enumerable:true,
        configurable:true,
        get: function () {
            console.log('你访问了'+target);
            return val;
        },
        set:function(newVal){
            let parent = pname.split('.').pop();
            console.log('你设置了'+target);
            _this.emit(pname+'.'+target,val,newVal);
            val = newVal;
            if(typeof newVal == 'object'){

                new Observer(newVal,pname+'.'+target)
            }
        }
    })
}

ObjWithParent.prototype.$watch=function(target,cb){
    this.eventBus.on(target,cb)
}
ObjWithParent.prototype.content={};

ObjWithParent.prototype.$watch = function(name,cb){
    if(!this.content[name]){
        this.content[name] = [];
    }
    this.content[name].push(cb);
}
ObjWithParent.prototype.emit = function(pname,...arg){

    if(pname.indexOf('.') > -1){
        var parentArr = pname.split('.');
         var that = this;
        parentArr.forEach(function(item){
            that.emit(item);
        })
    }else{
        var target = pname;
        if(this.content[target] ){
            this.content[target].forEach(function(item){
                item(...arg);
            })
        }
    }
    return this;
}
ObjWithParent.prototype.off = function(pname,fn){
    if(!fn){
        this.content[pname] = null;
        return this;
    }else{
        var index = this.content[pname].indexOf(fn);
        this.content[pname].splice(index,1);
        return this;
    }
}

var data ={
    username:{
        first:'a',
        second:'b'
    },
    age:14,
    address:{
        door:{number:'11223',level:'3'},
        building:'shjdjd'
    }
};
var test = new ObjWithParent(data);

test.$watch('username',function(newname){
    console.log('我发生了变化')
})

test.data.username.first = 'a';
//console.log(test.eventBus)