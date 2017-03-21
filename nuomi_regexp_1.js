/**
 * Created by Thinkpad on 2017/3/21.任务1 使用简单的电话号码匹配；任务二：编写一个判断输入的字符串是否有相邻重复单词的正则表达式
 * 任务一：
 */

function  validate(input){
    var numberReg = /^1\d{10}$/g;//数字结尾，1开头
    var stringReg =/(?:^|\s)\b(\w+?(?:-\w+?)*)\s+\b\1(?=\s|$)/g;
   return input.match(stringReg)
}

validate(str);