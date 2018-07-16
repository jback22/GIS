
    $('#table1').bootstrapTable({
        url: "/VeriIslemleri.ashx?f=searchGetir",


        columns: [
            {
                field: 'KapiAdi',
                title: 'Kapı Adı'
            },
            {
                field: 'WKT',
                title: 'Kordinatlar'
            },
            {
                field: 'MahalleAdi',
                title: 'Mahalle Adı'
            }
        ]


    });



    $(document).ready(function () {
        $("#myInput").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#table1 tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });
$("#table1").on("click-row.bs.table", function (editable, columns, row) {
    console.log("columns:", columns);
    var wkt = 99;
    var url = "/JsPanelZoom.ashx?s=gonder&wkt=" + wkt;
    $.ajax({
        url: url, success: function (result) {
            alert(result);
        }
    });

});


