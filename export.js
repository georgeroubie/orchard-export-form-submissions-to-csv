(function () {
    var url = window.location.href.toString().toLowerCase();
    if (url.indexOf('submissionadmin') > -1) {
        var queryParameter = '?pagesize=0&page=1&';
        var exportToCSV = function() {
            var table = $('table.dynamic-forms-submissions').clone(true);
            table.find('thead > tr > th:first-child').remove();
            table.find('thead > tr > th:last-child').remove();
            table.find('tbody > tr > td:first-child').remove();
            table.find('tbody > tr > td:last-child').remove();
            table.htmlTableToCSV();
        };

        $('<a/>', {
            class: 'button',
            css: {
                'margin-bottom': '10px',
                'float': 'right'
            },
            text: 'Export visible',
            click: function () { exportToCSV(); }
        }).insertAfter('fieldset.bulk-actions');
        $('<a/>', {
            class: 'button',
            css: {
                'margin': '0 0 10px 10px',
                'float': 'right'
            },
            text: 'Export all',
            click: function () { location.replace(queryParameter); }
        }).insertAfter('fieldset.bulk-actions');

        $(document).ready(function () {
            if (url.indexOf(queryParameter) > -1) {
                exportToCSV();
            }
        });
    }
}());

jQuery.fn.htmlTableToCSV = function () {
    var clean_text = function (text) {
        text = text.replace(/"/g, '""');
        return '"' + text + '"';
    };
    $(this).each(function () {
        var table = $(this);
        var caption = $(this).find('caption').text();
        var title = [];
        var rows = [];

        $(this).find('tr').each(function () {
            var data = [];
            $(this).find('th').each(function () {
                var text = clean_text($(this).text());
                title.push(text);
            });
            $(this).find('td').each(function () {
                var text = clean_text($(this).text());
                data.push(text);
            });
            data = data.join(",");
            rows.push(data);
        });
        title = title.join(",");
        rows = rows.join("\n");

        var csv = title + rows;
        var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv);
        var download_link = document.createElement('a');
        download_link.href = uri;
        var ts = $('h1').html();
        if (caption == "") {
            download_link.download = ts + ".csv";
        } else {
            download_link.download = caption + "-" + ts + ".csv";
        }
        
        if (window.navigator.msSaveOrOpenBlob && window.Blob) {
            var blob = new Blob([csv], { type: "data:text/csv;charset=utf-8,%EF%BB%BF" });
            navigator.msSaveOrOpenBlob(blob, ts + ".csv");
        } else {
            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);
        }
    });
};
