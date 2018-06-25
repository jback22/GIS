var cizimTuru;
var array = [];
var x = 0;
var aerial = new ol.layer.Tile({//---> aerialwithlabels ı tanımladım
    source: new ol.source.BingMaps({
        key: 'AkuvKcbQpvjRGn6tPbthdoWItjm9iKzcQ7nHZgDHmU6uzm-OCYXmoKrn8KHRWMVm',
        imagerySet: 'AerialWithLabels'
    })
});

//var feature = format.readFeature(myWKTCoordinates, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
    source: source,

    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
    }),
    stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
    }),
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: '#ffcc33'
        })
    })
});

var turkiye = ol.proj.fromLonLat([34.8486, 39.1505]); //turkiye lon lat kordinatları
var map = new ol.Map({//----> map kısmı haritayı çizdirmemizi sağlıyor
    layers: [aerial, vector],//--> layers haritanın katmanlarını yani aerial= aerial with labels ile çiziyor, vector=çizdiğimiz kapı ve mahalleleri çiziyor.
    target: 'map',
    view: new ol.View({
        center: turkiye,//-- harita ilk açıldığında nereyi göstereceğini ve zoom seviyesini belirtiyoruz.
        zoom: 7
    })
});

var modify = new ol.interaction.Modify({ source: source });//
map.addInteraction(modify);
var draw, snap; // global so we can remove them later
var typeSelect = document.getElementById('type');
var myWKTCoordinates;
var coordinatesFromFeature;
var format = new ol.format.WKT();
function addInteractions() {
    var value = typeSelect.value;

    if (value !== 'None') {
        draw = new ol.interaction.Draw({

            source: source,
            type: typeSelect.value
        });
        draw.on('drawend', function (e) {


            cizimTuru = $('#type').val();
            coordinatesFromFeature = e.feature.getGeometry().getCoordinates();
            myWKTCoordinates = format.writeGeometry(e.feature.getGeometry());


            if (cizimTuru == 'Point') {
                //KAPI KODLARI
                element = popup.getElement();
                popup.setPosition(coordinatesFromFeature);
                $(element).popover('destroy');

                $(element).popover({
                    placement: top,
                    animation: true,
                    html: true,
                    draggable: true,
                    'content': '<h4> Kayıt ekranına hoşgeldiniz! </h4> <form name="form" action="index.asp" method="post">' +
                        '<p><b>Kapı Adı Giriniz: <input type="text" size="20"></p> <p><b>Kapı No Giriniz: </b>' +
                        ' <input type="text" size="20"></p> <p><button type="button"> KAYDET </button>' +
                        '&emsp;&emsp;&emsp;&emsp;&emsp;<button type="button" onclick="popup.setPosition(undefined);">IPTAL</button></p></form>'
                });
                $(element).popover('show');
                //jquery ile popup ı buraya oluşturcaz

                console.log(coordinatesFromFeature);
            }
            else if (cizimTuru == 'Polygon') {
                //MAHALLE KODLARI
                //jquery ile popup ı buraya oluşturcaz

                element = popup.getElement();
                popup.setPosition(coordinate);
                $(element).popover('destroy');

                $(element).popover({
                    placement: top,
                    animation: false,
                    html: true,
                    'content': '<h4> Kayıt sayfasına hoşgeldiniz! </h4> <form name="form" action="index.asp" method="post">' +
                        '<p><b>Mahalle Adı Giriniz: <input id="txtMahalleAdi" type="text" size="20"></p>' +
                        ' <p><b>Mahalle Id giriniz: <input id="txtMahalleNo" type="text" size="20"></p> <p><button id="btnSaave" type="button"> KAYDET </button>' +
                        '&emsp;&emsp;&emsp;&emsp;&emsp;<button type="button" ' +
                        ' onclick="popup.setPosition(undefined);">IPTAL</button></p></form>'

                });
                $(element).popover('show');

                console.log(myWKTCoordinates);
            }

        });//drawend sonu...

        map.addInteraction(draw);
        snap = new ol.interaction.Snap({ source: source });
        map.addInteraction(snap);
    }//if None ın sonu...

}//function add interactions sonu...


/**
 * Handle change event.
 */
typeSelect.onchange = function () {//type i değiştirince işe yarıyor eskileri siliyor.
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
    $(element).popover('destroy');
};

addInteractions();

// Popup showing the position the user clicked
var popup = new ol.Overlay({
    element: document.getElementById('popup')
});
map.addOverlay(popup);
var element = popup.getElement();
var coordinate;
var hdms;

map.on('click', function (evt) {
    if (cizimTuru == 'Point') {

        element = popup.getElement();
        coordinate = evt.coordinate;
        hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));





    }
    if (cizimTuru == 'Polygon') {
        element = popup.getElement();
        coordinate = evt.coordinate;
        hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));

    }
});




iptalBtn.onclick = function () {
    popup.setPosition(undefined);
    iptalBtn.blur();
    array = [];
    x = 0;
    return false;

};
yazdırBtn.onclick = function () {
    var yazdirDiv = document.getElementById('yazdirDiv');
    yazdirDiv.innerHTML = '<p>Koordinatlar: <code>' + myWKTCoordinates + '</code></p>'
    console.log(yazdirDiv);
};
var mahalleAdi,mahalleNo;
/*
    $(document).ready(function () {
    $('#btnSave').click(function () {
        mahalleAdi = $('#<%=txtMahalleAdi.ClientID %>').val();
        mahalleNo = $('#<%=txtMahalleNo.ClientID %>').val();

    });
    // burada jquery ajax kullanarak call server side function yapıyoruz.
    $.ajax({
        url: "Default.aspx/",
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            "mahalleAdi": mahalleAdi,
            "mahalleNo": mahalleNo
        }),
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        }
    }).done(function () {
        alert("Başarılı gardaş!!");
    });
});
 */