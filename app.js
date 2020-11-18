// 引用express框架
const express = require('express');
// 创建网站服务器
const app = express.Router();
// 引入系统模块path获取目录
const path = require('path');
//引入fs文件处理模块
const fs = require("fs");
// 处理文件上传
const formidableMiddleware = require('express-formidable');
// 开放静态文件，使用express自带方法，并使用path模块设置静态文件根目录
app.use(express.static(path.join(__dirname, 'public')));
// 处理post参数
app.use(formidableMiddleware({
    // 文件上传目录
    uploadDir: path.join(__dirname, 'public', 'uploads'),
    // 最大上传文件为2M
    maxFileSize: 10 * 1024 * 1024,
    // 保留文件扩展名
    keepExtensions: true
}, [{
    event: "error",
    action: () => {
        void(0)
    }
}]));

//维护一个全局变量，每次调用接口时，更新该变量为最新时间
var Time = new Date();
//该函数用于检测当前时间和全局变量维护的时间是否为同一天，不同则删除文件夹中全部文件
function deleteFile(time) {
    if (time.getDate() != Time.getDate()) {

        //dir存文件夹名称
        var dir = fs.readdirSync(path.join(__dirname, 'public/uploads'));
        //遍历所有文件夹
        dir.forEach(function(itm, index) {
            try {
                fs.unlinkSync(path.join(__dirname, 'public/uploads', itm));
            } catch (err) {
                console.log("\033[41;30m 删除时错误 \033[0m", new Date().Format("yyyy-MM-dd hh:mm:ss"), ' 抛出的异常 ' + err);

            }
        });

        Time = new Date();
    }


}
app.post('/upload', (req, res) => {
        deleteFile(new Date());
        try {
            if (req.files) {
                fs.renameSync(path.join(req.files.screenshot.path), path.join(__dirname, 'public/uploads', req.fields.key))
                return res.send({ message: '文件' + req.files.screenshot.name + '上传成功' });

            } else {
                return res.status(400).send({ message: '文件上传时遇到错误' })
            }
        } catch (err) {
            return res.status(400).send({ message: '文件上传时遇到错误' + err })
        }
    })
    //遍历检索函数
function searchkey(key) {
    //获取文件中数据
    try {
        //将匹配成功的关键字文件url数组作为返回值
        var SearchResult = [];
        //dir存文件夹名称
        var dir = fs.readdirSync(path.join(__dirname, 'public/uploads'));
        //遍历所有文件夹
        dir.forEach(function(itm, index) {


            if (itm.split('_')[0] == key) {

                SearchResult.push({
                    filename: itm,
                    path: path.join('/demos/FileTransshipment/uploads', itm)
                });
            }

        })
        return SearchResult;
    } catch (error) {
        console.log("\033[41;30m 错误 \033[0m", error.message);
        return [];
    }

}
app.post('/query', (req, res) => {
    deleteFile(new Date());

    try {
        var result = searchkey(req.fields.key);
        // console.log(result);
        return res.send({ data: result });

    } catch (err) {
        return res.status(400).send({ message: '文件上传时遇到错误' + err })
    }
})

module.exports = app;