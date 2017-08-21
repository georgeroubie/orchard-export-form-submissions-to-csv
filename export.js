(function () {
    var url = window.location.href.toString().toLowerCase();
    var queryParameter = '?pagesize=0&page=1';
    
    if (url.indexOf('submissionadmin') > -1) {
        $('<a/>', {
            id: 'export_form',
            class: 'button',
            css: {
                'margin-bottom': '10px',
                'float': 'right'
            },
            text: 'Export to CSV',
            href: '#'
        }).insertAfter('fieldset.bulk-actions');
        
        $('#export_form').on('click', function () {
            if (url.indexOf(queryParameter) > -1) {
                location.replace(url);
            } else {
                location.replace(queryParameter);
            }    
        });

        $(document).ready(function () {
            if (url.indexOf(queryParameter) > -1) {
                var table = $('table.dynamic-forms-submissions').clone(true);
                table.find('thead > tr > th:first-child').remove();
                table.find('thead > tr > th:last-child').remove();
                table.find('tbody > tr > td:first-child').remove();
                table.find('tbody > tr > td:last-child').remove();
                table.htmlTableToCSV();
            }
        });
    }
} ());

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
        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        var download_link = document.createElement('a');
        download_link.href = uri;
        var ts = $('h1').html();
        if (caption == "") {
            download_link.download = ts + ".csv";
        } else {
            download_link.download = caption + "-" + ts + ".csv";
        }
        
        if (window.navigator.msSaveOrOpenBlob && window.Blob) {
            var blob = new Blob([csv], { type: "data:text/csv;charset=utf-8" });
            navigator.msSaveOrOpenBlob(blob, ts + ".csv");
        } else {
            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);
        }
    });
};
