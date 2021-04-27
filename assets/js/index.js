$(function() {
    getUserInfo(); //调用函数 获取用户的基本信息

    var layer = layui.layer;
    // 退出按钮
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 清空本地存储中的token
            localStorage.removeItem('token');
            // 重新跳转到登录页面
            location.href = '/login.html';
            // 关闭confirm询问框
            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers是请求头配置对象
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 调用 renderAvatar渲染用户头像
            renderAvatar(res.data);
        }

    })
}

// 渲染用户头像

function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);

    // 按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像 
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }

}