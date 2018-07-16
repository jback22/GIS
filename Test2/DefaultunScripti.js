
var wkt;
var cizimTuru;
var array = [];
var x = 0;
var vectorMahalle = null;
var mahalleAdi1 = null;
var draw;
var featureID = 0;
var singleClick;
var selectedFeatureID;
var mahalleLength;

var aerial = new ol.layer.Tile({//---> aerialwithlabels ı tanımladım
    source: new ol.source.BingMaps({
        key: 'AkuvKcbQpvjRGn6tPbthdoWItjm9iKzcQ7nHZgDHmU6uzm-OCYXmoKrn8KHRWMVm',
        imagerySet: 'AerialWithLabels'
    })
});

//var feature = format.readFeature(selFeatureWkt, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
    source: source,
    //features: [feature]
   
});
var vectorBilgiAl = new ol.layer.Vector({
    title: 'Bilgi Al',
    source: new ol.source.Vector({}),
    wrapX: false
});



var turkiye = ol.proj.fromLonLat([34.8486, 39.1505]); //turkiye lon lat kordinatları
var map = new ol.Map({//----> map kısmı haritayı çizdirmemizi sağlıyor
    layers: [aerial, vector,vectorBilgiAl]
    ,//--> layers haritanın katmanlarını yani aerial= aerial with labels ile çiziyor, vector=çizdiğimiz kapı ve mahalleleri çiziyor.
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
var selFeatureWkt;
var coordinatesFromFeature;
var format = new ol.format.WKT();
kapilarigetirme();
mahallelerigetirme();
kordinatalma();
function addInteractions() {
    var value = typeSelect.value;
                                                kordinatalma();

    if (value !== 'None') {
        draw = new ol.interaction.Draw({

            source: source,
            type: typeSelect.value
        });
        
        draw.on('drawend', function (e) {
            featureID = featureID + 1;
            e.feature.setProperties({
                'id': mahalleLength
            });


            cizimTuru = $('#type').val();
            
            var format = new ol.format.WKT();
            var selFeatureWkt = format.writeGeometry(e.feature.getGeometry(), {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });


            if (cizimTuru == 'Point') {
                //KAPI KODLARI
                coordinatesFromFeature = e.feature.getGeometry().getCoordinates();
                element = popup.getElement();
                popup.setPosition(coordinatesFromFeature);
                //$(element).popover('destroy');

                var tiklanilanNoktaVerileri = [];// aşağıdaki blokta mahalle ve kapı kesişiyor mu diye bakıyorum.
                vector.getSource().getFeatures().forEach(function (obje) {

                        var objeExtend = obje.getGeometry().getExtent();

                        var sonuc = ol.extent.intersects(objeExtend, e.feature.getGeometry().getExtent());
                        if (sonuc) {
                            tiklanilanNoktaVerileri.push(obje.get('MahalleAdi') /*+ obje.get('Id')*/);


                        }
                    }
                );
                vectorMahalle.getSource().getFeatures().forEach(function (obje) {

                        var objeExtend = obje.getGeometry().getExtent();

                        var sonuc = ol.extent.intersects(objeExtend, e.feature.getGeometry().getExtent());
                        if (sonuc) {
                            tiklanilanNoktaVerileri.push(obje.get('MahalleAdi') /*+ obje.get('Id')*/);
                            mahalleAdi1 = obje.get('MahalleAdi');
                        }
                    }
                );

                if (tiklanilanNoktaVerileri.length > 0 && mahalleAdi1 !=null) {

                    alert('Tıklanılan Nokta Verileri : ' + tiklanilanNoktaVerileri);
                    $(element).popover({// popup ın içeriği.
                        placement: top,
                        animation: true,
                        html: true,
                        draggable: true,

                        'content': '<h4> Kayıt ekranına hoşgeldiniz! </h4>' +
                            ' <form name="form" action="index.asp" method="post">' +
                            //'<p text="asad"><b>Mahalle Adı: </p>' +
                            ' <p><b>Kapı Adı Giriniz: <input id="txtKapiAdi" type="text" size="20"></p>' +
                            ' <p><button id="btnSave1" type="button"> KAYDET </button>' +
                            '    <button id="iptalBtn1" type="button" onclick="popup.setPosition(undefined);">IPTAL</button>' +
                            ' </p>' +
                            ' </form>'
                    });
                    $(element).popover('show');

                    var iptal1 = document.getElementById("iptalBtn1");                   
                    iptal1.addEventListener("click", function () {
                        selectedFeatureID = mahalleLength;
                        var features = vector.getSource().getFeatures();
                        if (features != null && features.length > 0) {
                            for (x in features) {
                                var properties = features[x].getProperties();
                                console.log(properties);
                                var id = properties.id;
                                if (id == selectedFeatureID) {
                                    vector.getSource().removeFeature(features[x]);
                                    break;
                                }
                            }
                        }

                    });
                    var kaydet2 = document.getElementById("btnSave1");////burası kapı popup ı içindeki kaydet butonu, verileri veritabanına kaydediyor.
                    kaydet2.addEventListener("click",
                        function () {
                            var kapiNamesi = document.getElementById("txtKapiAdi").value;
                            var url = "/VeriIslemleri.ashx?f=kapiekle&kapiAdi=" +
                                kapiNamesi +
                                "&WKT=" +
                                selFeatureWkt +
                                "&mahalleAdi2=" +
                                mahalleAdi1;
                            $.ajax({
                                url: url,
                                success: function (result) {
                                    alert(result);
                                }
                            });
                            alert(selFeatureWkt);

                            popup.setPosition(undefined);
                            
                        });
                    
                }
                else {
                    alert('Tıklanılan noktada mahalle verisi bulunamadı !');
                    mahalleAdi1 = null;
                    popup.setPosition(undefined);
                    console.log(mahalleAdi1);
                    

                }
                vectorBilgiAl.getSource().clear();



                //if (tiklanilanNoktaVerileri.length > 0 && mahalleAdi1 !=null) {// buradaki amacım; eğer mahalle yoksa popup açma, mahalle varsa aç.

                    
                    
                //}

                

                //jquery ile popup ı buraya oluşturcaz

                //console.log(coordinatesFromFeature);
            }//-------------POİNT SONU

            else if (cizimTuru == 'Polygon') {
                //MAHALLE KODLARI
                //jquery ile popup ı buraya oluşturcaz
                coordinate = e.feature.getGeometry().getCoordinates()[0][0];
                coordinatesFromFeature = e.feature.getGeometry().getCoordinates();
                element = popup.getElement();
                
                $(element).popover('destroy');
                popup.setPosition(coordinate);
                

                $(element).popover({// açılan popup ın içeriği.
                    placement: top,
                    animation: false,
                    html: true,
                    'content': '<h4> Kayıt sayfasına hoşgeldiniz! </h4>' +
                        ' <form name="form" action="index.asp" method="post">' +
                        ' <p><b>Mahalle Adı Giriniz: <input id="txtMahalleAdi" type="text" size="20"></p>' +                       
                        ' <p><button id="btnSave" type="button""> KAYDET </button>' +
                        '    <button id="iptalBtn2" type="button" onclick="popup.setPosition(undefined);">IPTAL</button>' +
                        ' </p>' +
                        ' </form>'

                });

                $(element).popover('show');

                var iptal2 = document.getElementById("iptalBtn2");
                iptal2.addEventListener("click", function () {
                    selectedFeatureID = mahalleLength;
                    var features = vector.getSource().getFeatures();
                    if (features != null && features.length > 0) {
                        for (x in features) {
                            var properties = features[x].getProperties();
                            console.log(properties);
                            var id = properties.id;
                            if (id == selectedFeatureID) {
                                vector.getSource().removeFeature(features[x]);
                                break;
                            }
                        }
                    }

                });

                var kaydet1 = document.getElementById("btnSave");//burası mahalle popup ı içindeki kaydet butonu, verileri veritabanına kaydediyor.
                kaydet1.addEventListener("click", function () {
                    var mahalleNamesi = document.getElementById("txtMahalleAdi").value;
                    var url = "/VeriIslemleri.ashx?f=mahalleekle&mahalleAdi=" + mahalleNamesi + "&WKT=" + selFeatureWkt;
                    $.ajax({
                        url: url, success: function (result) {
                            alert(result);
                        }
                    });
                    alert(selFeatureWkt);
                    
                    popup.setPosition(undefined);
                    vectorMahalle.getSource().clear();
                    kapilarigetirme();
                    mahallelerigetirme();
                })//--KAYDET1 EVENTLİSTENER SONU
                

               // console.log(selFeatureWkt);
                
            }//----------POLYGON SONU

        
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

function kordinatalma() {// burada mahalle popup ı için kullandığım setposition daki coordinate i almama yarıyor.Map e her tıkladığımda tıklanılan kordinatı tutuyor yani.
    map.on('click', function (evt) {
        if (cizimTuru == 'Point') {

            element = popup.getElement();
            
            //hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));





        }
        if (cizimTuru == 'Polygon') {
            element = popup.getElement();
            coordinate = evt.coordinate;
            hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));

        }
    });
}

function kapilarigetirme() {// burası veritabanında kayıtlı olan kapıları layer olarak mevcut haritaya ekliyor.
    var url = "/VeriIslemleri.ashx?f=kapilariGetir";
    var kapiDizi = [];
    var vectorKapi = null;
    var omerData1 = null;
    $.ajax({
        url: url,
        success: function (result) {
            var sonuc = JSON.parse(result);
            omerData1 = sonuc;
            var format = new ol.format.WKT();
            mahalleLength=sonuc.length
            var denemeFeature = null;
            for (var i = 0; i < sonuc.length; i++) {
                var feature = format.readFeature(sonuc[i].WKT, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                feature.set('KapiAdi', sonuc[i].KapiAdi);
                feature.set('KapiId', sonuc[i].Id);
                kapiDizi.push(feature);
                denemeFeature = feature;
            }
            vectorKapi = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: kapiDizi
                })
            });
            map.addLayer(vectorKapi);
        }
    });
}

function mahallelerigetirme() {// burası veritabanında kayıtlı olan mahalleleri layer olarak mevcut haritaya ekliyor.
    var url = "/VeriIslemleri.ashx?f=mahalleleriGetir";
    var mahalleDizi = [];
    
    var omerData = null;
    $.ajax({
        url: url,
        success: function (result) {
            var sonuc = JSON.parse(result);
            omerData = sonuc;
            var format = new ol.format.WKT();

            var denemeFeature = null;
            for (var i = 0; i < sonuc.length; i++) {
                var feature = format.readFeature(sonuc[i].WKT, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                feature.set('MahalleAdi', sonuc[i].MahalleAdi);
                feature.set('MahalleId', sonuc[i].Id);
                mahalleDizi.push(feature);
                denemeFeature = feature;
            }
            
                vectorMahalle = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: mahalleDizi
                    })
                });
                map.addLayer(vectorMahalle);
            
        }
    });
}




iptalBtn.onclick = function () {//Burası iptal butonuna basıldığında açık bir popup varsa onu kapatıyor .
    popup.setPosition(undefined);
    iptalBtn.blur();
    
   
    return false;

};
yazdirBtn.onclick = function () {// burası draw end den gelen koordinatları yazdırıyor sayfanın en altındaki kordinatlar div ine (fakat şuan gereksiz)
    var yazdirDiv = document.getElementById('yazdirDiv');
    yazdirDiv.innerHTML = '<p>Koordinatlar: <code>' + selFeatureWkt + '</code></p>'
    //console.log(yazdirDiv);
};

//aramaBtn.onclick = function () {
    

    
//}
function kapisilme() {
    
}


