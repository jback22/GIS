﻿<!DOCTYPE html>
<html>
<head>
    <title>BasarSoft Proje</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v4.6.5/css/ol.css" type="text/css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://openlayers.org/en/v4.6.5/build/ol.js"></script>
    <script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
    <script src="https://cdn.rawgit.com/vast-engineering/jquery-popup-overlay/1.7.13/jquery.popupoverlay.js"></script>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.12.1/bootstrap-table.min.css">
    <!-- Latest compiled and minified JavaScript -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.12.1/bootstrap-table.min.js"></script>
    <!-- Latest compiled and minified Locales -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.12.1/locale/bootstrap-table-zh-CN.min.js"></script>   
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
 
    
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div style="margin-top: -10px" id="header">
        <h4>“Hep denedin. Hep yenildin. Olsun. Yine dene. Yine yenil. Daha iyi yenil.” Samuel Beckett</h4>
        <form id="form1">
            <label id="label">Çizim Türü &nbsp;</label>
            <select id="type">
                <option value="None">Gezinti</option>
                <option value="Point">Kapı</option>
                <option value="Polygon">Mahalle</option>
            </select>
            <input type="button" value="İptal" id="iptalBtn" class="btn btn-primary" />
            <input type="button" value="YAZDIR" id="yazdirBtn" class="btn btn-primary" />
            
            <input type="button" name="name" value="Arama"class="btn btn-primary" data-toggle="modal" data-target="#myModal" />            
            <div id="popup" title="Kayıt Sayfası"></div>
        </form>
    </div>
    










<div style="width: 100%; height: 600px" id="map" class="map"></div>
<script src="DefaultunScripti.js"> </script> <%--//--------Kodun script kısmının hepsi burada------------SCRİPT--------------------SCRİPT-----------------------------
        --%>
    
    <div class="container">

    <!-- The Modal -->
    <div class="modal" id="myModal">
        <div class="modal-dialog">
            <div class="modal-content">
      
                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">Arama Sayfası</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
        
                <!-- Modal body -->
                <div class="modal-body">
                    <div id="AramaVeZoom">
                <p>Birşeyler yazarak arama yapabilirsiniz.:</p>
                <input class="form-control" id="myInput" type="text" placeholder="Arama..">
                <br>
                <table id="table1" class="table table-bordered table-striped"></table>
                <script>
       
                    function bsTable() {
                        $('#table1').bootstrapTable({
                            url: "/VeriIslemleri.ashx?f=kapilariGetir",
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
                    }
                    kapilarigetirme();
                    bsTable();
                </script>

                <script>
                        
                    
        $(document).ready(function () {
            $("#myInput").on("keyup", function () {
                var value = $(this).val().toLowerCase();
                $("#table1 tr").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                });
            });
        });
        $("#table1").on("click-row.bs.table", function (editable, columns, row) {
            console.log("columns:", columns);

            var wktString = columns.WKT;
            var coordFinder = /\(\s?(\S+)\s+(\S+)\s?\)/g;
            var allMatches = coordFinder.exec(wktString);
            var lon = parseFloat(allMatches[1]);
            var lat = parseFloat(allMatches[2]);


            var coords = ol.proj.fromLonLat([lon, lat]);
            map.getView().animate({ center: coords, zoom: 9 });




        });



        </script>
            </div>
                </div>
        
                <!-- Modal footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
        
            </div>
        </div>
    </div>
  
</div>
  
    

    <div id="yazdirDiv">
        <p>Koordinatlar</p>
    </div>
</body>
</html>
