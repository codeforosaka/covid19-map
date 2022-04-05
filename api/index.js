const express = require("express");
const app = express();

const fs = require("fs");
var json = JSON.parse(fs.readFileSync("./data/data.json", "utf8"));

app.get("/", (req, res) => {
  console.log("lat: " + req.query.lat);
  console.log("lng: " + req.query.lng);
  geoJson = {
    type: "FeatureCollection",
    features: []
  };
  json.features.forEach(obj => {
    dis = distance(
      req.query.lat,
      req.query.lng,
      obj.geometry.coordinates[1],
      obj.geometry.coordinates[0]
    );
    if (dis < 1) {
      let flg = false;
      let geo = {};
      geo.type = "Feature";
      let places = [];
      const name = obj.properties.name;
      const address = obj.properties.address;
      const type = obj.properties.type;
      const hp = obj.properties.hp;

      let html = '<div class="store">';
      html += '<div class="store_name">';
      if (hp != "") {
        html += '<a href="' + hp + '" target="_blank">' + name + "</a>";
      } else {
        html += name;
      }
      html += "</div>";
      html += '<div class="store_type">（' + type + "）</div>";
      html += '<div class="store_address">' + address + "</div>";
      form =
        "https://docs.google.com/forms/d/e/1FAIpQLScPwznCAzo4m_zPhH0BnImMWZCTIc9CTpt3sUVV6RqG4BXUFw/viewform?usp=pp_url";
      form += "&entry.1434788808=" + name;
      form += "&entry.1439544210=" + name;
      form += "&entry.1847664388=" + address;
      form += "&entry.1110425882=" + address;
      if (hp != "") {
        form += "&entry.527502142=" + hp;
        form += "&entry.835276458=" + hp;
      }
      html +=
        '<div class="store_form"><a href="' +
        form +
        '" target="_blank">店舗情報変更依頼</a></div>';
      html += "</div>";

      geoJson.features.forEach(obj1 => {
        if (
          obj1.geometry.coordinates[0] === obj.geometry.coordinates[0] &&
          obj1.geometry.coordinates[1] === obj.geometry.coordinates[1]
        ) {
          obj1.properties.html += html;
          flg = true;
        }
      });
      if (!flg) {
        geo.geometry = obj.geometry;
        places.push(obj.properties);
        geo.properties = {};
        geo.properties.html = html;
        geoJson.features.push(geo);
      }
    }
  });
  console.log("cnt: " + geoJson.features.length);
  res.json(geoJson);
});
function distance(lat1, lng1, lat2, lng2) {
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  return (
    6371 *
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2)
    )
  );
}
module.exports = {
  path: "/api",
  handler: app
};
