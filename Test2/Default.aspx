<!DOCTYPE html>
<html>
  <head>
    <title>Draw and Modify Features</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v4.6.5/css/ol.css" type="text/css">
    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://openlayers.org/en/v4.6.5/build/ol.js"></script>
    <script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
    <script src="https://cdn.rawgit.com/vast-engineering/jquery-popup-overlay/1.7.13/jquery.popupoverlay.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="styles.css">
  </head>
  <body>        
   <div id="header">
        <form id="form1"  >
              <label id="label">Çizim Türü &nbsp;</label>
              <select id="type">
                <option value="None">Gezinti</option>
                <option value="Point">Kapı</option>
                <option value="Polygon">Mahalle</option>
        
              </select>
                    <input type="button" value="İptal" id="iptalBtn" />
                    <input type="button" value="YAZDIR" id="yazdırBtn" />
                    <div id="popup" title="Kayıt Sayfası"></div>
        </form>
   </div>
      <div  id="map" class="map"></div>
    <!-- Popup -->
    
    <script src="DefaultunScripti.js"> //---------------------------------------------------SCRİPT--------------------SCRİPT-----------------------------
        
    </script>
      <div id="yazdirDiv">
          <p>Koordinatlar</p>
      </div>
  </body>
</html>