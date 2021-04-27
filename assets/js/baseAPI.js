// 每次调用$.get $.post $.ajax 时 会先调用ajaxPrefliter函数
// 在这个函数中 可以获取给ajax对象提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起正真正的ajax请求之前 统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // console.log(options.url);

    // 统一为有权限的接口 设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete回调函数
    // 无论成功还是失败 最终都会调用complete回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = '/login.html';
        }
    }

})