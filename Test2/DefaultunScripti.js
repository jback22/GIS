var wkt;
var drawingType;
var array = [];
var x = 0;
var vectorDistrict = null;
var districtName1 = null;
var draw;
var featureID = 0;
var singleClick;
var selectedFeatureID;
var districtLength;
var DistrictNum = null;
var DoorNum = null;
var coord;

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
var vectorGetInfo = new ol.layer.Vector({
    title: 'Get Info',
    source: new ol.source.Vector({}),
    wrapX: false
});



var turkiye = ol.proj.fromLonLat([34.8486, 39.1505]); //turkiye lon lat kordinatları
var map = new ol.Map({//----> map kısmı haritayı çizdirmemizi sağlıyor
    layers: [aerial, vector,vectorGetInfo]
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
bringdoors();
bringdistrcits();
//bringcoordinates();
function addInteractions() {
    var value = typeSelect.value;
                                                //bringcoordinates();

    if (value !== 'None') {
        draw = new ol.interaction.Draw({

            source: source,
            type: typeSelect.value
        });
        
        draw.on('drawend', function (e) {
            featureID = featureID + 1;
            e.feature.setProperties({
                'id': districtLength
            });


            drawingType = $('#type').val();
            
            var format = new ol.format.WKT();
            var selFeatureWkt = format.writeGeometry(e.feature.getGeometry(), {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });


            if (drawingType == 'Point') {
                //KAPI KODLARI
                coordinatesFromFeature = e.feature.getGeometry().getCoordinates();
                element = popup.getElement();
                popup.setPosition(coordinatesFromFeature);
                //$(element).popover('destroy');

                var datasOfClick = [];// aşağıdaki blokta mahalle ve kapı kesişiyor mu diye bakıyorum.
                vector.getSource().getFeatures().forEach(function (obje) {

                        var objeExtend = obje.getGeometry().getExtent();

                        var result = ol.extent.intersects(objeExtend, e.feature.getGeometry().getExtent());
                        if (result) {
                            datasOfClick.push(obje.get('DistrictName') /*+ obje.get('Id')*/);


                        }
                    }
                );
                vectorDistrict.getSource().getFeatures().forEach(function (obje) {

                        var objeExtend = obje.getGeometry().getExtent();

                        var sonuc = ol.extent.intersects(objeExtend, e.feature.getGeometry().getExtent());
                        if (sonuc) {
                            datasOfClick.push(obje.get('DistrictName') /*+ obje.get('Id')*/);
                            districtName1 = obje.get('DistrictName');
                        }
                    }
                );

                if (datasOfClick.length > 0 && districtName1 !=null) {

                    alert('Name of selected District : ' + datasOfClick);
                    $(element).popover({// popup ın içeriği.
                        placement: top,
                        animation: true,
                        html: true,
                        draggable: true,

                        'content': '<h4> Welcome to register page! </h4>' +
                            ' <form name="form" action="index.asp" method="post">' +
                            //'<p text="asad"><b>Mahalle Adı: </p>' +
                            ' <p><b>Enter a Door Name: <input id="txtDoorName" type="text" size="20"></p>' +
                            ' <p><button id="btnSave1" type="button"> KAYDET </button>' +
                            '    <button id="iptalBtn1" type="button" onclick="popup.setPosition(undefined);">IPTAL</button>' +
                            ' </p>' +
                            ' </form>'
                    });
                    $(element).popover('show');

                    var iptal1 = document.getElementById("iptalBtn1");                   
                    iptal1.addEventListener("click", function () {
                        selectedFeatureID = districtLength;// deleting code
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
                            var door_Name = document.getElementById("txtDoorName").value;
                            var url = "/VeriIslemleri.ashx?f=adddoor&doorName=" +
                                door_Name +
                                "&WKT=" +
                                selFeatureWkt +
                                "&districtName2=" +
                                districtName1;
                            $.ajax({
                                url: url,
                                success: function (result) {
                                    alert(result);
                                }
                            });
                            alert(selFeatureWkt);

                            popup.setPosition(undefined);
                            DoorNum++;
                            e.feature.setProperties({
                                'DoorNum': DoorNum
                            });
                            console.log(DoorNum);

                        });
                    
                }
                else {
                    alert('There is no District Data where you clicked !');
                    districtName1 = null;
                    popup.setPosition(undefined);
                    console.log(districtName1);
                    


                }
                vectorGetInfo.getSource().clear();



                //if (tiklanilanNoktaVerileri.length > 0 && districtName1 !=null) {// buradaki amacım; eğer mahalle yoksa popup açma, mahalle varsa aç.

                    
                    
                //}

                

                //jquery ile popup ı buraya oluşturcaz

                //console.log(coordinatesFromFeature);
            }//-------------POİNT SONU

            else if (drawingType == 'Polygon') {
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
                    'content': '<h4> Welcome to register page! </h4>' +
                        ' <form name="form" action="index.asp" method="post">' +
                        ' <p><b>Enter a District Name: <input id="txtDistrictName" type="text" size="20"></p>' +                       
                        ' <p><button id="btnSave" type="button""> KAYDET </button>' +
                        '    <button id="iptalBtn2" type="button" onclick="popup.setPosition(undefined);">IPTAL</button>' +
                        ' </p>' +
                        ' </form>'

                });

                $(element).popover('show');

                var iptal2 = document.getElementById("iptalBtn2");
                iptal2.addEventListener("click", function () {
                    selectedFeatureID = districtLength;
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
                    var district_Name = document.getElementById("txtDistrictName").value;
                    var url = "/VeriIslemleri.ashx?f=adddistrict&districtName=" + district_Name + "&WKT=" + selFeatureWkt;
                    $.ajax({
                        url: url, success: function (result) {
                            alert(result);
                        }
                    });
                    alert(selFeatureWkt);
                    
                    popup.setPosition(undefined);
                    vectorDistrict.getSource().clear();
                    bringdoors();
                    bringdistrcits();
                    DistrictNum++;
                    e.feature.setProperties({
                        'DistrictNum': DistrictNum
                    });
                    console.log(DistrictNum);
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

try {
    map.on('click', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
                return feature;
            });
        var datasOfClick1 = [];

        vectorDistrict.getSource().getFeatures().forEach(function (obje) {

                var objeExtend = obje.getGeometry().getExtent();



                datasOfClick1.push(obje.get('DistrictName') /*+ obje.get('Id')*/);
                districtName1 = obje.get('DistrictName');
                if (feature) {
                    console.log("calısıyor");
                    var geometry = feature.getGeometry();
                    coord = geometry.getCoordinates();
                    popup.setPosition(coord);
                    var name =
                        coord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
                    $(element).popover({
                        'placement': 'top',
                        'html': true,
                        'content': '<p>Location:</p>' + obje.get('DoorName')
                    });
                    $(element).popover('show');
                } else {
                    $(element).popover('destroy');
                }
            }
        );



    });
} catch (e) {

} 
function bringcoordinates() {// burada mahalle popup ı için kullandığım setposition daki coordinate i almama yarıyor.Map e her tıkladığımda tıklanılan kordinatı tutuyor yani.
    map.on('click', function (evt) {
                     
                element = popup.getElement();

                $(element).popover('destroy');
                popup.setPosition(coordinate);


                $(element).popover({// açılan popup ın içeriği.
                    placement: top,
                    animation: false,
                    html: true,
                    'content': '<p>Datas of your select:</p>' + districtName1+ '</br>'

                });
  
                $(element).popover('show');
            

        if (drawingType == 'Point') {

            element = popup.getElement();
            
            //hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));





        }
        if (drawingType == 'Polygon') {
            element = popup.getElement();
            
            hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));

        }
    });
}

function bringdoors() {// burası veritabanında kayıtlı olan kapıları layer olarak mevcut haritaya ekliyor.
    var url = "/VeriIslemleri.ashx?f=bringDoors";
    var doorArray = [];
    var vectorDoor = null;
    var omerData1 = null;
    $.ajax({
        url: url,
        success: function (result) {
            var result = JSON.parse(result);
            omerData1 = result;
            var format = new ol.format.WKT();
            districtLength = result.length;
            var denemeFeature = null;
            for (var i = 0; i < result.length; i++) {
                DoorNum++;
                var feature = format.readFeature(result[i].WKT, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                feature.set('DoorName', result[i].DoorName);
                feature.set('DoorId', result[i].Id);
                feature.set('DoorNum', result[i].DoorNum);
                doorArray.push(feature);
                denemeFeature = feature;
            }
            vectorDoor = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: doorArray
                })
            });
            map.addLayer(vectorDoor);
        }
    });
}

function bringdistrcits() {// burası veritabanında kayıtlı olan mahalleleri layer olarak mevcut haritaya ekliyor.
    var url = "/VeriIslemleri.ashx?f=bringDistricts";
    var districtArray = [];
    
    var omerData = null;
    $.ajax({
        url: url,
        success: function (result) {
            var result = JSON.parse(result);
            omerData = result;
            var format = new ol.format.WKT();

            var denemeFeature = null;
            for (var i = 0; i < result.length; i++) {
                DistrictNum++;
                var feature = format.readFeature(result[i].WKT, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                feature.set('DistrictName', result[i].DistrictName);
                feature.set('DistrictId', result[i].Id);
                feature.set('DistrictNum', result[i].DistrictNum);
                districtArray.push(feature);
                denemeFeature = feature;
            }
            
                vectorDistrict = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: districtArray
                    })
                });
                map.addLayer(vectorDistrict);
            
        }
    });
}




iptalBtn.onclick = function () {//Burası iptal butonuna basıldığında açık bir popup varsa onu kapatıyor .
    popup.setPosition(undefined);
    iptalBtn.blur();
    
   
    return false;

};

//aramaBtn.onclick = function () {
    

    
//}

