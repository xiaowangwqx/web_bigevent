// 每次调用$.get $.post $.ajax 时 会先调用ajaxPrefliter函数
// 在这个函数中 可以获取给ajax对象提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起正真正的ajax请求之前 统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // console.log(options.url);
})