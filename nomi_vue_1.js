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
var test = new Observe(data);
test.data.username.first;