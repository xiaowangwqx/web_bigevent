$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        // 获取年月日
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        // 获取时分秒
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义一个查询的参数对象 将来请求数据时 
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值 默认请求第一页的数据
        pagesize: 2, //每页显示几条数据 默认显示2条
        cate_id: '', //文章分类id
        state: '' //文章发布状态

    }


    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面的数据
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
                renderPage(res.total); //调用渲染分页方法
            }
        })
    }

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败');
                }
                // 调用模板引擎渲染分类可选项
                var htmlstr = template('tpl-cate', res);
                // console.log(htmlstr);
                $('[name=cate_id]').html(htmlstr);
                form.render(); //通知layui重新渲染表单区域的UI结构
            }
        })
    }

    // 监听表单的提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中下拉菜单对应的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 将值填充到对应的q 的属性里面
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件 重新渲染表格数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.render方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //注意，这里的pageBox是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时的回调函数
            // 触发jump回调的方式有两种
            // 1、点击页码时 触发回调
            // 2、只要调用laypage.render()就会触发回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                // console.log(first);
                // 通过first值判断通过哪一种方式触发回调
                q.pagenum = obj.curr; //把最新的页码值赋值给q
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 通过代理方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function(e) {
        var len = $('.btn-delete').length; //获取删除按钮个数
        // console.log(len);
        // 获取文章Id
        var id = $(this).attr('data-id');
        // 询问用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    // 数据删除完成后 要判断当前这一页中 是否还有剩余的数据
                    // 如果没有剩余数据 页码值-1
                    // 在重新iniTable()方法
                    if (len === 1) {
                        // 删除完页面中没有数据
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})