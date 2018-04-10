var gulp = require('gulp');
var fs = require('fs');
var path = require('path');

//注册
var deep = 4; // 父级搜索迭代次数
var workflowPaths = ['//WORKS/LABS/tmt-workflow-master/','E:/Tools/tmt-workflow/'];   // _task的绝对路径 数组
search_tasks('_tasks');

// 配置路径搜索
function search_tasks(tasks_path) {
    for(var i=0; i<workflowPaths.length; i++){
        var _path = path.join(workflowPaths[i], tasks_path);
        if (fs.existsSync(_path)) {
            // console.log("search task: "+_path);
            require(_path)(gulp);
            return;
        }
    }
    run_tasks(tasks_path);
}

// 父级迭代搜索
function run_tasks(tasks_path) {
    if (--deep < 0) {
        throw new Error('something wrong in require tasks!');
        return;
    }

    tasks_path = path.join('../', tasks_path);
    // console.log(tasks_path);
    if (fs.existsSync(tasks_path)) {
        require(tasks_path)(gulp);
    } else {
        run_tasks(tasks_path);
    }
}