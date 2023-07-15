const API_KEY = "RGAPI-87f2ece5-1fcf-400b-8c97-67f3e60a760c";
const goToPage1Button = document.getElementById("goToPage1Button");
const goToPage2Button = document.getElementById("goToPage2Button");
const goToPage3Button = document.getElementById("goToPage3Button");
const goToPage4Button = document.getElementById("goToPage4Button");
//add button location after user clicks
goToPage1Button.addEventListener("click", function () {
  window.location.href = "index.html";
});

goToPage2Button.addEventListener("click", function () {
  window.location.href = "home.html";
});

goToPage3Button.addEventListener("click", function () {
  window.location.href = "https://fizzymo.github.io/Responsive-Portfolio/";
});

goToPage4Button.addEventListener("click", function () {
    window.location.href = "about.html";
  });
//grab all regions for league of legends server

const Regions = [
    'na1.api.riotgames.com',
    'euw1.api.riotgames.com',
    'eun1.api.riotgames.com',
    'br1.api.riotgames.com',
    'jp1.api.riotgames.com',
    'kr.api.riotgames.com',
    'la1.api.riotgames.com',
    'la2.api.riotgames.com',
    'oc1.api.riotgames.com',
    'tr1.api.riotgames.com',
    'ru.api.riotgames.com',
    'ph2.api.riotgames.com',
    'sg2.api.riotgames.com',
    'th2.api.riotgames.com',
    'tw2.api.riotgames.com',
    'vn2.api.riotgames.com'
  ];
  
  //grab summoner information name, level, icon
  async function getSummonerData(summonerName) {
    const regionDropdown = document.getElementById("regionDropdown");
    const selectedRegion = regionDropdown.value;
  
    const summonerUrl = `https://${selectedRegion}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
      summonerName
    )}?api_key=${API_KEY}`;
  
    try {
      const response = await fetch(summonerUrl);
  
      if (!response.ok) {
        throw new Error("Failed to fetch summoner data");
      }
  
      const summonerData = await response.json();
  
      const summonerNameElement = document.getElementById("summonerName");
      summonerNameElement.textContent = `Summoner Name: ${summonerData.name}`;
  
      const summonerLevelElement = document.getElementById("summonerLevel");
      summonerLevelElement.textContent = `Summoner Level: ${summonerData.summonerLevel}`;
  
      const summonerProfilePicElement = document.getElementById("summonerProfilePic");
      summonerProfilePicElement.innerHTML = `<img src="http://ddragon.leagueoflegends.com/cdn/13.13.1/img/profileicon/${summonerData.profileIconId}.png">`;
  
      const rankedData = await fetchRankedData(summonerData.id);
      displayRankedData(rankedData);
  
      const championMasteryData = await fetchChampionMastery(summonerData.id);
      displayChampionMastery(championMasteryData);
    } catch (error) {
      console.error(error);
    }
  }
  
  //insert function for choosing region 

  async function fetchRankedData(summonerId) {
    const regionDropdown = document.getElementById("regionDropdown");
    const selectedRegion = regionDropdown.value;
  
    const rankedUrl = `https://${selectedRegion}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;
  
    try {
      const response = await fetch(rankedUrl);
  
      if (!response.ok) {
        throw new Error("Failed to fetch ranked data");
      }
  
      const rankedData = await response.json();
      return rankedData;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  //display rank ratio
  function displayRankedData(rankedData) {
    const rankedWinsElement = document.getElementById("rankedWins");
    const rankedLossesElement = document.getElementById("rankedLosses");
    const rankedWinRatioElement = document.getElementById("rankedWinRatio");
  
    if (rankedData.length > 0) {
      const rankedStats = rankedData[0];
      rankedWinsElement.textContent = `Ranked Wins: ${rankedStats.wins}`;
      rankedLossesElement.textContent = `Ranked Losses: ${rankedStats.losses}`;
  
      const winRatio = (rankedStats.wins / (rankedStats.wins + rankedStats.losses)) * 100;
      rankedWinRatioElement.textContent = `Win Ratio: ${winRatio.toFixed(2)}%`;
    } else {
      rankedWinsElement.textContent = "No ranked data found";
      rankedLossesElement.textContent = "";
      rankedWinRatioElement.textContent = "";
    }
  }
  
  //display champion mastery
  async function fetchChampionMastery(summonerId) {
    const regionDropdown = document.getElementById("regionDropdown");
    const selectedRegion = regionDropdown.value;
  
    const championMasteryUrl = `https://${selectedRegion}/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?api_key=${API_KEY}`;
  
    try {
      const response = await fetch(championMasteryUrl);
  
      if (!response.ok) {
        throw new Error("Failed to fetch champion mastery data");
      }
  
      const championMasteryData = await response.json();
      return championMasteryData;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  async function displayChampionMastery(championMasteryData) {
    const championMasteryListElement = document.getElementById("championMasteryList");
    championMasteryListElement.innerHTML = "";
  
    if (championMasteryData.length > 0) {
      const top5ChampionMasteryData = championMasteryData.slice(0, 5);
  
      for (const mastery of top5ChampionMasteryData) {
        const championName = await getChampionName(mastery.championId);
        const championImage = await getChampionImage(mastery.championId);
        
        const championMasteryElement = document.createElement("div");
        championMasteryElement.innerHTML = `
          <img src="${championImage}" alt="${championName} Image">
          <div>Champion: ${championName}, Level: ${mastery.championLevel}</div>
        `;
        championMasteryListElement.appendChild(championMasteryElement);
      }
    } else {
      championMasteryListElement.textContent = "No champion mastery data found";
    }
  }
  
  //grab mastery chamption name and icon
  async function getChampionName(championId) {
    const championsUrl = "https://ddragon.leagueoflegends.com/cdn/13.13.1/data/en_US/champion.json";
    const response = await fetch(championsUrl);
    const championsData = await response.json();
    const championKey = Object.keys(championsData.data).find(
      (key) => championsData.data[key].key === championId.toString()
    );
    return championsData.data[championKey].name;
  }
  
  async function getChampionImage(championId) {
    const championsUrl = "https://ddragon.leagueoflegends.com/cdn/13.13.1/data/en_US/champion.json";
    const response = await fetch(championsUrl);
    const championsData = await response.json();
    const championKey = Object.keys(championsData.data).find(
      (key) => championsData.data[key].key === championId.toString()
    );
    const championImage = championsData.data[championKey].image.full;
    return `https://ddragon.leagueoflegends.com/cdn/13.13.1/img/champion/${championImage}`;
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const fetchButton = document.getElementById("fetchButton");
    fetchButton.addEventListener("click", function () {
      const summonerInput = document.getElementById("summonerInput");
      const summonerName = summonerInput.value.trim();
    
      if (summonerName !== "") {
        getSummonerData(summonerName);
        
      }
    });
  });