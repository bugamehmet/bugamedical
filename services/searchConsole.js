// services/searchConsole.js
const { google } = require('googleapis');
const Token = require('../models/Token');
const oauth2Client = require('./googleAuth');

async function getSearchData(siteUrl, startDate, endDate) {
  const tokenDoc = await Token.findOne({});

  if (!tokenDoc) {
    throw new Error('Google token bulunamadı. Önce giriş yapmalısınız.');
  }

  oauth2Client.setCredentials({
    access_token: tokenDoc.access_token,
    refresh_token: tokenDoc.refresh_token,
    expiry_date: tokenDoc.expiry_date
  });

  const searchconsole = google.searchconsole({
    version: 'v1',
    auth: oauth2Client
  });

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query', 'page', 'country'],
      rowLimit: 100
    }
  });

  return response.data.rows || [];
}

module.exports = { getSearchData };