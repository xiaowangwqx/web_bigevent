$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类列表
    initArtCateist();

    function initArtCateist() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlstr = template('tpl_table', res);
                // 将获取的数据渲染到tbody中
                $('tbody').html(htmlstr);
            }
        })
    }

    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理形式 为form-add表单绑定submit事件
    // 监听表单的提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault(); //阻止表单的默认提交行为
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(), //快速获取表单中元素的值
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                // 重新获取分类数据
                initArtCateist();
                layer.msg('新增分类成功');
                layer.close(indexAdd); //根据索引关闭弹出层
            }
        })
    })

    // 通过代理形式 为编辑按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出层 弹出修改文章分类信息
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id');
        // 发起请求 获取id对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    })


    // 通过代理方式 为修改分类的表单绑定submit事件
    // 监听表单的提交行为
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                // 刷新表单数据
                initArtCateist();
                layer.msg('更新分类数据成功');
                // 关闭弹出层
                layer.close(indexEdit);

            }
        })
    })

    // 代理方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delte', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起删除分类的请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    }
                    initArtCateist();
                    layer.msg('删除分类成功');
                    layer.close(index);
                }
            })

            layer.close(index);
        });
    })

})