$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败');
                }
                // layer.msg('获取文章类别成功');
                // 调用模板引擎 渲染分类的下拉菜单
                var htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr);
                // 调用form.render()方法重新渲染表单区域
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定点击事件
    $('#btnchooseImage').on('click', function() {
        $('#coverFile').click();
    })

    // 监听coverFile 的change 事件 获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取文件的列表数组
        var files = e.target.files;
        // 判断用户时候选择文件
        if (files.length === 0) {
            return
        }
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);

        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章状态
    var art_state = '已发布';
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })

    // 监听表单的提交行为
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 基于form表单 快速创建一个formData对象
        var fd = new FormData($(this)[0]);
        // 将文章发布状态存入fd
        fd.append('state', art_state);
        // 将封面裁剪的图片输出为图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件对象存储到fd中
                fd.append('cover_img', blob);
                // 发起ajax数据请求
                publishArticle(fd);
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交的是FormData格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    layer.msg('发布文章失败');
                }
                // 跳转页面
                location.href = '/article/art_list.html';
            }
        })
    }
})