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
      const hp = obj.properties.hp;
      let html = '<p class="longurl" break-all;">' + name + "<br>" + address;
      if (hp != "") {
        html += '<br>HP: <a href="' + hp + '" target="_blank">' + hp + "</a>";
      }
      html += "</p>";

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
