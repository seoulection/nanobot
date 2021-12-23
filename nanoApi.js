require('dotenv').config();
const axios = require('axios');

const API_URL = `http://${process.env.NANOLEAF_IP_ADDRESS}/api/v1/${process.env.NANOLEAF_AUTH_TOKEN}`;

function getEffectsList() {
  return axios.get(`${API_URL}/effects/effectsList`)
    .then(res => res.data)
    .catch(err => console.error(err.message));
}

function getRandomEffect() {
  return axios.get(`${API_URL}/effects/effectsList`)
    .then(res => res.data[Math.floor(Math.random() * res.data.length)])
    .catch(err => console.error(err.message));
}

function getSelectedEffect() {
  return axios.get(`${API_URL}/effects/select`)
    .then(res => res.data)
    .catch(err => console.error(err.message));
}

function setEffect(effect) {
  return axios.put(`${API_URL}/effects`, {
    select: effect
  })
    .then(res => true)
    .catch(err => false);
}

exports.getEffectsList = getEffectsList;
exports.getRandomEffect = getRandomEffect;
exports.getSelectedEffect = getSelectedEffect;
exports.setEffect = setEffect;
