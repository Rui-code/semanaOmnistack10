const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index - lista, show - unico, store - insert, update, destroy - delete

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },
  
  async store(request, response) {
    const { github_usename, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_usename });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_usename}`);

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }

      dev = await Dev.create({
        github_usename,
        name,
        avatar_url,
        bio,
        tech: techsArray,
        location,
      });

      // Filtrar as conexões que estão a no máximo 10KM de distância
      // e que o novo dev tenha pelo menos uma das tecnologias filtradas

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }


    return response.json(dev);
  }
};