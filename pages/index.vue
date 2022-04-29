<template>
  <div>
    <!--ハンバーガーメニューのボタン-->
    <div class="hamburger-btn" @click="active = !active">
      <span class="line line-top" :class="{ 'rotate-top': active }"></span>
      <span
        class="line line-middle"
        :class="{ 'rotate-middle': active }"
      ></span>
      <span
        class="line line-bottom"
        :class="{ 'rotate-bottom': active }"
      ></span>
      <!--ハンバーガーメニューの中身-->
      <transition name="hamburger-menu">
        <div class="hamburger-menu" v-show="active">
          <ul>
            <li><NuxtLink to="/about">このサイトについて</NuxtLink></li>
          </ul>
        </div>
      </transition>
    </div>
    <div id="map"></div>
    <div id="title">大阪府感染防止認証ゴールドステッカーマップ</div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
export default {
  layout: 'index',
  data() {
    return {
      access_token: process.env.TOKEN,
      map: {},
      active: false,
    }
  },
  mounted() {
    this.setUp()
  },
  methods: {
    setUp() {
      this.getLngLat()
    },
    getLngLat() {
      var vue = this
      // 初期値は大阪府庁
      var lat = 34.6851596
      var lng = 135.5182102
      navigator.geolocation.getCurrentPosition(
        function (position) {
          lng = position.coords.longitude
          lat = position.coords.latitude
          vue.createMap([lng, lat])
        },
        function (error) {
          vue.createMap([lng, lat])
        }
      )
    },
    createMap(center) {
      mapboxgl.accessToken = this.access_token
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/code4osaka/ckm3bbsyd0dqp17tgsq4mpbb1',
        zoom: 15,
        center: center,
      })
      this.getData(this.map, center)
    },
    getData(map, center) {
      var endpoint = '/api?lat=' + center[1] + '&lng=' + center[0]
      const response = this.$axios
        .$get(endpoint)
        .then((response) => {
          // console.log("response data", response);
          this.setMap(map, center, response)
        })
        .catch((error) => {
          console.log('response error', error)
        })
    },
    setMap(map, center, data) {
      var nav = new mapboxgl.NavigationControl()
      map.addControl(nav, 'top-left')
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: false },
          trackUserLocation: true,
          showUserLocation: true,
        })
      )
      map.on('load', () => {
        map.addSource('places', {
          type: 'geojson',
          data: data,
        })
        map.addLayer({
          id: 'places',
          type: 'symbol',
          source: 'places',
          layout: {
            'icon-image': 'restaurant',
            'icon-allow-overlap': true,
          },
        })
        new mapboxgl.Marker().setLngLat(center).addTo(map)
        map.on('click', 'places', function (e) {
          var coordinates = e.features[0].geometry.coordinates.slice()
          var html = e.features[0].properties.html
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
          }
          new mapboxgl.Popup().setLngLat(coordinates).setHTML(html).addTo(this)
        })
        map.on('mouseenter', 'places', function (e) {
          this.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'places', function (e) {
          this.getCanvas().style.cursor = ''
        })
        map.on('moveend', () => {
          this.resetMap(this.map)
        })
      })
    },
    resetMap(map) {
      var center = map.getCenter()
      var endpoint = '/api?lat=' + center.lat + '&lng=' + center.lng
      const response = this.$axios
        .$get(endpoint)
        .then((response) => {
          // console.log("response data", response);
          map.removeLayer('places')
          map.removeSource('places')
          map.addSource('places', {
            type: 'geojson',
            data: response,
          })
          map.addLayer({
            id: 'places',
            type: 'symbol',
            source: 'places',
            layout: {
              'icon-image': 'restaurant',
              'icon-allow-overlap': true,
            },
          })
        })
        .catch((error) => {
          console.log('response error', error)
        })
    },
  },
}
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.store {
  word-break: break-all;
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  background-color: #e7ebb3;
  padding: 3px 10px 3px 10px;
  margin: 3px 0px 3px 0px;
  border-radius: 5px;
}
.store_name {
  font-weight: 600;
  border-bottom: solid 1px black;
}
.store_form {
  text-align: right;
}
.mapboxgl-popup-content {
  min-height: 50px;
  max-height: 400px;
  min-width: 100px;
  max-width: 500px;
  overflow-y: scroll;
  border-radius: 10px;
}
#title {
  font: 12px/24px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-weight: 600;
  position: absolute;
  top: 10px;
  left: 60px;
  padding: 1px 10px 2px 10px;
  z-index: 1;
  border-radius: 20px;
  border: 1px solid #00008e;
  border-width: 3px;
  max-width: 80%;
  color: #00008e;
  background-color: white;
}
/* ハンバーガーメニューのボタンのcss */
.hamburger-btn {
  position: absolute;
  top: 45px;
  right: 10px;
  width: 29px;
  height: 29px;
  cursor: pointer;
  border-radius: 2px;
  z-index: 1;
  opacity: 0.8;
  background-color: white;
}
.line {
  position: absolute;
  top: 0;
  right: 4px;
  width: 21px;
  height: 2px;
  background: #333333;
  text-align: center;
}
.line-top {
  top: 8px;
  transition: 0.4s ease;
}
.line-middle {
  top: 14px;
  transition: 0.4s ease;
}
.line-bottom {
  top: 20px;
  transition: 0.4s ease;
}
.rotate-top {
  transform: translateY(2px) rotate(-45deg);
  transition: 0.4s ease;
}
.rotate-middle {
  transition: 0.4s ease;
  opacity: 0;
}
.rotate-bottom {
  transform: translateY(-10px) rotate(45deg);
  transition: 0.4s ease;
}

/* ハンバーガーメニューの中身のcss */
.hamburger-menu-enter-active,
.hamburger-menu-leave-active {
  opacity: 0.4;
}
.hamburger-menu-enter,
.hamburger-menu-leave-to {
  opacity: 0;
}
.hamburger-menu-leave,
.hamburger-menu-enter-to {
  opacity: 1;
}
.hamburger-menu {
  background-color: rgba(197, 197, 197, 0.671);
  z-index: 30;
  padding: 2rem 1rem;
  position: fixed;
  width: 200px;
  height: 80rem;
  top: 0;
  right: 0;
}
ul {
  padding: 0;
  padding-top: 40px;
}
li {
  padding: 20px 0;
  list-style: none;
  line-height: 1;
  color: rgb(66, 66, 66);
  text-decoration: none;
  font-size: 25px;
  margin: 0 2vw;
  padding-bottom: 8px;
}
</style>
