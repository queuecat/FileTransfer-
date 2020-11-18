$(function() {
    function renderInfo(info = '等待上传文件', classText = 'alert-primary') {
        var infohtml = template('infoTPL', { 'classText': classText, 'info': info });

        $("#infoBox").html(infohtml);
        $('#info').fadeIn();

    };
    renderInfo();
    // 错误处理
    function errHandler(err) {
        try {
            $('#infoBox').html(template('infoTPL', { info: JSON.parse(err.responseText).message || '未知错误', classText: 'alert-danger' }))
            $('#info').fadeIn();

        } catch (error) {
            $('#infoBox').html(template('infoTPL', { info: err.responseText || '未知错误', classText: 'alert-danger' }))
            $('#info').fadeIn();

        }

    }
    //上传按钮点击事件
    $('#submit').click(function(e) {
        function showLoading() {
            $('#submit').html('<span class="spinner-border spinner-border-sm middle" role="status" aria-hidden="true"></span><span>上传</span>');
        }

        function hideLoading() {
            $('#submit').html('<span>上传</span>');
        }

        e.preventDefault();
        // 验证关键字
        var key = $('#key').val().trim();
        if (!(key)) return renderInfo('未检测到关键字', 'alert-danger');

        // 验证图片
        var screenshot = $('#upload')[0].files[0];
        // console.log(screenshot);
        if (screenshot) {
            if (screenshot.size > 1024 * 1024 * 10) {
                return renderInfo('文件大小不能超过 10 MB', 'alert-danger');
            }
        } else {
            return renderInfo('请选择上传的文件', 'alert-danger');
        }
        showLoading();
        renderInfo('正在上传...', 'alert-secondary');
        // 设置提交数据
        var formData = new FormData();
        formData.append('screenshot', screenshot);
        formData.append('key', $('#key').val().trim() + "_" + screenshot.name);
        renderInfo('请耐心等待，正在上传...', 'alert-info');
        $.ajax({
            type: 'post',
            url: '/demos/FileTransshipment/upload',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                renderInfo(data.message, 'alert-success');

                hideLoading();
            },
            error: function(err) {
                hideLoading();
                errHandler(err);
            }
        });

    });

    function renderList(data, key) {
        var fileListhtml = template('fileListTPL', { fileList: data, key });

        $(".ulBox").html(fileListhtml);
        $(".ulBox ul").slideDown();
    }
    //上传按钮点击事件
    $('#query').click(function(e) {
        function showLoading() {
            $('#query').html('<span class="spinner-border spinner-border-sm middle" role="status" aria-hidden="true"></span>获取下载列表');
        }

        function hideLoading() {
            $('#query').html('获取下载列表');
        }

        e.preventDefault();
        // 验证关键字
        var key = $('#key').val().trim();
        if (!(key)) return renderInfo('未检测到关键字', 'alert-danger');

        showLoading();
        renderInfo('正在检索...', 'alert-secondary');
        // 设置提交数据
        var formData = new FormData();
        formData.append('key', $('#key').val().trim());
        renderInfo('请耐心等待，正在检索...', 'alert-info');
        $.ajax({
            type: 'post',
            url: '/demos/FileTransshipment/query',
            data: formData,
            processData: false,
            contentType: false,
            success: function({ data }) {
                renderInfo('检索成功', 'alert-success');
                renderList(data, key);
                hideLoading();
            },
            error: function(err) {
                hideLoading();
                errHandler(err);
            }
        });

    });


    // 显示上传文件名
    $('#upload').on('change', function(e) {
        if (this.files[0])
            $('#uploadLabel').html(this.files[0].name);
    });
})