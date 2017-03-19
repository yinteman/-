/**
 * Created by Thinkpad on 2017/3/16.“动态数据绑定”系列的第一题。
 * 传入参数只考虑对象，不考虑数组。
 new Observer返回一个对象，其 data 属性要能够访问到传递进去的对象。
 通过 data 访问属性和设置属性的时候，均能打印出右侧对应的信息。
 */

function  Observe(data){
    this.data = data;
    this.watch(this.data);
}
var p = Observe.prototype;
p.watch = function(obj){
    var val;
    for( var key in obj){
        if(obj.hasOwnProperty(key)){
             val = obj[key];
            if(typeof val == 'object'){
                new Observe(val);
            }
            this.conver(key ,val )
        }

    };

}
p.conver = function(key,val){
    Object.defineProperty(this.data,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            console.log('你访问了'+key);
            return val;
        },
        set:function(newVal){
            console.log('你设置了'+key)
            if( val != newVal){
                val = newVal;
                console.log('你修改了新的'+ key + '='+ newVal)
            }
            return ;
        }
    })
};



//实现$watch的api接口
/**
* ES6 有proxy拦截器
* ES5 Object.defineProperty
 * 改进：如果设置新的值是一个对象的话，新设置的对象的属性是否能继续响应getter和setter；
 * 改进方法：使用订阅器，接收消息并且发送
* **/
 /**设置时间订阅器-发布器
  * */
 function Event(){
     this.events=[]
 }
Event.prototype.on = function(target,cb){
    if(!this.events[target]){
        this.events[target]=[];
    }
     this.events[target].push(cb);

}
Event.prototype.off = function(target){
    for(let key in this.events){
        if(this.events.hasOwnProperty(key) && key == target){
            delete this.events[target]
        }
    }
}
Event.prototype.emit = function(target , ...arg){
    this.events[target] && (this.events[target].forEach(
        function(item){
        item(...arg);
    }))
}

/**
 * 在监听对象中加入监听器
 * */
    function Observer(data){
    this.data = data;
    this.makeObserver(data);
    this.eventBus = new Event();
    //this.getterAndSetter=getterAndSetter();
}

Observer.prototype.makeObserver = function(obj){
    let child;
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            child = obj[key];
            if(typeof child == 'object'){
                new Observer(child)
            }

        }
        this.getterAndSetter(key,child)
    }
}
Observer.prototype.getterAndSetter = function(target,val){
    let _this= this;
    Object.defineProperty(this.data ,target,{
        enumerable:true,
        configurable:true,
        get: function () {
            console.log('你访问了'+target);
            return val;
        },
        set:function(newVal){
            console.log('你设置了'+target)
            console.log('新的'+target+'='+newVal);
            _this.eventBus.emit(target,val,newVal);
            val = newVal;
            if(typeof newVal == 'object'){
                new Observer(newVal)
            }
        }
    })
}

Observer.prototype.$watch=function(target,cb){
    this.eventBus.on(target,cb)
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

var test = new Observer(data);
test.$watch('age',function(){
    console.log('你设置了新的age');
});
test.$watch('age',function(oldVal,newVal){
     console.log(`我的年龄变了，原来是: ${oldVal}岁，现在是：${newVal}岁了')
});
test.data.age= 15;
//console.log(test.eventBus)