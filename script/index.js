import { promises as fs } from "fs";
import readline from "readline";

//Generate all JSON's of UF's
async function writeJsonOfUfWithCities(ufName, matchedCities) {
  await fs.writeFile(
    `data/${ufName}.json`,
    JSON.stringify(matchedCities, null, "\t")
  );
}

function mapParsedData(ufParsedData, cityParsedData) {
  ufParsedData.map(({ ID: ufId, Sigla: ufName }) => {
    const matchedCities = { Cities: [] };

    cityParsedData.map(({ Estado: cityUfId, Nome: cityName }) => {
      if (ufId === cityUfId) {
        matchedCities.Cities.push(cityName);
      }
    });
    writeJsonOfUfWithCities(ufName, matchedCities);
  });
}

async function catchInitialData() {
  const ufData = await fs.readFile("Estados.json");
  const ufParsedData = await JSON.parse(ufData);
  const cityData = await fs.readFile("Cidades.json");
  const cityParsedData = await JSON.parse(cityData);
  mapParsedData(ufParsedData, cityParsedData);
}
//End

//Search Funcs

async function catchAllUfNames() {
  const ufData = await fs.readFile("Estados.json");
  const ufParsedData = await JSON.parse(ufData);
  const allUfNames = [];
  ufParsedData.map(({ Sigla: ufName }) => {
    allUfNames.push(ufName);
  });
  return allUfNames;
}


async function readAndShowQuantityOfCities(UF) {
  const data = await fs.readFile(`data/${UF}.json`);
  const parsedData = await JSON.parse(data);
  return parsedData.Cities.length;
}

async function top5UfCities(lessOrMore) {
  const allUfNames = await catchAllUfNames();

  const ufWithCitiesLength = [];

  for (const ufName of allUfNames) {
    const ufCitiesLength = await readAndShowQuantityOfCities(ufName);
    ufWithCitiesLength.push({ Uf: ufName, Length: ufCitiesLength });
  }

  const arrayWithResults = [];

  switch (lessOrMore) {
    case "more":
      ufWithCitiesLength.sort();
      ufWithCitiesLength.sort((a, b) => {
        return b.Length - a.Length;
      });
      for (let i = 0; i < 5; i++) {
        arrayWithResults.push({
          Uf: ufWithCitiesLength[i].Uf,
          Length: ufWithCitiesLength[i].Length,
        });
      }
      break;
    case "less":
      ufWithCitiesLength.sort();
      ufWithCitiesLength.sort((a, b) => {
        return a.Length - b.Length;
      });
      for (let i = 0; i < 5; i++) {
        arrayWithResults.push({
          Uf: ufWithCitiesLength[i].Uf,
          Length: ufWithCitiesLength[i].Length,
        });
      }
      break;
    default:
      console.log("Parâmetro incorreto!");
      break;
  }

  return arrayWithResults;
}

async function topCitiesNames(lessOrMore) {
  const allUfNames = await catchAllUfNames();

  const arrayWithResults = [];
  for (const ufName of allUfNames) {
    const data = await fs.readFile(`data/${ufName}.json`);
    const parsedData = await JSON.parse(data);

    switch (lessOrMore) {
      case "more":
        parsedData.Cities.sort();
        parsedData.Cities.sort((a, b) => {
          return b.length - a.length;
        });
        arrayWithResults.push({ Uf: ufName, City: parsedData.Cities[0] });
        break;
      case "less":
        parsedData.Cities.sort();
        parsedData.Cities.sort((a, b) => {
          return a.length - b.length;
        });
        arrayWithResults.push({ Uf: ufName, City: parsedData.Cities[0] });
        break;
      default:
        console.log("Parâmetro incorreto!");
    }
  }
  return arrayWithResults;
}

async function topCityName(lessOrMore) {
  let arrayWithResults = [];
  switch (lessOrMore) {
    case "more":
      const biggerNamesOfCities = await topCitiesNames("more");
      biggerNamesOfCities.sort();
      biggerNamesOfCities.sort((a, b) => {
        return b.City.length - a.City.length;
      });

      arrayWithResults.push({
        Uf: biggerNamesOfCities[0].Uf,
        City: biggerNamesOfCities[0].City,
      });
      break;
    case "less":
      const lesserNamesOfCities = await topCitiesNames("less");
      lesserNamesOfCities.sort();
      lesserNamesOfCities.sort((a, b) => {
        return a.City.length - b.City.length;
      });

      arrayWithResults.push({
        Uf: lesserNamesOfCities[4].Uf,
        City: lesserNamesOfCities[4].City,
      });
      break;
    default:
      console.log("Parâmetro incorreto!");
  }
  return arrayWithResults;
}

async function consolePlease() {
  const top5More = await top5UfCities("more");
  console.log(top5More);

  const top5Less = await top5UfCities("less");
  console.log(top5Less);

  const biggerNamesOfCities = await topCitiesNames("more");
  console.log(biggerNamesOfCities);

  const lesserNamesOfCities = await topCitiesNames("less");
  console.log(lesserNamesOfCities);

  const biggerCityName = await topCityName("more");
  console.log(biggerCityName);

  const lesserCityName = await topCityName("less");
  console.log(lesserCityName);
}

consolePlease();
