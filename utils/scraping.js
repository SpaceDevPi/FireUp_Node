const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');


async function getPriceFeed(){
    try {
        const siteUrl ="https://coinmarketcap.com/fr/"

        const { data } = await axios({
            method: 'GET',
            url: siteUrl,
        })

        const $ = cheerio.load(data)
        const elemSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr:nth-child(1)'
        
        $(elemSelector).each((parentIdx, parentElem) => {
            console.log(parentIdx)
            
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = getPriceFeed;

